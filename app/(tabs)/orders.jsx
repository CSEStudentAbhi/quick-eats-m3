import { View, Text, ScrollView, TouchableOpacity, Image, Alert, StyleSheet } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { useAuth } from '../../context/AuthContext'
import axios from 'axios'

const API_URL = 'http://192.168.98.187:5000';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getToken, user } = useAuth();

  // Fetch user's orders
  const fetchOrders = async () => {
    try {
      const token = await getToken();
      if (!token) {
        Alert.alert('Error', 'Please login again');
        router.push('/login');
        return;
      }

      console.log('Fetching orders with token:', token); // Debug log

      const response = await axios.get(`${API_URL}/api/orders/my-orders`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Orders response:', response.data); // Debug log
      setOrders(response.data);
      
    } catch (error) {
      console.error('Error fetching orders:', error.response?.data || error.message);
      Alert.alert('Error', 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-600';
      case 'preparing':
        return 'bg-yellow-100 text-yellow-600';
      case 'on the way':
        return 'bg-blue-100 text-blue-600';
      case 'delivered':
        return 'bg-green-100 text-green-600';
      case 'cancelled':
        return 'bg-red-100 text-red-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text>Loading orders...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      {/* Header with Blue Background */}
      <View className="bg-blue-400 pt-12 pb-6 px-4 rounded-b-3xl">
        <View className="flex-row justify-between items-center">
          <Text className="text-2xl font-bold text-white">My Orders</Text>
          <View className="bg-blue-300 px-3 py-1 rounded-full">
            <Text className="text-white font-semibold">{orders.length} orders</Text>
          </View>
        </View>
      </View>

      <ScrollView 
        className="flex-1 px-4 -mt-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {orders.length === 0 ? (
          <View className="flex-1 items-center justify-center mt-20 bg-white rounded-xl p-8 shadow-sm">
            <Ionicons name="receipt-outline" size={64} color="#3b82f6" />
            <Text className="text-gray-500 mt-4 text-lg text-center">No orders yet</Text>
            <TouchableOpacity 
              onPress={() => router.push('/(tabs)/menu')}
              className="mt-6 bg-blue-500 px-8 py-3 rounded-full"
            >
              <Text className="text-white font-bold">Browse Menu</Text>
            </TouchableOpacity>
          </View>
        ) : (
          orders.map(order => (
            <View 
              key={order._id}
              className="bg-white mb-4 rounded-xl shadow-sm p-4"
            >
              {/* Order Header */}
              <View className="flex-row justify-between items-center mb-2">
                <View>
                  <Text className="font-bold text-lg text-gray-800">
                    Order #{order._id.slice(-6)}
                  </Text>
                  <Text className="text-gray-500 text-sm">
                    {formatDate(order.createdAt)}
                  </Text>
                </View>
                <View className={`px-3 py-1 rounded-full ${getStatusColor(order.status)}`}>
                  <Text className="font-semibold">{order.status}</Text>
                </View>
              </View>

              {/* Order Items */}
              <View className="bg-gray-50 rounded-xl p-3 mb-3">
                {order.items.map((item, index) => (
                  <View 
                    key={index}
                    className="flex-row items-center py-2 border-b border-gray-100 last:border-0"
                  >
                    <View className="flex-1">
                      <Text className="font-semibold text-gray-800">{item.name}</Text>
                      <Text className="text-gray-500">
                        {item.quantity} × ₹{item.price}
                      </Text>
                    </View>
                    <Text className="font-semibold text-gray-800">
                      ₹{(item.quantity * item.price).toFixed(2)}
                    </Text>
                  </View>
                ))}
              </View>

              {/* Order Total */}
              <View className="border-t border-gray-100 pt-3">
                <View className="flex-row justify-between items-center">
                  <Text className="text-gray-600 font-medium">Total Amount</Text>
                  <Text className="text-lg font-bold text-blue-500">
                    ₹{order.totalAmount.toFixed(2)}
                  </Text>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

export default Orders;

const styles = StyleSheet.create({})