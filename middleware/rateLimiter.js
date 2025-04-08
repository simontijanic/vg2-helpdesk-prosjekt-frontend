const rateLimit = require('express-rate-limit');

const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutter
    max: 100,
    message: 'For mange forespørsler. Prøv igjen senere.',
});

const authLimiter = rateLimit({
    windowMs: 0 //15 * 60 * 1000, // 15 minutter
    max: 15, // Maks 10 forespørsler
    message: 'For mange innloggingsforsøk. Prøv igjen senere.',
});

module.exports = { generalLimiter, authLimiter };