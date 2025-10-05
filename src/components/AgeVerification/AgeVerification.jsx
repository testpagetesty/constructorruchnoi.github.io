import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Paper,
  Alert,
  IconButton,
  Backdrop,
  CircularProgress
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Warning as WarningIcon,
  Close as CloseIcon
} from '@mui/icons-material';

const AgeVerification = ({ 
  isOpen = false, 
  onConfirm, 
  onReject, 
  onClose,
  title = "Подтверждение возраста",
  content = "Этот сайт содержит контент, предназначенный только для лиц старше 18 лет. Пожалуйста, подтвердите свой возраст для продолжения.",
  confirmText = "Мне есть 18 лет",
  rejectText = "Мне нет 18 лет",
  underageMessage = "Доступ к сайту разрешен только лицам старше 18 лет. Если вам нет 18 лет, пожалуйста, покиньте сайт.",
  theme = 'default',
  language = 'ru'
}) => {
  const [showUnderageMessage, setShowUnderageMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Сброс состояния при открытии
  useEffect(() => {
    if (isOpen) {
      setShowUnderageMessage(false);
      setIsLoading(false);
    }
  }, [isOpen]);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      // Сохраняем выбор в localStorage
      localStorage.setItem('ageVerified', 'true');
      localStorage.setItem('ageVerifiedDate', new Date().toISOString());
      
      if (onConfirm) {
        await onConfirm();
      }
      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error('Error confirming age:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = () => {
    setShowUnderageMessage(true);
  };

  const handleCloseUnderage = () => {
    setShowUnderageMessage(false);
    if (onReject) {
      onReject();
    }
    if (onClose) {
      onClose();
    }
  };

  // Стили в зависимости от темы
  const getThemeStyles = () => {
    const themes = {
      default: {
        primary: '#1976d2',
        secondary: '#dc004e',
        background: '#ffffff',
        text: '#333333'
      },
      casino: {
        primary: '#d4af37',
        secondary: '#8b0000',
        background: '#1a1a1a',
        text: '#ffffff'
      },
      gaming: {
        primary: '#00ff88',
        secondary: '#ff4444',
        background: '#0a0a0a',
        text: '#ffffff'
      },
      adult: {
        primary: '#ff6b6b',
        secondary: '#4ecdc4',
        background: '#2c2c2c',
        text: '#ffffff'
      }
    };
    
    return themes[theme] || themes.default;
  };

  const themeStyles = getThemeStyles();

  // Проверяем, была ли уже пройдена верификация
  const isAlreadyVerified = () => {
    const verified = localStorage.getItem('ageVerified');
    const verificationDate = localStorage.getItem('ageVerifiedDate');
    
    if (verified === 'true' && verificationDate) {
      const date = new Date(verificationDate);
      const now = new Date();
      const daysDiff = (now - date) / (1000 * 60 * 60 * 24);
      
      // Верификация действительна 30 дней
      return daysDiff < 30;
    }
    
    return false;
  };

  // Если уже верифицирован, не показываем диалог
  if (isAlreadyVerified() && isOpen) {
    if (onConfirm) onConfirm();
    if (onClose) onClose();
    return null;
  }

  return (
    <>
      <Dialog
        open={isOpen && !showUnderageMessage}
        onClose={() => {}} // Не позволяем закрыть через ESC или клик вне
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: `linear-gradient(135deg, ${themeStyles.background} 0%, ${themeStyles.background}dd 100%)`,
            border: `2px solid ${themeStyles.primary}`,
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
          }
        }}
        BackdropProps={{
          sx: {
            backgroundColor: 'rgba(0,0,0,0.8)',
            backdropFilter: 'blur(5px)'
          }
        }}
      >
        <DialogTitle sx={{ 
          textAlign: 'center', 
          color: themeStyles.text,
          fontSize: '1.5rem',
          fontWeight: 'bold',
          pb: 1
        }}>
          {title}
        </DialogTitle>
        
        <DialogContent sx={{ textAlign: 'center', py: 3 }}>
          <Box sx={{ mb: 3 }}>
            <WarningIcon 
              sx={{ 
                fontSize: 64, 
                color: themeStyles.primary,
                mb: 2,
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
              }} 
            />
          </Box>
          
          <Typography 
            variant="body1" 
            sx={{ 
              color: themeStyles.text,
              fontSize: '1.1rem',
              lineHeight: 1.6,
              mb: 3
            }}
          >
            {content}
          </Typography>
        </DialogContent>
        
        <DialogActions sx={{ 
          justifyContent: 'center', 
          gap: 2, 
          pb: 3,
          px: 3
        }}>
          <Button
            onClick={handleConfirm}
            variant="contained"
            size="large"
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={20} /> : <CheckCircleIcon />}
            sx={{
              backgroundColor: themeStyles.primary,
              color: 'white',
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 'bold',
              borderRadius: 2,
              '&:hover': {
                backgroundColor: themeStyles.primary,
                transform: 'translateY(-2px)',
                boxShadow: `0 8px 16px ${themeStyles.primary}40`
              },
              '&:disabled': {
                backgroundColor: themeStyles.primary + '80'
              }
            }}
          >
            {confirmText}
          </Button>
          
          <Button
            onClick={handleReject}
            variant="outlined"
            size="large"
            startIcon={<CancelIcon />}
            sx={{
              borderColor: themeStyles.secondary,
              color: themeStyles.secondary,
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 'bold',
              borderRadius: 2,
              '&:hover': {
                backgroundColor: themeStyles.secondary,
                color: 'white',
                transform: 'translateY(-2px)',
                boxShadow: `0 8px 16px ${themeStyles.secondary}40`
              }
            }}
          >
            {rejectText}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Сообщение для несовершеннолетних */}
      <Dialog
        open={showUnderageMessage}
        onClose={handleCloseUnderage}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: `linear-gradient(135deg, ${themeStyles.secondary} 0%, ${themeStyles.secondary}dd 100%)`,
            border: `2px solid ${themeStyles.secondary}`,
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
          }
        }}
      >
        <DialogTitle sx={{ 
          textAlign: 'center', 
          color: 'white',
          fontSize: '1.5rem',
          fontWeight: 'bold',
          pb: 1
        }}>
          Доступ ограничен
        </DialogTitle>
        
        <DialogContent sx={{ textAlign: 'center', py: 3 }}>
          <Box sx={{ mb: 3 }}>
            <CancelIcon 
              sx={{ 
                fontSize: 64, 
                color: 'white',
                mb: 2,
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
              }} 
            />
          </Box>
          
          <Alert 
            severity="warning" 
            sx={{ 
              mb: 3,
              backgroundColor: 'rgba(255,255,255,0.1)',
              color: 'white',
              '& .MuiAlert-icon': {
                color: 'white'
              }
            }}
          >
            <Typography variant="body1" sx={{ color: 'white', fontSize: '1.1rem' }}>
              {underageMessage}
            </Typography>
          </Alert>
        </DialogContent>
        
        <DialogActions sx={{ 
          justifyContent: 'center', 
          pb: 3,
          px: 3
        }}>
          <Button
            onClick={handleCloseUnderage}
            variant="contained"
            size="large"
            startIcon={<CloseIcon />}
            sx={{
              backgroundColor: 'white',
              color: themeStyles.secondary,
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 'bold',
              borderRadius: 2,
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.9)',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 16px rgba(0,0,0,0.3)'
              }
            }}
          >
            Понятно
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AgeVerification;
