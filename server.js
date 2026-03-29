const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({message: "Campus Food Ordering API is running"});
});

// Import routes
const studentRoutes = require('./routes/students');
const menuItemRoutes = require('./routes/menuItems');
const orderRoutes = require('./routes/orders');
const analyticsRoutes = require('./routes/analytics');

// Use routes
app.use('/students', studentRoutes); 
app.use('/menu-items', menuItemRoutes); 
app.use('/orders', orderRoutes);
app.use('/analytics', analyticsRoutes);

// Database Connection
console.log('🔄 Connecting to MongoDB ...');
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('✅ Connected to MongoDB!');
        app.listen(PORT, () => {
            console.log('='.repeat(50));
            console.log(`✅ Server running on http://localhost:${PORT}`);
            console.log(`📋 Health check: http://localhost:${PORT}/`);
            console.log('='.repeat(50));
        });
    })
    .catch(err => {
        console.error('❌ MongoDB Connection Error:', err.message);
        console.error('💡 Please check your MONGODB_URI in .env file');
    });
