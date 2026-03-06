const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Allocation = require('../../models/allocation');

// --------------------------------------------------------------------------------------------------------------------------------

router.get('/student/:registerNo', async (req, res) => {

    try {

        const { registerNo } = req.params;

        const User = mongoose.model('User');
        const student = await User.findOne({ registerNo, role: 'student' });
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        const allocations = await Allocation.find({ studentId: student._id })
            .populate('hostelId', 'hostelName location')
            .populate('roomId', 'roomNumber roomType')
            .populate('bedId', 'bedName')
            .populate('allocatedBy', 'name')
            .sort({ createdAt: -1 });
        res.json(allocations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// --------------------------------------------------------------------------------------------------------------------------------

module.exports = router;