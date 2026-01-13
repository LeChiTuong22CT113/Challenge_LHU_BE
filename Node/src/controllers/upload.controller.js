/**
 * Upload Controller - Handle file uploads
 */

const path = require('path');
const fs = require('fs');

// @desc    Upload single image
// @route   POST /api/upload/image
const uploadSingleImage = (req, res) => {
    if (!req.file) {
        return res.status(400).json({
            success: false,
            message: 'No file uploaded'
        });
    }

    res.status(201).json({
        success: true,
        message: 'Image uploaded successfully',
        data: {
            filename: req.file.filename,
            originalname: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size,
            path: `/uploads/${req.file.filename}`
        }
    });
};

// @desc    Upload multiple images
// @route   POST /api/upload/images
const uploadMultipleImages = (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({
            success: false,
            message: 'No files uploaded'
        });
    }

    const files = req.files.map(file => ({
        filename: file.filename,
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        path: `/uploads/${file.filename}`
    }));

    res.status(201).json({
        success: true,
        message: `${files.length} images uploaded successfully`,
        data: files
    });
};

// @desc    Upload document
// @route   POST /api/upload/document
const uploadDocument = (req, res) => {
    if (!req.file) {
        return res.status(400).json({
            success: false,
            message: 'No file uploaded'
        });
    }

    res.status(201).json({
        success: true,
        message: 'Document uploaded successfully',
        data: {
            filename: req.file.filename,
            originalname: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size,
            path: `/uploads/${req.file.filename}`
        }
    });
};

// @desc    Delete file
// @route   DELETE /api/upload/:filename
const deleteFile = (req, res) => {
    const { filename } = req.params;
    const filepath = path.join(__dirname, '../../uploads', filename);

    if (!fs.existsSync(filepath)) {
        return res.status(404).json({
            success: false,
            message: 'File not found'
        });
    }

    fs.unlinkSync(filepath);

    res.json({
        success: true,
        message: 'File deleted successfully'
    });
};

// @desc    Get file info
// @route   GET /api/upload/:filename
const getFileInfo = (req, res) => {
    const { filename } = req.params;
    const filepath = path.join(__dirname, '../../uploads', filename);

    if (!fs.existsSync(filepath)) {
        return res.status(404).json({
            success: false,
            message: 'File not found'
        });
    }

    const stats = fs.statSync(filepath);

    res.json({
        success: true,
        data: {
            filename,
            size: stats.size,
            created: stats.birthtime,
            path: `/uploads/${filename}`
        }
    });
};

module.exports = {
    uploadSingleImage,
    uploadMultipleImages,
    uploadDocument,
    deleteFile,
    getFileInfo
};
