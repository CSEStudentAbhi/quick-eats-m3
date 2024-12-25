import { View, Text, TextInput, TouchableOpacity, Image, SafeAreaView, ScrollView, Alert } from 'react-native'
import React, { useState } from 'react'
import { router } from 'expo-router'
import axios from 'axios';

// Replace with your actual IP address
const API_URL = 'http://192.168.98.187:5000';

const Signup = () => {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [roomno, setRoomno] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSignup = async () => {
    try {
        setLoading(true);
        
        // Basic validation
        if (!fullName || !email || !phone || !roomno || !password || !confirmPassword) {
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

        const response = await axios.post(`${API_URL}/api/auth/signup`, {
            fullName,
            email,
            phone,
            roomNo: roomno,
            password,
            foodPreference: 'none'
        });

        if (response.data.token) {
            Alert.alert(
                'Success',
                'Account created successfully!',
                [
                    {
                        text: 'OK',
                        onPress: () => router.push('/home')
                    }
                ]
            );
        }
    } catch (error) {
        console.error('Signup error:', error);
        
        if (error.response) {
            // Server responded with an error
            Alert.alert('Error', error.response.data.message || 'Signup failed');
        } else if (error.request) {
            // Request was made but no response
            Alert.alert(
                'Connection Error',
                'Cannot connect to server. Please check your internet connection and try again.'
            );
        } else {
            // Error in request setup
            Alert.alert('Error', 'An unexpected error occurred');
        }
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
          <Text className="font-bold">Back</Text>
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
          <Text className="text-2xl font-bold mt-4 text-gray-800">Create Account</Text>
          <Text className="text-gray-600 mt-2">Sign up to get started</Text>
        </View>

        {/* Signup Form */}
        <View className="space-y-4">
          {/* Full Name Input */}
          <View className="space-y-2">
            <Text className="text-gray-700 ml-4">Full Name</Text>
            <TextInput
              value={fullName}
              onChangeText={setFullName}
              placeholder="Enter your full name"
              className="bg-gray-100 p-4 rounded-2xl"
            />
          </View>

          {/* Email Input */}
          <View className="space-y-2">
            <Text className="text-gray-700 ml-4">Email Address</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
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
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
              className="bg-gray-100 p-4 rounded-2xl"
            />
          </View>
          {/* Room no */}
          <View className="space-y-2">
            <Text className="text-gray-700 ml-4">Room Number</Text>
            <TextInput
              value={roomno}
              onChangeText={setRoomno}
              placeholder="Enter your Room number"
              keyboardType="phone-pad"
              className="bg-gray-100 p-4 rounded-2xl"
            />
          </View>

          {/* Password Input */}
          <View className="space-y-2">
            <Text className="text-gray-700 ml-4">Password</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Create a password"
              secureTextEntry
              className="bg-gray-100 p-4 rounded-2xl"
            />
          </View>

          {/* Confirm Password Input */}
          <View className="space-y-2">
            <Text className="text-gray-700 ml-4">Confirm Password</Text>
            <TextInput
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm your password"
              secureTextEntry
              className="bg-gray-100 p-4 rounded-2xl"
            />
          </View>

          {/* Signup Button */}
          <TouchableOpacity 
            onPress={handleSignup}
            disabled={loading}
            className={`bg-blue-500 p-4 rounded-2xl mt-4 ${loading ? 'opacity-70' : ''}`}
          >
            <Text className="text-white text-center font-bold text-lg">
              {loading ? 'Creating Account...' : 'Sign Up'}
            </Text>
          </TouchableOpacity>

          {/* Login Link */}
          <View className="flex-row justify-center mt-4 mb-8">
            <Text className="text-gray-600">Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/login')}>
              <Text className="text-blue-500 font-bold">Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Signup