require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const parkingRoutes = require("./routes/parkingRoutes");
const authRoutes = require("./routes/authRoutes");
const aiRoutes = require("./routes/aiRoutes");

const app = express();

const PORT = 5000;

app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/parking", parkingRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "Smart Parking Backend Running"
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
