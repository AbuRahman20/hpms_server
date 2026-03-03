const express = require("express");
const router = express.Router();

const Allocation = require("../../models/allocation");
const Bed = require("../../models/bed");


// ===============================
// GET ALL ALLOCATIONS
// ===============================
router.get("/all", async (req, res) => {
    try {
        const allocations = await Allocation.find()
            .populate("hostelId", "hostelName")
            .populate("roomId", "roomNumber")
            .populate("bedId", "bedName status")
            .sort({ allocationDate: -1 });

        res.status(200).json(allocations);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// ===============================
// VACATE
// ===============================
router.patch("/vacate/:id", async (req, res) => {
    try {
        const allocation = await Allocation.findById(req.params.id);

        if (!allocation) {
            return res.status(404).json({ message: "Allocation not found" });
        }

        if (allocation.status === "Vacated") {
            return res.status(400).json({ message: "Already vacated" });
        }

        // 1️⃣ Update allocation
        allocation.status = "Vacated";
        allocation.vacateDate = new Date();
        await allocation.save();

        // 2️⃣ Update bed status
        await Bed.findByIdAndUpdate(allocation.bedId, {
            status: "Available"
        });

        res.status(200).json({ message: "Vacated successfully" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;