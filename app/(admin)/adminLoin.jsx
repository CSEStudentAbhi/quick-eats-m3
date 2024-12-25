import { View, Text, TextInput, TouchableOpacity, Image, SafeAreaView, Alert, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'



const API_URL = 'http://192.168.98.187:5000';
const AdminLogin = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleAdminLogin = async () => {
    try {
        setLoading(true);
        
        // Add validation
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        console.log('Attempting to login...');

        const response = await axios.post(`${API_URL}/api/auth/login`, {
            email,
            password
        });

        console.log('Login response:', response.data);

        // Check if we have a token in the response
        if (response.data.token) {
            console.log('Login successful, attempting to save token...');
            await login(response.data.token, response.data.user);
            console.log('Token saved, attempting navigation...');
            router.replace('/adminDashboard');
        } else {
            console.log('Login failed: No token in response');
            Alert.alert('Error', 'Login failed - Invalid response');
        }
    } catch (error) {
        console.error('Login error:', error);
        Alert.alert('Error', error.response?.data?.message || 'Failed to login');
    } finally {
        setLoading(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-blue-400">
      {/* Header Section */}
      <View className="flex-row justify-start p-4">
        <TouchableOpacity 
          onPress={() => router.back()}
          className="bg-white p-2 rounded-full"
        >
          <Ionicons name="arrow-back" size={24} color="#3b82f6" />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <ScrollView>


      
      <View className="flex-1 bg-white rounded-t-[50px] mb-20 p-8">
        <View className="items-center mb-10">
          <Image 
            source={require('../../assets/logo.jpeg')} 
            className="w-32 h-32 rounded-full"
          />
          <Text className="text-2xl font-bold mt-4 text-gray-800">Admin Login</Text>
          <Text className="text-gray-600 mt-2">Access admin dashboard</Text>
        </View>

        {/* Login Form */}
        <View className="space-y-4">
          <View className="space-y-2">
            <Text className="text-gray-700 ml-4">Admin Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Enter admin email"
              keyboardType="email-address"
              autoCapitalize="none"
              className="bg-gray-100 p-4 rounded-2xl"
            />
          </View>

          <View className="space-y-2">
            <Text className="text-gray-700 ml-4">Password</Text>
            <View className="flex-row items-center bg-gray-100 rounded-2xl">
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Enter admin password"
                secureTextEntry={!showPassword}
                className="flex-1 p-4"
              />
              <TouchableOpacity 
                onPress={() => setShowPassword(!showPassword)}
                className="px-4"
              >
                <Ionicons 
                  name={showPassword ? "eye-off-outline" : "eye-outline"} 
                  size={24} 
                  color="gray" 
                />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity 
            onPress={handleAdminLogin}
            className="bg-blue-500 p-4 rounded-2xl mt-6"
          >
            <Text className="text-white text-center font-bold text-lg">Login as Admin</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => router.push('/adminRegister')}
            className="bg-blue-500 p-4 rounded-2xl mt-6"
          >
            <Text className="text-white text-center font-bold text-lg">Register as Admin</Text>
          </TouchableOpacity>

          {/* Security Notice */}
          <View className="mt-6 p-4 bg-yellow-50 rounded-xl">
            <View className="flex-row items-center mb-2">
              <Ionicons name="warning-outline" size={24} color="#f59e0b" />
              <Text className="text-yellow-600 font-bold ml-2">Security Notice</Text>
            </View>
            <Text className="text-yellow-700">
              This area is restricted to authorized administrators only. Unauthorized access attempts will be logged and reported.
            </Text>
          </View>

          {/* Help Section */}
          <TouchableOpacity 
            className="flex-row items-center justify-center mt-4"
            onPress={() => {
              // Add contact support logic
              Alert.alert(
                'Contact Support',
                'Please contact system administrator for access issues.',
                [{ text: 'OK' }]
              );
            }}
          >
            <Ionicons name="help-circle-outline" size={20} color="#3b82f6" />
            <Text className="text-blue-500 ml-2">Need help accessing admin panel?</Text>
          </TouchableOpacity>
        </View>
      </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default AdminLogin