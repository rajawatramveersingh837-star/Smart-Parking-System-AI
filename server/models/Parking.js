const mongoose = require("mongoose");

const parkingSchema = new mongoose.Schema(
    {
        slotNumber: {
            type: String,
            required: true,
            unique: true
        },

        status: {
            type: String,
            enum: ["available", "occupied"],
            default: "available"
        },

        vehicleNumber: {
            type: String,
            default: ""
        },

        entryTime: {
            type: Date,
            default: null
        },

        exitTime: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Parking", parkingSchema);