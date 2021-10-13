const http = require('http');
const url = require('url');
const fs = require('fs');
const PORT = 8080;

http
	.createServer((req, res) => {
		let addr = req.url;
		let q = url.parse(addr, true);
		let filePath = '';
    
		fs.appendFile('log.txt', `URL: ${addr}, \n Timestamp: ${new Date()} \n\n`, 
    err => {
      err ? console.log(err) : console.log('Added to log.');
		});
    
    addr.includes('documentation')
      ? (filePath = `documentation.html`)
      : (filePath = `index.html`);

      fs.readFile(filePath, (err, data) => {
        if(err) throw err;

        res.writeHead(200, {'Content-Type': 'text/html'})
        res.write(data)
        res.end()
      })
	})
	.listen(PORT);

console.log(`My first Node test server is running on Port ${PORT}`);
