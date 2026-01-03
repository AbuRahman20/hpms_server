const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({

    // Identification
    paymentId: { type: String, unique: true },
    tenantId: { type: String, unique: true },
    month: { type: String },
    amount: { type: Number },
    paymentDate: { type: Number },
    paymentMode: { type: String },
    status: { type: String }

}, { timestamps: true });

module.exports = mongoose.model("Payment", paymentSchema);
