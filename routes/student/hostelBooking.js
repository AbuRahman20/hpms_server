const express = require('express');
const router = express.Router();
const Hostel = require('../../models/hostel');
const Room = require('../../models/room');
const Bed = require('../../models/bed');

// --------------------------------------------------------------------------------------------------------------------------------

// Fetch available hostels

router.get("/available", async (req, res) => {

    try {

        const hostels = await Hostel.find();

        const result = await Promise.all(
            hostels.map(async (hostel) => {

                const rooms = await Room.find({ hostelId: hostel._id });
                const roomIds = rooms.map(r => r._id);

                const availableBeds = await Bed.countDocuments({
                    roomId: { $in: roomIds },
                    status: "Available"
                });

                if (availableBeds === 0) return null;

                return {
                    _id: hostel._id,
                    hostelName: hostel.hostelName,
                    location: hostel.location,
                    availableBeds
                };
            })
        );

        res.json(result.filter(h => h !== null));

    } catch (err) {
        console.error('Error in fetching available hostel : ', err)
        res.status(500).json({ message: err.message });
    }
});

// --------------------------------------------------------------------------------------------------------------------------------

// Fetch availabe rooms for specific Hostel

router.get("/hostel/:hostelId", async (req, res) => {

    try {

        const rooms = await Room.find({ hostelId: req.params.hostelId });

        const result = await Promise.all(
            rooms.map(async (room) => {

                const availableBeds = await Bed.countDocuments({
                    roomId: room._id,
                    status: "Available"
                });

                if (availableBeds === 0) return null;

                return {
                    _id: room._id,
                    roomNumber: room.roomNumber,
                    roomType: room.roomType,
                    rentAmount: room.rentAmount,
                    availableBeds
                };
            })
        );

        res.json(result.filter(r => r !== null));

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// --------------------------------------------------------------------------------------------------------------------------------

// Fetch availabe beds for specific Room

router.get("/room/:roomId", async (req, res) => {

    try {
        const beds = await Bed.find({
            roomId: req.params.roomId,
            status: "Available"
        });
        res.json(beds);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// --------------------------------------------------------------------------------------------------------------------------------

// Save request in booking request table



// --------------------------------------------------------------------------------------------------------------------------------

module.exports = router;