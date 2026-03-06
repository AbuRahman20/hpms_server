const express = require('express');
const router = express.Router();
const Room = require('../../models/room'); 
const Hostel = require('../../models/hostel');

// --------------------------------------------------------------------------------------------------------------------------------

// GET all rooms, populated with hostel details

router.get('/fetchroomdata', async (req, res) => {
    try {
        const rooms = await Room.find().populate('hostelId', 'hostelName').sort({ createdAt: -1 });
        res.json(rooms);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// --------------------------------------------------------------------------------------------------------------------------------

// POST create a new room
router.post('/addroom', async (req, res) => {

    try {

        const { roomId, hostelId, roomNumber, roomType, totalBeds, rentAmount, status } = req.body;

        // Verify hostel exists
        const hostel = await Hostel.findById(hostelId);
        if (!hostel) {
            return res.status(400).json({ message: 'Invalid hostel ID' });
        }

        const newRoom = new Room({
            roomId,
            hostelId,
            roomNumber,
            roomType,
            totalBeds,
            rentAmount,
            status
        });
        await newRoom.save();
        res.status(201).json(newRoom);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// --------------------------------------------------------------------------------------------------------------------------------
''
// PUT update a room

router.put('/updateroom/:id', async (req, res) => {

    try {

        const { id } = req.params;
        const updates = req.body;

        // If hostelId is being updated, verify it exists
        if (updates.hostelId) {
            const hostel = await Hostel.findById(updates.hostelId);
            if (!hostel) {
                return res.status(400).json({ message: 'Invalid hostel ID' });
            }
        }

        const updatedRoom = await Room.findByIdAndUpdate(id, updates, { new: true, runValidators: true }).populate('hostelId', 'hostelName');
        if (!updatedRoom) {
            return res.status(404).json({ message: 'Room not found' });
        }
        res.json(updatedRoom);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// --------------------------------------------------------------------------------------------------------------------------------

// DELETE a room

router.delete('/deleteroom/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedRoom = await Room.findByIdAndDelete(id);
        if (!deletedRoom) {
            return res.status(404).json({ message: 'Room not found' });
        }
        res.json({ message: 'Room deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// --------------------------------------------------------------------------------------------------------------------------------

module.exports = router;