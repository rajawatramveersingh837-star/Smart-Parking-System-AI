const mongoose = require("mongoose");

const parkingHistorySchema = new mongoose.Schema(
    {
        slotNumber: {
            type: String,
            required: true
        },

        vehicleNumber: {
            type: String,
            required: true
        },

        entryTime: {
            type: Date,
            required: true
        },

        exitTime: {
            type: Date,
            required: true
        },

        durationMinutes: {
            type: Number,
            required: true
        },

        parkingFee: {
            type: Number,
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "ParkingHistory",
    parkingHistorySchema
);