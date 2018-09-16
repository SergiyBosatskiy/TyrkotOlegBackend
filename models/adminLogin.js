const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const adminLogin = new Schema({
    name: String,
    password:String,
    permission: Number,
	roles: String,
	avatar: String
});

const Login = mongoose.model('AdminLogin', adminLogin);
module.exports = Login;