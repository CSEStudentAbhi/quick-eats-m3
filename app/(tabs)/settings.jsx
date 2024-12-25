import { View, Text, TouchableOpacity, ScrollView, Image, StyleSheet, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { useAuth } from '../../context/AuthContext'
import axios from 'axios'

const API_URL = 'http://192.168.98.187:5000';

const Settings = () => {
  const [foodPreference, setFoodPreference] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [userData, setUserData] = useState(null);
  const { getToken, logout } = useAuth();

  // Fetch user data
  const fetchUserData = async () => {
    try {
      const token = await getToken();
      if (!token) {
        Alert.alert('Error', 'Please login again');
        router.push('/login');
        return;
      }

      const response = await axios.get(`${API_URL}/api/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setUserData(response.data);
      // If user has food preference saved, set it
      if (response.data.foodPreference) {
        setFoodPreference(response.data.foodPreference);
        setIsSaved(true);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      if (error.response?.status === 401) {
        Alert.alert('Session Expired', 'Please login again');
        router.push('/login');
      }
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  // Save food preference
  const saveFoodPreference = async () => {
    try {
      const token = await getToken();
      if (!token) {
        Alert.alert('Error', 'Please login again');
        router.push('/login');
        return;
      }

      await axios.put(`${API_URL}/api/auth/update-preferences`, 
        { foodPreference },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      setIsSaved(true);
      Alert.alert('Success', 'Food preferences saved successfully');
    } catch (error) {
      console.error('Error saving preferences:', error);
      Alert.alert('Error', 'Failed to save preferences');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Error', 'Failed to logout');
    }
  };

  const menuItems = [
    {
      id: 1,
      title:'Profile',
      icon:'person-outline',
      route:'/(tabs)/profile'
    },
    {
      id: 2,
      title: 'Orders',
      icon: 'receipt-outline',
      route: '/orders'
    },
    {
      id: 3,
      title: 'Customer Support & FAQ',
      icon: 'help-circle-outline',
      route: '/support'
    },
    {
      id: 4,
      title: 'Addresses',
      icon: 'location-outline',
      route: '/addresses'
    },
    {
      id: 5,
      title: 'Refunds',
      icon: 'card-outline',
      route: '/refunds'
    }
  ];

  if (!userData) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white">
      {/* Blue Header Background */}
      <View className="bg-blue-400 pt-12 pb-6 px-4 rounded-b-3xl">
        {/* Header */}
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-xl font-bold text-white">Settings</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="close" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* User Profile Card */}
        <TouchableOpacity 
          className="bg-white rounded-xl p-4 shadow-lg"
          onPress={() => router.push('profile')}
        >
          <View className="flex-row items-center">
            <Image 
              source={require('../../assets/profile.png')}
              className="w-16 h-16 rounded-full border-2 border-blue-400"
              defaultSource={require('../../assets/profile.png')}
            />
            <View className="ml-4 flex-1">
              <Text className="text-lg font-bold text-gray-800">{userData.fullName}</Text>
              <Text className="text-gray-500">{userData.email}</Text>
              <Text className="text-gray-500">Room: {userData.roomNo}</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#3b82f6" />
          </View>
        </TouchableOpacity>
      </View>

      <View className="px-4 pb-20 -mt-4">
        {/* Food Preferences Section */}
        <View className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <Text className="text-gray-900 mb-4 font-semibold">What are your food preferences?</Text>
          
          {/* Food Preference Options */}
          <View className="space-y-3">
            <TouchableOpacity 
              onPress={() => setFoodPreference('vegetarian')}
              className="flex-row items-center"
            >
              <View className={`w-5 h-5 rounded-full border-2 ${
                foodPreference === 'vegetarian' ? 'border-blue-500' : 'border-gray-300'
              } items-center justify-center mr-3`}>
                {foodPreference === 'vegetarian' && (
                  <View className="w-3 h-3 rounded-full bg-blue-500" />
                )}
              </View>
              <Text className="text-lg text-gray-700">Vegetarian</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => setFoodPreference('non-vegetarian')}
              className="flex-row items-center"
            >
              <View className={`w-5 h-5 rounded-full border-2 ${
                foodPreference === 'non-vegetarian' ? 'border-blue-500' : 'border-gray-300'
              } items-center justify-center mr-3`}>
                {foodPreference === 'non-vegetarian' && (
                  <View className="w-3 h-3 rounded-full bg-blue-500" />
                )}
              </View>
              <Text className="text-lg text-gray-700">Non-vegetarian</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => setFoodPreference('eggetarian')}
              className="flex-row items-center"
            >
              <View className={`w-5 h-5 rounded-full border-2 ${
                foodPreference === 'eggetarian' ? 'border-blue-500' : 'border-gray-300'
              } items-center justify-center mr-3`}>
                {foodPreference === 'eggetarian' && (
                  <View className="w-3 h-3 rounded-full bg-blue-500" />
                )}
              </View>
              <Text className="text-lg text-gray-700">Eggetarian</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={saveFoodPreference}
              className={`mt-4 flex-row items-center ${
                isSaved ? 'bg-blue-100' : 'bg-blue-600'
              } rounded-full p-2`}
            >
              <View className='flex-1 flex-row items-center justify-center space-x-2'>
                <Ionicons 
                  name={isSaved ? "checkmark-circle" : "checkmark-circle-outline"} 
                  size={20} 
                  color={isSaved ? "#3b82f6" : "white"} 
                />
                <Text className={`${
                  isSaved ? 'text-blue-500' : 'text-white'
                } text-center`}>
                  {isSaved ? 'Saved' : 'Save Preference'}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Menu Items */}
        <View className="bg-white rounded-xl shadow-sm p-4 space-y-4">
          {menuItems.map(item => (
            <TouchableOpacity 
              key={item.id}
              onPress={() => router.push(item.route)}
              className="flex-row items-center justify-between py-3 border-b border-gray-100"
            >
              <View className="flex-row items-center">
                <Ionicons name={item.icon} size={24} color="#3b82f6" className="mr-3" />
                <Text className="text-lg text-gray-700">{item.title}</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#3b82f6" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity 
          className="mt-8 mb-8 bg-red-50 py-4 rounded-full"
          onPress={handleLogout}
        >
          <Text className="text-red-500 text-lg font-semibold text-center">Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Settings;

const styles = StyleSheet.create({})