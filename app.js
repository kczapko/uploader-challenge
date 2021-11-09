const express = require('express');
const multer = require('multer');

/* multer config */
const storage = multer.diskStorage({
  destination: './public/images/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/webp'
  )
    return cb(null, true);
  cb(null, false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

/* app */
const app = express();

// app.use((req, res, next) => {
//   res.set('Access-Control-Allow-Origin', '*');
//   if (req.method === 'OPTIONS') return res.sendStatus(200);
//   next();
// });

app.use(express.static('public'));
app.use(upload.single('image'));
app.use((req, res, next) => {
  if (!req.file) return next('No file provided or wrong file type');

  res.status(201).json({
    status: 'success',
    filepath: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
  });
});
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).json({
    status: 'error',
    message: err.message || 'Internal server error',
  });
});

app.listen(3000);
