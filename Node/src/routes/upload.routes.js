/**
 * Upload Routes - File upload endpoints
 */

const express = require('express');
const router = express.Router();

const {
    uploadSingleImage,
    uploadMultipleImages,
    uploadDocument,
    deleteFile,
    getFileInfo
} = require('../controllers/upload.controller');

const {
    uploadSingleImage: uploadSingleMiddleware,
    uploadMultipleImages: uploadMultipleMiddleware,
    uploadSingleDocument: uploadDocumentMiddleware
} = require('../middlewares/upload.middleware');

const { protect, authorize } = require('../middlewares/auth.middleware');

// All upload routes require authentication
router.use(protect);

// Upload routes
router.post('/image', uploadSingleMiddleware, uploadSingleImage);
router.post('/images', uploadMultipleMiddleware, uploadMultipleImages);
router.post('/document', uploadDocumentMiddleware, uploadDocument);

// File operations
router.get('/:filename', getFileInfo);
router.delete('/:filename', deleteFile);

module.exports = router;
