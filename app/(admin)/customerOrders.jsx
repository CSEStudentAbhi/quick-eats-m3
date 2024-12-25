import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const API_URL = 'http://192.168.98.187:5000';

const CustomerOrders = () => {
  const { customerId, customerName } = useLocalSearchParams();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getToken } = useAuth();

  const fetchOrders = async () => {
    try {
      const token = await getToken();
      if (!token) {
        Alert.alert('Error', 'Please login again');
        router.push('/adminLogin');
        return;
      }

      const response = await axios.get(`${API_URL}/api/orders/customer/${customerId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      Alert.alert('Error', 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [customerId]);

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-blue-400 pt-12 pb-4 px-4">
        <View className="flex-row items-center">
          <TouchableOpacity 
            onPress={() => router.back()}
            className="mr-4"
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <View>
            <Text className="text-white text-xl font-bold">{customerName}'s Orders</Text>
            <Text className="text-white">{orders.length} orders</Text>
          </View>
        </View>
      </View>

      {/* Orders List */}
      <ScrollView className="flex-1 px-4">
        {loading ? (
          <View className="items-center py-8">
            <Text>Loading orders...</Text>
          </View>
        ) : orders.length === 0 ? (
          <View className="items-center py-8 bg-gray-50 rounded-xl mt-4">
            <Ionicons name="receipt-outline" size={48} color="gray" />
            <Text className="text-gray-500 mt-2">No orders found</Text>
          </View>
        ) : (
          orders.map(order => (
            <View 
              key={order._id}
              className="bg-white rounded-xl shadow-sm p-4 mb-4 mt-4 border border-gray-100"
            >
              <View className="flex-row justify-between items-start mb-2">
                <Text className="font-bold">Order #{order._id.slice(-6)}</Text>
                <Text className={`${
                  order.status === 'completed' ? 'text-green-500' :
                  order.status === 'pending' ? 'text-yellow-500' :
                  'text-red-500'
                }`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Text>
              </View>

              <View className="mb-2">
                <Text className="text-gray-500">
                  Ordered on: {new Date(order.createdAt).toLocaleDateString()}
                </Text>
                <Text className="font-bold mt-2">₹{order.totalAmount}</Text>
              </View>

              {/* Order Items */}
              <View className="border-t border-gray-100 pt-2">
                {order.items.map((item, index) => (
                  <View key={index} className="flex-row justify-between py-1">
                    <Text>{item.quantity}x {item.name}</Text>
                    <Text>₹{item.price * item.quantity}</Text>
                  </View>
                ))}
              </View>

              {/* Actions */}
              <View className="flex-row justify-end mt-4 space-x-3">
                <TouchableOpacity 
                  className="flex-row items-center bg-blue-500 px-4 py-2 rounded-full"
                  onPress={() => {
                    // Add order details view navigation here
                    router.push({
                      pathname: '/orderDetails',
                      params: { orderId: order._id }
                    });
                  }}
                >
                  <Ionicons name="eye-outline" size={16} color="white" />
                  <Text className="text-white ml-2">View Details</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

export default CustomerOrders;
