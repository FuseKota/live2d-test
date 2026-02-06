/**
 * SettingsScreen
 * 設定画面（言語選択機能実装済み）
 */

import React, { useCallback } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../contexts/LanguageContext';
import { SupportedLanguage } from '../types/spot';
import { APP_INFO } from '../constants/config';

const LANGUAGES: { code: SupportedLanguage; label: string }[] = [
  { code: 'ja', label: '日本語' },
  { code: 'en', label: 'English' },
  { code: 'zh', label: '中文' },
];

const SettingsScreen: React.FC = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguage();

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleModelPress = useCallback(() => {
    // Model selection - not implemented
  }, []);

  const handleAboutPress = useCallback(() => {
    // About screen - not implemented
  }, []);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          style={({ pressed }) => [
            styles.backButton,
            pressed && styles.backButtonPressed,
          ]}
          onPress={handleBack}
        >
          <Text style={styles.backButtonText}>{t('settings.back')}</Text>
        </Pressable>
        <Text style={styles.headerTitle}>{t('settings.title')}</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Language section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.language')}</Text>
          {LANGUAGES.map((lang) => (
            <Pressable
              key={lang.code}
              style={({ pressed }) => [
                styles.languageItem,
                pressed && styles.languageItemPressed,
              ]}
              onPress={() => setLanguage(lang.code)}
            >
              <Text style={styles.languageLabel}>{lang.label}</Text>
              <View
                style={[
                  styles.radio,
                  language === lang.code && styles.radioSelected,
                ]}
              >
                {language === lang.code && (
                  <View style={styles.radioInner} />
                )}
              </View>
            </Pressable>
          ))}
        </View>

        {/* General section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.general')}</Text>
          <Pressable
            style={({ pressed }) => [
              styles.settingsItem,
              pressed && styles.settingsItemPressed,
            ]}
            onPress={handleModelPress}
          >
            <View style={styles.settingsItemContent}>
              <Text style={styles.settingsItemTitle}>{t('settings.model')}</Text>
              <Text style={styles.settingsItemSubtitle}>{t('settings.modelSubtitle')}</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </Pressable>
        </View>

        {/* Info section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.info')}</Text>
          <Pressable
            style={({ pressed }) => [
              styles.settingsItem,
              pressed && styles.settingsItemPressed,
            ]}
            onPress={handleAboutPress}
          >
            <View style={styles.settingsItemContent}>
              <Text style={styles.settingsItemTitle}>{t('settings.about')}</Text>
              <Text style={styles.settingsItemSubtitle}>
                {APP_INFO.NAME} v{APP_INFO.VERSION}
              </Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </Pressable>
        </View>

        {/* Version footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {APP_INFO.NAME} v{APP_INFO.VERSION}
          </Text>
          <Text style={styles.footerSubtext}>{t('settings.footer')}</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  backButton: {
    paddingVertical: 4,
    paddingRight: 8,
  },
  backButtonPressed: {
    opacity: 0.6,
  },
  backButtonText: {
    fontSize: 16,
    color: '#667EEA',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  headerSpacer: {
    width: 60,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#888888',
    textTransform: 'uppercase',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  languageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E0E0E0',
  },
  languageItemPressed: {
    backgroundColor: '#F8F8F8',
  },
  languageLabel: {
    fontSize: 16,
    color: '#1A1A1A',
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#CCCCCC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    borderColor: '#667EEA',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#667EEA',
  },
  settingsItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E0E0E0',
  },
  settingsItemPressed: {
    backgroundColor: '#F8F8F8',
  },
  settingsItemContent: {
    flex: 1,
  },
  settingsItemTitle: {
    fontSize: 16,
    color: '#1A1A1A',
    marginBottom: 2,
  },
  settingsItemSubtitle: {
    fontSize: 13,
    color: '#888888',
  },
  chevron: {
    fontSize: 24,
    color: '#CCCCCC',
    marginLeft: 8,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  footerText: {
    fontSize: 13,
    color: '#AAAAAA',
  },
  footerSubtext: {
    fontSize: 12,
    color: '#CCCCCC',
    marginTop: 4,
  },
});

export default SettingsScreen;
