import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import '../global.css'
import { Stack } from 'expo-router'
import { CartProvider } from '../context/CartContext'
import { AuthProvider } from '../context/AuthContext'

const RootLayout = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <Stack>
          <Stack.Screen name='index' options={{ headerShown: false }} />
          <Stack.Screen name='(auth)/login' options={{ headerShown: false }} />
          <Stack.Screen name='(auth)/signup' options={{ headerShown: false }} />
          <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
          <Stack.Screen name='(admin)/adminLoin' options={{headerShown:false}}/>
          <Stack.Screen name='(admin)/adminDashboard' options={{headerShown:false}}/>
          <Stack.Screen name='(admin)/manageMenu' options={{headerShown:false}}/>
          <Stack.Screen name='(admin)/Customers' options={{headerShown:false}}/>
          <Stack.Screen name='(admin)/adminRegister' options={{headerShown:false}}/>
          <Stack.Screen name='(admin)/customerOrders' options={{headerShown:false}}/>
        </Stack>
      </CartProvider>
    </AuthProvider>
  )
}

export default RootLayout

const styles = StyleSheet.create({})