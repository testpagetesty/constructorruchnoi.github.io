import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, TextField, Button, Select, MenuItem, FormControl, InputLabel, Grid, Switch, FormControlLabel, Chip, IconButton, Divider, Accordion, AccordionSummary, AccordionDetails, Slider, RadioGroup, Radio, Card, CardContent } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PaletteIcon from '@mui/icons-material/Palette';
import TuneIcon from '@mui/icons-material/Tune';
import DataObjectIcon from '@mui/icons-material/DataObject';
import { SketchPicker } from 'react-color';
import EditableElementWrapper from './EditableElementWrapper';
import AnimationWrapper from './AnimationWrapper';
import AnimationControls from './AnimationControls';
import ColorSettings from './TextComponents/ColorSettings';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, ScatterChart, Scatter, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ComposedChart } from 'recharts';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip as ChartTooltip, Legend as ChartLegend, ArcElement, PointElement, LineElement, RadialLinearScale, Filler } from 'chart.js';
import { Bar as ChartBar, Doughnut as ChartDoughnut, Polar, Radar as ChartRadar } from 'react-chartjs-2';
import dynamic from 'next/dynamic';

// Динамический импорт ApexCharts для клиентской стороны
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

// Регистрация компонентов Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, ChartTooltip, ChartLegend, ArcElement, PointElement, LineElement, RadialLinearScale, Filler);

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088fe', '#00c49f', '#ffbb28', '#ff8042'];

// Примеры данных
const lineData = [
  { name: 'Янв', value: 400, value2: 240 },
  { name: 'Фев', value: 300, value2: 456 },
  { name: 'Мар', value: 300, value2: 139 },
  { name: 'Апр', value: 200, value2: 980 },
  { name: 'Май', value: 278, value2: 390 },
  { name: 'Июн', value: 189, value2: 480 },
];

const pieData = [
  { name: 'Группа A', value: 400 },
  { name: 'Группа B', value: 300 },
  { name: 'Группа C', value: 300 },
  { name: 'Группа D', value: 200 },
];

const radarData = [
  { subject: 'Математика', A: 120, B: 110, fullMark: 150 },
  { subject: 'Китайский', A: 98, B: 130, fullMark: 150 },
  { subject: 'Английский', A: 86, B: 130, fullMark: 150 },
  { subject: 'География', A: 99, B: 100, fullMark: 150 },
  { subject: 'Физика', A: 85, B: 90, fullMark: 150 },
  { subject: 'История', A: 65, B: 85, fullMark: 150 },
];

