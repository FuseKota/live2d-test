/**
 * AudioGuidePlayer コンポーネント
 * 音声ガイドの再生UI（プロトタイプ: setTimeoutで再生をシミュレート）
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useLive2DBridgeContext } from '../contexts/Live2DBridgeContext';
import { AUDIO_CONFIG } from '../constants/config';

interface AudioGuidePlayerProps {
  audioUrl: string;
  duration?: number;
  onComplete?: () => void;
  onPlayStateChange?: (isPlaying: boolean) => void;
}

type PlaybackState = 'idle' | 'playing' | 'paused' | 'completed';

const AudioGuidePlayer: React.FC<AudioGuidePlayerProps> = ({
  audioUrl,
  duration = AUDIO_CONFIG.PLACEHOLDER_DURATION,
  onComplete,
  onPlayStateChange,
}) => {
  const { t } = useTranslation();
  const bridge = useLive2DBridgeContext();
  const [playbackState, setPlaybackState] = useState<PlaybackState>('idle');
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const elapsedRef = useRef(0);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const handleComplete = useCallback(() => {
    try {
      setPlaybackState('completed');
      setProgress(1);
      bridge.sendCommand({ type: 'STOP_LIP_SYNC' });
      onPlayStateChange?.(false);
      onComplete?.();
    } finally {
      clearTimer();
    }
  }, [clearTimer, bridge, onComplete, onPlayStateChange]);

  const startPlayback = useCallback(() => {
    const totalMs = duration * 1000;
    const intervalMs = 100;

    timerRef.current = setInterval(() => {
      elapsedRef.current += intervalMs;
      const currentProgress = Math.min(elapsedRef.current / totalMs, 1);
      setProgress(currentProgress);

      if (currentProgress >= 1) {
        handleComplete();
      }
    }, intervalMs);
  }, [duration, handleComplete]);

  const handlePlay = useCallback(() => {
    if (playbackState === 'idle' || playbackState === 'completed') {
      elapsedRef.current = 0;
      setProgress(0);
      setPlaybackState('playing');
      onPlayStateChange?.(true);
      bridge.sendCommand({
        type: 'START_LIP_SYNC',
        payload: { audioUrl, duration },
      });
      startPlayback();
    } else if (playbackState === 'paused') {
      setPlaybackState('playing');
      onPlayStateChange?.(true);
      bridge.sendCommand({
        type: 'START_LIP_SYNC',
        payload: { audioUrl, duration },
      });
      startPlayback();
    }
  }, [playbackState, bridge, audioUrl, duration, startPlayback, onPlayStateChange]);

  const handlePause = useCallback(() => {
    if (playbackState === 'playing') {
      clearTimer();
      setPlaybackState('paused');
      onPlayStateChange?.(false);
      bridge.sendCommand({ type: 'STOP_LIP_SYNC' });
    }
  }, [playbackState, clearTimer, bridge, onPlayStateChange]);

  const handleToggle = useCallback(() => {
    if (playbackState === 'playing') {
      handlePause();
    } else {
      handlePlay();
    }
  }, [playbackState, handlePlay, handlePause]);

  // Cleanup on unmount: stop timer and lip sync
  useEffect(() => {
    return () => {
      clearTimer();
      bridge.sendCommand({ type: 'STOP_LIP_SYNC' });
    };
  }, [clearTimer, bridge]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentTime = Math.floor(progress * duration);
  const isPlaying = playbackState === 'playing';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('audioGuide.title')}</Text>
        <Text style={styles.time}>
          {formatTime(currentTime)} / {formatTime(duration)}
        </Text>
      </View>

      <View style={styles.progressBarContainer}>
        <View style={styles.progressBarBackground}>
          <View
            style={[styles.progressBarFill, { width: `${progress * 100}%` }]}
          />
        </View>
      </View>

      <View style={styles.controls}>
        <Pressable
          style={({ pressed }) => [
            styles.playButton,
            isPlaying && styles.playButtonActive,
            pressed && styles.playButtonPressed,
          ]}
          onPress={handleToggle}
        >
          <Text style={styles.playButtonText}>
            {isPlaying ? '||' : playbackState === 'completed' ? '↻' : '▶'}
          </Text>
        </Pressable>

        {playbackState !== 'idle' && (
          <Text style={styles.stateText}>
            {playbackState === 'playing'
              ? t('audioGuide.playing')
              : playbackState === 'paused'
                ? t('audioGuide.paused')
                : t('audioGuide.completed')}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  time: {
    fontSize: 13,
    color: '#888888',
    fontVariant: ['tabular-nums'],
  },
  progressBarContainer: {
    marginBottom: 12,
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#667EEA',
    borderRadius: 3,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#667EEA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButtonActive: {
    backgroundColor: '#764BA2',
  },
  playButtonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.95 }],
  },
  playButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  stateText: {
    marginLeft: 12,
    fontSize: 14,
    color: '#666666',
  },
});

export default AudioGuidePlayer;
