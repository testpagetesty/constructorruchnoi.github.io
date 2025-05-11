import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Paper, Snackbar, Alert, Grid, Chip, Tooltip, Divider, List, ListItem, ListItemButton, ListItemText, ListItemIcon } from '@mui/material';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import HistoryIcon from '@mui/icons-material/History';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import StyleIcon from '@mui/icons-material/Style';

// Импортируем константу со стилями
import { STYLE_PRESETS } from '../../utils/editorStylePresets';

// Функция для определения контрастного цвета текста (черный или белый)
const getContrastTextColor = (hexColor) => {
  // Удаляем # если он есть
  const hex = hexColor.replace('#', '');
  
  // Преобразуем hex в RGB
  let r, g, b;
  if (hex.length === 3) {
    r = parseInt(hex.charAt(0) + hex.charAt(0), 16);
    g = parseInt(hex.charAt(1) + hex.charAt(1), 16);
    b = parseInt(hex.charAt(2) + hex.charAt(2), 16);
  } else {
    r = parseInt(hex.substr(0, 2), 16);
    g = parseInt(hex.substr(2, 2), 16);
    b = parseInt(hex.substr(4, 2), 16);
  }
  
  // Рассчитываем яркость по формуле YIQ
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  
  // Возвращаем черный или белый цвет в зависимости от яркости
  return yiq >= 128 ? '#000000' : '#ffffff';
};

