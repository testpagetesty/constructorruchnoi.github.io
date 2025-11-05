import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Card, 
  CardContent, 
  Avatar, 
  Accordion, 
  AccordionSummary, 
  AccordionDetails,
  Chip,
  Alert,
  AlertTitle,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Slider,
  IconButton,
  CircularProgress,
  Divider
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import StarIcon from '@mui/icons-material/Star';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ScheduleIcon from '@mui/icons-material/Schedule';
import PendingIcon from '@mui/icons-material/Pending';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import EditableElementWrapper from './EditableElementWrapper';
import AnimationWrapper from './AnimationWrapper';
import AnimationControls from './AnimationControls';
import ColorPicker from '../ColorPicker/ColorPicker';
import ColorSettings from './TextComponents/ColorSettings';

// Карточка отзыва
export const TestimonialCard = ({ 
  name = 'Иван Иванов',
  role = 'Генеральный директор',
  company = 'ООО "Компания"',
  content = 'Отличный сервис! Рекомендую всем.',
  rating = 5,
  avatar = null,
  // Цветовые настройки
  nameColor = '#1976d2',
  roleColor = '#666666',
  companyColor = '#888888',
  contentColor = '#333333',
  backgroundColor = '#ffffff',
  borderColor = '#e0e0e0',
  colorSettings = {},
  cardId = null,
  animationSettings = {
    animationType: 'fadeIn',
    delay: 0,
    triggerOnView: true,
    triggerOnce: true,
    threshold: 0.1,
    disabled: false
  },
  isPreview = false,
  constructorMode = false,
  isEditing = false,
  onUpdate = () => {},
  onSave = null,
  onCancel = null
}) => {
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [localEditing, setLocalEditing] = useState(false);
  const [editData, setEditData] = useState({ 
    name, 
    role, 
    company, 
    content, 
    rating,
    avatar,
    nameColor,
    roleColor,
    companyColor,
    contentColor,
    backgroundColor,
    borderColor,
    colorSettings: colorSettings || {},
    cardId: cardId || `testimonial_${Date.now()}`,
    animationSettings: animationSettings || {
      animationType: 'fadeIn',
      delay: 0,
      triggerOnView: true,
      triggerOnce: true,
      threshold: 0.1,
      disabled: false
    }
  });

  const handleDoubleClick = () => {
    if (constructorMode) {
      setLocalEditing(true);
    }
  };

  const handleSave = () => {
    setLocalEditing(false);
    if (onSave) {
      onSave(editData);
    } else {
      onUpdate(editData);
    }
  };

  const handleCancel = () => {
    setLocalEditing(false);
    setEditData({ 
      name, 
      role, 
      company, 
      content, 
      rating, 
      avatar,
      nameColor,
      roleColor,
      companyColor,
      contentColor,
      backgroundColor,
      borderColor,
      colorSettings,
      cardId: cardId || `testimonial_${Date.now()}`,
      animationSettings 
    });
    if (onCancel) {
      onCancel();
    }
  };

  const handleAnimationUpdate = (newAnimationSettings) => {
    setEditData(prev => ({
      ...prev,
      animationSettings: newAnimationSettings
    }));
  };

  // Функция обработки загрузки изображения аватара
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError('');

    try {
      // Импортируем утилиты для обработки изображений
      const { processImageUpload } = await import('../../utils/imageConverter');
      const { imageCacheService } = await import('../../utils/imageCacheService');
      
      // Используем имя клиента для названия файла
      const testimonialName = editData.name || 'testimonial';
      
      console.log('Загрузка аватара для отзыва:', editData.cardId, 'клиент:', testimonialName);
      
      // Обрабатываем загрузку изображения (конвертация в JPG, оптимизация, уникальное имя)
      const result = await processImageUpload(file, editData.cardId, testimonialName);
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      // Сохраняем изображение в кеш
      await imageCacheService.saveImage(result.fileName, result.file);
      
      // Сохраняем расширенные метаданные
      const metadata = {
        fileName: result.fileName,
        originalName: result.originalName,
        originalType: result.originalType,
        testimonialName: testimonialName,
        cardId: editData.cardId,
        size: result.size,
        width: result.width,
        height: result.height,
        uploadDate: new Date().toISOString(),
        processed: true,
        format: 'jpg',
        type: 'testimonial-avatar'
      };
      
      console.log('Сохранение метаданных аватара:', metadata);
      await imageCacheService.saveMetadata(`testimonial-avatar-${result.fileName}`, metadata);
      
      // Получаем blob из кеша для создания URL
      const blob = await imageCacheService.getImage(result.fileName);
      const imageUrl = URL.createObjectURL(blob);
      
      // Обновляем локальное состояние
      setEditData(prev => ({
        ...prev,
        avatar: imageUrl,
        avatarFileName: result.fileName
      }));
      
      console.log('Аватар успешно обработан и загружен:', {
        fileName: result.fileName,
        originalName: result.originalName,
        size: result.size,
        dimensions: `${result.width}x${result.height}`,
        cardId: editData.cardId
      });
    } catch (error) {
      console.error('Ошибка при загрузке аватара:', error);
      setUploadError('Ошибка при загрузке изображения: ' + error.message);
    } finally {
      setIsUploading(false);
      // Очищаем input
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const isCurrentlyEditing = isEditing || localEditing;

  // 🔄 РЕАКТИВНОСТЬ: Обновляем локальные настройки при изменении colorSettings
  useEffect(() => {
    if (JSON.stringify(colorSettings) !== JSON.stringify(editData.colorSettings)) {
      console.log('🔄 [TestimonialCard] Обновление colorSettings:', colorSettings);
      setEditData(prev => ({
        ...prev,
        colorSettings: colorSettings || {}
      }));
    }
  }, [colorSettings]);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <StarIcon 
        key={i} 
        sx={{ 
          color: i < rating ? ratingColorFromSettings : '#e0e0e0',
          fontSize: '1.2rem'
        }} 
      />
    ));
  };

  if (isCurrentlyEditing) {
    return (
      <Paper sx={{ p: 3, mb: 2, border: '2px solid #1976d2' }}>
        <Typography variant="h6" color="primary" gutterBottom sx={{ mb: 3 }}>
          ⭐ Редактирование отзыва
        </Typography>
        
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageUpload}
          accept="image/*"
          style={{ display: 'none' }}
        />
        
        <Accordion defaultExpanded={true}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1">📝 Основная информация</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              {/* Аватар */}
              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>Аватар клиента:</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  {editData.avatar ? (
                    <Avatar src={editData.avatar} sx={{ width: 80, height: 80 }} />
                  ) : (
                    <Avatar sx={{ width: 80, height: 80, bgcolor: 'primary.main', fontSize: '2rem' }}>
                      {editData.name.charAt(0).toUpperCase()}
                    </Avatar>
                  )}
                  <Box>
                    <Button
                      variant="contained"
                      startIcon={isUploading ? <CircularProgress size={16} /> : <PhotoCameraIcon />}
                      onClick={handleUploadClick}
                      disabled={isUploading}
                      sx={{ mb: 1 }}
                    >
                      {isUploading ? 'Загрузка...' : 'Загрузить фото'}
                    </Button>
                    {uploadError && (
                      <Alert severity="error" sx={{ mt: 1 }}>
                        {uploadError}
                      </Alert>
                    )}
                    {editData.avatar && (
                      <Alert severity="success" sx={{ mt: 1 }}>
                        ✅ Изображение конвертировано в JPG и сохранено
                      </Alert>
                    )}
                  </Box>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Имя клиента"
                  value={editData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  variant="outlined"
                  size="small"
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Должность"
                  value={editData.role}
                  onChange={(e) => setEditData({ ...editData, role: e.target.value })}
                  variant="outlined"
                  size="small"
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Компания"
                  value={editData.company}
                  onChange={(e) => setEditData({ ...editData, company: e.target.value })}
                  variant="outlined"
                  size="small"
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Текст отзыва"
                  value={editData.content}
                  onChange={(e) => setEditData({ ...editData, content: e.target.value })}
                  variant="outlined"
                  multiline
                  rows={4}
                  size="small"
                />
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>
                  Рейтинг: {editData.rating} ⭐
                </Typography>
                <Slider
                  value={editData.rating}
                  onChange={(_, value) => setEditData({ ...editData, rating: value })}
                  min={1}
                  max={5}
                  step={0.5}
                  marks={[
                    { value: 1, label: '1' },
                    { value: 2, label: '2' },
                    { value: 3, label: '3' },
                    { value: 4, label: '4' },
                    { value: 5, label: '5' }
                  ]}
                  sx={{ width: '100%' }}
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* Настройки цветов */}
        <ColorSettings
          title="Настройки цветов отзыва"
          colorSettings={editData.colorSettings || {}}
          onUpdate={(newColorSettings) => setEditData({ ...editData, colorSettings: newColorSettings })}
          availableFields={[
            {
              name: 'name',
              label: 'Имя клиента',
              description: 'Цвет имени клиента',
              defaultColor: '#1976d2'
            },
            {
              name: 'role',
              label: 'Должность',
              description: 'Цвет должности',
              defaultColor: '#666666'
            },
            {
              name: 'company',
              label: 'Компания',
              description: 'Цвет названия компании',
              defaultColor: '#888888'
            },
            {
              name: 'content',
              label: 'Текст отзыва',
              description: 'Цвет текста отзыва',
              defaultColor: '#333333'
            },
            {
              name: 'rating',
              label: 'Звезды рейтинга',
              description: 'Цвет звезд рейтинга',
              defaultColor: '#ffc107'
            }
          ]}
          defaultColors={{
            textFields: {
              name: '#1976d2',
              role: '#666666',
              company: '#888888',
              content: '#333333',
              rating: '#ffc107'
            }
          }}
          hideCardBackground={true}
          hideAreaColors={true}
        />

        <Accordion defaultExpanded={false}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1">✨ Настройки анимации</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <AnimationControls
              animationSettings={editData.animationSettings}
              onUpdate={handleAnimationUpdate}
            />
          </AccordionDetails>
        </Accordion>

        <Divider sx={{ my: 3 }} />
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            startIcon={<CloudUploadIcon />}
          >
            💾 Сохранить
          </Button>
          <Button
            variant="outlined"
            onClick={handleCancel}
          >
            ❌ Отменить
          </Button>
        </Box>
      </Paper>
    );
  }

  // Применяем colorSettings если они есть
  const currentColorSettings = editData.colorSettings || {};
  const nameColorFromSettings = currentColorSettings.textFields?.name || currentColorSettings.textFields?.author || editData.nameColor || '#1976d2';
  const roleColorFromSettings = currentColorSettings.textFields?.role || currentColorSettings.textFields?.position || editData.roleColor || '#666666';
  const companyColorFromSettings = currentColorSettings.textFields?.company || editData.companyColor || '#888888';
  const contentColorFromSettings = currentColorSettings.textFields?.content || editData.contentColor || '#333333';
  const ratingColorFromSettings = currentColorSettings.textFields?.rating || '#ffc107';
  
  // Стили контейнера с фоном
  const containerStyles = { 
    mb: 2,
    display: 'flex',
    flexDirection: 'column',
    width: '100%'
  };
  
  // Применяем настройки фона из sectionBackground
  if (currentColorSettings.sectionBackground?.enabled) {
    const { sectionBackground } = currentColorSettings;
    if (sectionBackground.useGradient) {
      containerStyles.background = `linear-gradient(${sectionBackground.gradientDirection}, ${sectionBackground.gradientColor1}, ${sectionBackground.gradientColor2})`;
    } else {
      containerStyles.backgroundColor = sectionBackground.solidColor;
    }
    containerStyles.opacity = sectionBackground.opacity || 1;
  } else {
    containerStyles.backgroundColor = editData.backgroundColor || '#ffffff';
  }
  
  // Применяем настройки границы
  if (currentColorSettings.borderColor) {
    containerStyles.border = `${currentColorSettings.borderWidth || 1}px solid ${currentColorSettings.borderColor}`;
  }
  
  // Применяем радиус углов
  if (currentColorSettings.borderRadius !== undefined) {
    containerStyles.borderRadius = `${currentColorSettings.borderRadius}px`;
  } else {
    containerStyles.borderRadius = '8px';
  }
  
  // Применяем внутренние отступы
  if (currentColorSettings.padding !== undefined) {
    containerStyles.padding = `${currentColorSettings.padding}px`;
  } else {
    containerStyles.padding = '16px';
  }
  
  // Применяем тень
  if (currentColorSettings.boxShadow) {
    containerStyles.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
  }

  return (
    <EditableElementWrapper 
      editable={constructorMode} 
      onStartEdit={handleDoubleClick}
      isEditing={isCurrentlyEditing}
    >
      <AnimationWrapper {...editData.animationSettings}>
        <Box sx={containerStyles}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            {editData.avatar ? (
              <Avatar src={editData.avatar} sx={{ mr: 2, width: 60, height: 60 }} />
            ) : (
              <Avatar 
                sx={{ 
                  mr: 2, 
                  width: 60, 
                  height: 60,
                  bgcolor: 'primary.main',
                  fontSize: '1.5rem'
                }}
              >
                {editData.name.charAt(0).toUpperCase()}
              </Avatar>
            )}
            <Box>
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 0.5,
                  color: nameColorFromSettings,
                  fontWeight: 'bold'
                }}
              >
                {editData.name}
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  mb: 0.5,
                  color: roleColorFromSettings
                }}
              >
                {editData.role}
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: companyColorFromSettings
                }}
              >
                {editData.company}
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ mb: 2 }}>
            {renderStars(editData.rating)}
          </Box>
          
          <Typography 
            variant="body1" 
            sx={{ 
              fontStyle: 'italic',
              lineHeight: 1.6,
              color: contentColorFromSettings
            }}
          >
            "{editData.content}"
          </Typography>
        </Box>
      </AnimationWrapper>
    </EditableElementWrapper>
  );
};

