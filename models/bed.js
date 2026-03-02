const mongoose = require("mongoose");

const bedSchema = new mongoose.Schema({
    bedId: { type: String, unique: true },
    roomId: { type: mongoose.Schema.Types.ObjectId, ref: "Room" },
    bedName: { type: String },
    status: { 
        type: String,
        default: "Available"
    }
}, { timestamps: true });

module.exports = mongoose.models.Bed || mongoose.model("Bed", bedSchema);