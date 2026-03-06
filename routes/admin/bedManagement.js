const express = require('express');
const router = express.Router();
const Bed = require('../../models/Bed'); 
const Room = require('../../models/Room');

// --------------------------------------------------------------------------------------------------------------------------------

// GET all beds, populated with room and hostel details

router.get('/fetchbeddata', async (req, res) => {
    try {
        const beds = await Bed.find()
            .populate({
                path: 'roomId',
                populate: { path: 'hostelId', select: 'hostelName' }
            })
            .sort({ createdAt: -1 });
        res.json(beds);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// --------------------------------------------------------------------------------------------------------------------------------

// POST create a new bed

router.post('/addbed', async (req, res) => {

    try {

        const { bedId, roomId, bedName, status } = req.body;

        // Verify room exists
        const room = await Room.findById(roomId);
        if (!room) {
            return res.status(400).json({ message: 'Invalid room ID' });
        }

        const newBed = new Bed({
            bedId,
            roomId,
            bedName,
            status: status || 'Available'
        });
        await newBed.save();
        res.status(201).json(newBed);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// --------------------------------------------------------------------------------------------------------------------------------

// PUT update a bed

router.put('/updatebed/:id', async (req, res) => {

    try {

        const { id } = req.params;
        const updates = req.body;

        if (updates.roomId) {
            const room = await Room.findById(updates.roomId);
            if (!room) {
                return res.status(400).json({ message: 'Invalid room ID' });
            }
        }

        const updatedBed = await Bed.findByIdAndUpdate(id, updates, { new: true, runValidators: true })
            .populate({
                path: 'roomId',
                populate: { path: 'hostelId', select: 'hostelName' }
            });
        if (!updatedBed) {
            return res.status(404).json({ message: 'Bed not found' });
        }
        res.json(updatedBed);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// --------------------------------------------------------------------------------------------------------------------------------

// DELETE a bed

router.delete('/deletebed/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedBed = await Bed.findByIdAndDelete(id);
        if (!deletedBed) {
            return res.status(404).json({ message: 'Bed not found' });
        }
        res.json({ message: 'Bed deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// --------------------------------------------------------------------------------------------------------------------------------

module.exports = router;