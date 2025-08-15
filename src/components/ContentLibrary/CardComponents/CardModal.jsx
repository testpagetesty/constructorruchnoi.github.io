import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  Card,
  CardMedia,
  CardContent,
  CardActions as MuiCardActions,
  Divider
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import LinkIcon from '@mui/icons-material/Link';

const CardModal = ({ 
  open, 
  onClose, 
  card, 
  cardType = 'basic-card' 
}) => {
  if (!card) return null;



  const handleButtonClick = () => {
    if (card.buttonLink) {
      if (card.buttonLink.startsWith('http')) {
        window.open(card.buttonLink, '_blank');
      } else {
        window.location.href = card.buttonLink;
      }
    }
  };

  const renderImageCard = () => {
    // Получаем настройки цветов из customStyles (приоритет) или colorSettings
    const customStyles = card.customStyles || {};
    const colorSettings = card.colorSettings || {};
    
    // Приоритет: customStyles > colorSettings > значения по умолчанию
    const titleColor = customStyles.titleColor || colorSettings.textFields?.title || '#1976d2';
    const textColor = customStyles.textColor || colorSettings.textFields?.text || '#333333';
    const backgroundColor = customStyles.backgroundColor || colorSettings.textFields?.background || 'transparent';
    const borderColor = customStyles.borderColor || colorSettings.borderColor || '#e0e0e0';
    const borderRadius = customStyles.borderRadius || colorSettings.borderRadius || 8;
    const borderWidth = customStyles.borderWidth || colorSettings.borderWidth || 1;
    

    
    const imageElement = card.imageUrl && (
      <CardMedia
        component="img"
        height={card.imageHeight || 300}
        image={card.imageUrl}
        alt={card.imageAlt || card.title}
        sx={{ 
          objectFit: 'cover',
          filter: colorSettings.imageFilter || 'none',
          opacity: colorSettings.imageOpacity || 1
        }}
      />
    );

    const contentElement = (
      <CardContent sx={{ 
        textAlign: card.alignment || 'left',
        backgroundColor: backgroundColor,
        color: textColor,
        flex: 1,
        padding: colorSettings.padding ? `${colorSettings.padding}px` : '24px'
      }}>
        <Typography 
          variant="h4" 
          component="h2" 
          gutterBottom
          sx={{ 
            color: titleColor,
            fontWeight: 'bold',
            mb: 2
          }}
        >
          {card.title}
        </Typography>
        
        <Typography 
          variant="body1" 
          sx={{ 
            lineHeight: 1.6,
            whiteSpace: 'pre-wrap',
            color: textColor
          }}
        >
          {card.content}
        </Typography>
      </CardContent>
    );

    const buttonElement = null; // Убираем кнопку из модального окна
    /* const buttonElement = card.buttonText && (
      <MuiCardActions sx={{ justifyContent: card.alignment || 'flex-start', p: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleButtonClick}
          startIcon={<LinkIcon />}
          sx={{
            backgroundColor: card.customStyles?.buttonColor || '#1976d2',
            '&:hover': {
              backgroundColor: card.customStyles?.buttonHoverColor || '#1565c0'
            }
          }}
        >
          {card.buttonText}
        </Button>
      </MuiCardActions>
    ); */

    // Базовые стили для контейнера с поддержкой customStyles и colorSettings
    let containerStyles = {
      maxWidth: '100%',
      borderRadius: `${borderRadius}px`,
      overflow: 'hidden',
      border: borderColor ? `${borderWidth}px solid ${borderColor}` : 'none'
    };
    
    // Применяем настройки фона из customStyles (приоритет) или colorSettings
    if (customStyles.backgroundType === 'gradient') {
      containerStyles.background = `linear-gradient(${customStyles.gradientDirection || 'to right'}, ${customStyles.gradientColor1 || '#ffffff'}, ${customStyles.gradientColor2 || '#f5f5f5'})`;
    } else if (colorSettings.sectionBackground?.enabled) {
      if (colorSettings.sectionBackground.useGradient) {
        containerStyles.background = `linear-gradient(${colorSettings.sectionBackground.gradientDirection}, ${colorSettings.sectionBackground.gradientColor1}, ${colorSettings.sectionBackground.gradientColor2})`;
        containerStyles.opacity = colorSettings.sectionBackground.opacity || 1;
      } else {
        containerStyles.backgroundColor = colorSettings.sectionBackground.solidColor;
        containerStyles.opacity = colorSettings.sectionBackground.opacity || 1;
      }
    } else {
      containerStyles.backgroundColor = backgroundColor;
    }
    
    // Применяем тень если включена
    if (customStyles.boxShadow || colorSettings.boxShadow) {
      containerStyles.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
    }

    // Рендерим в зависимости от позиции изображения
    if (card.imagePosition === 'top') {
      return (
        <Box sx={containerStyles}>
          {imageElement}
          {contentElement}
          {buttonElement}
        </Box>
      );
    } else if (card.imagePosition === 'bottom') {
      return (
        <Box sx={containerStyles}>
          {contentElement}
          {imageElement}
          {buttonElement}
        </Box>
      );
    } else if (card.imagePosition === 'left' || card.imagePosition === 'right') {
      return (
        <Box sx={containerStyles}>
          <Box sx={{ display: 'flex', flexDirection: card.imagePosition === 'left' ? 'row' : 'row-reverse' }}>
            <Box sx={{ flex: '0 0 40%' }}>
              {imageElement}
            </Box>
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              {contentElement}
            </Box>
          </Box>
          {buttonElement}
        </Box>
      );
    } else if (card.imagePosition === 'background') {
      return (
        <Box sx={{ 
          ...containerStyles,
          backgroundImage: card.imageUrl ? `url(${card.imageUrl})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: 400
        }}>
          <Box sx={{ 
            backgroundColor: 'rgba(0,0,0,0.5)',
            minHeight: 400,
            display: 'flex',
            flexDirection: 'column'
          }}>
            {contentElement}
            {buttonElement}
          </Box>
        </Box>
      );
    } else {
      return (
        <Box sx={containerStyles}>
          {imageElement}
          {contentElement}
          {buttonElement}
        </Box>
      );
    }
  };

  const renderBasicCard = () => {
    // Получаем настройки цветов из customStyles (приоритет) или colorSettings
    const customStyles = card.customStyles || {};
    const colorSettings = card.colorSettings || {};
    
    // Приоритет: customStyles > colorStyles > colorSettings > значения по умолчанию
    const titleColor = customStyles.titleColor || colorSettings.textFields?.title || '#ffd700';
    const textColor = customStyles.textColor || colorSettings.textFields?.text || '#ffffff';
    const backgroundColor = customStyles.backgroundColor || colorSettings.textFields?.background || 'rgba(0,0,0,0.85)';
    const borderColor = customStyles.borderColor || colorSettings.textFields?.border || '#c41e3a';
    const borderRadius = customStyles.borderRadius || colorSettings.borderRadius || 8;
    const borderWidth = customStyles.borderWidth || colorSettings.borderWidth || 1;
    

    
    // Стили контейнера с поддержкой customStyles и colorSettings
    let containerStyles = {
      textAlign: card.alignment || 'left',
      color: textColor,
      padding: customStyles.padding ? `${customStyles.padding}px` : colorSettings.padding ? `${colorSettings.padding}px` : '24px',
      borderRadius: `${borderRadius}px`,
      border: borderColor ? `${borderWidth}px solid ${borderColor}` : 'none'
    };
    
    // Применяем настройки фона из customStyles (приоритет) или colorSettings
    if (customStyles.backgroundType === 'gradient') {
      containerStyles.background = `linear-gradient(${customStyles.gradientDirection || 'to right'}, ${customStyles.gradientColor1 || '#ffffff'}, ${customStyles.gradientColor2 || '#f5f5f5'})`;
    } else if (colorSettings.sectionBackground?.enabled) {
      if (colorSettings.sectionBackground.useGradient) {
        containerStyles.background = `linear-gradient(${colorSettings.sectionBackground.gradientDirection}, ${colorSettings.sectionBackground.gradientColor1}, ${colorSettings.sectionBackground.gradientColor2})`;
        containerStyles.opacity = colorSettings.sectionBackground.opacity || 1;
      } else {
        containerStyles.backgroundColor = colorSettings.sectionBackground.solidColor;
        containerStyles.opacity = colorSettings.sectionBackground.opacity || 1;
      }
    } else {
      containerStyles.backgroundColor = backgroundColor;
    }
    
    // Применяем тень если включена
    if (customStyles.boxShadow || colorSettings.boxShadow) {
      containerStyles.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
    }
    
    return (
      <Box sx={containerStyles}>
        <Typography 
          variant="h4" 
          component="h2" 
          gutterBottom
          sx={{ 
            color: titleColor,
            fontWeight: 'bold',
            mb: 2
          }}
        >
          {card.title}
        </Typography>
        
        <Typography 
          variant="body1" 
          sx={{ 
            lineHeight: 1.6,
            whiteSpace: 'pre-wrap',
            color: textColor
          }}
        >
          {card.content}
        </Typography>
      </Box>
    );
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxHeight: '90vh',
          backgroundColor: 'transparent',
          boxShadow: 'none'
        }
      }}
    >
      <DialogContent sx={{ p: 0, backgroundColor: 'transparent', position: 'relative' }}>
        {/* Плавающий крестик поверх контента */}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            zIndex: 10,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 1)'
            },
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        
        {cardType === 'image-card' ? renderImageCard() : renderBasicCard()}
      </DialogContent>
    </Dialog>
  );
};

export default CardModal; 