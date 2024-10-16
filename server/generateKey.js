const crypto = require('crypto');
const key = crypto.randomBytes(128).toString('base64');
console.log(key);