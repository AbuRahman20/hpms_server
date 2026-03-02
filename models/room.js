const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
    roomId: { type: String, unique: true },
    hostelId: { type: mongoose.Schema.Types.ObjectId, ref: "Hostel" },
    roomNumber: { type: Number },
    roomType: { type: String },
    totalBeds: { type: String },
    rentAmount: { type: Number },
    status: { type: String }
}, { timestamps: true });

module.exports = mongoose.models.Room || mongoose.model("Room", roomSchema);
