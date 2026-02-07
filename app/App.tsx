/**
 * App.tsx — ルートレイアウト
 *
 * 構成:
 * - 全画面: React Navigationコンテンツ
 * - 左下オーバーレイ: Live2Dアバター（WebView、常時表示・ナビゲーションから独立）
 * - Live2DBridgeContextでブリッジフックをアプリ全体に共有
 * - LanguageProviderで言語状態を管理
 */

import React, { useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import type { WebView } from 'react-native-webview';
import './src/i18n';
import Live2DAvatar from './src/components/Live2DAvatar';
import AppNavigator from './src/navigation/AppNavigator';
import { useLive2DBridge } from './src/hooks/useLive2DBridge';
import { Live2DBridgeProvider } from './src/contexts/Live2DBridgeContext';
import { LanguageProvider } from './src/contexts/LanguageContext';
import { WebViewEvent } from './src/types/bridge';
import { LAYOUT_CONFIG } from './src/constants/config';

export default function App() {
  const handleEvent = useCallback((event: WebViewEvent) => {
    switch (event.type) {
      case 'READY':
        // WebView is ready
        break;
      case 'MODEL_LOADED':
        // Model loaded successfully
        break;
      case 'MODEL_ERROR':
        // Model failed to load
        break;
      case 'LIP_SYNC_FINISHED':
        // Lip sync animation completed
        break;
      case 'MOTION_FINISHED':
        // Motion animation completed
        break;
    }
  }, []);

  const bridge = useLive2DBridge(handleEvent);

  /**
   * Live2DAvatarのWebViewインスタンスをブリッジのwebViewRefに接続する
   * これによりsendCommand()がWebViewにJavaScriptを注入できるようになる
   */
  const handleWebViewRef = useCallback(
    (webView: WebView | null) => {
      (bridge.webViewRef as React.MutableRefObject<WebView | null>).current = webView;
    },
    [bridge.webViewRef]
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="dark" />

        {/* Navigation content (full screen) */}
        <View style={styles.contentContainer}>
          <LanguageProvider>
            <Live2DBridgeProvider bridge={bridge}>
              <NavigationContainer>
                <AppNavigator />
              </NavigationContainer>
            </Live2DBridgeProvider>
          </LanguageProvider>
        </View>

        {/* Live2D Avatar overlay (bottom-left) */}
        <View style={styles.avatarContainer} pointerEvents="box-none">
          <Live2DAvatar
            onMessage={bridge.handleMessage}
            onEvent={handleEvent}
            onWebViewRef={handleWebViewRef}
            connectionState={bridge.connectionState}
          />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  contentContainer: {
    flex: 1,
  },
  avatarContainer: {
    position: 'absolute',
    bottom: LAYOUT_CONFIG.AVATAR_OVERLAY_BOTTOM,
    left: LAYOUT_CONFIG.AVATAR_OVERLAY_LEFT,
    width: LAYOUT_CONFIG.AVATAR_OVERLAY_WIDTH,
    height: LAYOUT_CONFIG.AVATAR_OVERLAY_HEIGHT,
  },
});
