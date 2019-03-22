const express = require('express');
const mongo = require('mongodb');
const mongoose = require('mongoose');
const assert = require('assert');
const multer = require('multer');
const path = require('path');
const ejs = require('ejs');
const sharp = require('sharp');
require('dotenv').config();

// Init app
const app = express();

// EJS
app.set('view engine', 'ejs');

// Set storage Engine
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() +
            path.extname(file.originalname));
    }
});

// MongoDB

const Schema = mongoose.Schema;

const formSchema = new Schema({
    category: String,
    title: String,
    description: String,
    imagePath: String,
    thumbnailPath: String,
    coordinates: {
        latitude: String,
        longitude: String
    }
});

const model = mongoose.model('week1', formSchema);

// When connection to database is successful, initialize server
mongoose.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PWD}@${process.env.DB_HOST}:${process.env.DB_PORT}/subscribe?authSource=admin`).then(() => {
    console.log("Connected to mongoDB succesfully!");

    app.listen(process.env.APP_PORT, () => {
        console.log("Server started, and running on localhost:3000");
    });
}, err => {
    console.log(process.env);
    console.log('Error: ' + err );
});

// Init Upload
const upload = multer({
    storage: storage
}).single('myImage');

// Public Folder
app.use(express.static('./public'));

app.get('/', (req, res) => res.render('index'));

// // Database url
// var url = 'mongodb://localhost:27017/test';

app.post('/upload', (req, res, next) => {
    upload(req, res, (err) => {
        if (err) {
            res.sendStatus(400);
        } else {
            if (req.file === undefined) {
                res.sendStatus(400);
            } else {
                console.log(req.file);
                //res.send(req.file);
                next();
            }
        }
    });
});

// Create small thumbnail

app.use('/upload', (req, res, next) => {
    sharp(req.file.path)
        .resize(300, 300)
        .toFile('public/uploads/small/photo200x200.jpg');
        next();

});

// Create medium thumbnail

app.use('/upload', (req, res) => {
    sharp(req.file.path)
        .resize(300, 300)
        .toFile('public/uploads/medium/photo500x500.jpg')
        .then(() => {
            res.send(
                'moro'
            );
        });
});

// Sending data to MongoDB

app.get('/', (req, res) => {
    formSchema.create({
        category: body.category,
        title: body.title,
        description: body.description,
        imagePath: file.path,
        thumbnailPath: file.destination + 'thumbnail/' + file.filename,
        coordinates: {
            latitude: body.latitude,
            longitude: body.longitude
        }})
        .then(post => {
        console.log(post.id);
        res.send('Created data!');
    });
});

app.get('/getAll', (req, res) => {
    formSchema.find().then(all => {
        console.log(all);
        res.send(all);
    });
});

// Tests
app.get('/test', (req, res) => {
    const ip = req.ip;
    res.send(`Hello ${ip}`);
});

// // Server starting
// const port = 3000;
//
// app.listen(port, () => console.log(`Server started on port ${port}`));