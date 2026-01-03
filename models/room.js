const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({

    // Identification
    roomId: { type: String, unique: true },
    hostelId: { type: String, unique: true },
    roomNumbet: { type: Number },
    roomType: { type: String },
    totalBeds: { type: String },
    rentAmount: { type: Number },
    status: { type: String }

}, { timestamps: true });

module.exports = mongoose.model("Room", roomSchema);
