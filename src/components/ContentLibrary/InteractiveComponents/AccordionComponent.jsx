import React, { useState, useEffect } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  IconButton,
  Chip,
  Switch,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tooltip
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import EditableElementWrapper from '../EditableElementWrapper';
import AnimationWrapper from '../AnimationWrapper';
import AnimationControls from '../AnimationControls';
import ColorSettings from '../TextComponents/ColorSettings';

const AccordionComponent = ({
  initialPanels = [
    { 
      id: 1, 
      title: 'Первый раздел', 
      content: 'Описание первого раздела' 
    },
    { 
      id: 2, 
      title: 'Второй раздел', 
      content: 'Описание второго раздела' 
    },
    { 
      id: 3, 
      title: 'Третий раздел', 
      content: 'Описание третьего раздела' 
    }
  ],
  accordionItems = null, // Альтернативное название для совместимости
  allowMultiple = false,
  variant = 'outlined',
  size = 'medium',
  spacing = 'normal',
  defaultExpanded = null,
  showIcons = true,
  customStyles = {},
  // Настройки цветов через ColorSettings
  colorSettings = {},
  onUpdate,
  editable = true,
  // Пропсы для совместимости с системой редактирования
  constructorMode = false,
  isEditing = false,
  onSave = null,
  onCancel = null,
  
  // Заголовок элемента
  title = '',
  showTitle = true,
  
  // Параметры анимации
  animationSettings = {
    animationType: 'fadeIn',
    delay: 0,
    triggerOnView: true,
    triggerOnce: true,
    threshold: 0.1,
    disabled: false
  },
  isConstructorMode = false
}) => {
  // Используем accordionItems если передан, иначе initialPanels
  const panels_data = accordionItems || initialPanels;
  const [panels, setPanels] = useState(panels_data);
  const [allowMultipleExpanded, setAllowMultipleExpanded] = useState(allowMultiple);
  const [expanded, setExpanded] = useState(defaultExpanded || (allowMultipleExpanded ? [] : null));
  const [currentVariant, setCurrentVariant] = useState(variant);
  const [currentSize, setCurrentSize] = useState(size);
  const [currentSpacing, setCurrentSpacing] = useState(spacing);
  const [showAccordionIcons, setShowAccordionIcons] = useState(showIcons);
  // Настройки цветов через ColorSettings (как в базовой карточке)
  const [currentColorSettings, setCurrentColorSettings] = useState(() => {
    // Приоритет: colorSettings пропс > customStyles.colorSettings > дефолтные значения
    if (colorSettings && Object.keys(colorSettings).length > 0) {
      return colorSettings;
    }
    if (customStyles?.colorSettings && Object.keys(customStyles.colorSettings).length > 0) {
      return customStyles.colorSettings;
    }
    return {
      textFields: {
        title: '#ffd700',
        text: '#ffffff',
        background: 'rgba(0,0,0,0.85)',
        border: '#c41e3a'
      },
      sectionBackground: {
        enabled: false,
        useGradient: false,
        solidColor: 'rgba(0,0,0,0.85)',
        gradientColor1: '#c41e3a',
        gradientColor2: '#ffd700',
        gradientDirection: 'to right',
        opacity: 1
      },
      borderColor: '#c41e3a',
      borderWidth: 1,
      borderRadius: 8,
      padding: 16,
      boxShadow: false
    };
  });

  const [accordionStyles, setAccordionStyles] = useState({
    backgroundColor: 'rgba(0,0,0,0.85)',
    titleColor: '#ffd700',
    contentColor: '#fff',
    hoverColor: 'rgba(196,30,58,0.15)',
    ...customStyles
  });

  const [editingPanelId, setEditingPanelId] = useState(null);
  const [localEditing, setLocalEditing] = useState(false);
  const [editData, setEditData] = useState({
    accordionItems: panels_data,
    allowMultiple,
    variant,
    size,
    spacing,
    showIcons,
    customStyles,
    colorSettings: currentColorSettings,
    animationSettings,
    title,
    showTitle
  });

  // Объединяем внутреннее редактирование и внешнее


  // Эффект для синхронизации состояния expanded при изменении allowMultipleExpanded
  useEffect(() => {
    if (allowMultipleExpanded && !Array.isArray(expanded)) {
      // Переключение на множественное расширение
      setExpanded(expanded ? [expanded] : []);
    } else if (!allowMultipleExpanded && Array.isArray(expanded)) {
      // Переключение на единичное расширение
      setExpanded(expanded.length > 0 ? expanded[0] : null);
    }
  }, [allowMultipleExpanded]);

  const variants = [
    { value: 'outlined', label: 'С рамкой', description: 'Стандартная рамка' },
    { value: 'elevation', label: 'Приподнятый', description: 'С тенью' },
    { value: 'filled', label: 'Заполненный', description: 'Цветной фон' }
  ];

  const sizes = [
    { value: 'small', label: 'Маленький', padding: '8px 16px', fontSize: '14px' },
    { value: 'medium', label: 'Средний', padding: '12px 20px', fontSize: '16px' },
    { value: 'large', label: 'Большой', padding: '16px 24px', fontSize: '18px' }
  ];

  const spacings = [
    { value: 'compact', label: 'Компактный', gap: '2px' },
    { value: 'normal', label: 'Обычный', gap: '8px' },
    { value: 'relaxed', label: 'Свободный', gap: '16px' }
  ];

  const handleChange = (panelId) => (event, isExpanded) => {
    if (allowMultipleExpanded) {
      setExpanded(prev => {
        const currentExpanded = Array.isArray(prev) ? prev : [];
        return isExpanded 
          ? [...currentExpanded, panelId]
          : currentExpanded.filter(id => id !== panelId);
      });
    } else {
      setExpanded(isExpanded ? panelId : null);
    }
  };

  const handleAddPanel = () => {
    const newId = Math.max(...panels.map(p => p.id), 0) + 1;
    setPanels([...panels, {
      id: newId,
      title: `Новая панель ${newId}`,
      content: `Содержимое панели ${newId}.`
    }]);
  };

  const handleDeletePanel = (panelId) => {
    setPanels(panels.filter(p => p.id !== panelId));
    if (allowMultipleExpanded) {
      setExpanded(prev => {
        const currentExpanded = Array.isArray(prev) ? prev : [];
        return currentExpanded.filter(id => id !== panelId);
      });
    } else if (expanded === panelId) {
      setExpanded(null);
    }
  };

  const handlePanelChange = (panelId, field, value) => {
    setPanels(panels.map(panel => 
      panel.id === panelId 
        ? { ...panel, [field]: value }
        : panel
    ));
  };

  const handleStyleChange = (property, value) => {
    setAccordionStyles(prev => ({ ...prev, [property]: value }));
  };

  const isExpanded = (panelId) => {
    if (allowMultipleExpanded) {
      return Array.isArray(expanded) ? expanded.includes(panelId) : false;
    } else {
      return expanded === panelId;
    }
  };

  const getAccordionStyles = () => {
    const sizeConfig = sizes.find(s => s.value === currentSize) || sizes[1];
    const spacingConfig = spacings.find(s => s.value === currentSpacing) || spacings[1];


    // Приоритет ColorSettings над customStyles
    const titleColor = currentColorSettings?.textFields?.title || accordionStyles.titleColor || '#ffd700';
    const textColor = currentColorSettings?.textFields?.text || accordionStyles.contentColor || '#ffffff';
    const backgroundColor = currentColorSettings?.textFields?.background || accordionStyles.backgroundColor || 'rgba(0,0,0,0.85)';
    const borderColor = currentColorSettings?.textFields?.border || '#c41e3a';
    const hoverColor = currentColorSettings?.textFields?.hover || '#4ecdc4';

    // Фон строк аккордеона - используем textFields.background
    const accordionBackground = backgroundColor;

    return {
      spacing: spacingConfig.gap,
      summary: {
        padding: sizeConfig.padding,
        fontSize: sizeConfig.fontSize,
        backgroundColor: accordionBackground,
        color: titleColor,
        '&:hover': {
          backgroundColor: hoverColor,
          transition: 'background-color 0.3s ease'
        }
      },
      content: {
        padding: sizeConfig.padding,
        color: textColor,
        backgroundColor: accordionBackground
      },
      borderColor: borderColor
    };
  };

  // Обработчики для режима конструктора
  const handleDoubleClick = () => {
    if (constructorMode) {
      setLocalEditing(true);
    }
  };

  // 🔄 РЕАКТИВНОСТЬ: Обновляем локальные настройки при изменении colorSettings
  useEffect(() => {
    if (JSON.stringify(colorSettings) !== JSON.stringify(currentColorSettings)) {
      console.log('🔄 [AccordionComponent] Обновление colorSettings:', colorSettings);
      setCurrentColorSettings(colorSettings || {});
      
      // Обновляем accordionStyles на основе новых colorSettings
      if (colorSettings && Object.keys(colorSettings).length > 0) {
        setAccordionStyles(prev => ({
          ...prev,
          backgroundColor: colorSettings.textFields?.background || prev.backgroundColor,
          titleColor: colorSettings.textFields?.title || prev.titleColor,
          contentColor: colorSettings.textFields?.text || prev.contentColor,
          borderColor: colorSettings.textFields?.border || prev.borderColor
        }));
      }
      
      // 🔥 ИСПРАВЛЕНИЕ: Обновляем editData.colorSettings для синхронизации с редактором
      setEditData(prev => ({
        ...prev,
        colorSettings: colorSettings || prev.colorSettings
      }));
    }
  }, [colorSettings]);

  const handleAnimationUpdate = (newAnimationSettings) => {
    setEditData({ ...editData, animationSettings: newAnimationSettings });
  };

  const handleColorUpdate = (newColorSettings) => {
    setEditData({ ...editData, colorSettings: newColorSettings });
  };

  const handleSaveConstructor = () => {
    setLocalEditing(false);
    setPanels(editData.accordionItems);
    setAllowMultipleExpanded(editData.allowMultiple);
    setCurrentVariant(editData.variant);
    setCurrentSize(editData.size);
    setCurrentSpacing(editData.spacing);
    setShowAccordionIcons(editData.showIcons);
    setAccordionStyles(editData.customStyles);
    setCurrentColorSettings(editData.colorSettings || currentColorSettings);
    
    // Формируем данные для сохранения с поддержкой экспорта
    const saveData = {
      ...editData,
      // Данные для экспорта (совместимость с multiPageSiteExporter)
      accordionItems: editData.accordionItems,
      colorSettings: editData.colorSettings || currentColorSettings,
      title: editData.title,
      showTitle: editData.showTitle,
      allowMultiple: editData.allowMultiple
    };
    
    if (onSave) {
      onSave(saveData);
    } else if (onUpdate) {
      onUpdate(saveData);
    }
  };

  const handleCancelConstructor = () => {
    setLocalEditing(false);
    setEditData({
      accordionItems: panels,
      allowMultiple: allowMultipleExpanded,
      variant: currentVariant,
      size: currentSize,
      spacing: currentSpacing,
      showIcons: showAccordionIcons,
      customStyles: accordionStyles,
      animationSettings,
      title,
      showTitle
    });
    if (onCancel) {
      onCancel();
    }
  };

  const handleSave = () => {
    setIsEditingInternal(false);
    if (onUpdate) {
      onUpdate({
        panels,
        allowMultiple: allowMultipleExpanded,
        variant: currentVariant,
        size: currentSize,
        spacing: currentSpacing,
        showIcons: showAccordionIcons,
        customStyles: accordionStyles,
        animationSettings,
        title,
        showTitle
      });
    }
  };

  const renderAccordion = () => {
    const styles = getAccordionStyles();

    return (
      <Box sx={{ position: 'relative' }}>


        {/* Заголовок элемента */}
        {showTitle && title && (
          <Typography
            variant="h5"
            component="h3"
            sx={{
              fontSize: '24px',
              color: currentColorSettings?.textFields?.title || accordionStyles.titleColor || '#ffd700',
              fontWeight: 'bold',
              margin: 0,
              marginBottom: '16px',
              textAlign: 'center',
              lineHeight: 1.4
            }}
          >
            {title}
          </Typography>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: styles.spacing }}>
          {panels.map((panel) => (
            <Accordion
              key={panel.id}
              expanded={isExpanded(panel.id)}
              onChange={handleChange(panel.id)}
              variant={currentVariant}
              sx={{
                border: currentVariant === 'outlined' ? 
                  `1px solid ${styles.borderColor}` : 'none',
                borderRadius: '8px !important',
                backgroundColor: styles.summary.backgroundColor,
                '&:before': {
                  display: 'none'
                },
                '&.Mui-expanded': {
                  margin: 0
                }
              }}
            >
              <AccordionSummary
                expandIcon={showAccordionIcons ? <ExpandMoreIcon /> : null}
                sx={{
                  ...styles.summary,
                  minHeight: '56px',
                  '&.Mui-expanded': {
                    minHeight: '56px'
                  }
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 'bold',
                    color: 'inherit'
                  }}
                >
                  {panel.title}
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={styles.content}>
                <Typography
                  variant="body2"
                  sx={{
                    lineHeight: 1.6,
                    whiteSpace: 'pre-wrap',
                    color: 'inherit'
                  }}
                >
                  {panel.content}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>

        {/* Индикатор */}
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
          <Chip
            label={`Аккордеон • ${panels.length} панели`}
            size="small"
            variant="outlined"
            sx={{ fontSize: '10px' }}
          />
        </Box>
      </Box>
    );
  };

  return (
    <AnimationWrapper key={JSON.stringify(editData.animationSettings)} {...(editData.animationSettings || animationSettings)}>
      <EditableElementWrapper 
        editable={constructorMode} 
        onStartEdit={handleDoubleClick}
        isEditing={localEditing}
      >
        <Box className="accordion-container">
          {/* Режим конструктора */}
          {isConstructorMode && (
            <Box sx={{ p: 2, backgroundColor: '#f5f5f5', borderBottom: '1px solid #e0e0e0' }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Настройки Accordion
              </Typography>
              <AnimationControls
                animationSettings={animationSettings}
                onUpdate={handleAnimationUpdate}
              />
            </Box>
          )}

          {/* Превью */}
          {!localEditing && renderAccordion()}

        {/* Редактор для режима конструктора */}
        {localEditing && (
          <Paper sx={{ p: 3, border: '2px dashed #1976d2' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <ExpandMoreIcon color="primary" />
              <Typography variant="h6" color="primary">
                Редактирование аккордеона
              </Typography>
              <Chip label="Режим конструктора" color="primary" size="small" />
            </Box>

            {/* Заголовок элемента */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>Заголовок элемента:</Typography>
              <TextField
                fullWidth
                label="Заголовок элемента"
                value={editData.title || ''}
                onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                placeholder="Введите заголовок элемента..."
                size="small"
                sx={{ mb: 1 }}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={editData.showTitle || true}
                    onChange={(e) => setEditData({ ...editData, showTitle: e.target.checked })}
                  />
                }
                label="Показывать заголовок"
              />
            </Box>

            {/* Настройки анимации */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>Настройки анимации:</Typography>
              <AnimationControls
                animationSettings={editData.animationSettings || animationSettings}
                onUpdate={handleAnimationUpdate}
              />
            </Box>

            {/* Настройки цветов */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>Настройки цветов:</Typography>
              <ColorSettings
                title="Настройки цветов аккордеона"
                colorSettings={editData.colorSettings || currentColorSettings}
                onUpdate={handleColorUpdate}
                availableFields={[
                  { name: 'title', label: 'Заголовок', description: 'Цвет заголовка аккордеона', defaultColor: '#ffd700' },
                  { name: 'text', label: 'Текст', description: 'Цвет содержимого элементов', defaultColor: '#ffffff' },
                  { name: 'background', label: 'Фон', description: 'Цвет фона аккордеона', defaultColor: 'rgba(0,0,0,0.85)' },
                  { name: 'border', label: 'Граница', description: 'Цвет границ элементов', defaultColor: '#c41e3a' },
                  { name: 'hover', label: 'При наведении', description: 'Цвет фона при наведении', defaultColor: '#4ecdc4' }
                ]}
                defaultColors={{
                  title: '#ffd700',
                  text: '#ffffff',
                  background: 'rgba(0,0,0,0.85)',
                  border: '#c41e3a',
                  hover: '#4ecdc4'
                }}
                hideCardBackground={true}
                hideAreaColors={true}
              />
            </Box>

            {/* Панели аккордеона */}
            <Typography variant="subtitle2" gutterBottom>
              Панели аккордеона:
            </Typography>
            {editData.accordionItems.map((item, index) => (
              <Box key={index} sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1, mb: 2 }}>
                <TextField
                  fullWidth
                  label={`Заголовок ${index + 1}`}
                  value={item.title}
                  onChange={(e) => {
                    const newItems = [...editData.accordionItems];
                    newItems[index].title = e.target.value;
                    setEditData({ ...editData, accordionItems: newItems });
                  }}
                  size="small"
                  sx={{ mb: 1 }}
                />
                <TextField
                  fullWidth
                  label={`Содержание ${index + 1}`}
                  value={item.content}
                  onChange={(e) => {
                    const newItems = [...editData.accordionItems];
                    newItems[index].content = e.target.value;
                    setEditData({ ...editData, accordionItems: newItems });
                  }}
                  multiline
                  rows={3}
                  size="small"
                />
              </Box>
            ))}
            
            {/* Кнопки управления панелями */}
            <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
              <Button
                variant="outlined"
                size="small"
                onClick={() => {
                  const newItems = [...editData.accordionItems, { 
                    id: Date.now(), 
                    title: 'Новый элемент', 
                    content: 'Содержание нового элемента' 
                  }];
                  setEditData({ ...editData, accordionItems: newItems });
                }}
              >
                Добавить элемент
              </Button>
              {editData.accordionItems.length > 1 && (
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={() => {
                    const newItems = editData.accordionItems.slice(0, -1);
                    setEditData({ ...editData, accordionItems: newItems });
                  }}
                >
                  Удалить последний
                </Button>
              )}
            </Box>

            {/* Кнопки сохранения */}
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
              <Button onClick={handleCancelConstructor}>
                Отмена
              </Button>
              <Button variant="contained" onClick={handleSaveConstructor}>
                Сохранить
              </Button>
            </Box>
          </Paper>
        )}
        </Box>
      </EditableElementWrapper>
    </AnimationWrapper>
  );
};

export default AccordionComponent; 