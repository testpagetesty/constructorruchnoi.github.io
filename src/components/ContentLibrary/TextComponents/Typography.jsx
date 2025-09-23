import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography as MuiTypography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Slider,
  Paper,
  Button,
  ButtonGroup,
  Chip,
  IconButton,
  Tooltip,
  Grid,
  Divider
} from '@mui/material';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import FormatAlignJustifyIcon from '@mui/icons-material/FormatAlignJustify';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import AnimationWrapper from '../AnimationWrapper';
import AnimationControls from '../AnimationControls';
import ColorSettings from './ColorSettings';

const Typography = ({ 
  variant = 'h2',
  text = 'Заголовок секции',
  editable = true,
  customStyles = {},
  colorSettings = {},
  onUpdate,
  animationSettings = {},
  constructorMode = false,
  isEditing = false,
  onSave = null,
  onCancel = null
  }) => {
  const [localEditing, setLocalEditing] = useState(false);
  const [currentText, setCurrentText] = useState(text);
  const [currentAnimationSettings, setCurrentAnimationSettings] = useState(animationSettings || {
    animationType: 'fadeIn',
    delay: 0,
    triggerOnView: true,
    triggerOnce: true,
    threshold: 0.1,
    disabled: false
  });
  const [styles, setStyles] = useState({
    variant: variant,
    fontFamily: 'inherit',
    fontSize: 'inherit',
    fontWeight: 'normal',
    fontStyle: 'normal',
    textDecoration: 'none',
    textAlign: 'inherit',
    color: '#000000',
    lineHeight: 1.5,
    letterSpacing: 0,
    textTransform: 'none',
    ...customStyles
  });
  const [currentColorSettings, setCurrentColorSettings] = useState(colorSettings || {});

  // Принудительное обновление при изменении colorSettings
  useEffect(() => {
    console.log('🔄 [Typography] colorSettings изменились:', colorSettings);
    
    // Принудительно обновляем состояние ТОЛЬКО если действительно изменились
    if (JSON.stringify(currentColorSettings) !== JSON.stringify(colorSettings || {})) {
      setCurrentColorSettings(colorSettings || {});
    }
    
  }, [colorSettings]);

  // Принудительное обновление при изменении customStyles
  useEffect(() => {
    console.log('🔄 [Typography] customStyles изменились:', customStyles);
    
    // Принудительно обновляем состояние ТОЛЬКО если действительно изменились
    if (JSON.stringify(customStyles) !== JSON.stringify(styles)) {
      setStyles(prev => ({
        ...prev,
        ...customStyles
      }));
    }
    
  }, [customStyles]);

  // Принудительное обновление при изменении text
  useEffect(() => {
    console.log('🔄 [Typography] text изменился:', text);
    setCurrentText(text);
  }, [text]);

  const handleStyleChange = (property, value) => {
    const newStyles = { ...styles, [property]: value };
    setStyles(newStyles);
    if (onUpdate) {
      onUpdate({
        text: currentText,
        styles: newStyles
      });
    }
  };

  const handleTextChange = (newText) => {
    setCurrentText(newText);
    if (onUpdate) {
      onUpdate({
        text: newText,
        styles: styles
      });
    }
  };

  const handleFormatToggle = (property, value) => {
    const currentValue = styles[property];
    const newValue = currentValue === value ? 'normal' : value;
    handleStyleChange(property, newValue);
  };

  const handleDoubleClick = () => {
    if (constructorMode) {
      setLocalEditing(true);
    }
  };

  const handleSave = () => {
    setLocalEditing(false);
    const newData = {
      text: currentText,
      styles: styles,
      colorSettings: currentColorSettings,
      animationSettings: currentAnimationSettings
    };
    if (onSave) {
      onSave(newData);
    } else if (onUpdate) {
      onUpdate(newData);
    }
  };

  const handleColorUpdate = (newColorSettings) => {
    setCurrentColorSettings(newColorSettings);
    if (onUpdate) {
      onUpdate({
        text: currentText,
        styles: styles,
        colorSettings: newColorSettings,
        animationSettings: currentAnimationSettings
      });
    }
  };

  const handleCancel = () => {
    setLocalEditing(false);
    setCurrentText(text);
    setStyles({
      variant: variant,
      fontFamily: 'inherit',
      fontSize: 'inherit',
      fontWeight: 'normal',
      fontStyle: 'normal',
      textDecoration: 'none',
      textAlign: 'inherit',
      color: '#000000',
      lineHeight: 1.5,
      letterSpacing: 0,
      textTransform: 'none',
      ...customStyles
    });
    setCurrentAnimationSettings(animationSettings);
    if (onCancel) {
      onCancel();
    }
  };

  const typographyVariants = [
    { value: 'h1', label: 'Заголовок 1' },
    { value: 'h2', label: 'Заголовок 2' },
    { value: 'h3', label: 'Заголовок 3' },
    { value: 'h4', label: 'Заголовок 4' },
    { value: 'h5', label: 'Заголовок 5' },
    { value: 'h6', label: 'Заголовок 6' },
    { value: 'subtitle1', label: 'Подзаголовок 1' },
    { value: 'subtitle2', label: 'Подзаголовок 2' },
    { value: 'body1', label: 'Основной текст' },
    { value: 'body2', label: 'Малый текст' },
    { value: 'caption', label: 'Подпись' },
    { value: 'overline', label: 'Надпись' }
  ];

  const fontFamilies = [
    'inherit',
    'Arial, sans-serif',
    'Helvetica, sans-serif',
    'Times New Roman, serif',
    'Georgia, serif',
    'Verdana, sans-serif',
    'Courier New, monospace',
    'Roboto, sans-serif',
    'Open Sans, sans-serif',
    'Lato, sans-serif',
    'Montserrat, sans-serif',
    'Playfair Display, serif',
    'Oswald, sans-serif',
    'Source Sans Pro, sans-serif'
  ];

  const textTransforms = [
    { value: 'none', label: 'Без изменений' },
    { value: 'uppercase', label: 'ВЕРХНИЙ РЕГИСТР' },
    { value: 'lowercase', label: 'нижний регистр' },
    { value: 'capitalize', label: 'Первая Буква Заглавная' }
  ];

  const renderTypography = () => {
    // ПРИНУДИТЕЛЬНОЕ ПРИМЕНЕНИЕ COLOR SETTINGS (максимальный приоритет)
    const textColor = currentColorSettings.textFields?.text || 
                     currentColorSettings.textFields?.content || 
                     currentColorSettings.textFields?.title || 
                     styles.color;
    
    // ПРИНУДИТЕЛЬНОЕ ПРИМЕНЕНИЕ РАЗМЕРА И ВЕСА ШРИФТА
    const fontSize = currentColorSettings.textFields?.fontSize || styles.fontSize;
    const fontWeight = currentColorSettings.textFields?.fontWeight || styles.fontWeight;
    const fontFamily = currentColorSettings.textFields?.fontFamily || styles.fontFamily;
    
    // Логирование для отладки
    console.log('🎨 [Typography] Применяем стили:', {
      currentColorSettings,
      textColor,
      fontSize,
      fontWeight,
      fontFamily,
      styles
    });
    
    // Стили контейнера с фоном
    const containerStyles = {};
    if (currentColorSettings.sectionBackground?.enabled) {
      const { sectionBackground } = currentColorSettings;
      if (sectionBackground.useGradient) {
        containerStyles.background = `linear-gradient(${sectionBackground.gradientDirection}, ${sectionBackground.gradientColor1}, ${sectionBackground.gradientColor2})`;
      } else {
        containerStyles.backgroundColor = sectionBackground.solidColor;
      }
      containerStyles.opacity = sectionBackground.opacity;
      containerStyles.border = `${currentColorSettings.borderWidth || 1}px solid ${currentColorSettings.borderColor || '#e0e0e0'}`;
      containerStyles.borderRadius = `${currentColorSettings.borderRadius || 8}px`;
      containerStyles.padding = `${currentColorSettings.padding || 16}px`;
      if (currentColorSettings.boxShadow) {
        containerStyles.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
      }
    }

    const textStyles = {
      fontFamily: fontFamily,
      fontSize: fontSize === 'inherit' ? undefined : fontSize,
      fontWeight: fontWeight,
      fontStyle: styles.fontStyle,
      textDecoration: styles.textDecoration,
      textAlign: styles.textAlign,
      color: textColor,
      lineHeight: styles.lineHeight,
      letterSpacing: `${styles.letterSpacing}px`,
      textTransform: styles.textTransform,
      cursor: editable ? 'pointer' : 'default'
    };

    const typography = (
      <MuiTypography
        variant={styles.variant}
        sx={textStyles}
        onClick={() => editable && !constructorMode && setLocalEditing(true)}
        onDoubleClick={handleDoubleClick}
      >
        {currentText}
      </MuiTypography>
    );

    // Если фон включен, оборачиваем в контейнер
    if (currentColorSettings.sectionBackground?.enabled) {
      return (
        <Box sx={containerStyles}>
          {typography}
        </Box>
      );
    }

    return typography;
  };

  const isCurrentlyEditing = isEditing || localEditing;

  return (
    <AnimationWrapper {...currentAnimationSettings}>
      <Box className="typography-container" sx={{ position: 'relative', width: '100%' }}>
        {/* Превью текста */}
        {!isCurrentlyEditing && (
          <Box sx={{ position: 'relative' }}>
            {renderTypography()}
            
            {editable && !constructorMode && (
              <Box 
                sx={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  opacity: 0,
                  transition: 'opacity 0.2s ease',
                  bgcolor: 'rgba(0,0,0,0.8)',
                  borderRadius: 1,
                  p: 0.5,
                  '.typography-container:hover &': {
                    opacity: 1
                  }
                }}
              >
                <Tooltip title="Редактировать">
                  <IconButton 
                    size="small" 
                    sx={{ color: 'white' }}
                    onClick={() => setLocalEditing(true)}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            )}
          </Box>
        )}

      {/* Редактор */}
      {isCurrentlyEditing && (
        <Paper sx={{ p: 2, mt: 2, border: '2px solid #1976d2' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <MuiTypography variant="h6" color="primary">
              Редактирование текста
            </MuiTypography>
            <Chip label="Активно" color="primary" size="small" />
          </Box>

          {/* Текст */}
          <TextField
            fullWidth
            multiline
            rows={2}
            value={currentText}
            onChange={(e) => handleTextChange(e.target.value)}
            label="Содержимое"
            sx={{ mb: 2 }}
          />

          {/* Тип элемента */}
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Тип элемента</InputLabel>
            <Select
              value={styles.variant}
              label="Тип элемента"
              onChange={(e) => handleStyleChange('variant', e.target.value)}
            >
              {typographyVariants.map(variant => (
                <MenuItem key={variant.value} value={variant.value}>
                  {variant.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Шрифт */}
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Шрифт</InputLabel>
            <Select
              value={styles.fontFamily}
              label="Шрифт"
              onChange={(e) => handleStyleChange('fontFamily', e.target.value)}
            >
              {fontFamilies.map(font => (
                <MenuItem key={font} value={font} sx={{ fontFamily: font }}>
                  {font === 'inherit' ? 'По умолчанию' : font.split(',')[0]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Форматирование */}
          <Box sx={{ mb: 2 }}>
            <MuiTypography variant="body2" gutterBottom>
              Форматирование
            </MuiTypography>
            <ButtonGroup size="small" sx={{ mb: 1 }}>
              <Button
                variant={styles.fontWeight === 'bold' ? 'contained' : 'outlined'}
                onClick={() => handleFormatToggle('fontWeight', 'bold')}
              >
                <FormatBoldIcon />
              </Button>
              <Button
                variant={styles.fontStyle === 'italic' ? 'contained' : 'outlined'}
                onClick={() => handleFormatToggle('fontStyle', 'italic')}
              >
                <FormatItalicIcon />
              </Button>
              <Button
                variant={styles.textDecoration === 'underline' ? 'contained' : 'outlined'}
                onClick={() => handleFormatToggle('textDecoration', 'underline')}
              >
                <FormatUnderlinedIcon />
              </Button>
            </ButtonGroup>
          </Box>

          {/* Выравнивание */}
          <Box sx={{ mb: 2 }}>
            <MuiTypography variant="body2" gutterBottom>
              Выравнивание
            </MuiTypography>
            <ButtonGroup size="small">
              <Button
                variant={styles.textAlign === 'left' ? 'contained' : 'outlined'}
                onClick={() => handleStyleChange('textAlign', 'left')}
              >
                <FormatAlignLeftIcon />
              </Button>
              <Button
                variant={styles.textAlign === 'center' ? 'contained' : 'outlined'}
                onClick={() => handleStyleChange('textAlign', 'center')}
              >
                <FormatAlignCenterIcon />
              </Button>
              <Button
                variant={styles.textAlign === 'right' ? 'contained' : 'outlined'}
                onClick={() => handleStyleChange('textAlign', 'right')}
              >
                <FormatAlignRightIcon />
              </Button>
              <Button
                variant={styles.textAlign === 'justify' ? 'contained' : 'outlined'}
                onClick={() => handleStyleChange('textAlign', 'justify')}
              >
                <FormatAlignJustifyIcon />
              </Button>
            </ButtonGroup>
          </Box>

          {/* Размер шрифта */}
          <Box sx={{ mb: 2 }}>
            <MuiTypography variant="body2" gutterBottom>
              Размер шрифта: {styles.fontSize === 'inherit' ? 'По умолчанию' : styles.fontSize}
            </MuiTypography>
            <Slider
              value={styles.fontSize === 'inherit' ? 16 : parseInt(styles.fontSize)}
              onChange={(_, value) => handleStyleChange('fontSize', `${value}px`)}
              min={10}
              max={72}
              step={1}
              marks={[
                { value: 10, label: '10px' },
                { value: 24, label: '24px' },
                { value: 48, label: '48px' },
                { value: 72, label: '72px' }
              ]}
            />
          </Box>

          {/* Высота строки */}
          <Box sx={{ mb: 2 }}>
            <MuiTypography variant="body2" gutterBottom>
              Высота строки: {styles.lineHeight}
            </MuiTypography>
            <Slider
              value={styles.lineHeight}
              onChange={(_, value) => handleStyleChange('lineHeight', value)}
              min={1}
              max={3}
              step={0.1}
              marks={[
                { value: 1, label: '1' },
                { value: 1.5, label: '1.5' },
                { value: 2, label: '2' },
                { value: 3, label: '3' }
              ]}
            />
          </Box>

          {/* Межбуквенное расстояние */}
          <Box sx={{ mb: 2 }}>
            <MuiTypography variant="body2" gutterBottom>
              Межбуквенное расстояние: {styles.letterSpacing}px
            </MuiTypography>
            <Slider
              value={styles.letterSpacing}
              onChange={(_, value) => handleStyleChange('letterSpacing', value)}
              min={-2}
              max={10}
              step={0.5}
              marks={[
                { value: -2, label: '-2px' },
                { value: 0, label: '0px' },
                { value: 5, label: '5px' },
                { value: 10, label: '10px' }
              ]}
            />
          </Box>

          {/* Регистр */}
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Регистр</InputLabel>
            <Select
              value={styles.textTransform}
              label="Регистр"
              onChange={(e) => handleStyleChange('textTransform', e.target.value)}
            >
              {textTransforms.map(transform => (
                <MenuItem key={transform.value} value={transform.value}>
                  {transform.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Предварительный просмотр */}
          <Box sx={{ mb: 2, p: 2, border: '1px dashed #ccc', borderRadius: 1 }}>
            <MuiTypography variant="body2" color="text.secondary" gutterBottom>
              Предварительный просмотр:
            </MuiTypography>
            {renderTypography()}
          </Box>

          {/* Настройки анимации */}
          <AnimationControls
            animationSettings={currentAnimationSettings}
            onUpdate={setCurrentAnimationSettings}
            expanded={false}
          />

          <Divider sx={{ my: 3 }} />

          {/* Настройки цветов */}
          <ColorSettings
            title="Настройки цветов заголовка"
            colorSettings={currentColorSettings}
            onUpdate={handleColorUpdate}
            availableFields={[
              {
                name: 'text',
                label: 'Цвет текста',
                description: 'Основной цвет текста заголовка',
                defaultColor: styles.color
              }
            ]}
            defaultColors={{
              text: styles.color
            }}
          />

          {/* Кнопки */}
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
            <Button onClick={handleCancel}>
              Отмена
            </Button>
            <Button 
              variant="contained" 
              startIcon={<SaveIcon />}
              onClick={handleSave}
            >
              Сохранить
            </Button>
          </Box>
        </Paper>
      )}
    </Box>
    </AnimationWrapper>
  );
};

export default Typography; 