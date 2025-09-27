// server.js - Simple server to serve the protected HTML file
const express = require('express');
const path = require('path');
const fs = require('fs');
const config = require('./config');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to check domain restrictions
app.use((req, res, next) => {
  // Check if request is from localhost for development access
  const isLocalhost = req.hostname === 'localhost' || req.hostname === '127.0.0.1' || req.ip === '::1' || req.ip === '127.0.0.1';
  
  // If not localhost, check domain restrictions
  if (!isLocalhost) {
    const allowedDomains = config.ALLOWED_DOMAINS || [];
    
    // If allowed domains are specified, check them
    if (allowedDomains.length > 0) {
      const isAllowedDomain = allowedDomains.some(domain => 
        req.hostname.includes(domain) || 
        req.hostname === domain
      );
      
      if (!isAllowedDomain) {
        return res.status(403).send(`
          <h1>Access Denied</h1>
          <p>This content is not available on this domain.</p>
          <p>Requesting domain: ${req.hostname}</p>
          <p>If you are the site owner, add this domain to your ALLOWED_DOMAINS configuration.</p>
        `);
      }
    }
  }
  
  next();
});

// Serve static files (CSS, JS, images, etc.) from the current directory
app.use(express.static('.', { 
  index: false // Don't automatically serve index.html
}));

// Serve the protected HTML file if it exists, otherwise serve the template
app.get('/', (req, res) => {
  const protectedHtmlPath = path.join(__dirname, 'index-protected.html');
  const isLocalhost = req.hostname === 'localhost' || req.hostname === '127.0.0.1' || req.ip === '::1' || req.ip === '127.0.0.1';
  
  // Check if the protected HTML file exists
  if (fs.existsSync(protectedHtmlPath)) {
    res.sendFile(protectedHtmlPath);
  } else {
    // For localhost development, serve a development version
    if (isLocalhost) {
      res.sendFile(path.join(__dirname, 'index.html'));
    } else {
      // For production, show build required message
      res.status(200).send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Build Required</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; background: #f0f0f0; }
            .container { max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
            code { background: #eee; padding: 2px 5px; border-radius: 3px; }
            .steps { background: #e8f4fd; padding: 20px; border-radius: 5px; }
            .steps ol { margin: 10px 0; }
            .steps li { margin: 10px 0; }
            .warning { background: #fff8e6; padding: 15px; border-left: 4px solid #ff9800; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Build Required</h1>
            <p>The protected HTML file has not been generated yet. This is required for the links to work properly in production.</p>
            
            <div class="warning">
              <h3>Development Note</h3>
              <p>For localhost development, you can view the page but links will not work until you run the build process.</p>
            </div>
            
            <div class="steps">
              <h2>How to fix this:</h2>
              <ol>
                <li>Run the build process: <code>node build.js</code></li>
                <li>Restart the server: <code>node server.js</code></li>
              </ol>
            </div>
            
            <p><strong>Note:</strong> The build process replaces placeholder comments like <code>&lt;!-- ENV_LINKEDIN_URL --&gt;</code> with actual URLs from your configuration.</p>
          </div>
        </body>
        </html>
      `);
    }
  }
});

// Serve the protected HTML file for other common routes if it exists
app.get('/index.html', (req, res) => {
  const protectedHtmlPath = path.join(__dirname, 'index-protected.html');
  const isLocalhost = req.hostname === 'localhost' || req.hostname === '127.0.0.1' || req.ip === '::1' || req.ip === '127.0.0.1';
  
  if (fs.existsSync(protectedHtmlPath)) {
    res.sendFile(protectedHtmlPath);
  } else {
    // For localhost, serve the template
    if (isLocalhost) {
      res.sendFile(path.join(__dirname, 'index.html'));
    } else {
      // Redirect to root which will show the build required message
      res.redirect('/');
    }
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  
  // Always show this helpful information on startup
  console.log('\n--- DEVELOPMENT INSTRUCTIONS ---');
  console.log('1. For fully working links, run: node build.js');
  console.log('2. For development/testing with template, links will show as placeholders');
  console.log('--- END INSTRUCTIONS ---\n');
});