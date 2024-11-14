const fs = require('fs');
const path = require('path');

function base64_decode_audio(base64Str, filename) {
  const ext = "mp3";
  
  const pathname = path.resolve(__dirname, '../files', `${filename}.${ext}`);

  fs.writeFileSync(pathname, base64Str, { encoding: 'base64' });
}

module.exports = base64_decode_audio