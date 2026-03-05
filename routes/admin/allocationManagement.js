const express = require("express");
const router = express.Router();
const Allocation = require("../../models/allocation");

router.get("/all", async (req, res) => {

    try {

        const allocations = await Allocation.find()
            .populate("studentId", "name registerNo")
            .populate("hostelId", "hostelName")
            .populate("roomId", "roomNumber")
            .populate("bedId", "bedName");

        res.status(200).json(allocations);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.patch("/vacate/:id", async (req, res) => {

    const allocation = await Allocation.findById(req.params.id);

    if (!allocation) {
        return res.status(404).json({ message: "Allocation not found" });
    }

    allocation.status = "Vacated";
    allocation.vacatedDate = new Date();

    await allocation.save();

    res.json({ message: "Student vacated successfully" });

});


module.exports = router;