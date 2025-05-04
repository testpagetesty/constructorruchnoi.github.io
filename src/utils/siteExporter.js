import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { exportCookieConsentData } from './cookieConsentExporter';

export const exportSite = async (siteData) => {
  const zip = new JSZip();
  
  // Add site files
  zip.file('index.html', generateIndexHtml(siteData));
  zip.file('styles.css', generateStyles());
  zip.file('app.js', generateAppJs(siteData));
  
  // Add merci.html to root
  const merciHtml = await fetch('/merci.html').then(res => res.text());
  zip.file('merci.html', merciHtml);
  
  // Add cookie consent data
  const cookieData = exportCookieConsentData();
  if (cookieData) {
    zip.file('cookie-consent-data.json', JSON.stringify(cookieData.data, null, 2));
  }
  
  // Add other necessary files
  zip.file('privacy-policy.html', generatePrivacyPolicy(siteData));
  zip.file('cookie-policy.html', generateCookiePolicy(siteData));
  zip.file('terms-of-service.html', generateTermsOfService(siteData));
  
  // Generate and download zip
  const content = await zip.generateAsync({ type: 'blob' });
  saveAs(content, 'site.zip');
};

const generateIndexHtml = (siteData) => {
  return `
    <!DOCTYPE html>
    <html lang="${siteData.headerData?.language || 'ru'}">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${siteData.headerData?.siteName || 'My Site'}</title>
        <link rel="stylesheet" href="styles.css">
      </head>
      <body>
        <div id="root"></div>
        <script src="app.js"></script>
      </body>
    </html>
  `;
};

const generateStyles = () => {
  // Generate CSS from MUI theme
  return `
    /* Add your styles here */
  `;
};

const generateAppJs = (siteData) => {
  return `
    import React from 'react';
    import ReactDOM from 'react-dom';
    import SiteTemplate from './templates/SiteTemplate';
    
    ReactDOM.render(
      <SiteTemplate siteData=${JSON.stringify(siteData)} />,
      document.getElementById('root')
    );
  `;
};

const generatePrivacyPolicy = (siteData) => {
  return `
    <!DOCTYPE html>
    <html lang="${siteData.headerData?.language || 'ru'}">
      <head>
        <meta charset="UTF-8">
        <title>Privacy Policy</title>
      </head>
      <body>
        <!-- Add privacy policy content -->
      </body>
    </html>
  `;
};

const generateCookiePolicy = (siteData) => {
  return `
    <!DOCTYPE html>
    <html lang="${siteData.headerData?.language || 'ru'}">
      <head>
        <meta charset="UTF-8">
        <title>Cookie Policy</title>
      </head>
      <body>
        <!-- Add cookie policy content -->
      </body>
    </html>
  `;
};

const generateTermsOfService = (siteData) => {
  return `
    <!DOCTYPE html>
    <html lang="${siteData.headerData?.language || 'ru'}">
      <head>
        <meta charset="UTF-8">
        <title>Terms of Service</title>
      </head>
      <body>
        <!-- Add terms of service content -->
      </body>
    </html>
  `;
}; 