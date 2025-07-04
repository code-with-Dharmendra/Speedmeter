import React from 'react';
import { View, Text, StyleSheet, TextInput, Button } from 'react-native';
import Slider from '@react-native-community/slider';
import { useTheme } from '../hooks/ThemeContext';

export default function LabeledSlider({
  label,
  min,
  max,
  step =1,
  value,
  onChange,
  onSet,
}) {
  const { colors } = useTheme();
  const range = [];
  for (let i = min; i <= max; i += step) {
    range.push(i);
  }

  const styles = StyleSheet.create({
    container: {
      marginVertical: 8,
    },
    label: {
      color: colors.text,
      marginBottom: 4,
      fontWeight: 'bold',
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    sliderScaleContainer: {
      width: 200,
      marginRight: 8,
    },
    slider: {
      width: '100%',
    },
    scaleContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 6,
      width: '100%',
      paddingHorizontal: 4,
    },
    tickContainer: {
      alignItems: 'center',
      width: 20,
    },
    tick: {
      width: 1,
      height: 8,
      backgroundColor: colors.text,
    },
    tickLabel: {
      fontSize: 10,
      color: colors.text,
      marginTop: 2,
    },
    input: {
      width: 60,
      height: 36,
      borderWidth: 1,
      borderColor: colors.border,
      marginRight: 8,
      textAlign: 'center',
      borderRadius: 4,
      backgroundColor: colors.cardBackground,
      color: colors.text,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <View style={styles.row}>
        <View style={styles.sliderScaleContainer}>
          <Slider
            style={styles.slider}
            minimumValue={min}
            maximumValue={max}
            step={1}
            value={value}
            onValueChange={onChange}
            minimumTrackTintColor={colors.sliderMinimumTrack}
            maximumTrackTintColor={colors.sliderMaximumTrack}
            thumbTintColor={colors.sliderThumb}
          />
          <View style={styles.scaleContainer}>
            {range.map((val, index) => (
              <View key={index} style={styles.tickContainer}>
                <View style={styles.tick} />
                <Text style={styles.tickLabel}>{val}</Text>
              </View>
            ))}
          </View>
        </View>

        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={String(value)}
          onChangeText={(v) => {
            const num = Number(v);
            if (!isNaN(num)) onChange(num);
          }}
        />
        <Button title="Set" onPress={onSet} color={colors.primary} />
      </View>
    </View>
  );
}