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
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    message: {
        type: String
    },
    category: {
        type: String,
        enum: ["Food", "Cleanliness", "Security", "Facilities", "Management", "Other"]
    }
}, { timestamps: true });

module.exports = mongoose.models.Feedback || mongoose.model("Feedback", feedbackSchema);