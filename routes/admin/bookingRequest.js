const express = require("express");
const router = express.Router();

const BookingRequest = require("../models/BookingRequest");
const User = require("../models/User");
const Bed = require("../models/Bed");
 

// =======================================================
// 1. CREATE BOOKING REQUEST (Student Side)
// =======================================================
router.post("/booking-request", async (req, res) => {
    try {
        const { registerNo, hostelId, roomId, bedId } = req.body;

        const student = await User.findOne({ registerNo });
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        // Prevent duplicate pending request
        const existing = await BookingRequest.findOne({
            studentId: student._id,
            status: "Pending"
        });

        if (existing) {
            return res.status(400).json({ message: "You already have a pending request" });
        }

        const newRequest = new BookingRequest({
            studentId: student._id,
            hostelId,
            roomId,
            bedId
        });

        await newRequest.save();

        res.status(201).json({ message: "Booking request submitted successfully" });

    } catch (error) {
        console.log("Booking error:", error);
        res.status(500).json({ message: error.message });
    }
});

// =======================================================
// 2. GET MY REQUESTS (Student Side)
// =======================================================
router.get("/my-requests/:registerNo", async (req, res) => {
    try {
        const { registerNo } = req.params;

        const student = await User.findOne({ registerNo });
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        const requests = await BookingRequest.find({ studentId: student._id })
            .populate("studentId", "name registerNo")
            .populate("hostelId", "hostelName")
            .populate("roomId", "roomNumber")
            .populate("bedId", "bedName")
            .sort({ createdAt: -1 });

        res.json(requests);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// =======================================================
// 3. GET ALL REQUESTS (Admin Side)
// =======================================================
router.get("/all-requests", async (req, res) => {
    try {
        const requests = await BookingRequest.find()
            .populate("studentId", "name registerNo")
            .populate("hostelId", "hostelName")
            .populate("roomId", "roomNumber")
            .populate("bedId", "bedName")
            .sort({ createdAt: -1 });

        res.json(requests);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.post("/create", async (req, res) => {
    try {
        const { studentId, hostelId, roomId, bedId, message } = req.body;

        const newRequest = new BookingRequest({
            studentId,
            hostelId,
            roomId,
            bedId,
            message
        });

        await newRequest.save();

        res.status(201).json({ message: "Booking request sent successfully" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.get("/all-requests", async (req, res) => {
    try {

        const requests = await BookingRequest.find()
            .populate("studentId", "name registerNo phone department")
            .populate("hostelId", "hostelName")
            .populate("roomId", "roomNumber")
            .populate("bedId", "bedNumber")
            .sort({ createdAt: -1 });

        res.status(200).json(requests);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
