const mongoose = require('mongoose');
//const Schema = mongoose.Schema;

const imageSchema = mongoose.Schema({
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

//const model = mongoose.model('week1', imageSchema);

module.exports = mongoose.model('Image', imageSchema);