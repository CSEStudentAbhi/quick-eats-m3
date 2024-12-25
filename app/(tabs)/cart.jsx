import { View, Text, ScrollView, TouchableOpacity, Image, Modal, Linking, Alert } from 'react-native'
import React, { useState } from 'react'
import { useCart } from '../../context/CartContext'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
const API_URL = 'http://192.168.98.187:5000';

const PaymentMethodModal = ({ visible, onClose, onSelect }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end">
        <View className="bg-white rounded-t-3xl p-6">
          <View className="items-center mb-6">
            <Text className="text-xl font-bold text-gray-800">Select Payment Method</Text>
          </View>
          
          <TouchableOpacity 
            onPress={() => onSelect('COD')}
            className="bg-white border border-blue-500 rounded-xl p-4 mb-3"
          >
            <View className="flex-row items-center">
              <Ionicons name="cash-outline" size={24} color="#3b82f6" />
              <Text className="ml-3 text-blue-500 font-semibold">Cash on Delivery</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => onSelect('ONLINE')}
            className="bg-blue-500 rounded-xl p-4 mb-6"
          >
            <View className="flex-row items-center">
              <Ionicons name="card-outline" size={24} color="white" />
              <Text className="ml-3 text-white font-semibold">Pay Online</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={onClose}
            className="bg-gray-100 rounded-xl p-4"
          >
            <Text className="text-center text-gray-600">Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const Cart = () => {
  const { getToken, user } = useAuth();
  const { cartItems, addToCart, removeFromCart, decreaseQuantity, placeOrder } = useCart();

  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const renderCustomizations = (customizations) => {
    if (!customizations) return null;

    return (
      <View className="mt-2 bg-blue-50 p-3 rounded-lg">
        {/* Base Item */}
        {customizations.base && (
          <View className="flex-row">
            <Text className="text-blue-600 font-semibold">Base: </Text>
            <Text className="text-blue-600">{customizations.base.name}</Text>
          </View>
        )}

        {/* Proteins */}
        {customizations.proteins?.length > 0 && (
          <View className="flex-row flex-wrap">
            <Text className="text-blue-600 font-semibold">Proteins: </Text>
            <Text className="text-blue-600">
              {customizations.proteins.map(p => p.name).join(', ')}
            </Text>
          </View>
        )}

        {/* Vegetables */}
        {customizations.vegetables?.length > 0 && (
          <View className="flex-row flex-wrap">
            <Text className="text-blue-600 font-semibold">Vegetables: </Text>
            <Text className="text-blue-600">
              {customizations.vegetables.map(v => v.name).join(', ')}
            </Text>
          </View>
        )}

        {/* Extras */}
        {customizations.extras?.length > 0 && (
          <View className="flex-row flex-wrap">
            <Text className="text-blue-600 font-semibold">Extras: </Text>
            <Text className="text-blue-600">
              {customizations.extras.map(e => e.name).join(', ')}
            </Text>
          </View>
        )}
      </View>
    );
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = parseFloat(item.price.replace('₹', ''));
      return total + (price * item.quantity);
    }, 0);
  };

  const handleUPIPayment = (amount) => {
    try {
      // Create UPI payment URL
      const upiUrl = `upi://pay?pa=abhishekambi2003@oksbi&pn=QuickEats&am=${amount}&cu=INR&tn=Food Order Payment`;
      
      Linking.canOpenURL(upiUrl).then(supported => {
        if (supported) {
          Linking.openURL(upiUrl).then(() => {
            // After UPI app opens, show confirmation dialog
            setTimeout(() => {
              Alert.alert(
                'Payment Confirmation',
                'Did you complete the payment?',
                [
                  {
                    text: 'Yes, Payment Complete',
                    onPress: async () => {
                      const token = await getToken();
                      processOrder(token, amount, 'ONLINE');
                    }
                  },
                  {
                    text: 'No, Cancel Order',
                    style: 'cancel'
                  }
                ]
              );
            }, 1000);
          });
        } else {
          Alert.alert(
            'Error',
            'No UPI payment apps found on this device',
            [
              {
                text: 'OK',
                onPress: () => console.log('No UPI apps')
              }
            ]
          );
        }
      }).catch(err => {
        console.error('UPI URL Error:', err);
        Alert.alert('Error', 'Failed to open UPI payment');
      });
    } catch (error) {
      console.error('UPI Payment Error:', error);
      Alert.alert(
        'Payment Error',
        'Unable to initialize UPI payment. Please try another payment method.'
      );
    }
  };

  const handleCheckout = async (paymentMethod) => {
    try {
      const token = await getToken();

      if (!token) {
        Alert.alert('Error', 'Please login to place order');
        router.push('/login');
        return;
      }

      const totalAmount = calculateTotal();

      if (paymentMethod === 'ONLINE') {
        handleUPIPayment(totalAmount);
      } else {
        // For COD, directly process the order
        await processOrder(token, totalAmount, paymentMethod);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to process order'
      );
    }
  };

  const processOrder = async (token, totalAmount, paymentMethod) => {
    try {
      const formattedItems = cartItems.map(item => ({
        name: item.name,
        price: parseFloat(item.price.replace('₹', '')),
        quantity: item.quantity,
        image: item.image || '',
        customizations: item.customizations || null
      }));

      const response = await axios.post(
        `${API_URL}/api/orders`,
        {
          items: formattedItems,
          totalAmount: parseFloat(totalAmount.toFixed(2)),
          paymentMethod: paymentMethod
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data) {
        placeOrder(); // Clear cart
        Alert.alert(
          'Success',
          'Order placed successfully!',
          [
            {
              text: 'View Order',
              onPress: () => router.push('/orders')
            }
          ]
        );
      }
    } catch (error) {
      throw error;
    }
  };

  const showPaymentOptions = () => {
    Alert.alert(
      'Select Payment Method',
      'Choose how you would like to pay',
      [
        {
          text: 'Cash on Delivery',
          onPress: () => handleCheckout('COD')
        },
        {
          text: 'Online Payment',
          onPress: () => handleCheckout('ONLINE')
        },
        {
          text: 'Cancel',
          style: 'cancel'
        }
      ],
      { cancelable: true }
    );
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header with Blue Background */}
      <View className="bg-blue-400 pt-12 pb-6 px-4 rounded-b-3xl">
        <View className="flex-row justify-between items-center">
          <Text className="text-2xl font-bold text-white">Your Cart</Text>
          <View className="bg-blue-300 px-3 py-1 rounded-full">
            <Text className="text-white font-semibold">{cartItems.length} items</Text>
          </View>
        </View>
      </View>

      <ScrollView 
        className="flex-1 px-4 -mt-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {cartItems.length === 0 ? (
          <View className="flex-1 items-center justify-center mt-20 bg-white rounded-xl p-8 shadow-sm">
            <Ionicons name="cart-outline" size={64} color="#3b82f6" />
            <Text className="text-gray-500 mt-4 text-lg text-center">Your cart is empty</Text>
            <TouchableOpacity 
              onPress={() => router.push('/menu')}
              className="mt-6 bg-blue-500 px-8 py-3 rounded-full"
            >
              <Text className="text-white font-bold">Browse Menu</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {cartItems.map(item => (
              <View 
                key={item.id}
                className="bg-white mb-4 rounded-xl shadow-sm p-4"
              >
                <View className="flex-row items-start">
                  <Image 
                    source={item.image}
                    className="w-20 h-20 rounded-lg"
                  />
                  <View className="flex-1 ml-4">
                    <View className="flex-row justify-between items-start w-full">
                      <View className="flex-1 pr-2">
                        <Text className="text-lg font-bold text-gray-800">
                          {item.name}
                          {item.customizations && (
                            <Text className="text-blue-500 text-sm"> (Customized)</Text>
                          )}
                        </Text>
                      </View>
                      <TouchableOpacity 
                        onPress={() => removeFromCart(item.id)}
                        className="p-1"
                      >
                        <Ionicons name="close-circle" size={22} color="#ef4444" />
                      </TouchableOpacity>
                    </View>
                    
                    {item.customizations && renderCustomizations(item.customizations)}

                    <Text className="text-blue-500 font-bold mt-2">{item.price}</Text>
                    
                    <View className="flex-row items-center justify-between mt-2">
                      <View className="flex-row items-center bg-gray-100 rounded-full">
                        <TouchableOpacity 
                          onPress={() => decreaseQuantity(item.id)}
                          className="p-2"
                        >
                          <Ionicons name="remove" size={16} color="#4b5563" />
                        </TouchableOpacity>
                        
                        <Text className="mx-4 font-bold">{item.quantity}</Text>
                        
                        <TouchableOpacity 
                          onPress={() => addToCart(item)}
                          className="p-2"
                        >
                          <Ionicons name="add" size={16} color="#4b5563" />
                        </TouchableOpacity>
                      </View>

                      <Text className="text-gray-600 font-semibold">
                        ₹{(parseFloat(item.price.replace('₹', '')) * item.quantity).toFixed(2)}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            ))}

            {/* Checkout Section */}
            <View className="bg-white rounded-xl shadow-sm p-4 mt-4">
              <View className="flex-row justify-between items-center pb-4 border-b border-gray-100">
                <Text className="text-lg text-gray-600">Total Amount</Text>
                <Text className="text-xl font-bold text-blue-500">
                  ₹{calculateTotal().toFixed(2)}
                </Text>
              </View>
              
              <TouchableOpacity 
                onPress={() => setShowPaymentModal(true)}
                className="bg-blue-500 py-4 rounded-full mt-4"
              >
                <Text className="text-white text-center font-bold text-lg">
                  Place Order
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>

      <PaymentMethodModal 
        visible={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onSelect={(method) => {
          setShowPaymentModal(false);
          handleCheckout(method);
        }}
      />
    </View>
  )
}

export default Cart