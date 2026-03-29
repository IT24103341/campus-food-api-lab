const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const mongoose = require('mongoose');

router.get('/total-spent/:studentId', async (req, res) => {
    try {
        const stats = await Order.aggregate([
            { $match: { student: new mongoose.Types.ObjectId(req.params.studentId) } },
            { $group: { 
                _id: '$student', 
                totalAmount: { $sum: '$totalPrice' },
                orderCount: { $sum: 1 }
            }}
        ]);
        res.json(stats[0] || { message: "No orders found for this student" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/top-menu-items', async (req, res) => {
    try {
        const topItems = await Order.aggregate([
            { $unwind: '$items' },
            { $group: { 
                _id: '$items.menuItem', 
                totalQuantity: { $sum: '$items.quantity' } 
            }},
            { $sort: { totalQuantity: -1 } },
            { $limit: 5 },
            { $lookup: { 
                from: 'menuitems',
                localField: '_id',
                foreignField: '_id',
                as: 'itemDetails'
            }},
            { $unwind: '$itemDetails' }
        ]);
        res.json(topItems);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/daily-orders', async (req, res) => {
    try {
        const dailyStats = await Order.aggregate([
            { $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                orderCount: { $sum: 1 }
            }},
            { $sort: { _id: 1 } }
        ]);
        res.json(dailyStats);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
