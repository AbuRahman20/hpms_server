const express = require('express');
const router = express.Router();
const User = require('../../models/user');
const Hostel = require('../../models/hostel');
const Room = require('../../models/room');
const Bed = require('../../models/bed');
const Allocation = require('../../models/allocation');
const BookingRequest = require('../../models/bookingRequest');
const Complaint = require('../../models/complaint');
const Feedback = require('../../models/feedback');
const Payment = require('../../models/payment');

router.get('/stats', async (req, res) => {

    try {

        // Basic counts
        const totalStudents = await User.countDocuments({ role: 'student' });
        const totalHostels = await Hostel.countDocuments();
        const totalRooms = await Room.countDocuments();
        const totalBeds = await Bed.countDocuments();

        // Occupancy
        const activeAllocations = await Allocation.countDocuments({ status: 'Active' });
        const availableBeds = await Bed.countDocuments({ status: 'Available' });
        const occupancyRate = totalBeds > 0 ? (activeAllocations / totalBeds) * 100 : 0;

        // Booking requests pending
        const pendingRequests = await BookingRequest.countDocuments({ status: 'Pending' });

        // Complaints by status
        const complaintsByStatus = await Complaint.aggregate([
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]);
        const complaintsTotal = await Complaint.countDocuments();

        // Feedback average rating
        const feedbackAvg = await Feedback.aggregate([
            { $group: { _id: null, avgRating: { $avg: "$rating" } } }
        ]);
        const averageRating = feedbackAvg.length > 0 ? feedbackAvg[0].avgRating : 0;

        // Payments summary
        const totalPayments = await Payment.countDocuments();
        const totalRevenue = await Payment.aggregate([
            { $match: { status: 'Paid' } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);
        const revenue = totalRevenue.length > 0 ? totalRevenue[0].total : 0;

        // Recent complaints (for table)
        const recentComplaints = await Complaint.find()
            .populate('studentId', 'name registerNo')
            .sort({ createdAt: -1 })
            .limit(5);

        // Recent payments
        const recentPayments = await Payment.find()
            .populate('studentId', 'name registerNo')
            .sort({ createdAt: -1 })
            .limit(5);

        // Monthly revenue (for chart)
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
        const monthlyRevenue = await Payment.aggregate([
            { $match: { status: 'Paid', paymentDate: { $gte: oneYearAgo } } },
            {
                $group: {
                    _id: { year: { $year: "$paymentDate" }, month: { $month: "$paymentDate" } },
                    total: { $sum: "$amount" }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);

        // Complaints trend (monthly counts)
        const complaintsTrend = await Complaint.aggregate([
            { $match: { createdAt: { $gte: oneYearAgo } } },
            {
                $group: {
                    _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);

        res.json({
            totals: {
                students: totalStudents,
                hostels: totalHostels,
                rooms: totalRooms,
                beds: totalBeds,
                activeAllocations,
                availableBeds,
                occupancyRate: occupancyRate.toFixed(2),
                pendingRequests,
                complaintsTotal,
                averageRating: averageRating.toFixed(1),
                totalPayments,
                revenue,
            },
            complaintsByStatus,
            recentComplaints,
            recentPayments,
            monthlyRevenue,
            complaintsTrend,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;