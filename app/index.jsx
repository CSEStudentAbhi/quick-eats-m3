import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { router } from 'expo-router'

const Index = () => {
  return (
    <View className='flex-1 bg-blue-400'>
    <View className='flex-1 items-center justify-center'>
      <Image source={require('../assets/logo.jpeg')} className='w-60 h-60 rounded-full' />
      <Text className=' text-2xl font-bold text-center'>Welcome</Text>
      <Text className=' text-2xl font-bold text-center'>To</Text>
      <Text className=' text-2xl font-bold text-center'>Quick Eats</Text>
      <TouchableOpacity 
        onPress={() => router.push('/login')}
        onLongPress={() => router.push('/adminLoin')}
        delayLongPress={1500}
        className="bg-white px-8 py-3 rounded-full mt-10"
      >
        <Text className="text-xl font-bold text-center">Get Started</Text>
      </TouchableOpacity>
    </View>
    </View>
  )
}

export default Index