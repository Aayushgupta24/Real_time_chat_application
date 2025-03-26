const crypto = require('crypto');

// Generate a 64-byte (512-bit) random string
const secret = crypto.randomBytes(64).toString('hex');
console.log('Generated JWT_SECRET:');
console.log(secret);