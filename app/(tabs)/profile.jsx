import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, Alert, Image } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { useAuth } from '../../context/AuthContext'
import axios from 'axios'

const API_URL = 'http://192.168.98.187:5000';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [editedDetails, setEditedDetails] = useState(null);
  const { getToken, logout } = useAuth();

  // Fetch user profile data
  const fetchUserProfile = async () => {
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

      setUserDetails(response.data);
      setEditedDetails(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      if (error.response?.status === 401) {
        Alert.alert('Session Expired', 'Please login again');
        router.push('/login');
      }
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const handleSave = async () => {
    try {
      // Validate phone number
      const phoneRegex = /^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/;
      if (!phoneRegex.test(editedDetails.phone.replace(/\s/g, ''))) {
        Alert.alert('Invalid Phone Number', 'Please enter a valid Indian phone number');
        return;
      }

      const token = await getToken();
      if (!token) {
        Alert.alert('Error', 'Please login again');
        router.push('/login');
        return;
      }

      const response = await axios.put(
        `${API_URL}/api/auth/update-profile`,
        {
          fullName: editedDetails.fullName,
          phone: editedDetails.phone,
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      setUserDetails(response.data);
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              const token = await getToken();
              if (!token) {
                Alert.alert('Error', 'Please login again');
                router.push('/login');
                return;
              }

              await axios.delete(`${API_URL}/api/auth/delete-account`, {
                headers: {
                  'Authorization': `Bearer ${token}`
                }
              });

              await logout();
              router.push('/login');
            } catch (error) {
              console.error('Error deleting account:', error);
              Alert.alert('Error', 'Failed to delete account');
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  if (!userDetails) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="bg-blue-400 pt-12 pb-6 px-4 rounded-b-3xl">
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-xl font-bold text-white">Profile</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/settings')}>
            <Ionicons name="close" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Profile Picture Section */}
        <View className="items-center mb-4">
          <View className="relative">
            <Image
              source={require('../../assets/profile.png')}
              className="w-24 h-24 rounded-full border-4 border-white"
            />
            <TouchableOpacity
              className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-2"
              onPress={() => {
                // Add image picker logic here
                Alert.alert('Coming Soon', 'Profile picture upload will be available soon');
              }}
            >
              <Ionicons name="camera" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View className="px-4 pb-20 -mt-4">
        {/* Profile Details Form */}
        <View className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-bold text-gray-800">Personal Details</Text>
            <TouchableOpacity
              onPress={() => isEditing ? handleSave() : setIsEditing(true)}
              className={`px-4 py-2 rounded-full ${isEditing ? 'bg-blue-500' : 'bg-blue-100'}`}
            >
              <Text className={isEditing ? 'text-white' : 'text-blue-500'}>
                {isEditing ? 'Save' : 'Edit'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Form Fields */}
          <View className="space-y-4">
            <View>
              <Text className="text-gray-600 mb-1">Full Name</Text>
              <TextInput
                value={editedDetails.fullName}
                onChangeText={(text) => setEditedDetails({ ...editedDetails, fullName: text })}
                className={`bg-gray-50 p-3 rounded-lg ${!isEditing ? 'text-gray-500' : 'text-gray-800'}`}
                editable={isEditing}
              />
            </View>

            <View>
              <Text className="text-gray-600 mb-1">Email</Text>
              <TextInput
                value={editedDetails.email}
                className="bg-gray-50 p-3 rounded-lg text-gray-500"
                editable={false}
                keyboardType="email-address"
              />
            </View>

            <View>
              <Text className="text-gray-600 mb-1">Phone Number</Text>
              <TextInput
                value={editedDetails.phone}
                onChangeText={(text) => setEditedDetails({ ...editedDetails, phone: text })}
                className={`bg-gray-50 p-3 rounded-lg ${!isEditing ? 'text-gray-500' : 'text-gray-800'}`}
                editable={isEditing}
                keyboardType="phone-pad"
              />
            </View>

            <View>
              <Text className="text-gray-600 mb-1">Room Number</Text>
              <TextInput
                value={editedDetails.roomNo}
                className="bg-gray-50 p-3 rounded-lg text-gray-500"
                editable={false}
              />
            </View>
          </View>
        </View>

        {/* Delete Account Button */}
        <TouchableOpacity
          onPress={handleDeleteAccount}
          className="bg-red-50 p-4 rounded-xl"
        >
          <View className="flex-row items-center justify-center space-x-2">
            <Ionicons name="trash-outline" size={20} color="#ef4444" />
            <Text className="text-red-500 font-semibold">Delete Account</Text>
          </View>
        </TouchableOpacity>
        <View className='px-8'>
          <Text className='text-gray-500 text-sm'>
            <Text className='font-semibold text-red-500'>Delete your account</Text> to remove all your data from our servers. This action cannot be undone.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default Profile;

const styles = StyleSheet.create({})