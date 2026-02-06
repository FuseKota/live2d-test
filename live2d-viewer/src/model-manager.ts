/**
 * ModelManager - Live2Dモデルの読み込み・制御を管理するクラス
 */
import { PIXI } from './setup';
import { Live2DModel } from 'pixi-live2d-display-lipsyncpatch/cubism4';

export class ModelManager {
  private app: PIXI.Application;
  private currentModel: Live2DModel | null = null;
  private currentModelUrl: string = '';

  constructor(app: PIXI.Application) {
    this.app = app;
  }

  /**
   * Live2Dモデルを指定URLから読み込み、ステージに表示する
   */
  async loadModel(url: string): Promise<{
    motionGroups: string[];
    expressions: string[];
  }> {
    // 既存モデルがあれば破棄
    if (this.currentModel) {
      this.app.stage.removeChild(this.currentModel);
      this.currentModel.destroy();
      this.currentModel = null;
    }

    this.currentModelUrl = url;

    const model = await Live2DModel.from(url, {
      autoInteract: false,
    });

    this.currentModel = model;

    // モデルをステージに追加
    this.app.stage.addChild(model as unknown as PIXI.DisplayObject);

    // スケールと位置の設定
    this.fitModel();

    // Idleモーションを自動再生
    this.playIdleMotion();

    // モーショングループと表情一覧を返す
    const motionGroups = this.getMotionGroups();
    const expressions = this.getExpressions();

    return { motionGroups, expressions };
  }

  /**
   * モデルをビューポートに合わせてスケール・配置する
   */
  private fitModel(): void {
    if (!this.currentModel) return;

    const model = this.currentModel;
    // autoDensity: true の場合、renderer.width はピクセル幅（DPR倍）を返す。
    // ステージ座標はCSS座標なので app.screen（CSS寸法）を使う。
    const screenWidth = this.app.screen.width;
    const screenHeight = this.app.screen.height;

    // モデルの元サイズを取得（現在のスケールを除去して元寸法を逆算）
    const modelWidth = model.width / model.scale.x;
    const modelHeight = model.height / model.scale.y;

    console.log(`[fitModel] screen: ${screenWidth}x${screenHeight}, model(original): ${modelWidth}x${modelHeight}, DPR: ${window.devicePixelRatio}`);

    // スケールを計算: 画面の高さの80%にフィットさせる
    const scaleByHeight = (screenHeight * 0.8) / modelHeight;
    const scaleByWidth = (screenWidth * 0.9) / modelWidth;
    const scale = Math.min(scaleByHeight, scaleByWidth);

    model.scale.set(scale, scale);

    // 中央下寄せで配置
    model.x = (screenWidth - modelWidth * scale) / 2;
    model.y = screenHeight - modelHeight * scale;
  }

  /**
   * Idleモーションを自動再生する
   */
  private playIdleMotion(): void {
    if (!this.currentModel) return;

    const motionGroups = this.getMotionGroups();

    // Idle系のモーショングループを探す
    const idleGroup = motionGroups.find(
      (group) =>
        group.toLowerCase().includes('idle') ||
        group.toLowerCase().includes('standby')
    );

    if (idleGroup) {
      try {
        this.currentModel.motion(idleGroup, 0, 1);
      } catch (e) {
        console.warn('Failed to play idle motion:', e);
      }
    }
  }

  /**
   * 指定モーションを再生する
   */
  async playMotion(
    group: string,
    index: number = 0,
    priority: number = 2
  ): Promise<void> {
    if (!this.currentModel) {
      throw new Error('No model loaded');
    }

    await this.currentModel.motion(group, index, priority);
  }

  /**
   * 表情を設定する
   */
  async setExpression(expressionId: string): Promise<void> {
    if (!this.currentModel) {
      throw new Error('No model loaded');
    }

    await this.currentModel.expression(expressionId);
  }

  /**
   * モーショングループ一覧を取得する
   */
  getMotionGroups(): string[] {
    if (!this.currentModel) return [];

    const internalModel = this.currentModel.internalModel;
    const settings = internalModel?.settings;

    if (!settings) return [];

    // settings.motions はモーション定義のマップ
    const motions = (settings as any).motions;
    if (!motions) return [];

    return Object.keys(motions);
  }

  /**
   * 表情一覧を取得する
   */
  getExpressions(): string[] {
    if (!this.currentModel) return [];

    const internalModel = this.currentModel.internalModel;
    const settings = internalModel?.settings;

    if (!settings) return [];

    // settings.expressions は表情定義の配列
    const expressions = (settings as any).expressions;
    if (!expressions || !Array.isArray(expressions)) return [];

    return expressions.map(
      (exp: { Name?: string; name?: string }) =>
        exp.Name || exp.name || 'unknown'
    );
  }

  /**
   * 現在のモデル参照を取得する
   */
  getModel(): Live2DModel | null {
    return this.currentModel;
  }

  /**
   * 現在のモデルURLを取得する
   */
  getModelUrl(): string {
    return this.currentModelUrl;
  }

  /**
   * ウィンドウリサイズ時にモデルを再配置する
   */
  onResize(): void {
    this.fitModel();
  }
}
