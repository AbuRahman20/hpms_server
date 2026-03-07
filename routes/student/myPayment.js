const express = require('express');
const router = express.Router();
const User = require('../../models/user');
const Payment = require('../../models/payment');
const Allocation = require('../../models/allocation');

// --------------------------------------------------------------------------------------------------------------------------------

router.get('/student/:registerNo', async (req, res) => {
    try {
        const { registerNo } = req.params;

        const student = await User.findOne({ registerNo, role: 'student' });
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        const payments = await Payment.find({ studentId: student._id })
            .populate('hostelId', 'hostelName')
            .populate('roomId', 'roomNumber')
            .sort({ paymentDate: -1 });

        res.json(payments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// --------------------------------------------------------------------------------------------------------------------------------

router.post('/create', async (req, res) => {

    try {

        const { registerNo, amount, paymentType, paymentMethod, transactionId } = req.body;

        // Find student
        const student = await User.findOne({ registerNo, role: 'student' });
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Find active allocation to get hostel/room
        const allocation = await Allocation.findOne({
            studentId: student._id,
            status: 'Active'
        }).populate('hostelId roomId');

        if (!allocation) {
            return res.status(400).json({ message: 'No active allocation found' });
        }

        // Create payment
        const payment = new Payment({
            studentId: student._id,
            hostelId: allocation.hostelId._id,
            roomId: allocation.roomId._id,
            amount,
            paymentType,
            paymentMethod,
            transactionId: transactionId || `TXN${Date.now()}`,
            paymentDate: new Date(),
            status: 'Paid' 
        });

        await payment.save();
        res.status(201).json({ message: 'Payment recorded successfully', payment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// --------------------------------------------------------------------------------------------------------------------------------

router.get('/admin/all', async (req, res) => {
    try {
        const payments = await Payment.find()
            .populate('studentId', 'name registerNo')
            .populate('hostelId', 'hostelName')
            .populate('roomId', 'roomNumber')
            .sort({ paymentDate: -1 });

        res.json(payments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// --------------------------------------------------------------------------------------------------------------------------------

router.put('/admin/:id', async (req, res) => {

    try {

        const { id } = req.params;
        const { status } = req.body;

        if (!['Pending', 'Paid', 'Failed'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const payment = await Payment.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }

        res.json({ message: 'Payment updated', payment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// --------------------------------------------------------------------------------------------------------------------------------

router.get('/admin/active-allocations', async (req, res) => {
    try {
        const { hostelId } = req.query; 

        const filter = { status: 'Active' };
        if (hostelId) filter.hostelId = hostelId;

        const allocations = await Allocation.find(filter)
            .populate('studentId', 'name registerNo phone')
            .populate('hostelId', 'hostelName')
            .populate('roomId', 'roomNumber rentAmount roomType')
            .populate('bedId', 'bedName')
            .sort({ 'hostelId.hostelName': 1, 'roomId.roomNumber': 1 });

        res.json(allocations);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// --------------------------------------------------------------------------------------------------------------------------------

router.post('/admin/bulk-create', async (req, res) => {

    try {

        const { payments } = req.body; 
        if (!Array.isArray(payments) || payments.length === 0) {
            return res.status(400).json({ message: 'Invalid payments data' });
        }

        const createdPayments = [];
        for (const p of payments) {
            const { studentId, hostelId, roomId, amount, paymentType, paymentMethod, transactionId, dueDate } = p;
            if (!studentId || !hostelId || !roomId || !amount || !paymentType) {
                return res.status(400).json({ message: 'Missing required fields in one of the payments' });
            }

            const payment = new Payment({
                studentId,
                hostelId,
                roomId,
                amount,
                paymentType,
                paymentMethod: paymentMethod || 'Cash',
                transactionId: transactionId || `BULK${Date.now()}-${Math.random()}`,
                status: 'Pending', 
                dueDate: dueDate || null,
            });
            await payment.save();
            createdPayments.push(payment);
        }

        res.status(201).json({ message: `${createdPayments.length} payments created`, payments: createdPayments });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// --------------------------------------------------------------------------------------------------------------------------------

router.get('/admin/all', async (req, res) => {
    try {
        const payments = await Payment.find()
            .populate('studentId', 'name registerNo')
            .populate('hostelId', 'hostelName')
            .populate('roomId', 'roomNumber')
            .sort({ paymentDate: -1 });
        res.json(payments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// --------------------------------------------------------------------------------------------------------------------------------

router.put('/admin/:id', async (req, res) => {

    try {

        const { id } = req.params;
        const { status } = req.body;

        if (!['Pending', 'Paid', 'Failed'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const payment = await Payment.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }

        res.json({ message: 'Payment updated', payment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// --------------------------------------------------------------------------------------------------------------------------------

router.get('/admin/active-allocations', async (req, res) => {
    try {
        const { hostelId } = req.query;
        const filter = { status: 'Active' };
        if (hostelId) filter.hostelId = hostelId;

        const allocations = await Allocation.find(filter)
            .populate('studentId', 'name registerNo phone')
            .populate('hostelId', 'hostelName')
            .populate('roomId', 'roomNumber rentAmount roomType')
            .populate('bedId', 'bedName')
            .sort({ 'hostelId.hostelName': 1, 'roomId.roomNumber': 1 });

        res.json(allocations);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// --------------------------------------------------------------------------------------------------------------------------------

router.post('/admin/bulk-create', async (req, res) => {
    try {
        const { payments } = req.body;
        if (!Array.isArray(payments) || payments.length === 0) {
            return res.status(400).json({ message: 'Invalid payments data' });
        }

        const createdPayments = [];
        for (const p of payments) {
            const { studentId, hostelId, roomId, amount, paymentType, paymentMethod, transactionId, dueDate } = p;
            if (!studentId || !hostelId || !roomId || !amount || !paymentType) {
                return res.status(400).json({ message: 'Missing required fields in one of the payments' });
            }

            const payment = new Payment({
                studentId,
                hostelId,
                roomId,
                amount,
                paymentType,
                paymentMethod: paymentMethod || 'Cash',
                transactionId: transactionId || `BULK${Date.now()}-${Math.random()}`,
                status: 'Pending',
                dueDate: dueDate || null,
            });
            await payment.save();
            createdPayments.push(payment);
        }

        res.status(201).json({ message: `${createdPayments.length} payments created`, payments: createdPayments });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;