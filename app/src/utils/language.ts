/**
 * 言語ユーティリティ
 */

import { LocalizedText, SupportedLanguage } from '../types/spot';

/**
 * LocalizedTextから指定言語のテキストを取得
 * フォールバック: 指定言語 → 日本語
 */
export const getLocalizedText = (
  text: LocalizedText,
  lang: SupportedLanguage
): string => {
  return text[lang] || text.ja;
};
