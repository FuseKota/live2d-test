/**
 * TTSController - Web Speech API による音声読み上げ + リップシンク連携
 *
 * SpeechSynthesis API でテキストを読み上げ、
 * 発話中は LipSyncController のサイン波シミュレーションで口パクを同期させる。
 */
import { LipSyncController } from './lip-sync';
import { sendEvent } from './bridge';

/** 言語コード → BCP 47 マッピング */
const LANG_MAP: Record<string, string> = {
  ja: 'ja-JP',
  en: 'en-US',
  zh: 'zh-CN',
};

/** 言語別の推定読み上げ速度（文字/秒） */
const CHARS_PER_SECOND: Record<string, number> = {
  ja: 5,
  en: 15,
  zh: 4,
};

export class TTSController {
  private lipSyncController: LipSyncController;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isSpeaking = false;

  constructor(lipSyncController: LipSyncController) {
    this.lipSyncController = lipSyncController;
  }

  /**
   * テキストを読み上げ、リップシンクを同期させる
   */
  speak(text: string, lang: string): void {
    // 既に発話中なら停止
    this.stop();

    if (!window.speechSynthesis) {
      console.error('[TTS] SpeechSynthesis API not available');
      sendEvent({ type: 'TTS_ERROR', payload: { error: 'SpeechSynthesis API not available' } });
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = LANG_MAP[lang] || lang;

    const estimatedDuration = this.estimateDuration(text, lang);

    utterance.onstart = () => {
      console.log('[TTS] Speech started');
    };

    utterance.onend = () => {
      console.log('[TTS] Speech ended');
      this.isSpeaking = false;
      this.currentUtterance = null;
      this.lipSyncController.stopLipSync();
      sendEvent({ type: 'TTS_FINISHED' });
    };

    utterance.onerror = (e) => {
      // 'canceled' は stop() による意図的なキャンセル
      if (e.error === 'canceled') {
        console.log('[TTS] Speech canceled');
        return;
      }
      console.error('[TTS] Speech error:', e.error);
      this.isSpeaking = false;
      this.currentUtterance = null;
      this.lipSyncController.stopLipSync();
      sendEvent({ type: 'TTS_ERROR', payload: { error: e.error || 'Unknown TTS error' } });
    };

    this.currentUtterance = utterance;
    this.isSpeaking = true;

    // リップシンク（サイン波シミュレーション）を開始
    // duration を長めに設定し、TTS終了時に stopLipSync で止める
    this.lipSyncController.startLipSync(undefined, estimatedDuration + 10);

    // TTS 発話開始
    window.speechSynthesis.speak(utterance);

    sendEvent({ type: 'TTS_STARTED', payload: { estimatedDuration } });
  }

  /**
   * 発話を停止する
   */
  stop(): void {
    if (this.isSpeaking || this.currentUtterance) {
      window.speechSynthesis?.cancel();
      this.isSpeaking = false;
      this.currentUtterance = null;
      this.lipSyncController.stopLipSync();
    }
  }

  /**
   * テキスト長と言語から推定再生時間（秒）を計算
   */
  private estimateDuration(text: string, lang: string): number {
    const cps = CHARS_PER_SECOND[lang] || 10;
    return Math.max(1, Math.ceil(text.length / cps));
  }
}
