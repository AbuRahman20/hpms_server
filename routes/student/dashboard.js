const express = require('express');
const router = express.Router();
const User = require('../../models/user');
const Allocation = require('../../models/allocation');
const Payment = require('../../models/payment');
const Complaint = require('../../models/complaint');
const Feedback = require('../../models/feedback');

router.get('/dashboard/:registerNo', async (req, res) => {

    try {

        const { registerNo } = req.params;

        // Find student
        const student = await User.findOne({ registerNo, role: 'student' });
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // 1. Active allocation
        const activeAllocation = await Allocation.findOne({
            studentId: student._id,
            status: 'Active'
        }).populate('hostelId', 'hostelName')
          .populate('roomId', 'roomNumber rentAmount')
          .populate('bedId', 'bedName');

        // 2. Payments summary
        const payments = await Payment.find({ studentId: student._id });
        const totalPayments = payments.length;
        const totalAmountPaid = payments
            .filter(p => p.status === 'Paid')
            .reduce((sum, p) => sum + p.amount, 0);
        const pendingPayments = payments.filter(p => p.status === 'Pending').length;

        // 3. Complaints summary
        const complaints = await Complaint.find({ studentId: student._id });
        const totalComplaints = complaints.length;
        const pendingComplaints = complaints.filter(c => c.status === 'Pending').length;
        const inProgressComplaints = complaints.filter(c => c.status === 'In Progress').length;
        const resolvedComplaints = complaints.filter(c => c.status === 'Resolved').length;
        const rejectedComplaints = complaints.filter(c => c.status === 'Rejected').length;

        // 4. Recent payments (last 5)
        const recentPayments = await Payment.find({ studentId: student._id })
            .sort({ paymentDate: -1 })
            .limit(5)
            .populate('hostelId', 'hostelName');

        // 5. Recent complaints (last 5)
        const recentComplaints = await Complaint.find({ studentId: student._id })
            .sort({ createdAt: -1 })
            .limit(5);

        // 6. Feedback count (if any)
        const feedbackCount = await Feedback.countDocuments({ studentId: student._id });

        // 7. Chart data: payments by month (last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        const paymentsByMonth = await Payment.aggregate([
            { $match: { studentId: student._id, paymentDate: { $gte: sixMonthsAgo } } },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m', date: '$paymentDate' } },
                    total: { $sum: '$amount' }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // 8. Complaints by status (for pie chart)
        const complaintsByStatus = {
            Pending: pendingComplaints,
            'In Progress': inProgressComplaints,
            Resolved: resolvedComplaints,
            Rejected: rejectedComplaints
        };

        res.json({
            student: { name: student.name, registerNo: student.registerNo },
            activeAllocation,
            summary: {
                totalPayments,
                totalAmountPaid,
                pendingPayments,
                totalComplaints,
                pendingComplaints,
                resolvedComplaints,
                feedbackCount
            },
            recentPayments,
            recentComplaints,
            charts: {
                paymentsByMonth,
                complaintsByStatus
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;