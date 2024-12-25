import { View, Text, TextInput, TouchableOpacity, Image, SafeAreaView, Alert, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import axios from 'axios'

const API_URL = 'http://192.168.98.187:5000';

const AdminRegister = () => {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [adminCode, setAdminCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleAdminRegister = async () => {
    try {
      setLoading(true);

      // Basic validation
      if (!fullName || !email || !phone || !password || !confirmPassword || !adminCode) {
        Alert.alert('Error', 'Please fill in all fields');
        return;
      }

      if (password !== confirmPassword) {
        Alert.alert('Error', 'Passwords do not match');
        return;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        Alert.alert('Error', 'Please enter a valid email address');
        return;
      }

      // Phone validation (Indian format)
      const phoneRegex = /^[6-9]\d{9}$/;
      if (!phoneRegex.test(phone)) {
        Alert.alert('Error', 'Please enter a valid 10-digit phone number');
        return;
      }

      // Verify admin registration code
      if (adminCode !== 'ADMIN123') { // Replace with your secure admin code
        Alert.alert('Error', 'Invalid admin registration code');
        return;
      }

      const response = await axios.post(`${API_URL}/api/auth/admin-register`, {
        fullName,
        email,
        phone,
        password,
        role: 'admin'
      });

      if (response.data) {
        Alert.alert(
          'Success',
          'Admin account created successfully!',
          [
            {
              text: 'OK',
              onPress: () => router.push('/adminLoin')
            }
          ]
        );
      }
    } catch (error) {
      console.error('Admin registration error:', error);
      if (error.response?.status === 400) {
        Alert.alert('Error', error.response.data.message);
      } else {
        Alert.alert('Error', 'Failed to create admin account. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

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
      <ScrollView 
        className="flex-1 bg-white rounded-t-[50px]"
        contentContainerStyle={{ padding: 32, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="items-center mb-8">
          <Image 
            source={require('../../assets/logo.jpeg')} 
            className="w-32 h-32 rounded-full"
          />
          <Text className="text-2xl font-bold mt-4 text-gray-800">Admin Registration</Text>
          <Text className="text-gray-600 mt-2">Create admin account</Text>
        </View>

        {/* Registration Form */}
        <View className="space-y-4">
          {/* Full Name Input */}
          <View className="space-y-2">
            <Text className="text-gray-700 ml-4">Full Name</Text>
            <TextInput
              value={fullName}
              onChangeText={setFullName}
              placeholder="Enter full name"
              className="bg-gray-100 p-4 rounded-2xl"
            />
          </View>

          {/* Email Input */}
          <View className="space-y-2">
            <Text className="text-gray-700 ml-4">Email Address</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Enter email"
              keyboardType="email-address"
              autoCapitalize="none"
              className="bg-gray-100 p-4 rounded-2xl"
            />
          </View>

          {/* Phone Input */}
          <View className="space-y-2">
            <Text className="text-gray-700 ml-4">Phone Number</Text>
            <TextInput
              value={phone}
              onChangeText={setPhone}
              placeholder="Enter phone number"
              keyboardType="phone-pad"
              className="bg-gray-100 p-4 rounded-2xl"
            />
          </View>

          {/* Password Input */}
          <View className="space-y-2">
            <Text className="text-gray-700 ml-4">Password</Text>
            <View className="flex-row items-center bg-gray-100 rounded-2xl">
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Create password"
                secureTextEntry={!showPassword}
                className="flex-1 p-4"
              />
              <TouchableOpacity 
                onPress={() => setShowPassword(!showPassword)}
                className="px-4"
              >
                <Text className="text-gray-500">
                  {showPassword ? 'Hide' : 'Show'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Confirm Password Input */}
          <View className="space-y-2">
            <Text className="text-gray-700 ml-4">Confirm Password</Text>
            <TextInput
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm password"
              secureTextEntry={!showPassword}
              className="bg-gray-100 p-4 rounded-2xl"
            />
          </View>

          {/* Admin Code Input */}
          <View className="space-y-2">
            <Text className="text-gray-700 ml-4">Admin Registration Code</Text>
            <TextInput
              value={adminCode}
              onChangeText={setAdminCode}
              placeholder="Enter admin code"
              secureTextEntry
              className="bg-gray-100 p-4 rounded-2xl"
            />
          </View>

          {/* Register Button */}
          <TouchableOpacity 
            onPress={handleAdminRegister}
            disabled={loading}
            className={`bg-blue-500 p-4 rounded-2xl mt-4 ${loading ? 'opacity-70' : ''}`}
          >
            <Text className="text-white text-center font-bold text-lg">
              {loading ? 'Creating Account...' : 'Register Admin'}
            </Text>
          </TouchableOpacity>

          {/* Login Link */}
          <View className="flex-row justify-center mt-4">
            <Text className="text-gray-600">Already have an admin account? </Text>
            <TouchableOpacity onPress={() => router.push('/adminLoin')}>
              <Text className="text-blue-500 font-bold">Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AdminRegister;
