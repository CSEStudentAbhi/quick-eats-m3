import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'

const API_URL = 'http://192.168.98.187:5000';

const AdminDashboard = () => {
  const [pendingOrders, setPendingOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getToken, user } = useAuth();

  useEffect(() => {
    // Check if user is admin
    if (!user || user.role !== 'admin') {
      Alert.alert('Not Authorized', 'Admin access required');
      router.push('/adminLoin');
      return;
    }

    fetchPendingOrders();
    const interval = setInterval(fetchPendingOrders, 20000); // Refresh every 20 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchPendingOrders = async () => {
    try {
      const token = await getToken();
      if (!token) {
        Alert.alert('Session Expired', 'Please login again');
        router.push('/adminLoin');
        return;
      }

      const response = await axios.get(`${API_URL}/api/orders/pending`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setPendingOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      if (error.response?.status === 403) {
        Alert.alert('Not Authorized', 'Admin access required');
        router.push('/adminLoin');
      } else {
        Alert.alert('Error', 'Failed to fetch orders');
      }
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    totalOrders: pendingOrders.length,
    activeOrders: pendingOrders.filter(order => order.status === 'Preparing').length,
    totalRevenue: `₹${pendingOrders.reduce((total, order) => total + (order.totalAmount || 0), 0).toFixed(2)}`,
    newCustomers: new Set(
      pendingOrders
        .filter(order => order.userDetails && order.userDetails.email)
        .map(order => order.userDetails.email)
    ).size
  };

  const handleAcceptOrder = async (orderId) => {
    try {
      const token = await getToken();
      if (!token) {
        Alert.alert('Error', 'Please login again');
        router.push('/adminLoin');
        return;
      }

      await axios.put(
        `${API_URL}/api/orders/${orderId}/status`,
        { status: 'Preparing' },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      // Update local state
      setPendingOrders(prev => 
        prev.map(order => 
          order._id === orderId 
            ? { ...order, status: 'Preparing' }
            : order
        )
      );

      Alert.alert('Success', 'Order accepted');
    } catch (error) {
      console.error('Error accepting order:', error);
      Alert.alert('Error', 'Failed to accept order');
    }
  };

  const handleRejectOrder = async (orderId) => {
    Alert.alert(
      'Confirm Rejection',
      'Are you sure you want to reject this order?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Reject',
          style: 'destructive',
          onPress: async () => {
            try {
              const token = await getToken();
              if (!token) {
                Alert.alert('Error', 'Please login again');
                router.push('/adminLoin');
                return;
              }

              await axios.put(
                `${API_URL}/api/orders/${orderId}/status`,
                { status: 'Cancelled' },
                {
                  headers: {
                    'Authorization': `Bearer ${token}`
                  }
                }
              );

              // Remove from local state
              setPendingOrders(prev => prev.filter(order => order._id !== orderId));
              Alert.alert('Success', 'Order rejected');
            } catch (error) {
              console.error('Error rejecting order:', error);
              Alert.alert('Error', 'Failed to reject order');
            }
          }
        }
      ]
    );
  };

  return (
    <ScrollView>
      <View className="flex-1 bg-white">
        {/* Header */}
        <View className="bg-blue-400 pt-12 pb-6 px-4">
          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-white text-2xl font-bold">Admin Dashboard</Text>
              <Text className="text-white opacity-80">
                Last updated: {new Date().toLocaleTimeString()}
              </Text>
            </View>
            <TouchableOpacity 
              onPress={() => router.push('/adminLogn')}
              className="bg-white p-2 rounded-full"
            >
              <Ionicons name="log-out-outline" size={24} color="#3b82f6" />
            </TouchableOpacity>
          </View>

          {/* Quick Stats */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            className="mt-4"
          >
            <View className="bg-blue-500 p-4 rounded-xl mr-4 w-32">
              <Text className="text-white opacity-80">Total Orders</Text>
              <Text className="text-white text-xl font-bold">{stats.totalOrders}</Text>
            </View>
            <View className="bg-green-500 p-4 rounded-xl mr-4 w-32">
              <Text className="text-white opacity-80">Active Orders</Text>
              <Text className="text-white text-xl font-bold">{stats.activeOrders}</Text>
            </View>
            <View className="bg-yellow-500 p-4 rounded-xl mr-4 w-32">
              <Text className="text-white opacity-80">Revenue</Text>
              <Text className="text-white text-xl font-bold">{stats.totalRevenue}</Text>
            </View>
            <View className="bg-purple-500 p-4 rounded-xl mr-4 w-32">
              <Text className="text-white opacity-80">New Customers</Text>
              <Text className="text-white text-xl font-bold">{stats.newCustomers}</Text>
            </View>
          </ScrollView>
        </View>

        {/* Main Content */}
        <ScrollView className="flex-1 px-4">
          {/* Quick Actions */}
          <View className="flex-row justify-between mt-6">
            <TouchableOpacity 
              className="bg-gray-100 p-4 rounded-xl flex-1 mr-2 items-center"
              onPress={() => router.push('/manageMenu')}
            >
              <Ionicons name="restaurant-outline" size={24} color="#3b82f6" />
              <Text className="mt-2 font-semibold">Manage Menu</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              className="bg-gray-100 p-4 rounded-xl flex-1 ml-2 items-center"
              onPress={() => router.push('/Customers')}
            >
              <Ionicons name="people-outline" size={24} color="#3b82f6" />
              <Text className="mt-2 font-semibold">Customers</Text>
            </TouchableOpacity>
          </View>

          {/* Pending Orders */}
          <View className="mt-6">
            <Text className="text-lg font-bold text-gray-800 mb-4">Pending Orders</Text>
            {loading ? (
              <View className="items-center py-8">
                <Text>Loading orders...</Text>
              </View>
            ) : pendingOrders.length === 0 ? (
              <View className="items-center py-8 bg-gray-50 rounded-xl">
                <Ionicons name="restaurant-outline" size={48} color="gray" />
                <Text className="text-gray-500 mt-2">No pending orders</Text>
              </View>
            ) : (
              pendingOrders.map(order => (
                <View 
                  key={order._id}
                  className="bg-white rounded-xl shadow-sm p-4 mb-4 border border-gray-100"
                >
                  <View className="flex-row justify-between items-start">
                    <View>
                      <Text className="font-bold text-gray-800">
                        Order #{order._id.slice(-6)}
                      </Text>
                      <Text className="text-gray-500 text-sm">
                        {new Date(order.createdAt).toLocaleString()}
                      </Text>
                      <Text className="text-gray-500 text-sm">
                        Customer: {order.userDetails?.fullName || 'N/A'}
                      </Text>
                      <Text className="text-gray-500 text-sm">
                        Room: {order.userDetails?.roomNo || 'N/A'}
                      </Text>
                    </View>
                    <Text className="font-bold text-blue-500">
                      ₹{(order.totalAmount || 0).toFixed(2)}
                    </Text>
                  </View>

                  {/* Order Items */}
                  <View className="mt-3 bg-gray-50 p-3 rounded-lg">
                    {order.items?.map((item, index) => (
                      <Text key={index} className="text-gray-600">
                        {item.quantity}x {item.name}
                      </Text>
                    )) || <Text className="text-gray-500">No items</Text>}
                  </View>

                  {/* Action Buttons */}
                  <View className="flex-row justify-end mt-4 space-x-3">
                    <TouchableOpacity 
                      onPress={() => handleRejectOrder(order._id)}
                      className="bg-red-50 px-4 py-2 rounded-full"
                    >
                      <Text className="text-red-500 font-semibold">Reject</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      onPress={() => handleAcceptOrder(order._id)}
                      className="bg-blue-500 px-4 py-2 rounded-full"
                    >
                      <Text className="text-white font-semibold">Accept</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </View>
        </ScrollView>
      </View>
    </ScrollView>
  );
};

export default AdminDashboard;

const styles = StyleSheet.create({})