const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const Hostel = require("./models/hostel");
const Room = require("./models/room");
const Bed = require("./models/bed");
const BookingRequest = require("./models/bookingRequest");

// --------------------------------------------------------------------------------------------------------------------------------

// Common Routes
const authRoutes = require("./routes/common/authRoutes");

// Admin Routes
const userAdministrationRoutes = require("./routes/admin/userAdministration");
const hostelManagementRoutes = require("./routes/admin/hostelManagement");
const roomAllocationRoutes = require("./routes/admin/roomAllocation");
const bedManagementRoutes = require("./routes/admin/bedManagement");

// Student Routes

// --------------------------------------------------------------------------------------------------------------------------------

const app = express();
app.use(cors());
app.use(express.json());
connectDB();


// --------------------------------------------------------------------------------------------------------------------------------

// Common Routes
app.use("/", authRoutes);

// Admin Routes
app.use("/", userAdministrationRoutes);
app.use("/", hostelManagementRoutes);
app.use("/", roomAllocationRoutes);
app.use("/", bedManagementRoutes);

// Student Routes

// --------------------------------------------------------------------------------------------------------------------------------

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});

// --------------------------------------------------------------------------------------------------------------------------------
// MyBookingRequest Backend Coding
//  GET AVAILABLE HOSTELS

app.get("/api/hostels/available", async (req, res) => {
    try {
        const hostels = await Hostel.find();

        const result = await Promise.all(
            hostels.map(async (hostel) => {

                const rooms = await Room.find({ hostelId: hostel._id });
                const roomIds = rooms.map(r => r._id);

                const availableBeds = await Bed.countDocuments({
                    roomId: { $in: roomIds },
                    status: "Available"
                });

                if (availableBeds === 0) return null;

                return {
                    _id: hostel._id,
                    hostelName: hostel.hostelName,
                    location: hostel.location,
                    availableBeds
                };
            })
        );

        res.json(result.filter(h => h !== null));

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
// --------------------------------------------------------------------------------------------------------------------------------

// GET AVAILABLE ROOMS BY HOSTEL

app.get("/api/rooms/available/:hostelId", async (req, res) => {
    try {
        const rooms = await Room.find({
            hostelId: req.params.hostelId
        });

        const result = await Promise.all(
            rooms.map(async (room) => {

                const availableBeds = await Bed.countDocuments({
                    roomId: room._id,
                    status: "Available"
                });

                if (availableBeds === 0) return null;

                return {
                    _id: room._id,
                    roomNumber: room.roomNumber,
                    roomType: room.roomType,
                    rentAmount: room.rentAmount,
                    availableBeds
                };
            })
        );

        res.json(result.filter(r => r !== null));

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
// --------------------------------------------------------------------------------------------------------------------------------

// GET AVAILABLE BEDS BY ROOM

app.get("/api/beds/available/:roomId", async (req, res) => {
    try {
        const beds = await Bed.find({
            roomId: req.params.roomId,
            status: "Available"
        });

        res.json(beds);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
// --------------------------------------------------------------------------------------------------------------------------------

// SAVE BOOKING REQUEST
app.post("/api/student/booking-request", async (req, res) => {
    try {
        const { studentId, hostelId, roomId, bedId, message } = req.body;

        // Check if bed still available
        const bed = await Bed.findById(bedId);
        if (!bed || bed.status !== "Available") {
            return res.status(400).json({ message: "Bed not available" });
        }

        // Save booking request
        const booking = new BookingRequest({
            studentId,
            hostelId,
            roomId,
            bedId,
            message
        });

        await booking.save();

        res.status(201).json({
            message: "Booking Request Submitted",
            booking
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// --------------------------------------------------------------------------------------------------------------------------------

// GET STUDENT BOOKING REQUESTS

app.get("/api/student/booking-request/:studentId", async (req, res) => {
    try {
        const bookings = await BookingRequest.find({
            studentId: req.params.studentId
        })
        .populate("hostelId")
        .populate("roomId")
        .populate("bedId");

        res.json(bookings);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// --------------------------------------------------------------------------------------------------------------------------------
