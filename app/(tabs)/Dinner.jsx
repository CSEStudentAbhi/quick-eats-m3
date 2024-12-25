import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

export const dinnerItems = [
  {
    id: 'd1',
    name: 'Butter Chicken',
    category: 'dinner',
    price: '₹220',
    description: 'Creamy butter chicken with naan',
    image: require('../../assets/butter-chicken.jpg'),
    rating: 4.9,
  },
  {
    id: 'd2',
    name: 'Paneer Tikka',
    category: 'dinner',
    price: '₹180',
    description: 'Grilled cottage cheese with spices',
    image: require('../../assets/paneer.jpg'),
    rating: 4.7,
  },
  // Add more dinner items
];

const Dinner = () => {
  return (
    <View>
      <Text>Dinner</Text>
    </View>
  )
}

export default Dinner

const styles = StyleSheet.create({})