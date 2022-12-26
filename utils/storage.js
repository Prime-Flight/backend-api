const multer = require('multer');
const path = require('path');

const imageStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, './public/images')
  },
  filename: (req, file, callback) => {
    const filename = Date.now() + path.extname(file.originalname);
    callback(null, namaFile);
  }
});

module.exports = { 
  image: multer({
    storage: imageStorage,
    fileFilter: (req, file, callback) => {
      if (file.mimetype == 'image/png' || file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg') {
        callback(null, true);
      } else {
        const err = new Error('Please use png, jpg, and jpeg to upload the file');
        callback(err, false);
      }
    },
    onError: (err, next) => {
      next(err);
    }
  })
};
