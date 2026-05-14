const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const updateAllUsersPhone = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Update all users who don't have a phone field yet
        const result = await User.updateMany(
            { phone: { $exists: false } },
            { $set: { phone: '9515229043' } } // Setting a default phone for existing accounts
        );

        console.log(`Updated ${result.modifiedCount} user(s) with a phone number in MongoDB.`);
        process.exit();
    } catch (error) {
        console.error('Error updating users:', error);
        process.exit(1);
    }
};

updateAllUsersPhone();
