const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const AdminLogin = require('../models/adminLogin');
const credentials = require('../credentials');
let loginName = null;

// провірка логіна і пароля для доступу в адмінку
router.post('/adminlogin', (req, res) => {
	const { login, password } = req.body;
	if(login === 'admin' && password === '123456'){
	
	let token1 = jwt.sign({ id: 1 }, credentials.secretForToken, {
      expiresIn: 3600 // expires in 24 hours
    });
    	res.status(200).send({ auth: true, token: token1 });
	} else {
		res.status(401).send({ auth: false, token: null });
	}
 //    const login = await AdminLogin.find({});
 //    let sendData = { code: 999, data: {token: ''} };
 //    for(let l of login){
 //    if(req.body.username === l.name && req.body.password === l.password){
 //        sendData.code = 20000;
	// 	sendData.data.token = 'admin';
	// 	loginName = l;
 //        res.json(sendData);
 //        break;
 //    }}; 
 //    if(sendData.code === 999){
	// 	sendData.message = 'Неправильне ім\'я або пароль. Спробуйте ще';
	// 	res.json(sendData);
	// };
});

router.post('/test', (req, res)=>{
	const token = req.headers['x-access-token'];
	console.log('test token',token);
	if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
	jwt.verify(token, credentials.secretForToken, function(err, decoded) {
    if (err) return res.status(500).send({ auth: false, message: 'Помилка при перевірці токена авторизації.', error: err });
    	console.log('decoded = ',decoded);
    	res.send({sergiy: '33'});
	});
	
})

router.get('/user/info', (req, res) => {
	if(loginName){
	let answer = {"code":20000,"data":{"roles":loginName.roles,"name":loginName.name,"avatar":loginName.avatar}};
	res.json(answer);
	};
});

router.post('/user/logout', (req, res) => {
	const answer = {"code":20000,"data":"success"};
	res.json(answer);
});

module.exports = router;