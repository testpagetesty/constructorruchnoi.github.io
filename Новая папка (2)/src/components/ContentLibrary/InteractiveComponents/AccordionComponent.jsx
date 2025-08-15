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
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import EditableElementWrapper from '../EditableElementWrapper';
import AnimationWrapper from '../AnimationWrapper';
import AnimationControls from '../AnimationControls';

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
  onUpdate,
  editable = true,
  // Пропсы для совместимости с системой редактирования
  constructorMode = false,
  isEditing = false,
  onSave = null,
  onCancel = null,
  
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
  const [accordionStyles, setAccordionStyles] = useState({
    backgroundColor: 'rgba(0,0,0,0.85)',
    titleColor: '#ffd700',
    contentColor: '#fff',
    hoverColor: 'rgba(196,30,58,0.15)',
    ...customStyles
  });
  const [isEditingInternal, setIsEditingInternal] = useState(false);
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
    animationSettings
  });

  // Объединяем внутреннее редактирование и внешнее
  const isCurrentlyEditing = isEditing || isEditingInternal || localEditing;

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

    return {
      spacing: spacingConfig.gap,
      summary: {
        padding: sizeConfig.padding,
        fontSize: sizeConfig.fontSize,
        backgroundColor: accordionStyles.backgroundColor,
        color: accordionStyles.titleColor,
        '&:hover': {
          backgroundColor: accordionStyles.hoverColor
        }
      },
      content: {
        padding: sizeConfig.padding,
        color: accordionStyles.contentColor,
        backgroundColor: accordionStyles.backgroundColor
      }
    };
  };

  // Обработчики для режима конструктора
  const handleDoubleClick = () => {
    if (constructorMode) {
      setLocalEditing(true);
    }
  };

  const handleAnimationUpdate = (newAnimationSettings) => {
    setEditData({ ...editData, animationSettings: newAnimationSettings });
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
    if (onSave) {
      onSave(editData);
    } else if (onUpdate) {
      onUpdate(editData);
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
      animationSettings
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
        animationSettings
      });
    }
  };

  const renderAccordion = () => {
    const styles = getAccordionStyles();

    return (
      <Box sx={{ position: 'relative' }}>
        {/* Кнопка редактирования */}
        {editable && (
          <Box
            sx={{
              position: 'absolute',
              top: -8,
              right: -8,
              opacity: 0,
              transition: 'opacity 0.2s ease',
              zIndex: 10,
              '.accordion-container:hover &': {
                opacity: 1
              }
            }}
          >
            <Tooltip title="Редактировать аккордеон">
              <IconButton
                size="small"
                onClick={() => setIsEditingInternal(true)}
                sx={{
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  boxShadow: 2,
                  '&:hover': { backgroundColor: 'rgba(255,255,255,1)' }
                }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
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
                  `1px solid ${accordionStyles.borderColor}` : 'none',
                borderRadius: '8px !important',
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
        isEditing={isCurrentlyEditing}
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
          {!isCurrentlyEditing && renderAccordion()}

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

            {/* Настройки анимации */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>Настройки анимации:</Typography>
              <AnimationControls
                animationSettings={editData.animationSettings || animationSettings}
                onUpdate={handleAnimationUpdate}
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

        {/* Редактор для обычного режима */}
        {isEditingInternal && (
        <Paper sx={{ p: 3, border: '2px solid #1976d2' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
            <ExpandMoreIcon color="primary" />
            <Typography variant="h6" color="primary">
              Редактирование аккордеона
            </Typography>
            <Chip label="Активно" color="primary" size="small" />
          </Box>

          {/* Общие настройки */}
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <FormControl fullWidth>
              <InputLabel>Вариант</InputLabel>
              <Select
                value={currentVariant}
                label="Вариант"
                onChange={(e) => setCurrentVariant(e.target.value)}
              >
                {variants.map(variant => (
                  <MenuItem key={variant.value} value={variant.value}>
                    <Box>
                      <Typography variant="body2">{variant.label}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {variant.description}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
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

            <FormControl fullWidth>
              <InputLabel>Интервал</InputLabel>
              <Select
                value={currentSpacing}
                label="Интервал"
                onChange={(e) => setCurrentSpacing(e.target.value)}
              >
                {spacings.map(spacing => (
                  <MenuItem key={spacing.value} value={spacing.value}>
                    {spacing.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Дополнительные настройки */}
          <Box sx={{ mb: 3 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={allowMultipleExpanded}
                  onChange={(e) => setAllowMultipleExpanded(e.target.checked)}
                />
              }
              label="Разрешить открытие нескольких панелей"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={showAccordionIcons}
                  onChange={(e) => setShowAccordionIcons(e.target.checked)}
                />
              }
              label="Показывать иконки раскрытия"
            />
          </Box>

          {/* Цвета */}
          <Typography variant="subtitle2" gutterBottom>
            Настройки цветов:
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <TextField
              fullWidth
              type="color"
              label="Фон"
              value={accordionStyles.backgroundColor}
              onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
            />
            <TextField
              fullWidth
              type="color"
              label="Цвет заголовка"
              value={accordionStyles.titleColor}
              onChange={(e) => handleStyleChange('titleColor', e.target.value)}
            />
            <TextField
              fullWidth
              type="color"
              label="Цвет содержимого"
              value={accordionStyles.contentColor}
              onChange={(e) => handleStyleChange('contentColor', e.target.value)}
            />
            <TextField
              fullWidth
              type="color"
              label="Цвет при наведении"
              value={accordionStyles.hoverColor}
              onChange={(e) => handleStyleChange('hoverColor', e.target.value)}
            />
          </Box>

          {/* Редактирование панелей */}
          <Typography variant="subtitle2" gutterBottom>
            Панели аккордеона:
          </Typography>
          <Box sx={{ mb: 3 }}>
            {panels.map((panel, index) => (
              <Paper key={panel.id} sx={{ p: 2, mb: 2, border: '1px solid #e0e0e0' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <DragIndicatorIcon sx={{ color: '#ccc', cursor: 'grab' }} />
                  <Chip label={`Панель ${index + 1}`} size="small" />
                  <Box sx={{ flex: 1 }} />
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDeletePanel(panel.id)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>

                <TextField
                  fullWidth
                  value={panel.title}
                  onChange={(e) => handlePanelChange(panel.id, 'title', e.target.value)}
                  label="Заголовок панели"
                  sx={{ mb: 2 }}
                />

                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  value={panel.content}
                  onChange={(e) => handlePanelChange(panel.id, 'content', e.target.value)}
                  label="Содержимое панели"
                />
              </Paper>
            ))}

            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={handleAddPanel}
              sx={{ mt: 1 }}
            >
              Добавить панель
            </Button>
          </Box>

          {/* Предварительный просмотр */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Предварительный просмотр:
            </Typography>
            <Box sx={{ border: '1px dashed #ccc', borderRadius: 1, p: 2 }}>
              {renderAccordion()}
            </Box>
          </Box>

          {/* Кнопки */}
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
            <Button onClick={() => setIsEditingInternal(false)}>
              Отмена
            </Button>
            <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSave}>
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