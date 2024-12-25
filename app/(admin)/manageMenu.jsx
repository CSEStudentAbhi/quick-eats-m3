import { View, Text, ScrollView, TouchableOpacity, Image, TextInput, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import * as ImagePicker from 'expo-image-picker'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'

const API_URL = 'http://192.168.98.187:5000';

const ManageMenu = () => {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [showAddForm, setShowAddForm] = useState(false)
  const [newDish, setNewDish] = useState({
    name: '',
    price: '',
    category: '',
    description: '',
    image: null,
  })
  const [menuItems, setMenuItems] = useState([])
  const { getToken } = useAuth()

  const categories = [
    { id: 'all', name: 'All' },
    { id: 'breakfast', name: 'Breakfast' },
    { id: 'lunch', name: 'Lunch' },
    { id: 'dinner', name: 'Dinner' },
    { id: 'snacks', name: 'Snacks' },
  ]

  useEffect(() => {
    fetchMenuItems()
  }, [])

  const fetchMenuItems = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/menu`)
      setMenuItems(response.data)
    } catch (error) {
      console.error('Error fetching menu items:', error)
    }
  }

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setNewDish(prev => ({
          ...prev,
          image: result.assets[0].uri
        }));
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleAddDish = async () => {
    try {
      if (!newDish.name || !newDish.price || !newDish.category || !newDish.description || !newDish.image) {
        Alert.alert('Error', 'Please fill all fields and add an image');
        return;
      }

      const token = await getToken();
      console.log('Token before request:', token); // Debug log

      if (!token) {
        Alert.alert('Error', 'Please login again');
        router.push('/adminLogin');
        return;
      }

      const formData = new FormData();
      formData.append('name', newDish.name);
      formData.append('price', newDish.price);
      formData.append('category', newDish.category);
      formData.append('description', newDish.description);
      
      const imageUri = newDish.image;
      const filename = imageUri.split('/').pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image';
      
      formData.append('image', {
        uri: imageUri,
        name: filename,
        type
      });

      const response = await axios.post(
        `${API_URL}/api/menu`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          }
        }
      );
      console.log('Response:', response.data); // Debug log

      if (response.data) {
        fetchMenuItems();
        setShowAddForm(false);
        setNewDish({
          name: '',
          price: '',
          category: '',
          description: '',
          image: null,
        });
        Alert.alert('Success', 'Dish added successfully');
      }
    } catch (error) {
      console.error('Error details:', error.response?.data); // Debug log
      console.error('Error status:', error.response?.status); // Debug log
      console.error('Error adding dish:', error);
      if (error.response?.status === 401) {
        Alert.alert('Session Expired', 'Please login again');
        router.push('/adminLogn');
      } else {
        Alert.alert('Error', error.response?.data?.message || 'Failed to add dish');
      }
    }
  };

  const handleDeleteDish = async (itemId) => {
    try {
      const token = await getToken()
      await axios.delete(
        `${API_URL}/api/menu/${itemId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      )
      fetchMenuItems()
      Alert.alert('Success', 'Dish deleted successfully')
    } catch (error) {
      console.error('Error deleting dish:', error)
      Alert.alert('Error', 'Failed to delete dish')
    }
  }

  const filteredItems = selectedCategory === 'All' 
    ? menuItems 
    : menuItems.filter(item => 
        item.category.toLowerCase() === selectedCategory.toLowerCase()
      );

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-blue-400 pt-12 pb-6 px-4">
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center">
            <TouchableOpacity 
              onPress={() => router.back()}
              className="mr-4"
            >
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text className="text-white text-xl font-bold">Manage Menu</Text>
          </View>
          <TouchableOpacity 
            onPress={() => setShowAddForm(true)}
            className="bg-white p-2 rounded-full"
          >
            <Ionicons name="add" size={24} color="#3b82f6" />
          </TouchableOpacity>
        </View>

        {/* Categories */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          className="mt-4"
        >
          {categories.map(category => (
            <TouchableOpacity
              key={category.id}
              onPress={() => setSelectedCategory(category.name)}
              className={`px-4 py-2 rounded-full mr-2 ${
                selectedCategory === category.name 
                  ? 'bg-white' 
                  : 'bg-blue-500'
              }`}
            >
              <Text className={
                selectedCategory === category.name 
                  ? 'text-blue-500 font-bold' 
                  : 'text-white'
              }>
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Menu Items */}
      <ScrollView className="flex-1 px-4">
        {filteredItems.map(item => (
          <View 
            key={item.id}
            className="bg-white rounded-xl shadow-sm p-4 mb-4 mt-4 border border-gray-100"
          >
            <View className="flex-row">
              <Image 
                source={typeof item.image === 'string' ? { uri: item.image } : item.image}
                className="w-24 h-24 rounded-xl"
              />
              <View className="flex-1 ml-4">
                <View className="flex-row justify-between">
                  <Text className="font-bold text-lg">{item.name}</Text>
                  <TouchableOpacity 
                    onPress={() => handleDeleteDish(item.id)}
                    className="p-1"
                  >
                    <Ionicons name="trash-outline" size={20} color="#ef4444" />
                  </TouchableOpacity>
                </View>
                <Text className="text-gray-500">{item.description}</Text>
                <Text className="text-blue-500 font-bold mt-2">{item.price}</Text>
                <Text className="text-gray-400 text-sm">{item.category}</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Add Dish Modal */}
      {showAddForm && (
        <View className="absolute inset-0 bg-black/50">
          <View className="bg-white m-4 rounded-xl p-4 mt-20">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-bold">Add New Dish</Text>
              <TouchableOpacity onPress={() => setShowAddForm(false)}>
                <Ionicons name="close" size={24} color="gray" />
              </TouchableOpacity>
            </View>

            <ScrollView className="max-h-[500px]">
              {/* Image Picker */}
              <TouchableOpacity 
                onPress={pickImage}
                className="bg-gray-100 h-40 rounded-xl items-center justify-center mb-4"
              >
                {newDish.image ? (
                  <Image 
                    source={{ uri: newDish.image }}
                    className="w-full h-full rounded-xl"
                  />
                ) : (
                  <View className="items-center">
                    <Ionicons name="camera-outline" size={40} color="gray" />
                    <Text className="text-gray-500 mt-2">Add Dish Image</Text>
                  </View>
                )}
              </TouchableOpacity>

              {/* Form Fields */}
              <View className="space-y-4">
                <View>
                  <Text className="text-gray-700 mb-1">Dish Name</Text>
                  <TextInput
                    value={newDish.name}
                    onChangeText={(text) => setNewDish(prev => ({ ...prev, name: text }))}
                    placeholder="Enter dish name"
                    className="bg-gray-100 p-3 rounded-xl"
                  />
                </View>

                <View>
                  <Text className="text-gray-700 mb-1">Price (₹)</Text>
                  <TextInput
                    value={newDish.price}
                    onChangeText={(text) => setNewDish(prev => ({ ...prev, price: text }))}
                    placeholder="Enter price"
                    keyboardType="numeric"
                    className="bg-gray-100 p-3 rounded-xl"
                  />
                </View>

                <View>
                  <Text className="text-gray-700 mb-1">Category</Text>
                  <View className="flex-row flex-wrap gap-2">
                    {categories.slice(1).map(category => (
                      <TouchableOpacity
                        key={category.id}
                        onPress={() => setNewDish(prev => ({ ...prev, category: category.name }))}
                        className={`px-4 py-2 rounded-full ${
                          newDish.category === category.name 
                            ? 'bg-blue-500' 
                            : 'bg-gray-100'
                        }`}
                      >
                        <Text className={
                          newDish.category === category.name 
                            ? 'text-white' 
                            : 'text-gray-700'
                        }>
                          {category.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View>
                  <Text className="text-gray-700 mb-1">Description</Text>
                  <TextInput
                    value={newDish.description}
                    onChangeText={(text) => setNewDish(prev => ({ ...prev, description: text }))}
                    placeholder="Enter dish description"
                    multiline
                    numberOfLines={3}
                    className="bg-gray-100 p-3 rounded-xl"
                    textAlignVertical="top"
                  />
                </View>
              </View>

              <TouchableOpacity
                onPress={handleAddDish}
                className="bg-blue-500 p-4 rounded-xl mt-6"
              >
                <Text className="text-white text-center font-bold">Add Dish</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      )}
    </View>
  )
}

export default ManageMenu