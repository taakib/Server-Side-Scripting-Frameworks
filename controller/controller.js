const Image = require('../model/image');

exports.findAllImages = () => {
    return Image.find()
        .then((image) => {
            console.log(image);
            return image;
        }).catch((err) => {
            console.log('Vituiks meni');
            return err;
        })
};

