const express = require("express");
const router = express.Router();
const Room = require('../../models/room');
const Hostel = require('../../models/hostel');

// GET Rooms by hostelId (STRING like HSTL001)
router.get("/api/rooms/:hostelId", async (req, res) => {
    try {
        const { hostelId } = req.params;

        // Step 1: Find hostel by hostelId string
        const hostel = await Hostel.findOne({ hostelId });

        if (!hostel) {
            return res.status(404).json({ message: "Hostel not found" });
        }

        // Step 2: Find rooms using hostel _id
        const rooms = await Room.find({ hostelId: hostel._id });

        res.json(rooms);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;