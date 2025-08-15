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
  
  // Текущие значения цветов
  colorSettings = {},
  
  // Callback для обновления
  onUpdate,
  
  // Доступные поля для настройки цветов
  availableFields = [],
  
  // Настройки по умолчанию
  defaultColors = {}
}) => {
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
      opacity: 1
    },
    
    // Цвета текстовых полей
    textFields: {},
    
    // Дополнительные настройки
    borderColor: '#e0e0e0',
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    boxShadow: false,
    
    ...colorSettings
  });

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
    setSettings(updatedSettings);
    if (onUpdate) {
      onUpdate(updatedSettings);
    }
  };

  // Обновление настроек фона
  const updateSectionBackground = (field, value) => {
    updateSettings({
      sectionBackground: {
        ...settings.sectionBackground,
        [field]: value
      }
    });
  };

  // Обновление цвета текстового поля
  const updateTextField = (fieldName, color) => {
    updateSettings({
      textFields: {
        ...settings.textFields,
        [fieldName]: color
      }
    });
  };

  // Инициализация полей по умолчанию
  useEffect(() => {
    const initialTextFields = {};
    availableFields.forEach(field => {
      if (!settings.textFields[field.name]) {
        initialTextFields[field.name] = field.defaultColor || defaultColors[field.name] || '#333333';
      }
    });
    
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
            <Typography variant="subtitle1">Фон раздела</Typography>
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

      {/* Дополнительные настройки */}
      <Accordion>
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