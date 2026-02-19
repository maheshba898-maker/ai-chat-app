import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const router = express.Router();

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "../uploads");
console.log("Uploads directory:", uploadsDir);

try {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log("Created uploads directory");
  } else {
    console.log("Uploads directory already exists");
  }
} catch (err) {
  console.error("Error creating uploads directory:", err);
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("Saving file to:", uploadsDir);
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    // Create unique filename with original name
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const filename = file.fieldname + "-" + uniqueSuffix + ext;
    console.log("Generated filename:", filename);
    cb(null, filename);
  },
});

// Create multer upload instance
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    console.log("Received file:", file.originalname, file.mimetype);
    cb(null, true); // Accept all files
  },
}).single("file"); // 'file' must match the field name in frontend

// Get all files
router.get("/", (req, res) => {
  try {
    console.log("GET /api/files - Fetching files");

    if (!fs.existsSync(uploadsDir)) {
      return res.json([]);
    }

    const files = fs.readdirSync(uploadsDir).map((filename) => {
      const filePath = path.join(uploadsDir, filename);
      const stats = fs.statSync(filePath);
      return {
        name: filename,
        originalName: filename.split("-").slice(3).join("-") || filename,
        size: stats.size,
        uploadDate: stats.mtime,
        path: filename,
      };
    });

    // Sort by date (newest first)
    files.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));

    console.log(`Found ${files.length} files`);
    res.json(files);
  } catch (error) {
    console.error("Error getting files:", error);
    res.status(500).json({ error: error.message });
  }
});

// Upload file
router.post("/upload", (req, res) => {
  console.log("POST /api/files/upload - Upload request received");

  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading
      console.error("Multer error:", err);
      return res.status(400).json({ error: `Multer error: ${err.message}` });
    } else if (err) {
      // An unknown error occurred
      console.error("Unknown upload error:", err);
      return res
        .status(500)
        .json({ error: err.message || "Unknown error occurred" });
    }

    // Check if file was uploaded
    if (!req.file) {
      console.error("No file uploaded");
      return res.status(400).json({ error: "No file uploaded" });
    }

    console.log("File uploaded successfully:", req.file.filename);

    // Return success response
    res.json({
      message: "File uploaded successfully",
      file: {
        name: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        path: req.file.path,
      },
    });
  });
});

// Delete file
router.delete("/:filename", (req, res) => {
  try {
    const filename = req.params.filename;
    console.log("DELETE /api/files/" + filename);

    const filePath = path.join(uploadsDir, filename);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log("File deleted:", filename);
      res.json({ message: "File deleted successfully" });
    } else {
      console.log("File not found:", filename);
      res.status(404).json({ error: "File not found" });
    }
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
