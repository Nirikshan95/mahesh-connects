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
// Strict domain-based access control
(function() {
  // Get current domain
  var currentDomain = window.location.hostname;
  
  // Get allowed domains from environment variables
  var allowedDomains = [${JSON.stringify(config.ALLOWED_DOMAINS)}];
  
  // Function to check if domain is allowed
  function isDomainAllowed() {
    // If no allowed domains specified, deny access
    if (!allowedDomains || allowedDomains.length === 0) {
      return false;
    }
    
    // Check each allowed domain
    for (var i = 0; i < allowedDomains.length; i++) {
      var domain = allowedDomains[i].trim();
      
      // Exact match
      if (currentDomain === domain) {
        return true;
      }
      
      // Subdomain match (e.g., www.yourdomain.com matches yourdomain.com)
      if (domain !== 'localhost' && currentDomain.endsWith('.' + domain)) {
        return true;
      }
    }
    
    return false;
  }
  
  // Enforce domain restriction
  if (!isDomainAllowed()) {
    // Show access denied page
    document.body.innerHTML = '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; border: 1px solid #ccc; border-radius: 5px; text-align: center;"><h1 style="color: #d32f2f;">Access Denied</h1><p>This content is not available on this domain.</p><p><strong>Current domain:</strong> ' + currentDomain + '</p><p><strong>Allowed domains:</strong> ' + allowedDomains.join(', ') + '</p><p>If you are the site owner, add this domain to your ALLOWED_DOMAINS environment variable.</p></div>';
    return;
  }
  
  // Additional protection: Check if environment variables were properly injected
  var checkEnvVars = [
    '${config.RESUME_URL || ''}',
    '${config.GOOGLE_FORM_URL || ''}',
    '${config.LINKEDIN_URL || ''}',
    '${config.GITHUB_URL || ''}'
  ];
  
  var hasDefaultPlaceholders = false;
  for (var j = 0; j < checkEnvVars.length; j++) {
    var value = checkEnvVars[j];
    if (value.indexOf('<!-- ENV_') !== -1 || 
        value.indexOf('your-') !== -1 || 
        value.indexOf('FORM_ID') !== -1 || 
        value.indexOf('RESUME_ID') !== -1 ||
        value === 'undefined' ||
        value === '') {
      hasDefaultPlaceholders = true;
      break;
    }
  }
  
  if (hasDefaultPlaceholders) {
    document.body.innerHTML = '<h1>Configuration Error</h1><p>This site is not properly configured. Please contact the administrator.</p>';
    return;
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