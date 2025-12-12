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

app.post('/user', async (req, res) => {

    const { registerNo, password } = req.body

    try {

        const userExist = await UserModel.findOne({ registerNo });

        if (userExist) {
            if (userExist.password === password) {
                return res.status(200).json({ message: 'Login successful' })
            }
            else {
                return res.status(401).json({ message: 'Password incorrect' })
            }
        }
        else {
            return res.json({ message: 'User not found' }).status(404)
        }
    } catch (error) {
        console.error('Error during login : ', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
})

// ----------------------------------------------------------------------------------------------------
