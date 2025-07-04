import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Speedometer from './Speedometer';
import { useTheme } from '../hooks/ThemeContext';

export default function LiveViewCard({ speed }) {
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
      <Text style={styles.title}>Live View</Text>
      <Speedometer value={speed} />
    </View>
  );
}