const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const conn = await mongoose.connect("mongodb://localhost:27017/hpms");
        console.log(`MongoDB has been connected successfully`);
    } catch (error) {
        console.error("Database Error:", error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
