const express = require('express');
const router = express.Router();
const hostelModel = require('../../models/hostel');
const roomModel = require('../../models/room');

// --------------------------------------------------------------------------------------------------------------------------------

// Fetch all hostels

router.get('/fetchhosteldata', async (req, res) => {
    try {
        const data = await hostelModel.find();
        res.json(data);
    } catch (error) {
        console.error("Error in fetching hostel data : ", error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

// --------------------------------------------------------------------------------------------------------------------------------

// Delete hostel

router.post('/deletehostel', async (req, res) => {
    const { hostelId } = req.body;
    try {
        await hostelModel.deleteOne({ hostelId: hostelId });
        res.json({ message: 'Hostel deleted successfully' });
    } catch (error) {
        console.error("Error in deleting hostel : ", error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// --------------------------------------------------------------------------------------------------------------------------------

// Get all hostels for dropdown

router.get('/api/hostels', async (req, res) => {
    try {
        const hostels = await hostelModel.find();
        res.status(200).json(hostels);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch hostels" });
    }
});

// --------------------------------------------------------------------------------------------------------------------------------

module.exports = router;