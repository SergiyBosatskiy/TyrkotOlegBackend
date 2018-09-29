const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const formidable = require('formidable');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const credentials = require('./credentials');
const adminRouter = require('./routes/admin');
const adminLogin = require('./routes/adminlogin');
const cors = require('cors');

// для кросдоменних запросів
app.use(cors());
app.options('*', cors());

app.set('port', process.env.PORT || credentials.port);
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser(credentials.cookieSecret));
app.use(session({ resave: false, saveUninitialized: false, secret: credentials.cookieSecret }));
switch (app.get('env')){
    case 'development': mongoose.connect(credentials.mongo.development.connectionString).then(
        () => { console.log('MongoDB connect SUCCESSFUL') },
        err => { console.log(`Помилка з'єднання з базою данних: ${err}`)}
    );
    break;
    case 'production': mongoose.connect(credentials.mongo.production.connectionString).then(
        () => { console.log('MongoDB connect SUCCESSFUL') },
        err => { console.log(`Помилка з'єднання з базою данних: ${err}`)}
    );
    break;
    default: throw new Error(`Невідоме середовище виконання: ${app.get('env')}`);
};
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const handlebars = require('express-handlebars').create({ defaultLayout: 'main', helpers: {
        section: function (name, options) {
            if (!this._sections) this._sections = {};
            this._sections[name] = options.fn(this);
            return null; }
    }
});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.use('/admin', adminRouter);
app.use('/admin', adminLogin); // маршрути провірки логіна адміна


//error 404
app.use(function (req, res, next) {
    res.status(404);
    switch (req.accepts(['json', 'html'])){
		case 'json':
			res.json({ message: 'помилка 404' });
			break;
		case 'html':
			res.render('404', { title: 'Помилка 404. Сторінка не знайдена' });
			break;
	}
});

//error 500
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500);
    res.render('500', { title: 'Internal Server Error' });
});

app.listen(app.get('port'), function () {
    console.log(`Сервер запущено на порті: ${app.get('port')}  Environment: ${app.get('env')}`);
});