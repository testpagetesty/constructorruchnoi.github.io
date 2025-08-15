import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, TextField, Grid, FormControl, InputLabel, Select, MenuItem, FormControlLabel, Switch, Slider, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import EditableElementWrapper from './EditableElementWrapper';
import AnimationWrapper from './AnimationWrapper';
import AnimationControls from './AnimationControls';
import { SketchPicker } from 'react-color';

// Градиентный текст
export const GradientText = ({ 
  text = 'Градиентный текст', 
  direction = 'to right', 
  color1 = '#ff6b6b', 
  color2 = '#4ecdc4',
  fontSize = 24,
  fontWeight = 'bold',
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

  const StyledGradientText = styled(Typography)({
    background: `linear-gradient(${editData.direction}, ${editData.color1}, ${editData.color2})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    fontSize: `${editData.fontSize}px`,
    fontWeight: editData.fontWeight,
    cursor: isPreview ? 'default' : 'pointer',
    '&:hover': {
      opacity: isPreview ? 1 : 0.8
    }
  });

  if (isCurrentlyEditing) {
    return (
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <input
            type="text"
            value={editData.text}
            onChange={(e) => setEditData({ ...editData, text: e.target.value })}
            placeholder="Текст"
            style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
          />
          <select
            value={editData.direction}
            onChange={(e) => setEditData({ ...editData, direction: e.target.value })}
            style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
          >
            <option value="to right">Слева направо</option>
            <option value="to left">Справа налево</option>
            <option value="to bottom">Сверху вниз</option>
            <option value="to top">Снизу вверх</option>
            <option value="45deg">Диагональ 45°</option>
            <option value="135deg">Диагональ 135°</option>
          </select>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <input
              type="color"
              value={editData.color1}
              onChange={(e) => setEditData({ ...editData, color1: e.target.value })}
              style={{ width: '50%', padding: '4px' }}
            />
            <input
              type="color"
              value={editData.color2}
              onChange={(e) => setEditData({ ...editData, color2: e.target.value })}
              style={{ width: '50%', padding: '4px' }}
            />
          </Box>
          <input
            type="number"
            value={editData.fontSize}
            onChange={(e) => setEditData({ ...editData, fontSize: parseInt(e.target.value) })}
            placeholder="Размер шрифта"
            style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
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
        <StyledGradientText>
          {editData.text}
        </StyledGradientText>
      </AnimationWrapper>
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
          <Box sx={{ display: 'flex', gap: 1 }}>
            <input
              type="color"
              value={editData.titleColor}
              onChange={(e) => setEditData({ ...editData, titleColor: e.target.value })}
              style={{ width: '50%', padding: '4px' }}
            />
            <input
              type="color"
              value={editData.countColor}
              onChange={(e) => setEditData({ ...editData, countColor: e.target.value })}
              style={{ width: '50%', padding: '4px' }}
            />
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
        <Box sx={{ textAlign: 'center', py: 2 }}>
          <Typography 
            variant="h6" 
            sx={{ mb: 1, color: titleColor }}
          >
            {title}
          </Typography>
          <Typography 
            variant="h2" 
            sx={{ 
              fontWeight: 'bold', 
              color: countColor,
              fontSize: '3rem'
            }}
          >
            {count} {suffix}
          </Typography>
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
  textColor = '#333333',
  fontSize = 32,
  fontWeight = 'normal',
  fontFamily = 'Courier New, monospace',
  backgroundColor = '#ffffff',
  backgroundType = 'solid', // 'solid' или 'gradient'
  gradientColors = ['#ffffff', '#f5f5f5'],
  gradientDirection = 'to bottom',
  showBackground = false,
  borderRadius = 8,
  padding = 20,
  textAlign = 'center',
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
    textColor,
    fontSize,
    fontWeight,
    fontFamily,
    backgroundColor,
    backgroundType,
    gradientColors,
    gradientDirection,
    showBackground,
    borderRadius,
    padding,
    textAlign,
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
      texts, speed, pauseTime, repeat, textColor, fontSize, fontWeight, fontFamily,
      backgroundColor, backgroundType, gradientColors, gradientDirection, 
      showBackground, borderRadius, padding, textAlign, animationSettings 
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
  }, [currentTextIndex, currentCharIndex, isDeleting, editData.texts, editData.speed, editData.pauseTime, editData.repeat, isCurrentlyEditing]);

  const currentText = editData.texts[currentTextIndex];
  const displayText = currentText ? currentText.substring(0, currentCharIndex) : '';

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
                <Typography variant="body2" gutterBottom>Цвет текста:</Typography>
                <SketchPicker
                  color={editData.textColor}
                  onChange={(color) => setEditData({ ...editData, textColor: color.hex })}
                  width="100%"
                  disableAlpha
                />
              </Grid>
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
                    <SketchPicker
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
                        <SketchPicker
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
                        <SketchPicker
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
              </>
            )}
          </Box>

          {/* Настройки отступов и радиуса */}
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
          {constructorMode && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>Настройки анимации:</Typography>
              <AnimationControls
                animationSettings={editData.animationSettings}
                onUpdate={handleAnimationUpdate}
              />
            </Box>
          )}
          
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
        <Box 
          sx={{ 
            textAlign: editData.textAlign,
            minHeight: '60px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: editData.textAlign === 'left' ? 'flex-start' : 
                            editData.textAlign === 'right' ? 'flex-end' : 'center',
            p: `${editData.padding}px`,
            borderRadius: `${editData.borderRadius}px`,
            ...getBackgroundStyle(),
            ...(editData.showBackground ? {} : { background: 'transparent' })
          }}
        >
          <Typography 
            sx={{ 
              color: editData.textColor,
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
              marginLeft: '2px'
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
  highlightColor = '#ffeb3b',
  textColor = '#333333',
  fontSize = 16,
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
    highlightColor, 
    textColor, 
    fontSize, 
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
    setEditData({ text, highlightColor, textColor, fontSize, animationSettings });
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
            value={editData.text}
            onChange={(e) => setEditData({ ...editData, text: e.target.value })}
            placeholder="Текст"
            style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
          />
          <input
            type="number"
            value={editData.fontSize}
            onChange={(e) => setEditData({ ...editData, fontSize: parseInt(e.target.value) })}
            placeholder="Размер шрифта"
            style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
          />
          <Box sx={{ display: 'flex', gap: 1 }}>
            <input
              type="color"
              value={editData.highlightColor}
              onChange={(e) => setEditData({ ...editData, highlightColor: e.target.value })}
              style={{ width: '50%', padding: '4px' }}
            />
            <input
              type="color"
              value={editData.textColor}
              onChange={(e) => setEditData({ ...editData, textColor: e.target.value })}
              style={{ width: '50%', padding: '4px' }}
            />
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
        <Box sx={{ textAlign: 'center', py: 1 }}>
          <Typography 
            sx={{ 
              fontSize: `${fontSize}px`,
              color: textColor,
              background: highlightColor,
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              display: 'inline-block'
            }}
          >
            {text}
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
