const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');

// POST /orders - Place a new order with auto-calculated total
router.post('/', async (req, res) => {
    try {
        const { student, items } = req.body;
        
        // Calculate total price by fetching menu item prices
        let totalPrice = 0;
        for (let item of items) {
            const menuItem = await MenuItem.findById(item.menuItem);
            if (!menuItem) {
                return res.status(400).json({ error: `Menu item ${item.menuItem} not found` });
            }
            totalPrice += menuItem.price * item.quantity;
        }
        
        // Create order with calculated total
        const order = new Order({
            student,
            items,
            totalPrice
        });
        
        const savedOrder = await order.save();
        res.status(201).json(savedOrder);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// GET /orders - Get all orders with PAGINATION
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const orders = await Order.find()
            .populate('student', 'name email')
            .populate('items.menuItem', 'name price')
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        const total = await Order.countDocuments();

        res.json({
            totalOrders: total,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            orders
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /orders/:id - Get single order
router.get('/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('student', 'name email')
            .populate('items.menuItem', 'name price');
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.json(order);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// PATCH /orders/:id/status - Update order status
router.patch('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        );
        if (!updatedOrder) return res.status(404).json({ error: 'Order not found' });
        res.json(updatedOrder);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
