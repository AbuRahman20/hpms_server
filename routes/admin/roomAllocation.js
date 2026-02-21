const express = require('express');
const router = express.Router();
const roomModel = require('../../models/room');

// --------------------------------------------------------------------------------------------------------------------------------

// Get rooms by hostel ID

router.get('/api/rooms/:hostelId', async (req, res) => {
    try {
        const { hostelId } = req.params;
        const rooms = await roomModel.find({ hostelId });
        if (rooms.length === 0) {
            return res.status(404).json({ message: "No rooms found for this hostel" });
        }
        res.status(200).json(rooms);
    } catch (error) {
        res.status(500).json({ message: "Error fetching rooms" });
    }
});

// --------------------------------------------------------------------------------------------------------------------------------

module.exports = router;