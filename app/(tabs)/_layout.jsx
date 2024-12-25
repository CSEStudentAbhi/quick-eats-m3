import { View } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

const TabsLayout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          right: 0,
          left: 0,
          elevation: 0,
          height: 60,
          backgroundColor: 'white',
        },
        tabBarActiveTintColor: '#3b82f6', // blue-500
        tabBarInactiveTintColor: 'gray',
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="home-outline" size={24} color={color} />
          ),
          tabBarLabel: 'Home'
        }}
      />

      <Tabs.Screen
        name="menu"
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="restaurant-outline" size={24} color={color} />
          ),
          tabBarLabel: 'Menu'
        }}
      />

      <Tabs.Screen
        name="cart"
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="cart-outline" size={24} color={color} />
          ),
          tabBarLabel: 'Cart'
        }}
      />

      <Tabs.Screen
        name="orders"
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="receipt-outline" size={24} color={color} />
          ),
          tabBarLabel: 'My Orders'
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="settings-outline" size={24} color={color} />
          ),
          tabBarLabel: 'Settings'
        }}
      />

      <Tabs.Screen
        name="categories"
        options={{
          href: null,
        }}
      />


      <Tabs.Screen
        name="Customize"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
      name='Snaks'
      options={{
        href: null,
      }}
      />

      <Tabs.Screen
      name='Breakfast'
      options={{
        href: null,
      }}
      />

      <Tabs.Screen
      name='Dinner'
      options={{
        href: null,
      }}
      />

      <Tabs.Screen
      name='Lunch'
      options={{
        href: null,
      }}
      />

      <Tabs.Screen
      name='addresses'
      options={{
        href: null,
      }}
      />

      <Tabs.Screen
      name='refunds'
      options={{
        href: null,
      }}
      />

      <Tabs.Screen
      name='support'
      options={{
        href: null,
        tabBarIcon: ({ color }) => (
          <Ionicons name="help-circle-outline" size={24} color={color} />
        ),
        tabBarLabel: 'Support'
      }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          href: null,
          tabBarIcon: ({ color }) => (
            <Ionicons name="person-outline" size={24} color={color} />
          ),
          tabBarLabel: 'Profile'
        }}
      />
      

      
    </Tabs>
  )
}

export default TabsLayout