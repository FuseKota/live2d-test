/**
 * 観光スポットデータモデル型定義
 */

export type SupportedLanguage = 'ja' | 'en' | 'zh';

export interface LocalizedText {
  ja: string;
  en: string;
  zh: string;
}

export interface Spot {
  id: string;
  name: LocalizedText;
  description: LocalizedText;
  imageUrl: string;
  images?: string[];
  audioGuideUrl?: string;
  subtitles?: LocalizedText;
  location: {
    latitude: number;
    longitude: number;
  };
  category: SpotCategory;
  estimatedDuration: number; // 分
  tags: string[];
  address?: LocalizedText;
  accessInfo?: LocalizedText;
  businessHours?: LocalizedText;
  admission?: LocalizedText;
  highlights?: LocalizedText[];
  motion?: {
    group: string;
    index?: number;
  };
  expression?: string;
}

export type SpotCategory =
  | 'temple'
  | 'shrine'
  | 'museum'
  | 'nature'
  | 'food'
  | 'shopping'
  | 'landmark';

export interface SpotListItem {
  id: string;
  name: LocalizedText;
  imageUrl: string;
  category: SpotCategory;
  estimatedDuration: number;
}
