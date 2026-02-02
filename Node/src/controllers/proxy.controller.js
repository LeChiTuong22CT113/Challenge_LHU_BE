/**
 * Proxy Controller - Refactored with Clean Code
 * catchAsync, AppError for error handling
 */

const axios = require('axios');
const weatherService = require('../services/weather.service');
const catchAsync = require('../utils/catchAsync');
const { AppError } = require('../utils/appError');

// Blocked URL patterns for security
const BLOCKED_PATTERNS = ['localhost', '127.0.0.1', '0.0.0.0', '192.168.', '10.', '172.16.'];

/**
 * @desc    Get current weather by city
 * @route   GET /api/proxy/weather/:city
 */
const getWeather = catchAsync(async (req, res) => {
    const { city } = req.params;
    const { units = 'metric' } = req.query;

    const weather = await weatherService.getCurrentWeather(city, units);

    res.json({
        success: true,
        message: `Current weather for ${city}`,
        data: weather
    });
});

/**
 * @desc    Get weather by coordinates
 * @route   GET /api/proxy/weather/coords
 */
const getWeatherByCoords = catchAsync(async (req, res, next) => {
    const { lat, lon, units = 'metric' } = req.query;

    if (!lat || !lon) {
        return next(new AppError('Latitude and longitude are required', 400));
    }

    const weather = await weatherService.getWeatherByCoords(lat, lon, units);

    res.json({
        success: true,
        message: 'Weather by coordinates',
        data: weather
    });
});

/**
 * @desc    Get 5-day forecast
 * @route   GET /api/proxy/forecast/:city
 */
const getForecast = catchAsync(async (req, res) => {
    const { city } = req.params;
    const { units = 'metric' } = req.query;

    const forecast = await weatherService.getForecast(city, units);

    res.json({
        success: true,
        message: `5-day forecast for ${city}`,
        data: forecast
    });
});

/**
 * @desc    Generic proxy endpoint
 * @route   POST /api/proxy/fetch
 */
const proxyFetch = catchAsync(async (req, res, next) => {
    const { url, method = 'GET', headers = {}, data } = req.body;

    if (!url) {
        return next(new AppError('URL is required', 400));
    }

    // Security: Block internal URLs
    if (BLOCKED_PATTERNS.some(pattern => url.includes(pattern))) {
        return next(new AppError('Internal URLs are not allowed', 403));
    }

    const response = await axios({
        url,
        method,
        headers: { ...headers, 'User-Agent': 'ChallengeLHU-API/1.0' },
        data,
        timeout: 10000
    });

    res.json({
        success: true,
        status: response.status,
        data: response.data
    });
});

module.exports = {
    getWeather,
    getWeatherByCoords,
    getForecast,
    proxyFetch
};
