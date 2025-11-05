import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, TextField, Grid, FormControl, InputLabel, Select, MenuItem, FormControlLabel, Switch, Slider, Button, Divider } from '@mui/material';
import { styled } from '@mui/material/styles';
import EditableElementWrapper from './EditableElementWrapper';
import AnimationWrapper from './AnimationWrapper';
import AnimationControls from './AnimationControls';
import { SketchPicker } from 'react-color';
import ColorSettings from './TextComponents/ColorSettings';

// Градиентный текст
export const GradientText = ({ 
  text = 'Градиентный текст', 
  direction = 'to right', 
  color1 = '#ff6b6b', 
  color2 = '#4ecdc4',
  fontSize = 24,
  fontWeight = 'bold',
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
  const [localEditing, setLocalEditing] = useState(false);
  const [editData, setEditData] = useState({ 
    text, 
    direction, 
    color1, 
    color2, 
    fontSize, 
    fontWeight,
    fontFamily: 'inherit',
    textAlign: 'center',
    padding: 16,
    borderRadius: 8,
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
    setEditData({ text, direction, color1, color2, fontSize, fontWeight, animationSettings });
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
      console.log('🔄 [GradientText] Обновление colorSettings:', colorSettings);
      setEditData(prev => ({
        ...prev,
        colorSettings: colorSettings || {}
      }));
    }
  }, [colorSettings]);

  // Получаем цвета градиента из ColorSettings или fallback на старые значения
  const gradientColor1 = editData.colorSettings?.textFields?.gradientStart || editData.colorSettings?.textGradient?.gradientStart || editData.color1 || '#ff6b6b';
  const gradientColor2 = editData.colorSettings?.textFields?.gradientEnd || editData.colorSettings?.textGradient?.gradientEnd || editData.color2 || '#4ecdc4';
  
  // Получаем направление градиента
  const gradientDirection = editData.colorSettings?.textGradient?.gradientDirection || editData.direction || 'to right';

  const StyledGradientText = styled(Typography)({
    background: `linear-gradient(${gradientDirection}, ${gradientColor1}, ${gradientColor2})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    fontSize: `${editData.fontSize}px`,
    fontWeight: editData.fontWeight,
    cursor: isPreview ? 'default' : 'pointer',
    color: 'transparent',
    '&:hover': {
      opacity: isPreview ? 1 : 0.8
    }
  });

  if (isCurrentlyEditing) {
    const fontFamilyOptions = [
      { value: 'inherit', label: 'По умолчанию' },
      { value: 'Arial, sans-serif', label: 'Arial' },
      { value: 'Georgia, serif', label: 'Georgia' },
      { value: 'Times New Roman, serif', label: 'Times New Roman' },
      { value: 'Courier New, monospace', label: 'Courier New' },
      { value: 'Helvetica, sans-serif', label: 'Helvetica' },
      { value: 'Verdana, sans-serif', label: 'Verdana' }
    ];

    const textAlignOptions = [
      { value: 'left', label: 'По левому краю' },
      { value: 'center', label: 'По центру' },
      { value: 'right', label: 'По правому краю' },
      { value: 'justify', label: 'По ширине' }
    ];

    return (
      <Paper sx={{ p: 3, mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Редактирование градиентного текста
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Основные настройки */}
          <Box>
            <Typography variant="subtitle2" gutterBottom>Основные настройки:</Typography>
            
            <TextField
              fullWidth
              label="Текст"
            value={editData.text}
            onChange={(e) => setEditData({ ...editData, text: e.target.value })}
              multiline
              rows={2}
              sx={{ mb: 2 }}
          />
            
            <FormControl fullWidth size="small" sx={{ mb: 2 }}>
              <InputLabel>Направление градиента</InputLabel>
              <Select
            value={editData.direction}
            onChange={(e) => setEditData({ ...editData, direction: e.target.value })}
                label="Направление градиента"
              >
                <MenuItem value="to right">Слева направо</MenuItem>
                <MenuItem value="to left">Справа налево</MenuItem>
                <MenuItem value="to bottom">Сверху вниз</MenuItem>
                <MenuItem value="to top">Снизу вверх</MenuItem>
                <MenuItem value="45deg">Диагональ 45°</MenuItem>
                <MenuItem value="135deg">Диагональ 135°</MenuItem>
              </Select>
            </FormControl>
            

          </Box>

          {/* Настройки шрифта */}
          <Box>
            <Typography variant="subtitle2" gutterBottom>Настройки шрифта:</Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2" gutterBottom>
                  Размер шрифта: {editData.fontSize}px
                </Typography>
                <Slider
            value={editData.fontSize}
                  onChange={(e, value) => setEditData({ ...editData, fontSize: value })}
                  min={12}
                  max={72}
                  size="small"
                />
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Начертание</InputLabel>
                  <Select
                    value={editData.fontWeight}
                    onChange={(e) => setEditData({ ...editData, fontWeight: e.target.value })}
                    label="Начертание"
                  >
                    <MenuItem value="normal">Обычный</MenuItem>
                    <MenuItem value="bold">Жирный</MenuItem>
                    <MenuItem value="lighter">Тонкий</MenuItem>
                    <MenuItem value="bolder">Очень жирный</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
          
          {/* Настройки анимации */}
          {constructorMode && (
            <Box>
              <Typography variant="subtitle2" gutterBottom>Настройки анимации:</Typography>
            <AnimationControls
              animationSettings={editData.animationSettings}
              onUpdate={handleAnimationUpdate}
            />
            </Box>
          )}

          <Divider sx={{ my: 3 }} />

          {/* Настройки цветов */}
          <ColorSettings
            title="Настройки цветов градиентного текста"
            colorSettings={editData.colorSettings || {}}
            onUpdate={(newColorSettings) => setEditData({ ...editData, colorSettings: newColorSettings })}
            availableFields={[
              {
                name: 'gradient1',
                label: 'Первый цвет градиента',
                description: 'Первый цвет градиента для текста',
                defaultColor: '#ff6b6b'
              },
              {
                name: 'gradient2',
                label: 'Второй цвет градиента',
                description: 'Второй цвет градиента для текста',
                defaultColor: '#4ecdc4'
              }
            ]}
            defaultColors={{
              textFields: {
                gradient1: '#ff6b6b',
                gradient2: '#4ecdc4'
              }
            }}
            hideCardBackground={true}
            hideAreaColors={true}
          />
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="contained" onClick={handleSave}>
              Сохранить
            </Button>
            <Button variant="outlined" onClick={handleCancel}>
              Отмена
            </Button>
          </Box>
        </Box>
      </Paper>
    );
  }

  // Применяем настройки фона из colorSettings
  const currentColorSettings = editData.colorSettings || {};
  const containerStyles = {};
  
  if (currentColorSettings.sectionBackground?.enabled) {
    const { sectionBackground } = currentColorSettings;
    if (sectionBackground.useGradient) {
      containerStyles.background = `linear-gradient(${sectionBackground.gradientDirection}, ${sectionBackground.gradientColor1}, ${sectionBackground.gradientColor2})`;
    } else {
      containerStyles.backgroundColor = sectionBackground.solidColor;
    }
    containerStyles.opacity = sectionBackground.opacity || 1;
  }

  // Применяем дополнительные настройки
  if (currentColorSettings.borderColor) {
    containerStyles.border = `${currentColorSettings.borderWidth || 1}px solid ${currentColorSettings.borderColor}`;
  }
  if (currentColorSettings.borderRadius !== undefined) {
    containerStyles.borderRadius = `${currentColorSettings.borderRadius}px`;
  }
  if (currentColorSettings.padding !== undefined) {
    containerStyles.padding = `${currentColorSettings.padding}px`;
  }
  if (currentColorSettings.boxShadow) {
    containerStyles.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
  }

  return (
    <EditableElementWrapper 
      editable={constructorMode} 
      onStartEdit={handleDoubleClick}
      isEditing={isCurrentlyEditing}
    >
      <Box style={containerStyles}>
      <AnimationWrapper {...editData.animationSettings}>
        <StyledGradientText>
          {editData.text}
        </StyledGradientText>
      </AnimationWrapper>
      </Box>
    </EditableElementWrapper>
  );
};

// Анимированный счетчик
export const AnimatedCounter = ({ 
  title = 'Статистика',
  startValue = 0,
  endValue = 100,
  suffix = '',
  duration = 2000,
  titleColor = '#333333',
  countColor = '#1976d2',
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
  const [count, setCount] = useState(startValue);
  const [localEditing, setLocalEditing] = useState(false);
  const [editData, setEditData] = useState({ 
    title, 
    startValue, 
    endValue, 
    suffix, 
    duration, 
    titleColor, 
    countColor, 
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
    setEditData({ title, startValue, endValue, suffix, duration, titleColor, countColor, animationSettings });
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
      console.log('🔄 [AnimatedCounter] Обновление colorSettings:', colorSettings);
      setEditData(prev => ({
        ...prev,
        colorSettings: colorSettings || {}
      }));
    }
  }, [colorSettings]);

  useEffect(() => {
    const startTime = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const currentCount = Math.floor(startValue + (endValue - startValue) * progress);
      setCount(currentCount);
      
      if (progress >= 1) {
        clearInterval(timer);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [startValue, endValue, duration]);

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
          <Box sx={{ display: 'flex', gap: 1 }}>
            <input
              type="number"
              value={editData.startValue}
              onChange={(e) => setEditData({ ...editData, startValue: parseInt(e.target.value) })}
              placeholder="Начальное значение"
              style={{ width: '50%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
            />
            <input
              type="number"
              value={editData.endValue}
              onChange={(e) => setEditData({ ...editData, endValue: parseInt(e.target.value) })}
              placeholder="Конечное значение"
              style={{ width: '50%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
            />
          </Box>
          <input
            type="text"
            value={editData.suffix}
            onChange={(e) => setEditData({ ...editData, suffix: e.target.value })}
            placeholder="Суффикс (%, +, млн)"
            style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
          />
          <input
            type="number"
            value={editData.duration}
            onChange={(e) => setEditData({ ...editData, duration: parseInt(e.target.value) })}
            placeholder="Длительность анимации (мс)"
            style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
          />
          {constructorMode && (
            <AnimationControls
              animationSettings={editData.animationSettings}
              onUpdate={handleAnimationUpdate}
            />
          )}

          <Divider sx={{ my: 3 }} />

          {/* Настройки цветов */}
          <ColorSettings
            title="Настройки цветов счетчика"
            colorSettings={editData.colorSettings || {}}
            onUpdate={(newColorSettings) => setEditData({ ...editData, colorSettings: newColorSettings })}
            availableFields={[
              {
                name: 'title',
                label: 'Цвет заголовка',
                description: 'Цвет заголовка счетчика',
                defaultColor: '#333333'
              },
              {
                name: 'content',
                label: 'Цвет числа',
                description: 'Цвет анимированного числа',
                defaultColor: '#1976d2'
              },
              {
                name: 'author',
                label: 'Цвет описания',
                description: 'Цвет описания под счетчиком',
                defaultColor: '#666666'
              }
            ]}
            defaultColors={{
              textFields: {
                title: '#333333',
                content: '#1976d2',
                author: '#666666'
              }
            }}
            hideCardBackground={true}
            hideAreaColors={true}
          />

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="contained" onClick={handleSave}>
              Сохранить
            </Button>
            <Button variant="outlined" onClick={handleCancel}>
              Отмена
            </Button>
          </Box>
        </Box>
      </Paper>
    );
  }

  // Применяем настройки фона из colorSettings
  const currentColorSettings = editData.colorSettings || {};
  const containerStyles = { textAlign: 'center', py: 2 };
  
  if (currentColorSettings.sectionBackground?.enabled) {
    const { sectionBackground } = currentColorSettings;
    if (sectionBackground.useGradient) {
      containerStyles.background = `linear-gradient(${sectionBackground.gradientDirection}, ${sectionBackground.gradientColor1}, ${sectionBackground.gradientColor2})`;
    } else {
      containerStyles.backgroundColor = sectionBackground.solidColor;
    }
    containerStyles.opacity = sectionBackground.opacity || 1;
  }

  // Применяем дополнительные настройки
  if (currentColorSettings.borderColor) {
    containerStyles.border = `${currentColorSettings.borderWidth || 1}px solid ${currentColorSettings.borderColor}`;
  }
  if (currentColorSettings.borderRadius !== undefined) {
    containerStyles.borderRadius = `${currentColorSettings.borderRadius}px`;
  }
  if (currentColorSettings.padding !== undefined) {
    containerStyles.padding = `${currentColorSettings.padding}px`;
  }
  if (currentColorSettings.boxShadow) {
    containerStyles.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
  }

  // Получаем цвета из ColorSettings или fallback на старые значения
  const titleColorFromSettings = currentColorSettings.textFields?.title || editData.titleColor || titleColor || '#333333';
  const countColorFromSettings = currentColorSettings.textFields?.content || editData.countColor || countColor || '#1976d2';
  const descriptionColorFromSettings = currentColorSettings.textFields?.author || '#666666';

  return (
    <EditableElementWrapper 
      editable={constructorMode} 
      onStartEdit={handleDoubleClick}
      isEditing={isCurrentlyEditing}
    >
      <AnimationWrapper {...editData.animationSettings}>
        <Box style={containerStyles}>
          <Typography 
            variant="h6" 
            sx={{ mb: 1, color: titleColorFromSettings }}
          >
            {editData.title}
          </Typography>
          <Typography 
            variant="h2" 
            sx={{ 
              fontWeight: 'bold', 
              color: countColorFromSettings,
              fontSize: '3rem',
              mb: editData.description ? 1 : 0
            }}
          >
            {count} {editData.suffix}
          </Typography>
          {editData.description && (
            <Typography 
              variant="body1" 
              sx={{ color: descriptionColorFromSettings, mt: 1 }}
            >
              {editData.description}
            </Typography>
          )}
        </Box>
      </AnimationWrapper>
    </EditableElementWrapper>
  );
};

// Эффект печатной машинки
export const TypewriterText = ({ 
  texts = ['Добро пожаловать!', 'Мы рады видеть вас', 'На нашем сайте'],
  speed = 150,
  pauseTime = 2000,
  repeat = true,
  fontSize = 32,
  fontWeight = 'normal',
  fontFamily = 'Courier New, monospace',
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
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [localEditing, setLocalEditing] = useState(false);
  const [editData, setEditData] = useState({ 
    texts, 
    speed, 
    pauseTime, 
    repeat, 
    fontSize,
    fontWeight,
    fontFamily,
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
      texts, speed, pauseTime, repeat, fontSize, fontWeight, fontFamily,
      colorSettings, animationSettings 
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

  // Опции выравнивания текста
  const textAlignOptions = [
    { value: 'left', label: 'По левому краю' },
    { value: 'center', label: 'По центру' },
    { value: 'right', label: 'По правому краю' }
  ];

  // Опции семейства шрифтов
  const fontFamilyOptions = [
    { value: 'Courier New, monospace', label: 'Courier New (моноширинный)' },
    { value: 'Times New Roman, serif', label: 'Times New Roman' },
    { value: 'Arial, sans-serif', label: 'Arial' },
    { value: 'Helvetica, sans-serif', label: 'Helvetica' },
    { value: 'Georgia, serif', label: 'Georgia' },
    { value: 'Verdana, sans-serif', label: 'Verdana' }
  ];

  const isCurrentlyEditing = isEditing || localEditing;

  // 🔄 РЕАКТИВНОСТЬ: Обновляем локальные настройки при изменении colorSettings
  useEffect(() => {
    if (JSON.stringify(colorSettings) !== JSON.stringify(editData.colorSettings)) {
      console.log('🔄 [TypewriterText] Обновление colorSettings:', colorSettings);
      setEditData(prev => ({
        ...prev,
        colorSettings: colorSettings || {}
      }));
    }
  }, [colorSettings]);

  useEffect(() => {
    if (isCurrentlyEditing) return; // Останавливаем анимацию в режиме редактирования
    
    const currentText = editData.texts[currentTextIndex];
    
    if (!isDeleting && currentCharIndex < currentText.length) {
      const timer = setTimeout(() => {
        setCurrentCharIndex(currentCharIndex + 1);
      }, editData.speed);
      return () => clearTimeout(timer);
    } else if (!isDeleting && currentCharIndex === currentText.length) {
      const timer = setTimeout(() => {
        setIsDeleting(true);
      }, editData.pauseTime);
      return () => clearTimeout(timer);
    } else if (isDeleting && currentCharIndex > 0) {
      const timer = setTimeout(() => {
        setCurrentCharIndex(currentCharIndex - 1);
      }, editData.speed / 2);
      return () => clearTimeout(timer);
    } else if (isDeleting && currentCharIndex === 0) {
      setIsDeleting(false);
      if (editData.repeat || currentTextIndex < editData.texts.length - 1) {
        setCurrentTextIndex((currentTextIndex + 1) % editData.texts.length);
      }
    }
  }, [currentTextIndex, currentCharIndex, isDeleting, editData.texts, editData.speed, editData.pauseTime, editData.repeat, isEditing, localEditing]);

  const currentText = editData.texts[currentTextIndex];
  const displayText = currentText ? currentText.substring(0, currentCharIndex) : '';

  // Применяем настройки фона из colorSettings
  const currentColorSettings = editData.colorSettings || {};
  const containerStyles = { 
    minHeight: '60px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center'
  };
  
  if (currentColorSettings.sectionBackground?.enabled) {
    const { sectionBackground } = currentColorSettings;
    if (sectionBackground.useGradient) {
      containerStyles.background = `linear-gradient(${sectionBackground.gradientDirection}, ${sectionBackground.gradientColor1}, ${sectionBackground.gradientColor2})`;
    } else {
      containerStyles.backgroundColor = sectionBackground.solidColor;
    }
    containerStyles.opacity = sectionBackground.opacity || 1;
  }

  // Применяем дополнительные настройки
  if (currentColorSettings.borderColor) {
    containerStyles.border = `${currentColorSettings.borderWidth || 1}px solid ${currentColorSettings.borderColor}`;
  }
  if (currentColorSettings.borderRadius !== undefined) {
    containerStyles.borderRadius = `${currentColorSettings.borderRadius}px`;
  }
  if (currentColorSettings.padding !== undefined) {
    containerStyles.padding = `${currentColorSettings.padding}px`;
  }
  if (currentColorSettings.boxShadow) {
    containerStyles.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
  }

  // Получаем цвет текста из ColorSettings или fallback на старые значения
  const textColorFromSettings = currentColorSettings.textFields?.content || '#333333';

  if (isCurrentlyEditing) {
    return (
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
            Редактирование эффекта печатной машинки
          </Typography>
          
          {/* Основные настройки */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>Основные настройки:</Typography>
            
            <TextField
              label="Тексты (один на строку)"
              value={editData.texts.join('\n')}
              onChange={(e) => setEditData({ ...editData, texts: e.target.value.split('\n').filter(t => t.trim()) })}
              multiline
              rows={4}
              fullWidth
              sx={{ mb: 2 }}
              helperText="Введите каждый текст с новой строки"
            />
            
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={6}>
                <Typography variant="body2" gutterBottom>
                  Скорость печати: {editData.speed}мс
                </Typography>
                <Slider
                  value={editData.speed}
                  onChange={(e, value) => setEditData({ ...editData, speed: value })}
                  min={50}
                  max={500}
                  step={10}
                  size="small"
                />
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" gutterBottom>
                  Пауза между текстами: {editData.pauseTime}мс
                </Typography>
                <Slider
                  value={editData.pauseTime}
                  onChange={(e, value) => setEditData({ ...editData, pauseTime: value })}
                  min={500}
                  max={5000}
                  step={100}
                  size="small"
                />
              </Grid>
            </Grid>
            
            <FormControlLabel
              control={
                <Switch
                  checked={editData.repeat}
                  onChange={(e) => setEditData({ ...editData, repeat: e.target.checked })}
                />
              }
              label="Повторять циклично"
              sx={{ mb: 2 }}
            />
          </Box>

          {/* Настройки текста */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>Настройки текста:</Typography>
            
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                  <InputLabel>Шрифт</InputLabel>
                  <Select
                    value={editData.fontFamily}
                    onChange={(e) => setEditData({ ...editData, fontFamily: e.target.value })}
                    label="Шрифт"
                  >
                    {fontFamilyOptions.map((font) => (
                      <MenuItem key={font.value} value={font.value}>
                        {font.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                
                <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                  <InputLabel>Выравнивание</InputLabel>
                  <Select
                    value={editData.textAlign}
                    onChange={(e) => setEditData({ ...editData, textAlign: e.target.value })}
                    label="Выравнивание"
                  >
                    {textAlignOptions.map((align) => (
                      <MenuItem key={align.value} value={align.value}>
                        {align.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2" gutterBottom>
                  Размер шрифта: {editData.fontSize}px
                </Typography>
                <Slider
                  value={editData.fontSize}
                  onChange={(e, value) => setEditData({ ...editData, fontSize: value })}
                  min={12}
                  max={72}
                  size="small"
                />
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Начертание</InputLabel>
                  <Select
                    value={editData.fontWeight}
                    onChange={(e) => setEditData({ ...editData, fontWeight: e.target.value })}
                    label="Начертание"
                  >
                    <MenuItem value="normal">Обычный</MenuItem>
                    <MenuItem value="bold">Жирный</MenuItem>
                    <MenuItem value="lighter">Тонкий</MenuItem>
                    <MenuItem value="bolder">Очень жирный</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>





          {/* Настройки анимации */}
          {constructorMode && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>Настройки анимации:</Typography>
              <AnimationControls
                animationSettings={editData.animationSettings}
                onUpdate={handleAnimationUpdate}
              />
            </Box>
          )}

          <Divider sx={{ my: 3 }} />

          {/* Настройки цветов */}
          <ColorSettings
            title="Настройки цветов печатной машинки"
            colorSettings={editData.colorSettings || {}}
            onUpdate={(newColorSettings) => setEditData({ ...editData, colorSettings: newColorSettings })}
            availableFields={[
              {
                name: 'content',
                label: 'Цвет текста',
                description: 'Цвет анимированного текста',
                defaultColor: '#333333'
              }
            ]}
            defaultColors={{
              textFields: {
                content: '#333333'
              }
            }}
            hideCardBackground={true}
            hideAreaColors={true}
          />
          
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
        <Box style={containerStyles}>
          <Typography 
            sx={{ 
              color: textColorFromSettings,
              fontFamily: editData.fontFamily,
              fontSize: `${editData.fontSize}px`,
              fontWeight: editData.fontWeight,
              minHeight: `${editData.fontSize * 1.2}px`,
              display: 'flex',
              alignItems: 'center'
            }}
          >
            {displayText}
            <span style={{ 
              animation: 'blink 1s infinite',
              marginLeft: '2px',
              color: textColorFromSettings
            }}>|</span>
          </Typography>
          <style>
            {`
              @keyframes blink {
                0%, 50% { opacity: 1; }
                51%, 100% { opacity: 0; }
              }
            `}
          </style>
        </Box>
      </AnimationWrapper>
    </EditableElementWrapper>
  );
};

// Выделенный текст
export const HighlightText = ({ 
  text = 'Это важный текст с выделением',
  fontSize = 16,
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
  const [localEditing, setLocalEditing] = useState(false);
  const [editData, setEditData] = useState({ 
    text, 
    fontSize, 
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
    setEditData({ text, fontSize, colorSettings, animationSettings });
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
      console.log('🔄 [HighlightText] Обновление colorSettings:', colorSettings);
      setEditData(prev => ({
        ...prev,
        colorSettings: colorSettings || {}
      }));
    }
  }, [colorSettings]);

  // Применяем настройки фона из colorSettings
  const currentColorSettings = editData.colorSettings || {};
  const containerStyles = { 
    textAlign: 'center',
    padding: '1rem'
  };
  
  if (currentColorSettings.sectionBackground?.enabled) {
    const { sectionBackground } = currentColorSettings;
    if (sectionBackground.useGradient) {
      containerStyles.background = `linear-gradient(${sectionBackground.gradientDirection}, ${sectionBackground.gradientColor1}, ${sectionBackground.gradientColor2})`;
    } else {
      containerStyles.backgroundColor = sectionBackground.solidColor;
    }
    containerStyles.opacity = sectionBackground.opacity || 1;
  }

  // Применяем дополнительные настройки
  if (currentColorSettings.borderColor) {
    containerStyles.border = `${currentColorSettings.borderWidth || 1}px solid ${currentColorSettings.borderColor}`;
  }
  if (currentColorSettings.borderRadius !== undefined) {
    containerStyles.borderRadius = `${currentColorSettings.borderRadius}px`;
  }
  if (currentColorSettings.padding !== undefined) {
    containerStyles.padding = `${currentColorSettings.padding}px`;
  }
  if (currentColorSettings.boxShadow) {
    containerStyles.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
  }

  // Получаем цвета из ColorSettings или fallback на старые значения
  const textColorFromSettings = currentColorSettings.textFields?.content || '#333333';
  const highlightColorFromSettings = currentColorSettings.textFields?.highlight || '#ffeb3b';

  if (isCurrentlyEditing) {
    return (
      <Paper sx={{ p: 3, mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Редактирование выделенного текста
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Основные настройки */}
          <Box>
            <Typography variant="subtitle2" gutterBottom>Основные настройки:</Typography>
            
            <TextField
              fullWidth
              label="Текст"
            value={editData.text}
            onChange={(e) => setEditData({ ...editData, text: e.target.value })}
              multiline
              rows={2}
              sx={{ mb: 2 }}
            />
            
            <Typography variant="body2" gutterBottom>
              Размер шрифта: {editData.fontSize}px
            </Typography>
            <Slider
            value={editData.fontSize}
              onChange={(e, value) => setEditData({ ...editData, fontSize: value })}
              min={12}
              max={72}
              size="small"
              sx={{ mb: 2 }}
            />
          </Box>

          {/* Настройки анимации */}
          {constructorMode && (
            <Box>
              <Typography variant="subtitle2" gutterBottom>Настройки анимации:</Typography>
            <AnimationControls
              animationSettings={editData.animationSettings}
              onUpdate={handleAnimationUpdate}
            />
            </Box>
          )}

          <Divider sx={{ my: 3 }} />

          {/* Настройки цветов */}
          <ColorSettings
            title="Настройки цветов выделенного текста"
            colorSettings={editData.colorSettings || {}}
            onUpdate={(newColorSettings) => setEditData({ ...editData, colorSettings: newColorSettings })}
            availableFields={[
              {
                name: 'content',
                label: 'Цвет текста',
                description: 'Цвет основного текста',
                defaultColor: '#333333'
              },
              {
                name: 'highlight',
                label: 'Цвет выделения',
                description: 'Цвет фона выделения',
                defaultColor: '#ffeb3b'
              }
            ]}
            defaultColors={{
              textFields: {
                content: '#333333',
                highlight: '#ffeb3b'
              }
            }}
            hideCardBackground={true}
            hideAreaColors={true}
          />

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="contained" onClick={handleSave}>
              Сохранить
            </Button>
            <Button variant="outlined" onClick={handleCancel}>
              Отмена
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
        <Box style={containerStyles}>
          <Typography 
            sx={{ 
              fontSize: `${editData.fontSize}px`,
              color: textColorFromSettings,
              background: highlightColorFromSettings,
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              display: 'inline-block'
            }}
          >
            {editData.text}
          </Typography>
        </Box>
      </AnimationWrapper>
    </EditableElementWrapper>
  );
};

// Markdown редактор
export const MarkdownEditor = ({ 
  content = '# Заголовок\n\nЭто **жирный** текст с *курсивом*.\n\n- Элемент списка 1\n- Элемент списка 2\n\n> Это цитата',
  showPreview = true,
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
    content, 
    showPreview, 
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
    setEditData({ content, showPreview, animationSettings });
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

  const renderMarkdown = (text) => {
    return text
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*)\*/gim, '<em>$1</em>')
      .replace(/^- (.*$)/gim, '<li>$1</li>')
      .replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>')
      .replace(/\n/gim, '<br />');
  };

  if (isCurrentlyEditing) {
    return (
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <textarea
            value={editData.content}
            onChange={(e) => setEditData({ ...editData, content: e.target.value })}
            placeholder="Markdown контент"
            style={{ width: '100%', minHeight: '200px', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', fontFamily: 'monospace' }}
          />
          <label>
            <input
              type="checkbox"
              checked={editData.showPreview}
              onChange={(e) => setEditData({ ...editData, showPreview: e.target.checked })}
            />
            Показывать предпросмотр
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
        <Box>
          {showPreview ? (
            <div 
              dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
              style={{ lineHeight: 1.6 }}
            />
          ) : (
            <pre style={{ 
              whiteSpace: 'pre-wrap', 
              fontFamily: 'monospace',
              background: '#f5f5f5',
              padding: '1rem',
              borderRadius: '4px'
            }}>
              {content}
            </pre>
          )}
        </Box>
      </AnimationWrapper>
    </EditableElementWrapper>
  );
};

// Редактор кода
export const CodeEditor = ({ 
  code = 'function hello() {\n  console.log("Привет, мир!");\n}',
  language = 'javascript',
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
    code, 
    language, 
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
    setEditData({ code, language, animationSettings });
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

  const getLanguageColor = (lang) => {
    const colors = {
      javascript: '#f7df1e',
      python: '#3776ab',
      html: '#e34f26',
      css: '#1572b6',
      json: '#000000',
      markdown: '#000000'
    };
    return colors[lang] || '#000000';
  };

  if (isCurrentlyEditing) {
    return (
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <select
            value={editData.language}
            onChange={(e) => setEditData({ ...editData, language: e.target.value })}
            style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="html">HTML</option>
            <option value="css">CSS</option>
            <option value="json">JSON</option>
            <option value="markdown">Markdown</option>
          </select>
          <textarea
            value={editData.code}
            onChange={(e) => setEditData({ ...editData, code: e.target.value })}
            placeholder="Код"
            style={{ width: '100%', minHeight: '200px', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', fontFamily: 'monospace', fontSize: '14px', lineHeight: 1.4 }}
          />
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
        <Box>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1, 
            mb: 1,
            p: 1,
            bgcolor: '#f5f5f5',
            borderRadius: '4px 4px 0 0'
          }}>
            <Box sx={{ 
              width: 12, 
              height: 12, 
              borderRadius: '50%', 
              bgcolor: getLanguageColor(language) 
            }} />
            <Typography variant="caption" sx={{ textTransform: 'uppercase' }}>
              {language}
            </Typography>
          </Box>
          <pre style={{ 
            margin: 0,
            padding: '1rem',
            background: '#2d3748',
            color: '#e2e8f0',
            borderRadius: '0 0 4px 4px',
            fontFamily: 'monospace',
            fontSize: '14px',
            lineHeight: 1.4,
            overflow: 'auto'
          }}>
            {code}
          </pre>
        </Box>
      </AnimationWrapper>
    </EditableElementWrapper>
  );
}; 
