/**
 * SpotDetailScreen
 * 観光スポットの詳細情報を表示する画面
 * Phase 2: ギャラリー、字幕、詳細情報セクション、表情/モーション
 */

import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { RootStackParamList } from '../navigation/types';
import { getSpotById } from '../data/spots';
import { useLanguage } from '../contexts/LanguageContext';
import { useLive2DBridgeContext } from '../contexts/Live2DBridgeContext';
import { getLocalizedText } from '../utils/language';
import AudioGuidePlayer from '../components/AudioGuidePlayer';
import PhotoGallery from '../components/PhotoGallery';
import SubtitleDisplay from '../components/SubtitleDisplay';

type SpotDetailRouteProp = RouteProp<RootStackParamList, 'SpotDetail'>;

const SpotDetailScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<SpotDetailRouteProp>();
  const { t } = useTranslation();
  const { language } = useLanguage();
  const bridge = useLive2DBridgeContext();
  const { spotId } = route.params;
  const spot = getSpotById(spotId);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  // Send expression/motion on mount, reset on unmount
  useEffect(() => {
    if (!spot) return;

    if (spot.expression) {
      bridge.sendCommand({
        type: 'SET_EXPRESSION',
        payload: { expressionId: spot.expression },
      });
    }
    if (spot.motion) {
      bridge.sendCommand({
        type: 'PLAY_MOTION',
        payload: {
          group: spot.motion.group,
          index: spot.motion.index,
        },
      });
    }

    return () => {
      // Reset to default on leave
      bridge.sendCommand({
        type: 'SET_EXPRESSION',
        payload: { expressionId: '' },
      });
    };
  }, [spot, bridge]);

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleAudioComplete = useCallback(() => {
    // Audio guide playback completed
  }, []);

  const handlePlayStateChange = useCallback((isPlaying: boolean) => {
    setIsAudioPlaying(isPlaying);
  }, []);

  if (!spot) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{t('spotDetail.notFound')}</Text>
        <Pressable style={styles.backButtonError} onPress={handleBack}>
          <Text style={styles.backButtonErrorText}>{t('spotDetail.back')}</Text>
        </Pressable>
      </View>
    );
  }

  const categoryKey = `category.${spot.category}` as const;
  const categoryColors: Record<string, string> = {
    temple: '#E74C3C',
    shrine: '#E67E22',
    museum: '#3498DB',
    nature: '#27AE60',
    food: '#F39C12',
    shopping: '#9B59B6',
    landmark: '#1ABC9C',
  };
  const categoryColor = categoryColors[spot.category] || '#95A5A6';

  const galleryImages = spot.images && spot.images.length > 0
    ? spot.images
    : [spot.imageUrl];

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Back button overlay */}
        <View style={styles.backButtonContainer}>
          <Pressable
            style={({ pressed }) => [
              styles.backButton,
              pressed && styles.backButtonPressed,
            ]}
            onPress={handleBack}
          >
            <Text style={styles.backButtonText}>{t('spotDetail.back')}</Text>
          </Pressable>
        </View>

        {/* Photo Gallery */}
        <PhotoGallery images={galleryImages} />

        <View style={styles.content}>
          {/* Category badge and duration */}
          <View style={styles.metaRow}>
            <View
              style={[
                styles.categoryBadge,
                { backgroundColor: categoryColor },
              ]}
            >
              <Text style={styles.categoryText}>{t(categoryKey)}</Text>
            </View>
            <Text style={styles.duration}>
              {t('spotDetail.duration', { minutes: spot.estimatedDuration })}
            </Text>
          </View>

          {/* Name */}
          <Text style={styles.nameMain}>
            {getLocalizedText(spot.name, language)}
          </Text>
          {language !== 'en' && (
            <Text style={styles.nameEn}>{spot.name.en}</Text>
          )}

          {/* Tags */}
          <View style={styles.tagsContainer}>
            {spot.tags.map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>#{tag}</Text>
              </View>
            ))}
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('spotDetail.overview')}</Text>
            <Text style={styles.descriptionMain}>
              {getLocalizedText(spot.description, language)}
            </Text>
          </View>

          {/* Audio Guide + Subtitles */}
          {spot.audioGuideUrl && (
            <View style={styles.section}>
              <AudioGuidePlayer
                audioUrl={spot.audioGuideUrl}
                onComplete={handleAudioComplete}
                onPlayStateChange={handlePlayStateChange}
              />
              {spot.subtitles && (
                <SubtitleDisplay
                  text={getLocalizedText(spot.subtitles, language)}
                  isVisible={isAudioPlaying}
                />
              )}
            </View>
          )}

          {/* Address & Access */}
          {(spot.address || spot.accessInfo) && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t('spotDetail.address')}</Text>
              <View style={styles.infoBox}>
                {spot.address && (
                  <Text style={styles.infoText}>
                    {getLocalizedText(spot.address, language)}
                  </Text>
                )}
                {spot.accessInfo && (
                  <Text style={styles.infoTextSecondary}>
                    {getLocalizedText(spot.accessInfo, language)}
                  </Text>
                )}
              </View>
            </View>
          )}

          {/* Business Hours */}
          {spot.businessHours && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t('spotDetail.businessHours')}</Text>
              <View style={styles.infoBox}>
                <Text style={styles.infoText}>
                  {getLocalizedText(spot.businessHours, language)}
                </Text>
              </View>
            </View>
          )}

          {/* Admission */}
          {spot.admission && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t('spotDetail.admission')}</Text>
              <View style={styles.infoBox}>
                <Text style={styles.infoText}>
                  {getLocalizedText(spot.admission, language)}
                </Text>
              </View>
            </View>
          )}

          {/* Highlights */}
          {spot.highlights && spot.highlights.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t('spotDetail.highlights')}</Text>
              {spot.highlights.map((highlight, index) => (
                <View key={index} style={styles.highlightItem}>
                  <Text style={styles.highlightBullet}>●</Text>
                  <Text style={styles.highlightText}>
                    {getLocalizedText(highlight, language)}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Location Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('spotDetail.location')}</Text>
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>
                {t('spotDetail.latitude')}: {spot.location.latitude.toFixed(4)}
              </Text>
              <Text style={styles.infoText}>
                {t('spotDetail.longitude')}: {spot.location.longitude.toFixed(4)}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 16,
  },
  backButtonError: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#667EEA',
    borderRadius: 8,
  },
  backButtonErrorText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  backButtonContainer: {
    position: 'absolute',
    top: 8,
    left: 8,
    zIndex: 10,
  },
  backButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  backButtonPressed: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    padding: 16,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
  },
  categoryText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  duration: {
    fontSize: 13,
    color: '#666666',
  },
  nameMain: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  nameEn: {
    fontSize: 15,
    color: '#888888',
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  tag: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    marginRight: 8,
    marginBottom: 6,
  },
  tagText: {
    fontSize: 12,
    color: '#555555',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  descriptionMain: {
    fontSize: 15,
    lineHeight: 24,
    color: '#333333',
  },
  infoBox: {
    backgroundColor: '#F8F9FA',
    padding: 12,
    borderRadius: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#333333',
    lineHeight: 22,
    marginBottom: 4,
  },
  infoTextSecondary: {
    fontSize: 13,
    color: '#666666',
    lineHeight: 20,
    marginTop: 4,
  },
  highlightItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  highlightBullet: {
    fontSize: 8,
    color: '#667EEA',
    marginRight: 8,
    marginTop: 5,
  },
  highlightText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 22,
    color: '#333333',
  },
});

export default SpotDetailScreen;
