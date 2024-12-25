import { View, Text, TextInput, TouchableOpacity, Image, SafeAreaView, Alert } from 'react-native'
import React, { useState } from 'react'
import { router } from 'expo-router'
import axios from 'axios'
import * as Google from 'expo-auth-session/providers/google'
import * as WebBrowser from 'expo-web-browser'
import { useAuth } from '../../context/AuthContext'

WebBrowser.maybeCompleteAuthSession();

const API_URL = 'http://192.168.98.187:5000';

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: "YOUR_ANDROID_CLIENT_ID",
    iosClientId: "YOUR_IOS_CLIENT_ID",
    webClientId: "YOUR_WEB_CLIENT_ID",
  });

  const { login } = useAuth();

  const handleGoogleSignIn = async () => {
    try {
      const result = await promptAsync();
      if (result?.type === 'success') {
        const accessToken = result.authentication.accessToken;
        console.log('Google Sign-in successful:', accessToken);
        // Handle the successful sign-in here
        // You might want to send this token to your backend
      }
    } catch (error) {
      console.error('Google Sign-in Error:', error);
      Alert.alert('Error', 'Failed to sign in with Google');
    }
  };

  const handleLogin = async () => {
    try {
      setLoading(true);

      // Basic validation
      if (!email || !password) {
        Alert.alert('Error', 'Please fill in all fields');
        return;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        Alert.alert('Error', 'Please enter a valid email address');
        return;
      }

      const response = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password
      });

      if (response.data.token) {
        await login(response.data.token, response.data.user);
        
        Alert.alert(
          'Success',
          'Login successful!',
          [
            {
              text: 'OK',
              onPress: () => router.push('/home')
            }
          ]
        );
      }
    } catch (error) {
      console.error('Login error:', error);
      
      if (error.response) {
        // Check for 401 status code
        if (error.response.status === 401) {
          Alert.alert(
            'Invalid Credentials',
            'The email or password you entered is incorrect. Please try again.'
          );
        } else {
          // Handle other server errors
          Alert.alert('Error', error.response.data.message || 'Login failed');
        }
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
      <View className="flex-1 bg-white rounded-t-[50px] p-8">
        <View className="items-center mb-10">
          <Image 
            source={require('../../assets/logo.jpeg')} 
            className="w-32 h-32 rounded-full"
          />
          <Text className="text-2xl font-bold mt-4 text-gray-800">Welcome Back</Text>
          <Text className="text-gray-600 mt-2">Sign in to continue</Text>
        </View>

        {/* Login Form */}
        <View className="space-y-4">
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

          <View className="space-y-2">
            <Text className="text-gray-700 ml-4">Password</Text>
            <View className="flex-row items-center bg-gray-100 rounded-2xl">
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
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

          <TouchableOpacity className="items-end">
            <Text className="text-blue-500">Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={handleLogin}
            disabled={loading}
            className={`bg-blue-500 p-4 rounded-2xl ${loading ? 'opacity-70' : ''}`}
          >
            <Text className="text-white text-center font-bold text-lg">
              {loading ? 'Signing in...' : 'Login'}
            </Text>
          </TouchableOpacity>

          {/* Separator */}
          <View className="flex-row items-center my-4">
            <View className="flex-1 h-[1px] bg-gray-300" />
            <Text className="mx-4 text-gray-500">Or continue with</Text>
            <View className="flex-1 h-[1px] bg-gray-300" />
          </View>

          {/* Google Sign In Button */}
          <TouchableOpacity 
            onPress={handleGoogleSignIn}
            className="flex-row items-center justify-center bg-white border border-gray-300 p-4 rounded-2xl"
          >
            <Image 
              source={require('../../assets/google-icon.png')} 
              className="w-5 h-5 mr-2"
            />
            <Text className="text-gray-700 font-semibold">Sign in with Google</Text>
          </TouchableOpacity>

          <View className="flex-row justify-center mt-4">
            <Text className="text-gray-600">Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/signup')}>
              <Text className="text-blue-500 font-bold">Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default Login