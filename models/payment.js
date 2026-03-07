const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
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
    amount: {
        type: Number,
        required: true
    },
    paymentType: {
        type: String,
        enum: ["Hostel Fee", "Mess Fee", "Maintenance"]
    },
    paymentMethod: {
        type: String,
        enum: ["Cash", "UPI", "Card", "Net Banking"]
    },
    transactionId: {
        type: String
    },
    paymentDate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ["Pending", "Paid", "Failed"],
        default: "Pending"
    }
}, { timestamps: true });

module.exports = mongoose.models.Payment || mongoose.model("Payment", paymentSchema);