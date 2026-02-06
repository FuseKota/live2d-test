/**
 * SpotCard コンポーネント
 * 観光スポットのカード表示（多言語対応）
 */

import React from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Spot } from '../types/spot';
import { useLanguage } from '../contexts/LanguageContext';
import { getLocalizedText } from '../utils/language';

interface SpotCardProps {
  spot: Spot;
  onPress: (spotId: string) => void;
}

const SpotCard: React.FC<SpotCardProps> = ({ spot, onPress }) => {
  const { t } = useTranslation();
  const { language } = useLanguage();

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

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        pressed && styles.cardPressed,
      ]}
      onPress={() => onPress(spot.id)}
    >
      <Image
        source={{ uri: spot.imageUrl }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name} numberOfLines={1}>
            {getLocalizedText(spot.name, language)}
          </Text>
          <View
            style={[
              styles.categoryBadge,
              { backgroundColor: categoryColor },
            ]}
          >
            <Text style={styles.categoryText}>{t(categoryKey)}</Text>
          </View>
        </View>
        {language !== 'en' && (
          <Text style={styles.nameEn} numberOfLines={1}>
            {spot.name.en}
          </Text>
        )}
        <View style={styles.footer}>
          <Text style={styles.duration}>
            {t('duration.minutes', { count: spot.estimatedDuration })}
          </Text>
          {spot.audioGuideUrl && (
            <Text style={styles.audioIcon}>{t('audioGuide.hasAudioGuide')}</Text>
          )}
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  cardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  image: {
    width: '100%',
    height: 160,
    backgroundColor: '#E0E0E0',
  },
  content: {
    padding: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    flex: 1,
    marginRight: 8,
  },
  nameEn: {
    fontSize: 13,
    color: '#888888',
    marginBottom: 8,
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  duration: {
    fontSize: 13,
    color: '#666666',
  },
  audioIcon: {
    fontSize: 12,
    color: '#667EEA',
    fontWeight: '500',
  },
});

export default SpotCard;
