const express = require('express');
const router = express.Router();
const User = require('../../models/user');
const Complaint = require('../../models/complaint');
const Feedback = require('../../models/feedback');

// --------------------------------------------------------------------------------------------------------------------------------

// GET resolved complaints for a student (by registerNo)

router.get('/resolved-complaints/:registerNo', async (req, res) => {

    try {
        const { registerNo } = req.params;

        const student = await User.findOne({ registerNo, role: 'student' });
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        const complaints = await Complaint.find({
            studentId: student._id,
            status: 'Resolved'
        })
        .populate('hostelId', 'hostelName')
        .populate('roomId', 'roomNumber')
        .sort({ resolvedDate: -1 });

        // Attach feedbackGiven flag
        const complaintsWithFeedback = await Promise.all(
            complaints.map(async (complaint) => {
                const feedback = await Feedback.findOne({ complaintId: complaint._id });
                return {
                    ...complaint.toObject(),
                    feedbackGiven: !!feedback
                };
            })
        );

        res.json(complaintsWithFeedback);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// --------------------------------------------------------------------------------------------------------------------------------

// POST submit feedback for a resolved complaint

router.post('/submit', async (req, res) => {

    try {

        const { registerNo, complaintId, rating, message } = req.body;

        // Validate required fields (rating is required here, adjust if you want it optional)
        if (!registerNo || !complaintId || rating === undefined) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Find student
        const student = await User.findOne({ registerNo, role: 'student' });
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Find the complaint and ensure it belongs to this student and is resolved
        const complaint = await Complaint.findOne({
            _id: complaintId,
            studentId: student._id,
            status: 'Resolved'
        });

        if (!complaint) {
            return res.status(404).json({ message: 'Resolved complaint not found or access denied' });
        }

        // Check if feedback already exists for this complaint
        const existing = await Feedback.findOne({ complaintId });
        if (existing) {
            return res.status(400).json({ message: 'Feedback already submitted for this complaint' });
        }

        // Create feedback (category is not included, matching your schema)
        const feedback = new Feedback({
            studentId: student._id,
            hostelId: complaint.hostelId,
            complaintId: complaint._id,
            rating, message: message || ''   
        });

        await feedback.save();
        res.status(201).json({ message: 'Feedback submitted successfully', feedback });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// --------------------------------------------------------------------------------------------------------------------------------

router.get('/admin/all', async (req, res) => {

    try {

        const feedbacks = await Feedback.find()
            .populate('studentId', 'name registerNo')  
            .populate('hostelId', 'hostelName')        
            .populate({
                path: 'complaintId',
                select: 'title category status createdAt',
            })
            .sort({ createdAt: -1 });                   

        res.json(feedbacks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// --------------------------------------------------------------------------------------------------------------------------------

module.exports = router;