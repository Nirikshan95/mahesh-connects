// Universal static file server for deployment on any platform
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// Get port from environment variable or default to 3000
const PORT = process.env.PORT || 3000;

// Simple MIME type mapping
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.wav': 'audio/wav',
  '.mp4': 'video/mp4',
  '.woff': 'application/font-woff',
  '.ttf': 'application/font-ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.otf': 'application/font-otf',
  '.wasm': 'application/wasm'
};

// Create HTTP server
const server = http.createServer((req, res) => {
  // Parse the request URL
  const parsedUrl = url.parse(req.url);
  let pathname = `.${parsedUrl.pathname}`;
  
  // Serve root path with protected HTML file
  if (pathname === './' || pathname === './index.html') {
    pathname = './index-protected.html';
  }
  
  // Get file extension
  const ext = path.parse(pathname).ext;
  
  // Set security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Check if file exists
  fs.exists(pathname, (exist) => {
    if(!exist) {
      // File not found, serve the protected HTML file as fallback
      fs.readFile('./index-protected.html', (err, data) => {
        if (err) {
          // If protected file also doesn't exist, serve template
          fs.readFile('./index.html', (err2, data2) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html');
            res.end(data2 || '<h1>File not found</h1>');
          });
        } else {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'text/html');
          res.end(data);
        }
      });
      return;
    }

    // Read file and serve it
    fs.readFile(pathname, (err, data) => {
      if (err) {
        res.statusCode = 500;
        res.end(`Error getting the file: ${err}.`);
      } else {
        // Set content type based on file extension
        const mimeType = mimeTypes[ext] || 'text/plain';
        res.setHeader('Content-Type', mimeType);
        res.statusCode = 200;
        res.end(data);
      }
    });
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
  console.log('Run "node build.js" to generate the protected HTML file before starting the server.');
});