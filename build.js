// build.js - Build script to generate protected HTML with environment variables
const fs = require('fs');
const path = require('path');
const config = require('./config');

// Check if required environment variables are set
const requiredEnvVars = [
  'GOOGLE_FORM_URL',
  'GOOGLE_FORM_EMAIL_ENTRY',
  'RESUME_URL',
  'LINKEDIN_URL',
  'GITHUB_URL',
  'EMAIL_ADDRESS',
  'PROFILE_MAGNET_URL',
  'AI_PORTFOLIO_URL',
  'AI_HUB_URL'
];

const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.warn('Warning: Missing or placeholder environment variables detected:');
  missingEnvVars.forEach(envVar => console.warn(`- ${envVar}`));
  
  // Check if we're using placeholder values
  const placeholderIndicators = [
    'YOUR_FORM_ID',
    'YOUR_EMAIL_FIELD_ID',
    'YOUR_RESUME_ID',
    'your-',
    'FORM_ID',
    'RESUME_ID'
  ];
  
  let hasPlaceholders = false;
  requiredEnvVars.forEach(envVar => {
    const value = process.env[envVar] || '';
    if (placeholderIndicators.some(placeholder => value.includes(placeholder))) {
      console.warn(`- ${envVar} contains placeholder value: ${value}`);
      hasPlaceholders = true;
    }
  });
  
  if (hasPlaceholders) {
    console.log('\n\x1b[33m%s\x1b[0m', 'WARNING: Some environment variables contain placeholder values.');
    console.log('This will work for development but not for production.');
    console.log('Please update your .env file with real values for production deployment.\n');
  } else {
    console.log('\n\x1b[31m%s\x1b[0m', 'ERROR: Missing required environment variables.');
    console.log('Please set these variables in your .env file before building for production.');
    console.log('For development, you can continue but links will not work properly.\n');
    // Don't exit for development
  }
}

// Read the template HTML file
const templatePath = path.join(__dirname, 'index.html');
let htmlContent = fs.readFileSync(templatePath, 'utf8');

// Replace placeholders with actual values from environment variables
// Using global regex to replace all occurrences
htmlContent = htmlContent.replace(/<!-- ENV_RESUME_URL -->/g, config.RESUME_URL || '#');
htmlContent = htmlContent.replace(/<!-- ENV_GOOGLE_FORM_URL -->/g, config.GOOGLE_FORM_URL || '#');
htmlContent = htmlContent.replace(/<!-- ENV_GOOGLE_FORM_EMAIL_ENTRY -->/g, config.GOOGLE_FORM_EMAIL_ENTRY || '#');
htmlContent = htmlContent.replace(/<!-- ENV_LINKEDIN_URL -->/g, config.LINKEDIN_URL || '#');
htmlContent = htmlContent.replace(/<!-- ENV_GITHUB_URL -->/g, config.GITHUB_URL || '#');
htmlContent = htmlContent.replace(/<!-- ENV_EMAIL_ADDRESS -->/g, config.EMAIL_ADDRESS || '#');
htmlContent = htmlContent.replace(/<!-- ENV_PROFILE_MAGNET_URL -->/g, config.PROFILE_MAGNET_URL || '#');
htmlContent = htmlContent.replace(/<!-- ENV_AI_PORTFOLIO_URL -->/g, config.AI_PORTFOLIO_URL || '#');
htmlContent = htmlContent.replace(/<!-- ENV_AI_HUB_URL -->/g, config.AI_HUB_URL || '#');

// Add protection mechanisms
const protectionScript = `
<script>
// Environment-based protection
(function() {
  // Allow localhost for development
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  
  // Skip protection on localhost for development
  if (isLocalhost) {
    console.log('Development mode: Protection disabled on localhost');
    return;
  }
  
  // Check if we're on the correct domain
  const allowedDomains = [${config.ALLOWED_DOMAINS.map(domain => `"${domain}"`).join(',')}];
  const currentDomain = window.location.hostname;
  
  // Log domain checking for debugging
  console.log('Current domain:', currentDomain);
  console.log('Allowed domains:', allowedDomains);
  
  // If allowed domains are specified, check them
  if (allowedDomains.length > 0 && !allowedDomains.some(domain => currentDomain.includes(domain.trim()) || currentDomain === domain.trim())) {
    // Redirect to a blank page or show an error
    console.log('Access denied - domain not in allowed list');
    document.body.innerHTML = '<h1>Access Denied</h1><p>This content is not available on this domain.</p><p>Current domain: ' + currentDomain + '</p>';
    return;
  }
  
  // Additional protection: Check if environment variables were properly injected
  const checkEnvVars = [
    '${config.RESUME_URL || ''}',
    '${config.GOOGLE_FORM_URL || ''}',
    '${config.LINKEDIN_URL || ''}',
    '${config.GITHUB_URL || ''}'
  ];
  
  // Skip validation on localhost
  if (!isLocalhost) {
    const hasDefaultPlaceholders = checkEnvVars.some(value => 
      value.includes('<!-- ENV_') || 
      value.includes('your-') || 
      value.includes('FORM_ID') || 
      value.includes('RESUME_ID') ||
      value === 'undefined' ||
      value === ''
    );
    
    if (hasDefaultPlaceholders) {
      document.body.innerHTML = '<h1>Configuration Error</h1><p>This site is not properly configured. Please contact the administrator.</p>';
      return;
    }
  }
  
  // Disable right-click
  document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    return false;
  });
  
  // Disable text selection
  document.addEventListener('selectstart', function(e) {
    e.preventDefault();
    return false;
  });
  
  // Disable F12 and other dev tools keys
  document.addEventListener('keydown', function(e) {
    if (e.key === 'F12' || 
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) || 
        (e.ctrlKey && e.key === 'U')) {
      e.preventDefault();
      return false;
    }
  });
})();
</script>
`;

// Insert protection script before closing body tag
htmlContent = htmlContent.replace('</body>', protectionScript + '\n</body>');

// Write the protected HTML to a new file
const outputPath = path.join(__dirname, 'index-protected.html');
fs.writeFileSync(outputPath, htmlContent);

console.log('Protected HTML file generated successfully at:', outputPath);

// Check if we're using placeholder values and warn
const placeholderIndicators = [
  'YOUR_FORM_ID',
  'YOUR_EMAIL_FIELD_ID',
  'YOUR_RESUME_ID',
  'your-',
  'FORM_ID',
  'RESUME_ID'
];

let hasPlaceholders = false;
requiredEnvVars.forEach(envVar => {
  const value = process.env[envVar] || '';
  if (placeholderIndicators.some(placeholder => value.includes(placeholder))) {
    hasPlaceholders = true;
  }
});

if (hasPlaceholders) {
  console.log('\n\x1b[33m%s\x1b[0m', 'WARNING: Generated file contains placeholder values.');
  console.log('This is fine for development but will not work in production.');
  console.log('Update your .env file with real values before deploying.');
}