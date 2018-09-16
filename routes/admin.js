const express = require('express');
const router = express.Router();
const categorys = require('../models/categorys');

/* Admin page */
router.get('/', (req, res) => {
    res.render('admin', {layout: false});
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

module.exports = router;