const RandomStyleSelector = ({ 
  onApplyToWholeWebsite,
  headerData,
  sectionsData,
  heroData,
  contactData,
  footerData,
  useSameStyle
}) => {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [lastAppliedStyle, setLastAppliedStyle] = useState('');
  const [styleHistory, setStyleHistory] = useState([]);
  const [stylesApplied, setStylesApplied] = useState(0); // Счетчик примененных стилей
  
  // Загружаем историю стилей при монтировании компонента
  useEffect(() => {
    const savedHistory = localStorage.getItem('styleHistory');
    if (savedHistory) {
      try {
        setStyleHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Ошибка загрузки истории стилей:', e);
      }
    }
  }, []);

  const handleRandomStyleSelect = () => {
    // Получаем все доступные стили
    const styleKeys = Object.keys(STYLE_PRESETS);
    
    // Выбираем случайный стиль
    const randomIndex = Math.floor(Math.random() * styleKeys.length);
    const selectedStyle = styleKeys[randomIndex];
    const preset = STYLE_PRESETS[selectedStyle];
    
    console.log('Применяем случайный стиль:', selectedStyle, useSameStyle ? 'один для всех' : 'разные для разных');
    
    // Применяем стиль ко всему сайту через коллбэк
    if (typeof onApplyToWholeWebsite === 'function') {
      onApplyToWholeWebsite(selectedStyle, preset);
    } else {
      console.error('Функция onApplyToWholeWebsite не является функцией');
    }
    
    // Обновляем историю стилей
    const updatedHistory = [selectedStyle, ...styleHistory.filter(s => s !== selectedStyle).slice(0, 4)];
    setStyleHistory(updatedHistory);
    localStorage.setItem('styleHistory', JSON.stringify(updatedHistory));
    
    // Показываем уведомление
    setLastAppliedStyle(selectedStyle);
    setOpenSnackbar(true);
    
    // Увеличиваем счетчик применений стилей
    setStylesApplied(prev => prev + 1);
  };
  
  // Применяем выбранный стиль
  const applyStyle = (styleName) => {
    const preset = STYLE_PRESETS[styleName];
    if (!preset) return;
    
    console.log('Применяем выбранный стиль:', styleName, useSameStyle ? 'один для всех' : 'разные для разных');
    
    if (typeof onApplyToWholeWebsite === 'function') {
      onApplyToWholeWebsite(styleName, preset);
    } else {
      console.error('Функция onApplyToWholeWebsite не является функцией');
    }
    
    setLastAppliedStyle(styleName);
    setOpenSnackbar(true);
    
    // Обновляем историю, помещая выбранный стиль на первое место
    const updatedHistory = [styleName, ...styleHistory.filter(s => s !== styleName)];
    setStyleHistory(updatedHistory);
    localStorage.setItem('styleHistory', JSON.stringify(updatedHistory));
    
    // Увеличиваем счетчик применений стилей
    setStylesApplied(prev => prev + 1);
  };

  // Создаем предпросмотр цветовой схемы стиля
  const renderStylePreview = (styleName) => {
    const style = STYLE_PRESETS[styleName];
    
    if (!style) return null;
    
    return (
      <Box 
        sx={{ 
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          mb: 3,
          mt: 2,
          p: 2,
          bgcolor: '#f5f5f5',
          borderRadius: 2,
          border: '1px solid #e0e0e0'
        }}
      >
        <Typography variant="h6" sx={{ mb: 2, color: style.titleColor }}>
          Текущий стиль: {styleName.replace(/_/g, ' ')}
        </Typography>
        
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6}>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 1.5 
            }}>
              <Typography variant="subtitle2">Цветовая палитра:</Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box 
                  sx={{ 
                    width: 30, 
                    height: 30, 
                    bgcolor: style.backgroundColor,
                    border: `1px solid ${style.borderColor}`,
                    borderRadius: 1,
                    flexShrink: 0
                  }} 
                />
                <Typography variant="body2">Фон секций</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box 
                  sx={{ 
                    width: 30, 
                    height: 30, 
                    bgcolor: style.titleColor,
                    borderRadius: 1,
                    flexShrink: 0
                  }} 
                />
                <Typography variant="body2">Заголовки</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box 
                  sx={{ 
                    width: 30, 
                    height: 30, 
                    bgcolor: style.descriptionColor,
                    borderRadius: 1,
                    flexShrink: 0
                  }} 
                />
                <Typography variant="body2">Описания</Typography>
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 1.5 
            }}>
              <Typography variant="subtitle2">Карточки:</Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box 
                  sx={{ 
                    width: 30, 
                    height: 30, 
                    bgcolor: style.cardBackgroundColor,
                    border: `1px solid ${style.cardBorderColor}`,
                    borderRadius: 1,
                    flexShrink: 0
                  }} 
                />
                <Typography variant="body2">Фон карточек</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box 
                  sx={{ 
                    width: 30, 
                    height: 30, 
                    background: style.cardBackgroundType === 'gradient' ? 
                      `linear-gradient(${style.cardGradientDirection}, ${style.cardGradientColor1}, ${style.cardGradientColor2})` : 
                      style.cardBackgroundColor,
                    border: `1px solid ${style.cardBorderColor}`,
                    borderRadius: 1,
                    flexShrink: 0
                  }} 
                />
                <Typography variant="body2">
                  {style.cardBackgroundType === 'gradient' ? 'Градиент карточек' : 'Фон карточек'}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box 
                  sx={{ 
                    width: 30, 
                    height: 30, 
                    bgcolor: style.cardTitleColor,
                    borderRadius: 1,
                    flexShrink: 0
                  }} 
                />
                <Typography variant="body2">Заголовки карточек</Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
        
        <Typography variant="body2" sx={{ mt: 1, color: '#666' }}>
          Тип карточек: {style.cardType} • Тени: {style.style.shadow} • Скругление: {style.style.borderRadius}
        </Typography>
      </Box>
    );
  };

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 3, 
        mb: 3, 
        bgcolor: '#f9f9f9', 
        borderRadius: 2,
        border: '1px solid #e0e0e0',
        overflow: 'auto',
        maxHeight: '70vh',
        '&::-webkit-scrollbar': {
          width: '8px',
          height: '8px',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: 'rgba(0,0,0,0.2)',
          borderRadius: '4px',
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: 'rgba(0,0,0,0.05)',
          borderRadius: '4px',
        }
      }}
    >
      <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
        Быстрое оформление сайта
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 3 }}>
        Выберите стиль оформления или нажмите кнопку для случайного выбора. Применение стиля изменит цвета, тени и градиенты {useSameStyle ? 'всех разделов одинаково' : 'каждого раздела уникальным образом'}. Раздел контактов получит специально подобранный стиль из коллекции.
      </Typography>
      
      {stylesApplied > 0 && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {useSameStyle 
            ? `Стиль "${lastAppliedStyle.replace(/_/g, ' ')}" успешно применен ко всем разделам! Подобран соответствующий стиль для шапки.` 
            : "Разные стили успешно применены к разным разделам сайта! Для шапки выбран случайный стиль."
          }
        </Alert>
      )}
      
      {lastAppliedStyle && useSameStyle && renderStylePreview(lastAppliedStyle)}
      
      {!useSameStyle && stylesApplied > 0 && (
        <Alert severity="info" sx={{ mb: 3 }}>
          В режиме разных стилей для разных разделов каждая секция сайта получает уникальное оформление. 
          Раздел контактов получит специальный стиль контактной формы, который гармонирует с общим дизайном.
        </Alert>
      )}
      
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<ShuffleIcon />}
            fullWidth
            size="large"
            onClick={handleRandomStyleSelect}
            sx={{ 
              py: 2,
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #1976D2 30%, #0CA1C9 90%)',
              },
              boxShadow: '0 4px 10px rgba(33, 150, 243, 0.3)',
              transition: 'all 0.3s ease-in-out',
              borderRadius: '8px',
              textTransform: 'none'
            }}
          >
            {useSameStyle 
              ? "Случайный стиль для всего сайта" 
              : "Случайные стили для разделов"
            }
          </Button>
        </Grid>
      </Grid>
      
      <Divider sx={{ mb: 2 }}>
        <Chip 
          icon={<StyleIcon />} 
          label={useSameStyle ? "Доступные стили" : "Стили для выбранного режима"} 
          color="primary" 
          variant="outlined" 
        />
      </Divider>
      
      <Box sx={{ 
        mb: 2,
        maxHeight: '400px',
        overflowY: 'auto',
        '&::-webkit-scrollbar': {
          width: '8px',
          height: '8px',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: 'rgba(0,0,0,0.2)',
          borderRadius: '4px',
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: 'rgba(0,0,0,0.05)',
          borderRadius: '4px',
        }
      }}>
        {useSameStyle ? (
          <List sx={{ 
            bgcolor: 'background.paper',
            border: '1px solid #e0e0e0',
            borderRadius: 1
          }}>
            {Object.entries(STYLE_PRESETS).map(([key, preset]) => (
              <ListItem 
                key={key} 
                disablePadding
                sx={{ 
                  borderBottom: '1px solid #f0f0f0',
                  '&:last-child': {
                    borderBottom: 'none'
                  }
                }}
              >
                <ListItemButton 
                  onClick={() => applyStyle(key)}
                  sx={{
                    py: 1.5,
                    '&:hover': {
                      bgcolor: 'rgba(0,0,0,0.04)'
                    }
                  }}
                >
                  <ListItemIcon>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      gap: 1
                    }}>
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: 1,
                          backgroundColor: preset.backgroundColor,
                          border: `2px solid ${preset.borderColor}`
                        }}
                      />
                      {lastAppliedStyle === key && (
                        <CheckCircleIcon sx={{ color: 'success.main' }} />
                      )}
                    </Box>
                  </ListItemIcon>
                  <ListItemText 
                    primary={key.split('_').map(word => word.charAt(0) + word.slice(1).toLowerCase()).join(' ')} 
                    secondary={(
                      <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                        <Box
                          sx={{
                            width: 16,
                            height: 16,
                            borderRadius: '50%',
                            backgroundColor: preset.titleColor
                          }}
                        />
                        <Box
                          sx={{
                            width: 16,
                            height: 16,
                            borderRadius: '50%',
                            backgroundColor: preset.descriptionColor
                          }}
                        />
                        <Box
                          sx={{
                            width: 16,
                            height: 16,
                            borderRadius: '50%',
                            background: preset.cardBackgroundType === 'gradient' ? 
                              `linear-gradient(${preset.cardGradientDirection}, ${preset.cardGradientColor1}, ${preset.cardGradientColor2})` : 
                              preset.cardBackgroundColor,
                            border: `1px solid ${preset.cardBorderColor}`
                          }}
                        />
                      </Box>
                    )}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        ) : (
          <Alert severity="info" sx={{ p: 2 }}>
            В режиме разных стилей каждый раздел сайта получит собственный случайный стиль из списка. Нажмите кнопку "Случайные стили для разделов", чтобы применить эту функцию.
          </Alert>
        )}
      </Box>
      
      {styleHistory.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Divider sx={{ mb: 2 }}>
            <Chip 
              icon={<HistoryIcon />} 
              label="История стилей" 
              size="small" 
              color="primary" 
              variant="outlined" 
            />
          </Divider>
          <Box sx={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: 1,
            maxHeight: '150px',
            overflowY: 'auto',
            p: 1,
            '&::-webkit-scrollbar': {
              width: '8px',
              height: '8px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'rgba(0,0,0,0.2)',
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: 'rgba(0,0,0,0.05)',
              borderRadius: '4px',
            }
          }}>
            {styleHistory.map((styleName) => {
              const style = STYLE_PRESETS[styleName];
              if (!style) return null;
              
              return (
                <Tooltip key={styleName} title={`Применить стиль ${styleName.replace(/_/g, ' ')}`}>
                  <Chip
                    label={styleName.replace(/_/g, ' ')}
                    onClick={() => applyStyle(styleName)}
                    sx={{
                      bgcolor: style.backgroundColor,
                      color: getContrastTextColor(style.backgroundColor),
                      borderColor: style.borderColor,
                      border: '1px solid',
                      fontWeight: 'medium',
                      '&:hover': {
                        bgcolor: style.backgroundType === 'gradient' ? 
                          style.backgroundColor : 
                          style.backgroundColor,
                        opacity: 0.9
                      }
                    }}
                  />
                </Tooltip>
              );
            })}
          </Box>
        </Box>
      )}

      <Snackbar 
        open={openSnackbar} 
        autoHideDuration={4000} 
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setOpenSnackbar(false)} 
          severity="success" 
          variant="filled" 
          sx={{ width: '100%' }}
        >
          {useSameStyle
            ? `Применен стиль: ${lastAppliedStyle.replace(/_/g, ' ')}`
            : 'Применены разные стили к разным разделам сайта'
          }
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default RandomStyleSelector; 