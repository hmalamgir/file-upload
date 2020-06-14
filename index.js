const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const Image = require('./models/Image');

const app = express();
//DATABASE
mongoose.connect(
  'mongodb://127.0.0.1:27017/photo-upload',
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
  },
  () => console.log(`DB CONNECT....`)
);

const upload = multer({
  limits: {
    fileSize: 1000000
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|png)$/)) {
      return cb(new Error('Please upload a word document'));
    }

    cb(null, true);
  }
});

app.get('/', (req, res) => res.send('Hello World!'));

//Get Image
app.get('/image/:id', async (req, res) => {
  try {
    const data = await Image.findById(req.params.id);

    if (!data) {
      return res.status(404).send('No image');
    }
    res.set('Content-Type', 'image/jpg');
    res.send(data.avatar);
  } catch (error) {
    res.status(404).send('ERROR');
  }
});

// Post Image
app.post(
  '/upload',
  upload.single('avatar'),
  async (req, res) => {
    const image = new Image({ avatar: req.file.buffer });

    await image.save();

    res.json({ msg: 'File upload' });
  },
  (error, req, res, next) => {
    res.status(400).json({ error: error.message });
  }
);

// PORT
const port = 5000;
app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
