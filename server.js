// Universal Express server for deployment on any platform including Vercel
const express = require('express');
const path = require('path');
const fs = require('fs');

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to serve static files
app.use(express.static('.', { 
  index: false // Don't automatically serve index.html
}));

// Set security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Serve the protected HTML file if it exists, otherwise serve the template
app.get('/', (req, res) => {
  const protectedHtmlPath = path.join(__dirname, 'index-protected.html');
  
  // Check if the protected HTML file exists
  if (fs.existsSync(protectedHtmlPath)) {
    res.sendFile(protectedHtmlPath);
  } else {
    // Fallback to template
    res.sendFile(path.join(__dirname, 'index.html'));
  }
});

// Serve the protected HTML file for other common routes if it exists
app.get('/index.html', (req, res) => {
  const protectedHtmlPath = path.join(__dirname, 'index-protected.html');
  
  if (fs.existsSync(protectedHtmlPath)) {
    res.sendFile(protectedHtmlPath);
  } else {
    // Fallback to template
    res.sendFile(path.join(__dirname, 'index.html'));
  }
});

// Handle all other routes by serving the protected HTML file
app.get('*', (req, res) => {
  const protectedHtmlPath = path.join(__dirname, 'index-protected.html');
  
  if (fs.existsSync(protectedHtmlPath)) {
    res.sendFile(protectedHtmlPath);
  } else {
    // Fallback to template
    res.sendFile(path.join(__dirname, 'index.html'));
  }
});

// Start server if not running on Vercel
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log('Run "node build.js" to generate the protected HTML file before starting the server.');
  });
}

// Export for Vercel
module.exports = app;