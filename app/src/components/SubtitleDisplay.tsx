/**
 * SubtitleDisplay コンポーネント
 * 音声ガイド再生中の字幕テキスト表示
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

interface SubtitleDisplayProps {
  text: string;
  isVisible: boolean;
}

const SubtitleDisplay: React.FC<SubtitleDisplayProps> = ({
  text,
  isVisible,
}) => {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: isVisible ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isVisible, opacity]);

  if (!text) return null;

  return (
    <Animated.View style={[styles.container, { opacity }]}>
      <Text style={styles.text}>{text}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginTop: 8,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
  },
});

export default SubtitleDisplay;
