const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

router.post('/', async (req, res) => {
    try {
        const student = new Student(req.body);
        const saved = await student.save();
        res.status(201).json(saved);
    } catch (err) {
        console.error('Error creating student:', err.message);
        res.status(400).json({ error: err.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ error: 'Student not found' }); 
        }
        res.json(student); 
    } catch (err) {
        res.status(400).json({ error: 'Invalid student ID' }); 
    }
});

router.get('/', async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
