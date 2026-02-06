/**
 * Live2DAvatar コンポーネント
 * WebViewでLive2Dアバターを表示するラッパー
 * ビルド済みのLive2D Viewer HTMLが利用可能な場合はそちらを読み込み、
 * なければダミーHTMLをフォールバック表示する
 */

import React, { forwardRef, useImperativeHandle, useCallback } from 'react';
import { StyleSheet, View, ActivityIndicator, Text } from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import { WebViewEvent } from '../types/bridge';
import type { ConnectionState } from '../hooks/useLive2DBridge';

// ビルド済みLive2D Viewer HTMLを読み込み（存在する場合）
// static import に変更: Expo のバンドラーが確実にファイルを解決できるようにする
let LIVE2D_VIEWER_HTML: string | null = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const viewer = require('../constants/live2d-viewer-html');
  LIVE2D_VIEWER_HTML = viewer.LIVE2D_VIEWER_HTML;
} catch {
  console.warn('[Live2DAvatar] live2d-viewer-html not found, using dummy HTML fallback');
}

const DUMMY_HTML = `
<!DOCTYPE html>
<html>
<head><meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"></head>
<body style="margin:0;display:flex;align-items:center;justify-content:center;height:100vh;background:linear-gradient(135deg,#667eea,#764ba2);color:white;font-family:sans-serif;font-size:24px;">
  <div style="text-align:center">
    <div style="font-size:48px;margin-bottom:16px;">&#127917;</div>
    <div>Live2D Avatar</div>
    <div style="font-size:14px;margin-top:8px;opacity:0.7;">Placeholder</div>
  </div>
  <script>
    // ダミーのREADYイベントを送信
    window.onload = function() {
      var event = JSON.stringify({
        id: 'evt_ready',
        timestamp: Date.now(),
        event: { type: 'READY' }
      });
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(event);
      }
    };

    // コマンド受信リスナー
    window.addEventListener('message', function(e) {
      try {
        var data = JSON.parse(e.data);
        console.log('Received command:', data.command.type);
      } catch(err) {
        // ignore
      }
    });
  </script>
</body>
</html>
`;

interface Live2DAvatarProps {
  onEvent?: (event: WebViewEvent) => void;
  onMessage?: (event: WebViewMessageEvent) => void;
  /** ブリッジのwebViewRefを接続するためのコールバック */
  onWebViewRef?: (ref: WebView | null) => void;
  /** WebView接続状態 */
  connectionState?: ConnectionState;
}

export interface Live2DAvatarRef {
  injectJavaScript: (script: string) => void;
}

const Live2DAvatar = forwardRef<Live2DAvatarRef, Live2DAvatarProps>(
  ({ onEvent, onMessage, onWebViewRef, connectionState = 'loading' }, ref) => {
    const webViewRefInternal = React.useRef<WebView | null>(null);

    useImperativeHandle(ref, () => ({
      injectJavaScript: (script: string) => {
        webViewRefInternal.current?.injectJavaScript(script);
      },
    }));

    const handleMessage = useCallback(
      (event: WebViewMessageEvent) => {
        if (onMessage) {
          onMessage(event);
        }

        // Also try to parse as WebViewEvent for convenience
        if (onEvent) {
          try {
            const data = JSON.parse(event.nativeEvent.data);
            if (data.event) {
              onEvent(data.event);
            }
          } catch {
            // Ignore non-JSON messages
          }
        }
      },
      [onEvent, onMessage]
    );

    const setWebViewRef = useCallback(
      (instance: WebView | null) => {
        webViewRefInternal.current = instance;
        // Expose the WebView ref to the parent (for bridge connection)
        if (onWebViewRef) {
          onWebViewRef(instance);
        }
      },
      [onWebViewRef]
    );

    return (
      <View style={styles.container}>
        <WebView
          ref={setWebViewRef}
          source={{
            html: LIVE2D_VIEWER_HTML || DUMMY_HTML,
            baseUrl: 'https://cdn.jsdelivr.net',
          }}
          style={styles.webview}
          originWhitelist={['*']}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          allowsInlineMediaPlayback={true}
          mediaPlaybackRequiresUserAction={false}
          allowFileAccessFromFileURLs={true}
          allowUniversalAccessFromFileURLs={true}
          mixedContentMode="always"
          // iOS: 透過WebViewにするため opaque=false が必須
          // @ts-expect-error -- react-native-webview supports this prop on iOS
          opaque={false}
          scrollEnabled={false}
          bounces={false}
          onMessage={handleMessage}
          overScrollMode="never"
        />

        {/* ローディング/エラーオーバーレイ */}
        {connectionState === 'loading' && (
          <View style={styles.overlay}>
            <ActivityIndicator size="large" color="#FFFFFF" />
            <Text style={styles.overlayText}>読み込み中...</Text>
          </View>
        )}
        {connectionState === 'error' && (
          <View style={styles.overlay}>
            <Text style={styles.overlayErrorIcon}>!</Text>
            <Text style={styles.overlayText}>モデル読み込みエラー</Text>
          </View>
        )}
      </View>
    );
  }
);

Live2DAvatar.displayName = 'Live2DAvatar';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayText: {
    color: '#FFFFFF',
    fontSize: 14,
    marginTop: 8,
  },
  overlayErrorIcon: {
    color: '#FF6B6B',
    fontSize: 32,
    fontWeight: '700',
  },
});

export default Live2DAvatar;
