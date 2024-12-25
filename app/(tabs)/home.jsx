import { View, Text, ScrollView, TextInput, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from 'expo-router'
import { useCart } from '../../context/CartContext'
import { router } from 'expo-router'

const Home = () => {
  let navigation=useNavigation()
  const { addToCart, cartItems } = useCart();

  // Sample data for featured items
  const featuredItems = [
    { id: 1, name: 'Chicken Biryani', price: '₹180', image: require('../../assets/biryani.jpg') },
    { id: 2, name: 'Butter Naan', price: '₹40', image: require('../../assets/naan.jpg') },
    { id: 3, name: 'Paneer Tikka', price: '₹160', image: require('../../assets/paneer.jpg') },
    { id:4, name:'Thali', price:'₹199', image:require('../../assets/thali.jpg')}
  ]

  // Sample data for categories
  const categories = [
    { id: 1, name: 'Breakfast', icon: '🍳' },
    { id: 2, name: 'Lunch', icon: '🍱' },
    { id: 3, name: 'Dinner', icon: '🍽️' },
    { id: 4, name: 'Snacks', icon: '🍿' },
    { id: 5, name: 'Customize', icon: '👨‍🍳' },
  ]

  // Check if item is in cart
  const isInCart = (itemId) => {
    return cartItems.some(item => item.id === itemId);
  };

  const handleAddToCart = (item) => {
    addToCart(item);
  }

  const handleCustomize = () => {
    // Add your customize navigation logic here
    console.log('Navigate to customize page')
  }

  const handleCategoryPress = (categoryName) => {
    if (categoryName === 'Customize') {
      router.push(`/Customize`);
    } else {
      router.push(`/menu`);
    }
  };

  return (
    <ScrollView 
      className="flex-1 bg-white"
      contentContainerStyle={{ paddingBottom: 80 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View className="bg-blue-400 pt-8 pb-4 px-4">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-white text-lg">Deliver to Prestige</Text>
            <Text className="text-white text-xl font-bold">Floor 3, No 305</Text>
          </View>
          <Text className="text-white text-lg font-bold ml-10">Quick Eats</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('home')}
          >
            <Image 
              source={require('../../assets/logo.jpeg')} 
              className="w-10 h-10 rounded-full"
            />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View className="flex-row items-center bg-white rounded-full mt-4 px-4 py-2">
          <Ionicons name="search" size={20} color="gray" />
          <TextInput
            placeholder="Search for dishes..."
            className="ml-2 flex-1"
          />
        </View>
      </View>

      {/* Special Offers Banner */}
      <View className="m-4">
        <TouchableOpacity className="bg-blue-100 p-4 rounded-xl">
          <Text className="text-blue-800 font-bold text-lg">Special Offer! 🎉</Text>
          <Text className="text-blue-600">20% off on your first order</Text>
        </TouchableOpacity>
      </View>

      {/* Categories with Customize option */}
      <View className="mx-4 mb-6">
        <Text className="text-lg font-bold mb-4">Categories</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories.map(category => (
            <TouchableOpacity 
              key={category.id}
              className="mr-4 items-center"
              onPress={() => handleCategoryPress(category.name)}
            >
              <View className={`p-4 rounded-full ${category.name === 'Customize' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                <Text className="text-2xl">{category.icon}</Text>
              </View>
              <Text className={`mt-2 ${category.name === 'Customize' ? 'text-blue-500 font-bold' : ''}`}>
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Featured Items */}
      <View className="mx-4 mb-6">
        <Text className="text-lg font-bold mb-4">Featured Items</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {featuredItems.map(item => (
            <TouchableOpacity 
              key={item.id}
              className="mr-4 bg-white rounded-xl shadow w-44"
            >
              <Image 
                source={item.image}
                className="w-44 h-40 rounded-t-xl"
              />
              <View className="p-4">
                <Text className="font-bold text-base">{item.name}</Text>
                <View className="flex-row justify-between items-center mt-3">
                  <Text className="text-blue-500 font-bold text-base">{item.price}</Text>
                  <TouchableOpacity 
                    onPress={() => handleAddToCart(item)}
                    className={`p-2 rounded-full ${
                      isInCart(item.id) ? 'bg-green-500' : 'bg-blue-500'
                    }`}
                  >
                    <Ionicons 
                      name={isInCart(item.id) ? "checkmark" : "add"} 
                      size={24} 
                      color="white" 
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Today's Special */}
      <View className="mx-4 mb-6">
        <Text className="text-lg font-bold mb-4">Today's Special</Text>
        <View className="bg-orange-100 p-5 rounded-xl">
          <View className="flex-row items-center">
            <Image 
              source={require('../../assets/thali.jpg')}
              className="w-24 h-24 rounded-xl mr-4"
              resizeMode="cover"
            />
            <View className="flex-1">
              <Text className="text-orange-800 font-bold text-lg">Chef's Special Thali</Text>
              <Text className="text-orange-600 mt-1">Limited time offer: ₹199 only</Text>
            </View>
          </View>
          <View className="flex-row justify-between items-center mt-4">
            <TouchableOpacity className="bg-orange-500 px-6 py-3 rounded-full">
              <Text className="text-white font-bold text-base">Order Now</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => handleAddToCart({ 
                id: 'special', 
                name: "Chef's Special Thali", 
                price: '₹199',
                image: require('../../assets/thali.jpg'),
                description: 'Complete Indian Thali with variety of dishes'
              })}
              className={`p-3 rounded-full ${
                isInCart('special') ? 'bg-green-500' : 'bg-orange-500'
              }`}
            >
              <Ionicons 
                name={isInCart('special') ? "checkmark" : "cart"} 
                size={24} 
                color="white" 
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  )
}

export default Home