// FAQ секция
export const FAQSection = ({ 
  title = 'Часто задаваемые вопросы',
  items = [
    { question: 'Как это работает?', answer: 'Очень просто и эффективно.' },
    { question: 'Сколько это стоит?', answer: 'Цены очень доступные.' }
  ],
  
  // Настройки цветов через ColorSettings
  colorSettings = {},
  
  animationSettings = {
    animationType: 'fadeIn',
    delay: 0,
    triggerOnView: true,
    triggerOnce: true,
    threshold: 0.1,
    disabled: false
  },
  isPreview = false,
  constructorMode = false,
  isEditing = false,
  onUpdate = () => {},
  onSave = null,
  onCancel = null
}) => {
  // Добавляем логирование для отладки
  console.log('[FAQSection] Received props:', { title, items, isPreview, constructorMode, isEditing });
  const [localEditing, setLocalEditing] = useState(false);
  const [editData, setEditData] = useState({ 
    title, 
    items,
    colorSettings: colorSettings || {},
    animationSettings: animationSettings || {
      animationType: 'fadeIn',
      delay: 0,
      triggerOnView: true,
      triggerOnce: true,
      threshold: 0.1,
      disabled: false
    }
  });

  const handleDoubleClick = () => {
    if (constructorMode) {
      setLocalEditing(true);
    }
  };

  const handleSave = () => {
    setLocalEditing(false);
    if (onSave) {
      onSave(editData);
    } else {
      onUpdate(editData);
    }
  };

  const handleCancel = () => {
    setLocalEditing(false);
    setEditData({ 
      title, items, colorSettings, animationSettings 
    });
    if (onCancel) {
      onCancel();
    }
  };

  const handleAnimationUpdate = (newAnimationSettings) => {
    setEditData(prev => ({
      ...prev,
      animationSettings: newAnimationSettings
    }));
  };





  const isCurrentlyEditing = isEditing || localEditing;

  // 🔄 РЕАКТИВНОСТЬ: Обновляем локальные настройки при изменении colorSettings
  useEffect(() => {
    if (JSON.stringify(colorSettings) !== JSON.stringify(editData.colorSettings)) {
      console.log('🔄 [FAQSection] Обновление colorSettings:', colorSettings);
      setEditData(prev => ({
        ...prev,
        colorSettings: colorSettings || {}
      }));
    }
  }, [colorSettings]);

  const addItem = () => {
    setEditData({
      ...editData,
      items: [...editData.items, { question: 'Новый вопрос?', answer: 'Ответ на вопрос' }]
    });
  };

  const handleColorUpdate = (newColorSettings) => {
    setEditData(prev => ({
      ...prev,
      colorSettings: newColorSettings
    }));
  };

  const removeItem = (index) => {
    setEditData({
      ...editData,
      items: editData.items.filter((_, i) => i !== index)
    });
  };

  const updateItem = (index, field, value) => {
    setEditData({
      ...editData,
      items: editData.items.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    });
  };

  if (isCurrentlyEditing) {
    return (
      <Paper 
        sx={{ 
          p: `${editData.colorSettings?.padding || 20}px`,
          mb: 2,
          borderRadius: `${editData.colorSettings?.borderRadius || 8}px`,
          ...(editData.colorSettings?.sectionBackground?.enabled ? {
            ...(editData.colorSettings.sectionBackground.useGradient ? {
              background: `linear-gradient(${editData.colorSettings.sectionBackground.gradientDirection}, ${editData.colorSettings.sectionBackground.gradientColor1}, ${editData.colorSettings.sectionBackground.gradientColor2})`
            } : {
              backgroundColor: editData.colorSettings.sectionBackground.solidColor
            }),
            opacity: editData.colorSettings.sectionBackground.opacity
          } : {}),
          ...(editData.colorSettings?.borderColor ? { 
            border: `${editData.colorSettings.borderWidth || 1}px solid ${editData.colorSettings.borderColor}` 
          } : { border: '1px solid #e0e0e0' }),
          ...(editData.colorSettings?.boxShadow ? { boxShadow: '0 2px 8px rgba(0,0,0,0.1)' } : {})
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
            Редактирование FAQ секции
          </Typography>
          
          {/* Основные настройки */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>Основные настройки:</Typography>
            
            <TextField
              label="Заголовок секции"
              value={editData.title}
              onChange={(e) => setEditData({ ...editData, title: e.target.value })}
              fullWidth
              size="small"
              sx={{ mb: 2 }}
            />
          </Box>

          {/* Настройки вопросов и ответов */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>Вопросы и ответы:</Typography>
            
            {editData.items.map((item, index) => (
              <Paper key={index} sx={{ p: 2, mb: 2, border: '1px solid #e0e0e0' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body2" color="primary">
                    Вопрос {index + 1}
                  </Typography>
                  <IconButton 
                    size="small" 
                    color="error" 
                    onClick={() => removeItem(index)}
                    disabled={editData.items.length <= 1}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
                
                <TextField
                  label="Вопрос"
                  value={item.question}
                  onChange={(e) => updateItem(index, 'question', e.target.value)}
                  fullWidth
                  size="small"
                  sx={{ mb: 1 }}
                />
                
                <TextField
                  label="Ответ"
                  value={item.answer}
                  onChange={(e) => updateItem(index, 'answer', e.target.value)}
                  fullWidth
                  multiline
                  rows={3}
                  size="small"
                />
              </Paper>
            ))}
            
            <Button
              startIcon={<AddIcon />}
              onClick={addItem}
              variant="outlined"
              size="small"
              sx={{ mt: 1 }}
            >
              Добавить вопрос
            </Button>
          </Box>









          {/* Настройки цветов */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>Настройки цветов:</Typography>
            <ColorSettings
              title="Настройки цветов FAQ секции"
              colorSettings={editData.colorSettings}
              onUpdate={handleColorUpdate}
              availableFields={[
                {
                  name: 'title',
                  label: 'Цвет заголовка',
                  description: 'Цвет заголовка FAQ секции',
                  defaultColor: '#333333'
                },
                {
                  name: 'question',
                  label: 'Цвет вопросов',
                  description: 'Цвет текста вопросов',
                  defaultColor: '#1976d2'
                },
                {
                  name: 'answer',
                  label: 'Цвет ответов',
                  description: 'Цвет текста ответов',
                  defaultColor: '#666666'
                },
                {
                  name: 'icon',
                  label: 'Цвет иконок',
                  description: 'Цвет иконок аккордеона',
                  defaultColor: '#1976d2'
                },
                {
                  name: 'accordionBg',
                  label: 'Цвет фона аккордеона',
                  description: 'Цвет фона элементов аккордеона',
                  defaultColor: '#fafafa'
                },
                {
                  name: 'accordionHover',
                  label: 'Цвет при наведении',
                  description: 'Цвет фона при наведении на аккордеон',
                  defaultColor: '#f0f0f0'
                }
              ]}
              defaultColors={{
                title: '#333333',
                question: '#1976d2',
                answer: '#666666',
                icon: '#1976d2',
                accordionBg: '#fafafa',
                accordionHover: '#f0f0f0'
              }}
              hideCardBackground={true}
              hideAreaColors={true}
            />
          </Box>

          {/* Настройки анимации */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>Настройки анимации:</Typography>
            <AnimationControls
              animationSettings={editData.animationSettings}
              onUpdate={handleAnimationUpdate}
            />
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="contained" onClick={handleSave}>
              Сохранить
            </Button>
            <Button variant="outlined" onClick={handleCancel}>
              Отменить
            </Button>
          </Box>
        </Box>
      </Paper>
    );
  }

  return (
    <EditableElementWrapper 
      editable={constructorMode} 
      onStartEdit={handleDoubleClick}
      isEditing={isCurrentlyEditing}
    >
      <AnimationWrapper {...editData.animationSettings}>
        <Paper 
          sx={{ 
            p: `${editData.colorSettings?.padding || 20}px`,
            mb: 2,
            borderRadius: `${editData.colorSettings?.borderRadius || 8}px`,
            ...(editData.colorSettings?.sectionBackground?.enabled ? {
              ...(editData.colorSettings.sectionBackground.useGradient ? {
                background: `linear-gradient(${editData.colorSettings.sectionBackground.gradientDirection}, ${editData.colorSettings.sectionBackground.gradientColor1}, ${editData.colorSettings.sectionBackground.gradientColor2})`
              } : {
                backgroundColor: editData.colorSettings.sectionBackground.solidColor
              }),
              opacity: editData.colorSettings.sectionBackground.opacity
            } : {}),
            ...(editData.colorSettings?.borderColor ? { 
              border: `${editData.colorSettings.borderWidth || 1}px solid ${editData.colorSettings.borderColor}` 
            } : { border: '1px solid #e0e0e0' }),
            ...(editData.colorSettings?.boxShadow ? { boxShadow: '0 2px 8px rgba(0,0,0,0.1)' } : {})
          }}
        >
          <Typography 
            variant="h4" 
            sx={{ 
              mb: 3,
              color: editData.colorSettings?.textFields?.title || '#333333',
              textAlign: 'center',
              fontWeight: 'bold'
            }}
          >
            {editData.title || title}
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {(editData.items || items).map((item, index) => (
              <Accordion 
                key={index}
                sx={{
                  backgroundColor: editData.colorSettings?.textFields?.accordionBg || '#fafafa',
                  borderRadius: `${(editData.colorSettings?.borderRadius || 8) / 2}px !important`,
                  '&:hover': {
                    backgroundColor: editData.colorSettings?.textFields?.accordionHover || '#f0f0f0'
                  },
                  '&:before': {
                    display: 'none'
                  },
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  mb: 1
                }}
              >
                <AccordionSummary 
                  expandIcon={
                    <ExpandMoreIcon 
                      sx={{ 
                        color: editData.colorSettings?.textFields?.icon || '#1976d2',
                        fontSize: '1.5rem'
                      }} 
                    />
                  }
                  sx={{
                    borderRadius: `${(editData.colorSettings?.borderRadius || 8) / 2}px`,
                    '&:hover': {
                      backgroundColor: 'rgba(0,0,0,0.04)'
                    }
                  }}
                >
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: editData.colorSettings?.textFields?.question || '#1976d2',
                      fontWeight: 'medium'
                    }}
                  >
                    {item.question}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: editData.colorSettings?.textFields?.answer || '#666666',
                      lineHeight: 1.6
                    }}
                  >
                    {item.answer}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </Paper>
      </AnimationWrapper>
    </EditableElementWrapper>
  );
};

// Временная шкала
export const TimelineComponent = ({ 
  title: propTitle,
  events: propEvents,
  items: propItems, // Для совместимости с AI парсером
  title = propTitle || 'Временная шкала',
  events = propEvents || propItems || [
    { date: '2024', title: 'Запуск проекта', description: 'Начало разработки', status: 'completed' },
    { date: '2024', title: 'Тестирование', description: 'Проверка функций', status: 'in-progress' },
    { date: '2024', title: 'Релиз', description: 'Публикация', status: 'pending' }
  ],
  // Цветовые настройки через ColorSettings
  colorSettings = {},
  
  animationSettings = {
    animationType: 'fadeIn',
    delay: 0,
    triggerOnView: true,
    triggerOnce: true,
    threshold: 0.1,
    disabled: false
  },
  isPreview = false,
  constructorMode = false,
  isConstructorMode = false,
  isEditing = false,
  onUpdate = () => {},
  onSave = null,
  onCancel = null
}) => {
  // Добавляем логирование для отладки
  console.log('[TimelineComponent] Received props:', { 
    propTitle, 
    propEvents, 
    propItems,
    title,
    events,
    isPreview,
    constructorMode 
  });

  const [localEditing, setLocalEditing] = useState(false);
  const [editData, setEditData] = useState({ 
    title, 
    events, 
    colorSettings: colorSettings || {},
    animationSettings: animationSettings || {
      animationType: 'fadeIn',
      delay: 0,
      triggerOnView: true,
      triggerOnce: true,
      threshold: 0.1,
      disabled: false
    }
  });

  const handleDoubleClick = () => {
    if (constructorMode) {
      setLocalEditing(true);
    }
  };

  const handleSave = () => {
    setLocalEditing(false);
    if (onSave) {
      onSave(editData);
    } else {
      onUpdate(editData);
    }
  };

  const handleCancel = () => {
    setLocalEditing(false);
    setEditData({ 
      title, 
      events, 
      colorSettings: colorSettings || {},
      animationSettings 
    });
    if (onCancel) {
      onCancel();
    }
  };

  const handleAnimationUpdate = (newAnimationSettings) => {
    setEditData(prev => ({
      ...prev,
      animationSettings: newAnimationSettings
    }));
  };

  const isCurrentlyEditing = isEditing || localEditing;

  // 🔄 РЕАКТИВНОСТЬ: Обновляем локальные настройки при изменении colorSettings
  useEffect(() => {
    if (JSON.stringify(colorSettings) !== JSON.stringify(editData.colorSettings)) {
      console.log('🔄 [TimelineComponent] Обновление colorSettings:', colorSettings);
      setEditData(prev => ({
        ...prev,
        colorSettings: colorSettings || {}
      }));
    }
  }, [colorSettings]);

  const getStatusIcon = (status) => {
    const statusColors = {
      completed: editData.colorSettings?.textFields?.completed || '#4caf50',
      'in-progress': editData.colorSettings?.textFields?.inProgress || '#ff9800',
      pending: editData.colorSettings?.textFields?.pending || '#2196f3'
    };
    
    switch (status) {
      case 'completed':
        return <CheckCircleIcon sx={{ color: statusColors.completed }} />;
      case 'in-progress':
        return <ScheduleIcon sx={{ color: statusColors['in-progress'] }} />;
      case 'pending':
        return <PendingIcon sx={{ color: statusColors.pending }} />;
      default:
        return <PendingIcon sx={{ color: 'grey.500' }} />;
    }
  };

  const getStatusColor = (status) => {
    const statusColors = {
      completed: editData.colorSettings?.textFields?.completed || '#4caf50',
      'in-progress': editData.colorSettings?.textFields?.inProgress || '#ff9800',
      pending: editData.colorSettings?.textFields?.pending || '#2196f3'
    };
    
    switch (status) {
      case 'completed':
        return statusColors.completed;
      case 'in-progress':
        return statusColors['in-progress'];
      case 'pending':
        return statusColors.pending;
      default:
        return 'grey.500';
    }
  };

  // Обработчик обновления цветовых настроек
  const handleColorUpdate = (newColorSettings) => {
    setEditData(prev => ({
      ...prev,
      colorSettings: newColorSettings
    }));
  };

  if (isCurrentlyEditing) {
    return (
      <Paper sx={{ p: 3, mb: 2, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
            Редактирование временной шкалы
          </Typography>
          
          {/* Основные настройки */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>Основные настройки:</Typography>
            
            <TextField
              label="Заголовок временной шкалы"
              value={editData.title}
              onChange={(e) => setEditData({ ...editData, title: e.target.value })}
              fullWidth
              size="small"
              sx={{ mb: 2 }}
            />
          </Box>

          {/* Настройки событий */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>События временной шкалы:</Typography>
            
            <TextField
              label="События (формат: Дата|Название|Описание|Статус)"
              value={editData.events.map(event => `${event.date}|${event.title}|${event.description}|${event.status}`).join('\n')}
              onChange={(e) => {
                const events = e.target.value.split('\n').map(line => {
                  const [date, title, description, status] = line.split('|');
                  return { 
                    date: date || '', 
                    title: title || '', 
                    description: description || '', 
                    status: status || 'pending' 
                  };
                });
                setEditData({ ...editData, events });
              }}
              placeholder="Дата|Название|Описание|Статус\n2024|Событие|Описание|completed"
              fullWidth
              multiline
              rows={6}
              size="small"
              helperText="Каждое событие на новой строке. Статус: completed, in-progress, pending"
            />
          </Box>

          {/* Настройки цветов */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>Настройки цветов:</Typography>
            <ColorSettings
              title="Настройки цветов временной шкалы"
              colorSettings={editData.colorSettings}
              onUpdate={handleColorUpdate}
              availableFields={[
                { name: 'title', label: 'Заголовок', description: 'Цвет заголовка временной шкалы', defaultColor: '#000000' },
                { name: 'date', label: 'Дата', description: 'Цвет даты события', defaultColor: '#666666' },
                { name: 'text', label: 'Текст', description: 'Цвет основного текста события', defaultColor: '#333333' },
                { name: 'line', label: 'Линия', description: 'Цвет соединительной линии между событиями', defaultColor: '#e0e0e0' },
                { name: 'completed', label: 'Завершено', description: 'Цвет для завершенных событий', defaultColor: '#4caf50' },
                { name: 'inProgress', label: 'В процессе', description: 'Цвет для событий в процессе', defaultColor: '#ff9800' },
                { name: 'pending', label: 'Ожидание', description: 'Цвет для ожидающих событий', defaultColor: '#2196f3' }
              ]}
              defaultColors={{
                title: '#000000',
                date: '#666666',
                text: '#333333',
                line: '#e0e0e0',
                completed: '#4caf50',
                inProgress: '#ff9800',
                pending: '#2196f3'
              }}
              hideCardBackground={true}
              hideAreaColors={true}
            />
          </Box>

          {/* Настройки анимации */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>Настройки анимации:</Typography>
            <AnimationControls
              animationSettings={editData.animationSettings}
              onUpdate={handleAnimationUpdate}
            />
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="contained" onClick={handleSave}>
              Сохранить
            </Button>
            <Button variant="outlined" onClick={handleCancel}>
              Отменить
            </Button>
          </Box>
        </Box>
      </Paper>
    );
  }

  return (
    <EditableElementWrapper 
      editable={constructorMode} 
      onStartEdit={handleDoubleClick}
      isEditing={isCurrentlyEditing}
    >
      <AnimationWrapper {...editData.animationSettings}>
        <Paper sx={{ 
          p: `${editData.colorSettings?.padding || 20}px`,
          mb: 2,
          borderRadius: `${editData.colorSettings?.borderRadius || 8}px`,
          ...(editData.colorSettings?.sectionBackground?.enabled ? {
            ...(editData.colorSettings.sectionBackground.useGradient ? {
              background: `linear-gradient(${editData.colorSettings.sectionBackground.gradientDirection}, ${editData.colorSettings.sectionBackground.gradientColor1}, ${editData.colorSettings.sectionBackground.gradientColor2})`
            } : {
              backgroundColor: editData.colorSettings.sectionBackground.solidColor
            }),
            opacity: editData.colorSettings.sectionBackground.opacity
          } : {}),
          ...(editData.colorSettings?.borderColor ? { 
            border: `${editData.colorSettings.borderWidth || 1}px solid ${editData.colorSettings.borderColor}` 
          } : { border: '1px solid #e0e0e0' }),
          ...(editData.colorSettings?.boxShadow ? { boxShadow: '0 2px 8px rgba(0,0,0,0.1)' } : {})
        }}>
          <Typography variant="h4" sx={{ 
            mb: 3, 
            textAlign: 'center', 
            color: editData.colorSettings?.textFields?.title || '#000000',
            fontWeight: 'bold'
          }}>
            {editData.title || title}
          </Typography>
          <Box sx={{ position: 'relative' }}>
            {(editData.events || events).map((event, index) => (
              <Box key={index} sx={{ display: 'flex', mb: 3 }}>
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  mr: 2 
                }}>
                  {getStatusIcon(event.status)}
                  {index < (editData.events || events).length - 1 && (
                    <Box sx={{ 
                      width: 2, 
                      height: 40, 
                      bgcolor: editData.colorSettings?.textFields?.line || '#e0e0e0',
                      mt: 1
                    }} />
                  )}
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Typography variant="h6" sx={{ 
                      mr: 1, 
                      color: editData.colorSettings?.textFields?.text || '#333333',
                      fontWeight: 'medium'
                    }}>
                      {event.title}
                    </Typography>
                    <Chip 
                      label={event.status} 
                      sx={{ 
                        backgroundColor: getStatusColor(event.status),
                        color: '#ffffff',
                        fontWeight: 'medium'
                      }}
                      size="small"
                    />
                  </Box>
                  <Typography variant="body2" sx={{ 
                    mb: 1, 
                    color: editData.colorSettings?.textFields?.date || '#666666',
                    fontWeight: '500'
                  }}>
                    {event.date}
                  </Typography>
                  <Typography variant="body1" sx={{ 
                    color: editData.colorSettings?.textFields?.text || '#333333',
                    lineHeight: 1.6
                  }}>
                    {event.description}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Paper>
      </AnimationWrapper>
    </EditableElementWrapper>
  );
};

// Компонент уведомлений
export const AlertComponent = ({ 
  title = 'Внимание!',
  message = 'Это важное уведомление',
  type = 'info',
  showIcon = true,
  animationSettings = {
    animationType: 'fadeIn',
    delay: 0,
    triggerOnView: true,
    triggerOnce: true,
    threshold: 0.1,
    disabled: false
  },
  isPreview = false,
  constructorMode = false,
  isEditing = false,
  onUpdate = () => {},
  onSave = null,
  onCancel = null
}) => {
  const [localEditing, setLocalEditing] = useState(false);
  const [editData, setEditData] = useState({ 
    title, 
    message, 
    type, 
    showIcon, 
    animationSettings: animationSettings || {
      animationType: 'fadeIn',
      delay: 0,
      triggerOnView: true,
      triggerOnce: true,
      threshold: 0.1,
      disabled: false
    }
  });

  const handleDoubleClick = () => {
    if (constructorMode) {
      setLocalEditing(true);
    }
  };

  const handleSave = () => {
    setLocalEditing(false);
    if (onSave) {
      onSave(editData);
    } else {
      onUpdate(editData);
    }
  };

  const handleCancel = () => {
    setLocalEditing(false);
    setEditData({ title, message, type, showIcon, animationSettings });
    if (onCancel) {
      onCancel();
    }
  };

  const handleAnimationUpdate = (newAnimationSettings) => {
    setEditData(prev => ({
      ...prev,
      animationSettings: newAnimationSettings
    }));
  };

  const isCurrentlyEditing = isEditing || localEditing;

  if (isCurrentlyEditing) {
    return (
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <input
            type="text"
            value={editData.title}
            onChange={(e) => setEditData({ ...editData, title: e.target.value })}
            placeholder="Заголовок"
            style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
          />
          <textarea
            value={editData.message}
            onChange={(e) => setEditData({ ...editData, message: e.target.value })}
            placeholder="Сообщение"
            style={{ width: '100%', minHeight: '80px', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
          />
          <select
            value={editData.type}
            onChange={(e) => setEditData({ ...editData, type: e.target.value })}
            style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
          >
            <option value="info">Информация</option>
            <option value="warning">Предупреждение</option>
            <option value="error">Ошибка</option>
            <option value="success">Успех</option>
          </select>
          <label>
            <input
              type="checkbox"
              checked={editData.showIcon}
              onChange={(e) => setEditData({ ...editData, showIcon: e.target.checked })}
            />
            Показывать иконку
          </label>
          
          {constructorMode && (
            <AnimationControls
              animationSettings={editData.animationSettings}
              onUpdate={handleAnimationUpdate}
            />
          )}
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <button onClick={handleSave} style={{ flex: 1, padding: '8px', backgroundColor: '#4caf50', color: 'white', border: 'none', borderRadius: '4px' }}>
              Сохранить
            </button>
            <button onClick={handleCancel} style={{ flex: 1, padding: '8px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px' }}>
              Отмена
            </button>
          </Box>
        </Box>
      </Paper>
    );
  }

  return (
    <EditableElementWrapper 
      editable={constructorMode} 
      onStartEdit={handleDoubleClick}
      isEditing={isCurrentlyEditing}
    >
      <AnimationWrapper {...editData.animationSettings}>
        <Alert 
          severity={type} 
          sx={{ mb: 2 }}
          icon={showIcon ? undefined : false}
        >
          <AlertTitle>{title}</AlertTitle>
          {message}
        </Alert>
      </AnimationWrapper>
    </EditableElementWrapper>
  );
}; 

// Галерея изображений
export const ImageGallery = ({ 
  title = 'Галерея изображений',
  description = 'Просмотрите нашу коллекцию изображений',
  images = [],
  // Настройки размера
  galleryHeight = 400,
  galleryWidth = '100%',
  thumbnailSize = 80,
  // Настройки цветов через ColorSettings
  colorSettings = {},
  // Настройки слайдера
  slidesPerView = 1,
  spaceBetween = 20,
  showThumbnails = true,
  showNavigation = true,
  showPagination = true,
  autoplay = false,
  autoplayDelay = 3000,
  sectionId = null,
  animationSettings = {
    animationType: 'fadeIn',
    delay: 0,
    triggerOnView: true,
    triggerOnce: true,
    threshold: 0.1,
    disabled: false
  },
  isPreview = false,
  constructorMode = false,
  isEditing = false,
  onUpdate = () => {},
  onSave = null,
  onCancel = null
}) => {
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [localEditing, setLocalEditing] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  
  // Функция для генерации уникального sectionId
  const generateUniqueSectionId = () => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `gallery_${timestamp}_${random}`;
  };

  // Функция для очистки старого кеша галереи
  const clearOldGalleryCache = (oldSectionId) => {
    if (!oldSectionId) return;
    
    try {
      const allKeys = Object.keys(localStorage);
      const galleryKeys = allKeys.filter(key => 
        key.startsWith('gallery-image-') && 
        key.includes(oldSectionId)
      );
      
      galleryKeys.forEach(key => {
        localStorage.removeItem(key);
        console.log(`🗑️ Удален старый кеш: ${key}`);
      });
    } catch (error) {
      console.warn('Ошибка при очистке старого кеша:', error);
    }
  };

  // Функция для полной очистки кеша галереи
  const clearAllGalleryCache = () => {
    try {
      const allKeys = Object.keys(localStorage);
      const galleryKeys = allKeys.filter(key => key.startsWith('gallery-image-'));
      
      console.log(`🗑️ Найдено ${galleryKeys.length} ключей галереи для очистки`);
      
      galleryKeys.forEach(key => {
        localStorage.removeItem(key);
        console.log(`🗑️ Удален кеш: ${key}`);
      });
      
      console.log('✅ Кеш галереи полностью очищен');
    } catch (error) {
      console.warn('Ошибка при очистке кеша галереи:', error);
    }
  };
  
  const [editData, setEditData] = useState({ 
    title,
    description,
    images,
    galleryHeight,
    galleryWidth,
    thumbnailSize,
    slidesPerView,
    spaceBetween,
    showThumbnails,
    showNavigation,
    showPagination,
    autoplay,
    autoplayDelay,
    sectionId: sectionId || generateUniqueSectionId(),
    colorSettings: colorSettings || {},
    animationSettings: animationSettings || {
      animationType: 'fadeIn',
      delay: 0,
      triggerOnView: true,
      triggerOnce: true,
      threshold: 0.1,
      disabled: false
    }
  });

  const handleDoubleClick = () => {
    if (constructorMode) {
      setLocalEditing(true);
    }
  };

  const handleSave = () => {
    console.log('💾 Сохранение галереи изображений');
    console.log('📋 editData перед сохранением:', editData);
    
    setLocalEditing(false);
    
    const oldSectionId = editData.sectionId;
    const newSectionId = editData.sectionId || generateUniqueSectionId();
    
    console.log('🆔 oldSectionId:', oldSectionId);
    console.log('🆔 newSectionId:', newSectionId);
    
    // Если sectionId изменился, очищаем старый кеш
    if (oldSectionId && oldSectionId !== newSectionId) {
      clearOldGalleryCache(oldSectionId);
    }
    
    // НЕ очищаем весь кеш при сохранении - это удаляет изображения!
    console.log('💾 Сохраняем галерею БЕЗ очистки кеша');
    
    // Если sectionId еще не установлен, генерируем уникальный
    const dataToSave = {
      ...editData,
      sectionId: newSectionId
    };
    
    console.log('💾 dataToSave:', dataToSave);
    console.log('📞 onSave:', onSave);
    console.log('📞 onUpdate:', onUpdate);
    
    if (onSave) {
      console.log('💾 Вызываем onSave');
      onSave(dataToSave);
    } else {
      console.log('💾 Вызываем onUpdate');
      onUpdate(dataToSave);
    }
  };

  const handleCancel = () => {
    setLocalEditing(false);
    setEditData({ 
      title,
      description,
      images,
      galleryHeight,
      galleryWidth,
      thumbnailSize,
      slidesPerView,
      spaceBetween,
      showThumbnails,
      showNavigation,
      showPagination,
      autoplay,
      autoplayDelay,
      sectionId: sectionId || generateUniqueSectionId(),
      colorSettings: colorSettings || {},
      animationSettings 
    });
    if (onCancel) {
      onCancel();
    }
  };

  const handleAnimationUpdate = (newAnimationSettings) => {
    setEditData(prev => ({
      ...prev,
      animationSettings: newAnimationSettings
    }));
  };

  const handleColorUpdate = (newColorSettings) => {
    setEditData(prev => ({
      ...prev,
      colorSettings: newColorSettings
    }));
  };

  // Функция обработки загрузки изображений
  const handleImagesUpload = async (event) => {
    const files = Array.from(event.target.files);
    console.log('📁 Файлы для загрузки:', files);
    if (!files.length) {
      console.log('❌ Нет файлов для загрузки');
      return;
    }

    setIsUploading(true);
    setUploadError('');

    try {
      // Импортируем утилиты для обработки изображений
      console.log('📦 Импортируем утилиты...');
      const { processImageUpload } = await import('../../utils/imageConverter');
      const { imageCacheService } = await import('../../utils/imageCacheService');
      console.log('✅ Утилиты импортированы');
      
      const galleryName = editData.title || 'gallery';
      const processedImages = [];
      
      console.log('📋 Название галереи:', galleryName);
      console.log('📋 Текущий editData:', editData);
      
                              // НЕ очищаем весь кеш перед загрузкой - это удаляет существующие изображения!
                        console.log('📁 Загружаем новые изображения БЕЗ очистки кеша');
      
      // Убеждаемся, что у галереи есть уникальный sectionId
      const oldSectionId = editData.sectionId;
      const currentSectionId = editData.sectionId || generateUniqueSectionId();
      
      // Если sectionId изменился, очищаем старый кеш
      if (oldSectionId && oldSectionId !== currentSectionId) {
        clearOldGalleryCache(oldSectionId);
      }
      
      if (!editData.sectionId) {
        setEditData(prev => ({ ...prev, sectionId: currentSectionId }));
      }
      
      console.log(`Загрузка ${files.length} изображений для галереи:`, currentSectionId);
      
      // Обрабатываем каждое изображение
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Генерируем уникальное имя с timestamp и порядковым номером
        const imageNumber = editData.images.length + i + 1;
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2, 8);
        const microTimestamp = performance.now().toString().replace('.', '');
        const imageName = `gallery_${timestamp}_${microTimestamp}_${random}_${imageNumber}`;
        
        console.log(`Обработка изображения ${i + 1}/${files.length}:`, imageName);
        
        // Обрабатываем загрузку изображения (конвертация в JPG, оптимизация, уникальное имя)
        console.log(`🖼️ Обрабатываем изображение ${i + 1}/${files.length}:`, file.name);
        console.log(`🖼️ Параметры: sectionId=${currentSectionId}, imageName=${imageName}`);
        
        const result = await processImageUpload(file, currentSectionId, imageName);
        console.log(`🖼️ Результат обработки:`, result);
        
        if (!result.success) {
          console.error(`❌ Ошибка обработки изображения ${i + 1}:`, result.error);
          throw new Error(`Ошибка обработки изображения ${i + 1}: ${result.error}`);
        }
        
        // Сохраняем изображение в кеш
        console.log(`💾 Сохраняем изображение в кеш: ${result.fileName}`);
        await imageCacheService.saveImage(result.fileName, result.file);
        console.log(`✅ Изображение сохранено в кеш`);
        
        // Сохраняем расширенные метаданные
        const metadata = {
          fileName: result.fileName,
          originalName: result.originalName,
          originalType: result.originalType,
          galleryName: galleryName,
          sectionId: currentSectionId,
          imageNumber: imageNumber,
          size: result.size,
          width: result.width,
          height: result.height,
          uploadDate: new Date().toISOString(),
          processed: true,
          format: 'jpg',
          type: 'gallery-image'
        };
        
        console.log('📋 Метаданные изображения галереи:', metadata);
        const metadataKey = `gallery-image-${result.fileName}`;
        console.log('🔑 Ключ метаданных:', metadataKey);
        await imageCacheService.saveMetadata(metadataKey, metadata);
        console.log(`✅ Метаданные сохранены`);
        
        // Получаем blob из кеша для создания URL
        console.log(`🔍 Получаем blob из кеша: ${result.fileName}`);
        const blob = await imageCacheService.getImage(result.fileName);
        console.log(`📦 Blob получен:`, blob);
        
        const imageUrl = URL.createObjectURL(blob);
        console.log(`🔗 URL создан:`, imageUrl);
        
        const imageObject = {
          id: Date.now() + i,
          key: metadataKey, // Сохраняем ключ для экспорта
          url: imageUrl,
          fileName: result.fileName,
          alt: imageName,
          title: imageName,
          description: '',
          originalName: result.originalName,
          size: result.size,
          dimensions: `${result.width}x${result.height}`
        };
        
        console.log('📸 Создан объект изображения для галереи:', imageObject);
        processedImages.push(imageObject);
        console.log(`✅ Изображение ${i + 1} добавлено в processedImages`);
      }
      
      // Обновляем локальное состояние
      console.log(`🔄 Обновляем editData с ${processedImages.length} новыми изображениями`);
      console.log(`📋 Текущие изображения в editData:`, editData.images);
      console.log(`📋 Новые изображения:`, processedImages);
      
      setEditData(prev => {
        const newState = {
        ...prev,
        images: [...prev.images, ...processedImages]
        };
        console.log(`🔄 Новое состояние editData:`, newState);
        return newState;
      });
      
      console.log(`✅ Успешно обработано и загружено ${processedImages.length} изображений`);
    } catch (error) {
      console.error('Ошибка при загрузке изображений:', error);
      setUploadError('Ошибка при загрузке изображений: ' + error.message);
    } finally {
      setIsUploading(false);
      // Очищаем input
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  const handleUploadClick = () => {
    console.log('🖱️ Клик по кнопке загрузки изображений в галерее');
    console.log('📁 fileInputRef.current:', fileInputRef.current);
    console.log('📁 editData:', editData);
    fileInputRef.current?.click();
  };

  const handleRemoveImage = (imageIndex) => {
    setEditData(prev => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== imageIndex)
    }));
  };

  const isCurrentlyEditing = isEditing || localEditing;

  // 🔄 РЕАКТИВНОСТЬ: Обновляем локальные настройки при изменении colorSettings
  useEffect(() => {
    if (JSON.stringify(colorSettings) !== JSON.stringify(editData.colorSettings)) {
      console.log('🔄 [ImageGallery] Обновление colorSettings:', colorSettings);
      setEditData(prev => ({
        ...prev,
        colorSettings: colorSettings || {}
      }));
    }
  }, [colorSettings]);

  // Применяем colorSettings если они есть
  const currentColorSettings = editData.colorSettings || colorSettings || {};
  const titleColorFromSettings = currentColorSettings.textFields?.title || '#1976d2';
  const descriptionColorFromSettings = currentColorSettings.textFields?.description || '#666666';
  const backgroundColorFromSettings = currentColorSettings.textFields?.background || 'transparent';
  const navigationColorFromSettings = currentColorSettings.textFields?.navigation || 'rgba(255,255,255,0.8)';
  const paginationColorFromSettings = currentColorSettings.textFields?.pagination || '#1976d2';
  const borderColorFromSettings = currentColorSettings.textFields?.border || '#e0e0e0';
  
  // Стили контейнера с фоном
  const containerStyles = { 
    width: '100%'
  };
  
  // Применяем настройки фона из sectionBackground
  if (currentColorSettings.sectionBackground?.enabled) {
    const { sectionBackground } = currentColorSettings;
    if (sectionBackground.useGradient) {
      containerStyles.background = `linear-gradient(${sectionBackground.gradientDirection}, ${sectionBackground.gradientColor1}, ${sectionBackground.gradientColor2})`;
    } else {
      containerStyles.backgroundColor = sectionBackground.solidColor;
    }
    containerStyles.opacity = sectionBackground.opacity || 1;
  } else {
    containerStyles.backgroundColor = backgroundColorFromSettings;
  }
  
  // Применяем настройки границы
  if (currentColorSettings.borderColor) {
    containerStyles.border = `${currentColorSettings.borderWidth || 1}px solid ${currentColorSettings.borderColor}`;
  }
  
  // Применяем радиус углов
  if (currentColorSettings.borderRadius !== undefined) {
    containerStyles.borderRadius = `${currentColorSettings.borderRadius}px`;
  }
  
  // Применяем внутренние отступы
  if (currentColorSettings.padding !== undefined) {
    containerStyles.padding = `${currentColorSettings.padding}px`;
  }
  
  // Применяем тень
  if (currentColorSettings.boxShadow) {
    containerStyles.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
  }

  // Если в режиме редактирования
  if (isCurrentlyEditing) {
    return (
      <Paper sx={{ p: 3, mb: 2, border: '2px solid #1976d2' }}>
        <Typography variant="h6" color="primary" gutterBottom sx={{ mb: 3 }}>
          🖼️ Редактирование галереи
        </Typography>
        
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImagesUpload}
          accept="image/*"
          multiple
          style={{ display: 'none' }}
        />
        
        <Accordion defaultExpanded={true}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1">📝 Основная информация</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Название галереи"
                  value={editData.title}
                  onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                  variant="outlined"
                  size="small"
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Описание галереи"
                  value={editData.description}
                  onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                  variant="outlined"
                  multiline
                  rows={2}
                  size="small"
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        <Accordion defaultExpanded={true}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1">📷 Управление изображениями ({editData.images.length})</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ mb: 2 }}>
              <Button
                variant="contained"
                startIcon={isUploading ? <CircularProgress size={16} /> : <CloudUploadIcon />}
                onClick={handleUploadClick}
                disabled={isUploading}
                sx={{ mb: 2 }}
              >
                {isUploading ? 'Загрузка...' : 'Добавить изображения'}
              </Button>
              
              {uploadError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {uploadError}
                </Alert>
              )}
              
              {editData.images.length > 0 && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  ✅ Изображения конвертированы в JPG и сохранены в кеш
                </Alert>
              )}
            </Box>
            
            {editData.images.length > 0 && (
              <Grid container spacing={2}>
                {editData.images.map((image, index) => (
                  <Grid item xs={6} sm={4} md={3} key={image.id}>
                    <Box sx={{ 
                      position: 'relative', 
                      border: '1px solid #e0e0e0', 
                      borderRadius: 1,
                      overflow: 'hidden'
                    }}>
                      <img
                        src={image.url}
                        alt={image.alt}
                        style={{
                          width: '100%',
                          height: '80px',
                          objectFit: 'cover'
                        }}
                      />
                      <IconButton
                        size="small"
                        onClick={() => handleRemoveImage(index)}
                        sx={{
                          position: 'absolute',
                          top: 4,
                          right: 4,
                          backgroundColor: 'rgba(255,255,255,0.8)',
                          '&:hover': {
                            backgroundColor: 'rgba(255,255,255,0.9)'
                          }
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                      <Typography variant="caption" sx={{ 
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        backgroundColor: 'rgba(0,0,0,0.7)',
                        color: 'white',
                        p: 0.5,
                        fontSize: '0.7rem'
                      }}>
                        {image.originalName}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            )}
          </AccordionDetails>
        </Accordion>

        <Accordion defaultExpanded={false}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1">⚙️ Настройки отображения</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" gutterBottom>
                  Высота галереи: {editData.galleryHeight}px
                </Typography>
                <Slider
                  value={editData.galleryHeight}
                  onChange={(_, value) => setEditData({ ...editData, galleryHeight: value })}
                  min={200}
                  max={800}
                  step={50}
                  marks={[
                    { value: 200, label: 'Мини' },
                    { value: 400, label: 'Средний' },
                    { value: 600, label: 'Большой' },
                    { value: 800, label: 'Макси' }
                  ]}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" gutterBottom>
                  Размер миниатюр: {editData.thumbnailSize}px
                </Typography>
                <Slider
                  value={editData.thumbnailSize}
                  onChange={(_, value) => setEditData({ ...editData, thumbnailSize: value })}
                  min={50}
                  max={150}
                  step={10}
                  marks={[
                    { value: 50, label: 'Мелкий' },
                    { value: 80, label: 'Средний' },
                    { value: 120, label: 'Крупный' }
                  ]}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={editData.showThumbnails}
                      onChange={(e) => setEditData({ ...editData, showThumbnails: e.target.checked })}
                    />
                  }
                  label="Показывать миниатюры"
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={editData.showNavigation}
                      onChange={(e) => setEditData({ ...editData, showNavigation: e.target.checked })}
                    />
                  }
                  label="Показывать навигацию"
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={editData.showPagination}
                      onChange={(e) => setEditData({ ...editData, showPagination: e.target.checked })}
                    />
                  }
                  label="Показывать пагинацию"
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={editData.autoplay}
                      onChange={(e) => setEditData({ ...editData, autoplay: e.target.checked })}
                    />
                  }
                  label="Автопроигрывание"
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        <Accordion defaultExpanded={false}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1">🎨 Цветовые настройки</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <ColorSettings
              title="Настройки цветов галереи"
              colorSettings={editData.colorSettings || {}}
              onUpdate={handleColorUpdate}
              availableFields={[
                {
                  name: 'title',
                  label: 'Заголовок',
                  description: 'Цвет заголовка галереи',
                  defaultColor: '#333333'
                },
                {
                  name: 'description',
                  label: 'Описание',
                  description: 'Цвет описания галереи',
                  defaultColor: '#666666'
                },
                {
                  name: 'background',
                  label: 'Фон',
                  description: 'Цвет фона галереи',
                  defaultColor: '#ffffff'
                },
                {
                  name: 'border',
                  label: 'Граница',
                  description: 'Цвет границы галереи',
                  defaultColor: '#e0e0e0'
                },
                {
                  name: 'navigation',
                  label: 'Навигация',
                  description: 'Цвет кнопок навигации',
                  defaultColor: 'rgba(255,255,255,0.7)'
                },
                {
                  name: 'pagination',
                  label: 'Пагинация',
                  description: 'Цвет точек пагинации',
                  defaultColor: '#1976d2'
                },
                {
                  name: 'overlay',
                  label: 'Оверлеи',
                  description: 'Цвет оверлеев (номер изображения, переключатель)',
                  defaultColor: 'rgba(0,0,0,0.5)'
                }
              ]}
              defaultColors={{
                textFields: {
                  title: '#333333',
                  description: '#666666',
                  background: '#ffffff',
                  border: '#e0e0e0',
                  navigation: 'rgba(255,255,255,0.7)',
                  pagination: '#1976d2',
                  overlay: 'rgba(0,0,0,0.5)'
                }
              }}
            />
          </AccordionDetails>
        </Accordion>

        <Accordion defaultExpanded={false}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1">✨ Настройки анимации</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <AnimationControls
              animationSettings={editData.animationSettings}
              onUpdate={handleAnimationUpdate}
            />
          </AccordionDetails>
        </Accordion>

        <Divider sx={{ my: 3 }} />
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            startIcon={<CloudUploadIcon />}
          >
            💾 Сохранить
          </Button>
          <Button
            variant="outlined"
            onClick={handleCancel}
          >
            ❌ Отменить
          </Button>
        </Box>
      </Paper>
    );
  }

  // Обычный режим просмотра галереи
  if (editData.images.length === 0) {
    return (
      <EditableElementWrapper 
        editable={constructorMode} 
        onStartEdit={handleDoubleClick}
        isEditing={isCurrentlyEditing}
      >
        <AnimationWrapper {...editData.animationSettings}>
          <Box sx={{ 
            p: 4, 
            textAlign: 'center',
            backgroundColor: editData.backgroundColor,
            minHeight: editData.galleryHeight,
            width: '100%'
          }}>
            <Typography variant="h5" sx={{ color: editData.titleColor, mb: 2 }}>
              {editData.title}
            </Typography>
            <Typography variant="body1" sx={{ color: editData.descriptionColor, mb: 3 }}>
              {editData.description}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              📷 Пока нет изображений. Дважды кликните для добавления.
            </Typography>
          </Box>
        </AnimationWrapper>
      </EditableElementWrapper>
    );
  }

  return (
    <EditableElementWrapper 
      editable={constructorMode} 
      onStartEdit={handleDoubleClick}
      isEditing={isCurrentlyEditing}
    >
      <AnimationWrapper {...editData.animationSettings}>
        <Box sx={containerStyles}>
          {/* Заголовок и описание */}
          <Box sx={{ mb: 3, textAlign: 'center' }}>
            <Typography variant="h4" sx={{ color: titleColorFromSettings, mb: 1 }}>
              {editData.title}
            </Typography>
            <Typography variant="body1" sx={{ color: descriptionColorFromSettings }}>
              {editData.description}
            </Typography>
          </Box>

          {/* Основная галерея */}
          <Box sx={{ 
            height: editData.galleryHeight,
            width: '100%',
            overflow: 'hidden',
            position: 'relative'
          }}>
            {editData.images.length > 0 && (
              <img
                src={editData.images[selectedImageIndex]?.url}
                alt={editData.images[selectedImageIndex]?.alt}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            )}
            
            {/* Навигация */}
            {editData.showNavigation && editData.images.length > 1 && (
              <>
                <IconButton
                  onClick={() => setSelectedImageIndex(prev => 
                    prev === 0 ? editData.images.length - 1 : prev - 1
                  )}
                  sx={{
                    position: 'absolute',
                    left: 8,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    backgroundColor: navigationColorFromSettings,
                    '&:hover': { backgroundColor: navigationColorFromSettings }
                  }}
                >
                  ←
                </IconButton>
                <IconButton
                  onClick={() => setSelectedImageIndex(prev => 
                    prev === editData.images.length - 1 ? 0 : prev + 1
                  )}
                  sx={{
                    position: 'absolute',
                    right: 8,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    backgroundColor: navigationColorFromSettings,
                    '&:hover': { backgroundColor: navigationColorFromSettings }
                  }}
                >
                  →
                </IconButton>
              </>
            )}
          </Box>

          {/* Миниатюры */}
          {editData.showThumbnails && editData.images.length > 1 && (
            <Box sx={{ 
              mt: 2, 
              display: 'flex', 
              gap: 1, 
              overflowX: 'auto',
              pb: 1
            }}>
              {editData.images.map((image, index) => (
                <Box
                  key={image.id}
                  onClick={() => setSelectedImageIndex(index)}
                  sx={{
                    width: editData.thumbnailSize,
                    height: editData.thumbnailSize,
                    flexShrink: 0,
                    cursor: 'pointer',
                    border: selectedImageIndex === index ? `3px solid ${paginationColorFromSettings}` : 'none',
                    overflow: 'hidden',
                    transition: 'all 0.2s ease',
                    opacity: selectedImageIndex === index ? 1 : 0.7,
                    '&:hover': {
                      opacity: 1
                    }
                  }}
                >
                  <img
                    src={image.url}
                    alt={image.alt}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                </Box>
              ))}
            </Box>
          )}

          {/* Пагинация */}
          {editData.showPagination && (
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography variant="body2" sx={{ color: paginationColorFromSettings }}>
                {selectedImageIndex + 1} из {editData.images.length}
              </Typography>
            </Box>
          )}
        </Box>
      </AnimationWrapper>
    </EditableElementWrapper>
  );
};

export default TestimonialCard; 
