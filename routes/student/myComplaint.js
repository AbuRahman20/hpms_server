const express = require('express');
const router = express.Router();
const Allocation = require('../../models/allocation');
const Complaint = require('../../models/complaint');
const User = require('../../models/user');

// --------------------------------------------------------------------------------------------------------------------------------

router.get('/active/:registerNo', async (req, res) => {

    try {

        const { registerNo } = req.params;
        const user = await User.findOne({ registerNo, role: 'student' });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const allocation = await Allocation.findOne({ studentId: user._id, status: 'Active' })
            .populate('hostelId', 'hostelName location')
            .populate('roomId', 'roomNumber roomType')
            .populate('bedId', 'bedName');

        if (!allocation) return res.status(404).json({ message: 'No active allocation found' });
        res.json(allocation);
    } catch (error) {
        console.error('Error fetching active allocation:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// --------------------------------------------------------------------------------------------------------------------------------

router.get('/:registerNo', async (req, res) => {

    try {

        const { registerNo } = req.params;
        const user = await User.findOne({ registerNo, role: 'student' });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const complaints = await Complaint.find({ studentId: user._id })
            .populate('studentId', 'name registerNo')
            .populate('hostelId', 'hostelName')
            .populate('roomId', 'roomNumber')
            .populate('resolvedBy', 'name')
            .sort({ createdAt: -1 });

        res.json(complaints);
    } catch (error) {
        console.error('Error fetching complaints:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// --------------------------------------------------------------------------------------------------------------------------------

router.post('/:registerNo', async (req, res) => {

    try {

        const { registerNo } = req.params;
        const user = await User.findOne({ registerNo, role: 'student' });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const { category, title, description, hostelId, roomId } = req.body;
        if (!category || !title || !description || !hostelId || !roomId) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const newComplaint = new Complaint({
            studentId: user._id,
            hostelId,
            roomId, category,
            title,  description,
            status: 'Pending'
        });

        await newComplaint.save();
        const populatedComplaint = await Complaint.findById(newComplaint._id)
            .populate('studentId', 'name registerNo')
            .populate('hostelId', 'hostelName')
            .populate('roomId', 'roomNumber');

        res.status(201).json(populatedComplaint);
    } catch (error) {
        console.error('Error creating complaint:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;