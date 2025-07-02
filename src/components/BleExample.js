import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Modal,
} from 'react-native';
import { useBleManager } from '../hooks/useBleManager';

const BleExample = () => {
  const {
    isBluetoothEnabled,
    bluetoothState,
    enableBluetooth,
    scanForDevices,
    devices,
    isScanning,
    connectedDevice,
    connectToDevice,
    disconnectFromDevice,
    readCharacteristic,
    writeCharacteristic,
    startNotification,
    stopNotification,
    clearError,
  } = useBleManager();

  const [lastReadData, setLastReadData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleEnableBluetooth = async () => {
    try {
      const enabled = await enableBluetooth();
      if (enabled) {
        Alert.alert('Success', 'Bluetooth is now enabled!');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleScanDevices = async () => {
    try {
      await scanForDevices();
    } catch (error) {
      Alert.alert('Scan Error', error.message);
    }
  };

  const handleConnectDevice = async (device) => {
    try {
      await connectToDevice(device.id);
      Alert.alert('Connected', 'Your device is now connected');
    } catch (error) {
      Alert.alert('Connection Error', error.message);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnectFromDevice();
      Alert.alert('Success', 'Device disconnected');
    } catch (error) {
      Alert.alert('Disconnect Error', error.message);
    }
  };

  const handleReadExample = async () => {
    if (!connectedDevice) {
      Alert.alert('Not Connected', 'Please connect to a device first');
      return;
    }

    try {
      // Example: Read from a generic service and characteristic
      // Replace these UUIDs with your actual device's service and characteristic UUIDs
      const SERVICE_UUID = '0000180d-0000-1000-8000-00805f9b34fb'; // Heart Rate Service
      const CHARACTERISTIC_UUID = '00002a37-0000-1000-8000-00805f9b34fb'; // Heart Rate Measurement

      const data = await readCharacteristic(SERVICE_UUID, CHARACTERISTIC_UUID);
      setLastReadData(data);
      Alert.alert('Read Success', `Data: ${data}`);
    } catch (err) {
      Alert.alert('Read Failed', err.message);
    }
  };

  const handleWriteExample = async () => {
    if (!connectedDevice) {
      Alert.alert('Not Connected', 'Please connect to a device first');
      return;
    }

    try {
      // Example: Write to a generic service and characteristic
      // Replace these UUIDs with your actual device's service and characteristic UUIDs
      const SERVICE_UUID = '0000180f-0000-1000-8000-00805f9b34fb'; // Battery Service
      const CHARACTERISTIC_UUID = '00002a19-0000-1000-8000-00805f9b34fb'; // Battery Level

      const testData = 'Hello BLE Device!';
      await writeCharacteristic(SERVICE_UUID, CHARACTERISTIC_UUID, testData);
      Alert.alert('Write Success', 'Data written successfully');
    } catch (err) {
      Alert.alert('Write Failed', err.message);
    }
  };

  const handleStartNotification = async () => {
    if (!connectedDevice) {
      Alert.alert('Not Connected', 'Please connect to a device first');
      return;
    }

    try {
      // Example: Start notification for a generic service and characteristic
      const SERVICE_UUID = '0000180d-0000-1000-8000-00805f9b34fb';
      const CHARACTERISTIC_UUID = '00002a37-0000-1000-8000-00805f9b34fb';

      await startNotification(SERVICE_UUID, CHARACTERISTIC_UUID);
      Alert.alert('Notification Started', 'Listening for data updates...');
    } catch (err) {
      Alert.alert('Notification Failed', err.message);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>BLE Manager Example</Text>
      
      {/* Bluetooth Status */}
      <View style={styles.statusContainer}>
        <View style={[styles.statusDot, { backgroundColor: isBluetoothEnabled ? '#4CAF50' : '#f44336' }]} />
        <Text style={styles.statusText}>
          Bluetooth: {isBluetoothEnabled ? 'Enabled' : 'Disabled'}
        </Text>
        {bluetoothState && (
          <Text style={styles.stateText}>State: {bluetoothState}</Text>
        )}
      </View>

      {/* Connection Status */}
      <View style={styles.connectionContainer}>
        <View style={[styles.statusDot, { backgroundColor: connectedDevice ? '#4CAF50' : '#f44336' }]} />
        <Text style={styles.statusText}>
          Device: {connectedDevice ? 'Connected' : 'Disconnected'}
        </Text>
        {connectedDevice && (
          <Text style={styles.deviceText}>{connectedDevice.name || connectedDevice.localName || connectedDevice.id || 'Unknown Device'}</Text>
        )}
      </View>

      {/* Error Display */}
      {clearError && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {clearError}</Text>
          <TouchableOpacity style={styles.clearErrorButton} onPress={clearError}>
            <Text style={styles.clearErrorText}>Clear</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        {!isBluetoothEnabled && (
          <TouchableOpacity style={styles.button} onPress={handleEnableBluetooth}>
            <Text style={styles.buttonText}>Enable Bluetooth</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity 
          style={[styles.button, !isBluetoothEnabled && styles.disabledButton]} 
          onPress={() => setModalVisible(true)}
          disabled={!isBluetoothEnabled}
        >
          <Text style={styles.buttonText}>Show Devices</Text>
        </TouchableOpacity>

        {connectedDevice && (
          <TouchableOpacity style={[styles.button, styles.disconnectButton]} onPress={handleDisconnect}>
            <Text style={styles.buttonText}>Disconnect</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Device List Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Bluetooth Devices</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.scanSection}>
              {isScanning ? (
                <Text style={styles.scanningText}>Scanning...</Text>
              ) : (
                <TouchableOpacity style={styles.scanButton} onPress={handleScanDevices}>
                  <Text style={styles.scanButtonText}>Scan for Devices</Text>
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.deviceList}>
              {devices.length === 0 ? (
                <Text style={styles.noDevicesText}>
                  {isScanning ? 'Scanning for devices...' : 'No devices found'}
                </Text>
              ) : (
                devices.map((device) => (
                  <TouchableOpacity
                    key={device.id}
                    style={styles.deviceItem}
                    onPress={() => handleConnectDevice(device)}
                  >
                    <Text style={styles.deviceName}>{device.name || device.localName || device.id || 'Unknown Device'}</Text>
                    <Text style={styles.deviceId}>{device.id}</Text>
                  </TouchableOpacity>
                ))
              )}
            </View>
          </View>
        </View>
      </Modal>

      {/* BLE Operations */}
      {connectedDevice && (
        <View style={styles.operationsContainer}>
          <Text style={styles.sectionTitle}>BLE Operations:</Text>
          
          <TouchableOpacity 
            style={[styles.button, styles.operationButton]} 
            onPress={handleReadExample}
          >
            <Text style={styles.buttonText}>Read Characteristic</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.operationButton]} 
            onPress={handleWriteExample}
          >
            <Text style={styles.buttonText}>Write Characteristic</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.operationButton]} 
            onPress={handleStartNotification}
          >
            <Text style={styles.buttonText}>Start Notification</Text>
          </TouchableOpacity>

          {lastReadData && (
            <View style={styles.dataContainer}>
              <Text style={styles.dataTitle}>Last Read Data:</Text>
              <Text style={styles.dataText}>{lastReadData}</Text>
            </View>
          )}
        </View>
      )}

      {/* Instructions */}
      <View style={styles.instructionsContainer}>
        <Text style={styles.instructionsTitle}>How to Use:</Text>
        <Text style={styles.instructionText}>
          1. Tap "Show Devices" to discover nearby BLE devices
        </Text>
        <Text style={styles.instructionText}>
          2. Tap on a device to connect to it
        </Text>
        <Text style={styles.instructionText}>
          3. Once connected, you can read/write characteristics
        </Text>
        <Text style={styles.instructionText}>
          4. Replace the UUIDs in the code with your device's actual UUIDs
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  connectionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  statusText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  stateText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 10,
  },
  deviceText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 10,
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  errorText: {
    color: '#c62828',
    fontSize: 14,
    flex: 1,
  },
  clearErrorButton: {
    backgroundColor: '#c62828',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
  },
  clearErrorText: {
    color: '#fff',
    fontSize: 12,
  },
  buttonContainer: {
    marginBottom: 20,
  },
  button: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  operationButton: {
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    fontSize: 20,
    color: '#666',
  },
  scanSection: {
    marginBottom: 20,
  },
  scanButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  scanButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  scanningText: {
    textAlign: 'center',
    color: '#2196F3',
    fontWeight: 'bold',
  },
  deviceList: {
    maxHeight: 300,
  },
  noDevicesText: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
  },
  deviceItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  deviceName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  deviceId: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  operationsContainer: {
    marginBottom: 20,
  },
  dataContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginTop: 12,
  },
  dataTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  dataText: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'monospace',
  },
  instructionsContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  instructionText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
});

export default BleExample; 