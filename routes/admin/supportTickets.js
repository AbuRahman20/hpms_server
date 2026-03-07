const express = require('express');
const router = express.Router();
const Complaint = require('../../models/complaint');
const User = require('../../models/user');

// --------------------------------------------------------------------------------------------------------------------------------

router.get('/', async (req, res) => {
    try {
        const { status, category } = req.query;
        const filter = {};
        if (status) filter.status = status;
        if (category) filter.category = category;

        const complaints = await Complaint.find(filter)
            .populate('studentId', 'name registerNo')
            .populate('hostelId', 'hostelName')
            .populate('roomId', 'roomNumber')
            .populate('resolvedBy', 'name')
            .sort('-createdAt');

        res.json(complaints);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// --------------------------------------------------------------------------------------------------------------------------------

router.get('/:id', async (req, res) => {
    try {
        const complaint = await Complaint.findById(req.params.id)
            .populate('studentId', 'name registerNo')
            .populate('hostelId', 'hostelName')
            .populate('roomId', 'roomNumber')
            .populate('resolvedBy', 'name');
        if (!complaint) return res.status(404).json({ message: 'Complaint not found' });
        res.json(complaint);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// --------------------------------------------------------------------------------------------------------------------------------

router.put('/:id/:registerNo', async (req, res) => {

    try {
        
        const { status } = req.body;
        const { registerNo } = req.params;

        const allowedStatuses = ['Pending', 'In Progress', 'Resolved', 'Rejected'];
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const updateData = { status };

        if (status === 'Resolved' || status === 'Rejected') {
            if (!registerNo) {
                return res.status(400).json({ message: 'registerNo is required for this status' });
            }
            const admin = await User.findOne({ registerNo });
            if (!admin || admin.role !== 'admin') {
                return res.status(403).json({ message: 'Invalid admin ID' });
            }
            updateData.resolvedBy = admin._id;
            updateData.resolvedDate = new Date();
        }

        const complaint = await Complaint.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        ).populate('studentId', 'name')
         .populate('resolvedBy', 'name');

        if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

        res.json(complaint);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// --------------------------------------------------------------------------------------------------------------------------------

router.delete('/:id', async (req, res) => {
    try {
        const complaint = await Complaint.findByIdAndDelete(req.params.id);
        if (!complaint) return res.status(404).json({ message: 'Complaint not found' });
        res.json({ message: 'Complaint deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// --------------------------------------------------------------------------------------------------------------------------------

module.exports = router;