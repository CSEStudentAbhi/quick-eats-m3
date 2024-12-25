import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

export const breakfastItems = [
  {
    id: 'b1',
    name: 'Masala Dosa',
    category: 'breakfast',
    price: '₹80',
    description: 'Crispy dosa with potato filling',
    image: require('../../assets/dosa.jpg'),
    rating: 4.5,
  },
  {
    id: 'b2',
    name: 'Idli Sambar',
    category: 'breakfast',
    price: '₹60',
    description: 'Soft idlis with sambar and chutney',
    image: require('../../assets/idli.jpg'),
    rating: 4.3,
  },
  
  // Add more breakfast items
];

const Breakfast = () => {
  return (
    <View>
      <Text>Breakfast</Text>
    </View>
  )
}

export default Breakfast

const styles = StyleSheet.create({})