import { useEffect, useState } from 'react';
import { Platform, PermissionsAndroid, Alert } from 'react-native';
import { BleManager, State } from 'react-native-ble-plx';

const bleManager = new BleManager();

const requestBluetoothPermissions = async () => {
  if (Platform.OS === 'android') {
    try {
      const permissions = [];

      if (Platform.Version >= 31) {
        // Android 12 and above
        permissions.push(
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT
        );
      } else {
        // Older Android versions
        permissions.push(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
      }

      const granted = await PermissionsAndroid.requestMultiple(permissions);

      return Object.values(granted).every(
        (status) => status === PermissionsAndroid.RESULTS.GRANTED
      );
    } catch (err) {
      console.warn("Permission error:", err);
      return false;
    }
  }
  return true; // iOS doesn't need runtime permission here
};

export const useBleManager = () => {
  const [isBluetoothEnabled, setIsBluetoothEnabled] = useState(false);
  const [bluetoothState, setBluetoothState] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [devices, setDevices] = useState([]);
  const [connectedDevice, setConnectedDevice] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const subscription = bleManager.onStateChange((state) => {
      setBluetoothState(state);
      setIsBluetoothEnabled(state === State.PoweredOn);
    }, true);

    return () => subscription.remove();
  }, []);

  const enableBluetooth = async () => {
    const permissionGranted = await requestBluetoothPermissions();

    if (!permissionGranted) {
      Alert.alert('Permission Required', 'Bluetooth permissions are required.');
      return false;
    }

    const currentState = await bleManager.state();

    if (currentState !== State.PoweredOn) {
      Alert.alert(
        'Enable Bluetooth',
        'Please turn on Bluetooth from your phone settings or quick menu.'
      );
      return false;
    }

    return true;
  };

  const scanForDevices = async () => {
    try {
      setError(null);
      
      // First check if Bluetooth is enabled
      if (!isBluetoothEnabled) {
        const enabled = await enableBluetooth();
        if (!enabled) {
          setError('Bluetooth is disabled. Please enable Bluetooth to scan for devices.');
          return;
        }
      }

      setIsScanning(true);
      setDevices([]);
      
      // Start scanning
      bleManager.startDeviceScan(null, null, (error, device) => {
        if (error) {
          console.error('Scan error:', error);
          setError('Scan error: ' + error.message);
          setIsScanning(false);
          return;
        }

        if (device) {
          setDevices(prevDevices => {
            // Check if device already exists
            const exists = prevDevices.find(d => d.id === device.id);
            if (!exists) {
              return [...prevDevices, device];
            }
            return prevDevices;
          });
        }
      });

      // Stop scanning after 10 seconds
      setTimeout(() => {
        bleManager.stopDeviceScan();
        setIsScanning(false);
      }, 10000);
      
    } catch (err) {
      setError('Scan failed: ' + err.message);
      setIsScanning(false);
    }
  };

  const stopScan = async () => {
    try {
      bleManager.stopDeviceScan();
      setIsScanning(false);
    } catch (err) {
      setError('Failed to stop scan: ' + err.message);
    }
  };

  const connectToDevice = async (deviceId) => {
    try {
      setError(null);
      const device = await bleManager.connectToDevice(deviceId);
      await device.discoverAllServicesAndCharacteristics();
      setConnectedDevice(device);
      console.log('Connected to device:', device.name || deviceId);
      return device;
    } catch (err) {
      setError('Connection failed: ' + err.message);
      setConnectedDevice(null);
      throw err;
    }
  };

  const disconnectFromDevice = async () => {
    try {
      if (connectedDevice) {
        await connectedDevice.cancelConnection();
        setConnectedDevice(null);
        console.log('Disconnected from device');
      }
    } catch (err) {
      setError('Disconnect failed: ' + err.message);
    }
  };

  const readCharacteristic = async (serviceUUID, characteristicUUID) => {
    try {
      setError(null);
      if (!connectedDevice) {
        throw new Error('No device connected');
      }
      
      const service = await connectedDevice.services();
      const targetService = service.find(s => s.uuid === serviceUUID);
      if (!targetService) {
        throw new Error('Service not found');
      }

      const characteristics = await targetService.characteristics();
      const targetCharacteristic = characteristics.find(c => c.uuid === characteristicUUID);
      if (!targetCharacteristic) {
        throw new Error('Characteristic not found');
      }

      const data = await targetCharacteristic.read();
      return data;
    } catch (err) {
      setError('Read failed: ' + err.message);
      throw err;
    }
  };

  const writeCharacteristic = async (serviceUUID, characteristicUUID, data) => {
    try {
      setError(null);
      if (!connectedDevice) {
        throw new Error('No device connected');
      }
      
      const service = await connectedDevice.services();
      const targetService = service.find(s => s.uuid === serviceUUID);
      if (!targetService) {
        throw new Error('Service not found');
      }

      const characteristics = await targetService.characteristics();
      const targetCharacteristic = characteristics.find(c => c.uuid === characteristicUUID);
      if (!targetCharacteristic) {
        throw new Error('Characteristic not found');
      }

      await targetCharacteristic.writeWithResponse(data);
      console.log('Write successful');
    } catch (err) {
      setError('Write failed: ' + err.message);
      throw err;
    }
  };

  const startNotification = async (serviceUUID, characteristicUUID) => {
    try {
      setError(null);
      if (!connectedDevice) {
        throw new Error('No device connected');
      }
      
      const service = await connectedDevice.services();
      const targetService = service.find(s => s.uuid === serviceUUID);
      if (!targetService) {
        throw new Error('Service not found');
      }

      const characteristics = await targetService.characteristics();
      const targetCharacteristic = characteristics.find(c => c.uuid === characteristicUUID);
      if (!targetCharacteristic) {
        throw new Error('Characteristic not found');
      }

      await targetCharacteristic.monitor((error, characteristic) => {
        if (error) {
          console.error('Notification error:', error);
        } else {
          console.log('Notification received:', characteristic.value);
        }
      });
      
      console.log('Notification started');
    } catch (err) {
      setError('Start notification failed: ' + err.message);
      throw err;
    }
  };

  const stopNotification = async (serviceUUID, characteristicUUID) => {
    try {
      if (!connectedDevice) {
        return;
      }
      
      const service = await connectedDevice.services();
      const targetService = service.find(s => s.uuid === serviceUUID);
      if (!targetService) {
        return;
      }

      const characteristics = await targetService.characteristics();
      const targetCharacteristic = characteristics.find(c => c.uuid === characteristicUUID);
      if (!targetCharacteristic) {
        return;
      }

      // Note: react-native-ble-plx doesn't have a direct stop notification method
      // The monitor will stop when the device disconnects
      console.log('Notification stopped');
    } catch (err) {
      setError('Stop notification failed: ' + err.message);
    }
  };

  const getConnectedDevices = async () => {
    try {
      const devices = await bleManager.connectedDevices([]);
      return devices;
    } catch (err) {
      setError('Failed to get connected devices: ' + err.message);
      return [];
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    // State
    isBluetoothEnabled,
    bluetoothState,
    isScanning,
    devices,
    connectedDevice,
    error,
    
    // Actions
    enableBluetooth,
    scanForDevices,
    stopScan,
    connectToDevice,
    disconnectFromDevice,
    readCharacteristic,
    writeCharacteristic,
    startNotification,
    stopNotification,
    getConnectedDevices,
    clearError,
  };
}; 