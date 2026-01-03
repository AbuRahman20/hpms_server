const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const UserModel = require("./models/user");
const hostelModel = require("./models/hostel");
const roomModel = require("./models/room");
const bedModel = require("./models/bed");
const paymentModel = require("./models/payment");
const feeStructureModel = require("./models/feeStructure");
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect DB
connectDB();

const PORT = 5000;

app.listen(PORT, () => { console.log(`Server running on port ${PORT}`) });

// ----------------------------------------------------------------------------------------------------

// Login coding 
app.post('/user', async (req, res) => {
    const { registerNo, password } = req.body;

    try {
        const userExist = await UserModel.findOne({ registerNo });

        if (!userExist) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (userExist.password !== password) {
            return res.status(401).json({ message: 'Password incorrect' });
        }

        return res.status(200).json({ message: 'Login successful' });

    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

// ----------------------------------------------------------------------------------------------------
//  User Adding coding

app.post('/addUser', async (req, res) => {

    const { registerNo, name, department, year, phone, password, role, aadharNo, semester, section, academicYear, graduate, fatherName, religion, category, address, state, district, pincode } = req.body

    if (!registerNo || !name || !phone || !password) {
        return res.status(400).json({
            message: 'Required fields are missing'
        });
    }
    const existingUser = await UserModel.findOne({ registerNo })

    if (existingUser) {
        return res.status(409).json({
            message: 'User already exists'
        });
    }

    try {
        const newUser = new UserModel({ registerNo, name, department, year, phone, password, role, aadharNo, semester, section, academicYear, graduate, fatherName, religion, category, address, state, district, pincode })
        await newUser.save()

        res.status(201).json({
            message: 'User added successfully',
            userId: newUser._id
        });

    } catch (error) {
        console.error('Error during add user: ', error);
        res.status(500).json({ message: 'Internal server error' });
    }
})

// ----------------------------------------------------------------------------------------------------

// User fetching coding

app.get('/fetchdata', async (req, res) => {

    try {
        const data = await UserModel.find()
        res.json(data)
    } catch (error) {
        console.error("Error in fetching user data : ", error);
        return res.status(500).json({ message: 'Internal server error' });
    }
})

// ----------------------------------------------------------------------------------------------------
//  User Deleting coding

app.post('/deleteUser', async (req, res) => {
    const {  registerNo } = req.body;
    try {
        await UserModel.deleteOne({ registerNo: registerNo });
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error("Error in deleting user : ", error);
        res.json({ message: 'Internal server error' });
    }   
});
// ----------------------------------------------------------------------------------------------------
// user update coding

app.put('/updateUser', async (req, res) => {
    console.log(req.body)
    try {
    const { registerNo, ...rest } = req.body;
        if(!registerNo){
            return res.status(400).json({ message: 'Register No is required' });
        }
        const updateData={ ...rest };
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
})
// ----------------------------------------------------------------------------------------------------

// Hostel fetching coding

app.get('/fetchhosteldata', async (req, res) => {
console.log('first')
    try {
        const data = await hostelModel.find();
        res.json(data)
    } catch (error) {
        console.error("Error in fetching hostel data : ", error);
        return res.status(500).json({ message: 'Internal server error' });
    }
})