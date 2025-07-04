import { View, Text } from 'react-native'
import React from 'react'
import HomeScreen from './src/screens/HomeScreen'
import { ThemeProvider } from './src/hooks/ThemeContext'

const App = () => {
  return (
    <ThemeProvider>
      <HomeScreen></HomeScreen>
    </ThemeProvider>    
  )
}

export default App