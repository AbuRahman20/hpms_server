const express = require('express');
const router = express.Router();
const UserModel = require('../../models/user');

// --------------------------------------------------------------------------------------------------------------------------------

// Login

router.post('/user', async (req, res) => {

    const { registerNo, password } = req.body;

    try {
        const userExist = await UserModel.findOne({ registerNo });

        if (!userExist) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (userExist.password !== password) {
            return res.status(401).json({ message: 'Password incorrect' });
        }

        return res.status(200).json({
            message: 'Login successful',
            user: {
                registerNo: userExist.registerNo,
                role: userExist.role,
                name: userExist.name
            }
        });

    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

// --------------------------------------------------------------------------------------------------------------------------------



module.exports = router;