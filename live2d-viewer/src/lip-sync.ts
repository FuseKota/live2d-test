/**
 * LipSyncController - リップシンク（口パク）制御
 *
 * audioUrlがある場合: pixi-live2d-display-lipsyncpatch の speak() メソッドで音声同期
 * audioUrlがない場合: サイン波でシミュレーション
 */
import { ModelManager } from './model-manager';
import { sendEvent } from './bridge';

export class LipSyncController {
  private modelManager: ModelManager;
  private simulationTimer: number | null = null;
  private simulationFrame: number | null = null;
  private isActive: boolean = false;

  constructor(modelManager: ModelManager) {
    this.modelManager = modelManager;
  }

  /**
   * リップシンクを開始する
   * @param audioUrl 音声ファイルURL（省略時はシミュレーション）
   * @param duration シミュレーション時の口パク継続時間（秒）
   */
  async startLipSync(audioUrl?: string, duration?: number): Promise<void> {
    // 既にアクティブなら停止してからスタート
    this.stopLipSync();

    this.isActive = true;

    const model = this.modelManager.getModel();
    if (!model) {
      console.warn('LipSync: No model loaded');
      this.isActive = false;
      sendEvent({ type: 'LIP_SYNC_FINISHED' });
      return;
    }

    if (audioUrl) {
      // 音声ファイルがある場合: speak() メソッドを使用
      try {
        await model.speak(audioUrl, {
          onFinish: () => {
            this.isActive = false;
            sendEvent({ type: 'LIP_SYNC_FINISHED' });
          },
          onError: (err: Error) => {
            console.error('LipSync speak error:', err);
            this.isActive = false;
            sendEvent({ type: 'LIP_SYNC_FINISHED' });
          },
        });
      } catch (e) {
        console.error('LipSync: Failed to start speak:', e);
        this.isActive = false;
        sendEvent({ type: 'LIP_SYNC_FINISHED' });
      }
    } else {
      // 音声がない場合: サイン波でシミュレーション
      const lipSyncDuration = (duration || 10) * 1000; // ミリ秒に変換
      const startTime = performance.now();

      const animate = () => {
        if (!this.isActive) return;

        const model = this.modelManager.getModel();
        if (!model) {
          this.isActive = false;
          sendEvent({ type: 'LIP_SYNC_FINISHED' });
          return;
        }

        const elapsed = performance.now() - startTime;

        if (elapsed >= lipSyncDuration) {
          // 終了: 口を閉じる
          this.setMouthOpenY(model, 0);
          this.isActive = false;
          sendEvent({ type: 'LIP_SYNC_FINISHED' });
          return;
        }

        // サイン波で口の開閉をシミュレーション
        // 周期を変化させて自然な口パクに
        const frequency = 6 + Math.sin(elapsed * 0.003) * 2; // 4-8 Hz
        const value = Math.abs(Math.sin((elapsed / 1000) * frequency * Math.PI));
        this.setMouthOpenY(model, value);

        this.simulationFrame = requestAnimationFrame(animate);
      };

      // アニメーション開始
      this.simulationFrame = requestAnimationFrame(animate);

      // タイムアウト設定（安全策）
      this.simulationTimer = window.setTimeout(() => {
        if (this.isActive) {
          this.stopLipSync();
          sendEvent({ type: 'LIP_SYNC_FINISHED' });
        }
      }, lipSyncDuration + 100);
    }
  }

  /**
   * リップシンクを停止する
   */
  stopLipSync(): void {
    this.isActive = false;

    if (this.simulationFrame !== null) {
      cancelAnimationFrame(this.simulationFrame);
      this.simulationFrame = null;
    }

    if (this.simulationTimer !== null) {
      clearTimeout(this.simulationTimer);
      this.simulationTimer = null;
    }

    // 口を閉じる
    const model = this.modelManager.getModel();
    if (model) {
      this.setMouthOpenY(model, 0);
    }
  }

  /**
   * モデルの口の開き具合を設定する
   */
  private setMouthOpenY(model: any, value: number): void {
    try {
      const coreModel = model.internalModel?.coreModel;
      if (coreModel) {
        // Cubism4 の ParamMouthOpenY パラメータを直接設定
        const paramIndex = coreModel._model?.parameters?.ids?.indexOf('ParamMouthOpenY');
        if (paramIndex !== undefined && paramIndex >= 0) {
          coreModel._model.parameters.values[paramIndex] = value;
        } else {
          // フォールバック: setParameterValueById を試す
          coreModel.setParameterValueById?.('ParamMouthOpenY', value);
        }
      }
    } catch (e) {
      // パラメータ設定に失敗しても無視
    }
  }
}
