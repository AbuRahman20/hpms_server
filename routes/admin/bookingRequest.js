const express = require("express");
const router = express.Router();
const BookingRequest = require('../../models/bookingRequest');
const Bed = require('../../models/bed');
const Allocation = require("../../models/allocation");
// ===============================
// CREATE BOOKING REQUEST
// ===============================

router.post("/all", async (req, res) => {

    try {

        const { studentId, hostelId, roomId, bedId } = req.body;

        // Prevent same student duplicate request
        const existing = await BookingRequest.findOne({
            studentId,
            bedId,
            status: "Pending"
        });

        if (existing) {
            return res.status(400).json({
                message: "You already requested this bed"
            });
        }

        const newRequest = new BookingRequest({
            studentId, hostelId,
            roomId, bedId,
            status: "Pending"
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

        if (status === "Approved") {

            const bed = await Bed.findById(request.bedId);

            if (!bed) {
                return res.status(404).json({ message: "Bed not found" });
            }

            if (bed.status === "Booked") {
                return res.status(400).json({
                    message: "This bed is already booked."
                });
            }

            // ✅ Approve selected request
            request.status = "Approved";
            await request.save();

            // ✅ Mark bed booked
            bed.status = "Booked";
            await bed.save();

            // ✅ Reject other requests for SAME BED
            await BookingRequest.updateMany(
                {
                    bedId: request.bedId,
                    _id: { $ne: request._id }
                },
                { status: "Rejected" }
            );

            // ⭐ Reject all OTHER requests of SAME STUDENT
            await BookingRequest.updateMany(
                {
                    studentId: request.studentId,
                    _id: { $ne: request._id }
                },
                { status: "Rejected" }
            );

            return res.status(200).json({
                message: "Request approved. Other student requests rejected."
            });
        }

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
