const express = require("express");
const router = express.Router();

const Hostel = require('../../models/hostel');
const Room = require('../../models/room');
const Bed = require('../../models/bed');

// GET beds by roomId (STRING like RM001)
router.get("/api/beds/:roomId", async (req, res) => {
    try {

        const { roomId } = req.params;

        // Find room using roomId string
        const room = await Room.findOne({ roomId });

        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }

        //  Find beds using room._id (ObjectId)
        const beds = await Bed.find({ roomId: room._id });

        res.json(beds);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;