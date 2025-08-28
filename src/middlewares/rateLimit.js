const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // Ventana de tiempo (10 minutos)
    max: 100, // Número máximo de peticiones por IP en la ventana de tiempo
    //mensaje cuando excede el limite
    message: {
        code: 429,
        message: 'Demasiadas peticiones, intente más tarde'
    }
});

module.exports = { limiter };