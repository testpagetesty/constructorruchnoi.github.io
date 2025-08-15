import React, { useState, useRef } from 'react';
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

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <StarIcon 
        key={i} 
        sx={{ 
          color: i < rating ? '#ffc107' : '#e0e0e0',
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

        <Accordion defaultExpanded={false}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1">🎨 Цветовые настройки</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="body2" sx={{ minWidth: '120px' }}>Цвет имени:</Typography>
                  <TextField
                    type="color"
                    value={editData.nameColor}
                    onChange={(e) => setEditData({ ...editData, nameColor: e.target.value })}
                    size="small"
                    sx={{ width: '60px' }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {editData.nameColor}
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="body2" sx={{ minWidth: '120px' }}>Цвет должности:</Typography>
                  <TextField
                    type="color"
                    value={editData.roleColor}
                    onChange={(e) => setEditData({ ...editData, roleColor: e.target.value })}
                    size="small"
                    sx={{ width: '60px' }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {editData.roleColor}
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="body2" sx={{ minWidth: '120px' }}>Цвет компании:</Typography>
                  <TextField
                    type="color"
                    value={editData.companyColor}
                    onChange={(e) => setEditData({ ...editData, companyColor: e.target.value })}
                    size="small"
                    sx={{ width: '60px' }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {editData.companyColor}
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="body2" sx={{ minWidth: '120px' }}>Цвет текста отзыва:</Typography>
                  <TextField
                    type="color"
                    value={editData.contentColor}
                    onChange={(e) => setEditData({ ...editData, contentColor: e.target.value })}
                    size="small"
                    sx={{ width: '60px' }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {editData.contentColor}
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="body2" sx={{ minWidth: '120px' }}>Цвет фона:</Typography>
                  <TextField
                    type="color"
                    value={editData.backgroundColor}
                    onChange={(e) => setEditData({ ...editData, backgroundColor: e.target.value })}
                    size="small"
                    sx={{ width: '60px' }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {editData.backgroundColor}
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="body2" sx={{ minWidth: '120px' }}>Цвет рамки:</Typography>
                  <TextField
                    type="color"
                    value={editData.borderColor}
                    onChange={(e) => setEditData({ ...editData, borderColor: e.target.value })}
                    size="small"
                    sx={{ width: '60px' }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {editData.borderColor}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
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

  return (
    <EditableElementWrapper 
      editable={constructorMode} 
      onStartEdit={handleDoubleClick}
      isEditing={isCurrentlyEditing}
    >
      <AnimationWrapper {...editData.animationSettings}>
        <Card 
          sx={{ 
            mb: 2, 
            p: 2, 
            backgroundColor: editData.backgroundColor || '#ffffff',
            borderLeft: `4px solid ${editData.borderColor || '#1976d2'}`,
            borderRadius: 2,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}
        >
        <CardContent sx={{ p: 0 }}>
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
                  color: editData.nameColor || '#1976d2',
                  fontWeight: 'bold'
                }}
              >
                {editData.name}
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  mb: 0.5,
                  color: editData.roleColor || '#666666'
                }}
              >
                {editData.role}
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: editData.companyColor || '#888888'
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
              color: editData.contentColor || '#333333'
            }}
          >
            "{editData.content}"
          </Typography>
        </CardContent>
      </Card>
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
  
  // Новые настройки стилизации
  titleColor = '#333333',
  questionColor = '#1976d2',
  answerColor = '#666666',
  backgroundColor = '#ffffff',
  backgroundType = 'solid', // 'solid' или 'gradient'
  gradientColors = ['#ffffff', '#f5f5f5'],
  gradientDirection = 'to bottom',
  showBackground = true,
  borderColor = '#e0e0e0',
  borderRadius = 8,
  padding = 20,
  accordionBgColor = '#fafafa',
  accordionHoverColor = '#f0f0f0',
  iconColor = '#1976d2',
  
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
    titleColor,
    questionColor,
    answerColor,
    backgroundColor,
    backgroundType,
    gradientColors,
    gradientDirection,
    showBackground,
    borderColor,
    borderRadius,
    padding,
    accordionBgColor,
    accordionHoverColor,
    iconColor,
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
      title, items, titleColor, questionColor, answerColor, backgroundColor,
      backgroundType, gradientColors, gradientDirection, showBackground,
      borderColor, borderRadius, padding, accordionBgColor, accordionHoverColor,
      iconColor, animationSettings 
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

  // Функция для получения стиля фона
  const getBackgroundStyle = (data = editData) => {
    if (!data.showBackground) return {};
    
    if (data.backgroundType === 'gradient') {
      return {
        background: `linear-gradient(${data.gradientDirection}, ${data.gradientColors[0]}, ${data.gradientColors[1]})`
      };
    } else {
      return {
        backgroundColor: data.backgroundColor
      };
    }
  };

  // Опции направления градиента
  const gradientDirections = [
    { value: 'to bottom', label: 'Сверху вниз' },
    { value: 'to top', label: 'Снизу вверх' },
    { value: 'to right', label: 'Слева направо' },
    { value: 'to left', label: 'Справа налево' },
    { value: 'to bottom right', label: 'По диагонали ↘' },
    { value: 'to bottom left', label: 'По диагонали ↙' },
    { value: 'to top right', label: 'По диагонали ↗' },
    { value: 'to top left', label: 'По диагонали ↖' }
  ];

  const isCurrentlyEditing = isEditing || localEditing;

  const addItem = () => {
    setEditData({
      ...editData,
      items: [...editData.items, { question: 'Новый вопрос?', answer: 'Ответ на вопрос' }]
    });
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
          p: `${editData.padding || padding}px`,
          mb: 2,
          borderRadius: `${editData.borderRadius || borderRadius}px`,
          ...getBackgroundStyle(),
          ...(editData.showBackground || showBackground ? { border: `1px solid ${editData.borderColor || borderColor}` } : { boxShadow: 'none', background: 'transparent' })
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
            
            <Grid container spacing={2}>
              <Grid item xs={6} sm={3}>
                <Typography variant="body2" gutterBottom>Цвет заголовка:</Typography>
                <ColorPicker
                  color={editData.titleColor}
                  onChange={(color) => setEditData({ ...editData, titleColor: color.hex })}
                  width="100%"
                  disableAlpha
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="body2" gutterBottom>Цвет вопросов:</Typography>
                <ColorPicker
                  color={editData.questionColor}
                  onChange={(color) => setEditData({ ...editData, questionColor: color.hex })}
                  width="100%"
                  disableAlpha
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="body2" gutterBottom>Цвет ответов:</Typography>
                <ColorPicker
                  color={editData.answerColor}
                  onChange={(color) => setEditData({ ...editData, answerColor: color.hex })}
                  width="100%"
                  disableAlpha
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="body2" gutterBottom>Цвет иконок:</Typography>
                <ColorPicker
                  color={editData.iconColor}
                  onChange={(color) => setEditData({ ...editData, iconColor: color.hex })}
                  width="100%"
                  disableAlpha
                />
              </Grid>
            </Grid>
          </Box>

          {/* Настройки цветов аккордеона */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>Цвета аккордеона:</Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2" gutterBottom>Цвет фона аккордеона:</Typography>
                <ColorPicker
                  color={editData.accordionBgColor}
                  onChange={(color) => setEditData({ ...editData, accordionBgColor: color.hex })}
                  width="100%"
                  disableAlpha
                />
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" gutterBottom>Цвет при наведении:</Typography>
                <ColorPicker
                  color={editData.accordionHoverColor}
                  onChange={(color) => setEditData({ ...editData, accordionHoverColor: color.hex })}
                  width="100%"
                  disableAlpha
                />
              </Grid>
            </Grid>
          </Box>

          {/* Настройки фона */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>Настройки фона:</Typography>
            
            <FormControlLabel
              control={
                <Switch
                  checked={editData.showBackground}
                  onChange={(e) => setEditData({ ...editData, showBackground: e.target.checked })}
                />
              }
              label="Показать фон"
              sx={{ mb: 2 }}
            />

            {editData.showBackground && (
              <>
                <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                  <InputLabel>Тип фона</InputLabel>
                  <Select
                    value={editData.backgroundType}
                    onChange={(e) => setEditData({ ...editData, backgroundType: e.target.value })}
                    label="Тип фона"
                  >
                    <MenuItem value="solid">Сплошной цвет</MenuItem>
                    <MenuItem value="gradient">Градиент</MenuItem>
                  </Select>
                </FormControl>

                {editData.backgroundType === 'solid' ? (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" gutterBottom>Цвет фона:</Typography>
                    <ColorPicker
                      color={editData.backgroundColor}
                      onChange={(color) => setEditData({ ...editData, backgroundColor: color.hex })}
                      width="100%"
                      disableAlpha
                    />
                  </Box>
                ) : (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" gutterBottom>Цвета градиента:</Typography>
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                      <Grid item xs={6}>
                        <Typography variant="body2" gutterBottom>Первый цвет:</Typography>
                        <ColorPicker
                          color={editData.gradientColors[0]}
                          onChange={(color) => setEditData({ 
                            ...editData, 
                            gradientColors: [color.hex, editData.gradientColors[1]]
                          })}
                          width="100%"
                          disableAlpha
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" gutterBottom>Второй цвет:</Typography>
                        <ColorPicker
                          color={editData.gradientColors[1]}
                          onChange={(color) => setEditData({ 
                            ...editData, 
                            gradientColors: [editData.gradientColors[0], color.hex]
                          })}
                          width="100%"
                          disableAlpha
                        />
                      </Grid>
                    </Grid>
                    
                    <FormControl fullWidth size="small">
                      <InputLabel>Направление градиента</InputLabel>
                      <Select
                        value={editData.gradientDirection}
                        onChange={(e) => setEditData({ ...editData, gradientDirection: e.target.value })}
                        label="Направление градиента"
                      >
                        {gradientDirections.map((dir) => (
                          <MenuItem key={dir.value} value={dir.value}>
                            {dir.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                )}

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" gutterBottom>Цвет границы:</Typography>
                  <ColorPicker
                    color={editData.borderColor}
                    onChange={(color) => setEditData({ ...editData, borderColor: color.hex })}
                    width="100%"
                    disableAlpha
                  />
                </Box>
              </>
            )}
          </Box>

          {/* Настройки размеров */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>Настройки внешнего вида:</Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2" gutterBottom>
                  Внутренние отступы: {editData.padding}px
                </Typography>
                <Slider
                  value={editData.padding}
                  onChange={(e, value) => setEditData({ ...editData, padding: value })}
                  min={0}
                  max={50}
                  size="small"
                />
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" gutterBottom>
                  Радиус скругления: {editData.borderRadius}px
                </Typography>
                <Slider
                  value={editData.borderRadius}
                  onChange={(e, value) => setEditData({ ...editData, borderRadius: value })}
                  min={0}
                  max={30}
                  size="small"
                />
              </Grid>
            </Grid>
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
            p: `${editData.padding || padding}px`,
            mb: 2,
            borderRadius: `${editData.borderRadius || borderRadius}px`,
            ...getBackgroundStyle(),
            ...(editData.showBackground || showBackground ? { border: `1px solid ${editData.borderColor || borderColor}` } : { boxShadow: 'none', background: 'transparent' })
          }}
        >
          <Typography 
            variant="h4" 
            sx={{ 
              mb: 3,
              color: editData.titleColor || titleColor,
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
                  backgroundColor: editData.accordionBgColor || accordionBgColor,
                  borderRadius: `${(editData.borderRadius || borderRadius) / 2}px !important`,
                  '&:hover': {
                    backgroundColor: editData.accordionHoverColor || accordionHoverColor
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
                        color: editData.iconColor || iconColor,
                        fontSize: '1.5rem'
                      }} 
                    />
                  }
                  sx={{
                    borderRadius: `${(editData.borderRadius || borderRadius) / 2}px`,
                    '&:hover': {
                      backgroundColor: 'rgba(0,0,0,0.04)'
                    }
                  }}
                >
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: editData.questionColor || questionColor,
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
                      color: editData.answerColor || answerColor,
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
  // Добавляем цветовые настройки
  titleColor = '#000000',
  dateColor = '#666666',
  textColor = '#333333',
  lineColor = '#e0e0e0',
  backgroundColor = 'transparent',
  // Цвета статусов
  completedColor = '#4caf50',
  inProgressColor = '#ff9800',
  pendingColor = '#2196f3',
  
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
    titleColor,
    dateColor,
    textColor,
    lineColor,
    backgroundColor,
    completedColor,
    inProgressColor,
    pendingColor,
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
      titleColor,
      dateColor,
      textColor,
      lineColor,
      backgroundColor,
      completedColor,
      inProgressColor,
      pendingColor,
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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon sx={{ color: editData.completedColor }} />;
      case 'in-progress':
        return <ScheduleIcon sx={{ color: editData.inProgressColor }} />;
      case 'pending':
        return <PendingIcon sx={{ color: editData.pendingColor }} />;
      default:
        return <PendingIcon sx={{ color: 'grey.500' }} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return editData.completedColor;
      case 'in-progress':
        return editData.inProgressColor;
      case 'pending':
        return editData.pendingColor;
      default:
        return 'grey.500';
    }
  };

  // Добавляем блок настроек цветов для manual режима
  const renderColorSettings = () => {
    if (!constructorMode || isCurrentlyEditing) return null;

    return (
      <Box sx={{ mb: 3, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Настройки цветов
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Основные цвета
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <input
                    type="color"
                    value={editData.titleColor}
                    onChange={(e) => setEditData({ ...editData, titleColor: e.target.value })}
                    style={{ width: '50px', height: '30px' }}
                  />
                  <Typography variant="body2">Цвет заголовка</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <input
                    type="color"
                    value={editData.dateColor}
                    onChange={(e) => setEditData({ ...editData, dateColor: e.target.value })}
                    style={{ width: '50px', height: '30px' }}
                  />
                  <Typography variant="body2">Цвет даты</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <input
                    type="color"
                    value={editData.textColor}
                    onChange={(e) => setEditData({ ...editData, textColor: e.target.value })}
                    style={{ width: '50px', height: '30px' }}
                  />
                  <Typography variant="body2">Цвет текста</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <input
                    type="color"
                    value={editData.lineColor}
                    onChange={(e) => setEditData({ ...editData, lineColor: e.target.value })}
                    style={{ width: '50px', height: '30px' }}
                  />
                  <Typography variant="body2">Цвет линии</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <input
                    type="color"
                    value={editData.backgroundColor}
                    onChange={(e) => setEditData({ ...editData, backgroundColor: e.target.value })}
                    style={{ width: '50px', height: '30px' }}
                  />
                  <Typography variant="body2">Цвет фона</Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Цвета статусов
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <input
                    type="color"
                    value={editData.completedColor}
                    onChange={(e) => setEditData({ ...editData, completedColor: e.target.value })}
                    style={{ width: '50px', height: '30px' }}
                  />
                  <Typography variant="body2">Завершено</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <input
                    type="color"
                    value={editData.inProgressColor}
                    onChange={(e) => setEditData({ ...editData, inProgressColor: e.target.value })}
                    style={{ width: '50px', height: '30px' }}
                  />
                  <Typography variant="body2">В процессе</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <input
                    type="color"
                    value={editData.pendingColor}
                    onChange={(e) => setEditData({ ...editData, pendingColor: e.target.value })}
                    style={{ width: '50px', height: '30px' }}
                  />
                  <Typography variant="body2">Ожидание</Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    );
  };

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
            style={{ width: '100%', minHeight: '120px', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
          />

          {/* Настройки цветов */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Настройки цветов
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Основные цвета
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <input
                        type="color"
                        value={editData.titleColor}
                        onChange={(e) => setEditData({ ...editData, titleColor: e.target.value })}
                        style={{ width: '50px', height: '30px' }}
                      />
                      <Typography variant="body2">Цвет заголовка</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <input
                        type="color"
                        value={editData.dateColor}
                        onChange={(e) => setEditData({ ...editData, dateColor: e.target.value })}
                        style={{ width: '50px', height: '30px' }}
                      />
                      <Typography variant="body2">Цвет даты</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <input
                        type="color"
                        value={editData.textColor}
                        onChange={(e) => setEditData({ ...editData, textColor: e.target.value })}
                        style={{ width: '50px', height: '30px' }}
                      />
                      <Typography variant="body2">Цвет текста</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <input
                        type="color"
                        value={editData.lineColor}
                        onChange={(e) => setEditData({ ...editData, lineColor: e.target.value })}
                        style={{ width: '50px', height: '30px' }}
                      />
                      <Typography variant="body2">Цвет линии</Typography>
                    </Box>
                    <ColorPicker
                      label="Цвет фона"
                      value={editData.backgroundColor}
                      onChange={(e) => setEditData({ ...editData, backgroundColor: e.target.value })}
                      supportGradient={true}
                    />
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Цвета статусов
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <input
                        type="color"
                        value={editData.completedColor}
                        onChange={(e) => setEditData({ ...editData, completedColor: e.target.value })}
                        style={{ width: '50px', height: '30px' }}
                      />
                      <Typography variant="body2">Завершено</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <input
                        type="color"
                        value={editData.inProgressColor}
                        onChange={(e) => setEditData({ ...editData, inProgressColor: e.target.value })}
                        style={{ width: '50px', height: '30px' }}
                      />
                      <Typography variant="body2">В процессе</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <input
                        type="color"
                        value={editData.pendingColor}
                        onChange={(e) => setEditData({ ...editData, pendingColor: e.target.value })}
                        style={{ width: '50px', height: '30px' }}
                      />
                      <Typography variant="body2">Ожидание</Typography>
                    </Box>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>
          
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
        <Box sx={{ 
          background: editData.backgroundColor, 
          p: 2, 
          borderRadius: 1 
        }}>
          <Typography variant="h4" sx={{ mb: 3, textAlign: 'center', color: editData.titleColor }}>
            {title}
          </Typography>
          <Box sx={{ position: 'relative' }}>
            {editData.events.map((event, index) => (
              <Box key={index} sx={{ display: 'flex', mb: 3 }}>
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  mr: 2 
                }}>
                  {getStatusIcon(event.status)}
                  {index < editData.events.length - 1 && (
                    <Box sx={{ 
                      width: 2, 
                      height: 40, 
                      bgcolor: editData.lineColor,
                      mt: 1
                    }} />
                  )}
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Typography variant="h6" sx={{ mr: 1, color: editData.textColor }}>
                      {event.title}
                    </Typography>
                    <Chip 
                      label={event.status} 
                      sx={{ 
                        backgroundColor: getStatusColor(event.status),
                        color: '#ffffff'
                      }}
                      size="small"
                    />
                  </Box>
                  <Typography variant="body2" sx={{ mb: 1, color: editData.dateColor }}>
                    {event.date}
                  </Typography>
                  <Typography variant="body1" sx={{ color: editData.textColor }}>
                    {event.description}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
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
  // Цветовые настройки
  titleColor = '#1976d2',
  descriptionColor = '#666666',
  backgroundColor = 'transparent',
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
  
  const [editData, setEditData] = useState({ 
    title,
    description,
    images,
    galleryHeight,
    galleryWidth,
    thumbnailSize,
    titleColor,
    descriptionColor,
    backgroundColor,
    slidesPerView,
    spaceBetween,
    showThumbnails,
    showNavigation,
    showPagination,
    autoplay,
    autoplayDelay,
    sectionId: sectionId || `gallery_${Date.now()}`,
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
      description,
      images,
      galleryHeight,
      galleryWidth,
      thumbnailSize,
      titleColor,
      descriptionColor,
      backgroundColor,
      slidesPerView,
      spaceBetween,
      showThumbnails,
      showNavigation,
      showPagination,
      autoplay,
      autoplayDelay,
      sectionId: sectionId || `gallery_${Date.now()}`,
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

  // Функция обработки загрузки изображений
  const handleImagesUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (!files.length) return;

    setIsUploading(true);
    setUploadError('');

    try {
      // Импортируем утилиты для обработки изображений
      const { processImageUpload } = await import('../../utils/imageConverter');
      const { imageCacheService } = await import('../../utils/imageCacheService');
      
      const galleryName = editData.title || 'gallery';
      const processedImages = [];
      
      console.log(`Загрузка ${files.length} изображений для галереи:`, editData.sectionId);
      
      // Обрабатываем каждое изображение
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Генерируем имя с порядковым номером
        const imageNumber = editData.images.length + i + 1;
        const imageName = `${galleryName}_${imageNumber}`;
        
        console.log(`Обработка изображения ${i + 1}/${files.length}:`, imageName);
        
        // Обрабатываем загрузку изображения (конвертация в JPG, оптимизация, уникальное имя)
        const result = await processImageUpload(file, editData.sectionId, imageName);
        
        if (!result.success) {
          throw new Error(`Ошибка обработки изображения ${i + 1}: ${result.error}`);
        }
        
        // Сохраняем изображение в кеш
        await imageCacheService.saveImage(result.fileName, result.file);
        
        // Сохраняем расширенные метаданные
        const metadata = {
          fileName: result.fileName,
          originalName: result.originalName,
          originalType: result.originalType,
          galleryName: galleryName,
          sectionId: editData.sectionId,
          imageNumber: imageNumber,
          size: result.size,
          width: result.width,
          height: result.height,
          uploadDate: new Date().toISOString(),
          processed: true,
          format: 'jpg',
          type: 'gallery-image'
        };
        
        console.log('Сохранение метаданных изображения галереи:', metadata);
        await imageCacheService.saveMetadata(`gallery-image-${result.fileName}`, metadata);
        
        // Получаем blob из кеша для создания URL
        const blob = await imageCacheService.getImage(result.fileName);
        const imageUrl = URL.createObjectURL(blob);
        
        processedImages.push({
          id: Date.now() + i,
          url: imageUrl,
          fileName: result.fileName,
          alt: imageName,
          title: imageName,
          description: '',
          originalName: result.originalName,
          size: result.size,
          dimensions: `${result.width}x${result.height}`
        });
      }
      
      // Обновляем локальное состояние
      setEditData(prev => ({
        ...prev,
        images: [...prev.images, ...processedImages]
      }));
      
      console.log(`Успешно обработано и загружено ${processedImages.length} изображений`);
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
    fileInputRef.current?.click();
  };

  const handleRemoveImage = (imageIndex) => {
    setEditData(prev => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== imageIndex)
    }));
  };

  const isCurrentlyEditing = isEditing || localEditing;

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
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="body2" sx={{ minWidth: '120px' }}>Цвет заголовка:</Typography>
                  <TextField
                    type="color"
                    value={editData.titleColor}
                    onChange={(e) => setEditData({ ...editData, titleColor: e.target.value })}
                    size="small"
                    sx={{ width: '60px' }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {editData.titleColor}
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="body2" sx={{ minWidth: '120px' }}>Цвет описания:</Typography>
                  <TextField
                    type="color"
                    value={editData.descriptionColor}
                    onChange={(e) => setEditData({ ...editData, descriptionColor: e.target.value })}
                    size="small"
                    sx={{ width: '60px' }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {editData.descriptionColor}
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="body2" sx={{ minWidth: '120px' }}>Цвет фона:</Typography>
                  <TextField
                    type="color"
                    value={editData.backgroundColor}
                    onChange={(e) => setEditData({ ...editData, backgroundColor: e.target.value })}
                    size="small"
                    sx={{ width: '60px' }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {editData.backgroundColor}
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="body2" sx={{ minWidth: '120px' }}>Цвет рамки:</Typography>
                  <TextField
                    type="color"
                    value={editData.borderColor}
                    onChange={(e) => setEditData({ ...editData, borderColor: e.target.value })}
                    size="small"
                    sx={{ width: '60px' }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {editData.borderColor}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
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
        <Box sx={{ 
          backgroundColor: editData.backgroundColor,
          width: '100%'
        }}>
          {/* Заголовок и описание */}
          <Box sx={{ mb: 3, textAlign: 'center' }}>
            <Typography variant="h4" sx={{ color: editData.titleColor, mb: 1 }}>
              {editData.title}
            </Typography>
            <Typography variant="body1" sx={{ color: editData.descriptionColor }}>
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
                    backgroundColor: 'rgba(255,255,255,0.8)',
                    '&:hover': { backgroundColor: 'rgba(255,255,255,0.9)' }
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
                    backgroundColor: 'rgba(255,255,255,0.8)',
                    '&:hover': { backgroundColor: 'rgba(255,255,255,0.9)' }
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
                    border: selectedImageIndex === index ? '3px solid #1976d2' : 'none',
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
              <Typography variant="body2" color="text.secondary">
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
