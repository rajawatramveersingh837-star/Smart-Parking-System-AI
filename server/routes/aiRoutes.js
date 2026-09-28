const express = require("express");
const multer = require("multer");
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");

const router = express.Router();

const upload = multer({
    dest: "uploads/"
});

router.post("/detect", upload.single("file"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: "No image file uploaded"
            });
        }

        const formData = new FormData();

        formData.append(
            "file",
            fs.createReadStream(req.file.path),
            {
                filename: req.file.originalname,
                contentType: req.file.mimetype
            }
        );

        const response = await axios.post(
            "http://127.0.0.1:8000/detect",
            formData,
            {
                headers: formData.getHeaders()
            }
        );

        fs.unlinkSync(req.file.path);

        res.json(response.data);

    } catch (error) {

        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        console.error("AI DETECTION ERROR:", error.message);

        res.status(500).json({
            message: "AI detection failed",
            error: error.message
        });
    }
});

module.exports = router;