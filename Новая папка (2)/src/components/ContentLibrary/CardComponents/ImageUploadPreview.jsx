import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Chip,
  Alert,
  AlertTitle,
  CircularProgress,
  Paper,
  Button
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ImageIcon from '@mui/icons-material/Image';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import RefreshIcon from '@mui/icons-material/Refresh';
import { imageCacheService } from '../../../utils/imageCacheService';

const ImageUploadPreview = ({ onImageSelect, selectedImageUrl, onUploadNew, cardId, cardTitle }) => {
  const [cachedImages, setCachedImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadCachedImages();
    
    // Слушаем события загрузки новых изображений
    const handleImageUploaded = () => {
      setUploading(true);
      loadCachedImages().finally(() => {
        setUploading(false);
      });
    };
    
    // Слушаем события очистки кеша
    const handleImageCacheCleared = () => {
      setCachedImages([]);
    };
    
    window.addEventListener('imageUploaded', handleImageUploaded);
    window.addEventListener('imageCacheCleared', handleImageCacheCleared);
    
    return () => {
      window.removeEventListener('imageUploaded', handleImageUploaded);
      window.removeEventListener('imageCacheCleared', handleImageCacheCleared);
    };
  }, []);

  const loadCachedImages = async () => {
    try {
      if (!loading) setLoading(true);
      const images = [];
      
      // Получаем все метаданные из кеша
      const allMetadata = imageCacheService.getAllMetadata();
      
      console.log('[ImageUploadPreview] Все метаданные:', allMetadata);
      console.log('[ImageUploadPreview] Строгая фильтрация для cardId:', cardId);
      
      // Если cardId не передан, не показываем ничего
      if (!cardId) {
        console.log('[ImageUploadPreview] cardId не передан, не показываем изображения');
        setCachedImages([]);
        return;
      }
      
      for (const [key, metadata] of Object.entries(allMetadata)) {
        if (metadata && metadata.fileName && metadata.cardId) {
          console.log('[ImageUploadPreview] Проверка метаданных:', {
            fileName: metadata.fileName,
            metadataCardId: metadata.cardId,
            currentCardId: cardId,
            match: metadata.cardId === cardId
          });
          
          // СТРОГАЯ проверка: показываем ТОЛЬКО если cardId точно совпадает
          if (metadata.cardId === cardId) {
            const blob = await imageCacheService.getImage(metadata.fileName);
            if (blob) {
              console.log('[ImageUploadPreview] ✅ Изображение принадлежит этой карточке:', metadata.fileName);
              
              images.push({
                fileName: metadata.fileName,
                url: URL.createObjectURL(blob),
                metadata: metadata,
                isForThisCard: true,
                format: metadata.format || 'jpg',
                size: metadata.size,
                dimensions: metadata.width && metadata.height ? `${metadata.width}×${metadata.height}` : 'Неизвестно'
              });
            } else {
              console.log('[ImageUploadPreview] ❌ Blob не найден для:', metadata.fileName);
            }
          } else {
            console.log('[ImageUploadPreview] ❌ Изображение НЕ принадлежит этой карточке:', {
              fileName: metadata.fileName,
              metadataCardId: metadata.cardId,
              currentCardId: cardId
            });
          }
        } else {
          console.log('[ImageUploadPreview] ❌ Неполные метаданные:', metadata);
        }
      }
      
      console.log(`[ImageUploadPreview] ✅ Найдено ${images.length} изображений для карточки ${cardId}`);
      setCachedImages(images);
    } catch (error) {
      console.error('Ошибка при загрузке кешированных изображений:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageDelete = async (fileName) => {
    try {
      await imageCacheService.deleteImage(fileName);
      // Удаляем метаданные по правильному ключу
      imageCacheService.deleteMetadata(`site-images-metadata-${fileName}`);
      await loadCachedImages(); // Перезагружаем список
    } catch (error) {
      console.error('Ошибка при удалении изображения:', error);
    }
  };

  const handleImageSelect = (image) => {
    if (onImageSelect) {
      onImageSelect(image.url, image.fileName, image.metadata);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (uploading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 2, flexDirection: 'column', alignItems: 'center' }}>
        <CircularProgress size={24} sx={{ mb: 1 }} />
        <Typography variant="caption" color="text.secondary">
          Обработка изображения...
        </Typography>
      </Box>
    );
  }

  if (cachedImages.length === 0) {
    return (
      <Box>
        <Alert severity="info" sx={{ mb: 2 }}>
          <AlertTitle>📁 Нет изображений для этой карточки</AlertTitle>
          <Typography variant="body2">
            Каждая карточка имеет свои собственные изображения. Загрузите изображение, чтобы оно появилось здесь.
          </Typography>
        </Alert>
        {onUploadNew && (
          <Button
            variant="outlined"
            startIcon={<CloudUploadIcon />}
            onClick={onUploadNew}
            fullWidth
          >
            Загрузить изображение для этой карточки
          </Button>
        )}
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="subtitle2">
          Изображения этой карточки ({cachedImages.length}):
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton
            size="small"
            onClick={loadCachedImages}
            title="Обновить список"
          >
            <RefreshIcon />
          </IconButton>
          {onUploadNew && (
            <Button
              variant="outlined"
              startIcon={<CloudUploadIcon />}
              onClick={onUploadNew}
              size="small"
            >
              Загрузить новое
            </Button>
          )}
        </Box>
      </Box>
      
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
        {cachedImages.map((image) => (
          <Paper
            key={image.fileName}
            sx={{
              position: 'relative',
              width: 100,
              height: 80,
              overflow: 'hidden',
              cursor: 'pointer',
              border: selectedImageUrl === image.url ? '2px solid #1976d2' : 
                      image.isForThisCard ? '2px solid #4caf50' : '1px solid #e0e0e0',
              '&:hover': {
                borderColor: '#1976d2'
              }
            }}
            onClick={() => handleImageSelect(image)}
          >
            <img
              src={image.url}
              alt={image.metadata.originalName}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
            
            {/* Кнопка удаления */}
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleImageDelete(image.fileName);
              }}
              sx={{
                position: 'absolute',
                top: 2,
                right: 2,
                backgroundColor: 'rgba(255,255,255,0.8)',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,1)'
                }
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
            
            {/* Индикатор выбора */}
            {selectedImageUrl === image.url && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 2,
                  left: 2,
                  backgroundColor: '#1976d2',
                  color: 'white',
                  borderRadius: '50%',
                  width: 16,
                  height: 16,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px'
                }}
              >
                ✓
              </Box>
            )}
            
            {/* Индикатор принадлежности карточке */}
            {image.isForThisCard && selectedImageUrl !== image.url && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 2,
                  left: 2,
                  backgroundColor: '#4caf50',
                  color: 'white',
                  borderRadius: '50%',
                  width: 16,
                  height: 16,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px'
                }}
              >
                ★
              </Box>
            )}
            
            {/* Информация о формате и размере */}
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: 'rgba(0,0,0,0.7)',
                color: 'white',
                padding: '2px 4px',
                fontSize: '10px',
                textAlign: 'center'
              }}
            >
              {image.format?.toUpperCase()} • {image.dimensions}
            </Box>
          </Paper>
        ))}
      </Box>
      
      <Typography variant="caption" color="text.secondary">
        Изображения привязаны к этой карточке и не отображаются в других карточках. 
        Все файлы автоматически конвертируются в JPG и сохраняются в браузере.
      </Typography>
    </Box>
  );
};

export default ImageUploadPreview; 