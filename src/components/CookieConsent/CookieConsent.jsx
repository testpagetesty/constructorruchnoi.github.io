import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Link,
  Paper
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

const translations = {
  en: {
    title: 'Cookie Consent',
    message: 'We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.',
    accept: 'Accept All',
    reject: 'Reject All',
    settings: 'Cookie Settings',
    learnMore: 'Learn more about cookies',
    necessary: 'Necessary',
    preferences: 'Preferences',
    statistics: 'Statistics',
    marketing: 'Marketing'
  },
  ru: {
    title: 'Согласие на использование cookie',
    message: 'Мы используем файлы cookie для улучшения вашего опыта. Продолжая посещать этот сайт, вы соглашаетесь с использованием файлов cookie.',
    accept: 'Принять все',
    reject: 'Отклонить все',
    settings: 'Настройки cookie',
    learnMore: 'Узнать больше о cookie',
    necessary: 'Необходимые',
    preferences: 'Предпочтения',
    statistics: 'Статистика',
    marketing: 'Маркетинг'
  },
  de: {
    title: 'Cookie-Zustimmung',
    message: 'Wir verwenden Cookies, um Ihr Erlebnis zu verbessern. Durch den weiteren Besuch dieser Website stimmen Sie der Verwendung von Cookies zu.',
    accept: 'Alle akzeptieren',
    reject: 'Alle ablehnen',
    settings: 'Cookie-Einstellungen',
    learnMore: 'Mehr über Cookies erfahren',
    necessary: 'Notwendig',
    preferences: 'Präferenzen',
    statistics: 'Statistiken',
    marketing: 'Marketing'
  },
  fr: {
    title: 'Consentement aux cookies',
    message: 'Nous utilisons des cookies pour améliorer votre expérience. En continuant à visiter ce site, vous acceptez notre utilisation des cookies.',
    accept: 'Tout accepter',
    reject: 'Tout refuser',
    settings: 'Paramètres des cookies',
    learnMore: 'En savoir plus sur les cookies',
    necessary: 'Nécessaire',
    preferences: 'Préférences',
    statistics: 'Statistiques',
    marketing: 'Marketing'
  },
  es: {
    title: 'Consentimiento de cookies',
    message: 'Utilizamos cookies para mejorar su experiencia. Al continuar visitando este sitio, usted acepta nuestro uso de cookies.',
    accept: 'Aceptar todo',
    reject: 'Rechazar todo',
    settings: 'Configuración de cookies',
    learnMore: 'Más información sobre cookies',
    necessary: 'Necesario',
    preferences: 'Preferencias',
    statistics: 'Estadísticas',
    marketing: 'Marketing'
  }
};

const CookieConsent = ({ language = 'en' }) => {
  console.log('CookieConsent component rendering');
  
  const [open, setOpen] = useState(false);
  const [consent, setConsent] = useState(null);
  const theme = useTheme();
  const t = translations[language] || translations.en;

  useEffect(() => {
    console.log('CookieConsent useEffect running');
    const savedConsent = localStorage.getItem('cookieConsent');
    console.log('Saved consent:', savedConsent);
    
    if (!savedConsent) {
      console.log('No consent found, showing dialog');
      setOpen(true);
    } else {
      console.log('Consent found:', JSON.parse(savedConsent));
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

export default CookieConsent; 