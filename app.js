const express = require('express');
const expresslayouts = require('express-ejs-layouts');
const fileUpload = require('express-fileupload');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const path = require('path');


const app = express();
const port = process.env.PORT || 3000;

require('dotenv').config();

app.use(express.urlencoded({extended:true }));
app.use(express.static('public'));
app.use(expresslayouts);

app.use(cookieParser('CookingBlogSecure'));
// app.use(session({
//     secret: 'CookingBlogSecretSession',
//     saveUninitialized: true,
//     resave: true
// }));
app.use(flash());
app.use(fileUpload());

// app.set('layout', './layouts/main');
// app.set('view engine', 'ejs');


    // Require static assets from public folder
    app.use(express.static(path.join(__dirname, 'public')));
    // Set view engine as EJS
    app.engine('ejs', require('ejs').renderFile);
    app.set('view engine', 'ejs');
    // Set 'views' directory for any views 
    // being rendered res.render()
    app.set('views', path.join(__dirname, 'views/'));



const routes = require('./server/routes/reciperoute.js');
app.use('/',routes);
app.listen(5000, () => {
    console.log("Running on port 5000.");
  });