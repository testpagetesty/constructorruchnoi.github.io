import React, { useEffect, useState } from 'react';
import { Box, IconButton } from '@mui/material';
import { ChevronLeftIcon, ChevronRightIcon } from '@mui/icons-material';

// Добавим обработчик сообщений для обновления изображений
useEffect(() => {
  const handleMessage = (event) => {
    if (event.data.type === 'UPDATE_SECTION_IMAGES') {
      const { sectionId, images } = event.data;
      setSectionsData(prev => ({
        ...prev,
        [sectionId]: {
          ...prev[sectionId],
          images: [...(prev[sectionId]?.images || []), ...images]
        }
      }));
    } else if (event.data.type === 'REMOVE_SECTION_IMAGE') {
      const { sectionId, imageIndex } = event.data;
      setSectionsData(prev => ({
        ...prev,
        [sectionId]: {
          ...prev[sectionId],
          images: prev[sectionId]?.images.filter((_, idx) => idx !== imageIndex)
        }
      }));
    } else if (event.data.type === 'REORDER_SECTION_IMAGES') {
      const { sectionId, images } = event.data;
      setSectionsData(prev => ({
        ...prev,
        [sectionId]: {
          ...prev[sectionId],
          images: images
        }
      }));
    }
  };

  window.addEventListener('message', handleMessage);
  return () => window.removeEventListener('message', handleMessage);
}, []);

// Компонент для отображения галереи изображений в превью
const SectionImagesPreview = ({ images = [] }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handlePrevImage = () => {
    setCurrentImageIndex(prev => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex(prev => (prev < images.length - 1 ? prev + 1 : 0));
  };

  if (!images.length) return null;

  return (
    <Box sx={{ position: 'relative', width: '100%', height: '300px', mb: 2 }}>
      <Box
        component="img"
        src={images[currentImageIndex].url || images[currentImageIndex].path}
        alt={`Изображение ${currentImageIndex + 1}`}
        sx={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          borderRadius: 1
        }}
      />
      {images.length > 1 && (
        <>
          <IconButton
            onClick={handlePrevImage}
            sx={{
              position: 'absolute',
              left: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              bgcolor: 'rgba(255,255,255,0.8)',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' }
            }}
          >
            <ChevronLeftIcon />
          </IconButton>
          <IconButton
            onClick={handleNextImage}
            sx={{
              position: 'absolute',
              right: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              bgcolor: 'rgba(255,255,255,0.8)',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' }
            }}
          >
            <ChevronRightIcon />
          </IconButton>
          <Box
            sx={{
              position: 'absolute',
              bottom: 8,
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: 1
            }}
          >
            {images.map((_, index) => (
              <Box
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: index === currentImageIndex ? 'primary.main' : 'rgba(255,255,255,0.8)',
                  cursor: 'pointer',
                  '&:hover': { bgcolor: index === currentImageIndex ? 'primary.main' : 'rgba(255,255,255,0.9)' }
                }}
              />
            ))}
          </Box>
        </>
      )}
    </Box>
  );
};

// В компоненте секции заменить отображение одного изображения на галерею
{section.images && section.images.length > 0 && (
  <SectionImagesPreview images={section.images} />
)} 