export const AdvancedLineChart = ({ 
  isPreview = false,
  constructorMode = false,
  isEditing = false,
  onSave = null,
  onCancel = null,
  onUpdate = () => {},
  title: initialTitle = 'Линейный график',
  description: initialDescription = '',
  data: initialData = lineData,
  strokeWidth = 2,
  showGrid = true,
  showLegend = true,
  titleColor = '#1976d2',
  backgroundColor = '#ffffff',
  backgroundType = 'solid',
  gradientStart = '#f5f5f5',
  gradientEnd = '#e0e0e0',
  gradientDirection = 'to bottom',
  lineColors = ['#8884d8', '#82ca9d'],
  lineNames = ['Линия 1', 'Линия 2'],
  gridColor = '#e0e0e0',
  axisColor = '#666666',
  tooltipBg = '#ffffff',
  legendColor = '#333333',
  borderRadius = 8,
  padding = 24,
  chartHeight = 300,
  chartWidth = '100%',
  maxWidth = '100%',
  colorSettings = {},
  animationSettings = {
    type: 'fadeIn',
    duration: 0.8,
    delay: 0.2
  }
}) => {
  const [data, setData] = useState(initialData);
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [localEditing, setLocalEditing] = useState(false);
  const [colorPickerOpen, setColorPickerOpen] = useState(null);
  const [editData, setEditData] = useState({
    title: initialTitle,
    description,
    data,
    strokeWidth,
    showGrid,
    showLegend,
    titleColor,
    backgroundColor,
    backgroundType,
    gradientStart,
    gradientEnd,
    gradientDirection,
    lineColors,
    lineNames,
    gridColor,
    axisColor,
    tooltipBg,
    legendColor,
    borderRadius,
    padding,
    chartHeight,
    chartWidth,
    maxWidth,
    colorSettings: {
      ...colorSettings,
      lineColors: {
        line1: lineColors[0] || '#8884d8',
        line2: lineColors[1] || '#82ca9d'
      }
    },
    animationSettings
  });

  // 🔥 ИСПРАВЛЕНИЕ: Синхронизируем colorSettings с editData.lineColors
  // Приоритет: textFields.line1/line2 > lineColors.line1/line2
  useEffect(() => {
    const defaultColors = ['#8884d8', '#82ca9d'];
    const newLineColors = [...(editData.lineColors || defaultColors)];
    let colorsChanged = false;
    
    // 🔥 НОВЫЕ ПОЛЯ: Проверяем textFields.line1 и line2 (приоритет)
    const line1FromTextFields = colorSettings?.textFields?.line1 || editData.colorSettings?.textFields?.line1;
    const line2FromTextFields = colorSettings?.textFields?.line2 || editData.colorSettings?.textFields?.line2;
    
    if (line1FromTextFields && line1FromTextFields !== newLineColors[0]) {
      newLineColors[0] = line1FromTextFields;
      colorsChanged = true;
      console.log('🔥 [AdvancedLineChart] Найден line1 из textFields:', line1FromTextFields);
    }
    
    if (line2FromTextFields && line2FromTextFields !== newLineColors[1]) {
      newLineColors[1] = line2FromTextFields;
      colorsChanged = true;
      console.log('🔥 [AdvancedLineChart] Найден line2 из textFields:', line2FromTextFields);
    }
    
    // Проверяем lineColors.line1 и line2 (fallback)
    if (!line1FromTextFields && colorSettings?.lineColors?.line1) {
      if (colorSettings.lineColors.line1 !== newLineColors[0]) {
        newLineColors[0] = colorSettings.lineColors.line1;
        colorsChanged = true;
        console.log('🔥 [AdvancedLineChart] Найден line1 из lineColors:', colorSettings.lineColors.line1);
      }
    }
    
    if (!line2FromTextFields && colorSettings?.lineColors?.line2) {
      if (colorSettings.lineColors.line2 !== newLineColors[1]) {
        newLineColors[1] = colorSettings.lineColors.line2;
        colorsChanged = true;
        console.log('🔥 [AdvancedLineChart] Найден line2 из lineColors:', colorSettings.lineColors.line2);
      }
    }
    
    // Если цвета изменились, обновляем editData
    if (colorsChanged) {
      const finalLineColors = newLineColors.length > 0 ? newLineColors : defaultColors;
      console.log('🔥 [AdvancedLineChart] Обновляем editData.lineColors на:', finalLineColors);
      
      setEditData(prev => ({
        ...prev,
        lineColors: finalLineColors,
        // 🔥 Синхронизируем colorSettings в editData
        colorSettings: {
          ...prev.colorSettings,
          textFields: {
            ...prev.colorSettings?.textFields,
            line1: finalLineColors[0] || '#8884d8',
            line2: finalLineColors[1] || '#82ca9d'
          },
          lineColors: {
            line1: finalLineColors[0] || '#8884d8',
            line2: finalLineColors[1] || '#82ca9d'
          }
        }
      }));
    }
  }, [colorSettings?.textFields?.line1, colorSettings?.textFields?.line2, colorSettings?.lineColors?.line1, colorSettings?.lineColors?.line2, editData.colorSettings?.textFields?.line1, editData.colorSettings?.textFields?.line2]);

  // Синхронизируем colorSettings.textFields с editData цветами
  useEffect(() => {
    if (colorSettings?.textFields) {
      const updates = {};
      
      if (colorSettings.textFields.title) {
        updates.titleColor = colorSettings.textFields.title;
      }
      if (colorSettings.textFields.grid) {
        updates.gridColor = colorSettings.textFields.grid;
      }
      if (colorSettings.textFields.legend) {
        updates.legendColor = colorSettings.textFields.legend;
      }
      if (colorSettings.textFields.axis) {
        updates.axisColor = colorSettings.textFields.axis;
      }
      if (colorSettings.textFields.tooltip) {
        updates.tooltipBg = colorSettings.textFields.tooltip;
      }
      
      if (Object.keys(updates).length > 0) {
        setEditData(prev => ({
          ...prev,
          ...updates
        }));
        console.log('🔥 [AdvancedLineChart] Обновили текстовые цвета из colorSettings:', updates);
      }
    }
  }, [colorSettings?.textFields]);

  // Синхронизируем colorSettings.sectionBackground с editData
  useEffect(() => {
    if (colorSettings?.sectionBackground?.enabled) {
      const { sectionBackground } = colorSettings;
      
      let backgroundType = 'solid';
      let backgroundColor = sectionBackground.solidColor;
      let gradientStart = sectionBackground.gradientColor1;
      let gradientEnd = sectionBackground.gradientColor2;
      let gradientDirection = sectionBackground.gradientDirection;
      
      if (sectionBackground.useGradient) {
        backgroundType = 'gradient';
      }
      
      setEditData(prev => ({
        ...prev,
        backgroundType,
        backgroundColor,
        gradientStart,
        gradientEnd,
        gradientDirection
      }));
      console.log('🔥 [AdvancedLineChart] Обновили фон из colorSettings:', { backgroundType, backgroundColor, gradientStart, gradientEnd, gradientDirection });
    }
  }, [colorSettings?.sectionBackground]);

  // Синхронизируем colorSettings.borderSettings с editData
  useEffect(() => {
    if (colorSettings?.borderSettings) {
      const { borderSettings } = colorSettings;
      
      const updates = {};
      if (borderSettings.enabled) {
        if (borderSettings.color) {
          updates.borderColor = borderSettings.color;
        }
        if (borderSettings.width) {
          updates.borderWidth = borderSettings.width;
        }
      }
      
      if (Object.keys(updates).length > 0) {
        setEditData(prev => ({
          ...prev,
          ...updates
        }));
        console.log('🔥 [AdvancedLineChart] Обновили настройки границ из colorSettings:', updates);
      }
    }
  }, [colorSettings?.borderSettings]);

  // Синхронизируем colorSettings.borderRadius и padding с editData
  useEffect(() => {
    const updates = {};
    
    if (colorSettings?.borderRadius) {
      updates.borderRadius = colorSettings.borderRadius;
    }
    if (colorSettings?.padding) {
      updates.padding = colorSettings.padding;
    }
    
    if (Object.keys(updates).length > 0) {
      setEditData(prev => ({
        ...prev,
        ...updates
      }));
      console.log('🔥 [AdvancedLineChart] Обновили borderRadius и padding из colorSettings:', updates);
    }
  }, [colorSettings?.borderRadius, colorSettings?.padding]);

  const handleDoubleClick = () => {
    if (constructorMode) {
      setLocalEditing(true);
    }
  };

  const handleSave = () => {
    setLocalEditing(false);
    setTitle(editData.title);
    setDescription(editData.description);
    setData(editData.data);
    if (onSave) {
      onSave(editData);
    } else {
      onUpdate(editData);
    }
  };

  const handleCancel = () => {
    setLocalEditing(false);
    setColorPickerOpen(null);
    setEditData({
      title,
      description,
      data,
      strokeWidth,
      showGrid,
      showLegend,
      titleColor,
      backgroundColor,
      backgroundType,
      gradientStart,
      gradientEnd,
      gradientDirection,
      lineColors,
      lineNames,
      gridColor,
      axisColor,
      tooltipBg,
      legendColor,
      borderRadius,
      padding,
      chartHeight,
      chartWidth,
      maxWidth,
      colorSettings: {
        ...colorSettings,
        lineColors: {
          line1: lineColors[0] || '#8884d8',
          line2: lineColors[1] || '#82ca9d'
        }
      },
      animationSettings
    });
    if (onCancel) {
      onCancel();
    }
  };

  const handleColorChange = (colorKey, color) => {
    if (colorKey === 'lineColors') {
      const index = colorPickerOpen.split('-')[1];
      const newColors = [...editData.lineColors];
      newColors[index] = color.hex;
      setEditData({ ...editData, lineColors: newColors });
    } else {
      setEditData({ ...editData, [colorKey]: color.hex });
    }
  };

  const handleColorUpdate = (newColorSettings) => {
    console.log('🔥 [AdvancedLineChart] handleColorUpdate вызван с:', newColorSettings);
    
    // Обновляем colorSettings и синхронизируем lineColors
    const updatedEditData = { ...editData, colorSettings: newColorSettings };
    
    const defaultColors = ['#8884d8', '#82ca9d'];
    const existingLineColors = [...(editData.lineColors || defaultColors)];
    const newLineColors = [...existingLineColors];
    
    // 🔥 НОВЫЕ ПОЛЯ: Приоритет textFields.line1/line2
    if (newColorSettings.textFields?.line1) {
      newLineColors[0] = newColorSettings.textFields.line1;
      console.log('🔥 [AdvancedLineChart] Обновлен line1 из textFields:', newColorSettings.textFields.line1);
    }
    if (newColorSettings.textFields?.line2) {
      newLineColors[1] = newColorSettings.textFields.line2;
      console.log('🔥 [AdvancedLineChart] Обновлен line2 из textFields:', newColorSettings.textFields.line2);
    }
    
    // Fallback на lineColors.line1/line2
    if (!newColorSettings.textFields?.line1 && newColorSettings.lineColors?.line1) {
      newLineColors[0] = newColorSettings.lineColors.line1;
      console.log('🔥 [AdvancedLineChart] Обновлен line1 из lineColors:', newColorSettings.lineColors.line1);
    }
    if (!newColorSettings.textFields?.line2 && newColorSettings.lineColors?.line2) {
      newLineColors[1] = newColorSettings.lineColors.line2;
      console.log('🔥 [AdvancedLineChart] Обновлен line2 из lineColors:', newColorSettings.lineColors.line2);
    }
    
    updatedEditData.lineColors = newLineColors;
    console.log('🔥 [AdvancedLineChart] handleColorUpdate - обновлены lineColors на:', newLineColors);
    console.log('🔥 [AdvancedLineChart] handleColorUpdate - финальный updatedEditData:', updatedEditData);
    
    setEditData(updatedEditData);
  };

  // Вспомогательная функция для получения цветов с приоритетом colorSettings
  const getColor = (fieldName, fallbackValue) => {
    return editData.colorSettings?.textFields?.[fieldName] || fallbackValue;
  };

  const handleAnimationUpdate = (newSettings) => {
    setEditData({ ...editData, animationSettings: newSettings });
  };

  const getBackgroundStyle = () => {
    // Приоритет для colorSettings
    if (editData.colorSettings?.sectionBackground?.enabled) {
      const { sectionBackground } = editData.colorSettings;
      if (sectionBackground.useGradient) {
        return {
          background: `linear-gradient(${sectionBackground.gradientDirection || 'to bottom'}, ${sectionBackground.gradientColor1}, ${sectionBackground.gradientColor2})`,
          opacity: sectionBackground.opacity || 1
        };
      } else {
        return {
          backgroundColor: sectionBackground.solidColor,
          opacity: sectionBackground.opacity || 1
        };
      }
    }
    
    // Fallback на старые настройки
    if (editData.backgroundType === 'gradient') {
      return {
        background: `linear-gradient(${editData.gradientDirection}, ${editData.gradientStart}, ${editData.gradientEnd})`
      };
    }
    return {
      backgroundColor: editData.backgroundColor
    };
  };

  const isCurrentlyEditing = isEditing || localEditing;

  return (
    <EditableElementWrapper 
      editable={constructorMode} 
      onStartEdit={handleDoubleClick}
      isEditing={isCurrentlyEditing}
    >
      <AnimationWrapper {...(editData.animationSettings || animationSettings)}>
        <Paper 
          sx={{ 
            mb: 2,
            borderRadius: `${editData.borderRadius}px`,
            overflow: 'hidden',
            maxWidth: editData.maxWidth || '100%',
            width: editData.chartWidth || '100%',
            ...getBackgroundStyle()
          }}
        >
          {isCurrentlyEditing ? (
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" color="primary" sx={{ mb: 3 }}>
                🎨 Редактирование линейного графика
              </Typography>

              {/* Настройки названий линий */}
              <Accordion sx={{ mb: 2 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="subtitle1">📊 Названия линий</Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <TextField
                        label="Название первой линии"
                        value={editData.lineNames ? editData.lineNames[0] : 'Линия 1'}
                        onChange={(e) => {
                          const newNames = editData.lineNames ? [...editData.lineNames] : ['Линия 1', 'Линия 2'];
                          newNames[0] = e.target.value;
                          setEditData({ ...editData, lineNames: newNames });
                        }}
                        fullWidth
                        size="small"
                        placeholder="Например: Продажи"
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        label="Название второй линии"
                        value={editData.lineNames ? editData.lineNames[1] : 'Линия 2'}
                        onChange={(e) => {
                          const newNames = editData.lineNames ? [...editData.lineNames] : ['Линия 1', 'Линия 2'];
                          newNames[1] = e.target.value;
                          setEditData({ ...editData, lineNames: newNames });
                        }}
                        fullWidth
                        size="small"
                        placeholder="Например: Прибыль"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Box sx={{ mt: 1, p: 2, backgroundColor: '#f0f8ff', borderRadius: 1, border: '1px solid #e3f2fd' }}>
                        <Typography variant="caption" color="text.secondary">
                          💡 <strong>Совет:</strong> Эти названия будут отображаться в легенде и подсказках при наведении
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>

              {/* Основные настройки */}
              <Accordion defaultExpanded sx={{ mb: 2 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TuneIcon />
                    <Typography variant="subtitle1">Основные настройки</Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        label="Заголовок графика"
                        value={editData.title}
                        onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                        fullWidth
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Описание графика"
                        value={editData.description}
                        onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                        fullWidth
                        multiline
                        rows={3}
                        size="small"
                        placeholder="Введите описание графика..."
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <Box>
                        <Typography variant="body2" gutterBottom>Высота графика: {editData.chartHeight}px</Typography>
                        <Slider
                          value={editData.chartHeight}
                          onChange={(e, value) => setEditData({ ...editData, chartHeight: value })}
                          min={200}
                          max={600}
                          size="small"
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box>
                        <Typography variant="body2" gutterBottom>Ширина графика: {editData.chartWidth}</Typography>
                        <Select
                          value={editData.chartWidth}
                          onChange={(e) => setEditData({ ...editData, chartWidth: e.target.value })}
                          size="small"
                          fullWidth
                        >
                          <MenuItem value="100%">100% (полная ширина)</MenuItem>
                          <MenuItem value="800px">800px (фиксированная)</MenuItem>
                          <MenuItem value="600px">600px (компактная)</MenuItem>
                          <MenuItem value="400px">400px (узкая)</MenuItem>
                        </Select>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box>
                        <Typography variant="body2" gutterBottom>Толщина линии: {editData.strokeWidth}px</Typography>
                        <Slider
                          value={editData.strokeWidth}
                          onChange={(e, value) => setEditData({ ...editData, strokeWidth: value })}
                          min={1}
                          max={10}
                          size="small"
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        <FormControlLabel
                          control={
                            <Switch 
                              checked={editData.showGrid} 
                              onChange={(e) => setEditData({ ...editData, showGrid: e.target.checked })} 
                            />
                          }
                          label="Показать сетку"
                        />
                        <FormControlLabel
                          control={
                            <Switch 
                              checked={editData.showLegend} 
                              onChange={(e) => setEditData({ ...editData, showLegend: e.target.checked })} 
                            />
                          }
                          label="Показать легенду"
                        />
                      </Box>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>



              {/* Настройки цветов и фона */}
              <Accordion sx={{ mb: 2 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PaletteIcon />
                    <Typography variant="subtitle1">Настройки цветов и фона</Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <ColorSettings
                    title="Настройки цветов линейного графика"
                    colorSettings={(() => {
                      // Исключаем areaColors из colorSettings чтобы скрыть секцию
                      const { areaColors, ...restColorSettings } = editData.colorSettings || {};
                      return {
                        ...restColorSettings,
                        textFields: {
                          ...restColorSettings.textFields,
                          // 🔥 НОВЫЕ ПОЛЯ: Цвета линий в textFields
                          line1: restColorSettings.textFields?.line1 || editData.lineColors?.[0] || '#8884d8',
                          line2: restColorSettings.textFields?.line2 || editData.lineColors?.[1] || '#82ca9d'
                        },
                        lineColors: {
                          line1: editData.lineColors[0] || '#8884d8',
                          line2: editData.lineColors[1] || '#82ca9d'
                        }
                      };
                    })()}
                    onUpdate={handleColorUpdate}
                    availableFields={[
                      {
                        name: 'title',
                        label: 'Цвет заголовка',
                        description: 'Цвет заголовка графика',
                        defaultColor: getColor('title', editData.titleColor || '#1976d2')
                      },
                      {
                        name: 'grid',
                        label: 'Цвет сетки',
                        description: 'Цвет линий сетки графика',
                        defaultColor: getColor('grid', editData.gridColor || '#e0e0e0')
                      },
                      {
                        name: 'legend',
                        label: 'Цвет легенды',
                        description: 'Цвет текста легенды',
                        defaultColor: getColor('legend', editData.legendColor || '#333333')
                      },
                      {
                        name: 'axis',
                        label: 'Цвет осей',
                        description: 'Цвет осей координат',
                        defaultColor: getColor('axis', editData.axisColor || '#666666')
                      },
                      // 🔥 НОВЫЕ ПОЛЯ: Цвета линий
                      {
                        name: 'line1',
                        label: 'Цвет первой линии',
                        description: 'Цвет первой линии графика',
                        defaultColor: editData.colorSettings?.textFields?.line1 || editData.lineColors?.[0] || '#8884d8'
                      },
                      {
                        name: 'line2',
                        label: 'Цвет второй линии',
                        description: 'Цвет второй линии графика',
                        defaultColor: editData.colorSettings?.textFields?.line2 || editData.lineColors?.[1] || '#82ca9d'
                      }
                    ]}
                    defaultColors={{
                      title: getColor('title', editData.titleColor || '#1976d2'),
                      grid: getColor('grid', editData.gridColor || '#e0e0e0'),
                      legend: getColor('legend', editData.legendColor || '#333333'),
                      axis: getColor('axis', editData.axisColor || '#666666'),
                      // 🔥 НОВЫЕ ПОЛЯ: Цвета линий
                      line1: editData.colorSettings?.textFields?.line1 || editData.lineColors?.[0] || '#8884d8',
                      line2: editData.colorSettings?.textFields?.line2 || editData.lineColors?.[1] || '#82ca9d'
                    }}
                    hideCardBackground={true}
                    hideAreaColors={true}
                  />
                  

                  
                  {/* Дополнительные настройки стилей */}
                  <Grid container spacing={2} sx={{ mt: 2 }}>
                    <Grid item xs={6}>
                      <Box>
                        <Typography variant="body2" gutterBottom>Радиус скругления: {editData.borderRadius}px</Typography>
                        <Slider
                          value={editData.borderRadius}
                          onChange={(e, value) => setEditData({ ...editData, borderRadius: value })}
                          min={0}
                          max={20}
                          size="small"
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box>
                        <Typography variant="body2" gutterBottom>Отступы: {editData.padding}px</Typography>
                        <Slider
                          value={editData.padding}
                          onChange={(e, value) => setEditData({ ...editData, padding: value })}
                          min={8}
                          max={48}
                          size="small"
                        />
                      </Box>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>

              {/* Данные графика */}
              <Accordion sx={{ mb: 2 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <DataObjectIcon />
                    <Typography variant="subtitle1">Данные графика</Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
                    {editData.data.map((item, index) => (
                      <Card key={index} sx={{ mb: 1, p: 1 }}>
                        <Grid container spacing={1} alignItems="center">
                          <Grid item xs={3}>
                            <TextField
                              label="Название"
                              value={item.name}
                              onChange={(e) => {
                                const newData = [...editData.data];
                                newData[index] = { ...newData[index], name: e.target.value };
                                setEditData({ ...editData, data: newData });
                              }}
                              size="small"
                              fullWidth
                            />
                          </Grid>
                          <Grid item xs={3}>
                            <TextField
                              label="Значение 1"
                              type="number"
                              value={item.value}
                              onChange={(e) => {
                                const newData = [...editData.data];
                                newData[index] = { ...newData[index], value: parseInt(e.target.value) || 0 };
                                setEditData({ ...editData, data: newData });
                              }}
                              size="small"
                              fullWidth
                            />
                          </Grid>
                          <Grid item xs={3}>
                            <TextField
                              label="Значение 2"
                              type="number"
                              value={item.value2}
                              onChange={(e) => {
                                const newData = [...editData.data];
                                newData[index] = { ...newData[index], value2: parseInt(e.target.value) || 0 };
                                setEditData({ ...editData, data: newData });
                              }}
                              size="small"
                              fullWidth
                            />
                          </Grid>
                          <Grid item xs={3}>
                            <IconButton
                              onClick={() => {
                                const newData = editData.data.filter((_, i) => i !== index);
                                setEditData({ ...editData, data: newData });
                              }}
                              color="error"
                              size="small"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Grid>
                        </Grid>
                      </Card>
                    ))}
                    <Button
                      startIcon={<AddIcon />}
                      onClick={() => {
                        const newData = [...editData.data, { name: `Точка ${editData.data.length + 1}`, value: 100, value2: 100 }];
                        setEditData({ ...editData, data: newData });
                      }}
                      variant="outlined"
                      fullWidth
                      sx={{ mt: 1 }}
                    >
                      Добавить точку данных
                    </Button>
                  </Box>
                </AccordionDetails>
              </Accordion>

              {/* Настройки анимации */}
              <Accordion sx={{ mb: 2 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="subtitle1">Анимация</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <AnimationControls
                    animationSettings={editData.animationSettings || animationSettings}
                    onUpdate={handleAnimationUpdate}
                  />
                </AccordionDetails>
              </Accordion>

              {/* Color Picker Modal */}
              {colorPickerOpen && (
                <Box
                  sx={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 9999
                  }}
                  onClick={() => setColorPickerOpen(null)}
                >
                  <Box onClick={(e) => e.stopPropagation()}>
                    <SketchPicker
                      color={colorPickerOpen.includes('lineColors') 
                        ? editData.lineColors[colorPickerOpen.split('-')[1]] 
                        : editData[colorPickerOpen]
                      }
                      onChange={(color) => handleColorChange(colorPickerOpen, color)}
                    />
                  </Box>
                </Box>
              )}
              
              <Divider sx={{ my: 3 }} />
              
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button onClick={handleCancel} variant="outlined">
                  Отмена
                </Button>
                <Button onClick={handleSave} variant="contained">
                  Сохранить изменения
                </Button>
              </Box>
            </Box>
        ) : (
          <Box sx={{ p: editData.padding }}>
            <Typography 
              variant="h6" 
              sx={{ 
                mb: description ? 1 : 2, 
                color: getColor('title', editData.titleColor),
                textAlign: 'center'
              }}
            >
              {title}
            </Typography>
            
            {/* Описание */}
            {description && (
              <Typography 
                variant="body2" 
                align="center" 
                sx={{ 
                  color: getColor('legend', editData.legendColor), 
                  mb: 2,
                  fontSize: '0.9rem',
                  lineHeight: 1.5,
                  maxWidth: '800px',
                  mx: 'auto'
                }}
              >
                {description}
              </Typography>
            )}
            <ResponsiveContainer width={editData.chartWidth || "100%"} height={editData.chartHeight}>
              <LineChart data={data}>
                {editData.showGrid && <CartesianGrid strokeDasharray="3 3" stroke={getColor('grid', editData.gridColor)} />}
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: getColor('axis', editData.axisColor) }}
                  axisLine={{ stroke: getColor('axis', editData.axisColor) }}
                  tickLine={{ stroke: getColor('axis', editData.axisColor) }}
                />
                <YAxis 
                  tick={{ fill: getColor('axis', editData.axisColor) }}
                  axisLine={{ stroke: getColor('axis', editData.axisColor) }}
                  tickLine={{ stroke: getColor('axis', editData.axisColor) }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: editData.tooltipBg,
                    border: '1px solid #ccc',
                    borderRadius: '4px'
                  }}
                />
                {editData.showLegend && (
                  <Legend 
                    wrapperStyle={{ color: getColor('legend', editData.legendColor) }}
                  />
                )}
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke={(colorSettings?.textFields?.line1) || (editData.colorSettings?.textFields?.line1) || (editData.lineColors && editData.lineColors[0]) || (colorSettings?.lineColors?.line1) || '#8884d8'} 
                  strokeWidth={editData.strokeWidth}
                  dot={{ fill: (colorSettings?.textFields?.line1) || (editData.colorSettings?.textFields?.line1) || (editData.lineColors && editData.lineColors[0]) || (colorSettings?.lineColors?.line1) || '#8884d8' }}
                  name={editData.lineNames ? editData.lineNames[0] : "Линия 1"}
                />
                <Line 
                  type="monotone" 
                  dataKey="value2" 
                  stroke={(colorSettings?.textFields?.line2) || (editData.colorSettings?.textFields?.line2) || (editData.lineColors && editData.lineColors[1]) || (colorSettings?.lineColors?.line2) || '#82ca9d'} 
                  strokeWidth={editData.strokeWidth}
                  dot={{ fill: (colorSettings?.textFields?.line2) || (editData.colorSettings?.textFields?.line2) || (editData.lineColors && editData.lineColors[1]) || (colorSettings?.lineColors?.line2) || '#82ca9d' }}
                  name={editData.lineNames ? editData.lineNames[1] : "Линия 2"}
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        )}
      </Paper>
      </AnimationWrapper>
    </EditableElementWrapper>
  );
};

export const AdvancedBarChart = ({ 
  isPreview = false,
  constructorMode = false,
  isEditing = false,
  onSave = null,
  onCancel = null,
  onUpdate = () => {},
  title: initialTitle = 'Столбчатая диаграмма',
  data: initialData = lineData,
  showGrid = true,
  showLegend = true,
  titleColor = '#1976d2',
  backgroundColor = '#ffffff',
  backgroundType = 'solid',
  gradientStart = '#f5f5f5',
  gradientEnd = '#e0e0e0',
  gradientDirection = 'to bottom',
  barColors = ['#8884d8', '#82ca9d'],
  gridColor = '#e0e0e0',
  axisColor = '#666666',
  tooltipBg = '#ffffff',
  legendColor = '#333333',
  borderRadius = 8,
  padding = 24,
  chartHeight = 300,
  animationSettings = {
    type: 'scaleIn',
    duration: 0.7,
    delay: 0.1
  }
}) => {
  const [data, setData] = useState(initialData);
  const [title, setTitle] = useState(initialTitle);
  const [localEditing, setLocalEditing] = useState(false);
  const [colorPickerOpen, setColorPickerOpen] = useState(null);
  const [editData, setEditData] = useState({
    title: initialTitle,
    data: initialData,
    showGrid,
    showLegend,
    titleColor,
    backgroundColor,
    backgroundType,
    gradientStart,
    gradientEnd,
    gradientDirection,
    barColors,
    gridColor,
    axisColor,
    tooltipBg,
    legendColor,
    borderRadius,
    padding,
    chartHeight,
    animationSettings
  });

  const handleDoubleClick = () => {
    if (constructorMode) {
      setLocalEditing(true);
    }
  };

  const handleSave = () => {
    setLocalEditing(false);
    setTitle(editData.title);
    setData(editData.data);
    if (onSave) {
      onSave(editData);
    } else {
      onUpdate(editData);
    }
  };

  const handleCancel = () => {
    setLocalEditing(false);
    setColorPickerOpen(null);
    setEditData({
      title,
      data,
      showGrid,
      showLegend,
      titleColor,
      backgroundColor,
      backgroundType,
      gradientStart,
      gradientEnd,
      gradientDirection,
      barColors,
      gridColor,
      axisColor,
      tooltipBg,
      legendColor,
      borderRadius,
      padding,
      chartHeight,
      animationSettings
    });
    if (onCancel) {
      onCancel();
    }
  };

  const handleColorChange = (colorKey, color) => {
    if (colorKey === 'barColors') {
      const index = colorPickerOpen.split('-')[1];
      const newColors = [...editData.barColors];
      newColors[index] = color.hex;
      setEditData({ ...editData, barColors: newColors });
    } else {
      setEditData({ ...editData, [colorKey]: color.hex });
    }
  };

  const handleAnimationUpdate = (newSettings) => {
    setEditData({ ...editData, animationSettings: newSettings });
  };

  const getBackgroundStyle = () => {
    if (editData.backgroundType === 'gradient') {
      return {
        background: `linear-gradient(${editData.gradientDirection}, ${editData.gradientStart}, ${editData.gradientEnd})`
      };
    }
    return {
      backgroundColor: editData.backgroundColor
    };
  };

  const isCurrentlyEditing = isEditing || localEditing;

  return (
    <EditableElementWrapper 
      editable={constructorMode} 
      onStartEdit={handleDoubleClick}
      isEditing={isCurrentlyEditing}
    >
      <AnimationWrapper {...(editData.animationSettings || animationSettings)}>
        <Paper 
          sx={{ 
            mb: 2,
            borderRadius: `${editData.borderRadius}px`,
            overflow: 'hidden',
            ...getBackgroundStyle()
          }}
        >
          {isCurrentlyEditing ? (
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" color="primary" sx={{ mb: 3 }}>
                📊 Редактирование столбчатой диаграммы
              </Typography>

              {/* Аналогичный интерфейс как у LineChart */}
              <Accordion defaultExpanded sx={{ mb: 2 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TuneIcon />
                    <Typography variant="subtitle1">Основные настройки</Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        label="Заголовок диаграммы"
                        value={editData.title}
                        onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                        fullWidth
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Box>
                        <Typography variant="body2" gutterBottom>Высота диаграммы: {editData.chartHeight}px</Typography>
                        <Slider
                          value={editData.chartHeight}
                          onChange={(e, value) => setEditData({ ...editData, chartHeight: value })}
                          min={200}
                          max={600}
                          size="small"
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        <FormControlLabel
                          control={
                            <Switch 
                              checked={editData.showGrid} 
                              onChange={(e) => setEditData({ ...editData, showGrid: e.target.checked })} 
                            />
                          }
                          label="Показать сетку"
                        />
                        <FormControlLabel
                          control={
                            <Switch 
                              checked={editData.showLegend} 
                              onChange={(e) => setEditData({ ...editData, showLegend: e.target.checked })} 
                            />
                          }
                          label="Показать легенду"
                        />
                      </Box>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>

              {/* Настройки цветов */}
              <Accordion sx={{ mb: 2 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PaletteIcon />
                    <Typography variant="subtitle1">Цвета и стили</Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" gutterBottom>Цвет заголовка</Typography>
                      <Box
                        onClick={() => setColorPickerOpen('titleColor')}
                        sx={{
                          width: '100%',
                          height: 40,
                          backgroundColor: editData.titleColor,
                          border: '1px solid #ccc',
                          borderRadius: 1,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Typography variant="body2" sx={{ color: 'white', textShadow: '1px 1px 1px rgba(0,0,0,0.5)' }}>
                          {editData.titleColor}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" gutterBottom>Цвет сетки</Typography>
                      <Box
                        onClick={() => setColorPickerOpen('gridColor')}
                        sx={{
                          width: '100%',
                          height: 40,
                          backgroundColor: editData.gridColor,
                          border: '1px solid #ccc',
                          borderRadius: 1,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Typography variant="body2" sx={{ color: 'white', textShadow: '1px 1px 1px rgba(0,0,0,0.5)' }}>
                          {editData.gridColor}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" gutterBottom>Цвет осей</Typography>
                      <Box
                        onClick={() => setColorPickerOpen('axisColor')}
                        sx={{
                          width: '100%',
                          height: 40,
                          backgroundColor: editData.axisColor,
                          border: '1px solid #ccc',
                          borderRadius: 1,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Typography variant="body2" sx={{ color: 'white', textShadow: '1px 1px 1px rgba(0,0,0,0.5)' }}>
                          {editData.axisColor}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" gutterBottom>Цвет легенды</Typography>
                      <Box
                        onClick={() => setColorPickerOpen('legendColor')}
                        sx={{
                          width: '100%',
                          height: 40,
                          backgroundColor: editData.legendColor,
                          border: '1px solid #ccc',
                          borderRadius: 1,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Typography variant="body2" sx={{ color: 'white', textShadow: '1px 1px 1px rgba(0,0,0,0.5)' }}>
                          {editData.legendColor}
                        </Typography>
                      </Box>
                    </Grid>

                    {/* Цвета столбцов */}
                    <Grid item xs={12}>
                      <Typography variant="body2" gutterBottom>Цвета столбцов</Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {editData.barColors.map((color, index) => (
                          <Box key={index} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Typography variant="caption">Столбец {index + 1}</Typography>
                            <Box
                              onClick={() => setColorPickerOpen(`barColors-${index}`)}
                              sx={{
                                width: 60,
                                height: 30,
                                backgroundColor: color,
                                border: '1px solid #ccc',
                                borderRadius: 1,
                                cursor: 'pointer'
                              }}
                            />
                          </Box>
                        ))}
                      </Box>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>

              {/* Настройки фона - идентично LineChart */}
              <Accordion sx={{ mb: 2 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="subtitle1">Настройки фона</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography variant="body2" gutterBottom>Тип фона</Typography>
                      <RadioGroup
                        value={editData.backgroundType}
                        onChange={(e) => setEditData({ ...editData, backgroundType: e.target.value })}
                        row
                      >
                        <FormControlLabel value="solid" control={<Radio />} label="Сплошной" />
                        <FormControlLabel value="gradient" control={<Radio />} label="Градиент" />
                      </RadioGroup>
                    </Grid>
                    
                    {editData.backgroundType === 'solid' ? (
                      <Grid item xs={12}>
                        <Typography variant="body2" gutterBottom>Цвет фона</Typography>
                        <Box
                          onClick={() => setColorPickerOpen('backgroundColor')}
                          sx={{
                            width: '100%',
                            height: 40,
                            backgroundColor: editData.backgroundColor,
                            border: '1px solid #ccc',
                            borderRadius: 1,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <Typography variant="body2" sx={{ color: 'white', textShadow: '1px 1px 1px rgba(0,0,0,0.5)' }}>
                            {editData.backgroundColor}
                          </Typography>
                        </Box>
                      </Grid>
                    ) : (
                      <>
                        <Grid item xs={6}>
                          <Typography variant="body2" gutterBottom>Начальный цвет</Typography>
                          <Box
                            onClick={() => setColorPickerOpen('gradientStart')}
                            sx={{
                              width: '100%',
                              height: 40,
                              backgroundColor: editData.gradientStart,
                              border: '1px solid #ccc',
                              borderRadius: 1,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <Typography variant="body2" sx={{ color: 'white', textShadow: '1px 1px 1px rgba(0,0,0,0.5)' }}>
                              {editData.gradientStart}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" gutterBottom>Конечный цвет</Typography>
                          <Box
                            onClick={() => setColorPickerOpen('gradientEnd')}
                            sx={{
                              width: '100%',
                              height: 40,
                              backgroundColor: editData.gradientEnd,
                              border: '1px solid #ccc',
                              borderRadius: 1,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <Typography variant="body2" sx={{ color: 'white', textShadow: '1px 1px 1px rgba(0,0,0,0.5)' }}>
                              {editData.gradientEnd}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12}>
                          <FormControl fullWidth size="small">
                            <InputLabel>Направление градиента</InputLabel>
                            <Select
                              value={editData.gradientDirection}
                              onChange={(e) => setEditData({ ...editData, gradientDirection: e.target.value })}
                              label="Направление градиента"
                            >
                              <MenuItem value="to bottom">Сверху вниз</MenuItem>
                              <MenuItem value="to top">Снизу вверх</MenuItem>
                              <MenuItem value="to right">Слева направо</MenuItem>
                              <MenuItem value="to left">Справа налево</MenuItem>
                              <MenuItem value="to bottom right">По диагонали ↘</MenuItem>
                              <MenuItem value="to bottom left">По диагонали ↙</MenuItem>
                              <MenuItem value="to top right">По диагонали ↗</MenuItem>
                              <MenuItem value="to top left">По диагонали ↖</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                      </>
                    )}

                    <Grid item xs={6}>
                      <Box>
                        <Typography variant="body2" gutterBottom>Радиус скругления: {editData.borderRadius}px</Typography>
                        <Slider
                          value={editData.borderRadius}
                          onChange={(e, value) => setEditData({ ...editData, borderRadius: value })}
                          min={0}
                          max={20}
                          size="small"
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box>
                        <Typography variant="body2" gutterBottom>Отступы: {editData.padding}px</Typography>
                        <Slider
                          value={editData.padding}
                          onChange={(e, value) => setEditData({ ...editData, padding: value })}
                          min={8}
                          max={48}
                          size="small"
                        />
                      </Box>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>

              {/* Данные диаграммы */}
              <Accordion sx={{ mb: 2 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <DataObjectIcon />
                    <Typography variant="subtitle1">Данные диаграммы</Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
                    {editData.data.map((item, index) => (
                      <Card key={index} sx={{ mb: 1, p: 1 }}>
                        <Grid container spacing={1} alignItems="center">
                          <Grid item xs={3}>
                            <TextField
                              label="Название"
                              value={item.name}
                              onChange={(e) => {
                                const newData = [...editData.data];
                                newData[index] = { ...newData[index], name: e.target.value };
                                setEditData({ ...editData, data: newData });
                              }}
                              size="small"
                              fullWidth
                            />
                          </Grid>
                          <Grid item xs={3}>
                            <TextField
                              label="Значение 1"
                              type="number"
                              value={item.value}
                              onChange={(e) => {
                                const newData = [...editData.data];
                                newData[index] = { ...newData[index], value: parseInt(e.target.value) || 0 };
                                setEditData({ ...editData, data: newData });
                              }}
                              size="small"
                              fullWidth
                            />
                          </Grid>
                          <Grid item xs={3}>
                            <TextField
                              label="Значение 2"
                              type="number"
                              value={item.value2}
                              onChange={(e) => {
                                const newData = [...editData.data];
                                newData[index] = { ...newData[index], value2: parseInt(e.target.value) || 0 };
                                setEditData({ ...editData, data: newData });
                              }}
                              size="small"
                              fullWidth
                            />
                          </Grid>
                          <Grid item xs={3}>
                            <IconButton
                              onClick={() => {
                                const newData = editData.data.filter((_, i) => i !== index);
                                setEditData({ ...editData, data: newData });
                              }}
                              color="error"
                              size="small"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Grid>
                        </Grid>
                      </Card>
                    ))}
                    <Button
                      startIcon={<AddIcon />}
                      onClick={() => {
                        const newData = [...editData.data, { name: `Категория ${editData.data.length + 1}`, value: 100, value2: 100 }];
                        setEditData({ ...editData, data: newData });
                      }}
                      variant="outlined"
                      fullWidth
                      sx={{ mt: 1 }}
                    >
                      Добавить категорию
                    </Button>
                  </Box>
                </AccordionDetails>
              </Accordion>

              {/* Настройки анимации */}
              <Accordion sx={{ mb: 2 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="subtitle1">Анимация</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <AnimationControls
                    animationSettings={editData.animationSettings || animationSettings}
                    onUpdate={handleAnimationUpdate}
                  />
                </AccordionDetails>
              </Accordion>

              {/* Color Picker Modal */}
              {colorPickerOpen && (
                <Box
                  sx={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 9999
                  }}
                  onClick={() => setColorPickerOpen(null)}
                >
                  <Box onClick={(e) => e.stopPropagation()}>
                    <SketchPicker
                      color={colorPickerOpen.includes('barColors') 
                        ? editData.barColors[colorPickerOpen.split('-')[1]] 
                        : editData[colorPickerOpen]
                      }
                      onChange={(color) => handleColorChange(colorPickerOpen, color)}
                    />
                  </Box>
                </Box>
              )}
              
              <Divider sx={{ my: 3 }} />
              
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button onClick={handleCancel} variant="outlined">
                  Отмена
                </Button>
                <Button onClick={handleSave} variant="contained">
                  Сохранить изменения
                </Button>
              </Box>
            </Box>
        ) : (
          <Box sx={{ p: editData.padding }}>
            <Typography 
              variant="h6" 
              sx={{ 
                mb: 2, 
                color: editData.titleColor,
                textAlign: 'center'
              }}
            >
              {title}
            </Typography>
            <ResponsiveContainer width="100%" height={editData.chartHeight}>
              <BarChart data={data}>
                {editData.showGrid && <CartesianGrid strokeDasharray="3 3" stroke={editData.gridColor} />}
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: editData.axisColor }}
                  axisLine={{ stroke: editData.axisColor }}
                  tickLine={{ stroke: editData.axisColor }}
                />
                <YAxis 
                  tick={{ fill: editData.axisColor }}
                  axisLine={{ stroke: editData.axisColor }}
                  tickLine={{ stroke: editData.axisColor }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: editData.tooltipBg,
                    border: '1px solid #ccc',
                    borderRadius: '4px'
                  }}
                />
                {editData.showLegend && (
                  <Legend 
                    wrapperStyle={{ color: editData.legendColor }}
                  />
                )}
                <Bar dataKey="value" fill={editData.barColors[0]} />
                <Bar dataKey="value2" fill={editData.barColors[1]} />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        )}
        </Paper>
      </AnimationWrapper>
    </EditableElementWrapper>
  );
};

export const AdvancedPieChart = ({ 
  isPreview = false,
  constructorMode = false,
  isEditing = false,
  onSave = null,
  onCancel = null,
  onUpdate = () => {},
  title: initialTitle = 'Круговая диаграмма',
  data: initialData = pieData,
  showLabels = true,
  showPercentage = true,
  titleColor = '#1976d2',
  backgroundColor = '#ffffff',
  backgroundType = 'solid',
  gradientStart = '#f5f5f5',
  gradientEnd = '#e0e0e0',
  gradientDirection = 'to bottom',
  pieColors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300'],
  tooltipBg = '#ffffff',
  legendColor = '#333333',
  borderRadius = 1,
  padding = 1,
  chartSize = 700,
  showLegend = true,
  colorSettings = {},
  animationSettings = {
    animationType: 'fadeIn',
    delay: 0,
    triggerOnView: true,
    triggerOnce: true,
    threshold: 0.1,
    disabled: false
  }
}) => {
  const [data, setData] = useState(initialData);
  const [title, setTitle] = useState(initialTitle);
  const [localEditing, setLocalEditing] = useState(false);
  const [colorPickerOpen, setColorPickerOpen] = useState(null);
  const [editData, setEditData] = useState({
    title: initialTitle,
    data: initialData,
    showLabels,
    showPercentage,
    titleColor,
    backgroundColor,
    backgroundType,
    gradientStart,
    gradientEnd,
    gradientDirection,
    pieColors,
    tooltipBg,
    legendColor,
    borderRadius,
    padding,
    chartSize,
    showLegend,
    colorSettings,
    animationSettings
  });

  const handleDoubleClick = () => {
    if (constructorMode) {
      setLocalEditing(true);
    }
  };

  const handleSave = () => {
    setLocalEditing(false);
    setTitle(editData.title);
    setData(editData.data);
    if (onSave) {
      onSave(editData);
    } else {
      onUpdate(editData);
    }
  };

  const handleCancel = () => {
    setLocalEditing(false);
    setColorPickerOpen(null);
    setEditData({
      title,
      data,
      showLabels,
      showPercentage,
      titleColor,
      backgroundColor,
      backgroundType,
      gradientStart,
      gradientEnd,
      gradientDirection,
      pieColors,
      tooltipBg,
      legendColor,
      borderRadius,
      padding,
      chartSize,
      showLegend,
      colorSettings,
      animationSettings
    });
    if (onCancel) {
      onCancel();
    }
  };

  // Синхронизируем colorSettings с editData для всех настроек
  useEffect(() => {
    console.log('🔥 [AdvancedPieChart] useEffect для colorSettings вызван с:', colorSettings);
    if (colorSettings) {
      setEditData(prev => {
        console.log('🔥 [AdvancedPieChart] Обновляем editData.colorSettings с:', colorSettings);
        return {
          ...prev,
          colorSettings: {
            ...prev.colorSettings,
            ...colorSettings
          }
        };
      });
    }
  }, [colorSettings]);

  const handleColorChange = (colorKey, color) => {
    if (colorKey === 'pieColors') {
      const index = colorPickerOpen.split('-')[1];
      const newColors = [...editData.pieColors];
      newColors[index] = color.hex;
      setEditData({ ...editData, pieColors: newColors });
    } else {
      setEditData({ ...editData, [colorKey]: color.hex });
    }
  };

  const handleAnimationUpdate = (newAnimationSettings) => {
    setEditData(prev => ({
      ...prev,
      animationSettings: newAnimationSettings
    }));
  };

  const handleColorUpdate = (newColorSettings) => {
    // Обновляем colorSettings
    setEditData(prev => ({
      ...prev,
      colorSettings: newColorSettings
    }));
    
    // Если обновились цвета сегментов, обновляем pieColors
    if (newColorSettings.segmentColors) {
      // Динамически обновляем pieColors на основе количества сегментов в данных
      const newPieColors = [];
      const maxSegments = Math.max(editData.data.length, Object.keys(newColorSettings.segmentColors).length);
      
      for (let i = 0; i < maxSegments; i++) {
        const segmentKey = `segment${i + 1}`;
        const newColor = newColorSettings.segmentColors[segmentKey];
        if (newColor) {
          newPieColors[i] = newColor;
        } else {
          // Fallback на стандартные цвета
          const defaultColors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088fe', '#00c49f', '#ffbb28', '#ff8042'];
          newPieColors[i] = defaultColors[i % defaultColors.length];
        }
      }
      
      setEditData(prev => ({
        ...prev,
        pieColors: newPieColors
      }));
    }
  };

  // Синхронизируем colorSettings.segmentColors с editData.pieColors
  useEffect(() => {
    console.log('🔥 [AdvancedPieChart] useEffect вызван с colorSettings:', colorSettings);
    console.log('🔥 [AdvancedPieChart] segmentColors:', colorSettings?.segmentColors);
    console.log('🔥 [AdvancedPieChart] editData.pieColors:', editData.pieColors);
    
    if (colorSettings?.segmentColors) {
      const newPieColors = [];
      const maxSegments = Math.max(editData.data.length, Object.keys(colorSettings.segmentColors).length);
      
      console.log('🔥 [AdvancedPieChart] maxSegments:', maxSegments);
      console.log('🔥 [AdvancedPieChart] editData.data.length:', editData.data.length);
      console.log('🔥 [AdvancedPieChart] Object.keys(colorSettings.segmentColors).length:', Object.keys(colorSettings.segmentColors).length);
      
      for (let i = 0; i < maxSegments; i++) {
        const segmentKey = `segment${i + 1}`;
        const newColor = colorSettings.segmentColors[segmentKey];
        if (newColor) {
          newPieColors[i] = newColor;
        } else {
          // Fallback на стандартные цвета
          const defaultColors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088fe', '#00c49f', '#ffbb28', '#ff8042'];
          newPieColors[i] = defaultColors[i % defaultColors.length];
        }
      }
      
      console.log('🔥 [AdvancedPieChart] newPieColors:', newPieColors);
      
      if (newPieColors.length > 0) {
        setEditData(prev => {
          console.log('🔥 [AdvancedPieChart] Обновляем editData с новыми pieColors:', newPieColors);
          return {
            ...prev,
            pieColors: newPieColors
          };
        });
        console.log('🔥 [AdvancedPieChart] Обновили pieColors из colorSettings:', newPieColors);
      }
    } else {
      console.log('🔥 [AdvancedPieChart] colorSettings.segmentColors не найден или пустой');
    }
  }, [colorSettings?.segmentColors, colorSettings]);

  const getBackgroundStyle = () => {
    // Приоритет: colorSettings > старые настройки
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
    if (editData.backgroundType === 'gradient') {
      return {
        background: `linear-gradient(${editData.gradientDirection}, ${editData.gradientStart}, ${editData.gradientEnd})`
      };
    }
    return {
      backgroundColor: editData.backgroundColor
    };
  };

  const isCurrentlyEditing = isEditing || localEditing;

  return (
    <EditableElementWrapper 
      editable={constructorMode} 
      onStartEdit={handleDoubleClick}
      isEditing={isCurrentlyEditing}
    >
      <Paper 
        sx={{ 
          mb: 2,
          borderRadius: `${editData.borderRadius}px`,
          overflow: 'hidden',
          ...getBackgroundStyle()
        }}
      >
        {isCurrentlyEditing ? (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" color="primary" sx={{ mb: 3 }}>
              🥧 Редактирование круговой диаграммы
            </Typography>

            {/* Основные настройки */}
            <Accordion defaultExpanded sx={{ mb: 2 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TuneIcon />
                  <Typography variant="subtitle1">Основные настройки</Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      label="Заголовок диаграммы"
                      value={editData.title}
                      onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                      fullWidth
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, color: '#1976d2' }}>
                      📐 Настройки размера
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Box>
                      <Typography variant="body2" gutterBottom>
                        Размер диаграммы: {editData.chartSize}px
                      </Typography>
                      <Slider
                        value={editData.chartSize}
                        onChange={(e, value) => setEditData({ ...editData, chartSize: value })}
                        min={150}
                        max={800}
                        step={25}
                        size="small"
                        marks={[
                          { value: 150, label: 'Малый' },
                          { value: 300, label: 'Средний' },
                          { value: 500, label: 'Большой' },
                          { value: 700, label: 'По умолчанию' },
                          { value: 800, label: 'Огромный' }
                        ]}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box>
                      <Typography variant="body2" gutterBottom>
                        Толщина диаграммы: {Math.round(editData.chartSize / 3)}px
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Автоматически: 1/3 от размера диаграммы
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box>
                      <Typography variant="body2" gutterBottom>
                        Отступы: {editData.padding}px
                      </Typography>
                      <Slider
                        value={editData.padding}
                        onChange={(e, value) => setEditData({ ...editData, padding: value })}
                        min={0}
                        max={50}
                        step={1}
                        size="small"
                        marks={[
                          { value: 0, label: '0' },
                          { value: 1, label: '1' },
                          { value: 10, label: '10' },
                          { value: 25, label: '25' },
                          { value: 50, label: '50' }
                        ]}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box>
                      <Typography variant="body2" gutterBottom>
                        Скругление углов: {editData.borderRadius}px
                      </Typography>
                      <Slider
                        value={editData.borderRadius}
                        onChange={(e, value) => setEditData({ ...editData, borderRadius: value })}
                        min={0}
                        max={20}
                        step={1}
                        size="small"
                        marks={[
                          { value: 0, label: '0' },
                          { value: 1, label: '1' },
                          { value: 5, label: '5' },
                          { value: 10, label: '10' },
                          { value: 20, label: '20' }
                        ]}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ mt: 1, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        💡 <strong>Рекомендации:</strong><br/>
                        • <strong>Размер:</strong> 700px - оптимальный размер по умолчанию<br/>
                        • <strong>Отступы:</strong> 1px - минимальные отступы для компактности<br/>
                        • <strong>Скругление:</strong> 1px - легкое скругление для современного вида
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                      <FormControlLabel
                        control={
                          <Switch 
                            checked={editData.showLabels} 
                            onChange={(e) => setEditData({ ...editData, showLabels: e.target.checked })} 
                          />
                        }
                        label="Показать названия"
                      />
                      <FormControlLabel
                        control={
                          <Switch 
                            checked={editData.showPercentage} 
                            onChange={(e) => setEditData({ ...editData, showPercentage: e.target.checked })} 
                          />
                        }
                        label="Показать проценты"
                      />
                      <FormControlLabel
                        control={
                          <Switch 
                            checked={editData.showLegend} 
                            onChange={(e) => setEditData({ ...editData, showLegend: e.target.checked })} 
                          />
                        }
                        label="Показать легенду"
                      />
                    </Box>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>

            {/* Настройки цветов через ColorSettings */}
            <Accordion sx={{ mb: 2 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PaletteIcon />
                  <Typography variant="subtitle1">Настройки цветов и фона</Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <ColorSettings
                  title="Настройки цветов круговой диаграммы"
                  colorSettings={{
                    ...editData.colorSettings,
                    segmentColors: (() => {
                      // Динамически создаем объект цветов сегментов на основе данных
                      const segmentColors = {};
                      editData.data.forEach((item, index) => {
                        const segmentKey = `segment${index + 1}`;
                        segmentColors[segmentKey] = editData.pieColors[index] || ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088fe', '#00c49f', '#ffbb28', '#ff8042'][index % 8];
                      });
                      return segmentColors;
                    })()
                  }}
                  onUpdate={handleColorUpdate}
                  availableFields={[
                    {
                      name: 'title',
                      label: 'Цвет заголовка',
                      description: 'Цвет заголовка диаграммы',
                      defaultColor: editData.titleColor || '#1976d2'
                    }
                  ]}
                  defaultColors={{
                    title: editData.titleColor || '#1976d2'
                  }}
                  // Передаем данные для динамического создания названий сегментов
                  segmentData={editData.data}
                  // Скрываем неприменимые для круговой диаграммы настройки
                  hideCardBackground={true}
                  hideAreaColors={true}
                  hideSegmentColors={false}
                />
              </AccordionDetails>
            </Accordion>



            {/* Данные диаграммы */}
            <Accordion sx={{ mb: 2 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <DataObjectIcon />
                  <Typography variant="subtitle1">Данные диаграммы</Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
                  {editData.data.map((item, index) => (
                    <Card key={index} sx={{ mb: 1, p: 1 }}>
                      <Grid container spacing={1} alignItems="center">
                        <Grid item xs={6}>
                          <TextField
                            label="Название сегмента"
                            value={item.name}
                            onChange={(e) => {
                              const newData = [...editData.data];
                              newData[index] = { ...newData[index], name: e.target.value };
                              setEditData({ ...editData, data: newData });
                            }}
                            size="small"
                            fullWidth
                          />
                        </Grid>
                        <Grid item xs={4}>
                          <TextField
                            label="Значение"
                            type="number"
                            value={item.value}
                            onChange={(e) => {
                              const newData = [...editData.data];
                              newData[index] = { ...newData[index], value: parseInt(e.target.value) || 0 };
                              setEditData({ ...editData, data: newData });
                            }}
                            size="small"
                            fullWidth
                          />
                        </Grid>
                        <Grid item xs={2}>
                          <IconButton
                            onClick={() => {
                              const newData = editData.data.filter((_, i) => i !== index);
                              setEditData({ ...editData, data: newData });
                            }}
                            color="error"
                            size="small"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Grid>
                      </Grid>
                    </Card>
                  ))}
                  <Button
                    startIcon={<AddIcon />}
                    onClick={() => {
                      const newData = [...editData.data, { name: `Сегмент ${editData.data.length + 1}`, value: 100 }];
                      setEditData({ ...editData, data: newData });
                    }}
                    variant="outlined"
                    fullWidth
                    sx={{ mt: 1 }}
                  >
                    Добавить сегмент
                  </Button>
                </Box>
              </AccordionDetails>
            </Accordion>

            {/* Настройки анимации */}
            <Accordion sx={{ mb: 2 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1">Анимация</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <AnimationControls
                  animationSettings={editData.animationSettings || animationSettings}
                  onUpdate={handleAnimationUpdate}
                />
              </AccordionDetails>
            </Accordion>

            {/* Color Picker Modal */}
            {colorPickerOpen && (
              <Box
                sx={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 9999
                }}
                onClick={() => setColorPickerOpen(null)}
              >
                <Box onClick={(e) => e.stopPropagation()}>
                  <SketchPicker
                    color={colorPickerOpen.includes('pieColors') 
                      ? editData.pieColors[colorPickerOpen.split('-')[1]] 
                      : editData[colorPickerOpen]
                    }
                    onChange={(color) => handleColorChange(colorPickerOpen, color)}
                  />
                </Box>
              </Box>
            )}
            
            <Divider sx={{ my: 3 }} />
            
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button onClick={handleCancel} variant="outlined">
                Отмена
              </Button>
              <Button onClick={handleSave} variant="contained">
                Сохранить изменения
              </Button>
            </Box>
          </Box>
        ) : (
          <AnimationWrapper {...(editData.animationSettings || animationSettings)}>
            <Box sx={{ p: editData.padding }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 2, 
                  color: editData.colorSettings?.textFields?.title || editData.titleColor,
                  textAlign: 'center'
                }}
              >
                {title}
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <ResponsiveContainer width={editData.chartSize} height={editData.chartSize}>
                  <PieChart>
                    <Pie
                      data={data}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={editData.showLabels && editData.showPercentage ? 
                        ({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%` : 
                        editData.showLabels ? ({ name }) => name :
                        editData.showPercentage ? ({ percent }) => `${(percent * 100).toFixed(0)}%` :
                        false
                      }
                      outerRadius={Math.min(editData.chartSize / 3, 120)}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={editData.pieColors[index % editData.pieColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: editData.tooltipBg,
                        border: '1px solid #ccc',
                        borderRadius: '4px'
                      }}
                    />
                    {editData.showLegend && (
                      <Legend 
                        wrapperStyle={{ color: editData.colorSettings?.textFields?.legend || editData.legendColor }}
                      />
                    )}
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </Box>
          </AnimationWrapper>
        )}
      </Paper>
    </EditableElementWrapper>
  );
};

export const AdvancedAreaChart = ({ 
  isPreview = false,
  constructorMode = false,
  isEditing = false,
  onSave = null,
  onCancel = null,
  onUpdate = () => {},
  title: initialTitle = 'Диаграмма с областями',
  data: initialData = lineData,
  showGrid = true,
  showLegend = true,
  stacked = true,
  areaNames = ['Область 1', 'Область 2'],
  titleColor = '#1976d2',
  backgroundColor = '#ffffff',
  backgroundType = 'solid',
  gradientStart = '#f5f5f5',
  gradientEnd = '#e0e0e0',
  gradientDirection = 'to bottom',
  areaColors = ['#8884d8', '#82ca9d'],
  gridColor = '#e0e0e0',
  axisColor = '#666666',
  tooltipBg = '#ffffff',
  legendColor = '#333333',
  borderRadius = 8,
  padding = 24,
  chartHeight = 300,
  chartWidth = '100%',
  maxWidth = '100%',
  colorSettings = {},
  animationSettings = {
    animationType: 'fadeIn',
    delay: 0,
    triggerOnView: true,
    triggerOnce: true,
    threshold: 0.1,
    disabled: false
  }
}) => {
  const [data, setData] = useState(initialData);
  const [title, setTitle] = useState(initialTitle);
  const [localEditing, setLocalEditing] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(0);
  const [editData, setEditData] = useState({
    title: initialTitle,
    data: initialData,
    showGrid,
    showLegend,
    stacked,
    areaNames,
    titleColor,
    backgroundColor,
    backgroundType,
    gradientStart,
    gradientEnd,
    gradientDirection,
    areaColors,
    gridColor,
    axisColor,
    tooltipBg,
    legendColor,
    borderRadius,
    padding,
    chartHeight,
    chartWidth,
    maxWidth,
    colorSettings,
    animationSettings
  });

  const handleDoubleClick = () => {
    if (constructorMode) {
      setLocalEditing(true);
    }
  };

  const handleSave = () => {
    console.log('🔍 [AdvancedAreaChart] handleSave called with editData:', editData);
    
    setLocalEditing(false);
    setTitle(editData.title);
    setData(editData.data);
    
    // Обновляем все настройки, включая colorSettings
    const updatedData = {
      ...editData,
      title: editData.title,
      data: editData.data,
      showGrid: editData.showGrid,
      showLegend: editData.showLegend,
      stacked: editData.stacked,
      areaNames: editData.areaNames,
      titleColor: editData.titleColor,
      backgroundColor: editData.backgroundColor,
      backgroundType: editData.backgroundType,
      gradientStart: editData.gradientStart,
      gradientEnd: editData.gradientEnd,
      gradientDirection: editData.gradientDirection,
      areaColors: editData.areaColors,
      gridColor: editData.gridColor,
      axisColor: editData.axisColor,
      tooltipBg: editData.tooltipBg,
      legendColor: editData.legendColor,
      borderRadius: editData.borderRadius,
      padding: editData.padding,
      chartHeight: editData.chartHeight,
      chartWidth: editData.chartWidth,
      maxWidth: editData.maxWidth,
      colorSettings: editData.colorSettings,
      animationSettings: editData.animationSettings
    };
    
    console.log('🔍 [AdvancedAreaChart] Final updatedData to save:', updatedData);
    
    if (onSave) {
      onSave(updatedData);
    } else {
      onUpdate(updatedData);
    }
  };

  const handleCancel = () => {
    setLocalEditing(false);
    setEditData({
      title,
      data,
      showGrid,
      showLegend,
      stacked,
      areaNames,
      titleColor,
      backgroundColor,
      backgroundType,
      gradientStart,
      gradientEnd,
      gradientDirection,
      areaColors,
      gridColor,
      axisColor,
      tooltipBg,
      legendColor,
      borderRadius,
      padding,
      chartHeight,
      chartWidth,
      maxWidth,
      colorSettings,
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

  const handleColorUpdate = (newColorSettings) => {
    console.log('🔍 [AdvancedAreaChart] handleColorUpdate called with:', newColorSettings);
    
    // Обновляем colorSettings и синхронизируем areaColors
    const updatedEditData = { ...editData, colorSettings: newColorSettings };
    
    // Синхронизируем цвета областей из ColorSettings
    if (newColorSettings.areaColors) {
      // Динамически создаем массив цветов областей на основе количества данных
      const newAreaColors = [];
      const maxAreas = Math.max(editData.data.length, Object.keys(newColorSettings.areaColors).length);
      
      console.log('🔍 [AdvancedAreaChart] maxAreas:', maxAreas);
      console.log('🔍 [AdvancedAreaChart] editData.data.length:', editData.data.length);
      console.log('🔍 [AdvancedAreaChart] Object.keys(colorSettings.areaColors).length:', Object.keys(newColorSettings.areaColors).length);
      
      for (let i = 0; i < maxAreas; i++) {
        const areaKey = `area${i + 1}`;
        const newColor = newColorSettings.areaColors[areaKey];
        if (newColor) {
          newAreaColors[i] = newColor;
        } else {
          // Fallback на стандартные цвета
          const defaultColors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088fe', '#00c49f', '#ffbb28', '#ff8042'];
          newAreaColors[i] = defaultColors[i % defaultColors.length];
        }
      }
      
      updatedEditData.areaColors = newAreaColors;
      console.log('🔍 [AdvancedAreaChart] Updated areaColors:', updatedEditData.areaColors);
    }
    
    // Синхронизируем цвета линий из textFields в areaColors
    if (newColorSettings.textFields) {
      const newAreaColors = [...(editData.areaColors || [])];
      const maxAreas = Math.max(editData.data.length, newAreaColors.length);
      
      for (let i = 0; i < maxAreas; i++) {
        const lineKey = `line${i + 1}`;
        const lineColor = newColorSettings.textFields[lineKey];
        if (lineColor) {
          newAreaColors[i] = lineColor;
        }
      }
      
      if (newAreaColors.length > 0) {
        updatedEditData.areaColors = newAreaColors;
        console.log('🔍 [AdvancedAreaChart] Updated areaColors from line colors:', updatedEditData.areaColors);
      }
    }
    
    console.log('🔍 [AdvancedAreaChart] Final updatedEditData:', updatedEditData);
    setEditData(updatedEditData);
  };

  // Вспомогательная функция для получения цветов с приоритетом colorSettings
  const getColorValue = (fieldName, fallbackValue) => {
    const colorValue = editData.colorSettings?.textFields?.[fieldName] || fallbackValue;
    console.log(`🔍 [AdvancedAreaChart] getColorValue(${fieldName}):`, colorValue, 'from colorSettings:', editData.colorSettings?.textFields?.[fieldName], 'fallback:', fallbackValue);
    return colorValue;
  };

  // Синхронизируем colorSettings с editData для всех настроек
  useEffect(() => {
    console.log('🔥 [AdvancedAreaChart] useEffect для colorSettings вызван с:', colorSettings);
    if (colorSettings) {
      setEditData(prev => {
        console.log('🔥 [AdvancedAreaChart] Обновляем editData.colorSettings с:', colorSettings);
        return {
          ...prev,
          colorSettings: {
            ...prev.colorSettings,
            ...colorSettings
          }
        };
      });
    }
  }, [colorSettings]);

  // Синхронизируем colorSettings.textFields с editData цветами
  useEffect(() => {
    if (colorSettings?.textFields) {
      const updates = {};
      
      if (colorSettings.textFields.title) {
        updates.titleColor = colorSettings.textFields.title;
      }
      if (colorSettings.textFields.grid) {
        updates.gridColor = colorSettings.textFields.grid;
      }
      if (colorSettings.textFields.legend) {
        updates.legendColor = colorSettings.textFields.legend;
      }
      if (colorSettings.textFields.axis) {
        updates.axisColor = colorSettings.textFields.axis;
      }
      
      if (Object.keys(updates).length > 0) {
        setEditData(prev => ({
          ...prev,
          ...updates
        }));
        console.log('🔥 [AdvancedAreaChart] Обновили цвета текстовых полей:', updates);
      }
    }
  }, [colorSettings?.textFields]);

  // Синхронизируем colorSettings.areaColors с editData.areaColors
  useEffect(() => {
    console.log('🔥 [AdvancedAreaChart] useEffect для areaColors вызван с:', colorSettings?.areaColors);
    if (colorSettings?.areaColors) {
      const newAreaColors = [];
      const maxAreas = Math.max(editData.data.length, Object.keys(colorSettings.areaColors).length);
      
      console.log('🔥 [AdvancedAreaChart] maxAreas:', maxAreas);
      console.log('🔥 [AdvancedAreaChart] editData.data.length:', editData.data.length);
      console.log('🔥 [AdvancedAreaChart] Object.keys(colorSettings.areaColors).length:', Object.keys(colorSettings.areaColors).length);
      
      for (let i = 0; i < maxAreas; i++) {
        const areaKey = `area${i + 1}`;
        const newColor = colorSettings.areaColors[areaKey];
        if (newColor) {
          newAreaColors[i] = newColor;
        } else {
          // Fallback на стандартные цвета
          const defaultColors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088fe', '#00c49f', '#ffbb28', '#ff8042'];
          newAreaColors[i] = defaultColors[i % defaultColors.length];
        }
      }
      
      console.log('🔥 [AdvancedAreaChart] newAreaColors:', newAreaColors);
      
      if (newAreaColors.length > 0) {
        setEditData(prev => {
          console.log('🔥 [AdvancedAreaChart] Обновляем editData.areaColors с:', newAreaColors);
          return {
            ...prev,
            areaColors: newAreaColors
          };
        });
        console.log('🔥 [AdvancedAreaChart] Обновили areaColors из colorSettings:', newAreaColors);
        
        // Принудительно обновляем ColorSettings
        setForceUpdate(prev => prev + 1);
      }
    } else {
      console.log('🔥 [AdvancedAreaChart] colorSettings.areaColors не найден или пустой');
    }
  }, [colorSettings?.areaColors, editData.data.length]);

  // Принудительное обновление ColorSettings при изменении editData
  useEffect(() => {
    setForceUpdate(prev => prev + 1);
    console.log('🔥 [AdvancedAreaChart] Принудительное обновление ColorSettings:', forceUpdate + 1);
    console.log('🔥 [AdvancedAreaChart] Текущие areaColors:', editData.areaColors);
  }, [editData.titleColor, editData.gridColor, editData.legendColor, editData.axisColor, editData.areaColors]);

  const isCurrentlyEditing = isEditing || localEditing;

  return (
    <EditableElementWrapper 
      editable={constructorMode} 
      onStartEdit={handleDoubleClick}
      isEditing={isCurrentlyEditing}
    >
      <AnimationWrapper {...(editData.animationSettings || animationSettings)}>
        <Paper sx={{ 
        p: 3, 
        mb: 2,
        ...(editData.colorSettings?.sectionBackground?.enabled && {
          ...(editData.colorSettings.sectionBackground.useGradient ? {
            background: `linear-gradient(${editData.colorSettings.sectionBackground.gradientDirection}, ${editData.colorSettings.sectionBackground.gradientColor1}, ${editData.colorSettings.sectionBackground.gradientColor2})`
          } : {
            backgroundColor: editData.colorSettings.sectionBackground.solidColor
          }),
          border: `${editData.colorSettings.borderWidth || 1}px solid ${editData.colorSettings.borderColor || '#e0e0e0'}`,
          borderRadius: `${editData.colorSettings.borderRadius || 8}px`,
          padding: `${editData.colorSettings.padding || 16}px`,
          ...(editData.colorSettings.boxShadow && {
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
          })
        })
      }}>
          {isCurrentlyEditing ? (
            <Box>
              <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
                Редактирование диаграммы с областями
              </Typography>
            
            <TextField
              label="Заголовок"
              value={editData.title}
              onChange={(e) => setEditData({ ...editData, title: e.target.value })}
              fullWidth
              size="small"
              sx={{ mb: 2 }}
            />
            
            {/* Настройки отображения */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>Настройки отображения:</Typography>
              <FormControlLabel
                control={
                  <Switch 
                    checked={editData.showGrid} 
                    onChange={(e) => setEditData({ ...editData, showGrid: e.target.checked })} 
                  />
                }
                label="Показать сетку"
              />
              <FormControlLabel
                control={
                  <Switch 
                    checked={editData.showLegend} 
                    onChange={(e) => setEditData({ ...editData, showLegend: e.target.checked })} 
                  />
                }
                label="Показать легенду"
                sx={{ ml: 2 }}
              />
              <FormControlLabel
                control={
                  <Switch 
                    checked={editData.stacked} 
                    onChange={(e) => setEditData({ ...editData, stacked: e.target.checked })} 
                  />
                }
                label="Наложенные области"
                sx={{ ml: 2 }}
              />
            </Box>
            
            {/* Названия областей */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>Названия областей:</Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  label="Название первой области"
                  value={editData.areaNames[0] || 'Область 1'}
                  onChange={(e) => {
                    const newAreaNames = [...editData.areaNames];
                    newAreaNames[0] = e.target.value;
                    setEditData({ ...editData, areaNames: newAreaNames });
                  }}
                  size="small"
                  sx={{ width: 200 }}
                />
                <TextField
                  label="Название второй области"
                  value={editData.areaNames[1] || 'Область 2'}
                  onChange={(e) => {
                    const newAreaNames = [...editData.areaNames];
                    newAreaNames[1] = e.target.value;
                    setEditData({ ...editData, areaNames: newAreaNames });
                  }}
                  size="small"
                  sx={{ width: 200 }}
                />
              </Box>
            </Box>

            {/* Настройки цветов через ColorSettings */}
            <Accordion sx={{ mb: 2 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PaletteIcon />
                  <Typography variant="subtitle1">Настройки цветов и фона</Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <ColorSettings
                  key={`color-settings-${forceUpdate}-${editData.titleColor}-${editData.gridColor}-${editData.legendColor}-${editData.axisColor}-${editData.areaColors?.join('-')}`}
                  title="Настройки цветов диаграммы с областями"
                  colorSettings={{
                    ...editData.colorSettings,
                    areaColors: (() => {
                      // Динамически создаем объект цветов областей на основе количества данных
                      const areaColors = {};
                      const maxAreas = Math.max(editData.data.length, editData.areaColors?.length || 0);
                      
                      for (let i = 0; i < maxAreas; i++) {
                        const areaKey = `area${i + 1}`;
                        areaColors[areaKey] = editData.areaColors[i] || ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088fe', '#00c49f', '#ffbb28', '#ff8042'][i % 8];
                      }
                      
                      return areaColors;
                    })()
                  }}
                  onUpdate={handleColorUpdate}
                  availableFields={[
                    {
                      name: 'title',
                      label: 'Цвет заголовка',
                      description: 'Цвет заголовка диаграммы',
                      defaultColor: editData.titleColor || '#1976d2'
                    },
                    {
                      name: 'grid',
                      label: 'Цвет сетки',
                      description: 'Цвет линий сетки диаграммы',
                      defaultColor: editData.gridColor || '#e0e0e0'
                    },
                    {
                      name: 'legend',
                      label: 'Цвет легенды',
                      description: 'Цвет текста легенды',
                      defaultColor: editData.legendColor || '#333333'
                    },
                    {
                      name: 'axis',
                      label: 'Цвет осей',
                      description: 'Цвет осей координат',
                      defaultColor: editData.axisColor || '#666666'
                    },
                    // Добавляем цвета линий (всего две линии)
                    ...([0, 1].map((index) => ({
                      name: `line${index + 1}`,
                      label: `Цвет линии ${index + 1}${editData.areaNames && editData.areaNames[index] ? ` (${editData.areaNames[index]})` : ''}`,
                      description: `Цвет линии для ${editData.areaNames && editData.areaNames[index] ? editData.areaNames[index] : `области ${index + 1}`}`,
                      defaultColor: editData.areaColors && editData.areaColors[index] ? editData.areaColors[index] : ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088fe', '#00c49f', '#ffbb28', '#ff8042'][index % 8]
                    })))
                  ]}
                  defaultColors={{
                    title: editData.titleColor || '#1976d2',
                    grid: editData.gridColor || '#e0e0e0',
                    legend: editData.legendColor || '#333333',
                    axis: editData.axisColor || '#666666',
                    // Добавляем цвета линий в defaultColors (всего две линии)
                    ...([0, 1].reduce((acc, index) => {
                      acc[`line${index + 1}`] = editData.areaColors && editData.areaColors[index] ? editData.areaColors[index] : ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088fe', '#00c49f', '#ffbb28', '#ff8042'][index % 8];
                      return acc;
                    }, {}))
                  }}
                  hideCardBackground={true}
                  hideAreaColors={true}
                  hideSegmentColors={true}
                />
              </AccordionDetails>
            </Accordion>
            
            {/* Данные диаграммы */}
            <Typography variant="subtitle2" gutterBottom>Данные диаграммы:</Typography>
            <Box sx={{ mb: 2, maxHeight: 250, overflow: 'auto', border: '1px solid #e0e0e0', borderRadius: 1, p: 1 }}>
              {editData.data.map((item, index) => (
                <Box key={index} sx={{ mb: 2, p: 1, border: '1px solid #f0f0f0', borderRadius: 1 }}>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <TextField
                      label="Название"
                      value={item.name}
                      onChange={(e) => {
                        const newData = [...editData.data];
                        newData[index] = { ...newData[index], name: e.target.value };
                        setEditData({ ...editData, data: newData });
                      }}
                      size="small"
                      sx={{ width: 120 }}
                    />
                    <TextField
                      label="Значение 1"
                      type="number"
                      value={item.value}
                      onChange={(e) => {
                        const newData = [...editData.data];
                        newData[index] = { ...newData[index], value: parseInt(e.target.value) || 0 };
                        setEditData({ ...editData, data: newData });
                      }}
                      size="small"
                      sx={{ width: 100 }}
                    />
                    <TextField
                      label="Значение 2"
                      type="number"
                      value={item.value2}
                      onChange={(e) => {
                        const newData = [...editData.data];
                        newData[index] = { ...newData[index], value2: parseInt(e.target.value) || 0 };
                        setEditData({ ...editData, data: newData });
                      }}
                      size="small"
                      sx={{ width: 100 }}
                    />
                    <IconButton
                      size="small"
                      onClick={() => {
                        const newData = editData.data.filter((_, i) => i !== index);
                        setEditData({ ...editData, data: newData });
                      }}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
              ))}
              <Button
                startIcon={<AddIcon />}
                onClick={() => {
                  const newData = [...editData.data, { 
                    name: `Период ${editData.data.length + 1}`, 
                    value: 4000, 
                    value2: 2400 
                  }];
                  setEditData({ ...editData, data: newData });
                }}
                size="small"
                variant="outlined"
              >
                Добавить период
              </Button>
            </Box>
            

            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
              <Button onClick={handleCancel}>Отмена</Button>
              <Button variant="contained" onClick={handleSave}>Сохранить</Button>
            </Box>
          </Box>
        ) : (
          <AnimationWrapper {...(editData.animationSettings || animationSettings)}>
            <Box>
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 2,
                  color: getColorValue('title', editData.titleColor)
                }}
              >
                {title}
              </Typography>
              {!isPreview && !constructorMode && (
                <Box sx={{ mb: 2 }}>
                  <TextField
                    label="Заголовок"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    fullWidth
                    size="small"
                  />
                </Box>
              )}
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={data}>
                  {editData.showGrid && (
                    <CartesianGrid 
                      strokeDasharray="3 3" 
                      stroke={getColorValue('grid', editData.gridColor)}
                    />
                  )}
                  <XAxis 
                    dataKey="name" 
                    stroke={getColorValue('axis', editData.axisColor)}
                  />
                  <YAxis 
                    stroke={getColorValue('axis', editData.axisColor)}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: editData.tooltipBg,
                      border: '1px solid #ccc'
                    }}
                  />
                  {editData.showLegend && (
                    <Legend 
                      wrapperStyle={{ 
                        color: getColorValue('legend', editData.legendColor) 
                      }}
                    />
                  )}
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stackId={editData.stacked ? "1" : "a"} 
                    stroke={editData.colorSettings?.areaColors?.area1 || editData.areaColors[0] || '#8884d8'} 
                    fill={editData.colorSettings?.areaColors?.area1 || editData.areaColors[0] || '#8884d8'} 
                    name={editData.areaNames[0] || 'Область 1'}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value2" 
                    stackId={editData.stacked ? "1" : "b"} 
                    stroke={editData.colorSettings?.areaColors?.area2 || editData.areaColors[1] || '#82ca9d'} 
                    fill={editData.colorSettings?.areaColors?.area2 || editData.areaColors[1] || '#82ca9d'} 
                    name={editData.areaNames[1] || 'Область 2'}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </AnimationWrapper>
        )}
      </Paper>
      </AnimationWrapper>
    </EditableElementWrapper>
  );
};

export const AdvancedRadarChart = ({ 
  isPreview = false,
  constructorMode = false,
  isEditing = false,
  onSave = null,
  onCancel = null,
  onUpdate = () => {},
  title: initialTitle = 'Радарная диаграмма',
  data: initialData = radarData,
  showLegend = true,
  fillOpacity = 0.6,
  animationSettings = {
    animationType: 'fadeIn',
    delay: 0,
    triggerOnView: true,
    triggerOnce: true,
    threshold: 0.1,
    disabled: false
  }
}) => {
  const [data, setData] = useState(initialData);
  const [title, setTitle] = useState(initialTitle);
  const [localEditing, setLocalEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: initialTitle,
    data: initialData,
    showLegend,
    fillOpacity,
    animationSettings
  });

  const handleDoubleClick = () => {
    if (constructorMode) {
      setLocalEditing(true);
    }
  };

  const handleSave = () => {
    setLocalEditing(false);
    setTitle(editData.title);
    setData(editData.data);
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
      data,
      showLegend,
      fillOpacity,
      animationSettings
    });
    if (onCancel) {
      onCancel();
    }
  };

  const handleAnimationUpdate = (newAnimationSettings) => {
    setEditData({ ...editData, animationSettings: newAnimationSettings });
  };

  const isCurrentlyEditing = isEditing || localEditing;

  return (
    <EditableElementWrapper 
      editable={constructorMode} 
      onStartEdit={handleDoubleClick}
      isEditing={isCurrentlyEditing}
    >
      <AnimationWrapper {...(editData.animationSettings || animationSettings)}>
        <Paper sx={{ p: 3, mb: 2 }}>
          {isCurrentlyEditing ? (
            <Box>
              <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
                Редактирование радарной диаграммы
              </Typography>
            
            <TextField
              label="Заголовок"
              value={editData.title}
              onChange={(e) => setEditData({ ...editData, title: e.target.value })}
              fullWidth
              size="small"
              sx={{ mb: 2 }}
            />
            
            {/* Настройки отображения */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>Настройки отображения:</Typography>
              <FormControlLabel
                control={
                  <Switch 
                    checked={editData.showLegend} 
                    onChange={(e) => setEditData({ ...editData, showLegend: e.target.checked })} 
                  />
                }
                label="Показать легенду"
              />
              <TextField
                label="Прозрачность заливки"
                type="number"
                value={editData.fillOpacity}
                onChange={(e) => setEditData({ ...editData, fillOpacity: parseFloat(e.target.value) || 0.6 })}
                size="small"
                sx={{ width: 180, ml: 2 }}
                inputProps={{ min: 0, max: 1, step: 0.1 }}
              />
            </Box>
            
            {/* Настройки анимации */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>Настройки анимации:</Typography>
              <AnimationControls
                animationSettings={editData.animationSettings || animationSettings}
                onUpdate={handleAnimationUpdate}
              />
            </Box>
            
            {/* Данные радарной диаграммы */}
            <Typography variant="subtitle2" gutterBottom>Данные диаграммы:</Typography>
            <Box sx={{ mb: 2, maxHeight: 250, overflow: 'auto', border: '1px solid #e0e0e0', borderRadius: 1, p: 1 }}>
              {editData.data.map((item, index) => (
                <Box key={index} sx={{ mb: 2, p: 1, border: '1px solid #f0f0f0', borderRadius: 1 }}>
                  <Box sx={{ display: 'flex', gap: 1, mb: 1, alignItems: 'center' }}>
                    <TextField
                      label="Предмет"
                      value={item.subject}
                      onChange={(e) => {
                        const newData = [...editData.data];
                        newData[index] = { ...newData[index], subject: e.target.value };
                        setEditData({ ...editData, data: newData });
                      }}
                      size="small"
                      sx={{ width: 120 }}
                    />
                    <TextField
                      label="Максимум"
                      type="number"
                      value={item.fullMark}
                      onChange={(e) => {
                        const newData = [...editData.data];
                        newData[index] = { ...newData[index], fullMark: parseInt(e.target.value) || 150 };
                        setEditData({ ...editData, data: newData });
                      }}
                      size="small"
                      sx={{ width: 100 }}
                    />
                    <IconButton
                      size="small"
                      onClick={() => {
                        const newData = editData.data.filter((_, i) => i !== index);
                        setEditData({ ...editData, data: newData });
                      }}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                      label="Значение A"
                      type="number"
                      value={item.A}
                      onChange={(e) => {
                        const newData = [...editData.data];
                        newData[index] = { ...newData[index], A: parseInt(e.target.value) || 0 };
                        setEditData({ ...editData, data: newData });
                      }}
                      size="small"
                      sx={{ width: 100 }}
                    />
                    <TextField
                      label="Значение B"
                      type="number"
                      value={item.B}
                      onChange={(e) => {
                        const newData = [...editData.data];
                        newData[index] = { ...newData[index], B: parseInt(e.target.value) || 0 };
                        setEditData({ ...editData, data: newData });
                      }}
                      size="small"
                      sx={{ width: 100 }}
                    />
                  </Box>
                </Box>
              ))}
              <Button
                startIcon={<AddIcon />}
                onClick={() => {
                  const newData = [...editData.data, { 
                    subject: `Предмет ${editData.data.length + 1}`, 
                    A: 100, 
                    B: 100, 
                    fullMark: 150 
                  }];
                  setEditData({ ...editData, data: newData });
                }}
                size="small"
                variant="outlined"
              >
                Добавить предмет
              </Button>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
              <Button onClick={handleCancel}>Отмена</Button>
              <Button variant="contained" onClick={handleSave}>Сохранить</Button>
            </Box>
          </Box>
        ) : (
          <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>{title}</Typography>
            {!isPreview && !constructorMode && (
              <Box sx={{ mb: 2 }}>
                <TextField
                  label="Заголовок"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  fullWidth
                  size="small"
                />
              </Box>
            )}
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={data}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis />
                <Radar name="Студент A" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={editData.fillOpacity} />
                <Radar name="Студент B" dataKey="B" stroke="#82ca9d" fill="#82ca9d" fillOpacity={editData.fillOpacity} />
                {editData.showLegend && <Legend />}
              </RadarChart>
            </ResponsiveContainer>
          </Box>
        )}
        </Paper>
      </AnimationWrapper>
    </EditableElementWrapper>
  );
};

export const ChartJSBarChart = ({ 
  isPreview = false,
  constructorMode = false,
  isEditing = false,
  onSave = null,
  onCancel = null,
  onUpdate = () => {},
  title: initialTitle = 'Chart.js Столбчатая диаграмма',
  chartData = {
    labels: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь'],
    datasets: [
      {
        label: 'Продажи',
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
      {
        label: 'Прибыль',
        data: [2, 3, 20, 5, 1, 4],
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  },
  showLegend = true,
  chartHeight = 500,
  chartWidth = '100%',
  centerChart = true,
  titleColor = '#1976d2',
  backgroundColor = '#ffffff',
  backgroundType = 'solid',
  gradientStart = '#f5f5f5',
  gradientEnd = '#e0e0e0',
  gradientDirection = 'to bottom',
  borderRadius = 8,
  padding = 24,
  animationSettings = {
    animationType: 'scaleIn',
    delay: 0,
    triggerOnView: true,
    triggerOnce: true,
    threshold: 0.1,
    disabled: false
  }
}) => {
  console.log('[ChartJSBarChart] Received props:', { 
    initialTitle, 
    chartData, 
    showLegend, 
    animationSettings 
  });
  console.log('[ChartJSBarChart] Title prop (initialTitle):', initialTitle);
  
  const [title, setTitle] = useState(initialTitle);
  const [data, setData] = useState(chartData);
  const [localEditing, setLocalEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: initialTitle,
    data: chartData,
    showLegend,
    chartHeight,
    chartWidth,
    centerChart,
    titleColor,
    backgroundColor,
    backgroundType,
    gradientStart,
    gradientEnd,
    gradientDirection,
    borderRadius,
    padding,
    animationSettings
  });

  console.log('[ChartJSBarChart] Initialized with:', { title, data, editData });

  const handleDoubleClick = () => {
    if (constructorMode) {
      setLocalEditing(true);
    }
  };

  const handleSave = () => {
    setLocalEditing(false);
    setTitle(editData.title);
    setData(editData.data);
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
      data,
      showLegend,
      chartHeight,
      chartWidth,
      centerChart,
      titleColor,
      backgroundColor,
      backgroundType,
      gradientStart,
      gradientEnd,
      gradientDirection,
      borderRadius,
      padding,
      animationSettings
    });
    if (onCancel) {
      onCancel();
    }
  };

  const handleAnimationUpdate = (newAnimationSettings) => {
    setEditData({ ...editData, animationSettings: newAnimationSettings });
  };

  const getBackgroundStyle = () => {
    if (editData.backgroundType === 'gradient') {
      return {
        background: `linear-gradient(${editData.gradientDirection}, ${editData.gradientStart}, ${editData.gradientEnd})`
      };
    }
    return {
      backgroundColor: editData.backgroundColor
    };
  };

  const isCurrentlyEditing = isEditing || localEditing;

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        display: showLegend,
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12
          }
        }
      },
      title: {
        display: false, // Отключаем встроенный заголовок Chart.js
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#ffffff',
        borderWidth: 1,
        cornerRadius: 6,
        displayColors: true
      },
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          font: {
            size: 11
          }
        }
      },
      y: {
        display: true,
        beginAtZero: true,
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          font: {
            size: 11
          }
        }
      },
    },
    layout: {
      padding: {
        top: 10,
        bottom: 10
      }
    }
  };

  return (
    <EditableElementWrapper 
      editable={constructorMode} 
      onStartEdit={handleDoubleClick}
      isEditing={isCurrentlyEditing}
    >
      <AnimationWrapper {...animationSettings}>
        <Paper 
          sx={{ 
            p: padding / 8 || 3, 
            mb: 2,
            borderRadius: borderRadius / 8 || 1,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            overflow: 'hidden',
            ...(backgroundType === 'gradient' ? {
              background: `linear-gradient(${gradientDirection}, ${gradientStart}, ${gradientEnd})`
            } : {
              backgroundColor: backgroundColor
            })
          }}
        >
          {isCurrentlyEditing ? (
            <Box>
              <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
                Редактирование Chart.js столбчатой диаграммы
              </Typography>
              
              <TextField
                label="Заголовок"
                value={editData.title}
                onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                fullWidth
                size="small"
                sx={{ mb: 2 }}
              />
              
              {/* Настройки анимации */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>Настройки анимации:</Typography>
                <AnimationControls
                  animationSettings={editData.animationSettings || animationSettings}
                  onUpdate={handleAnimationUpdate}
                />
              </Box>
              
              {/* Настройки отображения */}
              <Box sx={{ mb: 2 }}>
                <FormControlLabel
                  control={
                    <Switch 
                      checked={editData.showLegend} 
                      onChange={(e) => setEditData({ ...editData, showLegend: e.target.checked })} 
                    />
                  }
                  label="Показать легенду"
                />
              </Box>

              {/* Настройки размера и выравнивания */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>Настройки размера и выравнивания:</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      label="Высота диаграммы (px)"
                      type="number"
                      value={editData.chartHeight || 500}
                      onChange={(e) => setEditData({ ...editData, chartHeight: parseInt(e.target.value) || 500 })}
                      size="small"
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <FormControlLabel
                      control={
                        <Switch 
                          checked={editData.centerChart !== false} 
                          onChange={(e) => setEditData({ ...editData, centerChart: e.target.checked })} 
                        />
                      }
                      label="Центрировать диаграмму"
                    />
                  </Grid>
                </Grid>
              </Box>
              
              {/* Редактирование меток */}
              <Typography variant="subtitle2" gutterBottom>Метки оси X:</Typography>
              <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {editData.data.labels.map((label, index) => (
                  <TextField
                    key={index}
                    value={label}
                    onChange={(e) => {
                      const newData = { ...editData.data };
                      newData.labels[index] = e.target.value;
                      setEditData({ ...editData, data: newData });
                    }}
                    size="small"
                    sx={{ width: 100 }}
                  />
                ))}
                <Button
                  startIcon={<AddIcon />}
                  onClick={() => {
                    const newData = { ...editData.data };
                    newData.labels.push(`Месяц ${newData.labels.length + 1}`);
                    newData.datasets.forEach(dataset => {
                      dataset.data.push(Math.floor(Math.random() * 20) + 1);
                    });
                    setEditData({ ...editData, data: newData });
                  }}
                  size="small"
                  variant="outlined"
                >
                  Добавить месяц
                </Button>
              </Box>
              
              {/* Редактирование наборов данных */}
              <Typography variant="subtitle2" gutterBottom>Наборы данных:</Typography>
              <Box sx={{ mb: 2, maxHeight: 200, overflow: 'auto', border: '1px solid #e0e0e0', borderRadius: 1, p: 1 }}>
                {editData.data.datasets.map((dataset, datasetIndex) => (
                  <Box key={datasetIndex} sx={{ mb: 2, p: 1, border: '1px solid #f0f0f0', borderRadius: 1 }}>
                    <Box sx={{ display: 'flex', gap: 1, mb: 1, alignItems: 'center' }}>
                      <TextField
                        label="Название"
                        value={dataset.label}
                        onChange={(e) => {
                          const newData = { ...editData.data };
                          newData.datasets[datasetIndex].label = e.target.value;
                          setEditData({ ...editData, data: newData });
                        }}
                        size="small"
                        sx={{ width: 150 }}
                      />
                      <TextField
                        label="Цвет"
                        type="color"
                        value={dataset.borderColor}
                        onChange={(e) => {
                          const newData = { ...editData.data };
                          newData.datasets[datasetIndex].borderColor = e.target.value;
                          newData.datasets[datasetIndex].backgroundColor = e.target.value.replace('1)', '0.2)');
                          setEditData({ ...editData, data: newData });
                        }}
                        size="small"
                        sx={{ width: 80 }}
                      />
                      <IconButton
                        size="small"
                        onClick={() => {
                          const newData = { ...editData.data };
                          newData.datasets = newData.datasets.filter((_, i) => i !== datasetIndex);
                          setEditData({ ...editData, data: newData });
                        }}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {dataset.data.map((value, valueIndex) => (
                        <TextField
                          key={valueIndex}
                          label={editData.data.labels[valueIndex] || `Значение ${valueIndex + 1}`}
                          type="number"
                          value={value}
                          onChange={(e) => {
                            const newData = { ...editData.data };
                            newData.datasets[datasetIndex].data[valueIndex] = parseInt(e.target.value) || 0;
                            setEditData({ ...editData, data: newData });
                          }}
                          size="small"
                          sx={{ width: 80 }}
                        />
                      ))}
                    </Box>
                  </Box>
                ))}
                <Button
                  startIcon={<AddIcon />}
                  onClick={() => {
                    const newData = { ...editData.data };
                    const colors = ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 205, 86, 1)', 'rgba(75, 192, 192, 1)'];
                    const colorIndex = newData.datasets.length % colors.length;
                    newData.datasets.push({
                      label: `Набор ${newData.datasets.length + 1}`,
                      data: new Array(newData.labels.length).fill(0).map(() => Math.floor(Math.random() * 20) + 1),
                      backgroundColor: colors[colorIndex].replace('1)', '0.2)'),
                      borderColor: colors[colorIndex],
                      borderWidth: 1,
                    });
                    setEditData({ ...editData, data: newData });
                  }}
                  size="small"
                  variant="outlined"
                >
                  Добавить набор данных
                </Button>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                <Button onClick={handleCancel}>Отмена</Button>
                <Button variant="contained" onClick={handleSave}>Сохранить</Button>
              </Box>
            </Box>
          ) : (
            <Box>
              {/* Заголовок диаграммы */}
              {console.log('[ChartJSBarChart] Rendering title:', title, 'trimmed:', title?.trim())}
              {title && title.trim() && (
                <Typography 
                  variant="h5" 
                  component="h2" 
                  sx={{ 
                    mb: 2, 
                    color: titleColor || '#1976d2',
                    textAlign: centerChart ? 'center' : 'left',
                    wordBreak: 'break-word',
                    lineHeight: 1.3,
                    fontWeight: 600
                  }}
                >
                  {title}
                </Typography>
              )}
              
              {/* Контейнер диаграммы с правильным размером */}
              <Box 
                sx={{ 
                  height: chartHeight || 400,
                  width: '100%',
                  display: 'flex',
                  justifyContent: centerChart ? 'center' : 'flex-start',
                  alignItems: 'flex-start',
                  position: 'relative'
                }}
              >
                <Box sx={{ 
                  width: '100%', 
                  height: '100%',
                  minHeight: chartHeight || 400
                }}>
                  <ChartBar data={data} options={options} />
                </Box>
              </Box>
            </Box>
          )}
        </Paper>
      </AnimationWrapper>
    </EditableElementWrapper>
  );
};

export const ChartJSDoughnutChart = ({ 
  isPreview = false,
  constructorMode = false,
  isEditing = false,
  onSave = null,
  onCancel = null,
  onUpdate = () => {},
  title: initialTitle = 'Пончиковая диаграмма',
  chartData = {
    labels: ['Красный', 'Синий', 'Желтый', 'Зеленый', 'Фиолетовый', 'Оранжевый'],
    datasets: [
      {
        label: 'Количество голосов',
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 205, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
          'rgba(255, 159, 64, 0.8)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 205, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 2,
      },
    ],
  },
  showLegend = true,
  titleColor = '#1976d2',
  backgroundColor = '#ffffff',
  backgroundType = 'solid',
  gradientStart = '#f5f5f5',
  gradientEnd = '#e0e0e0',
  gradientDirection = 'to bottom',
  borderRadius = 8,
  padding = 24,
  chartSize = 700,
  cutout = '50%',
  centerText = '',
  showCenterText = false,
  animationSettings = {
    animationType: 'scaleIn',
    delay: 0,
    triggerOnView: true,
    triggerOnce: true,
    threshold: 0.1,
    disabled: false
  }
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [data, setData] = useState(chartData);
  const [localEditing, setLocalEditing] = useState(false);
  const [colorPickerOpen, setColorPickerOpen] = useState(null);
  const [editData, setEditData] = useState({
    title: initialTitle,
    data: chartData,
    showLegend,
    titleColor,
    backgroundColor,
    backgroundType,
    gradientStart,
    gradientEnd,
    gradientDirection,
    borderRadius,
    padding,
    chartSize,
    cutout,
    centerText,
    showCenterText,
    animationSettings
  });

  const handleDoubleClick = () => {
    if (constructorMode) {
      setLocalEditing(true);
    }
  };

  const handleSave = () => {
    setLocalEditing(false);
    setTitle(editData.title);
    setData(editData.data);
    if (onSave) {
      onSave(editData);
    } else {
      onUpdate(editData);
    }
  };

  const handleCancel = () => {
    setLocalEditing(false);
    setColorPickerOpen(null);
    setEditData({
      title,
      data,
      showLegend,
      titleColor,
      backgroundColor,
      backgroundType,
      gradientStart,
      gradientEnd,
      gradientDirection,
      borderRadius,
      padding,
      chartSize,
      cutout,
      centerText,
      showCenterText,
      animationSettings
    });
    if (onCancel) {
      onCancel();
    }
  };

  const handleColorChange = (colorKey, color) => {
    if (colorKey === 'segmentColors') {
      const index = colorPickerOpen.split('-')[1];
      const newData = { ...editData.data };
      newData.datasets[0].backgroundColor[index] = color.hex;
      newData.datasets[0].borderColor[index] = color.hex;
      setEditData({ ...editData, data: newData });
    } else {
      setEditData({ ...editData, [colorKey]: color.hex });
    }
  };

  const handleAnimationUpdate = (newAnimationSettings) => {
    setEditData({ ...editData, animationSettings: newAnimationSettings });
  };

  const getBackgroundStyle = () => {
    if (editData.backgroundType === 'gradient') {
      return {
        background: `linear-gradient(${editData.gradientDirection}, ${editData.gradientStart}, ${editData.gradientEnd})`
      };
    }
    return {
      backgroundColor: editData.backgroundColor
    };
  };

  const isCurrentlyEditing = isEditing || localEditing;

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: editData.cutout,
    plugins: {
      legend: {
        position: 'bottom',
        display: editData.showLegend,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 14
          }
        }
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        cornerRadius: 8,
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
    elements: {
      arc: {
        borderWidth: 3
      }
    }
  };

  return (
    <EditableElementWrapper 
      editable={constructorMode} 
      onStartEdit={handleDoubleClick}
      isEditing={isCurrentlyEditing}
    >
      <AnimationWrapper {...(editData.animationSettings || animationSettings)}>
        <Paper 
          sx={{ 
            mb: 2,
            borderRadius: `${editData.borderRadius}px`,
            overflow: 'hidden',
            ...getBackgroundStyle()
          }}
        >
          {isCurrentlyEditing ? (
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" color="primary" sx={{ mb: 3 }}>
                🍩 Редактирование пончиковой диаграммы
              </Typography>

              {/* Основные настройки */}
              <Accordion defaultExpanded sx={{ mb: 2 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TuneIcon />
                    <Typography variant="subtitle1">Основные настройки</Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        label="Заголовок диаграммы"
                        value={editData.title}
                        onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                        fullWidth
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, color: '#1976d2' }}>
                        📐 Настройки размера
                      </Typography>
                      <Box>
                        <Typography variant="body2" gutterBottom>
                          Размер диаграммы: {editData.chartSize}px
                        </Typography>
                        <Slider
                          value={editData.chartSize}
                          onChange={(e, value) => setEditData({ ...editData, chartSize: value })}
                          min={200}
                          max={800}
                          step={50}
                          size="small"
                          marks={[
                            { value: 200, label: 'Мини' },
                            { value: 400, label: 'Стандарт' },
                            { value: 600, label: 'Большой' },
                            { value: 800, label: 'Макси' }
                          ]}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box>
                        <Typography variant="body2" gutterBottom>
                          Размер отверстия: {editData.cutout}
                        </Typography>
                        <Slider
                          value={parseInt(editData.cutout)}
                          onChange={(e, value) => setEditData({ ...editData, cutout: `${value}%` })}
                          min={0}
                          max={90}
                          step={5}
                          size="small"
                          marks={[
                            { value: 0, label: 'Круг' },
                            { value: 30, label: 'Тонкий' },
                            { value: 50, label: 'Средний' },
                            { value: 70, label: 'Толстый' },
                            { value: 90, label: 'Тончайший' }
                          ]}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Box sx={{ mt: 1, p: 2, backgroundColor: '#f0f8ff', borderRadius: 1, border: '1px solid #e3f2fd' }}>
                        <Typography variant="caption" color="text.secondary">
                          🍩 <strong>Настройки пончиковой диаграммы:</strong><br/>
                          • <strong>Размер:</strong> от 200px (компактный) до 800px (презентационный)<br/>
                          • <strong>Отверстие:</strong> 0% = обычная круговая, 50% = классический пончик, 90% = тонкое кольцо<br/>
                          • <strong>Совет:</strong> Для мобильных устройств используйте размер 300-400px
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        <FormControlLabel
                          control={
                            <Switch 
                              checked={editData.showLegend} 
                              onChange={(e) => setEditData({ ...editData, showLegend: e.target.checked })} 
                            />
                          }
                          label="Показать легенду"
                        />
                        <FormControlLabel
                          control={
                            <Switch 
                              checked={editData.showCenterText} 
                              onChange={(e) => setEditData({ ...editData, showCenterText: e.target.checked })} 
                            />
                          }
                          label="Текст в центре"
                        />
                      </Box>
                    </Grid>
                    {editData.showCenterText && (
                      <Grid item xs={12}>
                        <TextField
                          label="Текст в центре диаграммы"
                          value={editData.centerText}
                          onChange={(e) => setEditData({ ...editData, centerText: e.target.value })}
                          fullWidth
                          size="small"
                          placeholder="Например: Общий объем"
                        />
                      </Grid>
                    )}
                  </Grid>
                </AccordionDetails>
              </Accordion>

              {/* Настройки цветов */}
              <Accordion sx={{ mb: 2 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PaletteIcon />
                    <Typography variant="subtitle1">Цвета и стили</Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography variant="body2" gutterBottom>Цвет заголовка</Typography>
                      <Box
                        onClick={() => setColorPickerOpen('titleColor')}
                        sx={{
                          width: '100%',
                          height: 40,
                          backgroundColor: editData.titleColor,
                          border: '1px solid #ccc',
                          borderRadius: 1,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Typography variant="body2" sx={{ color: 'white', textShadow: '1px 1px 1px rgba(0,0,0,0.5)' }}>
                          {editData.titleColor}
                        </Typography>
                      </Box>
                    </Grid>

                    {/* Цвета сегментов */}
                    <Grid item xs={12}>
                      <Typography variant="body2" gutterBottom>Цвета сегментов</Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {editData.data.datasets[0].backgroundColor.map((color, index) => (
                          <Box key={index} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Typography variant="caption">{editData.data.labels[index] || `Сегмент ${index + 1}`}</Typography>
                            <Box
                              onClick={() => setColorPickerOpen(`segmentColors-${index}`)}
                              sx={{
                                width: 60,
                                height: 30,
                                backgroundColor: color,
                                border: '1px solid #ccc',
                                borderRadius: 1,
                                cursor: 'pointer'
                              }}
                            />
                          </Box>
                        ))}
                      </Box>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>

              {/* Настройки фона */}
              <Accordion sx={{ mb: 2 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="subtitle1">Настройки фона</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography variant="body2" gutterBottom>Тип фона</Typography>
                      <RadioGroup
                        value={editData.backgroundType}
                        onChange={(e) => setEditData({ ...editData, backgroundType: e.target.value })}
                        row
                      >
                        <FormControlLabel value="solid" control={<Radio />} label="Сплошной" />
                        <FormControlLabel value="gradient" control={<Radio />} label="Градиент" />
                      </RadioGroup>
                    </Grid>
                    
                    {editData.backgroundType === 'solid' ? (
                      <Grid item xs={12}>
                        <Typography variant="body2" gutterBottom>Цвет фона</Typography>
                        <Box
                          onClick={() => setColorPickerOpen('backgroundColor')}
                          sx={{
                            width: '100%',
                            height: 40,
                            backgroundColor: editData.backgroundColor,
                            border: '1px solid #ccc',
                            borderRadius: 1,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <Typography variant="body2" sx={{ color: 'white', textShadow: '1px 1px 1px rgba(0,0,0,0.5)' }}>
                            {editData.backgroundColor}
                          </Typography>
                        </Box>
                      </Grid>
                    ) : (
                      <>
                        <Grid item xs={6}>
                          <Typography variant="body2" gutterBottom>Начальный цвет</Typography>
                          <Box
                            onClick={() => setColorPickerOpen('gradientStart')}
                            sx={{
                              width: '100%',
                              height: 40,
                              backgroundColor: editData.gradientStart,
                              border: '1px solid #ccc',
                              borderRadius: 1,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <Typography variant="body2" sx={{ color: 'white', textShadow: '1px 1px 1px rgba(0,0,0,0.5)' }}>
                              {editData.gradientStart}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" gutterBottom>Конечный цвет</Typography>
                          <Box
                            onClick={() => setColorPickerOpen('gradientEnd')}
                            sx={{
                              width: '100%',
                              height: 40,
                              backgroundColor: editData.gradientEnd,
                              border: '1px solid #ccc',
                              borderRadius: 1,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <Typography variant="body2" sx={{ color: 'white', textShadow: '1px 1px 1px rgba(0,0,0,0.5)' }}>
                              {editData.gradientEnd}
                            </Typography>
                          </Box>
                        </Grid>
                      </>
                    )}

                    <Grid item xs={6}>
                      <Box>
                        <Typography variant="body2" gutterBottom>Радиус скругления: {editData.borderRadius}px</Typography>
                        <Slider
                          value={editData.borderRadius}
                          onChange={(e, value) => setEditData({ ...editData, borderRadius: value })}
                          min={0}
                          max={20}
                          size="small"
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box>
                        <Typography variant="body2" gutterBottom>Отступы: {editData.padding}px</Typography>
                        <Slider
                          value={editData.padding}
                          onChange={(e, value) => setEditData({ ...editData, padding: value })}
                          min={8}
                          max={48}
                          size="small"
                        />
                      </Box>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>

              {/* Данные диаграммы */}
              <Accordion sx={{ mb: 2 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <DataObjectIcon />
                    <Typography variant="subtitle1">Данные диаграммы</Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
                    {editData.data.labels.map((label, index) => (
                      <Card key={index} sx={{ mb: 1, p: 1 }}>
                        <Grid container spacing={1} alignItems="center">
                          <Grid item xs={4}>
                            <TextField
                              label="Название сегмента"
                              value={label}
                              onChange={(e) => {
                                const newData = { ...editData.data };
                                newData.labels[index] = e.target.value;
                                setEditData({ ...editData, data: newData });
                              }}
                              size="small"
                              fullWidth
                            />
                          </Grid>
                          <Grid item xs={3}>
                            <TextField
                              label="Значение"
                              type="number"
                              value={editData.data.datasets[0].data[index]}
                              onChange={(e) => {
                                const newData = { ...editData.data };
                                newData.datasets[0].data[index] = parseInt(e.target.value) || 0;
                                setEditData({ ...editData, data: newData });
                              }}
                              size="small"
                              fullWidth
                            />
                          </Grid>
                          <Grid item xs={3}>
                            <Box
                              onClick={() => setColorPickerOpen(`segmentColors-${index}`)}
                              sx={{
                                width: '100%',
                                height: 32,
                                backgroundColor: editData.data.datasets[0].backgroundColor[index],
                                border: '1px solid #ccc',
                                borderRadius: 1,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                            >
                              <Typography variant="caption" sx={{ color: 'white', textShadow: '1px 1px 1px rgba(0,0,0,0.5)' }}>
                                Цвет
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={2}>
                            <IconButton
                              onClick={() => {
                                const newData = { ...editData.data };
                                newData.labels = newData.labels.filter((_, i) => i !== index);
                                newData.datasets[0].data = newData.datasets[0].data.filter((_, i) => i !== index);
                                newData.datasets[0].backgroundColor = newData.datasets[0].backgroundColor.filter((_, i) => i !== index);
                                newData.datasets[0].borderColor = newData.datasets[0].borderColor.filter((_, i) => i !== index);
                                setEditData({ ...editData, data: newData });
                              }}
                              color="error"
                              size="small"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Grid>
                        </Grid>
                      </Card>
                    ))}
                    <Button
                      startIcon={<AddIcon />}
                      onClick={() => {
                        const newData = { ...editData.data };
                        const colors = ['rgba(255, 99, 132, 0.8)', 'rgba(54, 162, 235, 0.8)', 'rgba(255, 205, 86, 0.8)', 'rgba(75, 192, 192, 0.8)', 'rgba(153, 102, 255, 0.8)', 'rgba(255, 159, 64, 0.8)'];
                        const borderColors = ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 205, 86, 1)', 'rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)', 'rgba(255, 159, 64, 1)'];
                        const colorIndex = newData.labels.length % colors.length;
                        newData.labels.push(`Сегмент ${newData.labels.length + 1}`);
                        newData.datasets[0].data.push(Math.floor(Math.random() * 20) + 1);
                        newData.datasets[0].backgroundColor.push(colors[colorIndex]);
                        newData.datasets[0].borderColor.push(borderColors[colorIndex]);
                        setEditData({ ...editData, data: newData });
                      }}
                      variant="outlined"
                      fullWidth
                      sx={{ mt: 1 }}
                    >
                      Добавить сегмент
                    </Button>
                  </Box>
                </AccordionDetails>
              </Accordion>

              {/* Настройки анимации */}
              <Accordion sx={{ mb: 2 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="subtitle1">Анимация</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <AnimationControls
                    animationSettings={editData.animationSettings || animationSettings}
                    onUpdate={handleAnimationUpdate}
                  />
                </AccordionDetails>
              </Accordion>

              {/* Color Picker Modal */}
              {colorPickerOpen && (
                <Box
                  sx={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 9999
                  }}
                  onClick={() => setColorPickerOpen(null)}
                >
                  <Box onClick={(e) => e.stopPropagation()}>
                    <SketchPicker
                      color={colorPickerOpen.includes('segmentColors') 
                        ? editData.data.datasets[0].backgroundColor[colorPickerOpen.split('-')[1]] 
                        : editData[colorPickerOpen]
                      }
                      onChange={(color) => handleColorChange(colorPickerOpen, color)}
                    />
                  </Box>
                </Box>
              )}
              
              <Divider sx={{ my: 3 }} />
              
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button onClick={handleCancel} variant="outlined">
                  Отмена
                </Button>
                <Button onClick={handleSave} variant="contained">
                  Сохранить изменения
                </Button>
              </Box>
            </Box>
          ) : (
            <Box sx={{ p: editData.padding, position: 'relative' }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 2, 
                  color: editData.titleColor,
                  textAlign: 'center'
                }}
              >
                {title}
              </Typography>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center',
                position: 'relative',
                height: editData.chartSize 
              }}>
                <Box sx={{ width: editData.chartSize, height: editData.chartSize, position: 'relative' }}>
                  <ChartDoughnut data={data} options={options} />
                  {editData.showCenterText && editData.centerText && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        textAlign: 'center',
                        pointerEvents: 'none'
                      }}
                    >
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          color: editData.titleColor,
                          fontWeight: 'bold'
                        }}
                      >
                        {editData.centerText}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>
          )}
        </Paper>
      </AnimationWrapper>
    </EditableElementWrapper>
  );
};

export const ApexLineChart = ({
  isPreview = false,
  constructorMode = false,
  isEditing = false,
  onSave = null,
  onCancel = null,
  onUpdate = () => {},
  title: initialTitle = 'ApexCharts Линейный график',
  chartSeries = [{
    name: "Продажи",
    data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
  }],
  categories = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен'],
  animationSettings = {
    animationType: 'fadeIn',
    delay: 0,
    triggerOnView: true,
    triggerOnce: true,
    threshold: 0.1,
    disabled: false
  }
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [localEditing, setLocalEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: initialTitle,
    chartSeries,
    categories,
    animationSettings
  });

  const handleDoubleClick = () => {
    if (constructorMode) {
      setLocalEditing(true);
    }
  };

  const handleSave = () => {
    setLocalEditing(false);
    setTitle(editData.title);
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
      chartSeries,
      categories,
      animationSettings
    });
    if (onCancel) {
      onCancel();
    }
  };

  const handleAnimationUpdate = (newAnimationSettings) => {
    setEditData({ ...editData, animationSettings: newAnimationSettings });
  };

  const isCurrentlyEditing = isEditing || localEditing;

  const options = {
    chart: {
      id: 'apex-line-chart',
      type: 'line',
      height: 350,
      toolbar: {
        show: false
      }
    },
    xaxis: {
      categories: editData.categories
    },
    title: {
      text: title,
      align: 'left'
    },
    stroke: {
      curve: 'smooth'
    },
    markers: {
      size: 4
    }
  };

  return (
    <EditableElementWrapper 
      editable={constructorMode} 
      onStartEdit={handleDoubleClick}
      isEditing={isCurrentlyEditing}
    >
      <AnimationWrapper {...(editData.animationSettings || animationSettings)}>
        <Paper sx={{ p: 3, mb: 2 }}>
          {isCurrentlyEditing ? (
            <Box>
              <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
                Редактирование ApexCharts линейного графика
              </Typography>
              
              <TextField
                label="Заголовок"
                value={editData.title}
                onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                fullWidth
                size="small"
                sx={{ mb: 2 }}
              />
              
              {/* Настройки анимации */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>Настройки анимации:</Typography>
                <AnimationControls
                  animationSettings={editData.animationSettings || animationSettings}
                  onUpdate={handleAnimationUpdate}
                />
              </Box>
              
              {/* Редактирование категорий */}
              <Typography variant="subtitle2" gutterBottom>Категории (ось X):</Typography>
              <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {editData.categories.map((category, index) => (
                  <TextField
                    key={index}
                    value={category}
                    onChange={(e) => {
                      const newCategories = [...editData.categories];
                      newCategories[index] = e.target.value;
                      setEditData({ ...editData, categories: newCategories });
                    }}
                    size="small"
                    sx={{ width: 80 }}
                  />
                ))}
                <Button
                  startIcon={<AddIcon />}
                  onClick={() => {
                    const newCategories = [...editData.categories, `Кат ${editData.categories.length + 1}`];
                    const newSeries = editData.chartSeries.map(series => ({
                      ...series,
                      data: [...series.data, Math.floor(Math.random() * 100)]
                    }));
                    setEditData({ ...editData, categories: newCategories, chartSeries: newSeries });
                  }}
                  size="small"
                  variant="outlined"
                >
                  Добавить категорию
                </Button>
              </Box>
              
              {/* Редактирование серий данных */}
              <Typography variant="subtitle2" gutterBottom>Серии данных:</Typography>
              <Box sx={{ mb: 2, maxHeight: 200, overflow: 'auto', border: '1px solid #e0e0e0', borderRadius: 1, p: 1 }}>
                {editData.chartSeries.map((series, seriesIndex) => (
                  <Box key={seriesIndex} sx={{ mb: 2, p: 1, border: '1px solid #f0f0f0', borderRadius: 1 }}>
                    <Box sx={{ display: 'flex', gap: 1, mb: 1, alignItems: 'center' }}>
                      <TextField
                        label="Название серии"
                        value={series.name}
                        onChange={(e) => {
                          const newSeries = [...editData.chartSeries];
                          newSeries[seriesIndex] = { ...newSeries[seriesIndex], name: e.target.value };
                          setEditData({ ...editData, chartSeries: newSeries });
                        }}
                        size="small"
                        sx={{ width: 150 }}
                      />
                      <IconButton
                        size="small"
                        onClick={() => {
                          const newSeries = editData.chartSeries.filter((_, i) => i !== seriesIndex);
                          setEditData({ ...editData, chartSeries: newSeries });
                        }}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {series.data.map((value, valueIndex) => (
                        <TextField
                          key={valueIndex}
                          label={editData.categories[valueIndex] || `Значение ${valueIndex + 1}`}
                          type="number"
                          value={value}
                          onChange={(e) => {
                            const newSeries = [...editData.chartSeries];
                            newSeries[seriesIndex].data[valueIndex] = parseInt(e.target.value) || 0;
                            setEditData({ ...editData, chartSeries: newSeries });
                          }}
                          size="small"
                          sx={{ width: 80 }}
                        />
                      ))}
                    </Box>
                  </Box>
                ))}
                <Button
                  startIcon={<AddIcon />}
                  onClick={() => {
                    const newSeries = [...editData.chartSeries, {
                      name: `Серия ${editData.chartSeries.length + 1}`,
                      data: new Array(editData.categories.length).fill(0).map(() => Math.floor(Math.random() * 100))
                    }];
                    setEditData({ ...editData, chartSeries: newSeries });
                  }}
                  size="small"
                  variant="outlined"
                >
                  Добавить серию
                </Button>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                <Button onClick={handleCancel}>Отмена</Button>
                <Button variant="contained" onClick={handleSave}>Сохранить</Button>
              </Box>
            </Box>
          ) : (
            <Box>
              {!isPreview && !constructorMode && (
                <Box sx={{ mb: 2 }}>
                  <TextField
                    label="Заголовок"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    fullWidth
                    size="small"
                  />
                </Box>
              )}
              <Box sx={{ height: 350 }}>
                <Chart options={options} series={editData.chartSeries} type="line" height={350} />
              </Box>
            </Box>
          )}
        </Paper>
      </AnimationWrapper>
    </EditableElementWrapper>
  );
};

export const ApexColumnChart = ({
  isPreview = false,
  constructorMode = false,
  isEditing = false,
  onSave = null,
  onCancel = null,
  onUpdate = () => {},
  title: initialTitle = 'ApexCharts Столбчатая диаграмма',
  chartSeries = [{
    name: 'Прибыль',
    data: [2.3, 3.1, 4.0, 10.1, 4.0, 3.6, 3.2, 2.3, 1.4, 0.8, 0.5, 0.2]
  }],
  categories = ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"],
  chartColors = ['#008FFB'],
  animationSettings = {
    animationType: 'scaleIn',
    delay: 0,
    triggerOnView: true,
    triggerOnce: true,
    threshold: 0.1,
    disabled: false
  }
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [localEditing, setLocalEditing] = useState(false);
  const [colorPickerOpen, setColorPickerOpen] = useState(null);
  const [editData, setEditData] = useState({
    title: initialTitle,
    chartSeries,
    categories,
    chartColors,
    animationSettings
  });

  const handleDoubleClick = () => {
    if (constructorMode) {
      setLocalEditing(true);
    }
  };

  const handleSave = () => {
    setLocalEditing(false);
    setTitle(editData.title);
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
      chartSeries,
      categories,
      animationSettings
    });
    if (onCancel) {
      onCancel();
    }
  };

  const handleAnimationUpdate = (newAnimationSettings) => {
    setEditData({ ...editData, animationSettings: newAnimationSettings });
  };

  const isCurrentlyEditing = isEditing || localEditing;

  const options = {
    chart: {
      id: 'apex-column-chart',
      type: 'bar',
      height: 350,
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        endingShape: 'rounded'
      },
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    xaxis: {
      categories: editData.categories,
    },
    yaxis: {
      title: {
        text: 'Значения'
      }
    },
    fill: {
      opacity: 1
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val
        }
      }
    },
    title: {
      text: title,
      align: 'left'
    },
    colors: editData.chartColors
  };

  return (
    <EditableElementWrapper 
      editable={constructorMode} 
      onStartEdit={handleDoubleClick}
      isEditing={isCurrentlyEditing}
    >
      <AnimationWrapper {...(editData.animationSettings || animationSettings)}>
        <Paper sx={{ p: 3, mb: 2 }}>
          {isCurrentlyEditing ? (
            <Box>
              <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
                Редактирование ApexCharts столбчатой диаграммы
              </Typography>
              
              <TextField
                label="Заголовок"
                value={editData.title}
                onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                fullWidth
                size="small"
                sx={{ mb: 2 }}
              />
              
              {/* Настройки анимации */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>Настройки анимации:</Typography>
                <AnimationControls
                  animationSettings={editData.animationSettings || animationSettings}
                  onUpdate={handleAnimationUpdate}
                />
              </Box>
              
              {/* Редактирование категорий */}
              <Typography variant="subtitle2" gutterBottom>Категории (ось X):</Typography>
              <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {editData.categories.map((category, index) => (
                  <TextField
                    key={index}
                    value={category}
                    onChange={(e) => {
                      const newCategories = [...editData.categories];
                      newCategories[index] = e.target.value;
                      setEditData({ ...editData, categories: newCategories });
                    }}
                    size="small"
                    sx={{ width: 80 }}
                  />
                ))}
                <Button
                  startIcon={<AddIcon />}
                  onClick={() => {
                    const newCategories = [...editData.categories, `Кат ${editData.categories.length + 1}`];
                    const newSeries = editData.chartSeries.map(series => ({
                      ...series,
                      data: [...series.data, Math.floor(Math.random() * 10) + 1]
                    }));
                    setEditData({ ...editData, categories: newCategories, chartSeries: newSeries });
                  }}
                  size="small"
                  variant="outlined"
                >
                  Добавить категорию
                </Button>
              </Box>
              
              {/* Редактирование серий данных */}
              <Typography variant="subtitle2" gutterBottom>Серии данных:</Typography>
              <Box sx={{ mb: 2, maxHeight: 200, overflow: 'auto', border: '1px solid #e0e0e0', borderRadius: 1, p: 1 }}>
                {editData.chartSeries.map((series, seriesIndex) => (
                  <Box key={seriesIndex} sx={{ mb: 2, p: 1, border: '1px solid #f0f0f0', borderRadius: 1 }}>
                    <Box sx={{ display: 'flex', gap: 1, mb: 1, alignItems: 'center' }}>
                      <TextField
                        label="Название серии"
                        value={series.name}
                        onChange={(e) => {
                          const newSeries = [...editData.chartSeries];
                          newSeries[seriesIndex] = { ...newSeries[seriesIndex], name: e.target.value };
                          setEditData({ ...editData, chartSeries: newSeries });
                        }}
                        size="small"
                        sx={{ width: 150 }}
                      />
                      <IconButton
                        size="small"
                        onClick={() => {
                          const newSeries = editData.chartSeries.filter((_, i) => i !== seriesIndex);
                          setEditData({ ...editData, chartSeries: newSeries });
                        }}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {series.data.map((value, valueIndex) => (
                        <TextField
                          key={valueIndex}
                          label={editData.categories[valueIndex] || `Значение ${valueIndex + 1}`}
                          type="number"
                          value={value}
                          onChange={(e) => {
                            const newSeries = [...editData.chartSeries];
                            newSeries[seriesIndex].data[valueIndex] = parseFloat(e.target.value) || 0;
                            setEditData({ ...editData, chartSeries: newSeries });
                          }}
                          size="small"
                          sx={{ width: 80 }}
                          inputProps={{ step: 0.1 }}
                        />
                      ))}
                    </Box>
                  </Box>
                ))}
                <Button
                  startIcon={<AddIcon />}
                  onClick={() => {
                    const newSeries = [...editData.chartSeries, {
                      name: `Серия ${editData.chartSeries.length + 1}`,
                      data: new Array(editData.categories.length).fill(0).map(() => Math.floor(Math.random() * 10) + 1)
                    }];
                    setEditData({ ...editData, chartSeries: newSeries });
                  }}
                  size="small"
                  variant="outlined"
                >
                  Добавить серию
                </Button>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                <Button onClick={handleCancel}>Отмена</Button>
                <Button variant="contained" onClick={handleSave}>Сохранить</Button>
              </Box>
            </Box>
          ) : (
            <Box>
              {!isPreview && !constructorMode && (
                <Box sx={{ mb: 2 }}>
                  <TextField
                    label="Заголовок"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    fullWidth
                    size="small"
                  />
                </Box>
              )}
              <Box sx={{ height: 350 }}>
                <Chart options={options} series={editData.chartSeries} type="bar" height={350} />
              </Box>
            </Box>
          )}
        </Paper>
      </AnimationWrapper>
    </EditableElementWrapper>
  ); 
};