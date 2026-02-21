const express = require('express');
const router = express.Router();
const bedModel = require('../../models/bed');

// --------------------------------------------------------------------------------------------------------------------------------

// Get beds by room ID

router.get('/api/beds/:roomId', async (req, res) => {
    try {
        const beds = await bedModel.find({ roomId: req.params.roomId });
        res.json(beds);
    } catch (error) {
        res.status(500).json({ message: "Error fetching beds" });
    }
});

// --------------------------------------------------------------------------------------------------------------------------------

module.exports = router;