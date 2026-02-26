const express = require("express");
const router = express.Router();
const BookingRequest = require("../models/BookingRequest");


// ✅ 1. Create Booking Request (Student)
router.post("/", async (req, res) => {
    try {
        const { studentId, hostelId, roomId, bedId } = req.body;

        const newBooking = new BookingRequest({
            studentId,
            hostelId,
            roomId,
            bedId
        });

        await newBooking.save();

        res.status(201).json({
            message: "Booking submitted successfully"
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// ✅ 2. Get My Booking Requests (Student View)
router.get("/student/:studentId", async (req, res) => {
    try {
        const bookings = await BookingRequest.find({
            studentId: req.params.studentId
        })
        .populate("hostelId")
        .populate("roomId")
        .populate("bedId")
        .sort({ createdAt: -1 });

        res.json(bookings);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// ✅ 3. Get All Booking Requests (Admin View)
router.get("/", async (req, res) => {
    try {
        const bookings = await BookingRequest.find()
            .populate("studentId")
            .populate("hostelId")
            .populate("roomId")
            .populate("bedId")
            .sort({ createdAt: -1 });

        res.json(bookings);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;