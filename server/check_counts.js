const mongoose = require('mongoose');
const Booking = require('./models/Booking');
const Service = require('./models/Service');
const Gallery = require('./models/Gallery');
const dotenv = require('dotenv');

dotenv.config();

const checkCounts = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const bookingCount = await Booking.countDocuments();
        const serviceCount = await Service.countDocuments();
        const galleryCount = await Gallery.countDocuments();

        console.log(`Bookings: ${bookingCount}`);
        console.log(`Services: ${serviceCount}`);
        console.log(`Gallery: ${galleryCount}`);

        process.exit();
    } catch (error) {
        console.error('Error checking counts:', error);
        process.exit(1);
    }
};

checkCounts();
