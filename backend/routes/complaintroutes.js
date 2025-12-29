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

const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/bmp', 'image/svg+xml'];
const DOC_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];
const AUDIO_TYPES = ['audio/webm', 'audio/mpeg', 'audio/mp4', 'audio/ogg', 'audio/wav'];

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB per file
  fileFilter: (req, file, cb) => {
    const field = file.fieldname;
    const mimetype = file.mimetype || '';
    if (field === 'media') {
      if (IMAGE_TYPES.includes(mimetype) || DOC_TYPES.includes(mimetype)) return cb(null, true);
      return cb(new Error('Invalid media file type'));
    }
    if (field === 'voice') {
      if (AUDIO_TYPES.includes(mimetype)) return cb(null, true);
      return cb(new Error('Invalid audio type'));
    }
    return cb(new Error('Unexpected upload field'));
  }
});

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


