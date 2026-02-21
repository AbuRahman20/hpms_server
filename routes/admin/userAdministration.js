const express = require('express');
const router = express.Router();
const UserModel = require('../../models/user');

// --------------------------------------------------------------------------------------------------------------------------------

// Add user (register)

router.post('/addUser', async (req, res) => {

    const { registerNo, name, department, year, phone, password, role, aadharNo, semester, section, academicYear, graduate, fatherName, religion, category, address, state, district, pincode } = req.body;

    if (!registerNo || !name || !phone || !password) {
        return res.status(400).json({
            message: 'Required fields are missing'
        });
    }

    try {
        const existingUser = await UserModel.findOne({ registerNo });

        if (existingUser) {
            return res.status(409).json({
                message: 'User already exists'
            });
        }

        const newUser = new UserModel({ registerNo, name, department, year, phone, password, role, aadharNo, semester, section, academicYear, graduate, fatherName, religion, category, address, state, district, pincode });
        await newUser.save();

        res.status(201).json({
            message: 'User added successfully',
            userId: newUser._id
        });

    } catch (error) {
        console.error('Error during add user: ', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// --------------------------------------------------------------------------------------------------------------------------------

// Fetch all users

router.get('/fetchdata', async (req, res) => {
    try {
        const data = await UserModel.find();
        res.json(data);
    } catch (error) {
        console.error("Error in fetching user data : ", error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

// --------------------------------------------------------------------------------------------------------------------------------

// Delete user

router.post('/deleteUser', async (req, res) => {
    const { registerNo } = req.body;
    try {
        await UserModel.deleteOne({ registerNo: registerNo });
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error("Error in deleting user : ", error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// --------------------------------------------------------------------------------------------------------------------------------

// Update user

router.put('/updateUser', async (req, res) => {
    try {
        const { registerNo, ...rest } = req.body;
        if (!registerNo) {
            return res.status(400).json({ message: 'Register No is required' });
        }
        const updateData = { ...rest };
        if (registerNo && registerNo.trim() !== '') {
            updateData.registerNo = registerNo;
        }
        const updatedUser = await UserModel.findOneAndUpdate(
            { registerNo },
            { $set: updateData },
            { new: true }
        );
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({
            message: "User updated successfully",
            user: updatedUser
        });
    } catch (error) {
        console.error("Update error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// --------------------------------------------------------------------------------------------------------------------------------

module.exports = router;