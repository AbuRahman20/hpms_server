const express = require('express');
const router = express.Router();
const Hostel = require('../../models/hostel');
const Room = require('../../models/room');
const Bed = require('../../models/bed');
const BookingRequest = require('../../models/bookingRequest')
const User = require('../../models/user')

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

router.post("/booking-request", async (req, res) => {

    try {

        const { registerNo, hostelId, roomId, bedId, message } = req.body;

        // Find student using registerNo
        const student = await User.findOne({ registerNo });

        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        // Check bed availability
        const bed = await Bed.findById(bedId);
        if (!bed || bed.status !== "Available") {
            return res.status(400).json({ message: "Bed not available" });
        }

        //  Save booking request
        const booking = new BookingRequest({
            studentId: student._id, 
            hostelId, roomId, bedId,
            message
        });

        await booking.save();

        res.status(201).json({
            message: "Booking Request Submitted",
            booking
        });

    } catch (error) {
        console.log('Error in hostel booking :', error)
        res.status(500).json({ message: error.message });
    }
});

// --------------------------------------------------------------------------------------------------------------------------------

module.exports = router;