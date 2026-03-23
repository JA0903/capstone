import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure uploads/resumes directory exists
const resumeDir = "uploads/resumes";
if (!fs.existsSync(resumeDir)) {
    fs.mkdirSync(resumeDir, { recursive: true });
}

// Multer storage config
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, resumeDir);
    },
    filename: function (req, file, cb) {
        const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + "-" + unique + ext);
    }
});

// File filter for PDF/DOCX only
const fileFilter = (req, file, cb) => {
    const allowedMimes = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/msword"
    ];
    const ext = path.extname(file.originalname).toLowerCase();

    // Check both MIME type and extension
    if (allowedMimes.includes(file.mimetype) || [".pdf", ".docx", ".doc"].includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error("Only PDF, DOC, and DOCX files are allowed"), false);
    }
};

// Max file size: 5MB
const limits = {
    fileSize: 5 * 1024 * 1024 // 5MB
};

// Export Multer middleware
export const upload = multer({ storage, fileFilter, limits });

// Error handler middleware for multer
export const handleUploadError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'FILE_TOO_LARGE') {
            return res.status(400).json({
                success: false,
                message: 'File size exceeds 5MB limit'
            });
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({
                success: false,
                message: 'Only one file is allowed'
            });
        }
    } else if (err) {
        return res.status(400).json({
            success: false,
            message: err.message || 'File upload failed'
        });
    }
    next();
};
