import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  Tooltip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Chip,
  Switch,
  FormControlLabel,
  Divider
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import StarIcon from '@mui/icons-material/Star';
import SecurityIcon from '@mui/icons-material/Security';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import FavoriteIcon from '@mui/icons-material/Favorite';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import EditableElementWrapper from '../EditableElementWrapper';
import AnimationWrapper from '../AnimationWrapper';
import AnimationControls from '../AnimationControls';
import ColorSettings from './ColorSettings';

const Callout = ({
  title = 'Информационный блок',
  content = 'Это пример информационного блока. Замените этот текст на нужное вам содержимое.',
  footnote = '',
  type = 'info',
  size = 'medium',
  showIcon = true,
  dismissible = false,
  customIcon = null,

  isCustomType = false,
  customTypeName = '',
  colorSettings = {},
  onUpdate,
  onDismiss,
  editable = true,
  constructorMode = false,
  isEditing = false,
  onSave = null,
  onCancel = null,
  animationSettings = {}
}) => {
  const [currentTitle, setCurrentTitle] = useState(title);
  const [currentContent, setCurrentContent] = useState(content);
  const [currentFootnote, setCurrentFootnote] = useState(footnote);
  const [currentType, setCurrentType] = useState(type);
  const [currentSize, setCurrentSize] = useState(size);
  const [showCalloutIcon, setShowCalloutIcon] = useState(showIcon);
  const [isDismissible, setIsDismissible] = useState(dismissible);

  const [useCustomColors, setUseCustomColors] = useState(false);
  const [currentBgColor, setCurrentBgColor] = useState('');
  const [currentBorderColor, setCurrentBorderColor] = useState('');
  const [currentTextColor, setCurrentTextColor] = useState('');
  const [currentColorSettings, setCurrentColorSettings] = useState(colorSettings || {});
  const [localEditing, setLocalEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isCustomTypeState, setIsCustomType] = useState(isCustomType);
  const [customTypeNameState, setCustomTypeName] = useState(customTypeName);
  const [currentAnimationSettings, setCurrentAnimationSettings] = useState(animationSettings || {
    animationType: 'fadeIn',
    delay: 0,
    triggerOnView: true,
    triggerOnce: true,
    threshold: 0.1,
    disabled: false
  });

  // Синхронизируем состояние с пропсами
  useEffect(() => {
    // Обновляем состояние из props только если не в режиме редактирования и не сохраняем
    if (!localEditing && !isSaving) {
      setCurrentTitle(title);
      setCurrentContent(content);
      setCurrentFootnote(footnote);
      
      // Обновляем colorSettings только если они действительно изменились
      if (JSON.stringify(currentColorSettings) !== JSON.stringify(colorSettings || {})) {
        setCurrentColorSettings(colorSettings || {});
      }
      
      setIsCustomType(isCustomType);
      setCustomTypeName(customTypeName);
    }
  }, [title, content, footnote, colorSettings, isCustomType, customTypeName]);



  const calloutTypes = [
    {
      value: 'info',
      label: 'Информация',
      icon: InfoIcon,
      backgroundColor: 'rgba(0,0,0,0.85)',
      borderColor: '#c41e3a',
      textColor: '#ffffff',
      iconColor: '#ffd700'
    },
    {
      value: 'warning',
      label: 'Предупреждение',
      icon: WarningIcon,
      backgroundColor: 'rgba(0,0,0,0.85)',
      borderColor: '#ffd700',
      textColor: '#ffffff',
      iconColor: '#ffd700'
    },
    {
      value: 'error',
      label: 'Ошибка',
      icon: ErrorIcon,
      backgroundColor: 'rgba(0,0,0,0.85)',
      borderColor: '#c41e3a',
      textColor: '#ffffff',
      iconColor: '#c41e3a'
    },
    {
      value: 'success',
      label: 'Успех',
      icon: CheckCircleIcon,
      backgroundColor: 'rgba(0,0,0,0.85)',
      borderColor: '#28a745',
      textColor: '#ffffff',
      iconColor: '#28a745'
    },
    {
      value: 'tip',
      label: 'Совет',
      icon: LightbulbIcon,
      backgroundColor: 'rgba(0,0,0,0.85)',
      borderColor: '#ffd700',
      textColor: '#ffffff',
      iconColor: '#ffd700'
    },
    {
      value: 'question',
      label: 'Вопрос',
      icon: QuestionMarkIcon,
      backgroundColor: 'rgba(0,0,0,0.85)',
      borderColor: '#1976d2',
      textColor: '#ffffff',
      iconColor: '#ffd700'
    },
    {
      value: 'important',
      label: 'Важно',
      icon: StarIcon,
      backgroundColor: 'rgba(0,0,0,0.85)',
      borderColor: '#ffd700',
      textColor: '#ffffff',
      iconColor: '#ffd700'
    },
    {
      value: 'security',
      label: 'Безопасность',
      icon: SecurityIcon,
      backgroundColor: 'rgba(0,0,0,0.85)',
      borderColor: '#28a745',
      textColor: '#ffffff',
      iconColor: '#28a745'
    },
    {
      value: 'trending',
      label: 'Тренд',
      icon: TrendingUpIcon,
      backgroundColor: 'rgba(0,0,0,0.85)',
      borderColor: '#ffd700',
      textColor: '#ffffff',
      iconColor: '#ffd700'
    },
    {
      value: 'favorite',
      label: 'Избранное',
      icon: FavoriteIcon,
      backgroundColor: 'rgba(0,0,0,0.85)',
      borderColor: '#ffd700',
      textColor: '#ffffff',
      iconColor: '#ffd700'
    }
  ];

  const sizes = [
    { value: 'small', label: 'Маленький', padding: '12px', fontSize: '14px' },
    { value: 'medium', label: 'Средний', padding: '16px', fontSize: '16px' },
    { value: 'large', label: 'Большой', padding: '24px', fontSize: '18px' }
  ];

  const getCurrentTypeConfig = () => {
    if (isCustomTypeState && customTypeNameState) {
      return {
        value: 'custom',
        label: customTypeNameState,
        icon: InfoIcon,
        backgroundColor: currentBgColor || '#f5f5f5',
        borderColor: currentBorderColor || '#999999',
        textColor: currentTextColor || '#333333',
        iconColor: currentBorderColor || '#999999'
      };
    }
    return calloutTypes.find(t => t.value === currentType) || calloutTypes[0];
  };

  const getCalloutStyles = () => {
    const typeConfig = getCurrentTypeConfig();
    const sizeConfig = sizes.find(s => s.value === currentSize) || sizes[1];

    let styles = {
      padding: sizeConfig.padding,
      fontSize: sizeConfig.fontSize
    };

    // Применяем настройки фона из colorSettings
    if (currentColorSettings && currentColorSettings.sectionBackground && currentColorSettings.sectionBackground.enabled) {
      const { sectionBackground } = currentColorSettings;
      
      if (sectionBackground.useGradient) {
        styles.background = `linear-gradient(${sectionBackground.gradientDirection}, ${sectionBackground.gradientColor1}, ${sectionBackground.gradientColor2})`;
      } else {
        styles.backgroundColor = sectionBackground.solidColor;
      }
      
      styles.opacity = sectionBackground.opacity;
    } else if (useCustomColors) {
      styles.backgroundColor = currentBgColor || typeConfig.backgroundColor;
    } else {
      styles.backgroundColor = typeConfig.backgroundColor;
    }

    // Применяем цвета границы и текста
    if (currentColorSettings?.textFields?.border) {
      styles.borderLeft = `4px solid ${currentColorSettings.textFields.border}`;
    } else if (useCustomColors) {
      styles.borderLeft = `4px solid ${currentBorderColor || typeConfig.borderColor}`;
    } else {
      styles.borderLeft = `4px solid ${typeConfig.borderColor}`;
    }

    if (currentColorSettings?.textFields?.content) {
      styles.color = currentColorSettings.textFields.content;
    } else if (useCustomColors) {
      styles.color = currentTextColor || typeConfig.textColor;
    } else {
      styles.color = typeConfig.textColor;
    }

    // Применяем дополнительные настройки
    if (currentColorSettings) {
      if (currentColorSettings.borderColor) {
        styles.border = `${currentColorSettings.borderWidth || 1}px solid ${currentColorSettings.borderColor}`;
      }
      if (currentColorSettings.borderRadius !== undefined) {
        styles.borderRadius = `${currentColorSettings.borderRadius}px`;
      }
      if (currentColorSettings.padding !== undefined) {
        styles.padding = `${currentColorSettings.padding}px`;
      }
      if (currentColorSettings.boxShadow) {
        styles.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
      }
    }

    return styles;
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    if (onDismiss) {
      onDismiss();
    }
  };

  const handleDoubleClick = () => {
    if (constructorMode) {
      setLocalEditing(true);
    }
  };

  const handleCustomTypeNameChange = (e) => {
    const newCustomTypeName = e.target.value;
    setCustomTypeName(newCustomTypeName);
    // Убираем автоматическое обновление - данные обновятся только при сохранении
  };

  const handleSave = () => {
    setIsSaving(true);
    
    const updatedData = {
      title: currentTitle,
      content: currentContent,
      footnote: currentFootnote,
      type: isCustomTypeState ? 'custom' : currentType,
      size: currentSize,
      showIcon: showCalloutIcon,
      dismissible: isDismissible,
      customColors: useCustomColors,
      backgroundColor: currentBgColor,
      borderColor: currentBorderColor,
      textColor: currentTextColor,
      isCustomType: isCustomTypeState,
      customTypeName: customTypeNameState,
      colorSettings: currentColorSettings,
      animationSettings: currentAnimationSettings
    };
    
    if (onSave) {
      onSave(updatedData);
    } else if (onUpdate) {
      onUpdate(updatedData);
    }
    
    // Завершаем сохранение и выходим из режима редактирования
    setTimeout(() => {
      setIsSaving(false);
      setLocalEditing(false);
    }, 50);
  };

  const handleColorUpdate = (newColorSettings) => {
    setCurrentColorSettings(newColorSettings);
    // Вызываем onUpdate только если не в режиме редактирования или если это автосохранение в превью
    if (onUpdate && !localEditing) {
      onUpdate({
        title: currentTitle,
        content: currentContent,
        footnote: currentFootnote,
        type: isCustomTypeState ? 'custom' : currentType,
        size: currentSize,
        showIcon: showCalloutIcon,
        dismissible: isDismissible,
        customColors: useCustomColors,
        backgroundColor: currentBgColor,
        borderColor: currentBorderColor,
        textColor: currentTextColor,
        isCustomType: isCustomTypeState,
        customTypeName: customTypeNameState,
        colorSettings: newColorSettings,
        animationSettings: currentAnimationSettings
      });
    }
  };

  const handleCancel = () => {
    setLocalEditing(false);
    // Сбрасываем к исходным значениям
    setCurrentTitle(title);
    setCurrentContent(content);
    setCurrentType(type);
    setCurrentSize(size);
    setShowCalloutIcon(showIcon);
    setIsDismissible(dismissible);
    // 🔥 ИСПРАВЛЕНИЕ: customColors, backgroundColor, borderColor, textColor не в пропсах, используем значения по умолчанию
    setUseCustomColors(false);
    setCurrentBgColor('');
    setCurrentBorderColor('');
    setCurrentTextColor('');
    setIsCustomType(isCustomType);
    setCustomTypeName(customTypeName);
    setCurrentAnimationSettings(animationSettings || {});
    
    if (onCancel) {
      onCancel();
    }
  };

  const renderCallout = () => {
    const typeConfig = getCurrentTypeConfig();
    const IconComponent = typeConfig.icon;
    const styles = getCalloutStyles();

    return (
      <Paper
        sx={{
          ...styles,
          position: 'relative',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          transition: 'all 0.3s ease',
          '&:hover': editable ? {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          } : {}
        }}
      >
        {/* Кнопка редактирования */}
        {editable && (
          <Box
            sx={{
              position: 'absolute',
              top: 8,
              right: isDismissible ? 40 : 8,
              opacity: 0,
              transition: 'opacity 0.2s ease',
              '.callout-container:hover &': {
                opacity: 1
              }
            }}
          >
            <Tooltip title="Редактировать">
              <IconButton
                size="small"
                onClick={() => setLocalEditing(true)}
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

        {/* Кнопка закрытия */}
        {isDismissible && (
          <Box
            sx={{
              position: 'absolute',
              top: 8,
              right: 8
            }}
          >
            <IconButton
              size="small"
              onClick={handleDismiss}
              sx={{
                backgroundColor: 'rgba(255,255,255,0.9)',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,1)'
                }
              }}
            >
              ×
            </IconButton>
          </Box>
        )}

        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          {/* Иконка */}
          {showCalloutIcon && (
            <Box sx={{ mt: 0.5 }}>
              <IconComponent
                sx={{
                  color: currentColorSettings?.textFields?.icon || 
                         currentColorSettings?.textFields?.border || 
                         (useCustomColors ? 
                           (currentBorderColor || typeConfig.iconColor) : 
                           typeConfig.iconColor),
                  fontSize: currentSize === 'large' ? '32px' : 
                           currentSize === 'small' ? '20px' : '24px'
                }}
              />
            </Box>
          )}

          {/* Контент */}
          <Box sx={{ flex: 1 }}>
            {currentTitle && (
              <Typography
                variant={currentSize === 'large' ? 'h6' : 'subtitle1'}
                sx={{
                  fontWeight: 'bold',
                  marginBottom: currentContent ? '8px' : 0,
                  color: currentColorSettings?.textFields?.title || 'inherit'
                }}
              >
                {currentTitle}
              </Typography>
            )}
            {currentContent && (
              <Typography
                variant="body2"
                sx={{
                  lineHeight: 1.6,
                  color: currentColorSettings?.textFields?.content || 'inherit',
                  whiteSpace: 'pre-wrap'
                }}
              >
                {currentContent}
              </Typography>
            )}
            {currentFootnote && (
              <Typography
                variant="caption"
                sx={{
                  display: 'block',
                  marginTop: 1,
                  fontSize: '0.75rem',
                  opacity: 0.8,
                  fontStyle: 'italic',
                  color: currentColorSettings?.textFields?.footnote || '#888888',
                  whiteSpace: 'pre-wrap'
                }}
              >
                {currentFootnote}
              </Typography>
            )}
          </Box>
        </Box>

        {/* Индикатор типа */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 8,
            right: 8
          }}
        >
          <Chip
            label={typeConfig.label}
            size="small"
            variant="outlined"
            sx={{
              backgroundColor: 'rgba(255,255,255,0.8)',
              borderColor: currentColorSettings?.textFields?.type || typeConfig.borderColor,
              color: currentColorSettings?.textFields?.type || typeConfig.borderColor,
              fontSize: '10px'
            }}
          />
        </Box>
      </Paper>
    );
  };

  if (isDismissed) {
    return null;
  }

  const isCurrentlyEditing = isEditing || localEditing;

  return (
    <EditableElementWrapper 
      editable={constructorMode} 
      onStartEdit={handleDoubleClick}
      isEditing={isCurrentlyEditing}
    >
      <AnimationWrapper {...currentAnimationSettings}>
        <Box className="callout-container">
          {/* Превью */}
          {!isCurrentlyEditing && renderCallout()}

        {/* Редактор */}
        {isCurrentlyEditing && (
        <Paper sx={{ p: 3, border: '2px solid #1976d2' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
            <InfoIcon color="primary" />
            <Typography variant="h6" color="primary">
              Редактирование информационного блока
            </Typography>
            <Chip label="Активно" color="primary" size="small" />
          </Box>

          {/* Заголовок */}
          <TextField
            fullWidth
            value={currentTitle}
            onChange={(e) => setCurrentTitle(e.target.value)}
            label="Заголовок"
            sx={{ mb: 2 }}
          />

          {/* Содержимое */}
          <TextField
            fullWidth
            multiline
            rows={3}
            value={currentContent}
            onChange={(e) => setCurrentContent(e.target.value)}
            label="Содержимое"
            sx={{ mb: 2 }}
          />

          {/* Сноска */}
          <TextField
            fullWidth
            value={currentFootnote}
            onChange={(e) => setCurrentFootnote(e.target.value)}
            label="Сноска"
            placeholder="Дополнительная информация или пояснение"
            sx={{ mb: 2 }}
          />

          {/* Настройки */}
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Тип</InputLabel>
              <Select
                value={isCustomTypeState ? 'custom' : currentType}
                label="Тип"
                onChange={(e) => {
                  if (e.target.value === 'custom') {
                    setIsCustomType(true);
                    setUseCustomColors(true);
                  } else {
                    setIsCustomType(false);
                    setCurrentType(e.target.value);
                  }
                }}
              >
                {calloutTypes.map(type => {
                  const IconComponent = type.icon;
                  return (
                    <MenuItem key={type.value} value={type.value}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <IconComponent sx={{ color: type.iconColor, fontSize: '20px' }} />
                        {type.label}
                      </Box>
                    </MenuItem>
                  );
                })}
                <MenuItem value="custom">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <InfoIcon sx={{ color: '#666', fontSize: '20px' }} />
                    Пользовательский тип
                  </Box>
                </MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Размер</InputLabel>
              <Select
                value={currentSize}
                label="Размер"
                onChange={(e) => setCurrentSize(e.target.value)}
              >
                {sizes.map(size => (
                  <MenuItem key={size.value} value={size.value}>
                    {size.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Поле для пользовательского типа */}
          {isCustomTypeState && (
            <TextField
              fullWidth
              value={customTypeNameState}
              onChange={handleCustomTypeNameChange}
              label="Название пользовательского типа"
              placeholder="Например: Совет дня, Внимание, Новость..."
              sx={{ mb: 2 }}
              helperText="Введите название для вашего пользовательского типа блока"
            />
          )}

          {/* Дополнительные настройки */}
          <Box sx={{ mb: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={showCalloutIcon}
                  onChange={(e) => setShowCalloutIcon(e.target.checked)}
                />
              }
              label="Показывать иконку"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={isDismissible}
                  onChange={(e) => setIsDismissible(e.target.checked)}
                />
              }
              label="Можно закрыть"
            />
          </Box>

          {/* Настройки анимации */}
          <AnimationControls
            animationSettings={currentAnimationSettings}
            onUpdate={setCurrentAnimationSettings}
            expanded={false}
          />

          {/* Предварительный просмотр */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Предварительный просмотр:
            </Typography>
            <Box sx={{ border: '1px dashed #ccc', borderRadius: 1, p: 2 }}>
              {renderCallout()}
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Настройки цветов */}
          <ColorSettings
            title="Настройки цветов выноски"
            colorSettings={currentColorSettings}
            onUpdate={handleColorUpdate}
            availableFields={[
              {
                name: 'title',
                label: 'Цвет заголовка',
                description: 'Цвет заголовка выноски',
                defaultColor: '#333333'
              },
              {
                name: 'content',
                label: 'Цвет содержимого',
                description: 'Цвет основного текста выноски',
                defaultColor: '#333333'
              },
              {
                name: 'border',
                label: 'Цвет границы',
                description: 'Цвет границы и акцентов',
                defaultColor: '#1976d2'
              },
              {
                name: 'icon',
                label: 'Цвет иконки',
                description: 'Цвет иконки типа выноски',
                defaultColor: '#1976d2'
              },
              {
                name: 'type',
                label: 'Цвет типа',
                description: 'Цвет индикатора типа выноски',
                defaultColor: '#1976d2'
              },
              {
                name: 'footnote',
                label: 'Цвет сноски',
                description: 'Цвет текста сноски',
                defaultColor: '#888888'
              }
            ]}
            defaultColors={{
              title: '#333333',
              content: '#333333',
              border: '#1976d2',
              icon: '#1976d2',
              type: '#1976d2',
              footnote: '#888888'
            }}
            hideCardBackground={true}
            hideAreaColors={true}
          />

          {/* Кнопки */}
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
            <Button onClick={handleCancel}>
              Отмена
            </Button>
            <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSave}>
              Сохранить
            </Button>
          </Box>
        </Paper>
        )}
      </Box>
      </AnimationWrapper>
    </EditableElementWrapper>
  );
};

export default Callout; 