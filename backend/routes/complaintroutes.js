const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { protect } = require('../middleware/authMiddleware');
const complaintController = require('../controllers/complaintController');

const router = express.Router();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${unique}${ext}`);
  },
});

const upload = multer({ storage });

// Create complaint (auth optional: allow anonymous but still accept logged-in user)
router.post(
  '/',
  // Try to decode token if present; don't block if absent
  (req, res, next) => {
    const header = req.headers.authorization;
    if (!header) return next();
    return protect(req, res, next);
  },
  upload.fields([
    { name: 'media', maxCount: 5 },
    { name: 'voice', maxCount: 1 },
  ]),
  complaintController.createComplaint
);

// Get complaints with filters (requires authentication)
router.get('/', protect, complaintController.listComplaints);

// Admin CSV export
router.get('/export/csv', protect, complaintController.exportComplaintsCSV);

// Get single complaint (requires authentication)
router.get('/:id', protect, complaintController.getComplaint);

// Update complaint (requires authentication)
router.patch('/:id', protect, complaintController.updateComplaint);

module.exports = router;


