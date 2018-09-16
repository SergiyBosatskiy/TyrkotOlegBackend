const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorys = new Schema({
    name: String,
    subMenu: String,
    title: String,
	keywords: String,
	description: String,
    seo: String,
    level: Number
});

const Cat = mongoose.model('Categorys', categorys);
module.exports = Cat;