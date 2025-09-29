import React, { useState, useRef, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Typography,
  Button,
  IconButton,
  Box,
  Tooltip,
  Fab
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { imageCacheService } from '../../../utils/imageCacheService';
import AnimationWrapper from '../AnimationWrapper';

const ImageCardWithUpload = ({
  id,
  title = 'Карточка с изображением',
  content = 'Описание изображения или дополнительная информация к карточке.',
  imageUrl = 'https://via.placeholder.com/300x200?text=Изображение',
  imageAlt = 'Изображение',
  buttonText = '',
  buttonLink = '',
  imagePosition = 'top',
  imageHeight = 200,
  elevation = 2,
  variant = 'elevated',
  size = 'medium',
  alignment = 'left',
  showActions = false,
  customStyles = {},
  colorSettings = {},
  onUpdate,
  onDelete,
  editable = true,
  animationSettings = {},
  gridSize = 'medium',
  onClick = null,
  maxTitleHeight = 0,
  sx = {},
  sectionId,
  sectionTitle,
  cardIndex,
  ...props
}) => {
  const [cardId] = useState(() => {
    if (id) return id;
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `card_${timestamp}_${random}`;
  });
  
  const [currentTitle, setCurrentTitle] = useState(title);
  const [currentContent, setCurrentContent] = useState(content);
  const [currentImageUrl, setCurrentImageUrl] = useState(imageUrl);
  const [currentImageAlt, setCurrentImageAlt] = useState(imageAlt);
  const [currentButtonText, setCurrentButtonText] = useState(buttonText);
  const [currentButtonLink, setCurrentButtonLink] = useState(buttonLink);
  const [isUploading, setIsUploading] = useState(false);
  
  // Есть ли реальное изображение для отображения
  const hasRealImage = !!(currentImageUrl && typeof currentImageUrl === 'string' && currentImageUrl.trim() !== '' && !currentImageUrl.includes('via.placeholder') && !currentImageUrl.includes('placeholder'));

  // Обновляем состояние при изменении пропсов
  useEffect(() => {
    setCurrentTitle(title);
  }, [title]);

  useEffect(() => {
    setCurrentContent(content);
  }, [content]);

  useEffect(() => {
    setCurrentImageUrl(imageUrl);
  }, [imageUrl]);

  useEffect(() => {
    setCurrentImageAlt(imageAlt);
  }, [imageAlt]);

  // Функция для обработки загрузки изображения
  const handleImageUpload = async (file) => {
    if (!file) return;
    
    setIsUploading(true);
    
    try {
      const { imageCacheService } = await import('../../../utils/imageCacheService');
      
      // Генерируем уникальное имя файла на основе названия карточки
      const cardTitle = currentTitle || 'untitled';
      let sanitizedTitle = cardTitle
        .replace(/[^\w\s]/g, '') // Удаляем спецсимволы
        .replace(/\s+/g, '_') // Пробелы в подчеркивания
        .replace(/_+/g, '_') // Множественные подчеркивания в одно
        .replace(/^_|_$/g, '') // Убираем подчеркивания в начале/конце
        .toLowerCase()
        .substring(0, 30); // Ограничиваем длину
      
      if (!sanitizedTitle || sanitizedTitle.length < 2) {
        sanitizedTitle = 'untitled';
      }
      
      const timestamp = Date.now();
      const fileExtension = file.name.split('.').pop();
      const fileName = `card_${sanitizedTitle}_${cardId}_${timestamp}.${fileExtension}`;
      
      console.log('🔥🔥🔥 [ImageCardWithUpload] Загрузка изображения:', {
        cardTitle,
        sanitizedTitle,
        fileName,
        cardId
      });
      
      await imageCacheService.saveImage(fileName, file);
      
      const metadata = {
        fileName: fileName,
        originalName: file.name,
        cardTitle: cardTitle,
        cardId: cardId,
        size: file.size,
        type: file.type,
        uploadDate: new Date().toISOString()
      };
      await imageCacheService.saveMetadata(`site-images-metadata-${fileName}`, metadata);
      
      const blob = await imageCacheService.getImage(fileName);
      if (blob) {
        const url = URL.createObjectURL(blob);
        setCurrentImageUrl(url);
        setCurrentImageAlt(metadata.cardTitle || currentTitle);
        
        // Обновляем родительский компонент
        if (onUpdate) {
          onUpdate({
            imageUrl: url,
            imageAlt: metadata.cardTitle || currentTitle,
            fileName: fileName,
            cardId: cardId,
            metadata: metadata
          });
        }
        
        // Уведомляем другие компоненты
        setTimeout(() => {
          const event = new CustomEvent('imageUploaded', { 
            detail: { fileName, url, metadata } 
          });
          window.dispatchEvent(event);
        }, 100);
      }
    } catch (error) {
      console.error('Ошибка при загрузке изображения:', error);
    } finally {
      setIsUploading(false);
    }
  };

  // Обработчик клика по кнопке загрузки
  const handleUploadClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        await handleImageUpload(file);
      }
    };
    input.click();
  };

  // Стили для изображения
  const getImageStyles = () => {
    const baseStyles = {
      height: imageHeight,
      objectFit: 'cover',
      position: 'relative'
    };

    if (imagePosition === 'background') {
      return {
        ...baseStyles,
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0
      };
    }

    return baseStyles;
  };

  // Стили для карточки
  const getCardStyles = () => {
    const baseStyles = {
      card: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        ...customStyles
      },
      content: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column'
      }
    };

    return baseStyles;
  };

  const styles = getCardStyles();

  return (
    <AnimationWrapper {...animationSettings}>
      <Card
        sx={{
          ...styles.card,
          ...sx,
          '&:hover .upload-button': {
            opacity: 1
          }
        }}
        elevation={elevation}
        variant={variant}
        onClick={onClick}
      >
        {/* Изображение с кнопкой загрузки */}
        <Box sx={{ position: 'relative' }}>
          {hasRealImage ? (
            <CardMedia
              component="img"
              image={currentImageUrl}
              alt=""
              sx={getImageStyles()}
            />
          ) : (
            <Box
              sx={{
                ...getImageStyles(),
                backgroundColor: '#f8f9fa',
                border: '2px dashed #dee2e6',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#6c757d',
                textAlign: 'center',
                padding: 3,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: '#e9ecef',
                  borderColor: '#adb5bd'
                }
              }}
              onClick={(e) => { e.stopPropagation(); handleUploadClick(); }}
            >
              <CloudUploadIcon sx={{ fontSize: 48, mb: 2, color: '#adb5bd' }} />
              <Typography variant="body1" sx={{ fontWeight: 500, mb: 1 }}>
                Переместите сюда картинку или загрузите
              </Typography>
              <Typography variant="caption" sx={{ color: '#6c757d' }}>
                Нажмите для выбора файла
              </Typography>
            </Box>
          )}
          
          {/* Кнопка загрузки изображения */}
          {editable && (
            <Fab
              size="small"
              color="primary"
              className="upload-button"
              onClick={(e) => {
                e.stopPropagation();
                handleUploadClick();
              }}
              disabled={isUploading}
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                opacity: 0.8,
                transition: 'opacity 0.3s ease',
                zIndex: 2,
                '&:hover': {
                  opacity: 1,
                  transform: 'scale(1.1)'
                }
              }}
            >
              {isUploading ? (
                <Box sx={{ width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Box
                    sx={{
                      width: 16,
                      height: 16,
                      border: '2px solid #fff',
                      borderTop: '2px solid transparent',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }}
                  />
                </Box>
              ) : (
                <CloudUploadIcon />
              )}
            </Fab>
          )}
          
          {/* Индикатор загрузки */}
          {isUploading && (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 3
              }}
            >
              <Box sx={{ textAlign: 'center', color: 'white' }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    border: '3px solid #fff',
                    borderTop: '3px solid transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    margin: '0 auto 8px'
                  }}
                />
                <Typography variant="caption">Загрузка...</Typography>
              </Box>
            </Box>
          )}
        </Box>

        {/* Контент карточки */}
        <CardContent sx={styles.content}>
          {currentTitle && (
            <Typography 
              variant="h6" 
              component="h3" 
              gutterBottom
              sx={{
                color: colorSettings.textFields?.title || '#333333',
                fontWeight: 'bold',
                fontSize: '1.1rem',
                lineHeight: 1.3,
                maxHeight: maxTitleHeight > 0 ? `${maxTitleHeight}px` : 'none',
                overflow: maxTitleHeight > 0 ? 'hidden' : 'visible',
                display: '-webkit-box',
                WebkitLineClamp: maxTitleHeight > 0 ? Math.floor(maxTitleHeight / 24) : 'none',
                WebkitBoxOrient: 'vertical'
              }}
            >
              {currentTitle}
            </Typography>
          )}
          
          {currentContent && (
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{
                color: colorSettings.textFields?.text || '#666666',
                lineHeight: 1.5,
                flex: 1,
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 6,
                WebkitBoxOrient: 'vertical',
                textOverflow: 'ellipsis'
              }}
            >
              {currentContent}
            </Typography>
          )}
        </CardContent>

        {/* Кнопки действий */}
        {showActions && (currentButtonText || currentButtonLink) && (
          <CardActions>
            {currentButtonText && currentButtonLink && (
              <Button
                size="small"
                variant="contained"
                href={currentButtonLink}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  backgroundColor: colorSettings.buttonColor || '#1976d2',
                  '&:hover': {
                    backgroundColor: colorSettings.buttonHoverColor || '#1565c0'
                  }
                }}
              >
                {currentButtonText}
              </Button>
            )}
          </CardActions>
        )}
      </Card>
      
      {/* CSS для анимации загрузки */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </AnimationWrapper>
  );
};

export default ImageCardWithUpload;
