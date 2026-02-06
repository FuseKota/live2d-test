/**
 * Bridge - React Native WebView との通信ブリッジ
 *
 * RN -> WebView: window.dispatchRNCommand(command) でコマンドを受信
 * WebView -> RN: window.ReactNativeWebView.postMessage(event) でイベントを送信
 */
import type {
  WebViewCommand,
  WebViewEvent,
  BridgeEventMessage,
} from './types';
import type { ModelManager } from './model-manager';
import type { LipSyncController } from './lip-sync';

// グローバル拡張
declare global {
  interface Window {
    dispatchRNCommand: (command: WebViewCommand) => void;
    ReactNativeWebView?: {
      postMessage: (message: string) => void;
    };
  }
}

/**
 * WebView -> RN イベントを送信する
 */
export function sendEvent(event: WebViewEvent): void {
  const message: BridgeEventMessage = {
    id: generateId(),
    timestamp: Date.now(),
    event,
  };

  const json = JSON.stringify(message);

  // React Native WebView 経由で送信
  if (window.ReactNativeWebView?.postMessage) {
    window.ReactNativeWebView.postMessage(json);
  }

  // 開発用: コンソールにもログ出力
  console.log('[Bridge] sendEvent:', event.type, json);
}

/**
 * ブリッジを初期化する
 * RN からのコマンドを受け付ける dispatchRNCommand をグローバルに登録
 */
export function initBridge(
  modelManager: ModelManager,
  lipSyncController: LipSyncController
): void {
  // コマンドディスパッチャをグローバルに登録
  window.dispatchRNCommand = (command: WebViewCommand) => {
    console.log('[Bridge] received command:', command.type);
    handleCommand(command, modelManager, lipSyncController);
  };

  console.log('[Bridge] initialized');
}

/**
 * コマンドを処理する
 */
async function handleCommand(
  command: WebViewCommand,
  modelManager: ModelManager,
  lipSyncController: LipSyncController
): Promise<void> {
  try {
    switch (command.type) {
      case 'SET_MODEL': {
        const { modelUrl } = command.payload;
        try {
          const { motionGroups, expressions } =
            await modelManager.loadModel(modelUrl);
          sendEvent({
            type: 'MODEL_LOADED',
            payload: {
              modelUrl,
              motionGroups,
              expressions,
            },
          });
        } catch (e) {
          const error = e instanceof Error ? e.message : String(e);
          sendEvent({
            type: 'MODEL_ERROR',
            payload: {
              error,
              modelUrl,
            },
          });
        }
        break;
      }

      case 'PLAY_MOTION': {
        const { group, index, priority } = command.payload;
        try {
          await modelManager.playMotion(group, index ?? 0, priority ?? 2);
          sendEvent({
            type: 'MOTION_FINISHED',
            payload: {
              group,
              index: index ?? 0,
            },
          });
        } catch (e) {
          const error = e instanceof Error ? e.message : String(e);
          console.error('[Bridge] PLAY_MOTION error:', error);
          sendEvent({
            type: 'MOTION_ERROR' as any,
            payload: {
              error,
              group,
              index: index ?? 0,
            },
          });
        }
        break;
      }

      case 'SET_EXPRESSION': {
        const { expressionId } = command.payload;
        try {
          await modelManager.setExpression(expressionId);
        } catch (e) {
          const error = e instanceof Error ? e.message : String(e);
          console.error('[Bridge] SET_EXPRESSION error:', error, 'expressionId:', expressionId);
        }
        break;
      }

      case 'START_LIP_SYNC': {
        const { audioUrl, duration } = command.payload;
        await lipSyncController.startLipSync(audioUrl, duration);
        break;
      }

      case 'STOP_LIP_SYNC': {
        lipSyncController.stopLipSync();
        break;
      }

      default: {
        console.warn('[Bridge] Unknown command:', (command as any).type);
      }
    }
  } catch (e) {
    console.error('[Bridge] Command handling error:', e);
  }
}

/**
 * ユニークIDを生成する
 */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
