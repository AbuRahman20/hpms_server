const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const UserModel = require("./models/user");
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

    const { registerNo, password } = req.body

    try {

        const userExist = await UserModel.findOne({ registerNo });

        if (userExist) {
            if (userExist.password === password) {
                return res.status(200).json({ message: 'Login successful' })
            }
            else {
                return res.json({ message: 'Password incorrect' })
            }
        }
        else {
            return res.json({ message: 'User not found' })
        }
    } catch (error) {
        console.error('Error during login : ', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
})
// ----------------------------------------------------------------------------------------------------

app.post('/addUser', async (req, res) => {

    const { registerNo, name, department, year, phone, password, role, aadharNo, semester, section, academicYear, graduate, fatherName, religion, category, address, state, district, pincode } = req.body

    if (!registerNo || !name || !phone || !password) {
        return res.status(400).json({
            message: 'Required fields are missing'
        });
    }

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

// ----------------------------------------------------------------------------------------------------
