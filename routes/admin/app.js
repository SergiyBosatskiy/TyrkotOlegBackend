const express = require('express');
const router = express.Router();
const categorys = require('../../models/categorys');
const path = require('path');
const os = require('os');
const { checkAuth } = require('../../lib/adminUtils');

router.get('/systeminfo', (req, res) => {
	checkAuth(req, res, function () {
		const info = {
			'ostype': os.type(),
			'osrelease': os.release(),
			'totalmem': Math.ceil(os.totalmem() / 1048576),
			'freemem': Math.ceil(os.freemem() / 1048576),
			'loadavg': os.loadavg(),
			'cpu': os.cpus(),
			'arch': os.arch(),
			'ip': req.ip,
			'uptime': os.uptime() / 60,
			'hostname': os.hostname(),
			'homedir': os.homedir()
		};
		res.json(info);
    })
});

router.post('/categorys/add', async (req, res) => {
	const postData = {
		name: req.body.name,
		subMenu: req.body.sub,
		title: req.body.title,
		keywords: req.body.keywords,
		description: req.body.description,
		seo: req.body.seo,
        level: req.body.level
	};
	
	const post = new categorys(postData);
	
	await post.save();
	res.json({"code":20000});
});

router.post('/categorys/get', async (req, res) => {
	const posts = await categorys.find({});
	res.json({"code":20000,"data":{"cat":posts}});
});

router.post('/categorys/edit', async (req, res) => {
	await categorys.where({ _id: req.body.id }).update({ name: req.body.name, title: req.body.title, subMenu: req.body.sub,
						keywords: req.body.keywords, description: req.body.description, seo: req.body.seo,
						level: req.body.level});
	res.json({"code":20000});
});

router.post('/categorys/delete', async (req, res) => {
   await categorys.remove({_id: req.body.element});
    res.json({"code":20000})
});

// підключення індексного файлу адмінки і перенаправлення всіх роутів на неї для 404 сторінки
router.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../../public/admin/index.html'));
});

module.exports = router;