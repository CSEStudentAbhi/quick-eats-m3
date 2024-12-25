import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native'
import React, { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'

const Addresses = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [addressDetails, setAddressDetails] = useState({
    apartmentName: 'Prestige Apartments',
    roomNo: '305',
    floorNo: '3',
    tower: 'A',
    landmark: 'Near Metro Station'
  });

  const [editedDetails, setEditedDetails] = useState({ ...addressDetails });

  const handleSave = () => {
    // Validate room number, floor, and tower
    if (!editedDetails.roomNo || !editedDetails.floorNo || !editedDetails.tower) {
      alert('Please fill in all required fields');
      return;
    }

    setAddressDetails(editedDetails);
    setIsEditing(false);
  };

  return (
    <ScrollView className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-blue-400 pt-12 pb-6 px-4 rounded-b-3xl">
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-xl font-bold text-white">My Address</Text>
          <TouchableOpacity onPress={() => router.push('settings')}>
            <Ionicons name="close" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Apartment Image */}
        <View className="items-center mb-4">
          <Image 
            source={require('../../assets/apartment.jpg')}
            className="w-full h-40 rounded-xl"
            resizeMode="cover"
          />
        </View>
      </View>

      <View className="px-4 pb-20 -mt-4">
        {/* Address Details Form */}
        <View className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-bold text-gray-800">Address Details</Text>
            <TouchableOpacity 
              onPress={() => isEditing ? handleSave() : setIsEditing(true)}
              className={`px-4 py-2 rounded-full ${isEditing ? 'bg-blue-500' : 'bg-blue-100'}`}
            >
              <Text className={isEditing ? 'text-white' : 'text-blue-500'}>
                {isEditing ? 'Save' : 'Edit'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Non-editable Fields */}
          <View className="space-y-4">
            <View>
              <Text className="text-gray-600 mb-1">Apartment Name</Text>
              <View className="bg-gray-50 p-3 rounded-lg">
                <Text className="text-gray-500">{addressDetails.apartmentName}</Text>
              </View>
            </View>

            {/* Editable Fields */}
            <View className="flex-row space-x-3">
              <View className="flex-1">
                <Text className="text-gray-600 mb-1">Room No<Text className="text-red-500">*</Text></Text>
                <TextInput
                  value={editedDetails.roomNo}
                  onChangeText={(text) => setEditedDetails({ ...editedDetails, roomNo: text })}
                  className={`bg-gray-50 p-3 rounded-lg ${!isEditing ? 'text-gray-500' : 'text-gray-800'}`}
                  editable={isEditing}
                  keyboardType="numeric"
                  placeholder="Enter Room No"
                />
              </View>

              <View className="w-24">
                <Text className="text-gray-600 mb-1">Floor<Text className="text-red-500">*</Text></Text>
                <TextInput
                  value={editedDetails.floorNo}
                  onChangeText={(text) => setEditedDetails({ ...editedDetails, floorNo: text })}
                  className={`bg-gray-50 p-3 rounded-lg ${!isEditing ? 'text-gray-500' : 'text-gray-800'}`}
                  editable={isEditing}
                  keyboardType="numeric"
                  placeholder="Floor"
                />
              </View>

              <View className="w-24">
                <Text className="text-gray-600 mb-1">Tower<Text className="text-red-500">*</Text></Text>
                <TextInput
                  value={editedDetails.tower}
                  onChangeText={(text) => setEditedDetails({ ...editedDetails, tower: text })}
                  className={`bg-gray-50 p-3 rounded-lg ${!isEditing ? 'text-gray-500' : 'text-gray-800'}`}
                  editable={isEditing}
                  placeholder="Tower"
                />
              </View>
            </View>

            {/* Non-editable Landmark */}
            <View>
              <Text className="text-gray-600 mb-1">Landmark</Text>
              <View className="bg-gray-50 p-3 rounded-lg">
                <Text className="text-gray-500">{addressDetails.landmark}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Delivery Instructions */}
        <View className="bg-white rounded-xl shadow-sm p-4">
          <View className="flex-row items-center mb-4">
            <Ionicons name="information-circle-outline" size={24} color="#3b82f6" />
            <Text className="text-lg font-bold text-gray-800 ml-2">Delivery Instructions</Text>
          </View>
          <Text className="text-gray-600">
            • Delivery will be made to your door{'\n'}
            • Please ensure someone is available to receive the order{'\n'}
            • Keep your phone handy for delivery updates
          </Text>
        </View>
      </View>
    </ScrollView>
  )
}

export default Addresses

const styles = StyleSheet.create({})