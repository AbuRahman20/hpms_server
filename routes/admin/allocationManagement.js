const express = require("express");
const router = express.Router();
const Allocation = require("../../models/allocation");
const Bed = require("../../models/bed");
const Hostel = require("../../models/hostel");
const Room = require("../../models/room");

// --------------------------------------------------------------------------------------------------------------------------------

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

// --------------------------------------------------------------------------------------------------------------------------------

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

// --------------------------------------------------------------------------------------------------------------------------------

router.get('/with-status', async (req, res) => {

    try {

        const beds = await Bed.aggregate([
            {
                $lookup: {
                    from: 'rooms',
                    localField: 'roomId',
                    foreignField: '_id',
                    as: 'room'
                }
            },
            { $unwind: { path: '$room', preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: 'hostels',
                    localField: 'room.hostelId',
                    foreignField: '_id',
                    as: 'hostel'
                }
            },
            { $unwind: { path: '$hostel', preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: 'allocations',
                    let: { bedId: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ['$bedId', '$$bedId'] },
                                status: 'Active'
                            }
                        },
                        {
                            $lookup: {
                                from: 'users',
                                localField: 'studentId',
                                foreignField: '_id',
                                as: 'student'
                            }
                        },
                        { $unwind: { path: '$student', preserveNullAndEmptyArrays: true } }
                    ],
                    as: 'allocation'
                }
            },
            {
                $addFields: {
                    allocation: { $arrayElemAt: ['$allocation', 0] },
                    status: {
                        $cond: {
                            if: { $gt: [{ $size: '$allocation' }, 0] },
                            then: 'Occupied',
                            else: 'Available'
                        }
                    }
                }
            },
            {
                $project: {
                    bedName: 1,
                    'room.roomNumber': 1,
                    'hostel.hostelName': 1,
                    status: 1,
                    allocation: {
                        _id: 1,
                        studentId: 1,
                        student: { name: 1, registerNo: 1 }
                    }
                }
            },
            { $sort: { 'hostel.hostelName': 1, 'room.roomNumber': 1, bedName: 1 } }
        ]);

        res.json(beds);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;