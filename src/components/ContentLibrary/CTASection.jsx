import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  IconButton,
  Tooltip,
  FormControlLabel,
  Switch,
  Slider
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditIcon from '@mui/icons-material/Edit';
import AnimationWrapper from './AnimationWrapper';
import AnimationControls from './AnimationControls';
import EditableElementWrapper from './EditableElementWrapper';
import ColorSettings from './TextComponents/ColorSettings';

const CTASection = ({ 
  title = "Ознакомьтесь с нашими услугами",
  description = "Узнайте больше о том, что мы предлагаем",
  buttonText = "Перейти к услугам",
  targetPage = "services",
  alignment = "center",
  backgroundType = "solid",
  backgroundColor = "#1976d2",
  gradientColor1 = "#1976d2",
  gradientColor2 = "#42a5f5",
  gradientDirection = "to right",
  textColor = "#ffffff",
  titleColor = "#ffffff",
  descriptionColor = "#ffffff",
  buttonColor = "#ffffff",
  buttonTextColor = "#333333",
  borderRadius = 12,
  padding = 48,
  buttonBorderRadius = 8,
  showShadow = true,
  animationSettings = {
    animationType: 'fadeIn',
    delay: 0,
    triggerOnView: true,
    triggerOnce: true,
    threshold: 0.1,
    disabled: false
  },
  colorSettings = {
    textFields: {
      title: '#ffffff',
      description: '#ffffff',
      background: '#1976d2',
      border: 'transparent',
      button: '#ffffff',
      buttonText: '#333333',
      buttonBorderRadius: 8
    },
    sectionBackground: {
      enabled: false,
      useGradient: false,
      solidColor: '#1976d2',
      gradientColor1: '#1976d2',
      gradientColor2: '#42a5f5',
      gradientDirection: 'to right'
    },
    borderColor: 'transparent',
    borderWidth: 0,
    borderRadius: 12,
    padding: 48,
    boxShadow: false
  },
  availablePages = [], // Новый prop для реальных страниц из preview
  editable = false,
  isPreview = false,
  constructorMode = false,
  onSave = () => {},
  onCancel = () => {},
  onUpdate = () => {}
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title,
    description,
    buttonText,
    targetPage,
    alignment,
    backgroundType,
    backgroundColor,
    gradientColor1,
    gradientColor2,
    gradientDirection,
    textColor,
    titleColor,
    descriptionColor,
    buttonColor,
    buttonTextColor,
    borderRadius,
    padding,
    buttonBorderRadius,
    showShadow,
    animationSettings,
    colorSettings: colorSettings || {
              textFields: {
          title: '#ffffff',
          description: '#ffffff',
          background: '#1976d2',
          border: 'transparent',
          button: '#ffffff',
          buttonText: '#333333',
          buttonBorderRadius: 8
        },
      sectionBackground: {
        enabled: false,
        useGradient: false,
        solidColor: '#1976d2',
        gradientColor1: '#1976d2',
        gradientColor2: '#42a5f5',
        gradientDirection: 'to right'
      },
      borderColor: 'transparent',
      borderWidth: 0,
      borderRadius: 12,
      padding: 48,
      boxShadow: false
    }
  });

  // Обновляем локальные состояния при изменении props
  useEffect(() => {
    setEditData({
      title,
      description,
      buttonText,
      targetPage,
      alignment,
      backgroundType,
      backgroundColor,
      gradientColor1,
      gradientColor2,
      gradientDirection,
      textColor,
      titleColor,
      descriptionColor,
      buttonColor,
      buttonTextColor,
      borderRadius,
      padding,
      buttonBorderRadius,
      showShadow,
      animationSettings,
      colorSettings: colorSettings || {
        textFields: {
          title: '#ffffff',
          description: '#ffffff',
          background: '#1976d2',
          border: 'transparent',
          button: '#ffffff',
          buttonText: '#333333',
          buttonBorderRadius: 8
        },
        sectionBackground: {
          enabled: false,
          useGradient: false,
          solidColor: '#1976d2',
          gradientColor1: '#1976d2',
          gradientColor2: '#42a5f5',
          gradientDirection: 'to right'
        },
        borderColor: 'transparent',
        borderWidth: 0,
        borderRadius: 12,
        padding: 48,
        boxShadow: false
      }
    });
  }, [title, description, buttonText, targetPage, alignment, backgroundType, backgroundColor, gradientColor1, gradientColor2, gradientDirection, textColor, titleColor, descriptionColor, buttonColor, buttonTextColor, borderRadius, padding, buttonBorderRadius, showShadow, animationSettings, colorSettings]);

  // Функция для получения иконки страницы
  const getPageIcon = (pageId) => {
    switch (pageId) {
      case 'index': return '🏠';
      case 'contact': return '📞';
      case 'privacy': return '🔒';
      case 'terms': return '📜';
      case 'cookies': return '🍪';
      case 'services': return '🔧';
      case 'about': return '📋';
      case 'features': return '⭐';
      case 'testimonials': return '💬';
      case 'faq': return '❓';
      case 'news': return '📰';
      default: return '📄';
    }
  };

  // Формируем список доступных страниц из реальных страниц preview
  const pageOptions = availablePages.length > 0 
    ? availablePages.map(page => ({
        value: page.id,
        label: `${getPageIcon(page.id)} ${page.title}`,
        title: page.title
      }))
    : [
        // Fallback список, если страницы не переданы
        { value: 'index', label: '🏠 Главная', title: 'Главная' },
        { value: 'contact', label: '📞 Контакты', title: 'Контакты' },
        { value: 'privacy', label: '🔒 Политика конфиденциальности', title: 'Политика конфиденциальности' },
        { value: 'terms', label: '📜 Условия использования', title: 'Условия использования' },
        { value: 'cookies', label: '🍪 Политика cookies', title: 'Политика cookies' },
        { value: 'services', label: '🔧 Услуги', title: 'Услуги' },
        { value: 'about', label: '📋 О нас', title: 'О нас' },
        { value: 'features', label: '⭐ Преимущества', title: 'Преимущества' },
        { value: 'testimonials', label: '💬 Отзывы', title: 'Отзывы' },
        { value: 'faq', label: '❓ FAQ', title: 'FAQ' },
        { value: 'news', label: '📰 Новости', title: 'Новости' }
      ];

  // Направления градиента
  const gradientDirections = [
    { value: 'to right', label: 'Слева направо' },
    { value: 'to left', label: 'Справа налево' },
    { value: 'to bottom', label: 'Сверху вниз' },
    { value: 'to top', label: 'Снизу вверх' },
    { value: 'to bottom right', label: 'По диагонали ↘' },
    { value: 'to bottom left', label: 'По диагонали ↙' },
    { value: 'to top right', label: 'По диагонали ↗' },
    { value: 'to top left', label: 'По диагонали ↖' }
  ];

  const handleSave = () => {
    // Обновляем локальное состояние, чтобы изменения сохранились в превью
    setEditData(prev => ({
      ...prev,
      ...editData
    }));
    
    setIsEditing(false);
    
    if (onSave) {
      onSave(editData);
    }
    
    // Вызываем onUpdate для обновления родительского компонента
    if (onUpdate) {
      onUpdate(editData);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Сброс к исходным значениям
    setEditData({
      title,
      description,
      buttonText,
      targetPage,
      alignment,
      backgroundType,
      backgroundColor,
      gradientColor1,
      gradientColor2,
      gradientDirection,
      textColor,
      titleColor,
      descriptionColor,
      buttonColor,
      buttonTextColor,
      borderRadius,
      padding,
      buttonBorderRadius,
      showShadow,
      animationSettings,
      colorSettings
    });
    if (onCancel) {
      onCancel();
    }
  };

  const handleEditDataChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAnimationUpdate = (newAnimationSettings) => {
    setEditData(prev => ({
      ...prev,
      animationSettings: newAnimationSettings
    }));
  };

  const handleColorSettingsUpdate = (newColorSettings) => {
    setEditData(prev => {
      const updated = {
        ...prev,
        colorSettings: newColorSettings
      };
      return updated;
    });
  };

  const handleDoubleClick = () => {
    if (constructorMode) {
      setIsEditing(true);
    }
  };

  const handleButtonClick = () => {
    if (editData.targetPage && !isEditing) {
      // В режиме preview просто логируем (можно добавить коллбэк для навигации)
      if (isPreview || constructorMode) {
        // Здесь можно добавить коллбэк для навигации в preview режиме
        return;
      }
      
      // В обычном режиме переходим на страницу
      const targetUrl = editData.targetPage === 'index' ? '/' : `/${editData.targetPage}/`;
      window.location.href = targetUrl;
    }
  };

  const getBackgroundStyle = () => {
    // Приоритет colorSettings, если они включены
    if (editData.colorSettings?.sectionBackground?.enabled) {
      if (editData.colorSettings.sectionBackground.useGradient) {
        return {
          background: `linear-gradient(${editData.colorSettings.sectionBackground.gradientDirection}, ${editData.colorSettings.sectionBackground.gradientColor1}, ${editData.colorSettings.sectionBackground.gradientColor2})`
        };
      } else {
        return {
          backgroundColor: editData.colorSettings.sectionBackground.solidColor
        };
      }
    }
    
    // Fallback на старые настройки
    switch (editData.backgroundType) {
      case 'gradient':
        return {
          background: `linear-gradient(${editData.gradientDirection}, ${editData.gradientColor1}, ${editData.gradientColor2})`
        };
      case 'transparent':
        return {
          background: 'transparent',
          border: `2px solid ${editData.textColor}`,
          backdropFilter: 'blur(10px)'
        };
      case 'solid':
      default:
        return {
          backgroundColor: editData.backgroundColor
        };
    }
  };

  // Если в режиме редактирования
  if (isEditing) {
    return (
      <Box sx={{ my: 4 }}>
        <Paper sx={{ p: 3, mb: 2, border: '2px solid #2196f3' }}>
          <Typography variant="h6" color="primary" gutterBottom sx={{ mb: 3 }}>
            ⚡ Редактирование CTA секции
          </Typography>
          
          <Accordion defaultExpanded={true}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1">📝 Содержание</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Заголовок"
                    value={editData.title}
                    onChange={(e) => handleEditDataChange('title', e.target.value)}
                    variant="outlined"
                    size="small"
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Описание"
                    value={editData.description}
                    onChange={(e) => handleEditDataChange('description', e.target.value)}
                    variant="outlined"
                    multiline
                    rows={3}
                    size="small"
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Текст кнопки"
                    value={editData.buttonText}
                    onChange={(e) => handleEditDataChange('buttonText', e.target.value)}
                    variant="outlined"
                    size="small"
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Страница для перехода</InputLabel>
                    <Select
                      value={editData.targetPage}
                      onChange={(e) => handleEditDataChange('targetPage', e.target.value)}
                      label="Страница для перехода"
                    >
                      {pageOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  
                  {/* Информация о доступных страницах */}
                  <Box sx={{ mt: 1, p: 1, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      📌 Доступно {pageOptions.length} страниц{availablePages.length > 0 ? ' (из текущего preview)' : ' (стандартный список)'}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Выравнивание</InputLabel>
                    <Select
                      value={editData.alignment}
                      onChange={(e) => handleEditDataChange('alignment', e.target.value)}
                      label="Выравнивание"
                    >
                      <MenuItem value="left">Слева</MenuItem>
                      <MenuItem value="center">По центру</MenuItem>
                      <MenuItem value="right">Справа</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>







          <Accordion defaultExpanded={false}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1">📐 Настройки размеров</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" gutterBottom>
                    Внутренние отступы: {editData.padding}px
                  </Typography>
                  <Slider
                    value={editData.padding}
                    onChange={(e, value) => handleEditDataChange('padding', value)}
                    min={16}
                    max={80}
                    size="small"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" gutterBottom>
                    Радиус скругления: {editData.borderRadius}px
                  </Typography>
                  <Slider
                    value={editData.borderRadius}
                    onChange={(e, value) => handleEditDataChange('borderRadius', value)}
                    min={0}
                    max={40}
                    size="small"
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={editData.showShadow}
                        onChange={(e) => handleEditDataChange('showShadow', e.target.checked)}
                      />
                    }
                    label="Показать тень"
                  />
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

          {/* Настройки цветов через ColorSettings */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>Настройки цветов через ColorSettings:</Typography>
            <ColorSettings
              title="Настройки цветов CTA секции"
              colorSettings={editData.colorSettings}
              onUpdate={handleColorSettingsUpdate}
              hideAreaColors={true}
              hideLineColors={true}
              hideSegmentColors={true}
              availableFields={[
                {
                  name: 'title',
                  label: 'Цвет заголовка',
                  description: 'Цвет заголовка CTA секции',
                  defaultColor: '#ffffff'
                },
                {
                  name: 'description',
                  label: 'Цвет описания',
                  description: 'Цвет описания CTA секции',
                  defaultColor: '#ffffff'
                },
                {
                  name: 'background',
                  label: 'Цвет фона',
                  description: 'Цвет фона CTA секции',
                  defaultColor: '#1976d2'
                },
                {
                  name: 'border',
                  label: 'Цвет границы',
                  description: 'Цвет границы CTA секции',
                  defaultColor: 'transparent'
                },
                {
                  name: 'button',
                  label: 'Цвет кнопки',
                  description: 'Цвет фона кнопки CTA секции',
                  defaultColor: '#ffffff'
                },
                {
                  name: 'buttonText',
                  label: 'Цвет текста кнопки',
                  description: 'Цвет текста кнопки CTA секции',
                  defaultColor: '#333333'
                },
                {
                  name: 'buttonBorderRadius',
                  label: 'Радиус скругления кнопки',
                  description: 'Радиус скругления углов кнопки CTA секции',
                  defaultColor: 8
                }
              ]}
              defaultColors={{
                title: '#ffffff',
                description: '#ffffff',
                background: '#1976d2',
                border: 'transparent',
                button: '#ffffff',
                buttonText: '#333333',
                buttonBorderRadius: 8
              }}
            />
          </Box>

          <Divider sx={{ my: 3 }} />
          
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
            >
              💾 Сохранить
            </Button>
            <Button
              variant="outlined"
              onClick={handleCancel}
            >
              ❌ Отменить
            </Button>
          </Stack>
        </Paper>

        {/* Превью во время редактирования */}
        <Box
          sx={{
            ...getBackgroundStyle(),
            textAlign: editData.alignment,
            py: `${editData.padding / 8}px`,
            px: 4,
            borderRadius: `${editData.colorSettings?.borderRadius || editData.borderRadius}px`,
            border: '2px dashed #2196f3',
            opacity: 0.9,
            ...(editData.colorSettings?.boxShadow || editData.showShadow ? { 
              boxShadow: '0 8px 32px rgba(0,0,0,0.2)' 
            } : {})
          }}
        >
          <Typography
            variant="h3"
            component="h2"
            gutterBottom
            sx={{
              fontWeight: 'bold',
              mb: 2,
              color: editData.colorSettings?.textFields?.title || editData.titleColor
            }}
          >
            {editData.title}
          </Typography>
          
          <Typography
            variant="h6"
            sx={{
              mb: 4,
              opacity: 0.9,
              maxWidth: '600px',
              mx: 'auto',
              color: editData.colorSettings?.textFields?.description || editData.descriptionColor
            }}
          >
            {editData.description}
          </Typography>
          
          <Button
            variant="contained"
            size="large"
            disabled
            sx={{
              backgroundColor: editData.colorSettings?.textFields?.button || editData.buttonColor,
              color: editData.colorSettings?.textFields?.buttonText || editData.buttonTextColor,
              fontSize: '1.1rem',
              px: 4,
              py: 1.5,
              borderRadius: `${editData.colorSettings?.textFields?.buttonBorderRadius || editData.buttonBorderRadius}px`,
              fontWeight: 'bold',
              textTransform: 'none',
              opacity: 0.7
            }}
          >
            {editData.buttonText}
          </Button>
        </Box>
      </Box>
    );
  }

  // Обычный режим просмотра
  
  return (
    <EditableElementWrapper 
      editable={constructorMode} 
      onStartEdit={handleDoubleClick}
      isEditing={isEditing}
    >
      <AnimationWrapper {...editData.animationSettings}>
        <Box sx={{ my: 4 }}>
          <Box 
            className="cta-container"
            sx={{
              position: 'relative',
              ...getBackgroundStyle(),
              textAlign: editData.alignment,
              py: `${editData.padding / 8}px`,
              px: 4,
              borderRadius: `${editData.colorSettings?.borderRadius || editData.borderRadius}px`,
              cursor: 'default',
              transition: 'all 0.3s ease',
              border: editData.colorSettings?.borderWidth > 0 ? `${editData.colorSettings.borderWidth}px solid ${editData.colorSettings.borderColor}` : 'none',
              ...(editData.colorSettings?.boxShadow || editData.showShadow ? { 
                boxShadow: '0 8px 32px rgba(0,0,0,0.2)' 
              } : {}),
              '&:hover .edit-button': {
                opacity: 1
              }
            }}
          >
            {/* Кнопка редактирования */}
            {(editable || constructorMode) && (
              <Box
                className="edit-button"
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  opacity: 0,
                  transition: 'opacity 0.2s ease',
                  zIndex: 10
                }}
              >
                <Tooltip title="Редактировать CTA секцию">
                  <IconButton
                    size="small"
                    onClick={() => setIsEditing(true)}
                    sx={{
                      backgroundColor: 'rgba(255,255,255,0.9)',
                      '&:hover': {
                        backgroundColor: 'rgba(255,255,255,1)'
                      }
                    }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            )}

            <Typography
              variant="h3"
              component="h2"
              gutterBottom
              sx={{
                fontWeight: 'bold',
                mb: 2,
                color: editData.colorSettings?.textFields?.title || editData.titleColor
              }}
            >
              {editData.title}
            </Typography>
            
            <Typography
              variant="h6"
              sx={{
                mb: 4,
                opacity: 0.9,
                maxWidth: '600px',
                mx: 'auto',
                color: editData.colorSettings?.textFields?.description || editData.descriptionColor
              }}
            >
              {editData.description}
            </Typography>
            
            <Button
              variant="contained"
              size="large"
              onClick={handleButtonClick}
              sx={{
                backgroundColor: editData.colorSettings?.textFields?.button || editData.buttonColor,
                color: editData.colorSettings?.textFields?.buttonText || editData.buttonTextColor,
                fontSize: '1.1rem',
                px: 4,
                py: 1.5,
                borderRadius: `${editData.colorSettings?.textFields?.buttonBorderRadius || editData.buttonBorderRadius}px`,
                fontWeight: 'bold',
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: editData.colorSettings?.textFields?.button || editData.buttonColor,
                  opacity: 0.9,
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(0,0,0,0.3)'
                }
              }}
            >
              {editData.buttonText}
            </Button>
          </Box>
        </Box>
      </AnimationWrapper>
    </EditableElementWrapper>
  );
};

export default CTASection; 