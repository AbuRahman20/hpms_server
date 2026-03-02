const express = require("express");
const router = express.Router();

const BookingRequest = require('../../models/bookingRequest');
const Bed = require('../../models/bed');

// ===============================
// CREATE BOOKING REQUEST
// ===============================
router.post("/all", async (req, res) => {
    try {
        const { studentId, hostelId, roomId, bedId } = req.body;

        // Check if bed available
        const bed = await Bed.findById(bedId);
        if (!bed || bed.status !== "Available") {
            return res.status(400).json({ message: "Bed not available" });
        }

        // Prevent duplicate pending request
        const existing = await BookingRequest.findOne({
            studentId,
            status: "Pending"
        });

        if (existing) {
            return res.status(400).json({ message: "You already have pending request" });
        }

        const newRequest = new BookingRequest({
            studentId,
            hostelId,
            roomId,
            bedId
        });

        await newRequest.save();

        res.status(201).json({ message: "Booking request sent successfully" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// ===============================
// GET ALL REQUESTS (ADMIN)
// ===============================
router.get("/all", async (req, res) => {
    try {

        const requests = await BookingRequest.find()
            .populate("studentId", "name registerNo phone department")
            .populate("hostelId", "hostelName location")
            .populate("roomId", "roomNumber rentAmount")
            .populate("bedId", "bedName status")
            .sort({ createdAt: -1 });

        res.status(200).json(requests);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// ===============================
// UPDATE STATUS (ADMIN)
// ===============================

router.patch("/update/:id", async (req, res) => {
    try {
        const { status } = req.body;

        const request = await BookingRequest.findById(req.params.id);

        if (!request) {
            return res.status(404).json({ message: "Request not found" });
        }

        // If Approved → Update bed status
        if (status === "Approved") {

            await Bed.findByIdAndUpdate(request.bedId, {
                status: "Booked"
            });

            // Reject all other pending requests for same bed
            await BookingRequest.updateMany(
                {
                    bedId: request.bedId,
                    _id: { $ne: request._id },
                    status: "Pending"
                },
                { status: "Rejected" }
            );
        }

        request.status = status;
        await request.save();

        res.status(200).json({ message: "Status updated successfully" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



module.exports = router;
