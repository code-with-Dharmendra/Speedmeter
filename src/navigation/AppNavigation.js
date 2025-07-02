import React from 'react';
import { Text, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Homepage from './Pages/Homepage';
import Slider from '@react-native-community/slider';

const Stack = createNativeStackNavigator();

const HomeScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Home Screen</Text>
  </View>
);

const AppNavigation = () => (
  <Stack.Navigator>
    <Stack.Screen name="Homepage" component={Homepage} options={{
    title: 'DistributorHome',
    headerShown: false,
    headerStyle: {
        backgroundColor: '#4e2d87'
    }, headerTintColor: '#fff' }} />
  </Stack.Navigator>



);

export default AppNavigation;







