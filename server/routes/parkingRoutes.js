const express = require("express");
const Parking = require("../models/Parking");
const ParkingHistory = require("../models/ParkingHistory");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// ==========================================
// GET ALL PARKING SLOTS
// ==========================================
router.get("/", authMiddleware, async (req, res) => {
    try {
        const slots = await Parking.find()
            .sort({ slotNumber: 1 });

        res.json(slots);

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch parking slots",
            error: error.message
        });
    }
});


// ==========================================
// GET PARKING STATISTICS
// ==========================================
router.get("/stats", authMiddleware, async (req, res) => {
    try {

        // Total completed parking sessions
        const totalSessions =
            await ParkingHistory.countDocuments();

        // Calculate total revenue
        const revenueResult =
            await ParkingHistory.aggregate([
                {
                    $group: {
                        _id: null,
                        totalRevenue: {
                            $sum: "$parkingFee"
                        }
                    }
                }
            ]);

        const totalRevenue =
            revenueResult.length > 0
                ? revenueResult[0].totalRevenue
                : 0;

        res.json({
            totalSessions,
            totalRevenue
        });

    } catch (error) {

        console.error(
            "STATS ERROR:",
            error
        );

        res.status(500).json({
            message: "Failed to fetch parking statistics",
            error: error.message
        });
    }
});


// ==========================================
// GET PARKING HISTORY
// ==========================================
router.get("/history", authMiddleware, async (req, res) => {
    try {

        const history =
            await ParkingHistory.find()
                .sort({ exitTime: -1 });

        res.json(history);

    } catch (error) {

        console.error(
            "HISTORY ERROR:",
            error
        );

        res.status(500).json({
            message: "Failed to fetch parking history",
            error: error.message
        });
    }
});


// ==========================================
// POST NEW PARKING SLOT
// ==========================================
router.post("/", authMiddleware, async (req, res) => {
    try {

        const {
            slotNumber,
            status,
            vehicleNumber
        } = req.body;

        const newSlot = new Parking({

            slotNumber,

            status:
                status || "available",

            vehicleNumber:
                vehicleNumber || "",

            entryTime:
                status === "occupied"
                    ? new Date()
                    : null,

            exitTime: null
        });

        const savedSlot =
            await newSlot.save();

        res.status(201).json(
            savedSlot
        );

    } catch (error) {

        res.status(500).json({
            message:
                "Failed to create parking slot",

            error:
                error.message
        });
    }
});


// ==========================================
// UPDATE PARKING SLOT
// ==========================================
router.put("/:id", authMiddleware, async (req, res) => {

    try {

        const {
            status,
            vehicleNumber
        } = req.body;


        const existingSlot =
            await Parking.findById(
                req.params.id
            );


        if (!existingSlot) {

            return res.status(404).json({
                message:
                    "Parking slot not found"
            });
        }


        const updateData = {

            status,

            vehicleNumber:
                vehicleNumber || ""
        };


        // ==================================
        // VEHICLE ENTERED
        // ==================================

        if (
            existingSlot.status === "available" &&
            status === "occupied"
        ) {

            updateData.entryTime =
                new Date();

            updateData.exitTime =
                null;
        }


        // ==================================
        // VEHICLE EXITED
        // ==================================

        if (
            existingSlot.status === "occupied" &&
            status === "available"
        ) {

            const exitTime =
                new Date();


            if (existingSlot.entryTime) {

                // Calculate duration
                const durationMilliseconds =
                    exitTime -
                    existingSlot.entryTime;


                const durationMinutes =
                    Math.max(
                        1,
                        Math.ceil(
                            durationMilliseconds /
                            (1000 * 60)
                        )
                    );


                // Calculate started hours
                const hours =
                    Math.ceil(
                        durationMinutes / 60
                    );


                // ₹20 per started hour
                // Minimum ₹20
                const parkingFee =
                    Math.max(
                        hours * 20,
                        20
                    );


                // Save history
                await ParkingHistory.create({

                    slotNumber:
                        existingSlot.slotNumber,

                    vehicleNumber:
                        existingSlot.vehicleNumber ||
                        vehicleNumber ||
                        "UNKNOWN",

                    entryTime:
                        existingSlot.entryTime,

                    exitTime:

                        exitTime,

                    durationMinutes,

                    parkingFee
                });
            }


            updateData.exitTime =
                exitTime;


            updateData.vehicleNumber =
                "";
        }


        const updatedSlot =
            await Parking.findByIdAndUpdate(

                req.params.id,

                updateData,

                {
                    new: true
                }
            );


        res.json(
            updatedSlot
        );


    } catch (error) {

        console.error(
            "UPDATE PARKING ERROR:",
            error
        );


        res.status(500).json({

            message:
                "Failed to update parking slot",

            error:
                error.message
        });
    }
});


// ==========================================
// DELETE PARKING SLOT
// ==========================================
router.delete("/:id", authMiddleware, async (req, res) => {

    try {

        const deletedSlot =
            await Parking.findByIdAndDelete(
                req.params.id
            );


        if (!deletedSlot) {

            return res.status(404).json({

                message:
                    "Parking slot not found"
            });
        }


        res.json({

            message:
                "Parking slot deleted successfully",

            deletedSlot
        });


    } catch (error) {

        res.status(500).json({

            message:
                "Failed to delete parking slot",

            error:
                error.message
        });
    }
});


module.exports = router;