import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const BleDeviceList = ({
  devices,
  isScanning,
  connectedDevice,
  isBluetoothEnabled,
  isInitialized,
  onScanPress,
  onDevicePress,
  onDisconnectPress,
  onEnableBluetooth,
  onClose,
}) => {
  const renderDevice = ({ item }) => {
    const isConnectedDevice = connectedDevice && item.id === connectedDevice.id;
    
    return (
      <TouchableOpacity
        style={[styles.deviceItem, isConnectedDevice && styles.connectedDevice]}
        onPress={() => onDevicePress(item)}
        disabled={isConnectedDevice}
      >
        <View style={styles.deviceInfo}>
          <Text style={styles.deviceName} numberOfLines={1}>
            {item.name || item.localName || item.id || 'Unknown Device'}
          </Text>
          <Text style={styles.deviceId} numberOfLines={1}>
            {item.id}
          </Text>
          {item.rssi && (
            <Text style={styles.deviceRssi}>
              RSSI: {item.rssi} dBm
            </Text>
          )}
        </View>
        
        <View style={styles.deviceActions}>
          {isConnectedDevice ? (
            <View style={styles.connectedStatus}>
              <FontAwesome name="check-circle" size={20} color="#4CAF50" />
              <Text style={styles.connectedText}>Connected</Text>
            </View>
          ) : (
            <FontAwesome name="bluetooth" size={20} color="#2196F3" />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Bluetooth Devices</Text>
      <View style={styles.headerActions}>
        {isScanning ? (
          <View style={styles.scanningContainer}>
            <ActivityIndicator size="small" color="#2196F3" />
            <Text style={styles.scanningText}>Scanning...</Text>
          </View>
        ) : (
          <TouchableOpacity 
            style={[styles.scanButton, !isBluetoothEnabled && styles.disabledButton]} 
            onPress={onScanPress}
            disabled={!isBluetoothEnabled}
          >
            <FontAwesome name="refresh" size={16} color="#fff" />
            <Text style={styles.scanButtonText}>Scan</Text>
          </TouchableOpacity>
        )}
        
        {connectedDevice && (
          <TouchableOpacity style={styles.disconnectButton} onPress={onDisconnectPress}>
            <FontAwesome name="times" size={16} color="#fff" />
            <Text style={styles.disconnectButtonText}>Disconnect</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <FontAwesome name="times" size={20} color="#666" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderBluetoothStatus = () => (
    <View style={styles.bluetoothStatusContainer}>
      <View style={styles.statusRow}>
        <View style={[styles.statusDot, { backgroundColor: isBluetoothEnabled ? '#4CAF50' : '#f44336' }]} />
        <Text style={styles.statusText}>
          Bluetooth: {isBluetoothEnabled ? 'Enabled' : 'Disabled'}
        </Text>
      </View>
      
      {!isBluetoothEnabled && (
        <View style={styles.enableBluetoothContainer}>
          <Text style={styles.enableBluetoothText}>
            Bluetooth is required to scan for devices
          </Text>
          <TouchableOpacity 
            style={styles.enableBluetoothButton} 
            onPress={onEnableBluetooth}
          >
            <FontAwesome name="bluetooth" size={16} color="#fff" />
            <Text style={styles.enableBluetoothButtonText}>Enable Bluetooth</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <FontAwesome name="bluetooth" size={48} color="#ccc" />
      <Text style={styles.emptyText}>
        {!isInitialized ? 'Initializing...' : 
         !isBluetoothEnabled ? 'Bluetooth is disabled' :
         isScanning ? 'Scanning for devices...' : 'No devices found'}
      </Text>
      {!isBluetoothEnabled && (
        <TouchableOpacity style={styles.enableBluetoothButton} onPress={onEnableBluetooth}>
          <FontAwesome name="bluetooth" size={16} color="#fff" />
          <Text style={styles.enableBluetoothButtonText}>Enable Bluetooth</Text>
        </TouchableOpacity>
      )}
      {isBluetoothEnabled && !isScanning && (
        <TouchableOpacity style={styles.scanButton} onPress={onScanPress}>
          <FontAwesome name="refresh" size={16} color="#fff" />
          <Text style={styles.scanButtonText}>Start Scan</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {renderHeader()}
      {renderBluetoothStatus()}
      
      <FlatList
        data={devices}
        renderItem={renderDevice}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scanningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  scanningText: {
    marginLeft: 8,
    color: '#2196F3',
    fontSize: 14,
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2196F3',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginRight: 8,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  scanButtonText: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 4,
  },
  disconnectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f44336',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginRight: 8,
  },
  disconnectButtonText: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 4,
  },
  closeButton: {
    padding: 4,
  },
  bluetoothStatusContainer: {
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  enableBluetoothContainer: {
    alignItems: 'center',
  },
  enableBluetoothText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
    textAlign: 'center',
  },
  enableBluetoothButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  enableBluetoothButtonText: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 4,
  },
  listContainer: {
    flexGrow: 1,
  },
  deviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  connectedDevice: {
    backgroundColor: '#e8f5e8',
  },
  deviceInfo: {
    flex: 1,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  deviceId: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  deviceRssi: {
    fontSize: 12,
    color: '#999',
  },
  deviceActions: {
    marginLeft: 12,
  },
  connectedStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  connectedText: {
    marginLeft: 6,
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
});

export default BleDeviceList; 