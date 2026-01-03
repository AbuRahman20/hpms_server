const mongoose = require("mongoose");

const bedSchema = new mongoose.Schema({

    // Identification
    bedId: { type: String, unique: true },
    roomId: { type: String, unique: true },
    bedName: { type: String },
    status: { type: String }

}, { timestamps: true });

module.exports = mongoose.model("Bed", bedSchema);
