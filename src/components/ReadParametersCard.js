import React from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/ThemeContext';

export default function ReadParametersCard({ rawValues, translated, onRead }) {
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
    row: { 
      flexDirection: 'row', 
      alignItems: 'center', 
      marginVertical: 6 
    },
    label: { 
      flex: 1,
      color: colors.text,
    },
    box: {
      borderWidth: 1,
      borderColor: colors.border,
      padding: 6,
      marginHorizontal: 4,
      width: 60,
      textAlign: 'center',
      color: colors.text,
      backgroundColor: colors.cardBackground,
    },
  });

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Read Parameters</Text>

      <View style={styles.row}>
        <Text style={styles.label}>SPEED</Text>
        <TextInput style={styles.box} value={rawValues.speed} editable={false} />
        <TextInput style={styles.box} value={translated.speed} editable={false} />
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>GEAR RATIO</Text>
        <TextInput style={styles.box} value={rawValues.gearRatio} editable={false} />
        <TextInput style={styles.box} value={translated.gearRatio} editable={false} />
      </View>

      <Button title="Read" onPress={onRead} color={colors.primary} />
    </View>
  );
}