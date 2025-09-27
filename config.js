// config.js - Handle environment variables and protection
const dotenv = require('dotenv');
dotenv.config();

// Check for required environment variables
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
  console.warn('Warning: Missing required environment variables:');
  missingEnvVars.forEach(envVar => console.warn(`- ${envVar}`));
  console.warn('Please set these in your .env file for full functionality.');
}

// Export configuration
module.exports = {
  // Google Form settings
  GOOGLE_FORM_URL: process.env.GOOGLE_FORM_URL || '',
  GOOGLE_FORM_EMAIL_ENTRY: process.env.GOOGLE_FORM_EMAIL_ENTRY || '',
  
  // Resume URL
  RESUME_URL: process.env.RESUME_URL || '',
  
  // Social Media URLs
  LINKEDIN_URL: process.env.LINKEDIN_URL || '',
  GITHUB_URL: process.env.GITHUB_URL || '',
  EMAIL_ADDRESS: process.env.EMAIL_ADDRESS || '',
  
  // Profile Links
  PROFILE_MAGNET_URL: process.env.PROFILE_MAGNET_URL || '',
  AI_PORTFOLIO_URL: process.env.AI_PORTFOLIO_URL || '',
  AI_HUB_URL: process.env.AI_HUB_URL || '',
  
  // Domain restrictions
  ALLOWED_DOMAINS: process.env.ALLOWED_DOMAINS ? process.env.ALLOWED_DOMAINS.split(',') : ['localhost']
};