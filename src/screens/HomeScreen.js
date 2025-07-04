import React, { useState, useEffect } from 'react';
import {
  View, ScrollView, Modal, FlatList,
  Text, TouchableOpacity, StyleSheet, Alert, PermissionsAndroid, Platform
} from 'react-native';
import { useTheme } from '../hooks/ThemeContext';
import TopBar from '../components/TopBar';
import LiveViewCard from '../components/LiveViewCard';
import ReadParametersCard from '../components/ReadParametersCard';
import SetParametersCard from '../components/SetParametersCard';
import * as BT from '../utils/bluetooth';
import RNBluetoothClassic from 'react-native-bluetooth-classic';

export default function HomeScreen() {
  const [connectedDevice, setConnectedDevice] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [devices, setDevices] = useState([]);
  const [speed, setSpeed] = useState(0);
  const [gearRatio, setGearRatio] = useState(100);
  const [rawValues, setRawValues] = useState({ speed: '', gearRatio: '' });
  const [translated, setTranslated] = useState({ speed: '', gearRatio: '' });
  const { colors } = useTheme();

  useEffect(() => {
    let interval;
    if (connectedDevice) {
      interval = setInterval(async () => {
        try {
          const data = await BT.readFromDevice(connectedDevice);
          if (data) {
            const parsed = parseInt(data.slice(0, 4), 10);
            setSpeed(isNaN(parsed) ? 0 : parsed / 10);
          }
        } catch (e) {
          console.log('Polling failed', e);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [connectedDevice]);

  const requestPermissions = async () => {
    if (Platform.OS !== 'android') return true;

    try {
      const permissions = [
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION
      ];

      const result = await PermissionsAndroid.requestMultiple(permissions);
      return Object.values(result).every(val => val === PermissionsAndroid.RESULTS.GRANTED);
    } catch (err) {
      console.warn('Permission error', err);
      return false;
    }
  };

  const openModal = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      Alert.alert('Permissions Required', 'Please allow Bluetooth & Location permissions');
      return;
    }

    const available = await RNBluetoothClassic.isBluetoothAvailable();
    const enabled = await RNBluetoothClassic.isBluetoothEnabled();
    if (!available || !enabled) {
      Alert.alert('Bluetooth Error', 'Please ensure Bluetooth is enabled');
      return;
    }

    const bonded = await BT.getBondedDevices();
    setDevices(bonded);
    setModalVisible(true);
  };

  const handleConnect = async (device) => {
    try {
      await BT.connectToDevice(device);
      setConnectedDevice(device);
      setModalVisible(false);
    } catch {
      Alert.alert('Connection Failed', 'Could not connect to device');
    }
  };

  const handleRead = async () => {
    try {
      await BT.writeToDevice(connectedDevice, 'R');
      const data = await BT.readFromDevice(connectedDevice);
      if (data && data.length >= 8) {
        const rawSpeed = data.slice(0, 4);
        const rawGear = data.slice(4, 8);
        setRawValues({ speed: rawSpeed, gearRatio: rawGear });
        setTranslated({
          speed: String(parseInt(rawSpeed, 10) / 10),
          gearRatio: String(parseInt(rawGear, 10)),
        });
      }
    } catch {
      Alert.alert('Read Failed');
    }
  };

  const handleSetSpeed = async () => {
    const value = String(speed * 10).padStart(4, '0');
    await BT.writeToDevice(connectedDevice, `SP${value}`);
  };

  const handleSetGearRatio = async () => {
    const value = String(gearRatio).padStart(4, '0');
    await BT.writeToDevice(connectedDevice, `GR${value}`);
  };

  return (
    <View style={{ flex: 1 }}>
      <TopBar connected={!!connectedDevice} onBluetoothPress={openModal} />
      <ScrollView>
        <LiveViewCard speed={speed} />
        <ReadParametersCard
          rawValues={rawValues}
          translated={translated}
          onRead={handleRead}
        />
        <SetParametersCard
          speed={speed}
          setSpeed={setSpeed}
          onSetSpeed={handleSetSpeed}
          gearRatio={gearRatio}
          setGearRatio={setGearRatio}
          onSetGearRatio={handleSetGearRatio}
        />
      </ScrollView>

      <Modal visible={isModalVisible} animationType="slide">
        <FlatList
          data={devices}
          keyExtractor={(item) => item.address}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.deviceItem}
              onPress={() => handleConnect(item)}
            >
              <Text>{item.name} ({item.address})</Text>
            </TouchableOpacity>
          )}
        />
        <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
          <Text style={{ color: 'white' }}>Close</Text>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  deviceItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  closeButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    alignItems: 'center',
  },
});


