import RNBluetoothClassic from 'react-native-bluetooth-classic';

export async function getBondedDevices() {
  try {
    return await RNBluetoothClassic.getBondedDevices();
  } catch (error) {
    console.error('Error getting bonded devices', error);
    return [];
  }
}

export async function connectToDevice(device) {
  try {
    return await device.connect();
  } catch (error) {
    console.error('Connection failed', error);
    throw error;
  }
}

export async function disconnectFromDevice(device) {
  try {
    await device.disconnect();
  } catch (error) {
    console.error('Disconnect failed', error);
  }
}

export async function writeToDevice(device, message) {
  try {
    await device.write(message);
  } catch (error) {
    console.error('Write failed', error);
  }
}

export async function readFromDevice(device) {
  try {
    return await device.read();
  } catch (error) {
    console.error('Read failed', error);
    return null;
  }
}

// NEW: Start device discovery
export async function startDiscovery() {
  try {
    return await RNBluetoothClassic.startDiscovery();
  } catch (error) {
    console.error('Discovery failed', error);
    return [];
  }
}
