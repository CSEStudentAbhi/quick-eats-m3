import { View, Text } from 'react-native'
import React from 'react'

export const lunchItems = [
  {
    id: 'l1',
    name: 'Chicken Biryani',
    category: 'lunch',
    price: '₹180',
    description: 'Fragrant rice with tender chicken',
    image: require('../../assets/biryani.jpg'),
    rating: 4.8,
  },
  {
    id: 'l2',
    name: 'Veg Thali',
    category: 'lunch',
    price: '₹150',
    description: 'Complete meal with roti, dal, and sabzi',
    image: require('../../assets/thali.jpg'),
    rating: 4.6,
  },
  // Add more lunch items
];

const Luch = () => {
  return (
   <>
   </>
  )
}

export default Luch