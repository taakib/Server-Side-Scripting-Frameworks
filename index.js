require('dotenv').config();
require('handlebars');
let handlebars = require('handlebars');
const exphbs  = require('express-handlebars');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const router = require('./router/router');
const Image = require('./model/image');
const ejs = require('ejs');
const sharp = require('sharp');
const bodyParser = require('body-parser');

// Init app
const app = express();

// Handlebars setting
app.set('views', path.join(__dirname, '/views/'));
app.engine('handlebars', exphbs({
    extname: 'handlebars',
    defaultLayout: 'main',
    layoutsDir: __dirname + '/views/layouts/'
}));
app.set('view engine', 'handlebars');

// When connection to database is successful, initialize server
mongoose.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PWD}@${process.env.DB_HOST}:${process.env.DB_PORT}/test`).then(() => {
    console.log("Connected to mongoDB succesfully!");

    app.listen(process.env.APP_PORT, () => {
        console.log("Server started, and running on localhost:3000");
    });
}, err => {
    console.log(process.env);
    console.log('Error: ' + err );
});

app.use('/main', router);