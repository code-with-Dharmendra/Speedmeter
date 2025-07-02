# BLE Implementation Guide - Corrected Version

## Overview
This guide explains the corrected Bluetooth Low Energy (BLE) implementation using `react-native-ble-plx` instead of `react-native-ble-manager`.

## What Was Fixed

### 1. Package Installation
✅ **Correct Package**: Using `react-native-ble-plx` instead of `react-native-ble-manager`
```bash
npm install --save react-native-ble-plx
npx pod-install  # For iOS (macOS only)
```

### 2. Android Permissions
✅ **Updated AndroidManifest.xml** with all required permissions:
```xml
<uses-permission android:name="android.permission.BLUETOOTH" />
<uses-permission android:name="android.permission.BLUETOOTH_CONNECT" />
<uses-permission android:name="android.permission.BLUETOOTH_SCAN" />
<uses-permission android:name="android.permission.BLUETOOTH_ADMIN" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
```

### 3. Android Native Integration
✅ **Updated MainApplication.kt** to include BlePackage:
```kotlin
import com.polidea.reactnativeble.BlePackage

override fun getPackages(): List<ReactPackage> =
    PackageList(this).packages.apply {
        add(BlePackage())
    }
```

### 4. Permission Handling
✅ **Runtime Permissions** for Android 12+ and older versions:
```javascript
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
```

### 5. Bluetooth Enable Function
✅ **Proper Enable Function** that requests permissions and prompts user:
```javascript
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
```

## How to Use

### 1. Basic Usage in Components
```javascript
import { useBleManager } from '../hooks/useBleManager';

const MyComponent = () => {
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
    error,
    clearError,
  } = useBleManager();

  // Your component logic here
};
```

### 2. Enable Bluetooth
```javascript
const handleEnableBluetooth = async () => {
  try {
    const enabled = await enableBluetooth();
    if (enabled) {
      console.log('Bluetooth is now enabled!');
    }
  } catch (error) {
    console.error('Failed to enable Bluetooth:', error);
  }
};
```

### 3. Scan for Devices
```javascript
const handleScanDevices = async () => {
  try {
    await scanForDevices();
    // Devices will be automatically added to the devices array
  } catch (error) {
    console.error('Scan failed:', error);
  }
};
```

### 4. Connect to Device
```javascript
const handleConnectDevice = async (device) => {
  try {
    await connectToDevice(device.id);
    console.log('Connected to device:', device.name);
  } catch (error) {
    console.error('Connection failed:', error);
  }
};
```

## Key Features

### ✅ Automatic Permission Handling
- Requests appropriate permissions based on Android version
- Handles both Android 12+ and older versions
- Graceful fallback for iOS

### ✅ Bluetooth State Management
- Real-time Bluetooth state monitoring
- Automatic state updates
- Proper enable/disable handling

### ✅ Device Scanning
- Automatic device discovery
- RSSI information
- Device filtering capabilities

### ✅ Connection Management
- Reliable device connections
- Automatic service discovery
- Connection state tracking

### ✅ Error Handling
- Comprehensive error messages
- Graceful error recovery
- User-friendly error alerts

## Troubleshooting

### Common Issues

1. **"Bluetooth permissions are required"**
   - Make sure all permissions are declared in AndroidManifest.xml
   - Check that runtime permissions are being requested

2. **"Bluetooth is disabled"**
   - The app will prompt users to enable Bluetooth manually
   - This is the correct behavior for Android

3. **"No devices found"**
   - Ensure Bluetooth is enabled
   - Check that devices are in pairing mode
   - Verify location permissions are granted

4. **"Connection failed"**
   - Ensure device is within range
   - Check that device supports BLE
   - Verify device is not already connected to another app

### Debug Tips

1. **Check Bluetooth State**:
   ```javascript
   console.log('Bluetooth State:', bluetoothState);
   console.log('Is Enabled:', isBluetoothEnabled);
   ```

2. **Monitor Device Discovery**:
   ```javascript
   useEffect(() => {
     console.log('Devices found:', devices.length);
     devices.forEach(device => {
       console.log('Device:', device.name, device.id);
     });
   }, [devices]);
   ```

3. **Check Permissions**:
   ```javascript
   import { PermissionsAndroid } from 'react-native';
   
   const checkPermissions = async () => {
     const permissions = await PermissionsAndroid.check(
       PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN
     );
     console.log('BLUETOOTH_SCAN permission:', permissions);
   };
   ```

## Example Components

### BleExample.js
A complete example component showing all BLE functionality:
- Bluetooth status display
- Device scanning and connection
- Modal-based device selection
- Error handling

### Homepage.js
Updated to use the new useBleManager hook with proper state management.

## Migration Notes

### From react-native-ble-manager to react-native-ble-plx

1. **Package Change**: Replace `react-native-ble-manager` with `react-native-ble-plx`
2. **API Changes**: The new hook provides a cleaner, more React-friendly API
3. **Permission Handling**: More robust permission management
4. **State Management**: Better integration with React state

### Removed Files
- `src/services/BleManagerService.js` - Replaced with useBleManager hook

### Updated Files
- `src/hooks/useBleManager.js` - Complete rewrite with react-native-ble-plx
- `src/navigation/Pages/Homepage.js` - Updated to use new hook
- `src/components/BleDeviceList.js` - Updated props and structure
- `android/app/src/main/AndroidManifest.xml` - Added missing permissions
- `android/app/src/main/java/com/rontomspeedlimiter/MainApplication.kt` - Added BlePackage

## Next Steps

1. **Test on Android Device**: Ensure all permissions work correctly
2. **Test on iOS Device**: Verify iOS compatibility (requires macOS for pod install)
3. **Customize Device Logic**: Add your specific BLE service/characteristic handling
4. **Add Error Recovery**: Implement retry logic for failed operations
5. **Optimize Performance**: Add device filtering and connection pooling if needed

## Support

For issues with the BLE implementation:
1. Check the troubleshooting section above
2. Verify all permissions are properly configured
3. Test on a physical device (not emulator)
4. Check device compatibility with BLE 