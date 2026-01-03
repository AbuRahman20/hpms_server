const mongoose = require("mongoose");

const hostelSchema = new mongoose.Schema({

    hostelId: { type: String, unique: true },
    hostelName: { type: String },
    location: { type: String },
    totalRooms: { type: Number },
    wardenName: { type: String },

}, { timestamps: true });

module.exports = mongoose.model("Hostel", hostelSchema);
