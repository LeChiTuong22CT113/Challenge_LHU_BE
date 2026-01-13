/**
 * Upload Middleware - File upload configuration with Multer
 */

const multer = require('multer');
const path = require('path');
const { AppError } = require('../utils/appError');

// Storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        // Format: fieldname-timestamp-randomstring.ext
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    }
});

// File filter - Only allow images
const imageFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new AppError('Only image files are allowed (jpeg, png, gif, webp)', 400), false);
    }
};

// File filter - Allow documents
const documentFilter = (req, file, cb) => {
    const allowedTypes = [
        'image/jpeg', 'image/png', 'image/gif', 'image/webp',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new AppError('File type not allowed', 400), false);
    }
};

// Upload configurations
const uploadImage = multer({
    storage,
    fileFilter: imageFilter,
    limits: {
        fileSize: 5 * 1024 * 1024  // 5MB max
    }
});

const uploadDocument = multer({
    storage,
    fileFilter: documentFilter,
    limits: {
        fileSize: 10 * 1024 * 1024  // 10MB max
    }
});

// Upload methods
module.exports = {
    // Single image upload
    uploadSingleImage: uploadImage.single('image'),

    // Multiple images upload (max 5)
    uploadMultipleImages: uploadImage.array('images', 5),

    // Single document upload
    uploadSingleDocument: uploadDocument.single('document'),

    // Mixed fields upload
    uploadFields: uploadDocument.fields([
        { name: 'avatar', maxCount: 1 },
        { name: 'documents', maxCount: 3 }
    ])
};
