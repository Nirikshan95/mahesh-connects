// build.js - Build script to generate protected HTML with configuration values
const fs = require('fs');
const path = require('path');
const config = require('./config');

// Read the template HTML file
const templatePath = path.join(__dirname, 'index.html');
let htmlContent = fs.readFileSync(templatePath, 'utf8');

// Replace placeholders with actual values from configuration
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
htmlContent = htmlContent.replace(/<!-- ENV_PDF_PORTFOLIO_URL -->/g, config.PDF_PORTFOLIO_URL || '#');
htmlContent = htmlContent.replace(/<!-- ENV_COMPLETE_PORTFOLIO_URL -->/g, config.COMPLETE_PORTFOLIO_URL || '#');

// Add protection mechanisms (without domain restriction)
const protectionScript = `
<script>
// Content protection mechanisms
(function() {
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
Object.values(config).forEach(value => {
  if (placeholderIndicators.some(placeholder => value.includes(placeholder))) {
    hasPlaceholders = true;
  }
});

if (hasPlaceholders) {
  console.log('\n\x1b[33m%s\x1b[0m', 'WARNING: Generated file contains placeholder values.');
  console.log('This is fine for development but will not work in production.');
  console.log('Update the config.js file with real values before deploying.');
}