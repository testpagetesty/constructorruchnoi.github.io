import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  FormControlLabel,
  Checkbox,
  Link,
  Paper,
  IconButton,
  Divider
} from '@mui/material';
import {
  Cookie as CookieIcon,
  Close as CloseIcon,
  Settings as SettingsIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';

const CookieConsent = ({ 
  isOpen = false, 
  onAccept, 
  onReject, 
  onClose,
  onSettingsChange,
  language = 'en'
}) => {
  const [showSettings, setShowSettings] = useState(false);
  const [cookiePreferences, setCookiePreferences] = useState({
    necessary: true, // Always required
    analytics: false,
    marketing: false,
    preferences: false
  });

  // Check if already consented
  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (consent === 'accepted' && isOpen) {
      onClose && onClose();
    }
  }, [isOpen, onClose]);

  const handleAcceptAll = () => {
    const allPreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true
    };
    
    localStorage.setItem('cookieConsent', 'accepted');
    localStorage.setItem('cookiePreferences', JSON.stringify(allPreferences));
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    
    onAccept && onAccept(allPreferences);
    onClose && onClose();
  };

  const handleRejectAll = () => {
    const minimalPreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false
    };
    
    localStorage.setItem('cookieConsent', 'rejected');
    localStorage.setItem('cookiePreferences', JSON.stringify(minimalPreferences));
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    
    onReject && onReject(minimalPreferences);
    onClose && onClose();
  };

  const handleSavePreferences = () => {
    localStorage.setItem('cookieConsent', 'customized');
    localStorage.setItem('cookiePreferences', JSON.stringify(cookiePreferences));
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    
    onSettingsChange && onSettingsChange(cookiePreferences);
    onClose && onClose();
  };

  const handlePreferenceChange = (type) => (event) => {
    if (type === 'necessary') return; // Can't disable necessary cookies
    
    setCookiePreferences(prev => ({
      ...prev,
      [type]: event.target.checked
    }));
  };

  const getTexts = () => {
    const texts = {
      en: {
        title: "Cookie Preferences",
        description: "We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. By clicking 'Accept All', you consent to our use of cookies.",
        acceptAll: "Accept All",
        rejectAll: "Reject All",
        customize: "Customize",
        savePreferences: "Save Preferences",
        necessary: "Necessary Cookies",
        necessaryDesc: "These cookies are essential for the website to function properly. They cannot be disabled.",
        analytics: "Analytics Cookies",
        analyticsDesc: "These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.",
        marketing: "Marketing Cookies",
        marketingDesc: "These cookies are used to track visitors across websites to display relevant and engaging advertisements.",
        preferences: "Preference Cookies",
        preferencesDesc: "These cookies remember your choices and preferences to provide a more personalized experience.",
        privacyPolicy: "Privacy Policy",
        cookiePolicy: "Cookie Policy"
      },
      ru: {
        title: "Настройки файлов cookie",
        description: "Мы используем файлы cookie для улучшения вашего опыта просмотра, предоставления персонализированного контента и анализа нашего трафика. Нажимая 'Принять все', вы соглашаетесь с использованием файлов cookie.",
        acceptAll: "Принять все",
        rejectAll: "Отклонить все",
        customize: "Настроить",
        savePreferences: "Сохранить настройки",
        necessary: "Необходимые файлы cookie",
        necessaryDesc: "Эти файлы cookie необходимы для правильной работы веб-сайта. Их нельзя отключить.",
        analytics: "Аналитические файлы cookie",
        analyticsDesc: "Эти файлы cookie помогают нам понять, как посетители взаимодействуют с нашим веб-сайтом, собирая и сообщая информацию анонимно.",
        marketing: "Маркетинговые файлы cookie",
        marketingDesc: "Эти файлы cookie используются для отслеживания посетителей на веб-сайтах для отображения релевантной и привлекательной рекламы.",
        preferences: "Файлы cookie предпочтений",
        preferencesDesc: "Эти файлы cookie запоминают ваш выбор и предпочтения для обеспечения более персонализированного опыта.",
        privacyPolicy: "Политика конфиденциальности",
        cookiePolicy: "Политика файлов cookie"
      }
    };
    
    return texts[language] || texts.en;
  };

  const texts = getTexts();

  return (
    <Dialog
      open={isOpen}
      onClose={() => {}} // Prevent closing by clicking outside
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          position: 'fixed',
          bottom: 20,
          left: 20,
          right: 20,
          top: 'auto',
          margin: 0,
          maxHeight: '80vh',
          overflow: 'hidden',
          borderRadius: 3,
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
          border: '1px solid rgba(255,255,255,0.2)'
        }
      }}
      BackdropProps={{
        sx: {
          backgroundColor: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(5px)'
        }
      }}
    >
      <Box sx={{ 
        background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
        borderRadius: 3,
        overflow: 'hidden'
      }}>
        <DialogTitle sx={{ 
          background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          py: 2,
          px: 3
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CookieIcon />
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {texts.title}
            </Typography>
          </Box>
          <IconButton 
            onClick={onClose}
            sx={{ color: 'white' }}
            size="small"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 3, maxHeight: '60vh', overflow: 'auto' }}>
          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.6 }}>
            {texts.description}
          </Typography>

          {showSettings ? (
            <Box>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Cookie Categories
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={cookiePreferences.necessary}
                      disabled
                      color="primary"
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        {texts.necessary}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {texts.necessaryDesc}
                      </Typography>
                    </Box>
                  }
                />
              </Box>

              <Box sx={{ mb: 2 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={cookiePreferences.analytics}
                      onChange={handlePreferenceChange('analytics')}
                      color="primary"
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        {texts.analytics}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {texts.analyticsDesc}
                      </Typography>
                    </Box>
                  }
                />
              </Box>

              <Box sx={{ mb: 2 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={cookiePreferences.marketing}
                      onChange={handlePreferenceChange('marketing')}
                      color="primary"
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        {texts.marketing}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {texts.marketingDesc}
                      </Typography>
                    </Box>
                  }
                />
              </Box>

              <Box sx={{ mb: 3 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={cookiePreferences.preferences}
                      onChange={handlePreferenceChange('preferences')}
                      color="primary"
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        {texts.preferences}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {texts.preferencesDesc}
                      </Typography>
                    </Box>
                  }
                />
              </Box>

              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <Link href="/privacy-policy" target="_blank" sx={{ fontSize: '0.875rem' }}>
                  {texts.privacyPolicy}
                </Link>
                <Typography sx={{ fontSize: '0.875rem' }}>•</Typography>
                <Link href="/cookie-policy" target="_blank" sx={{ fontSize: '0.875rem' }}>
                  {texts.cookiePolicy}
                </Link>
              </Box>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <Link href="/privacy-policy" target="_blank" sx={{ fontSize: '0.875rem' }}>
                {texts.privacyPolicy}
              </Link>
              <Typography sx={{ fontSize: '0.875rem' }}>•</Typography>
              <Link href="/cookie-policy" target="_blank" sx={{ fontSize: '0.875rem' }}>
                {texts.cookiePolicy}
              </Link>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ 
          p: 3, 
          background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
          borderTop: '1px solid rgba(0,0,0,0.1)'
        }}>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', width: '100%' }}>
            <Button
              onClick={handleRejectAll}
              variant="outlined"
              sx={{ 
                borderColor: '#6c757d',
                color: '#6c757d',
                '&:hover': {
                  borderColor: '#5a6268',
                  backgroundColor: 'rgba(108, 117, 125, 0.04)'
                }
              }}
            >
              {texts.rejectAll}
            </Button>
            
            <Button
              onClick={() => setShowSettings(!showSettings)}
              variant="outlined"
              startIcon={<SettingsIcon />}
              sx={{ 
                borderColor: '#1976d2',
                color: '#1976d2',
                '&:hover': {
                  borderColor: '#1565c0',
                  backgroundColor: 'rgba(25, 118, 210, 0.04)'
                }
              }}
            >
              {texts.customize}
            </Button>
            
            {showSettings ? (
              <Button
                onClick={handleSavePreferences}
                variant="contained"
                startIcon={<CheckCircleIcon />}
                sx={{
                  background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #218838 0%, #1ea085 100%)'
                  }
                }}
              >
                {texts.savePreferences}
              </Button>
            ) : (
              <Button
                onClick={handleAcceptAll}
                variant="contained"
                startIcon={<CheckCircleIcon />}
                sx={{
                  background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)'
                  }
                }}
              >
                {texts.acceptAll}
              </Button>
            )}
          </Box>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default CookieConsent;