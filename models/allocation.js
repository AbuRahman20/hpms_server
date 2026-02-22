const mongoose = require("mongoose");

const allocationSchema = new mongoose.Schema({
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
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room",
        required: true
    },
    bedId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Bed",
        required: true
    },
    allocatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    allocationDate: {
        type: Date,
        default: Date.now
    },
    vacateDate: {
        type: Date
    },
    status: {
        type: String,
        enum: ["Active", "Vacated"],
        default: "Active"
    }
}, { timestamps: true });

module.exports = mongoose.model("Allocation", allocationSchema);
