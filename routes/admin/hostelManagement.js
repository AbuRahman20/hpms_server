const express = require('express');
const router = express.Router();
const Hostel = require('../../models/hostel');

// --------------------------------------------------------------------------------------------------------------------------------

// GET all hostels

router.get('/fetchhosteldata', async (req, res) => {
    try {
        const hostels = await Hostel.find().sort({ createdAt: -1 });
        res.json(hostels);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// --------------------------------------------------------------------------------------------------------------------------------

// POST create a new hostel

router.post('/addhostel', async (req, res) => {

    try {
        const { hostelId, hostelName, location, totalRooms, wardenName } = req.body;
        const newHostel = new Hostel({
            hostelId,
            hostelName,
            location,
            totalRooms,
            wardenName
        });
        await newHostel.save();
        res.status(201).json(newHostel);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// --------------------------------------------------------------------------------------------------------------------------------

// PUT update a hostel

router.put('/updatehostel/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const updatedHostel = await Hostel.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
        if (!updatedHostel) {
            return res.status(404).json({ message: 'Hostel not found' });
        }
        res.json(updatedHostel);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// --------------------------------------------------------------------------------------------------------------------------------

// DELETE a hostel

router.delete('/deletehostel/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedHostel = await Hostel.findByIdAndDelete(id);
        if (!deletedHostel) {
            return res.status(404).json({ message: 'Hostel not found' });
        }
        res.json({ message: 'Hostel deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// --------------------------------------------------------------------------------------------------------------------------------

module.exports = router;