const fs = require('fs');
const path = require('path');

function base64_decode_audio(base64Str, filename) {
  const ext = "wav";
  const base64Audio = base64Str.split(';base64,').pop();
  
  const pathname = path.resolve(__dirname, '../files', `${filename}.${ext}`);

  fs.writeFileSync(pathname, base64Audio, { encoding: 'base64' });

  return pathname
}

module.exports = base64_decode_audio