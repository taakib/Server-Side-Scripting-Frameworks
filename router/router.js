const express = require('express');
const assert = require('assert');
const multer = require('multer');
const path = require('path');
const exphbs  = require('express-handlebars');
const controller = require('../controller/controller');
const router = express.Router();
const sharp = require('sharp');
const Image = require('../model/image');
require('dotenv').config();

// Set storage Engine
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() +
            path.extname(file.originalname));
    }
});

// Initialize Upload
const upload = multer({
    storage: storage
}).single('myImage');

router.get('/', (req, res) => {
    res.render("layouts/home.handlebars", {
        viewTemplate: "Image upload"
    });
});

// Initialize sharp
// TODO make new file name for thumbnails
function createThumbnails(path) {
    sharp(path)
        .resize(200, 200)
        .toFile('public/uploads/small/photo200x200.jpg');
}

// Check if image exists
router.post('/upload', (req, res, next) => {
    upload(req, res, (err) => {
        if (err) {
            res.sendStatus(400);
        } else {
            if (req.file === undefined) {
                res.sendStatus(400);
            } else {
                console.log(req.file);
                next();
            }
        }
    });
});

// Send data to MongoDB
router.post('/upload', (req, res) => {
    createThumbnails(req.file.path);
    Image.create({
        category: req.body.category,
        title: req.body.title,
        description: req.body.description,
        imagePath: req.file.path,
        thumbnailPath: req.file.destination + req.file.filename,
        coordinates: {
            latitude: req.body.latitude,
            longitude: req.body.longitude
        }})
        .then(post => {
            console.log(post.id);
            res.send('Created data!');
        });
});

router.get('/getAll', (req, res) => {
    Image.find().then( all => {
        res.send(all);
    });
});

module.exports = router;