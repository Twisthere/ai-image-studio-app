const multer = require("multer");
const storage = multer.memoryStorage(); // Store in memory before processing
const upload = multer({ storage });

module.exports = upload;
