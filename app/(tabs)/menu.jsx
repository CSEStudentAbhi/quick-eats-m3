import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useCart } from '../../context/CartContext'
import { breakfastItems } from './Breakfast'
import { lunchItems } from './Lunch'
import { dinnerItems } from './Dinner'
import { snackItems } from './Snaks'

const Menu = () => {
  const { addToCart, cartItems } = useCart();

  const [selectedCategory, setSelectedCategory] = useState('All')

  // Combine all menu items
  const allMenuItems = [
    ...breakfastItems,
    ...lunchItems,
    ...dinnerItems,
    ...snackItems
  ];

  // Filter items based on selected category
  const getFilteredItems = () => {
    if (selectedCategory === 'All') return allMenuItems;
    return allMenuItems.filter(
      item => item.category.toLowerCase() === selectedCategory.toLowerCase()
    );
  };

  const categories = [
    { 
      id: 'all', 
      name: 'All', 
      icon: '🍽️',
      image: require('../../assets/all-food.jpg')
    },
    { 
      id: 'breakfast', 
      name: 'Breakfast', 
      icon: '🍳',
      image: require('../../assets/breakfast.jpg')
    },
    { 
      id: 'lunch', 
      name: 'Lunch', 
      icon: '🍱',
      image: require('../../assets/lunch.jpg')
    },
    { 
      id: 'dinner', 
      name: 'Dinner', 
      icon: '🍽️',
      image: require('../../assets/dinner.jpg')
    },
    { 
      id: 'snacks', 
      name: 'Snacks', 
      icon: '🍿',
      image: require('../../assets/snacks.jpg')
    },
  ]

  const isInCart = (itemId) => {
    return cartItems.some(item => item.id === itemId);
  };

  const handleAddToCart = (item) => {
    addToCart(item);
  }

  return (
    <View className="flex-1 bg-white pt-12 pb-20">
      {/* Header */}
      <View className="px-4 flex-row items-center justify-between">
        <Text className="text-2xl font-bold text-gray-800">Our Menu</Text>
        <TouchableOpacity 
          onPress={() => router.push('/cart')}
          className="p-2"
        >
          <Ionicons name="cart-outline" size={24} color="#3b82f6" />
        </TouchableOpacity>
      </View>

      {/* Categories with Images */}
      <View className="h-52">
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          className="mt-3"
        >
          {categories.map(category => (
            <TouchableOpacity
              key={category.id}
              onPress={() => setSelectedCategory(category.name)}
              className="mr-5 items-center"
            >
              <View className={`relative ${
                selectedCategory === category.name 
                  ? 'border-2 border-blue-500 rounded-xl' 
                  : ''
              }`}>
                <Image 
                  source={category.image}
                  className="w-24 h-40 rounded-xl"
                />
                <View className={`absolute inset-0 rounded-xl ${
                  selectedCategory === category.name 
                    ? 'bg-blue-500/20' 
                    : 'bg-black/10'
                }`} />
              </View>
              <View className="mt-2 items-center">
                <Text className={`font-semibold ${
                  selectedCategory === category.name 
                    ? 'text-blue-500' 
                    : 'text-gray-600'
                }`}>
                  {category.name}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Menu Items */}
      <ScrollView 
        className="px-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <Text className='text-lg mt-4 font-bold text-gray-800'>
          Menu Items ({getFilteredItems().length})
        </Text>
        {getFilteredItems().map(item => (
          <TouchableOpacity 
            key={item.id}
            className="bg-white mb-4 rounded-xl shadow p-4 flex-row"
          >
            <Image 
              source={item.image}
              className="w-24 h-24 rounded-xl"
            />
            <View className="flex-1 ml-4">
              <View className="flex-row justify-between items-start">
                <Text className="text-lg font-bold text-gray-800">{item.name}</Text>
                <View className="flex-row items-center">
                  <Ionicons name="star" size={16} color="#fbbf24" />
                  <Text className="ml-1 text-gray-600">{item.rating}</Text>
                </View>
              </View>
              <Text className="text-gray-500 mt-1">{item.description}</Text>
              <View className="flex-row justify-between items-center mt-2">
                <Text className="text-blue-500 font-bold text-lg">{item.price}</Text>
                <TouchableOpacity 
                  onPress={() => handleAddToCart(item)}
                  className={`px-4 py-2 rounded-full ${
                    isInCart(item.id) ? 'bg-green-500' : 'bg-blue-500'
                  }`}
                >
                  <Text className="text-white font-bold">
                    {isInCart(item.id) ? 'Added ✓' : 'Add to Cart'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  )
}

export default Menu

const styles = StyleSheet.create({})