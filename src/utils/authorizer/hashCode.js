const crypto = require('crypto');

function calculateImageHash(fileData) {
  const hash = crypto.createHash('sha256');
  hash.update(fileData);
  return hash.digest('hex');
}

module.exports = { calculateImageHash }