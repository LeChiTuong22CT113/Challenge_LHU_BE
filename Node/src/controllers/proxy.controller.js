/**
 * Proxy Controller
 * Handle third-party API requests
 */

const weatherService = require('../services/weather.service');
const catchAsync = require('../utils/catchAsync');

/**
 * @desc    Get current weather by city
 * @route   GET /api/proxy/weather/:city
 * @access  Public
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
 * @access  Public
 */
const getWeatherByCoords = catchAsync(async (req, res) => {
    const { lat, lon, units = 'metric' } = req.query;

    if (!lat || !lon) {
        return res.status(400).json({
            success: false,
            message: 'Latitude and longitude are required'
        });
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
 * @access  Public
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
 * @access  Public
 */
const proxyFetch = catchAsync(async (req, res) => {
    const axios = require('axios');
    const { url, method = 'GET', headers = {}, data } = req.body;

    if (!url) {
        return res.status(400).json({
            success: false,
            message: 'URL is required'
        });
    }

    // Security: Block internal URLs
    const blockedPatterns = ['localhost', '127.0.0.1', '0.0.0.0', '192.168.', '10.'];
    if (blockedPatterns.some(pattern => url.includes(pattern))) {
        return res.status(403).json({
            success: false,
            message: 'Internal URLs are not allowed'
        });
    }

    try {
        const response = await axios({
            url,
            method,
            headers: {
                ...headers,
                'User-Agent': 'ChallengeLHU-API/1.0'
            },
            data,
            timeout: 10000
        });

        res.json({
            success: true,
            status: response.status,
            data: response.data
        });
    } catch (error) {
        res.status(error.response?.status || 500).json({
            success: false,
            message: error.message,
            status: error.response?.status
        });
    }
});

module.exports = {
    getWeather,
    getWeatherByCoords,
    getForecast,
    proxyFetch
};
