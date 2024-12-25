const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [{
        name: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        image: String,
        customizations: {
            base: {
                name: String,
                price: Number
            },
            proteins: [{
                name: String,
                price: Number
            }],
            vegetables: [{
                name: String,
                price: Number
            }],
            extras: [{
                name: String,
                price: Number
            }]
        }
    }],
    totalAmount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'preparing', 'on the way', 'delivered', 'cancelled'],
        default: 'pending'
    },
    userDetails: {
        fullName: String,
        email: String,
        phone: String,
        roomNo: String
    }
}, {
    timestamps: true
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order; 