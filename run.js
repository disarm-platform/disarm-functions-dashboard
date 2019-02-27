const fs = require('fs');
const secrets = JSON.parse(fs.readFileSync('./secrets.json', 'utf8'));

const fn = require('./functions-dashboard');

fn({
  secrets
}, null, {
  writeHead(headers) {
    console.log('headers:', headers)
  },
  end(content) {
    console.log('content', content)
  }
})