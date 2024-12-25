import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput } from 'react-native'
import React, { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'

const Support = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(null);

  const faqs = [
    {
      id: 1,
      question: "How do I track my order?",
      answer: "You can track your order in real-time through the 'Orders' section. Click on any active order to see its current status and location."
    },
    {
      id: 2,
      question: "What are the delivery timings?",
      answer: "We deliver from 8:00 AM to 10:00 PM. Typical delivery time is 30-45 minutes depending on your location and order volume."
    },
    {
      id: 3,
      question: "How can I customize my order?",
      answer: "Use our 'Customize' option available on menu items to modify ingredients according to your preference. You can also add special instructions."
    },
    {
      id: 4,
      question: "What is the refund policy?",
      answer: "Refunds are processed within 5-7 business days. For order issues, please report within 24 hours of delivery through the app."
    }
  ];

  const contactOptions = [
    {
      id: 1,
      title: "Chat Support",
      icon: "chatbubble-outline",
      description: "Chat with our support team",
    },
    {
      id: 2,
      title: "Call Us",
      icon: "call-outline",
      description: "Speak with customer service",
    },
    {
      id: 3,
      title: "Email Support",
      icon: "mail-outline",
      description: "Write to our support team",
    }
  ];

  return (
    <ScrollView className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-blue-400 pt-12 pb-6 px-4 rounded-b-3xl">
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-xl font-bold text-white">Help & Support</Text>
          <TouchableOpacity onPress={() => router.push('settings')}>
            <Ionicons name="close" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View className="bg-white rounded-xl flex-row items-center px-4 py-2">
          <Ionicons name="search-outline" size={20} color="gray" />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search for help"
            className="flex-1 ml-2"
          />
        </View>
      </View>

      <View className="px-4 pb-20 -mt-4">
        {/* Contact Options */}
        <View className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <Text className="text-lg font-bold text-gray-800 mb-4">Contact Us</Text>
          <View className="flex-row justify-between">
            {contactOptions.map(option => (
              <TouchableOpacity 
                key={option.id}
                className="items-center flex-1"
                onPress={() => {
                  // Add contact action here
                }}
              >
                <View className="w-12 h-12 bg-blue-100 rounded-full items-center justify-center mb-2">
                  <Ionicons name={option.icon} size={24} color="#3b82f6" />
                </View>
                <Text className="text-sm font-semibold text-gray-800">{option.title}</Text>
                <Text className="text-xs text-gray-500 text-center">{option.description}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* FAQs */}
        <View className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <Text className="text-lg font-bold text-gray-800 mb-4">Frequently Asked Questions</Text>
          {faqs.map(faq => (
            <TouchableOpacity 
              key={faq.id}
              className="mb-4"
              onPress={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
            >
              <View className="flex-row justify-between items-center">
                <Text className="text-gray-800 font-semibold flex-1 mr-2">{faq.question}</Text>
                <Ionicons 
                  name={expandedFaq === faq.id ? "chevron-up" : "chevron-down"} 
                  size={20} 
                  color="gray" 
                />
              </View>
              {expandedFaq === faq.id && (
                <Text className="text-gray-600 mt-2">{faq.answer}</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick Links */}
        <View className="bg-white rounded-xl shadow-sm p-4">
          <Text className="text-lg font-bold text-gray-800 mb-4">Quick Links</Text>
          <TouchableOpacity className="flex-row items-center py-3 border-b border-gray-100">
            <Ionicons name="document-text-outline" size={24} color="#3b82f6" />
            <Text className="text-gray-700 ml-3">Terms & Conditions</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center py-3 border-b border-gray-100">
            <Ionicons name="shield-checkmark-outline" size={24} color="#3b82f6" />
            <Text className="text-gray-700 ml-3">Privacy Policy</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center py-3">
            <Ionicons name="information-circle-outline" size={24} color="#3b82f6" />
            <Text className="text-gray-700 ml-3">About Us</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  )
}

export default Support

const styles = StyleSheet.create({})