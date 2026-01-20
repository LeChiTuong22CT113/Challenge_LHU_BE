/**
 * Upload Middleware - File upload configuration with Multer
 */

const multer = require('multer');
const path = require('path');
const config = require('../config');
const { AppError } = require('../utils/appError');

// Storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, config.upload.uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    }
});

// File filter - Only allow images
const imageFilter = (req, file, cb) => {
    if (config.upload.allowedImageTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new AppError('Only image files are allowed (jpeg, png, gif, webp)', 400), false);
    }
};

// File filter - Allow documents
const documentFilter = (req, file, cb) => {
    if (config.upload.allowedDocTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new AppError('File type not allowed', 400), false);
    }
};

// Upload configurations
const uploadImage = multer({
    storage,
    fileFilter: imageFilter,
    limits: { fileSize: config.upload.maxImageSize }
});

const uploadDocument = multer({
    storage,
    fileFilter: documentFilter,
    limits: { fileSize: config.upload.maxDocSize }
});

// Upload methods
module.exports = {
    uploadSingleImage: uploadImage.single('image'),
    uploadMultipleImages: uploadImage.array('images', 5),
    uploadSingleDocument: uploadDocument.single('document'),
    uploadFields: uploadDocument.fields([
        { name: 'avatar', maxCount: 1 },
        { name: 'documents', maxCount: 3 }
    ])
};

