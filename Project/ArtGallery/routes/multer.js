const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

const path = require("path");


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', 'public', 'images', 'uploads'));
 // Destination folder for uploads
  },
  filename: function (req, file, cb) {
    const uniquename = uuidv4(); // Generate a unique filename
    cb(null, uniquename+path.extname(file.originalname)); // Use the unique filename
  }
});

const upload = multer({ storage: storage });

module.exports = upload;

