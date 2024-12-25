import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'

const Refunds = () => {
  const refundHistory = [
    {
      id: 'REF001',
      orderId: 'ORD123',
      amount: '₹250',
      status: 'Completed',
      date: '15 Mar 2024',
      reason: 'Order cancelled',
    },
    {
      id: 'REF002',
      orderId: 'ORD456',
      amount: '₹180',
      status: 'Processing',
      date: '12 Mar 2024',
      reason: 'Item unavailable',
    },
    {
      id: 'REF003',
      orderId: 'ORD789',
      amount: '₹350',
      status: 'Pending',
      date: '10 Mar 2024',
      reason: 'Wrong item delivered',
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-600';
      case 'Processing':
        return 'bg-yellow-100 text-yellow-600';
      case 'Pending':
        return 'bg-orange-100 text-orange-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <ScrollView className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-blue-400 pt-12 pb-6 px-4 rounded-b-3xl">
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-xl font-bold text-white">Refunds</Text>
          <TouchableOpacity onPress={() => router.push('settings')}>
            <Ionicons name="close" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <View className="px-4 pb-20 -mt-4">
        {/* Refund History */}
        <View className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <Text className="text-lg font-bold text-gray-800 mb-4">Refund History</Text>
          
          {refundHistory.length > 0 ? (
            refundHistory.map(refund => (
              <View 
                key={refund.id}
                className="border-b border-gray-100 py-4 last:border-0"
              >
                <View className="flex-row justify-between items-start mb-2">
                  <View>
                    <Text className="font-semibold text-gray-800">Order #{refund.orderId}</Text>
                    <Text className="text-gray-500 text-sm">{refund.date}</Text>
                  </View>
                  <Text className="font-bold text-blue-500">{refund.amount}</Text>
                </View>
                
                <View className="flex-row justify-between items-center mt-2">
                  <Text className="text-gray-600">{refund.reason}</Text>
                  <View className={`px-3 py-1 rounded-full ${getStatusColor(refund.status)}`}>
                    <Text className="font-medium">{refund.status}</Text>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <View className="items-center py-8">
              <Ionicons name="receipt-outline" size={48} color="gray" />
              <Text className="text-gray-500 mt-2">No refund history</Text>
            </View>
          )}
        </View>

        {/* Refund Policy */}
        <View className="bg-white rounded-xl shadow-sm p-4">
          <View className="flex-row items-center mb-4">
            <Ionicons name="information-circle-outline" size={24} color="#3b82f6" />
            <Text className="text-lg font-bold text-gray-800 ml-2">Refund Policy</Text>
          </View>
          
          <View className="space-y-3">
            <View>
              <Text className="font-semibold text-gray-800 mb-1">Refund Timeline</Text>
              <Text className="text-gray-600">
                Refunds are typically processed within 5-7 business days after approval.
              </Text>
            </View>

            <View>
              <Text className="font-semibold text-gray-800 mb-1">Eligible Reasons</Text>
              <Text className="text-gray-600">
                • Order cancelled before preparation{'\n'}
                • Item quality issues{'\n'}
                • Incorrect item delivered{'\n'}
                • Significant delay in delivery
              </Text>
            </View>

            <View>
              <Text className="font-semibold text-gray-800 mb-1">How to Request</Text>
              <Text className="text-gray-600">
                Go to Orders → Select Order → Request Refund → Select Reason
              </Text>
            </View>

            <TouchableOpacity 
              className="flex-row items-center mt-2"
              onPress={() => router.push('support')}
            >
              <Text className="text-blue-500 font-semibold">Need help with refund?</Text>
              <Ionicons name="chevron-forward" size={16} color="#3b82f6" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  )
}

export default Refunds

const styles = StyleSheet.create({})