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
    const imageElement = card.imageUrl && (
      <CardMedia
        component="img"
        height={card.imageHeight || 300}
        image={card.imageUrl}
        alt={card.imageAlt || card.title}
        sx={{ 
          objectFit: 'cover',
          filter: card.customStyles?.imageFilter || 'none',
          opacity: card.customStyles?.imageOpacity || 1
        }}
      />
    );

    const contentElement = (
      <CardContent sx={{ 
        textAlign: card.alignment || 'left',
        backgroundColor: card.customStyles?.backgroundColor || 'transparent',
        color: card.customStyles?.textColor || 'inherit',
        flex: 1
      }}>
        <Typography 
          variant="h4" 
          component="h2" 
          gutterBottom
          sx={{ 
            color: card.customStyles?.titleColor || 'inherit',
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
            color: card.customStyles?.textColor || 'inherit'
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

    // Базовые стили для контейнера
    const containerStyles = {
      maxWidth: '100%',
      borderRadius: card.customStyles?.borderRadius ? `${card.customStyles.borderRadius}px` : 2,
      overflow: 'hidden',
      // Применяем градиент если он есть
      ...(card.customStyles?.backgroundType === 'gradient' ? {
        background: `linear-gradient(${card.customStyles.gradientDirection || 'to right'}, ${card.customStyles.gradientColor1 || '#c41e3a'}, ${card.customStyles.gradientColor2 || '#ffd700'})`
      } : {
        backgroundColor: card.customStyles?.backgroundColor || 'transparent'
      })
    };

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

  const renderBasicCard = () => (
    <Box sx={{ 
      textAlign: card.alignment || 'left',
      backgroundColor: card.customStyles?.backgroundColor || 'transparent',
      color: card.customStyles?.textColor || 'inherit',
      p: 3,
      borderRadius: card.customStyles?.borderRadius ? `${card.customStyles.borderRadius}px` : 2,
      // Применяем градиент если он есть
      ...(card.customStyles?.backgroundType === 'gradient' ? {
        background: `linear-gradient(${card.customStyles.gradientDirection || 'to right'}, ${card.customStyles.gradientColor1 || '#c41e3a'}, ${card.customStyles.gradientColor2 || '#ffd700'})`
      } : {})
    }}>
      <Typography 
        variant="h4" 
        component="h2" 
        gutterBottom
        sx={{ 
          color: card.customStyles?.titleColor || 'inherit',
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
          color: card.customStyles?.textColor || 'inherit'
        }}
      >
        {card.content}
      </Typography>
      
      {/* Убираем кнопку из модального окна */}
      {/* {card.buttonText && (
        <Box sx={{ mt: 3, textAlign: card.alignment || 'left' }}>
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
        </Box>
      )} */}
    </Box>
  );

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
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'flex-end', 
        alignItems: 'center',
        pb: 1,
        pt: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: '8px 8px 0 0'
      }}>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ p: 0, backgroundColor: 'transparent' }}>
        {cardType === 'image-card' ? renderImageCard() : renderBasicCard()}
      </DialogContent>
    </Dialog>
  );
};

export default CardModal; 