const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    service: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    address: { type: String, required: true },
    message: { type: String },
    status: { type: String, enum: ['Pending', 'Confirmed', 'Completed'], default: 'Pending' }
}, {
    timestamps: true
});

module.exports = mongoose.model('Booking', bookingSchema);
