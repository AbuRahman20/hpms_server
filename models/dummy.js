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

const mongoose = require("mongoose");

const bookingRequestSchema = new mongoose.Schema({
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
    status: {
        type: String,
        enum: ["Pending", "Approved", "Rejected"],
        default: "Pending"
    }
}, { timestamps: true });

module.exports = mongoose.models.BookingRequest || mongoose.model("BookingRequest", bookingRequestSchema);

const mongoose = require("mongoose");

const hostelSchema = new mongoose.Schema({
    hostelId: { type: String, unique: true },
    hostelName: { type: String },
    location: { type: String },
    totalRooms: { type: Number },
    wardenName: { type: String },
}, { timestamps: true });

module.exports = mongoose.models.Hostel || mongoose.model("Hostel", hostelSchema);

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

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

    // Identification
    registerNo: { type: String, unique: true },
    password: { type: String },
    role: {
        type: String,
        enum: ["student", "admin"],
        required: true
    },

    // Basic Details
    name: { type: String },
    phone: { type: String },
    aadharNo: { type: String },

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
    pinCode: { type: String },

}, { timestamps: true });

module.exports = mongoose.models.User || mongoose.model("User", userSchema);

const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema({
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
    category: {
        type: String,
        enum: ["Electrical", "Water", "Maintenance", "Cleaning", "Internet", "Other"]
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    status: {
        type: String,
        enum: ["Pending", "In Progress", "Resolved", "Rejected"],
        default: "Pending"
    },
    resolvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    resolvedDate: {
        type: Date
    }
}, { timestamps: true });

module.exports = mongoose.models.Complaint || mongoose.model("Complaint", complaintSchema);

const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
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
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    message: {
        type: String
    },
    category: {
        type: String,
        enum: ["Food", "Cleanliness", "Security", "Facilities", "Management", "Other"]
    }
}, { timestamps: true });

module.exports = mongoose.models.Feedback || mongoose.model("Feedback", feedbackSchema);

