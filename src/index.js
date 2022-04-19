const express = require('express');
const multer = require('multer');
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // check file mime type
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            cb(null, './resourses/images');
        }
        // if file is video
        else if (file.mimetype === 'video/mp4') {
            cb(null, './resourses/videos');
        }
        // if file is audio
        else if (file.mimetype === 'audio/mp3') {
            cb(null, './resourses/audios');
        }
        else {
            cb(new Error('Invalid file type'), null);
        }


    },

    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})




const upload = multer({
    storage: storage,
    limits: {
        fileSize: 6000000
    },
    fileFilter(req, file, cb) {
        // check the file type 
        if (!file.originalname.match(/\.(jpg|jpeg|png|mp3|mp4)$/)) {
            // throw error
            return cb(new Error('Please upload an image'))

        }
        cb(undefined, true);
    }
});
const app = express();
const port = 4040;

app.post('/uploadImageFile', upload.single('imageFileName'), (req, res) => {

    res.send({
        success: true,
        file: req.file
    });
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message });
});

app.post('/uploadImageFiles', upload.array('photos'), (req, res) => {

    res.send(
        req.files.map(file => {
            return {
                success: true,
                file: file
            }
        })

    );
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message });
});

app.listen(port, () => {
    console.log(`server is running on port ${port}`);
})