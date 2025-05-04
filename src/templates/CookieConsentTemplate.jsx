import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Link
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

const translations = {
  en: {
    title: 'Cookie Consent',
    message: 'We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.',
    accept: 'Accept All',
    reject: 'Reject All',
    settings: 'Cookie Settings',
    learnMore: 'Learn more about cookies'
  },
  ru: {
    title: 'Согласие на использование cookie',
    message: 'Мы используем файлы cookie для улучшения вашего опыта. Продолжая посещать этот сайт, вы соглашаетесь с использованием файлов cookie.',
    accept: 'Принять все',
    reject: 'Отклонить все',
    settings: 'Настройки cookie',
    learnMore: 'Узнать больше о cookie'
  }
};

const CookieConsentTemplate = ({ language = 'ru' }) => {
  const [open, setOpen] = useState(false);
  const [consent, setConsent] = useState(null);
  const theme = useTheme();
  const t = translations[language] || translations.ru;

  useEffect(() => {
    const savedConsent = localStorage.getItem('cookieConsent');
    if (!savedConsent) {
      setOpen(true);
    } else {
      setConsent(JSON.parse(savedConsent));
    }
  }, []);

  const handleAccept = () => {
    const consentData = {
      timestamp: new Date().toISOString(),
      consent: true,
      preferences: {
        necessary: true,
        preferences: true,
        statistics: true,
        marketing: true
      }
    };
    localStorage.setItem('cookieConsent', JSON.stringify(consentData));
    setConsent(consentData);
    setOpen(false);
  };

  const handleReject = () => {
    const consentData = {
      timestamp: new Date().toISOString(),
      consent: false,
      preferences: {
        necessary: true,
        preferences: false,
        statistics: false,
        marketing: false
      }
    };
    localStorage.setItem('cookieConsent', JSON.stringify(consentData));
    setConsent(consentData);
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onClose={() => {}}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          position: 'fixed',
          bottom: 20,
          right: 20,
          m: 0,
          borderRadius: 2,
          boxShadow: theme.shadows[8]
        }
      }}
    >
      <DialogTitle>{t.title}</DialogTitle>
      <DialogContent>
        <Typography variant="body1" paragraph>
          {t.message}
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Link href="/cookie-policy" color="primary">
            {t.learnMore}
          </Link>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleReject} color="inherit">
          {t.reject}
        </Button>
        <Button onClick={handleAccept} variant="contained" color="primary">
          {t.accept}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CookieConsentTemplate; 