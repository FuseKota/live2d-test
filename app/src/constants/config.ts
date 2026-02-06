/**
 * アプリケーション設定定数
 */

// Live2D モデル設定
export const LIVE2D_CONFIG = {
  // Hiyoriサンプルモデル（CDN）
  DEFAULT_MODEL_URL:
    'https://cdn.jsdelivr.net/gh/guansss/pixi-live2d-display@master/test/assets/haru/haru_greeter_t03.model3.json',

  // Cubism Core SDK
  CUBISM_CORE_URL:
    'https://cubism.live2d.com/sdk-web/cubismcore/live2dcubismcore.min.js',

  // WebView背景色（透過）
  BACKGROUND_COLOR: 'transparent',

  // モデル表示スケール
  DEFAULT_SCALE: 0.3,
} as const;

// レイアウト設定
export const LAYOUT_CONFIG = {
  // アバター表示エリアの高さ比率
  AVATAR_HEIGHT_RATIO: 0.4,

  // コンテンツエリアの高さ比率
  CONTENT_HEIGHT_RATIO: 0.6,
} as const;

// 音声ガイド設定
export const AUDIO_CONFIG = {
  // プレースホルダー音声の長さ（秒）
  PLACEHOLDER_DURATION: 10,
} as const;

// アプリ情報
export const APP_INFO = {
  NAME: 'VTuber観光ガイド',
  VERSION: '0.1.0',
} as const;
