import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, FlatList, Modal, Alert } from 'react-native';
import Slider from '@react-native-community/slider';
import Speedometer from '../../components/Speedometer';
import BleDeviceList from '../../components/BleDeviceList';
import { useBleManager } from '../../hooks/useBleManager';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const Homepage = () => {
  // BLE Manager hook
  const {
    isBluetoothEnabled,
    bluetoothState,
    isScanning,
    devices,
    connectedDevice,
    error,
    enableBluetooth,
    scanForDevices,
    stopScan,
    connectToDevice,
    disconnectFromDevice,
    readCharacteristic,
    writeCharacteristic,
    startNotification,
    stopNotification,
    clearError,
  } = useBleManager();

  // State variables
  const [vehicleSpeed, setVehicleSpeed] = useState(58.8);
  const [setSpeed, setSetSpeed] = useState(65);
  const [setGearRatio, setSetGearRatio] = useState(300);
  const [readSpeed, setReadSpeed] = useState('0650');
  const [readGearRatio, setReadGearRatio] = useState('0300');
  const [showDevices, setShowDevices] = useState(false);

  // Show error alerts
  useEffect(() => {
    if (error) {
      Alert.alert('BLE Error', error, [
        { text: 'OK', onPress: clearError }
      ]);
    }
  }, [error, clearError]);

  const openModal = async () => {
    setShowDevices(true);
    
    try {
      // Check Bluetooth state when opening modal
      if (!isBluetoothEnabled) {
        // Show alert to enable Bluetooth
        Alert.alert(
          'Bluetooth Required',
          'Please enable Bluetooth to scan for devices.',
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Enable Bluetooth', 
              onPress: async () => {
                try {
                  const enabled = await enableBluetooth();
                  if (enabled) {
                    // Wait a moment for Bluetooth to initialize, then start scanning
                    setTimeout(() => {
                      scanForDevices();
                    }, 1000);
                  }
                } catch (err) {
                  Alert.alert('Bluetooth Error', err.message);
                }
              }
            }
          ]
        );
        return;
      }
      
      // If Bluetooth is already enabled, start scanning automatically
      setTimeout(() => {
        scanForDevices();
      }, 1000);
      
    } catch (err) {
      Alert.alert('Bluetooth Error', err.message);
    }
  };

  const closeModal = () => {
    setShowDevices(false);
    stopScan();
  };

  const handleDevicePress = async (device) => {
    try {
      await connectToDevice(device.id);
      setShowDevices(false);
      
      // Show success popup with tick mark
      Alert.alert(
        '✅ Device Paired Successfully',
        `Your Bluetooth device "${device.name || 'Unknown Device'}" is now paired and connected.`,
        [
          { 
            text: 'OK', 
            onPress: () => console.log('Device connection confirmed')
          }
        ]
      );
    } catch (err) {
      Alert.alert('Connection Failed', err.message);
    }
  };

  const handleDisconnectPress = async () => {
    try {
      await disconnectFromDevice();
      Alert.alert('Disconnected', 'Device disconnected successfully');
    } catch (err) {
      Alert.alert('Disconnect Failed', err.message);
    }
  };

  const handleEnableBluetooth = async () => {
    try {
      const enabled = await enableBluetooth();
      if (enabled) {
        // Wait a moment for Bluetooth to initialize, then start scanning
        setTimeout(() => {
          scanForDevices();
        }, 1000);
      }
    } catch (err) {
      Alert.alert('Enable Bluetooth Failed', err.message);
    }
  };

  const handleScanPress = async () => {
    try {
      await scanForDevices();
    } catch (err) {
      Alert.alert('Scan Failed', err.message);
    }
  };

  const handleReadParameters = async () => {
    if (!connectedDevice) {
      Alert.alert('Not Connected', 'Please connect to a device first');
      return;
    }

    try {
      // Example service and characteristic UUIDs - replace with your device's actual UUIDs
      const SPEED_SERVICE_UUID = '0000180d-0000-1000-8000-00805f9b34fb'; // Example
      const SPEED_CHARACTERISTIC_UUID = '00002a37-0000-1000-8000-00805f9b34fb'; // Example
      const GEAR_RATIO_SERVICE_UUID = '0000180f-0000-1000-8000-00805f9b34fb'; // Example
      const GEAR_RATIO_CHARACTERISTIC_UUID = '00002a19-0000-1000-8000-00805f9b34fb'; // Example

      // Read speed
      const speedData = await readCharacteristic(SPEED_SERVICE_UUID, SPEED_CHARACTERISTIC_UUID);
      if (speedData) {
        setReadSpeed(speedData);
      }

      // Read gear ratio
      const gearRatioData = await readCharacteristic(GEAR_RATIO_SERVICE_UUID, GEAR_RATIO_CHARACTERISTIC_UUID);
      if (gearRatioData) {
        setReadGearRatio(gearRatioData);
      }

      Alert.alert('Success', 'Parameters read successfully');
    } catch (err) {
      Alert.alert('Read Failed', err.message);
    }
  };

  const handleSetSpeed = async () => {
    if (!connectedDevice) {
      Alert.alert('Not Connected', 'Please connect to a device first');
      return;
    }

    try {
      // Example service and characteristic UUIDs - replace with your device's actual UUIDs
      const SPEED_SERVICE_UUID = '0000180d-0000-1000-8000-00805f9b34fb'; // Example
      const SPEED_CHARACTERISTIC_UUID = '00002a37-0000-1000-8000-00805f9b34fb'; // Example

      const speedValue = Math.floor(setSpeed * 10).toString().padStart(4, '0');
      await writeCharacteristic(SPEED_SERVICE_UUID, SPEED_CHARACTERISTIC_UUID, speedValue);
      
      Alert.alert('Success', `Speed set to ${setSpeed} km/h`);
    } catch (err) {
      Alert.alert('Set Speed Failed', err.message);
    }
  };

  const handleSetGearRatio = async () => {
    if (!connectedDevice) {
      Alert.alert('Not Connected', 'Please connect to a device first');
      return;
    }

    try {
      // Example service and characteristic UUIDs - replace with your device's actual UUIDs
      const GEAR_RATIO_SERVICE_UUID = '0000180f-0000-1000-8000-00805f9b34fb'; // Example
      const GEAR_RATIO_CHARACTERISTIC_UUID = '00002a19-0000-1000-8000-00805f9b34fb'; // Example

      const gearRatioValue = setGearRatio.toString().padStart(4, '0');
      await writeCharacteristic(GEAR_RATIO_SERVICE_UUID, GEAR_RATIO_CHARACTERISTIC_UUID, gearRatioValue);
      
      Alert.alert('Success', `Gear ratio set to ${setGearRatio}`);
    } catch (err) {
      Alert.alert('Set Gear Ratio Failed', err.message);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>RONTOM TERMINUS</Text>
        <View style={styles.headerStatusRow}>
          <View style={styles.statusDot(connectedDevice ? 'green' : 'red')} />
          <Text style={styles.statusText}>{connectedDevice ? 'Connected' : 'Disconnected'}</Text>
          <View style={styles.bluetoothStatus}>
            <View style={[styles.bluetoothDot, { backgroundColor: isBluetoothEnabled ? '#4CAF50' : '#f44336' }]} />
            <Text style={styles.bluetoothText}>BT</Text>
          </View>
          <TouchableOpacity style={styles.btButton} onPress={openModal}>
            <FontAwesome name="bluetooth" size={22} color="#35336b" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Live View */}
      <View style={styles.sectionBox}>
        <Text style={styles.sectionTitle}>Live View</Text>
        <View style={{ alignItems: 'center', marginVertical: 10 }}>
          <Speedometer value={vehicleSpeed} min={0} max={100} size={220} />
        </View>
      </View>

      {/* Read Parameters */}
      <View style={styles.sectionBox}>
        <Text style={styles.sectionTitle}>Read Parameters</Text>
        <View style={styles.paramRow}>
          <Text style={styles.paramLabel}>Speed :</Text>
          <TextInput style={styles.paramInput} value={readSpeed} editable={false} />
          <TextInput style={styles.paramInputSmall} value={parseFloat(readSpeed) / 10 + '.0'} editable={false} />
          <Text style={styles.paramUnit}>KMPH</Text>
        </View>
        <View style={styles.paramRow}>
          <Text style={styles.paramLabel}>Gear Ratio :</Text>
          <TextInput style={styles.paramInput} value={readGearRatio} editable={false} />
          <TextInput style={styles.paramInputSmall} value={parseInt(readGearRatio, 10).toString()} editable={false} />
          <Text style={styles.paramUnit}>KMPH</Text>
        </View>
        <TouchableOpacity style={styles.readBtn} onPress={handleReadParameters}>
          <Text style={styles.readBtnText}>READ</Text>
        </TouchableOpacity>
      </View>

      {/* Set Parameters */}
      <View style={styles.sectionBox}> 
        <Text style={styles.sectionTitle}>Set Parameters</Text>
        <Text style={styles.setLabel}>Set Speed</Text>
        <View style={styles.setRow}>
          <TextInput
            style={styles.setInput}
            value={setSpeed.toFixed(1)}
            keyboardType="numeric"
            onChangeText={text => {
              let val = parseFloat(text);
              if (!isNaN(val) && val >= 0 && val <= 100) {
                val = Math.floor(val * 10) / 10; // limit to 1 decimal
                setSetSpeed(val);
              } else if (text === "") setSetSpeed(0);
            }}
          />
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={100}
            step={0.1}
            value={setSpeed}
            onValueChange={setSetSpeed}
            minimumTrackTintColor="#6A6AFF"
            maximumTrackTintColor="#eee"
            thumbTintColor="#6A6AFF"
          />
          <TouchableOpacity style={styles.setBtn} onPress={handleSetSpeed}>
            <Text style={styles.setBtnText}>SET</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.setLabel}>Set Gear Ratio</Text>
        <View style={styles.setRow}>
          <TextInput
            style={styles.setInput}
            value={setGearRatio.toString()}
            keyboardType="numeric"
            onChangeText={text => {
              const val = parseInt(text, 10);
              if (!isNaN(val) && val >= 0 && val <= 1000) setSetGearRatio(val);
              else if (text === "") setSetGearRatio(0);
            }}
            editable={true}
          />
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={1000}
            step={1}
            value={setGearRatio}
            onValueChange={setSetGearRatio}
            minimumTrackTintColor="#6A6AFF"
            maximumTrackTintColor="#eee"
            thumbTintColor="#6A6AFF"
          />
          <TouchableOpacity style={styles.setBtn} onPress={handleSetGearRatio}>
            <Text style={styles.setBtnText}>SET</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bluetooth Devices Modal */}
      <Modal
        visible={showDevices}
        transparent
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <BleDeviceList
              devices={devices}
              isScanning={isScanning}
              isConnected={connectedDevice}
              connectedDevice={connectedDevice}
              isBluetoothEnabled={isBluetoothEnabled}
              isInitialized={bluetoothState === 'poweredOn'}
              onScanPress={handleScanPress}
              onDevicePress={handleDevicePress}
              onDisconnectPress={handleDisconnectPress}
              onEnableBluetooth={handleEnableBluetooth}
              onClose={closeModal}
            />
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingTop: 20,
  },
  header: {
    backgroundColor: '#f5f2ff',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    fontFamily: 'monospace',
  },
  headerStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: (color) => ({
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: color,
    marginRight: 6,
  }),
  statusText: {
    fontSize: 12,
    marginRight: 8,
  },
  bluetoothStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bluetoothDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  bluetoothText: {
    fontSize: 12,
    marginRight: 8,
  },
  
 
  sectionBox: {
    backgroundColor: '#e6d6ff',
    margin: 10,
    borderRadius: 20,
    padding: 16,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 8,
    fontFamily: 'monospace',
  },
  paramRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  paramLabel: {
    flex: 1.2,
    fontSize: 13,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  paramInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    minWidth: 50,
    marginHorizontal: 4,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 15,
  },
  paramInputSmall: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 40,
    marginHorizontal: 2,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 13,
  },
  paramUnit: {
    fontSize: 12,
    color: '#888',
    marginLeft: 2,
  },
  readBtn: {
    backgroundColor: '#2e7d32',
    borderRadius: 8,
    alignItems: 'center',
    paddingVertical: 8,
    marginTop: 8,
  },
  readBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  setLabel: {
    fontSize: 12,
    color: '#333',
    marginTop: 10,
    marginBottom: 2,
    fontWeight: 'bold',
  },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  setInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    minWidth: 50,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 15,
    marginRight: 8,
  },
  slider: {
    flex: 1,
    marginHorizontal: 8,
  },
  setBtn: {
    backgroundColor: '#35336b',
    borderRadius: 8,
    paddingHorizontal: 18,
    paddingVertical: 8,
    marginLeft: 8,
  },
  setBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  devicesModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(80, 60, 120, 0.97)',
    zIndex: 10,
    paddingTop: 60,
    paddingHorizontal: 16,
  },
  devicesModalClose: {
    position: 'absolute',
    top: 18,
    right: 18,
    zIndex: 11,
  },
  devicesSectionTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
    marginTop: 18,
    marginBottom: 8,
  },
  deviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#b3aaff',
    borderRadius: 8,
    padding: 10,
    marginBottom: 6,
  },
  deviceName: {
    color: '#222',
    fontWeight: 'bold',
    flex: 1,
  },
  deviceIcon: {
    fontSize: 18,
    marginLeft: 8,
  },
  btButton: {
    backgroundColor: '#eee',
    borderRadius: 20,
    padding: 8,
    marginRight: 8,
  },
  btIcon: {
    fontSize: 22,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    height: '80%',
    backgroundColor: '#fff',
    borderRadius: 20,
    overflow: 'hidden',
  },
});

export default Homepage;