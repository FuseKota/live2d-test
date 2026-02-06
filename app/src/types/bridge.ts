/**
 * WebView通信プロトコル型定義
 * Live2D WebViewとReact Native間の通信インターフェース
 */

// === RN → WebView コマンド ===

export type WebViewCommand =
  | SetModelCommand
  | PlayMotionCommand
  | SetExpressionCommand
  | StartLipSyncCommand
  | StopLipSyncCommand;

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

// === WebView → RN イベント ===

export type WebViewEvent =
  | ModelLoadedEvent
  | ModelErrorEvent
  | MotionFinishedEvent
  | LipSyncFinishedEvent
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
