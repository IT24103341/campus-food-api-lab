const express = require('express');
const router = express.Router();
const MenuItem = require('../models/MenuItem');

// GET /menu-items/search - Search by name/category
router.get('/search', async (req, res) => {
    try {
        const { name, category } = req.query;
        let filter = {};

        if (name) {
            filter.name = { $regex: name, $options: 'i' };
        }
        if (category) {
            filter.category = category;
        }

        const items = await MenuItem.find(filter).sort({ name: 1 });
        res.json(items);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET all menu items
router.get('/', async (req, res) => {
    try {
        const items = await MenuItem.find();
        res.json(items);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /menu-items - Create menu item
router.post('/', async (req, res) => {
    try {
        const newItem = new MenuItem(req.body);
        const saved = await newItem.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
