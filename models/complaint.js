const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    hostelId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hostel"
    },
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room"
    },
    category: {
        type: String,
        enum: ["Electrical", "Water", "Maintenance", "Cleaning", "Internet", "Other"]
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    status: {
        type: String,
        enum: ["Pending", "In Progress", "Resolved", "Rejected"],
        default: "Pending"
    },
    resolvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    resolvedDate: {
        type: Date
    }
}, { timestamps: true });

module.exports = mongoose.models.Complaint || mongoose.model("Complaint", complaintSchema);