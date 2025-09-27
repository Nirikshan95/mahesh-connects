// config.prod.js - Production configuration
// Copy this file to config.js when deploying to production

module.exports = {
  // Google Form settings for production
  GOOGLE_FORM_URL: process.env.GOOGLE_FORM_URL || 'https://docs.google.com/forms/u/0/d/e/PROD_FORM_ID/formResponse',
  GOOGLE_FORM_EMAIL_ENTRY: process.env.GOOGLE_FORM_EMAIL_ENTRY || 'entry.PROD_EMAIL_FIELD_ID',
  
  // Resume URL for production
  RESUME_URL: process.env.RESUME_URL || 'https://drive.google.com/file/d/PROD_RESUME_ID/view?usp=sharing',
  
  // Social Media URLs for production
  LINKEDIN_URL: process.env.LINKEDIN_URL || 'https://www.linkedin.com/in/your-production-profile/',
  GITHUB_URL: process.env.GITHUB_URL || 'https://github.com/your-production-username',
  EMAIL_ADDRESS: process.env.EMAIL_ADDRESS || 'your-production-email@example.com',
  
  // Profile Links for production
  PROFILE_MAGNET_URL: process.env.PROFILE_MAGNET_URL || 'https://your-production-profile-magnet-url.com/',
  AI_PORTFOLIO_URL: process.env.AI_PORTFOLIO_URL || 'https://your-production-ai-portfolio-url.com/',
  AI_HUB_URL: process.env.AI_HUB_URL || 'https://your-production-ai-hub-url.com/',
  
  // Domain restrictions for production (comma-separated)
  ALLOWED_DOMAINS: process.env.ALLOWED_DOMAINS ? process.env.ALLOWED_DOMAINS.split(',') : ['yourproductiondomain.com']
};