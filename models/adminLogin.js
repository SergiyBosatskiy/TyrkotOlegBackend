const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const crypto = require('crypto');

const adminLogin = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
    date: { type: Date, default: Date.now },
    hidden: { type: Boolean, default: false },
    refreshToken: { type: String, default: '' },
    refreshTokenLife: { type: Number, default: 0 },
	roles: Array,
    salt: String,
	avatar: { img: String }
});

adminLogin.methods.setPassword = function(password) {

    // creating a unique salt for a particular user
    this.salt = crypto.randomBytes(16).toString('hex');

    // hashing user's salt and password with 1000 iterations,
    // 64 length and sha512 digest
    this.password = crypto.pbkdf2Sync(password, this.salt, 1000, 64, `sha512`).toString(`hex`);
};

adminLogin.methods.validPassword = function(password) {
    const hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, `sha512`).toString(`hex`);
    return this.password === hash;
};

const Login = mongoose.model('AdminLogin', adminLogin);
module.exports = Login;