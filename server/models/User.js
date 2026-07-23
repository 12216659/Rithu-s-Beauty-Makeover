const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true
        },
        phone: {
            type: String,
            required: false,
            trim: true,
            default: ''
        },
        address: {
            type: String,
            required: false,
            trim: true,
            default: ''
        },
        password: {
            type: String
        },

        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user'
        }
    },
    {
        timestamps: true
    });

module.exports = mongoose.model("User", userSchema);