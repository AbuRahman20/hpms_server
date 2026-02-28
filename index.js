const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
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
const hostelBookingRoutes = require("./routes/student/hostelBooking");

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
app.use("/api/hostelBooking", hostelBookingRoutes);

// --------------------------------------------------------------------------------------------------------------------------------

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
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
