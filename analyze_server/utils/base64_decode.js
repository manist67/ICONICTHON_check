const fs = require('fs');
const path = require('path');

function base64_decode(base64Str, filename) {
  const ext = base64Str.substring("data:image/".length, base64Str.indexOf(";base64"));
  const base64Image = base64Str.split(';base64,').pop();
  
  const pathname = path.resolve(__dirname, '../files', `${filename}.${ext}`);

  fs.writeFileSync(pathname, base64Image, { encoding: 'base64' });

  return pathname;
}

module.exports = base64_decode