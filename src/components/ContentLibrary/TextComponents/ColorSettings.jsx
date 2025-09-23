import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Slider,
  Button,
  Chip
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PaletteIcon from '@mui/icons-material/Palette';
import GradientIcon from '@mui/icons-material/Gradient';

/**
 * Универсальный компонент настройки цветов для всех текстовых элементов
 * Обеспечивает единообразную систему цветовых настроек и легкую интеграцию с экспортом
 */
const ColorSettings = ({
  // Общие настройки
  title = "Настройки цветов",
  sectionTitle = "Настройки раздела",
  
  // Текущие значения цветов
  colorSettings = {},
  
  // Callback для обновления
  onUpdate,
  
  // Доступные поля для настройки цветов
  availableFields = [],
  
  // Настройки по умолчанию
  defaultColors = {},
  
  // Данные для динамического создания названий сегментов (для круговых диаграмм)
  segmentData = [],
  
  // Параметры для скрытия определенных секций
  hideAreaColors = false,
  hideLineColors = false,
  hideSegmentColors = false,
  hideCardBackground = false
}) => {
  console.log('🔍 [ColorSettings] Component rendered with props:', {
    title,
    colorSettings,
    onUpdate: !!onUpdate,
    availableFields,
    defaultColors,
    segmentData,
    hideAreaColors,
    hideLineColors,
    hideSegmentColors,
    hideCardBackground
  });
  // Состояние настроек цветов
  const [settings, setSettings] = useState({
    // Настройки фона раздела
    sectionBackground: {
      enabled: false,
      useGradient: false,
      solidColor: '#ffffff',
      gradientColor1: '#ffffff',
      gradientColor2: '#f0f0f0',
      gradientDirection: 'to right',
      opacity: 1,
      ...colorSettings?.sectionBackground
    },
    
    // Настройки фона карточек
    cardBackground: {
      enabled: false,
      useGradient: false,
      solidColor: '#ffffff',
      gradientColor1: '#ffffff',
      gradientColor2: '#f0f0f0',
      gradientDirection: 'to right',
      opacity: 1,
      ...colorSettings?.cardBackground
    },
    
    // Цвета текстовых полей
    textFields: {
      title: '#333333',
      text: '#666666',
      description: '#666666',
      border: '#e0e0e0',
      titleFontSize: 20,
      textFontSize: 16,
      descriptionFontSize: 16,
      ...colorSettings?.textFields
    },
    
    // Цвета линий (для графиков)
    lineColors: {
      line1: '#8884d8',
      line2: '#82ca9d'
    },
    
    // Цвета областей (для диаграмм с областями)
    areaColors: {
      area1: '#8884d8',
      area2: '#82ca9d'
    },
    
    // Цвета сегментов (для круговых диаграмм)
    segmentColors: {
      segment1: '#8884d8',
      segment2: '#82ca9d',
      segment3: '#ffc658',
      segment4: '#ff7300',
      segment5: '#0088fe',
      segment6: '#00c49f',
      segment7: '#ffbb28',
      segment8: '#ff8042',
      ...colorSettings?.segmentColors
    },
    
    // Дополнительные настройки
    borderColor: '#e0e0e0',
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    boxShadow: false,
    
    ...colorSettings
  });

  // Обновляем настройки при изменении colorSettings
  useEffect(() => {
    console.log('🔍 [ColorSettings] useEffect вызван с colorSettings:', colorSettings);
    console.log('🔍 [ColorSettings] current settings:', settings);
    
    if (colorSettings && Object.keys(colorSettings).length > 0) {
      console.log('🔍 [ColorSettings] Обновляем настройки из colorSettings:', colorSettings);
      console.log('🔍 [ColorSettings] sectionBackground из colorSettings:', colorSettings.sectionBackground);
      
      setSettings(prevSettings => {
        // Проверяем, не сбрасываем ли мы пользовательские настройки
        const hasUserChanges = prevSettings.sectionBackground?.enabled && 
          (prevSettings.sectionBackground?.useGradient !== colorSettings.sectionBackground?.useGradient ||
           prevSettings.sectionBackground?.gradientColor1 !== colorSettings.sectionBackground?.gradientColor1 ||
           prevSettings.sectionBackground?.gradientColor2 !== colorSettings.sectionBackground?.gradientColor2);
        
        if (hasUserChanges) {
          console.log('🔍 [ColorSettings] Пропускаем обновление - есть пользовательские изменения');
          return prevSettings;
        }
        
        const newSettings = {
          ...prevSettings,
          sectionBackground: {
            ...prevSettings.sectionBackground,
            ...colorSettings.sectionBackground
          },
          cardBackground: {
            ...prevSettings.cardBackground,
            ...colorSettings.cardBackground
          },
          textFields: {
            ...prevSettings.textFields,
            ...colorSettings.textFields
          },
          segmentColors: {
            ...prevSettings.segmentColors,
            ...colorSettings.segmentColors
          }
        };
        
        console.log('🔍 [ColorSettings] newSettings after update:', newSettings);
        return newSettings;
      });
    }
  }, [colorSettings]);

  // Инициализируем segmentColors из segmentData
  useEffect(() => {
    if (segmentData && segmentData.length > 0) {
      setSettings(prevSettings => {
        const newSegmentColors = {};
        segmentData.forEach((segment, index) => {
          const segmentKey = `segment${index + 1}`;
          newSegmentColors[segmentKey] = segment.color || '#8884d8';
        });
        
        console.log('🔍 [ColorSettings] Инициализируем segmentColors из segmentData:', newSegmentColors);
        return {
          ...prevSettings,
          segmentColors: {
            ...prevSettings.segmentColors,
            ...newSegmentColors
          }
        };
      });
    }
  }, [segmentData]);

  // Доступные направления градиента
  const gradientDirections = [
    { value: 'to right', label: '→ Вправо' },
    { value: 'to left', label: '← Влево' },
    { value: 'to bottom', label: '↓ Вниз' },
    { value: 'to top', label: '↑ Вверх' },
    { value: 'to bottom right', label: '↘ Вправо-вниз' },
    { value: 'to bottom left', label: '↙ Влево-вниз' },
    { value: 'to top right', label: '↗ Вправо-вверх' },
    { value: 'to top left', label: '↖ Влево-вверх' }
  ];

  // Обновление настроек
  const updateSettings = (newSettings) => {
    const updatedSettings = { ...settings, ...newSettings };
    console.log('🔍 [ColorSettings] updateSettings called with:', newSettings);
    console.log('🔍 [ColorSettings] Final updatedSettings:', updatedSettings);
    setSettings(updatedSettings);
    if (onUpdate) {
      console.log('🔍 [ColorSettings] Calling onUpdate with:', updatedSettings);
      onUpdate(updatedSettings);
    } else {
      console.log('🔍 [ColorSettings] onUpdate is not available');
    }
  };

  // Обновление настроек фона раздела
  const updateSectionBackground = (field, value) => {
    console.log('🔍 [ColorSettings] updateSectionBackground called:', { field, value });
    console.log('🔍 [ColorSettings] current sectionBackground:', settings.sectionBackground);
    
    const newSectionBackground = {
      ...settings.sectionBackground,
      [field]: value
    };
    
    console.log('🔍 [ColorSettings] new sectionBackground:', newSectionBackground);
    
    updateSettings({
      sectionBackground: newSectionBackground
    });
  };

  // Обновление настроек фона карточек
  const updateCardBackground = (field, value) => {
    console.log('🔍 [ColorSettings] updateCardBackground called:', { field, value });
    console.log('🔍 [ColorSettings] current cardBackground:', settings.cardBackground);
    
    const newCardBackground = {
      ...settings.cardBackground,
      [field]: value
    };
    
    console.log('🔍 [ColorSettings] new cardBackground:', newCardBackground);
    
    updateSettings({
      cardBackground: newCardBackground
    });
  };

  // Обновление цвета текстового поля
  const updateTextField = (fieldName, color) => {
    console.log('🎨 [ColorSettings] updateTextField called:', { fieldName, color });
    console.log('🎨 [ColorSettings] current textFields:', settings.textFields);
    
    const newTextFields = {
      ...settings.textFields,
      [fieldName]: color
    };
    
    console.log('🎨 [ColorSettings] new textFields:', newTextFields);
    
    updateSettings({
      textFields: newTextFields
    });
  };

  // Инициализация полей по умолчанию
  useEffect(() => {
    console.log('🔍 [ColorSettings] useEffect triggered with availableFields:', availableFields);
    console.log('🔍 [ColorSettings] Current settings:', settings);
    
    const initialTextFields = {};
    availableFields.forEach(field => {
      if (!settings.textFields[field.name]) {
        initialTextFields[field.name] = field.defaultColor || defaultColors[field.name] || '#333333';
      }
    });
    
    console.log('🔍 [ColorSettings] Initial text fields to add:', initialTextFields);
    
    if (Object.keys(initialTextFields).length > 0) {
      updateSettings({
        textFields: {
          ...settings.textFields,
          ...initialTextFields
        }
      });
    }
  }, [availableFields]);

  // Генерация стилей для превью
  const getPreviewStyles = () => {
    const { sectionBackground } = settings;
    
    let backgroundStyle = {};
    if (sectionBackground.enabled) {
      if (sectionBackground.useGradient) {
        backgroundStyle.background = `linear-gradient(${sectionBackground.gradientDirection}, ${sectionBackground.gradientColor1}, ${sectionBackground.gradientColor2})`;
      } else {
        backgroundStyle.backgroundColor = sectionBackground.solidColor;
      }
      backgroundStyle.opacity = sectionBackground.opacity;
    }
    
    return {
      ...backgroundStyle,
      border: `${settings.borderWidth}px solid ${settings.borderColor}`,
      borderRadius: `${settings.borderRadius}px`,
      padding: `${settings.padding}px`,
      boxShadow: settings.boxShadow ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
      transition: 'all 0.3s ease'
    };
  };

  return (
    <Box>
      {/* Заголовок */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <PaletteIcon color="primary" />
        <Typography variant="h6">{title}</Typography>
        <Chip label="Настройки цветов" size="small" color="primary" variant="outlined" />
      </Box>

      {/* Настройки фона раздела */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <GradientIcon fontSize="small" />
            <Typography variant="subtitle1">{sectionTitle}</Typography>
            {settings.sectionBackground.enabled && (
              <Chip label="Включен" size="small" color="success" />
            )}
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ mb: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.sectionBackground.enabled}
                  onChange={(e) => updateSectionBackground('enabled', e.target.checked)}
                />
              }
              label="Использовать настройки фона"
            />
          </Box>

          {settings.sectionBackground.enabled && (
            <Box>
              {/* Выбор типа фона */}
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.sectionBackground.useGradient}
                    onChange={(e) => updateSectionBackground('useGradient', e.target.checked)}
                  />
                }
                label="Использовать градиент"
                sx={{ mb: 2 }}
              />

              {/* Настройки градиента */}
              {settings.sectionBackground.useGradient ? (
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      type="color"
                      label="Цвет 1"
                      value={settings.sectionBackground.gradientColor1}
                      onChange={(e) => updateSectionBackground('gradientColor1', e.target.value)}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      type="color"
                      label="Цвет 2"
                      value={settings.sectionBackground.gradientColor2}
                      onChange={(e) => updateSectionBackground('gradientColor2', e.target.value)}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Направление градиента</InputLabel>
                      <Select
                        value={settings.sectionBackground.gradientDirection}
                        label="Направление градиента"
                        onChange={(e) => updateSectionBackground('gradientDirection', e.target.value)}
                      >
                        {gradientDirections.map(dir => (
                          <MenuItem key={dir.value} value={dir.value}>
                            {dir.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              ) : (
                // Настройки сплошного цвета
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      type="color"
                      label="Цвет фона"
                      value={settings.sectionBackground.solidColor}
                      onChange={(e) => updateSectionBackground('solidColor', e.target.value)}
                      size="small"
                    />
                  </Grid>
                </Grid>
              )}

              {/* Прозрачность */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" gutterBottom>
                  Прозрачность: {Math.round(settings.sectionBackground.opacity * 100)}%
                </Typography>
                <Slider
                  value={settings.sectionBackground.opacity}
                  onChange={(e, value) => updateSectionBackground('opacity', value)}
                  min={0}
                  max={1}
                  step={0.05}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) => `${Math.round(value * 100)}%`}
                />
              </Box>
            </Box>
          )}
        </AccordionDetails>
      </Accordion>

      {/* Настройки фона карточек */}
      {!hideCardBackground && (
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <GradientIcon fontSize="small" />
              <Typography variant="subtitle1">Настройки карточек</Typography>
              {settings.cardBackground.enabled && (
                <Chip label="Включен" size="small" color="success" />
              )}
            </Box>
          </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ mb: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.cardBackground.enabled}
                  onChange={(e) => updateCardBackground('enabled', e.target.checked)}
                />
              }
              label="Использовать настройки фона карточек"
            />
          </Box>

          {settings.cardBackground.enabled && (
            <Box>
              {/* Выбор типа фона */}
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.cardBackground.useGradient}
                    onChange={(e) => updateCardBackground('useGradient', e.target.checked)}
                  />
                }
                label="Использовать градиент"
                sx={{ mb: 2 }}
              />

              {/* Настройки градиента */}
              {settings.cardBackground.useGradient ? (
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      type="color"
                      label="Цвет 1"
                      value={settings.cardBackground.gradientColor1}
                      onChange={(e) => updateCardBackground('gradientColor1', e.target.value)}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      type="color"
                      label="Цвет 2"
                      value={settings.cardBackground.gradientColor2}
                      onChange={(e) => updateCardBackground('gradientColor2', e.target.value)}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Направление градиента</InputLabel>
                      <Select
                        value={settings.cardBackground.gradientDirection}
                        label="Направление градиента"
                        onChange={(e) => updateCardBackground('gradientDirection', e.target.value)}
                      >
                        {gradientDirections.map(dir => (
                          <MenuItem key={dir.value} value={dir.value}>
                            {dir.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              ) : (
                // Настройки сплошного цвета
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      type="color"
                      label="Цвет фона карточки"
                      value={settings.cardBackground.solidColor}
                      onChange={(e) => updateCardBackground('solidColor', e.target.value)}
                      size="small"
                    />
                  </Grid>
                </Grid>
              )}

              {/* Прозрачность */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" gutterBottom>
                  Прозрачность: {Math.round(settings.cardBackground.opacity * 100)}%
                </Typography>
                <Slider
                  value={settings.cardBackground.opacity}
                  onChange={(e, value) => updateCardBackground('opacity', value)}
                  min={0}
                  max={1}
                  step={0.05}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) => `${Math.round(value * 100)}%`}
                />
              </Box>
            </Box>
          )}
        </AccordionDetails>
      </Accordion>
      )}

      {/* Настройки цветов текстовых полей */}
      {availableFields.length > 0 && (
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1">Цвета текстовых полей</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              {availableFields.map((field, index) => (
                <Grid item xs={6} sm={4} md={3} key={field.name}>
                  <TextField
                    fullWidth
                    type="color"
                    label={field.label}
                    value={settings.textFields[field.name] || field.defaultColor || '#333333'}
                    onChange={(e) => updateTextField(field.name, e.target.value)}
                    size="small"
                    helperText={field.description}
                  />
                </Grid>
              ))}
            </Grid>
          </AccordionDetails>
        </Accordion>
      )}





      {/* Цвета областей */}
      {!hideAreaColors && (
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PaletteIcon color="primary" />
              <Typography variant="subtitle1">Цвета областей</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  type="color"
                  label="Область 1"
                  value={settings.areaColors.area1}
                  onChange={(e) => updateSettings({ 
                    areaColors: { 
                      ...settings.areaColors, 
                      area1: e.target.value 
                    } 
                  })}
                  size="small"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  type="color"
                  label="Область 2"
                  value={settings.areaColors.area2}
                  onChange={(e) => updateSettings({ 
                    areaColors: { 
                      ...settings.areaColors, 
                      area2: e.target.value 
                    } 
                  })}
                  size="small"
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      )}

      {/* Цвета сегментов */}
      {!hideSegmentColors && segmentData && segmentData.length > 0 && (
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PaletteIcon color="primary" />
              <Typography variant="subtitle1">Цвета сегментов</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              {segmentData.map((segment, index) => {
                const segmentKey = `segment${index + 1}`;
                const segmentName = segment.name || segment.label || `Сегмент ${index + 1}`;
                return (
                  <Grid item xs={6} sm={4} md={3} key={segmentKey}>
                    <TextField
                      fullWidth
                      type="color"
                      label={segmentName}
                      value={settings.segmentColors[segmentKey] || segment.color || '#8884d8'}
                      onChange={(e) => updateSettings({ 
                        segmentColors: { 
                          ...settings.segmentColors, 
                          [segmentKey]: e.target.value 
                        } 
                      })}
                      size="small"
                    />
                  </Grid>
                );
              })}
            </Grid>
          </AccordionDetails>
        </Accordion>
      )}

      {/* Дополнительные настройки */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">Дополнительные настройки</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="color"
                label="Цвет границы"
                value={settings.borderColor}
                onChange={(e) => updateSettings({ borderColor: e.target.value })}
                size="small"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="number"
                label="Ширина границы (px)"
                value={settings.borderWidth}
                onChange={(e) => updateSettings({ borderWidth: parseInt(e.target.value) || 1 })}
                size="small"
                inputProps={{ min: 0, max: 10 }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="number"
                label="Радиус углов (px)"
                value={settings.borderRadius}
                onChange={(e) => updateSettings({ borderRadius: parseInt(e.target.value) || 0 })}
                size="small"
                inputProps={{ min: 0, max: 50 }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="number"
                label="Внутренние отступы (px)"
                value={settings.padding}
                onChange={(e) => updateSettings({ padding: parseInt(e.target.value) || 0 })}
                size="small"
                inputProps={{ min: 0, max: 100 }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.boxShadow}
                    onChange={(e) => updateSettings({ boxShadow: e.target.checked })}
                  />
                }
                label="Добавить тень"
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Превью */}
      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle2" gutterBottom>
          Предварительный просмотр стилей:
        </Typography>
        <Box
          sx={{
            ...getPreviewStyles(),
            minHeight: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px dashed #ccc'
          }}
        >
          <Typography sx={{ color: settings.textFields.title || '#333333' }}>
            Пример заголовка
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default ColorSettings;