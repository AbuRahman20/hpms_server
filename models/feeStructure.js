const mongoose = require("mongoose");

const feeStructureSchema = new mongoose.Schema({

    // Identification
    feeId: { type: String, unique: true },
    hostelId: { type: String, unique: true },
    feeType: { type: String },
    amount: { type: Number }

}, { timestamps: true });

module.exports = mongoose.model("feeStructure", feeStructureSchema);
