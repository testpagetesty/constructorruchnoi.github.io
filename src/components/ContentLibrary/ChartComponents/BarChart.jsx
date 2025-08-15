import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  Tooltip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
  Chip,
  Slider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Divider,
  Card,
  CardContent
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import BarChartIcon from '@mui/icons-material/BarChart';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PaletteIcon from '@mui/icons-material/Palette';
import TuneIcon from '@mui/icons-material/Tune';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditableElementWrapper from '../EditableElementWrapper';
import AnimationWrapper from '../AnimationWrapper';
import AnimationControls from '../AnimationControls';

const BarChart = ({
  title = 'Диаграмма',
  data = [
    { label: 'Январь', value: 65, color: '#1976d2' },
    { label: 'Февраль', value: 45, color: '#2196f3' },
    { label: 'Март', value: 80, color: '#03a9f4' },
    { label: 'Апрель', value: 55, color: '#00bcd4' }
  ],
  showValues = true,
  showGrid = true,
  animate = true,
  orientation = 'vertical',
  height = 300,
  customStyles = {},
  animationSettings = {
    animationType: 'fadeIn',
    delay: 0,
    triggerOnView: true,
    triggerOnce: true,
    threshold: 0.1,
    disabled: false
  },
  constructorMode = false,
  isEditing = false,
  onSave = null,
  onCancel = null,
  onUpdate,
  editable = true
}) => {
  // Нормализуем данные - поддерживаем как 'label', так и 'name'
  const normalizeData = (data) => {
    // Проверяем, что data является массивом
    if (!Array.isArray(data)) {
      console.warn('BarChart: data is not an array, using default data');
      return [
        { label: 'Январь', value: 65, color: '#1976d2' },
        { label: 'Февраль', value: 45, color: '#2196f3' },
        { label: 'Март', value: 80, color: '#03a9f4' },
        { label: 'Апрель', value: 55, color: '#00bcd4' }
      ];
    }
    
    return data.map(item => ({
      ...item,
      label: item.label || item.name || 'Без названия',
      name: item.name || item.label || 'Без названия',
      value: Number(item.value) || 0,
      color: item.color || '#1976d2'
    }));
  };

  const [chartTitle, setChartTitle] = useState(title);
  const [chartData, setChartData] = useState(normalizeData(data));
  const [showValueLabels, setShowValueLabels] = useState(showValues);
  const [showGridLines, setShowGridLines] = useState(showGrid);
  const [showLegend, setShowLegend] = useState(false);
  const [showStatistics, setShowStatistics] = useState(false);
  const [isAnimated, setIsAnimated] = useState(animate);
  const [chartOrientation, setChartOrientation] = useState(orientation);
  const [chartHeight, setChartHeight] = useState(height);
  const [barWidth, setBarWidth] = useState(60);
  const [barSpacing, setBarSpacing] = useState(16);
  const [borderRadius, setBorderRadius] = useState(4);
  const [chartStyles, setChartStyles] = useState(
    // Используем только пользовательские стили, без принудительных дефолтных значений
    customStyles || {}
  );
  const [chartAnimationSettings, setChartAnimationSettings] = useState(animationSettings || {
    animationType: 'fadeIn',
    delay: 0,
    triggerOnView: true,
    triggerOnce: true,
    threshold: 0.1,
    disabled: false
  });
  const [isEditingInternal, setIsEditingInternal] = useState(false);
  const [localEditing, setLocalEditing] = useState(false);

  // Объединяем внутреннее редактирование и внешнее
  const isCurrentlyEditing = isEditing || isEditingInternal || localEditing;
  
  // Отладочная информация (убрана для production)

  // Эффект для обновления данных при изменении входных пропсов
  useEffect(() => {
    if (data && Array.isArray(data) && data.length > 0) {
      setChartData(normalizeData(data));
    }
  }, [data]);

  // Эффект для обновления заголовка
  useEffect(() => {
    if (title) {
      setChartTitle(title);
    }
  }, [title]);

  // Эффект для обновления стилей
  useEffect(() => {
    if (customStyles) {
      setChartStyles(prev => ({
        ...prev,
        ...customStyles
      }));
    }
  }, [customStyles]);

  const maxValue = chartData && chartData.length > 0 ? Math.max(...chartData.map(item => item.value)) : 0;

  const handleDataChange = (index, field, value) => {
    const newData = chartData.map((item, i) => {
      if (i === index) {
        const updatedItem = { ...item, [field]: value };
        // Синхронизируем label и name
        if (field === 'label') {
          updatedItem.name = value;
        } else if (field === 'name') {
          updatedItem.label = value;
        }
        // Убеждаемся, что значение - число
        if (field === 'value') {
          updatedItem.value = Number(value) || 0;
        }
        return updatedItem;
      }
      return item;
    });
    setChartData(newData);
    
    // Вызываем onUpdate для сохранения изменений
    if (onUpdate) {
      onUpdate({
        title: chartTitle,
        data: newData,
        showValues: showValueLabels,
        showGrid: showGridLines,
        animate: isAnimated,
        orientation: chartOrientation,
        height: chartHeight,
        customStyles: chartStyles,
        animationSettings: chartAnimationSettings
      });
    }
  };

  const handleAddDataPoint = () => {
    const newLabel = `Элемент ${chartData.length + 1}`;
    const colors = ['#1976d2', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722', '#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5'];
    const newColor = colors[chartData.length % colors.length];
    
    const newData = [...chartData, {
      label: newLabel,
      name: newLabel,
      value: 50,
      color: newColor
    }];
    
    setChartData(newData);
    
    // Вызываем onUpdate для сохранения изменений
    if (onUpdate) {
      onUpdate({
        title: chartTitle,
        data: newData,
        showValues: showValueLabels,
        showGrid: showGridLines,
        animate: isAnimated,
        orientation: chartOrientation,
        height: chartHeight,
        customStyles: chartStyles,
        animationSettings: chartAnimationSettings
      });
    }
  };

  const handleDeleteDataPoint = (index) => {
    const newData = chartData.filter((_, i) => i !== index);
    setChartData(newData);
    
    // Вызываем onUpdate для сохранения изменений
    if (onUpdate) {
      onUpdate({
        title: chartTitle,
        data: newData,
        showValues: showValueLabels,
        showGrid: showGridLines,
        animate: isAnimated,
        orientation: chartOrientation,
        height: chartHeight,
        customStyles: chartStyles,
        animationSettings: chartAnimationSettings
      });
    }
  };

  const handleStyleChange = (property, value) => {
    const newStyles = { ...chartStyles, [property]: value };
    setChartStyles(newStyles);
    
    console.log('🎨 BarChart handleStyleChange:', { property, value, newStyles });
    
    // Вызываем onUpdate для сохранения изменений
    if (onUpdate) {
      onUpdate({
        title: chartTitle,
        data: chartData,
        showValues: showValueLabels,
        showGrid: showGridLines,
        animate: isAnimated,
        orientation: chartOrientation,
        height: chartHeight,
        customStyles: newStyles,
        animationSettings: chartAnimationSettings
      });
    }
  };



  const handleAnimationUpdate = (newAnimationSettings) => {
    setChartAnimationSettings(newAnimationSettings);
  };

  // Обработчики для режима конструктора
  const handleDoubleClick = (e) => {
    if (constructorMode) {
      setLocalEditing(true);
    } else {
      // Если не в режиме конструктора, открываем внутренний редактор
      setIsEditingInternal(true);
    }
  };

  const handleSaveConstructor = () => {
    setLocalEditing(false);
    if (onSave) {
      onSave({
        title: chartTitle,
        data: chartData,
        showValues: showValueLabels,
        showGrid: showGridLines,
        animate: isAnimated,
        orientation: chartOrientation,
        height: chartHeight,
        customStyles: chartStyles,
        animationSettings: chartAnimationSettings
      });
    } else {
      onUpdate({
        title: chartTitle,
        data: chartData,
        showValues: showValueLabels,
        showGrid: showGridLines,
        animate: isAnimated,
        orientation: chartOrientation,
        height: chartHeight,
        customStyles: chartStyles,
        animationSettings: chartAnimationSettings
      });
    }
  };

  const handleCancelConstructor = () => {
    setLocalEditing(false);
    if (onCancel) {
      onCancel();
    }
  };

  const handleSave = () => {
    setIsEditingInternal(false);
    if (onUpdate) {
      onUpdate({
        title: chartTitle,
        data: chartData,
        showValues: showValueLabels,
        showGrid: showGridLines,
        animate: isAnimated,
        orientation: chartOrientation,
        height: chartHeight,
        customStyles: chartStyles,
        animationSettings: chartAnimationSettings
      });
    }
  };

  const renderChart = () => {
    const isHorizontal = false; // Принудительно вертикальная ориентация
    
    return (
      <Paper 
        sx={{ 
          p: chartStyles.padding / 8,
          backgroundColor: chartStyles.backgroundColor,
          position: 'relative',
          border: chartStyles.borderWidth > 0 ? `${chartStyles.borderWidth}px solid ${chartStyles.borderColor}` : 'none',
          borderRadius: 2,
          '&:hover .chart-overlay': editable ? { opacity: 1 } : {},
          '& .chart-overlay': editable ? { opacity: 0.7 } : {}
        }}
      >
        {/* Overlay для редактирования */}
        {editable && !isCurrentlyEditing && (
          <Box
            className="chart-overlay"
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              transition: 'opacity 0.2s ease',
              zIndex: 10
            }}
          >
            <Tooltip title="Редактировать диаграмму">
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditingInternal(true);
                }}
                sx={{
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  '&:hover': { backgroundColor: 'rgba(255,255,255,1)' }
                }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        )}

        {/* Заголовок */}
        <Typography 
          variant="h6" 
          align="center" 
          gutterBottom 
          sx={{ 
            color: chartStyles.titleColor, 
            mb: 3,
            fontWeight: 'bold',
            fontSize: '1.25rem'
          }}
        >
          {chartTitle}
        </Typography>

        {/* Диаграмма */}
        <Box 
          sx={{ 
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-end',
            justifyContent: 'center',
            gap: `${Math.max(15 - chartData.length * 1.5, 2)}px`, // Автоматический интервал
            minHeight: 400,
            position: 'relative',
            mb: 2,
            padding: chartData.length > 8 ? 2 : 3,
            maxWidth: '100%',
            flexWrap: 'nowrap', // Никогда не переносим
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 0, // Прямые углы для контейнера
            backgroundColor: 'rgba(0,0,0,0.02)',
            overflowX: 'visible', // Никогда не показываем горизонтальную прокрутку
            overflowY: 'visible'
          }}
        >
          {/* Базовая линия */}
          <Box
            sx={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 60, // Высота подписей
              height: '2px',
              backgroundColor: 'rgba(255,255,255,0.2)',
              zIndex: 0
            }}
          />
          
          {/* Сетка */}
          {showGridLines && (
            <Box
              sx={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: 0,
                bottom: 60, // Не включаем область подписей
                pointerEvents: 'none',
                zIndex: 0
              }}
            >
              {/* Горизонтальные линии для вертикальной диаграммы */}
              {[25, 50, 75].map(percent => (
                <Box
                  key={percent}
                  sx={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    bottom: `${percent}%`,
                    height: '1px',
                    backgroundColor: chartStyles.gridColor,
                    opacity: 0.3
                  }}
                />
              ))}
            </Box>
          )}

          {/* Столбцы/Полосы */}
          {chartData.map((item, index) => {
            // Простой и надежный расчет высоты
            const minValue = Math.min(...chartData.map(d => d.value));
            const range = maxValue - minValue;
            
            let heightPx;
            if (range === 0) {
              heightPx = 200; // Если все одинаковые
            } else {
              // Для малых диапазонов делаем больше разницы
              const relativeValue = (item.value - minValue) / range;
              heightPx = 50 + (relativeValue * 300); // От 50px до 350px
            }
            
            // Автоматическая ширина в зависимости от количества столбцов - всегда помещаем в форму
            const availableWidth = 1000; // Доступная ширина
            const gapSize = Math.max(15 - chartData.length * 1.5, 2);
            const totalGap = gapSize * (chartData.length - 1);
            const widthPerColumn = (availableWidth - totalGap - 60) / chartData.length; // 60px на отступы
            const autoWidth = Math.max(20, Math.min(120, widthPerColumn));
            const containerWidth = autoWidth;
            
            if (index === 0) {
              console.log(`BarChart layout: ${chartData.length} columns, gap=${gapSize}px, totalGap=${totalGap}px, columnWidth=${Math.round(autoWidth)}px`);
            }

            
            return (
              <Box
                key={index}
                className="bar-container"
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 1,
                  position: 'relative',
                  zIndex: 1,
                  width: containerWidth,
                  minWidth: containerWidth,
                  maxWidth: containerWidth,
                  // При наведении поднимаем z-index контейнера
                  '&:hover': {
                    zIndex: 999
                  }
                }}
              >
                {/* Столбец */}
                <Box
                  sx={{
                    background: `linear-gradient(180deg, ${item.color || '#1976d2'} 0%, ${item.color ? item.color + 'DD' : '#1976d2DD'} 100%)`,
                    borderRadius: 0, // Прямые углы
                    transition: isAnimated ? 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
                    position: 'relative',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.1)',
                    border: '1px solid rgba(0,0,0,0.2)',
                    borderBottom: '2px solid rgba(0,0,0,0.3)',
                    width: autoWidth,
                    height: `${heightPx}px`,
                    minHeight: 40,
                    '&:hover': {
                      opacity: 0.9,
                      transform: 'translateY(-3px)',
                      boxShadow: '0 6px 16px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.2)',
                      filter: 'brightness(1.1)'
                    }
                  }}
                >
                  {/* Значение на столбце */}
                  {showValueLabels && (
                    <Typography
                      variant="caption"
                      sx={{
                        position: 'absolute',
                        color: 'white',
                        fontWeight: 'bold',
                        left: '50%',
                        top: '12px',
                        transform: 'translateX(-50%)',
                        textShadow: '0 2px 4px rgba(0,0,0,0.9)',
                        fontSize: '0.85rem',
                        zIndex: 2,
                        pointerEvents: 'none',
                        backgroundColor: 'rgba(0,0,0,0.3)',
                        padding: '2px 6px',
                        borderRadius: '4px'
                      }}
                    >
                      {item.value}%
                    </Typography>
                  )}
                </Box>

                {/* Подпись - под столбцом или скрытая при большом количестве */}
                {autoWidth > 50 ? (
                  // Широкие столбцы - подпись снизу с цветом столбца
                <Typography
                  variant="body2"
                  sx={{
                      color: item.color || '#1976d2', // Цвет текста соответствует цвету столбца
                    textAlign: 'center',
                      fontSize: chartData.length > 10 ? '9px' : chartData.length > 6 ? '10px' : '12px',
                      fontWeight: 600,
                      lineHeight: 1.2,
                      marginTop: 2,
                      width: containerWidth,
                      wordWrap: 'break-word',
                      whiteSpace: 'normal',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minHeight: '40px',
                      padding: '0 2px',
                      textShadow: '0 1px 2px rgba(0,0,0,0.1)' // Легкая тень для читаемости
                    }}
                  >
                    {item.name || item.label}
                </Typography>
                ) : (
                  // Узкие столбцы - скрытая подпись, показывается при наведении
                  <>
                    {/* Скрытая подпись, показывается при наведении горизонтально поверх соседних столбцов */}
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'white',
                        textAlign: 'center',
                        fontSize: '11px',
                        fontWeight: 600,
                        lineHeight: 1,
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        whiteSpace: 'nowrap',
                        zIndex: 1000, // Очень высокий z-index чтобы быть поверх всех столбцов
                        textShadow: '0 1px 3px rgba(0,0,0,0.9)',
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        opacity: 0,
                        transition: 'opacity 0.3s ease',
                        pointerEvents: 'none',
                        maxWidth: '200px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        // Показываем при наведении на родительский контейнер
                        '.bar-container:hover &': {
                          opacity: 1
                        }
                      }}
                    >
                      {item.name || item.label}
                    </Typography>
                  </>
                )}
              </Box>
            );
          })}
        </Box>

        {/* Легенда с значениями */}
        {showLegend && (
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 1 }}>
            {chartData.map((item, index) => (
              <Chip
                key={index}
                label={`${item.label}: ${item.value}`}
                size="small"
                sx={{
                  backgroundColor: item.color,
                  color: 'white',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  '& .MuiChip-label': {
                    px: 1
                  }
                }}
              />
            ))}
          </Box>
        )}

        {/* Статистика */}
        {showStatistics && (
          <Box sx={{ mt: 2, pt: 2, borderTop: `1px solid ${chartStyles.gridColor}` }}>
            <Typography 
              variant="caption" 
              sx={{ 
                color: chartStyles.legendColor,
                display: 'block',
                textAlign: 'center',
                fontSize: '11px'
              }}
            >
            Элементов: {chartData.length} | 
            Максимум: {maxValue} | 
              Среднее: {chartData.length > 0 ? (chartData.reduce((sum, item) => sum + item.value, 0) / chartData.length).toFixed(1) : 0} |
              Сумма: {chartData.reduce((sum, item) => sum + item.value, 0)}
          </Typography>
        </Box>
        )}
      </Paper>
    );
  };

  return (
    <EditableElementWrapper 
      editable={editable} 
      onStartEdit={handleDoubleClick}
      isEditing={isCurrentlyEditing}
    >
      <Box 
        onDoubleClick={handleDoubleClick}
        sx={{ cursor: editable ? 'pointer' : 'default' }}
      >
        {/* Превью */}
        {!isCurrentlyEditing && (
          <AnimationWrapper {...chartAnimationSettings}>
            {renderChart()}
          </AnimationWrapper>
        )}

        {/* Редактор для режима конструктора */}
        {localEditing && (
          <Paper sx={{ p: 3, border: '2px dashed #1976d2', borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <BarChartIcon color="primary" />
              <Typography variant="h6" color="primary">
                Редактирование столбчатой диаграммы
              </Typography>
              <Chip label="Режим конструктора" color="primary" size="small" />
            </Box>

            {/* Основные настройки */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={8}>
            <TextField
              fullWidth
              value={chartTitle}
              onChange={(e) => setChartTitle(e.target.value)}
              label="Заголовок диаграммы"
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  type="color"
                  label="Цвет заголовка"
                  value={chartStyles.titleColor || '#ffffff'}
                  onChange={(e) => handleStyleChange('titleColor', e.target.value)}
                />
              </Grid>
            </Grid>

            {/* Данные диаграммы */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <BarChartIcon />
                Данные диаграммы ({chartData.length} элементов)
              </Typography>
              
              {chartData.map((item, index) => (
                <Card key={index} sx={{ mb: 2, border: '1px solid #e0e0e0' }}>
                  <CardContent sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 2 }}>
                      <Chip 
                        label={`${index + 1}`} 
                        size="small" 
                        sx={{ 
                          backgroundColor: item.color || '#1976d2', 
                          color: 'white',
                          fontWeight: 'bold'
                        }} 
                      />
                      <Typography variant="subtitle2" sx={{ flex: 1 }}>
                        {item.label}
                      </Typography>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteDataPoint(index)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                    
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          size="small"
                          value={item.label}
                          onChange={(e) => handleDataChange(index, 'label', e.target.value)}
                          label="Название категории"
                        />
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <TextField
                          fullWidth
                          size="small"
                          type="number"
                          value={item.value}
                          onChange={(e) => handleDataChange(index, 'value', parseFloat(e.target.value) || 0)}
                          label="Значение"
                          inputProps={{ min: 0, max: 100, step: 1 }}
                        />
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <TextField
                          fullWidth
                          size="small"
                          type="color"
                          value={item.color || '#1976d2'}
                          onChange={(e) => handleDataChange(index, 'color', e.target.value)}
                          label="Цвет"
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              ))}
              
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={handleAddDataPoint}
                sx={{ mt: 1 }}
              >
                Добавить категорию
              </Button>
            </Box>

            {/* Настройки цветов */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PaletteIcon />
                Настройки цветов
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    type="color"
                    label="Цвет фона диаграммы"
                    value={chartStyles.backgroundColor || '#ffffff'}
                    onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                    helperText="Цвет фона области диаграммы"
                    size="small"
                  />
                </Grid>
              </Grid>
            </Box>

            {/* Настройки анимации */}
            {constructorMode && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Настройки анимации
                </Typography>
                <AnimationControls
                  animationSettings={chartAnimationSettings}
                  onUpdate={handleAnimationUpdate}
                />
              </Box>
            )}

            {/* Кнопки */}
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
              <Button onClick={handleCancelConstructor}>
                Отмена
              </Button>
              <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSaveConstructor}>
                Сохранить
              </Button>
            </Box>
          </Paper>
        )}

        {/* Расширенный редактор для обычного режима */}
        {isEditingInternal && (
          <Paper sx={{ p: 3, border: '2px solid #1976d2', borderRadius: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
            <BarChartIcon color="primary" />
            <Typography variant="h6" color="primary">
              Редактирование столбчатой диаграммы
            </Typography>
              <Chip label="Расширенный редактор" color="primary" size="small" />
          </Box>

          {/* Основные настройки */}
            <Accordion defaultExpanded={false}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TuneIcon />
                  <Typography variant="subtitle1">Основные настройки</Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item xs={8}>
          <TextField
            fullWidth
            value={chartTitle}
            onChange={(e) => setChartTitle(e.target.value)}
            label="Заголовок диаграммы"
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      fullWidth
                      type="color"
                      label="Цвет заголовка"
                      value={chartStyles.titleColor || '#ffffff'}
                      onChange={(e) => handleStyleChange('titleColor', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel>Ориентация</InputLabel>
              <Select
                value={chartOrientation}
                label="Ориентация"
                onChange={(e) => setChartOrientation(e.target.value)}
              >
                <MenuItem value="vertical">Вертикальная</MenuItem>
                <MenuItem value="horizontal">Горизонтальная</MenuItem>
              </Select>
            </FormControl>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography gutterBottom>Высота диаграммы: {chartHeight}px</Typography>
                    <Slider
                      value={chartHeight}
                      onChange={(_, value) => setChartHeight(value)}
                      min={200}
                      max={600}
                      step={50}
                      valueLabelDisplay="auto"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Typography gutterBottom>Ширина столбцов: {barWidth}px</Typography>
                    <Slider
                      value={barWidth}
                      onChange={(_, value) => setBarWidth(value)}
                      min={20}
                      max={80}
                      step={5}
                      valueLabelDisplay="auto"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Typography gutterBottom>Расстояние между столбцами: {barSpacing}px</Typography>
                    <Slider
                      value={barSpacing}
                      onChange={(_, value) => setBarSpacing(value)}
                      min={2}
                      max={20}
                      step={2}
                      valueLabelDisplay="auto"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography gutterBottom>Радиус скругления: {borderRadius}px</Typography>
                    <Slider
                      value={borderRadius}
                      onChange={(_, value) => setBorderRadius(value)}
                      min={0}
                      max={20}
                      step={1}
                      valueLabelDisplay="auto"
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>

          {/* Настройки отображения */}
            <Accordion defaultExpanded={false}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <VisibilityIcon />
                  <Typography variant="subtitle1">Настройки отображения</Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
            <FormControlLabel
              control={<Switch checked={showValueLabels} onChange={(e) => setShowValueLabels(e.target.checked)} />}
              label="Показывать значения"
            />
                  </Grid>
                  <Grid item xs={6}>
            <FormControlLabel
              control={<Switch checked={showGridLines} onChange={(e) => setShowGridLines(e.target.checked)} />}
              label="Показывать сетку"
            />
                  </Grid>
                  <Grid item xs={6}>
                    <FormControlLabel
                      control={<Switch checked={showLegend} onChange={(e) => setShowLegend(e.target.checked)} />}
                      label="Показывать легенду"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <FormControlLabel
                      control={<Switch checked={showStatistics} onChange={(e) => setShowStatistics(e.target.checked)} />}
                      label="Показывать статистику"
                    />
                  </Grid>
                  <Grid item xs={12}>
            <FormControlLabel
              control={<Switch checked={isAnimated} onChange={(e) => setIsAnimated(e.target.checked)} />}
              label="Анимация"
            />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>

            {/* Настройки стилей */}
            <Accordion defaultExpanded={false}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PaletteIcon />
                  <Typography variant="subtitle1">Стили и цвета</Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
            <TextField
                      fullWidth
                      label="Цвет фона"
              value={chartStyles.backgroundColor}
              onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                      placeholder="rgba(0, 0, 0, 0.8)"
            />
                  </Grid>
                  <Grid item xs={6}>
            <TextField
                      fullWidth
              type="color"
                      label="Цвет заголовка"
                      value={chartStyles.titleColor || '#ffffff'}
                      onChange={(e) => handleStyleChange('titleColor', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      type="color"
                      label="Цвет текста"
                      value={chartStyles.textColor || '#ffffff'}
              onChange={(e) => handleStyleChange('textColor', e.target.value)}
            />
                  </Grid>
                  <Grid item xs={6}>
            <TextField
                      fullWidth
              type="color"
                      label="Цвет легенды"
                      value={chartStyles.legendColor || '#ffffff'}
                      onChange={(e) => handleStyleChange('legendColor', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PaletteIcon fontSize="small" />
                      Дополнительные настройки
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      type="color"
                      label="Цвет фона диаграммы"
                      value={chartStyles.backgroundColor || '#ffffff'}
                      onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                      helperText="Цвет фона области диаграммы"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Цвет сетки"
              value={chartStyles.gridColor}
              onChange={(e) => handleStyleChange('gridColor', e.target.value)}
                      placeholder="rgba(255, 255, 255, 0.1)"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      type="color"
                      label="Цвет рамки"
                      value={chartStyles.borderColor === 'transparent' ? '#000000' : chartStyles.borderColor}
                      onChange={(e) => handleStyleChange('borderColor', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Typography gutterBottom>Толщина рамки: {chartStyles.borderWidth}px</Typography>
                    <Slider
                      value={chartStyles.borderWidth}
                      onChange={(_, value) => handleStyleChange('borderWidth', value)}
                      min={0}
                      max={5}
                      step={1}
                      valueLabelDisplay="auto"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Typography gutterBottom>Отступы: {chartStyles.padding}px</Typography>
                    <Slider
                      value={chartStyles.padding}
                      onChange={(_, value) => handleStyleChange('padding', value)}
                      min={8}
                      max={48}
                      step={4}
                      valueLabelDisplay="auto"
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>

            {/* Данные диаграммы */}
            <Accordion defaultExpanded={false}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <BarChartIcon />
                  <Typography variant="subtitle1">Данные диаграммы ({chartData.length} элементов)</Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ mb: 2 }}>
            {chartData.map((item, index) => (
                    <Card key={index} sx={{ mb: 2, border: '1px solid #e0e0e0' }}>
                      <CardContent sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 2 }}>
                          <Chip 
                            label={`${index + 1}`} 
                            size="small" 
                            sx={{ 
                              backgroundColor: item.color, 
                              color: 'white',
                              fontWeight: 'bold'
                            }} 
                          />
                          <Typography variant="subtitle2" sx={{ flex: 1 }}>
                            {item.label}
                          </Typography>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDeleteDataPoint(index)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
                
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={6}>
                  <TextField
                              fullWidth
                    size="small"
                    value={item.label}
                    onChange={(e) => handleDataChange(index, 'label', e.target.value)}
                              label="Название категории"
                  />
                          </Grid>
                          <Grid item xs={6} md={3}>
                  <TextField
                              fullWidth
                    size="small"
                    type="number"
                    value={item.value}
                    onChange={(e) => handleDataChange(index, 'value', parseFloat(e.target.value) || 0)}
                    label="Значение"
                              inputProps={{ min: 0, max: 100, step: 1 }}
                  />
                          </Grid>
                          <Grid item xs={6} md={3}>
                  <TextField
                              fullWidth
                    size="small"
                    type="color"
                    value={item.color}
                    onChange={(e) => handleDataChange(index, 'color', e.target.value)}
                    label="Цвет"
                            />
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
            ))}
            
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={handleAddDataPoint}
                    sx={{ mt: 1 }}
            >
                    Добавить категорию
            </Button>
          </Box>
              </AccordionDetails>
            </Accordion>

            <Divider sx={{ my: 3 }} />

          {/* Предварительный просмотр */}
          <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <VisibilityIcon />
                Предварительный просмотр
            </Typography>
              <Box sx={{ border: '2px dashed #ccc', borderRadius: 2, overflow: 'hidden' }}>
              {renderChart()}
            </Box>
          </Box>

          {/* Кнопки */}
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button 
                onClick={() => setIsEditingInternal(false)}
                variant="outlined"
              >
              Отмена
            </Button>
              <Button 
                variant="contained" 
                startIcon={<SaveIcon />} 
                onClick={handleSave}
                color="primary"
              >
                Сохранить изменения
            </Button>
          </Box>
        </Paper>
        )}
      </Box>
    </EditableElementWrapper>
  );
};

export default BarChart; 