/**
 * Response Utility - Chuẩn hóa API response format
 */

/**
 * Gửi response thành công
 */
exports.sendSuccess = (res, data, message = null, statusCode = 200) => {
    res.status(statusCode).json({
        success: true,
        message,
        data,
        timestamp: new Date().toISOString()
    });
};

/**
 * Gửi response lỗi
 */
exports.sendError = (res, message, statusCode = 500, data = null) => {
    res.status(statusCode).json({
        success: false,
        message,
        data,
        timestamp: new Date().toISOString()
    });
};

/**
 * Tạo response với pagination
 */
exports.sendPaginated = (res, data, pagination, message = null) => {
    res.status(200).json({
        success: true,
        message,
        data,
        pagination,
        timestamp: new Date().toISOString()
    });
};
