/**
 * Live2D Viewer メインエントリポイント
 *
 * PIXI.Application を初期化し、Live2Dモデルを読み込み、
 * React Native WebView との通信ブリッジをセットアップする。
 *
 * 注意: Cubism Core SDK は index.html で先に読み込む必要がある。
 */
import { PIXI } from './setup';
import { ModelManager } from './model-manager';
import { LipSyncController } from './lip-sync';
import { initBridge, sendEvent } from './bridge';
import { LIVE2D_CONFIG } from './types';

declare global {
  interface Window {
    __cubismCoreLoaded?: boolean;
    __readySent?: boolean;
  }
}

/**
 * キャンバスサイズを確実に取得する
 * WebView内ではinnerWidth/Heightが初期化時に0を返す場合がある
 */
function getViewportSize(): { width: number; height: number } {
  let width = window.innerWidth;
  let height = window.innerHeight;

  // フォールバック: documentElementのサイズを使用
  if (!width || !height) {
    width = document.documentElement.clientWidth || screen.width;
    height = document.documentElement.clientHeight || screen.height;
  }

  // それでも0の場合はデフォルト値
  if (!width) width = 375;
  if (!height) height = 300;

  return { width, height };
}

async function main(): Promise<void> {
  console.log('[Live2D Viewer] Initializing...');

  const { width, height } = getViewportSize();
  console.log(`[Live2D Viewer] Viewport: ${width}x${height}, DPR: ${window.devicePixelRatio}`);

  // PIXI Application 作成（透過背景、フルビューポート）
  const app = new PIXI.Application({
    view: document.getElementById('canvas') as HTMLCanvasElement,
    width,
    height,
    backgroundAlpha: 0, // 透過背景
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
    antialias: true,
  });

  // ModelManager 初期化
  const modelManager = new ModelManager(app);

  // LipSyncController 初期化
  const lipSyncController = new LipSyncController(modelManager);

  // ブリッジ初期化
  initBridge(modelManager, lipSyncController);

  // ウィンドウリサイズハンドリング
  const handleResize = () => {
    const { width: w, height: h } = getViewportSize();
    app.renderer.resize(w, h);
    modelManager.onResize();
  };
  window.addEventListener('resize', handleResize);

  // READY イベント送信
  sendEvent({ type: 'READY' });
  window.__readySent = true;
  console.log('[Live2D Viewer] READY event sent');

  // Cubism Coreが読み込まれていない場合はモデル読み込みをスキップ
  if (!window.__cubismCoreLoaded) {
    console.error('[Live2D Viewer] Cubism Core not loaded, skipping model load');
    sendEvent({
      type: 'MODEL_ERROR',
      payload: {
        error: 'Cubism Core SDK failed to load from CDN',
        modelUrl: LIVE2D_CONFIG.DEFAULT_MODEL_URL,
      },
    });
    return;
  }

  // デフォルトモデルを読み込む
  try {
    const modelUrl = LIVE2D_CONFIG.DEFAULT_MODEL_URL;
    console.log('[Live2D Viewer] Loading default model:', modelUrl);

    const { motionGroups, expressions } =
      await modelManager.loadModel(modelUrl);

    // モデル読み込み後にリサイズを再実行（WebView内でのレイアウト確定後）
    setTimeout(handleResize, 100);

    sendEvent({
      type: 'MODEL_LOADED',
      payload: {
        modelUrl,
        motionGroups,
        expressions,
      },
    });

    console.log('[Live2D Viewer] Model loaded successfully');
    console.log('  Motion groups:', motionGroups);
    console.log('  Expressions:', expressions);
  } catch (e) {
    const error = e instanceof Error ? e.message : String(e);
    console.error('[Live2D Viewer] Failed to load model:', error);

    sendEvent({
      type: 'MODEL_ERROR',
      payload: {
        error,
        modelUrl: LIVE2D_CONFIG.DEFAULT_MODEL_URL,
      },
    });
  }
}

// DOMContentLoaded 後に起動（エラーハンドリング付き）
function start(): void {
  main().catch((e) => {
    console.error('[Live2D Viewer] Fatal error in main():', e);
    try {
      if (window.ReactNativeWebView?.postMessage) {
        window.ReactNativeWebView.postMessage(JSON.stringify({
          id: `evt_fallback_${Date.now()}`,
          timestamp: Date.now(),
          event: { type: 'READY' },
        }));
        window.ReactNativeWebView.postMessage(JSON.stringify({
          id: `evt_error_${Date.now()}`,
          timestamp: Date.now(),
          event: {
            type: 'MODEL_ERROR',
            payload: { error: e instanceof Error ? e.message : String(e) },
          },
        }));
      }
    } catch {
      // ignore
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', start);
} else {
  start();
}
