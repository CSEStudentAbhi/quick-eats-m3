import { View, Text } from 'react-native'
import React from 'react'

export const snackItems = [
  {
    id: 's1',
    name: 'Samosa',
    category: 'snacks',
    price: '₹30',
    description: 'Crispy pastry with spiced potato filling',
    image: require('../../assets/samosa.jpg'),
    rating: 4.5,
  },
  {
    id: 's2',
    name: 'Vada Pav',
    category: 'snacks',
    price: '₹40',
    description: 'Mumbai style potato patty in bun',
    image: require('../../assets/vada-pav.jpg'),
    rating: 4.4,
  },
  // Add more snack items
];

const Snaks = () => {
  return (
    <View>
      <Text>Snaks</Text>
    </View>
  )
}

export default Snaks