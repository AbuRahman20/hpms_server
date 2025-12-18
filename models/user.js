const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

    // Identification
    registerNo: { type: String, unique: true },
    password: { type: String },
    role: { type: String },
    name: { type: String },
    phone: { type: Number },
    aadharNo: { type: Number },

    // Academic Details
    department: { type: String },
    year: { type: String },
    semester: { type: String },
    section: { type: String },
    academicYear: { type: String },
    graduate: { type: String },

    // Personal Details
    parentName: { type: String },
    religion: { type: String },
    category: { type: String },

    // Address
    address: { type: String },
    state: { type: String },
    district: { type: String },
    pinCode: { type: Number },

}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
