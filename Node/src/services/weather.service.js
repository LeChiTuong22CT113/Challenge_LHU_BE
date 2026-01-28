/**
 * Weather Service
 * Proxy to OpenWeatherMap API
 */

const axios = require('axios');
const config = require('../config');
const { AppError } = require('../utils/appError');

// API Configuration
const WEATHER_API_BASE = 'https://api.openweathermap.org/data/2.5';
const API_KEY = process.env.OPENWEATHER_API_KEY || '';

/**
 * Get current weather by city name
 */
const getCurrentWeather = async (city, units = 'metric') => {
    try {
        const response = await axios.get(`${WEATHER_API_BASE}/weather`, {
            params: {
                q: city,
                appid: API_KEY,
                units,
                lang: 'vi'
            }
        });

        return formatWeatherData(response.data);
    } catch (error) {
        handleWeatherError(error);
    }
};

/**
 * Get weather by coordinates
 */
const getWeatherByCoords = async (lat, lon, units = 'metric') => {
    try {
        const response = await axios.get(`${WEATHER_API_BASE}/weather`, {
            params: {
                lat,
                lon,
                appid: API_KEY,
                units,
                lang: 'vi'
            }
        });

        return formatWeatherData(response.data);
    } catch (error) {
        handleWeatherError(error);
    }
};

/**
 * Get 5-day forecast
 */
const getForecast = async (city, units = 'metric') => {
    try {
        const response = await axios.get(`${WEATHER_API_BASE}/forecast`, {
            params: {
                q: city,
                appid: API_KEY,
                units,
                lang: 'vi'
            }
        });

        return formatForecastData(response.data);
    } catch (error) {
        handleWeatherError(error);
    }
};

/**
 * Format weather response
 */
const formatWeatherData = (data) => ({
    city: data.name,
    country: data.sys.country,
    coordinates: {
        lat: data.coord.lat,
        lon: data.coord.lon
    },
    weather: {
        main: data.weather[0].main,
        description: data.weather[0].description,
        icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
    },
    temperature: {
        current: data.main.temp,
        feels_like: data.main.feels_like,
        min: data.main.temp_min,
        max: data.main.temp_max
    },
    humidity: data.main.humidity,
    pressure: data.main.pressure,
    wind: {
        speed: data.wind.speed,
        deg: data.wind.deg
    },
    visibility: data.visibility,
    clouds: data.clouds.all,
    timestamp: new Date(data.dt * 1000).toISOString()
});

/**
 * Format forecast response
 */
const formatForecastData = (data) => ({
    city: data.city.name,
    country: data.city.country,
    forecast: data.list.map(item => ({
        datetime: new Date(item.dt * 1000).toISOString(),
        temperature: item.main.temp,
        feels_like: item.main.feels_like,
        humidity: item.main.humidity,
        weather: {
            main: item.weather[0].main,
            description: item.weather[0].description,
            icon: `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`
        },
        wind: item.wind.speed,
        pop: item.pop // Probability of precipitation
    }))
});

/**
 * Handle API errors
 */
const handleWeatherError = (error) => {
    if (error.response) {
        const { status, data } = error.response;

        if (status === 401) {
            throw new AppError('Invalid API key', 401);
        }
        if (status === 404) {
            throw new AppError('City not found', 404);
        }
        if (status === 429) {
            throw new AppError('API rate limit exceeded', 429);
        }

        throw new AppError(data.message || 'Weather API error', status);
    }

    throw new AppError('Weather service unavailable', 503);
};

module.exports = {
    getCurrentWeather,
    getWeatherByCoords,
    getForecast
};
