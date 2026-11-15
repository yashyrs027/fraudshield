import multer from 'multer';

// Storage in memory buffer for immediate processing and 24h ephemeral deletion
const storage = multer.memoryStorage();

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    const error = new Error('Unsupported file format. Only JPEG, PNG, and WebP images are allowed.');
    error.statusCode = 400;
    error.code = 'UNSUPPORTED_MEDIA_TYPE';
    cb(error, false);
  }
};

export const uploadMiddleware = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB limit
  },
  fileFilter,
});
