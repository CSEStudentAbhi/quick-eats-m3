import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [orders, setOrders] = useState([]);

  const addToCart = (item) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(i => i.id === item.id);
      if (existingItem) {
        return prevItems.map(i =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prevItems, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  const decreaseQuantity = (itemId) => {
    setCartItems(prevItems => {
      return prevItems.map(item => {
        if (item.id === itemId) {
          const newQuantity = item.quantity - 1;
          return newQuantity > 0 
            ? { ...item, quantity: newQuantity }
            : null;
        }
        return item;
      }).filter(Boolean); // Remove null items (quantity = 0)
    });
  };

  const placeOrder = () => {
    if (cartItems.length === 0) return;
    
    const newOrder = {
      id: `order-${Date.now()}`,
      items: [...cartItems],
      total: cartItems.reduce((total, item) => {
        return total + (parseFloat(item.price.replace('₹', '')) * item.quantity);
      }, 0),
      date: new Date(),
      status: 'Preparing'
    };

    setOrders(prevOrders => [newOrder, ...prevOrders]);
    setCartItems([]); // Clear cart after order
    return newOrder;
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId
          ? { ...order, status: newStatus }
          : order
      )
    );
  };

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addToCart, 
      removeFromCart, 
      decreaseQuantity,
      orders,
      placeOrder,
      updateOrderStatus
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
} 