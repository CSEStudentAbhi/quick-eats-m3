import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useLocalSearchParams, router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useAuth } from '../../context/AuthContext'
import axios from 'axios'

const API_URL = 'http://192.168.98.187:5000';

const OrderDetails = () => {
  const { orderId } = useLocalSearchParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const { getToken } = useAuth();

  // Fetch order details
  const fetchOrderDetails = async () => {
    try {
      const token = await getToken();
      if (!token) {
        Alert.alert('Error', 'Please login again');
        router.push('/adminLogin');
        return;
      }

      const response = await axios.get(`${API_URL}/api/orders/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setOrder(response.data);
    } catch (error) {
      console.error('Error fetching order details:', error);
      Alert.alert('Error', 'Failed to fetch order details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const handleUpdateStatus = async (newStatus) => {
    try {
      const token = await getToken();
      if (!token) {
        Alert.alert('Error', 'Please login again');
        router.push('/adminLogin');
        return;
      }

      await axios.put(
        `${API_URL}/api/orders/${orderId}/status`,
        { status: newStatus },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      // Update local state
      setOrder(prev => ({ ...prev, status: newStatus }));
      Alert.alert('Success', `Order status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating order status:', error);
      Alert.alert('Error', 'Failed to update order status');
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text>Loading order details...</Text>
      </View>
    );
  }

  if (!order) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text>Order not found</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-blue-400 pt-12 pb-6 px-4">
        <View className="flex-row items-center">
          <TouchableOpacity 
            onPress={() => router.back()}
            className="mr-4"
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-xl font-bold">Order Details</Text>
        </View>
      </View>

      {/* Order Info */}
      <View className="p-4">
        <View className="bg-white rounded-xl shadow-sm p-4 mb-4">
          {/* Order Header */}
          <View className="flex-row justify-between items-start mb-4">
            <View>
              <Text className="text-2xl font-bold text-gray-800">
                Order #{order._id.slice(-6)}
              </Text>
              <Text className="text-gray-500">
                {new Date(order.createdAt).toLocaleString()}
              </Text>
            </View>
            <View className={`px-4 py-2 rounded-full ${getStatusColor(order.status)}`}>
              <Text className="font-semibold">{order.status}</Text>
            </View>
          </View>

          {/* Customer Details */}
          <View className="bg-gray-50 p-4 rounded-xl mb-4">
            <Text className="font-bold text-gray-800 mb-2">Customer Details</Text>
            <Text className="text-gray-600">Name: {order.userDetails?.fullName || 'N/A'}</Text>
            <Text className="text-gray-600">Room: {order.userDetails?.roomNo || 'N/A'}</Text>
            <Text className="text-gray-600">Email: {order.userDetails?.email || 'N/A'}</Text>
            <Text className="text-gray-600">Phone: {order.userDetails?.phone || 'N/A'}</Text>
          </View>

          {/* Order Items */}
          <View className="mb-4">
            <Text className="font-bold text-gray-800 mb-2">Order Items</Text>
            {order.items.map((item, index) => (
              <View 
                key={index}
                className="flex-row justify-between items-center py-2 border-b border-gray-100"
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
            <View className="flex-row justify-between items-center mt-4 pt-2 border-t border-gray-200">
              <Text className="font-bold text-gray-800">Total Amount</Text>
              <Text className="font-bold text-blue-500 text-lg">
                ₹{order.totalAmount.toFixed(2)}
              </Text>
            </View>
          </View>

          {/* Status Update Buttons */}
          {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
            <View className="mt-4">
              <Text className="font-bold text-gray-800 mb-2">Update Status</Text>
              <View className="flex-row flex-wrap gap-2">
                {['Preparing', 'On the way', 'Delivered'].map((status) => (
                  order.status !== status && (
                    <TouchableOpacity
                      key={status}
                      onPress={() => handleUpdateStatus(status)}
                      className={`px-4 py-2 rounded-full ${
                        status === 'Delivered' ? 'bg-green-500' : 'bg-blue-500'
                      }`}
                    >
                      <Text className="text-white font-semibold">
                        Mark as {status}
                      </Text>
                    </TouchableOpacity>
                  )
                ))}
              </View>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

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

export default OrderDetails;
