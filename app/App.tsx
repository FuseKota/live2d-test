/**
 * App.tsx — ルートレイアウト
 *
 * 構成:
 * - 上部40%: Live2Dアバター（WebView、常時表示・ナビゲーションから独立）
 * - 下部60%: React Navigationコンテンツ
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
        <StatusBar style="light" />

        {/* Live2D Avatar area (top 40%) */}
        <View style={styles.avatarContainer}>
          <Live2DAvatar
            onMessage={bridge.handleMessage}
            onEvent={handleEvent}
            onWebViewRef={handleWebViewRef}
            connectionState={bridge.connectionState}
          />
        </View>

        {/* Navigation content area (bottom 60%) */}
        <View style={styles.contentContainer}>
          <LanguageProvider>
            <Live2DBridgeProvider bridge={bridge}>
              <NavigationContainer>
                <AppNavigator />
              </NavigationContainer>
            </Live2DBridgeProvider>
          </LanguageProvider>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000000',
  },
  avatarContainer: {
    flex: LAYOUT_CONFIG.AVATAR_HEIGHT_RATIO,
  },
  contentContainer: {
    flex: LAYOUT_CONFIG.CONTENT_HEIGHT_RATIO,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
  },
});
