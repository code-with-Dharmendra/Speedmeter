import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../hooks/ThemeContext';

export default function TopBar({ connected, onBluetoothPress }) {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      padding: 12,
      backgroundColor: colors.cardBackground,
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    title: {
      fontSize: 22,
      fontWeight: 'bold',
      color: colors.text,
    },
    statusContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    statusDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      marginRight: 6,
    },
    statusText: {
      fontSize: 12,
      paddingVertical: 2,
      paddingHorizontal: 6,
      borderRadius: 10,
      backgroundColor: colors.speedometerBackground,
      marginRight: 8,
      color: colors.text,
    },
    btButton: {
      padding: 4,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>RANTOM</Text>
      <View style={styles.statusContainer}>
        <View
          style={[
            styles.statusDot,
            { backgroundColor: connected ? colors.statusConnected : colors.statusDisconnected },
          ]}
        />
        <Text style={styles.statusText}>
          {connected ? 'Connected' : 'Disconnected'}
        </Text>
        <TouchableOpacity onPress={onBluetoothPress} style={styles.btButton}>
          <Icon name="bluetooth-connect" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}