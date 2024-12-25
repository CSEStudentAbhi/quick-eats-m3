import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { useCart } from '../../context/CartContext'
import { router } from 'expo-router'
import * as ImagePicker from 'expo-image-picker';

const Customize = () => {
  const { addToCart } = useCart();
  const [totalPrice, setTotalPrice] = useState(0);
  const [savedItems, setSavedItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState({
    base: null,
    proteins: [],
    vegetables: [],
    extras: [],
  });
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [customFood, setCustomFood] = useState({
    name: '',
    image: null,
  });

  // Base options
  const baseOptions = [
    { id: 'b1', name: 'Rice', price: 40, image: require('../../assets/rice.jpg') },
    { id: 'b2', name: 'Noodles', price: 50, image: require('../../assets/noodles.jpg') },
    { id: 'b3', name: 'Roti', price: 30, image: require('../../assets/roti.jpg') },
  ];

  // Protein options
  const proteinOptions = [
    { id: 'p1', name: 'Chicken', price: 80, image: require('../../assets/chicken.jpg') },
    { id: 'p2', name: 'Paneer', price: 60, image: require('../../assets/paneer.jpg') },
    { id: 'p3', name: 'Egg', price: 40, image: require('../../assets/egg.jpg') },
  ];

  // Vegetable options
  const vegetableOptions = [
    { id: 'v1', name: 'Mixed Veg', price: 30, image: require('../../assets/mixed-veg.jpg') },
    { id: 'v2', name: 'Mushroom', price: 40, image: require('../../assets/mushroom.jpg') },
    { id: 'v3', name: 'Corn', price: 25, image: require('../../assets/corn.jpeg') },
  ];

  // Extra options
  const extraOptions = [
    { id: 'e1', name: 'Cheese', price: 30, image: require('../../assets/cheese.jpg') },
    { id: 'e2', name: 'Sauce', price: 20, image: require('../../assets/sauce.jpg') },
    { id: 'e3', name: 'Masala', price: 15, image: require('../../assets/masala.jpg') },
  ];

  // Update total price whenever selections change
  useEffect(() => {
    updateTotalPrice();
  }, [selectedItems]);

  const handleBaseSelect = (base) => {
    setSelectedItems(prev => ({
      ...prev,
      base: prev.base?.id === base.id ? null : base
    }));
  };

  const handleItemToggle = (item, category) => {
    setSelectedItems(prev => {
      const currentItems = prev[category] || [];
      const exists = currentItems.some(i => i.id === item.id);
      
      return {
        ...prev,
        [category]: exists
          ? currentItems.filter(i => i.id !== item.id)
          : [...currentItems, item]
      };
    });
  };

  const updateTotalPrice = () => {
    const basePrice = selectedItems.base?.price || 0;
    const proteinsPrice = selectedItems.proteins.reduce((sum, item) => sum + item.price, 0);
    const vegetablesPrice = selectedItems.vegetables.reduce((sum, item) => sum + item.price, 0);
    const extrasPrice = selectedItems.extras.reduce((sum, item) => sum + item.price, 0);
    
    setTotalPrice(basePrice + proteinsPrice + vegetablesPrice + extrasPrice);
  };

  const handleAddToCart = () => {
    if (!selectedItems.base) {
      alert('Please select a base item');
      return;
    }

    const customItem = {
      id: `custom-${Date.now()}`,
      name: 'Custom Meal',
      price: `₹${totalPrice}`,
      description: `${selectedItems.base.name} with ${selectedItems.proteins.length} proteins, ${selectedItems.vegetables.length} vegetables, and ${selectedItems.extras.length} extras`,
      image: selectedItems.base.image,
      customizations: {...selectedItems},
      specialInstructions: specialInstructions.trim()
    };

    addToCart(customItem);
    
    // Reset form after adding to cart
    setSelectedItems({
      base: null,
      proteins: [],
      vegetables: [],
      extras: [],
    });
    setSpecialInstructions('');
    setTotalPrice(0);
    
    router.push('/cart');
  };

  const handleSaveToList = () => {
    if (!selectedItems.base) {
      alert('Please select a base item');
      return;
    }

    const customItem = {
      id: `custom-${Date.now()}`,
      name: 'Custom Meal',
      price: totalPrice,
      description: `${selectedItems.base.name} with ${selectedItems.proteins.length} proteins, ${selectedItems.vegetables.length} vegetables, and ${selectedItems.extras.length} extras`,
      image: selectedItems.base.image,
      customizations: {...selectedItems},
      specialInstructions: specialInstructions.trim()
    };

    setSavedItems(prev => [...prev, customItem]);
    
    // Reset selections
    setSelectedItems({
      base: null,
      proteins: [],
      vegetables: [],
      extras: [],
    });
    setSpecialInstructions('');
    setTotalPrice(0);
    alert('Item saved to list!');
  };

  const handleAddCustomFood = () => {
    if (!customFood.name) {
      alert('Please enter a name for your custom food');
      return;
    }

    const newFood = {
      id: `custom-food-${Date.now()}`,
      name: customFood.name,
      price: '₹0', // Price format matching cart requirements
      image: customFood.image || require('../../assets/custom-food.jpg'),
      description: 'Custom added food',
      quantity: 1
    };

    // Add directly to cart instead of extras section
    addToCart(newFood);
    
    // Reset the form
    setCustomFood({ name: '', image: null });

    // Navigate to cart
    router.push('/cart');
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        setCustomFood(prev => ({ 
          ...prev, 
          image: { uri: result.assets[0].uri } 
        }));
      }
    } catch (error) {
      alert('Error picking image');
    }
  };

  const renderSection = (title, items, selectedItems, category) => (
    <View className="mb-6">
      <Text className="text-lg font-bold mb-3">{title}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {items.map(item => {
          const isSelected = category === 'base'
            ? selectedItems.base?.id === item.id
            : selectedItems[category].some(i => i.id === item.id);

          return (
            <TouchableOpacity
              key={item.id}
              onPress={() => category === 'base' 
                ? handleBaseSelect(item) 
                : handleItemToggle(item, category)
              }
              className={`mr-4 bg-white rounded-xl shadow ${
                isSelected ? 'border-2 border-blue-500' : ''
              }`}
            >
              <View className="relative">
                <Image
                  source={item.image}
                  className="w-24 h-24 rounded-t-xl"
                />
                <View className={`absolute top-2 right-2 rounded-full p-1 ${
                  isSelected ? 'bg-blue-500' : 'bg-gray-200'
                }`}>
                  <Ionicons 
                    name={isSelected ? "checkmark" : "add"} 
                    size={16} 
                    color={isSelected ? "white" : "gray"} 
                  />
                </View>
              </View>
              <View className="p-2">
                <Text className={`font-semibold ${
                  isSelected ? 'text-blue-500' : 'text-gray-700'
                }`}>
                  {item.name}
                </Text>
                <Text className={isSelected ? 'text-blue-500' : 'text-gray-600'}>
                  ₹{item.price}
                </Text>
                <Text className="text-xs text-gray-500">
                  {isSelected ? 'Tap to remove' : 'Tap to add'}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );

  return (
    <View className="flex-1 bg-white pt-12 pb-20">
      <View className="px-4 flex-row items-center justify-between">
        <Text className="text-2xl font-bold text-gray-800">Customize Your Meal</Text>
      </View>

      <ScrollView className="flex-1 px-4 mt-4">
        {renderSection('Choose Your Base', baseOptions, selectedItems, 'base')}
        {renderSection('Add Proteins', proteinOptions, selectedItems, 'proteins')}
        {renderSection('Add Vegetables', vegetableOptions, selectedItems, 'vegetables')}
        {renderSection('Extra Toppings', extraOptions, selectedItems, 'extras')}

        {/* Create Own Food Section */}
        <View className="mb-6">
          <Text className="text-lg font-bold mb-3">Customize Your Own Food</Text>
          <View className="bg-white rounded-xl shadow p-4">
            <View className="space-y-3">
              <View>
                <Text className="text-gray-600 mb-1">Food Name</Text>
                <TextInput
                  value={customFood.name}
                  onChangeText={(text) => setCustomFood(prev => ({ ...prev, name: text }))}
                  placeholder="Enter food name"
                  className="bg-gray-50 p-3 rounded-lg text-gray-700"
                />
              </View>
              
              <View>
                <Text className="text-gray-600 mb-1">Photo (Optional)</Text>
                <View className="flex-row items-center space-x-2">
                  {customFood.image ? (
                    <View className="relative">
                      <Image 
                        source={customFood.image} 
                        className="w-20 h-20 rounded-lg"
                      />
                      <TouchableOpacity 
                        onPress={() => setCustomFood(prev => ({ ...prev, image: null }))}
                        className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1"
                      >
                        <Ionicons name="close" size={16} color="white" />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <TouchableOpacity 
                      onPress={pickImage}
                      className="bg-gray-100 w-20 h-20 rounded-lg items-center justify-center"
                    >
                      <Ionicons name="camera" size={24} color="gray" />
                      <Text className="text-xs text-gray-500 mt-1">Add Photo</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              <TouchableOpacity 
                onPress={handleAddCustomFood}
                className="bg-blue-500 py-3 rounded-full mt-2"
              >
                <Text className="text-white text-center font-bold">
                  Add Custom Food
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Special Instructions Input */}
        <View className="mb-6">
          <Text className="text-lg font-bold mb-3">Special Instructions</Text>
          <View className="bg-white rounded-xl shadow p-4">
            <TextInput
              value={specialInstructions}
              onChangeText={setSpecialInstructions}
              placeholder="Add your special instructions here (optional)"
              multiline
              numberOfLines={3}
              className="bg-gray-50 p-3 rounded-lg text-gray-700"
              textAlignVertical="top"
            />
            <View className="flex-row flex-wrap mt-2">
              <TouchableOpacity 
                onPress={() => setSpecialInstructions(prev => prev + "Less spicy ")}
                className="bg-gray-100 px-3 py-1 rounded-full mr-2 mb-2"
              >
                <Text className="text-gray-600">Less spicy</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => setSpecialInstructions(prev => prev + "Extra spicy ")}
                className="bg-gray-100 px-3 py-1 rounded-full mr-2 mb-2"
              >
                <Text className="text-gray-600">Extra spicy</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => setSpecialInstructions(prev => prev + "No onion ")}
                className="bg-gray-100 px-3 py-1 rounded-full mr-2 mb-2"
              >
                <Text className="text-gray-600">No onion</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => setSpecialInstructions(prev => prev + "No garlic ")}
                className="bg-gray-100 px-3 py-1 rounded-full mr-2 mb-2"
              >
                <Text className="text-gray-600">No garlic</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => setSpecialInstructions("")}
                className="bg-red-100 px-3 py-1 rounded-full mr-2 mb-2"
              >
                <Text className="text-red-600">Clear</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Saved Items Section */}
        {savedItems.length > 0 && (
          <View className="mt-6 mb-20">
            <Text className="text-lg font-bold mb-3">Saved Items</Text>
            {savedItems.map((item, index) => (
              <View key={item.id} className="bg-white rounded-xl shadow p-4 mb-3">
                <View className="flex-row justify-between items-center">
                  <Text className="font-bold">Custom Meal {index + 1}</Text>
                  <TouchableOpacity 
                    onPress={() => setSavedItems(prev => 
                      prev.filter(i => i.id !== item.id)
                    )}
                    className="p-1"
                  >
                    <Ionicons name="close-circle" size={24} color="#ef4444" />
                  </TouchableOpacity>
                </View>
                <Text className="text-gray-600 mt-1">{item.description}</Text>
                <View className="flex-row justify-between items-center mt-2">
                  <Text className="text-blue-500 font-bold">₹{item.price}</Text>
                  <TouchableOpacity 
                    onPress={() => {
                      addToCart({...item, price: `₹${item.price}`});
                      alert('Added to cart!');
                    }}
                    className="bg-blue-500 py-2 px-4 rounded-full"
                  >
                    <Text className="text-white font-bold">Add to Cart</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Bottom Buttons */}
      <View className="p-4 border-t border-gray-200 bg-white">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-lg font-bold">Total Price:</Text>
          <Text className="text-xl font-bold text-blue-500">₹{totalPrice}</Text>
        </View>
        
        <View className="flex-row space-x-4">
          <TouchableOpacity
            onPress={handleSaveToList}
            className="flex-1 bg-gray-500 py-4 rounded-full"
          >
            <Text className="text-white text-center font-bold text-lg">
              Add to List
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleAddToCart}
            className="flex-1 bg-blue-500 py-4 rounded-full"
          >
            <Text className="text-white text-center font-bold text-lg">
              Add to Cart
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Customize

const styles = StyleSheet.create({})