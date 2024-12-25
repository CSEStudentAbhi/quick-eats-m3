const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
// const { authenticateToken } = require('../middleware/auth');

// Middleware to verify JWT token
const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        try {
            const decoded = jwt.verify(token, 'your_jwt_secret');
            const user = await User.findById(decoded.userId);
            
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Set the complete user object in req.user
            req.user = {
                _id: user._id,
                userId: user._id,
                fullName: user.fullName,
                email: user.email,
                phone: user.phone,
                roomNo: user.roomNo,
                role: user.role
            };
            next();
        } catch (tokenError) {
            if (tokenError.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Token expired' });
            }
            return res.status(403).json({ message: 'Invalid token' });
        }
    } catch (error) {
        console.error('Auth error:', error);
        return res.status(500).json({ message: 'Server error during authentication' });
    }
};

// Create new order
router.post('/', authenticateToken, async (req, res) => {
    try {
        const { items, totalAmount } = req.body;
        console.log('Creating order with data:', { items, totalAmount }); // Debug log
        console.log('User data:', req.user); // Debug log

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: 'Invalid items data' });
        }

        // Create new order with explicit userId
        const newOrder = new Order({
            userId: req.user._id, // Use _id directly from req.user
            items: items.map(item => ({
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                image: item.image,
                customizations: item.customizations
            })),
            totalAmount,
            status: 'pending',
            userDetails: {
                fullName: req.user.fullName,
                email: req.user.email,
                phone: req.user.phone,
                roomNo: req.user.roomNo
            }
        });

        console.log('New order object:', newOrder); // Debug log

        await newOrder.save();
        console.log('Order saved successfully'); // Debug log

        res.status(201).json({
            message: 'Order placed successfully',
            order: newOrder
        });
    } catch (error) {
        console.error('Order creation error:', error);
        res.status(500).json({ 
            message: 'Error creating order', 
            error: error.message,
            stack: error.stack 
        });
    }
});

// Get user's orders
router.get('/my-orders', authenticateToken, async (req, res) => {
    try {
        // Debug logs
        console.log('Authenticated user:', req.user);
        console.log('User ID:', req.user._id);

        // Find orders where userId matches the authenticated user's ID
        const orders = await Order.find({ 
            userId: req.user._id  // Use _id from authenticated user
        }).sort({ createdAt: -1 }); // Sort by newest first
        
        console.log('Found orders:', orders.length);
        console.log('Orders:', orders);

        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ 
            message: 'Error fetching orders',
            error: error.message 
        });
    }
});

// Get pending orders
router.get('/pending', authenticateToken, async (req, res) => {
    try {
        // Check if user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized. Admin access required.' });
        }

        const pendingOrders = await Order.find({ status: 'pending' })
            .sort({ createdAt: -1 });
        res.json(pendingOrders);
    } catch (error) {
        console.error('Error fetching pending orders:', error);
        res.status(500).json({ message: 'Error fetching pending orders' });
    }
});

// Update order status
router.put('/:orderId/status', authenticateToken, async (req, res) => {
    try {
        // Check if user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized. Admin access required.' });
        }

        const { orderId } = req.params;
        const { status } = req.body;

        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            { status },
            { new: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json(updatedOrder);
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ message: 'Error updating order status' });
    }
});

// Get customer orders
router.get('/customer/:customerId', authenticateToken, async (req, res) => {
  try {
    // Check if requester is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const orders = await Order.find({ userId: req.params.customerId })
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error('Error fetching customer orders:', error);
    res.status(500).json({ message: 'Error fetching orders' });
  }
});

// Cancel order
router.put('/:orderId/cancel', authenticateToken, async (req, res) => {
  try {
    const order = await Order.findOne({ 
      _id: req.params.orderId,
      userId: req.user.userId 
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (!['pending', 'preparing'].includes(order.status.toLowerCase())) {
      return res.status(400).json({ message: 'Order cannot be cancelled' });
    }

    order.status = 'cancelled';
    await order.save();

    res.json(order);
  } catch (error) {
    console.error('Error cancelling order:', error);
    res.status(500).json({ message: 'Error cancelling order' });
  }
});

// Create order route
router.post('/create', authenticateToken, async (req, res) => {
  try {
    const { items, totalAmount } = req.body;
    
    const order = new Order({
      userId: req.user.userId, // Make sure this matches the user's ID
      items,
      totalAmount,
      status: 'pending'
    });

    await order.save();
    console.log('Created order:', order); // Debug log

    res.status(201).json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Error creating order' });
  }
});

// Get single order details
router.get('/:orderId', authenticateToken, async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId);
        
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json(order);
    } catch (error) {
        console.error('Error fetching order details:', error);
        res.status(500).json({ message: 'Error fetching order details' });
    }
});

// Get all orders (admin only)
router.get('/', authenticateToken, async (req, res) => {
    try {
        // Check if user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized. Admin access required.' });
        }

        const orders = await Order.find()
            .sort({ createdAt: -1 }); // Most recent first
        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Error fetching orders' });
    }
});

module.exports = router; 