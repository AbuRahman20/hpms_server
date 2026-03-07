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
const allocationManagementRoutes = require("./routes/admin/allocationManagement");
const supportTicketRoutes = require("./routes/admin/supportTickets");
const adminDashboardRoutes = require("./routes/admin/dashboard");

// Student Routes
const hostelBookingRoutes = require("./routes/student/hostelBooking");
const myBookingRequest = require("./routes/student/myBookingRequest");
const myAllocationsRequest = require("./routes/student/myAllocations");
const myComplaintRoutes = require("./routes/student/myComplaint");
const feedbackRoutes = require("./routes/student/feedback");
const paymentRoutes = require("./routes/student/myPayment");
const studentGetDashboardRoutes = require("./routes/student/dashboard");

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
app.use("/api/allocation", allocationManagementRoutes);
app.use("/api/booking", bookingRequestRoutes);
app.use("/api/supportTickets", supportTicketRoutes);
app.use("/api/admin/dashboard", adminDashboardRoutes);

// Student Routes
app.use("/api/hostelBooking", hostelBookingRoutes);
app.use("/api/myRequest", myBookingRequest);
app.use("/api/myAllocation", myAllocationsRequest);
app.use("/api/myComplaints", myComplaintRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/student", studentGetDashboardRoutes);

// --------------------------------------------------------------------------------------------------------------------------------

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});

// --------------------------------------------------------------------------------------------------------------------------------