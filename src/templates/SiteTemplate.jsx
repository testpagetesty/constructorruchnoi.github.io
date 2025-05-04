import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { theme } from '../theme';
import Home from '../pages/index';
import PrivacyPolicy from '../pages/privacy-policy';
import CookiePolicy from '../pages/cookie-policy';
import TermsOfService from '../pages/terms-of-service';
import CookieConsentTemplate from './CookieConsentTemplate';

const SiteTemplate = ({ siteData }) => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div>
          <Routes>
            <Route path="/" element={<Home data={siteData} />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/cookie-policy" element={<CookiePolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
          </Routes>
          <CookieConsentTemplate language={siteData.language || 'ru'} />
        </div>
      </Router>
    </ThemeProvider>
  );
};

export default SiteTemplate; 