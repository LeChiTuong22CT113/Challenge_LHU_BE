/**
 * Proxy Routes
 * Third-party API proxy endpoints
 */

const express = require('express');
const router = express.Router();
const proxyController = require('../controllers/proxy.controller');

// Weather endpoints
router.get('/weather/coords', proxyController.getWeatherByCoords);
router.get('/weather/:city', proxyController.getWeather);
router.get('/forecast/:city', proxyController.getForecast);

// Generic proxy
router.post('/fetch', proxyController.proxyFetch);

module.exports = router;
