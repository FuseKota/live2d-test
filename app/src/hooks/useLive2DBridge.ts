/**
 * useLive2DBridge フック
 * WebViewとのブリッジ通信を管理する
 */

import { useRef, useState, useCallback } from 'react';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import {
  WebViewCommand,
  WebViewEvent,
  BridgeEventMessage,
} from '../types/bridge';

export type ConnectionState = 'loading' | 'ready' | 'error';

export interface Live2DBridge {
  webViewRef: React.RefObject<WebView | null>;
  sendCommand: (command: WebViewCommand) => void;
  handleMessage: (event: WebViewMessageEvent) => void;
  connectionState: ConnectionState;
  lastEvent: WebViewEvent | null;
}

/**
 * Live2D WebViewブリッジフック
 * WebViewへのコマンド送信とイベント受信を管理する
 */
export const useLive2DBridge = (
  onEvent?: (event: WebViewEvent) => void
): Live2DBridge => {
  const webViewRef = useRef<WebView | null>(null);
  const [connectionState, setConnectionState] = useState<ConnectionState>('loading');
  const [lastEvent, setLastEvent] = useState<WebViewEvent | null>(null);

  const sendCommand = useCallback((command: WebViewCommand) => {
    if (!webViewRef.current) {
      console.warn('[useLive2DBridge] sendCommand called but WebView is not ready, dropping:', command.type);
      return;
    }

    // Live2D Viewer の bridge.ts は window.dispatchRNCommand(command) を期待する
    const script = `
      (function() {
        try {
          if (window.dispatchRNCommand) {
            window.dispatchRNCommand(${JSON.stringify(command)});
          }
        } catch(e) {
          console.error('Bridge command error:', e);
        }
      })();
      true;
    `;

    webViewRef.current.injectJavaScript(script);
  }, []);

  const handleMessage = useCallback(
    (messageEvent: WebViewMessageEvent) => {
      try {
        const data = messageEvent.nativeEvent.data;
        const parsed: BridgeEventMessage = JSON.parse(data);

        if (parsed.event) {
          const event = parsed.event;
          setLastEvent(event);

          if (event.type === 'READY') {
            setConnectionState('ready');
          } else if (event.type === 'MODEL_ERROR') {
            setConnectionState('error');
          }

          if (onEvent) {
            onEvent(event);
          }
        }
      } catch {
        console.debug('[useLive2DBridge] Non-JSON message from WebView:', messageEvent.nativeEvent.data.substring(0, 200));
      }
    },
    [onEvent]
  );

  return {
    webViewRef,
    sendCommand,
    handleMessage,
    connectionState,
    lastEvent,
  };
};
