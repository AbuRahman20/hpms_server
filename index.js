const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

// --------------------------------------------------------------------------------------------------------------------------------

// Common Routes
const authRoutes = require("./routes/common/authRoutes");

// Admin Routes
const userAdministrationRoutes = require("./routes/admin/userAdministration");
const hostelManagementRoutes = require("./routes/admin/hostelManagement");
const roomAllocationRoutes = require("./routes/admin/roomAllocation");
const bedManagementRoutes = require("./routes/admin/bedManagement");
const bookingRequestRoutes = require("./routes/admin/bookingRequest");


// Student Routes
const hostelBookingRoutes = require("./routes/student/hostelBooking");
const myBookingRequest = require("./routes/student/myBookingRequest");

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
app.use("/api/booking", bookingRequestRoutes);
// Student Routes
app.use("/api/hostelBooking", hostelBookingRoutes);
app.use("/api/myRequest", myBookingRequest);

// --------------------------------------------------------------------------------------------------------------------------------

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});

// --------------------------------------------------------------------------------------------------------------------------------

// SAVE BOOKING REQUEST


