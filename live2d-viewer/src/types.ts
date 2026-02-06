/**
 * WebView通信プロトコル型定義
 * app/src/types/bridge.ts のローカルミラー
 */

// === RN -> WebView コマンド ===

export type WebViewCommand =
  | SetModelCommand
  | PlayMotionCommand
  | SetExpressionCommand
  | StartLipSyncCommand
  | StopLipSyncCommand
  | StartTTSCommand
  | StopTTSCommand;

export interface SetModelCommand {
  type: 'SET_MODEL';
  payload: {
    modelUrl: string;
  };
}

export interface PlayMotionCommand {
  type: 'PLAY_MOTION';
  payload: {
    group: string;
    index?: number;
    priority?: number;
  };
}

export interface SetExpressionCommand {
  type: 'SET_EXPRESSION';
  payload: {
    expressionId: string;
  };
}

export interface StartLipSyncCommand {
  type: 'START_LIP_SYNC';
  payload: {
    audioUrl?: string;
    duration?: number;
  };
}

export interface StopLipSyncCommand {
  type: 'STOP_LIP_SYNC';
}

export interface StartTTSCommand {
  type: 'START_TTS';
  payload: {
    text: string;
    lang: string;
  };
}

export interface StopTTSCommand {
  type: 'STOP_TTS';
}

// === WebView -> RN イベント ===

export type WebViewEvent =
  | ModelLoadedEvent
  | ModelErrorEvent
  | MotionFinishedEvent
  | LipSyncFinishedEvent
  | TTSStartedEvent
  | TTSFinishedEvent
  | TTSErrorEvent
  | ReadyEvent;

export interface ModelLoadedEvent {
  type: 'MODEL_LOADED';
  payload: {
    modelUrl: string;
    motionGroups: string[];
    expressions: string[];
  };
}

export interface ModelErrorEvent {
  type: 'MODEL_ERROR';
  payload: {
    error: string;
    modelUrl?: string;
  };
}

export interface MotionFinishedEvent {
  type: 'MOTION_FINISHED';
  payload: {
    group: string;
    index: number;
  };
}

export interface LipSyncFinishedEvent {
  type: 'LIP_SYNC_FINISHED';
}

export interface TTSStartedEvent {
  type: 'TTS_STARTED';
  payload: {
    estimatedDuration: number;
  };
}

export interface TTSFinishedEvent {
  type: 'TTS_FINISHED';
}

export interface TTSErrorEvent {
  type: 'TTS_ERROR';
  payload: {
    error: string;
  };
}

export interface ReadyEvent {
  type: 'READY';
}

// === ブリッジユーティリティ型 ===

export interface BridgeMessage {
  id: string;
  timestamp: number;
  command: WebViewCommand;
}

export interface BridgeEventMessage {
  id: string;
  timestamp: number;
  event: WebViewEvent;
}

// === 設定定数 ===

export const LIVE2D_CONFIG = {
  DEFAULT_MODEL_URL:
    'https://cdn.jsdelivr.net/gh/guansss/pixi-live2d-display@master/test/assets/haru/haru_greeter_t03.model3.json',
  CUBISM_CORE_URL:
    'https://cubism.live2d.com/sdk-web/cubismcore/live2dcubismcore.min.js',
  BACKGROUND_COLOR: 'transparent',
  DEFAULT_SCALE: 0.3,
} as const;
