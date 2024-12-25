import { View, Text, ScrollView, TouchableOpacity, TextInput, Image } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { useAuth } from '../../context/AuthContext'
import axios from 'axios'

const API_URL = 'http://192.168.98.187:5000';

const Customers = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getToken } = useAuth();

  const filters = ['All', 'Active', 'Inactive', 'New'];

  const fetchCustomers = async () => {
    try {
      const token = await getToken();
      if (!token) {
        Alert.alert('Error', 'Please login again');
        router.push('/adminLogin');
        return;
      }

      const response = await axios.get(`${API_URL}/api/auth/users`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setCustomers(response.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        Alert.alert('Session Expired', 'Please login again');
        router.push('/adminLogin');
      } else {
        Alert.alert('Error', 'Failed to fetch customers');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = 
      customer.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.includes(searchQuery);

    if (selectedFilter === 'All') return matchesSearch;
    
    // Add your filter logic here
    const isNew = new Date(customer.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // 7 days
    
    switch (selectedFilter) {
      case 'New':
        return matchesSearch && isNew;
      case 'Active':
        return matchesSearch && customer.lastOrder && new Date(customer.lastOrder) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // 30 days
      case 'Inactive':
        return matchesSearch && (!customer.lastOrder || new Date(customer.lastOrder) <= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
      default:
        return matchesSearch;
    }
  });

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-blue-400 pt-12 pb-6 px-4">
        <View className="flex-row justify-between items-center mb-6">
          <View className="flex-row items-center">
            <TouchableOpacity 
              onPress={() => router.back()}
              className="mr-4"
            >
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text className="text-white text-xl font-bold">Customers</Text>
          </View>
          <View className="flex-row items-center">
            <Text className="text-white mr-2">{customers.length} Total</Text>
          </View>
        </View>

        {/* Search Bar */}
        <View className="flex-row items-center bg-white rounded-xl px-4 py-2">
          <Ionicons name="search" size={20} color="gray" />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search customers..."
            className="flex-1 ml-2"
          />
        </View>

        {/* Filters */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          className="mt-4"
        >
          {filters.map(filter => (
            <TouchableOpacity
              key={filter}
              onPress={() => setSelectedFilter(filter)}
              className={`px-4 py-2 rounded-full mr-2 ${
                selectedFilter === filter 
                  ? 'bg-white' 
                  : 'bg-blue-500'
              }`}
            >
              <Text className={
                selectedFilter === filter 
                  ? 'text-blue-500 font-bold' 
                  : 'text-white'
              }>
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Customer List */}
      <ScrollView className="flex-1 px-4">
        {loading ? (
          <View className="items-center py-8">
            <Text>Loading customers...</Text>
          </View>
        ) : filteredCustomers.length === 0 ? (
          <View className="items-center py-8 bg-gray-50 rounded-xl mt-4">
            <Ionicons name="people-outline" size={48} color="gray" />
            <Text className="text-gray-500 mt-2">No customers found</Text>
          </View>
        ) : (
          filteredCustomers.map(customer => (
            <View 
              key={customer._id}
              className="bg-white rounded-xl shadow-sm p-4 mb-4 mt-4 border border-gray-100"
            >
              <View className="flex-row items-center">
                <Image 
                  source={require('../../assets/profile.png')}
                  className="w-16 h-16 rounded-full"
                />
                <View className="flex-1 ml-4">
                  <View className="flex-row justify-between items-start">
                    <View>
                      <Text className="font-bold text-lg">{customer.fullName}</Text>
                      <Text className="text-gray-500">{customer.email}</Text>
                      <Text className="text-gray-500">{customer.phone}</Text>
                      <Text className="text-gray-500">Room: {customer.roomNo}</Text>
                    </View>
                    <Text className="text-gray-500 text-sm">
                      Joined: {new Date(customer.createdAt).toLocaleDateString()}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Actions */}
              <View className="flex-row justify-end mt-4 space-x-3">
                {/* <TouchableOpacity className="flex-row items-center bg-gray-100 px-4 py-2 rounded-full">
                  <Ionicons name="mail-outline" size={16} color="gray" />
                  <Text className="text-gray-600 ml-2">Message</Text>
                </TouchableOpacity> */}
                <TouchableOpacity 
                  className="flex-row items-center bg-blue-500 px-4 py-2 rounded-full"
                  onPress={() => router.push({
                    pathname: '/customerOrders',
                    params: { 
                      customerId: customer._id,
                      customerName: customer.fullName 
                    }
                  })}
                >
                  <Ionicons name="document-text-outline" size={16} color="white" />
                  <Text className="text-white ml-2">View Orders</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

export default Customers;