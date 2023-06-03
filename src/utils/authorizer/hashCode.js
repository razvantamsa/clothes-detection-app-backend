const crypto = require('crypto');

function generateUniqueHashCode() {
  const timestamp = Date.now().toString();
  const randomString = Math.random().toString(36).substring(2);
  const data = timestamp + randomString;
  
  const hash = crypto.createHash('sha256');
  hash.update(data);
  return hash.digest('hex');
}

module.exports = { generateUniqueHashCode }