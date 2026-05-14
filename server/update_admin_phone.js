const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const updateAdminPhone = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const result = await User.updateMany(
            { role: 'admin' },
            { $set: { phone: '9515229043' } }
        );

        console.log(`Updated ${result.modifiedCount} admin(s) with phone number.`);
        process.exit();
    } catch (error) {
        console.error('Error updating admin:', error);
        process.exit(1);
    }
};

updateAdminPhone();
