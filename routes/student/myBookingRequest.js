const express = require('express');
const router = express.Router();
const User = require('../../models/user');
const BookingRequest = require('../../models/bookingRequest');

// --------------------------------------------------------------------------------------------------------------------------------

// Get all booking requests for logged-in student

router.get("/my-requests/:registerNo", async (req, res) => {

    try {

        const { registerNo } = req.params;

        const student = await User.findOne({ registerNo });

        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        const requests = await BookingRequest.find({ studentId: student._id })
            .populate("hostelId")
            .populate("roomId")
            .populate("bedId")
            .sort({ createdAt: -1 });

        res.json(requests);

    } catch (error) {
        console.log("Error fetching booking requests:", error);
        res.status(500).json({ message: error.message });
    }
});

// --------------------------------------------------------------------------------------------------------------------------------

module.exports = router;