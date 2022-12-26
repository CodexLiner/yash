const express = require('express');
const expresslayouts = require('express-ejs-layouts');
const fileUpload = require('express-fileupload');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');

const app = express();
const port = process.env.PORT || 3000;
app.use(express.static(__dirname + '../public'));

require('dotenv').config();

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(expresslayouts);

app.use(cookieParser('CookingBlogSecure'));
// app.use(session({
//     secret: 'CookingBlogSecretSession',
//     saveUninitialized: true,
//     resave: true
// }));


//-momery unleaked---------
app.set('trust proxy', 1);

app.use(session({
cookie:{
    secure: true,
    maxAge:60000
       },
store: new RedisStore(),
secret: 'secret',
saveUninitialized: true,
resave: false
}));


app.engine( "hbs", exphbs({ defaultLayout: null }));

app.use(flash());
app.use(fileUpload());

app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

const routes = require('./server/routes/reciperoute.js');
app.use('/', routes);
app.listen(5000, () => {
    console.log("Running on port 5000.");
});