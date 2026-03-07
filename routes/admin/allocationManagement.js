const express = require("express");
const router = express.Router();
const Allocation = require("../../models/allocation");
const Bed = require("../../models/bed");
const Hostel = require("../../models/hostel");
const Room = require("../../models/room");
const User = require("../../models/user");

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

// --------------------------------------------------------------------------------------------------------------------------------

router.get("/students/unallocated", async (req, res) => {

    try {

        const unallocatedStudents = await User.aggregate([
            { $match: { role: "student" } },
            {
                $lookup: {
                    from: "allocations",
                    let: { studentId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ["$studentId", "$$studentId"] },
                                status: "Active"
                            }
                        }
                    ],
                    as: "activeAllocation"
                }
            },
            { $match: { activeAllocation: { $size: 0 } } },
            { $project: { name: 1, registerNo: 1, email: 1 } }
        ]);
        res.json(unallocatedStudents);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// --------------------------------------------------------------------------------------------------------------------------------

router.post("/allocate", async (req, res) => {

    const { studentId, bedId } = req.body;   

    try {

        // 1. Verify the bed exists and get its roomId
        const bed = await Bed.findById(bedId).populate('roomId');
        if (!bed) {
            return res.status(404).json({ message: "Bed not found" });
        }

        const room = bed.roomId;
        if (!room) {
            return res.status(400).json({ message: "Bed is not associated with a room" });
        }

        const hostelId = room.hostelId; 

        // 2. Check if bed is already occupied
        const existingAllocation = await Allocation.findOne({
            bedId,
            status: "Active"
        });
        if (existingAllocation) {
            return res.status(400).json({ message: "Bed is already occupied" });
        }

        // 3. Check if student already has an active allocation
        const studentAllocation = await Allocation.findOne({
            studentId,
            status: "Active"
        });
        if (studentAllocation) {
            return res.status(400).json({ message: "Student already has an active allocation" });
        }

        // 4. Create new allocation
        const newAllocation = new Allocation({
            studentId,
            bedId,
            roomId: room._id,
            hostelId,
            allocatedDate: new Date(),
            status: "Active"
        });

        await newAllocation.save();

        res.status(201).json({
            message: "Allocation created successfully",
            allocation: newAllocation
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

// --------------------------------------------------------------------------------------------------------------------------------

module.exports = router;