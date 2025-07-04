import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LabeledSlider from './LabeledSlider';
import { useTheme } from '../hooks/ThemeContext';

export default function SetParametersCard({
  speed, setSpeed, onSetSpeed,
  gearRatio, setGearRatio, onSetGearRatio
}) {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    card: {
      backgroundColor: colors.cardBackground,
      padding: 12,
      margin: 8,
      borderRadius: 8,
      elevation: 2,
    },
    title: { 
      fontSize: 18, 
      fontWeight: 'bold', 
      marginBottom: 8,
      color: colors.text,
    },
  });

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Set Parameters</Text>

      <LabeledSlider
        label="Set Speed"
        min={0}
        max={100}
        step={20}
        value={speed}
        onChange={setSpeed}
        onSet={onSetSpeed}
      />

      <LabeledSlider
        label="Set Gear Ratio"
        min={100}
        max={500}
        step={50}
        value={gearRatio}
        onChange={setGearRatio}
        onSet={onSetGearRatio}
      />
    </View>
  );
}