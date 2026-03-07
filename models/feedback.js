const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    hostelId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hostel",
        required: true
    },
    complaintId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Complaint",
        required: true
    },
    rating: {
        type: Number,
        min: 1, max: 5
    },
    message: { type: String }
}, { timestamps: true });

module.exports = mongoose.models.Feedback || mongoose.model("Feedback", feedbackSchema);