const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const AdminLogin = require('../models/adminLogin');
const credentials = require('../credentials');


// провірка логіна і пароля для доступу в адмінку
router.post('/adminlogin', (req, res) => {
    const {login, password} = req.body;
    AdminLogin.findOne({username: login}).exec()
        .then(function (user) {
            if (user === null) {
                return res.status(401).json({auth: false, message: 'Неправильний логін або пароль'});
            } else {
                if (user.validPassword(password)) {
                    if (user.hidden) { return res.status(403).json({ auth: false, message: 'user hidden sorry' }) }
                    const userPayload = { user_id: user._id, username: user.username, role: user.role };
                    const tokenExpiresIn = Math.floor(Date.now() / 1000) + credentials.tokenConfig.tokenLife;
                    const refreshTokenExpiresIn = Math.floor(Date.now() / 1000) + credentials.tokenConfig.refreshTokenLife;
                    const token = jwt.sign(JSON.stringify(Object.assign({exp: tokenExpiresIn}, userPayload)), credentials.tokenConfig.tokenSecret);
                    const refreshToken = jwt.sign(JSON.stringify(Object.assign({exp: refreshTokenExpiresIn}, userPayload)), credentials.tokenConfig.refreshTokenSecret);
                    const response = {
                        'auth': true,
                        'accessToken': token,
                        'refreshToken': refreshToken,
                        'expires_in': tokenExpiresIn
                    };
                    user.set({ refreshToken: refreshToken, refreshTokenLife: refreshTokenExpiresIn });
                    user.save().then(() => res.status(200).json(response))
					.catch(error => { res.status(500).json({error: error})});
                } else {
                    return res.status(401).json({auth: false, message: 'Неправильний логін або пароль'});
                }
            }
        })
        .catch(error => {
            res.status(500).json({error: error});
        });
});

router.post('/refresh-token', (req, res) => {
    try {
        const {refreshToken} = req.body;
        const {user_id} = jwt.decode(refreshToken);
        AdminLogin.findOne({_id: user_id}).exec()
            .then((user) => {
                if (user.refreshToken === refreshToken) {
                    jwt.verify(refreshToken, credentials.tokenConfig.refreshTokenSecret, function (err, decoded) {
                        if (err) return res.status(500).json({
                            auth: false,
                            message: 'Помилка при перевірці рефреш токена. ',
                            error: err
                        });
                        const userPayload = {user_id: user._id, username: user.username, role: user.role};
                        const tokenExpiresIn = Math.floor(Date.now() / 1000) + credentials.tokenConfig.tokenLife;
                        const refreshTokenExpiresIn = Math.floor(Date.now() / 1000) + credentials.tokenConfig.refreshTokenLife;
                        const token = jwt.sign(JSON.stringify(Object.assign({exp: tokenExpiresIn}, userPayload)), credentials.tokenConfig.tokenSecret);
                        const newRefreshToken = jwt.sign(JSON.stringify(Object.assign({exp: refreshTokenExpiresIn}, userPayload)), credentials.tokenConfig.refreshTokenSecret);
                        const response = {
                            'auth': true,
                            'accessToken': token,
                            'refreshToken': newRefreshToken,
                            'expires_in': tokenExpiresIn
                        };
                        user.set({refreshToken: newRefreshToken, refreshTokenLife: refreshTokenExpiresIn});
                        user.save().then(() => res.status(200).json(response))
                            .catch(error => {
                                res.status(500).json({
                                    message: 'Помилка при записі рефреш токена в базу данних. ',
                                    error: error
                                })
                            });

                    });
                } else {
                    res.status(403).json({auth: false, message: 'Невірний рефреш токен.'});
                }
            })
            .catch((error) => {
                res.status(401).json({auth: false, message: 'Користувач не знайдений в базі данних. ', error: error});
            })
    }
    catch (e) {
        res.status(500).json({ auth: false, message: 'Помилка при декодуванні рефреш токена.' });
    }
});

router.post('/test', (req, res)=>{
	const token = req.headers['x-access-token'];
	console.log('test token',token);
	if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
	jwt.verify(token, credentials.tokenConfig.tokenSecret, function(err, decoded) {
    if (err) return res.status(500).send({ auth: false, message: 'Помилка при перевірці токена авторизації.', error: err });
    	console.log('decoded = ',decoded);
    	res.send({sergiy: '33'});
	});
	
});

router.get('/user/info', (req, res) => {
         const test = new AdminLogin({username: 'test', role: 'superAdmin'});
         test.setPassword('123456');
         test.save().then(()=>console.log('save success')).then(()=>res.send({eeee: 'eeew'})).catch((e)=>{res.send(e)});
});

router.post('/user/logout', (req, res) => {
	const answer = {"code":20000,"data":"success"};
	res.json(answer);
});

module.exports = router;