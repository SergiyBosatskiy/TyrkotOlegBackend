const jwt = require('jsonwebtoken');
const credentials = require('../credentials');

module.exports = {
    checkAuth: (req, res, callback) => {
        const token = req.headers['x-access-token'];
        if (!token) return res.status(470).send({ auth: false, message: 'No token provided.' });
        jwt.verify(token, credentials.tokenConfig.tokenSecret, function(err, decoded) {
            if (err) return res.status(470).send({ auth: false, message: 'Помилка при перевірці токена авторизації.', error: err });
            callback(decoded);
        });
    }
};
