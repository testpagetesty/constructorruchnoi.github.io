import React, { useState, useEffect, useRef } from 'react';
import { Box, Button, Typography, IconButton, Switch } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';

const SimpleImageGallery = ({ 
  images = [], 
  autoScroll = true, // Устанавливаем true по умолчанию
  scrollInterval = 2000,
  position = 'center', // 'center', 'right', 'left'
  maxHeight,
  fillContainer = false // Новый параметр для полного заполнения контейнера
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [error, setError] = useState(false);
  const [processedImages, setProcessedImages] = useState([]);
  const [showDebugInfo, setShowDebugInfo] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isAutoPlayEnabled, setIsAutoPlayEnabled] = useState(autoScroll);
  const galleryRef = useRef(null);
  const autoScrollRef = useRef(null);
  
  // Минимальное расстояние свайпа для переключения
  const minSwipeDistance = 50;

  // Обрабатываем и нормализуем массив изображений
  useEffect(() => {
    console.log('[SimpleImageGallery] Initializing with images:', images);
    
    // Преобразуем все форматы в массив строк URL
    const imgUrls = [];
    
    if (Array.isArray(images)) {
      images.forEach(img => {
        if (typeof img === 'string') {
          imgUrls.push(img);
        } else if (img && (img.url || img.path)) {
          imgUrls.push(img.url || img.path);
        }
      });
    } else if (typeof images === 'string') {
      imgUrls.push(images);
    } else if (images && (images.url || images.path)) {
      imgUrls.push(images.url || images.path);
    }
    
    console.log('[SimpleImageGallery] Processed image URLs:', imgUrls);
    setProcessedImages(imgUrls);
  }, [images]);

  // Обновляем autoPlay при изменении autoScroll prop
  useEffect(() => {
    console.log('[SimpleImageGallery] autoScroll prop changed:', autoScroll);
    setIsAutoPlayEnabled(autoScroll);
  }, [autoScroll]);

  // Слушаем сообщения для управления автопрокруткой
  useEffect(() => {
    const handleGalleryMessage = (event) => {
      if (event.data && event.data.type === 'UPDATE_AUTOSCROLL_SETTING') {
        console.log('[SimpleImageGallery] Received autoscroll message:', event.data);
        
        // Включаем автопрокрутку и сбрасываем паузу
        setIsAutoPlayEnabled(event.data.autoScroll);
        setIsPaused(false);
        
        console.log(`[SimpleImageGallery] Auto-scroll ${event.data.autoScroll ? 'enabled' : 'disabled'} for section ${event.data.sectionId}`);
      }
    };

    window.addEventListener('message', handleGalleryMessage);
    return () => {
      window.removeEventListener('message', handleGalleryMessage);
    };
  }, []);

  // Автоматическое пролистывание
  useEffect(() => {
    // Активируем автопролистывание только если задана опция и есть больше 1 изображения
    if (isAutoPlayEnabled && processedImages.length > 1 && !isPaused) {
      console.log('[SimpleImageGallery] Starting auto-scroll with interval:', scrollInterval);
      
      // Очищаем предыдущий интервал, если он был
      if (autoScrollRef.current) {
        clearInterval(autoScrollRef.current);
      }
      
      autoScrollRef.current = setInterval(() => {
        setCurrentImageIndex(prev => (prev < processedImages.length - 1 ? prev + 1 : 0));
      }, scrollInterval);
      
      return () => {
        if (autoScrollRef.current) {
          clearInterval(autoScrollRef.current);
          autoScrollRef.current = null;
        }
      };
    } else if (autoScrollRef.current) {
      console.log('[SimpleImageGallery] Stopping auto-scroll');
      clearInterval(autoScrollRef.current);
      autoScrollRef.current = null;
    }
  }, [isAutoPlayEnabled, processedImages.length, scrollInterval, isPaused]);

  // Обработка нажатий клавиш
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Проверяем, находится ли фокус внутри нашей галереи
      if (galleryRef.current && galleryRef.current.contains(document.activeElement) || 
          document.activeElement === document.body) {
        if (e.key === 'ArrowLeft') {
          handlePrevImage();
        } else if (e.key === 'ArrowRight') {
          handleNextImage();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [processedImages.length]);

  const handlePrevImage = () => {
    pauseAutoScroll();
    setCurrentImageIndex(prev => (prev > 0 ? prev - 1 : processedImages.length - 1));
  };

  const handleNextImage = () => {
    pauseAutoScroll();
    setCurrentImageIndex(prev => (prev < processedImages.length - 1 ? prev + 1 : 0));
  };

  const handleError = () => {
    console.error('[SimpleImageGallery] Error loading image:', processedImages[currentImageIndex]);
    setError(true);
  };

  // Временно приостанавливаем автопролистывание при взаимодействии с галереей
  const pauseAutoScroll = () => {
    if (isAutoPlayEnabled) {
      setIsPaused(true);
      // Возобновляем через 5 секунд после последнего взаимодействия
      setTimeout(() => setIsPaused(false), 5000);
    }
  };

  // Переключатель режима автовоспроизведения
  const toggleAutoPlay = () => {
    setIsAutoPlayEnabled(!isAutoPlayEnabled);
    setIsPaused(false);
  };

  // Обработчики для свайпов
  const onTouchStart = (e) => {
    pauseAutoScroll();
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      handleNextImage();
    }
    if (isRightSwipe) {
      handlePrevImage();
    }
  };

  // Обработчики для мыши (drag and drop)
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  
  const onMouseDown = (e) => {
    pauseAutoScroll();
    setIsDragging(true);
    setStartX(e.clientX);
    e.preventDefault(); // Предотвращаем выделение текста
  };
  
  const onMouseMove = (e) => {
    if (!isDragging) return;
    setTouchEnd(e.clientX);
  };
  
  const onMouseUp = () => {
    if (!isDragging) return;
    
    if (touchEnd) {
      const distance = startX - touchEnd;
      const isLeftSwipe = distance > minSwipeDistance;
      const isRightSwipe = distance < -minSwipeDistance;
      
      if (isLeftSwipe) {
        handleNextImage();
      }
      if (isRightSwipe) {
        handlePrevImage();
      }
    }
    
    setIsDragging(false);
    setTouchEnd(null);
  };
  
  // Обработчик для отмены перетаскивания при выходе за пределы элемента
  const onMouseLeave = () => {
    setIsDragging(false);
    setTouchEnd(null);
  };

  if (processedImages.length === 0) {
    console.log('[SimpleImageGallery] No images to display');
    return null;
  }

  // Определяем стили в зависимости от позиции
  const getPositionStyles = () => {
    const baseStyles = {
      width: '100%',
      height: maxHeight ? maxHeight : '100%',
      mb: 2,
      cursor: isDragging ? 'grabbing' : 'grab',
      outline: 'none',
      display: 'flex',
      flexDirection: 'column',
      '& img': {
        objectFit: 'cover', // Всегда используем cover для заполнения
        height: '100%',
        width: '100%'
      }
    };

    if (position === 'right') {
      return {
        ...baseStyles,
        float: 'right',
        width: '100%',
        maxWidth: '100%',
        ml: 2,
        mb: 1,
        height: '100%'
      };
    } else if (position === 'left') {
      return {
        ...baseStyles,
        float: 'left',
        width: '100%',
        maxWidth: '100%',
        mr: 2,
        mb: 1,
        height: '100%'
      };
    } else {
      // Center (default)
      return baseStyles;
    }
  };

  return (
    <Box 
      ref={galleryRef}
      sx={{ 
        position: 'relative',
        ...getPositionStyles()
      }}
      className="simple-image-gallery"
      tabIndex="0" // Делаем элемент фокусируемым для работы с клавиатурой
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
      onMouseEnter={() => pauseAutoScroll()}
    >
      <Box
        component="img"
        src={processedImages[currentImageIndex]}
        alt={`Изображение ${currentImageIndex + 1}`}
        onError={handleError}
        sx={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          borderRadius: 1,
          display: 'block',
          backgroundColor: '#f8f8f8',
          pointerEvents: 'none',
        }}
        draggable="false"
      />
      {error && (
        <Box 
          sx={{ 
            width: '100%', 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center', 
            justifyContent: 'center',
            bgcolor: '#f5f5f5',
            color: '#666',
            borderRadius: 1,
            padding: 2
          }}
        >
          <Typography color="error" sx={{ mb: 1 }}>
            Изображение не может быть загружено
          </Typography>
          <Typography variant="caption" sx={{ wordBreak: 'break-all' }}>
            URL: {processedImages[currentImageIndex]}
          </Typography>
          <Button 
            variant="contained" 
            size="small" 
            color="primary" 
            sx={{ mt: 1 }}
            onClick={() => window.open(processedImages[currentImageIndex], '_blank')}
          >
            Открыть URL
          </Button>
        </Box>
      )}
      {processedImages.length > 1 && (
        <>
          <Button
            onClick={handlePrevImage}
            sx={{
              position: 'absolute',
              left: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              bgcolor: 'rgba(255,255,255,0.7)',
              minWidth: '40px',
              width: '40px',
              height: '40px',
              p: 0,
              borderRadius: '50%',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' },
              zIndex: 5
            }}
          >
            &#10094;
          </Button>
          <Button
            onClick={handleNextImage}
            sx={{
              position: 'absolute',
              right: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              bgcolor: 'rgba(255,255,255,0.7)',
              minWidth: '40px',
              width: '40px',
              height: '40px',
              p: 0,
              borderRadius: '50%',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' },
              zIndex: 5
            }}
          >
            &#10095;
          </Button>
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
            {processedImages.map((_, index) => (
              <Box
                key={index}
                onClick={() => {
                  pauseAutoScroll();
                  setCurrentImageIndex(index);
                }}
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
      
      {/* Индикатор номера изображения */}
      {processedImages.length > 1 && (
        <Box
          sx={{
            position: 'absolute',
            top: 8,
            left: 8,
            bgcolor: 'rgba(0,0,0,0.5)',
            color: 'white',
            px: 1,
            py: 0.5,
            borderRadius: 1,
            fontSize: '0.75rem',
            zIndex: 5
          }}
        >
          {currentImageIndex + 1} / {processedImages.length}
        </Box>
      )}

      {/* Переключатель автопрокрутки (отображается только если изображений > 1) */}
      {processedImages.length > 1 && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 8,
            right: 8,
            display: 'flex',
            alignItems: 'center',
            bgcolor: 'rgba(0,0,0,0.5)',
            color: 'white',
            px: 1,
            py: 0.5,
            borderRadius: 1,
            fontSize: '0.75rem',
            zIndex: 5
          }}
        >
          <IconButton 
            size="small" 
            onClick={toggleAutoPlay}
            sx={{ 
              color: 'white',
              p: 0.5, 
              mr: 0.5,
              '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } 
            }}
          >
            {isAutoPlayEnabled ? <PauseIcon fontSize="small" /> : <PlayArrowIcon fontSize="small" />}
          </IconButton>
          <Typography variant="caption">
            {isAutoPlayEnabled ? 'Авто' : 'Ручной'}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default SimpleImageGallery; 