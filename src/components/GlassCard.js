import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { useTheme } from '../hooks/ThemeContext';

const GlassCard = ({ children, style }) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.card(colors), style]}>
      {/* Android-specific overlay for glass effect */}
      {Platform.OS === 'android' && (
        <View style={styles.androidOverlay(colors)} />
      )}
      {children}
    </View>
  );
};

const styles = (colors) => StyleSheet.create({
  card: (colors) => ({
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    margin: 8,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    overflow: 'hidden',
    elevation: colors.cardElevation,
    // iOS glass effect
    ...Platform.select({
      ios: {
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
      },
    }),
  }),
  androidOverlay: (colors) => ({
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.isDarkMode 
      ? 'rgba(30, 30, 30, 0.5)' 
      : 'rgba(255, 255, 255, 0.5)',
    borderRadius: 12,
  }),
});

export default GlassCard;