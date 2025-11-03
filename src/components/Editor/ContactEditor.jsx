import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Grid,
  Paper,
  IconButton,
  Collapse,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { styled } from '@mui/material/styles';
import { contactPresets } from '../../utils/contactPresets';
import { STYLE_PRESETS } from '../../utils/editorStylePresets';

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

const ContactEditor = ({ contactData = {}, onContactChange, expanded, onToggle, headerData = {} }) => {
  const [selectedPreset, setSelectedPreset] = useState('');
  const [selectedQuickStyle, setSelectedQuickStyle] = useState('');
  
  const defaultContactData = {
    title: 'Свяжитесь с нами',
    description: 'Оставьте свои контактные данные, и мы свяжемся с вами в ближайшее время',
    companyName: 'Наша компания',
    address: 'г. Москва, ул. Примерная, д. 1',
    phone: '+7 (XXX) XXX-XX-XX',
    email: 'info@example.com',
    mapCoordinates: {
      lat: 55.7558,
      lng: 37.6173
    },
    // Настройки фона секции
    showBackground: true,
    backgroundType: 'solid',
    backgroundColor: '#ffffff',
    gradientColor1: '#ffffff',
    gradientColor2: '#f5f5f5',
    gradientDirection: 'to bottom',
    // Основные цвета
    titleColor: '#1565c0',
    descriptionColor: '#424242',
    companyInfoColor: '#333333',
    formVariant: 'outlined',
    infoVariant: 'elevation',
    formBackgroundColor: '#ffffff',
    infoBackgroundColor: '#ffffff',
    formBorderColor: '#1565c0',
    infoBorderColor: '#e0e0e0',
    labelColor: '#333333',
    inputBackgroundColor: '#ffffff',
    inputTextColor: '#333333',
    buttonColor: '#1565c0',
    buttonTextColor: '#ffffff',
    iconColor: '#1565c0',
    infoTitleColor: '#1565c0',
    infoTextColor: '#424242',
    thankYouMessage: 'Спасибо за обращение! Мы свяжемся с вами в ближайшее время.',
    closeButtonText: 'Закрыть'
  };

  // Эффект для синхронизации названия сайта с названием компании
  useEffect(() => {
    if (headerData && headerData.siteName) {
      handleChange('companyName', headerData.siteName);
    }
  }, [headerData?.siteName]);

  const handleChange = (field, value) => {
    console.log('🔧 CONTACT EDITOR CHANGE:', { field, value });
    console.log('📝 Previous contactData:', contactData);
    
    const newContactData = {
      ...defaultContactData,
      ...contactData,
      [field]: value
    };
    
    console.log('✨ New contactData:', newContactData);
    
    // Специальное логирование для настроек фона
    if (['showBackground', 'backgroundType', 'backgroundColor', 'gradientColor1', 'gradientColor2', 'gradientDirection'].includes(field)) {
      console.log('🎨 BACKGROUND SETTING CHANGED:');
      console.log(`🔹 Field: ${field}`);
      console.log(`🔹 New Value: ${value}`);
      console.log('🔹 Background Settings:', {
        showBackground: newContactData.showBackground,
        backgroundType: newContactData.backgroundType,
        backgroundColor: newContactData.backgroundColor,
        gradientColor1: newContactData.gradientColor1,
        gradientColor2: newContactData.gradientColor2,
        gradientDirection: newContactData.gradientDirection
      });
    }
    
    onContactChange(newContactData);
  };

  // Функция для применения пресета
  const handlePresetChange = (presetKey) => {
    if (!presetKey || Object.keys(contactPresets).length === 0) {
      return;
    }
    const preset = contactPresets[presetKey];
    if (preset) {
      console.log('🎭 APPLYING CONTACT PRESET:', presetKey);
      console.log('🎨 Preset data:', preset);
      
      setSelectedPreset(presetKey);
      // Сбрасываем быстрый стиль при выборе основного пресета
      setSelectedQuickStyle('');
      
      const newContactData = {
        ...contactData,
        ...preset,
        companyName: contactData.companyName || headerData.siteName || defaultContactData.companyName,
        address: contactData.address || defaultContactData.address,
        phone: contactData.phone || defaultContactData.phone,
        email: contactData.email || defaultContactData.email,
        mapCoordinates: contactData.mapCoordinates || defaultContactData.mapCoordinates
      };
      
      console.log('🔧 Final preset contactData:', newContactData);
      console.log('🎨 Background settings from preset:', {
        showBackground: newContactData.showBackground,
        backgroundType: newContactData.backgroundType,
        backgroundColor: newContactData.backgroundColor,
        gradientColor1: newContactData.gradientColor1,
        gradientColor2: newContactData.gradientColor2,
        gradientDirection: newContactData.gradientDirection
      });
      
      onContactChange(newContactData);
    }
  };

  // Функция для применения быстрых стилей (как в других разделах)
  const handleQuickStyleChange = (styleKey) => {
    console.log('🔥 QUICK STYLE TRIGGERED:', styleKey);
    console.log('🔥 Available STYLE_PRESETS keys:', Object.keys(STYLE_PRESETS));
    
    // Обновляем состояние выбранного быстрого стиля
    setSelectedQuickStyle(styleKey);
    
    // Если выбрано "Нет стиля" (пустая строка), ничего не делаем
    if (!styleKey) {
      console.log('📝 No quick style selected (empty value)');
      return;
    }
    
    const style = STYLE_PRESETS[styleKey];
    if (style) {
      console.log('⚡ APPLYING QUICK STYLE TO CONTACT:', styleKey);
      console.log('🎨 Quick style data:', style);
      console.log('🎨 Current contactData before:', contactData);
      
      // Сбрасываем основной пресет при выборе быстрого стиля
      setSelectedPreset('');
      
      const newContactData = {
        ...contactData,
        // Применяем основные цвета из быстрого стиля
        titleColor: style.titleColor,
        descriptionColor: style.descriptionColor,
        // Сохраняем все остальные настройки контактов
        companyName: contactData.companyName || headerData.siteName || defaultContactData.companyName,
        address: contactData.address || defaultContactData.address,
        phone: contactData.phone || defaultContactData.phone,
        email: contactData.email || defaultContactData.email,
        mapCoordinates: contactData.mapCoordinates || defaultContactData.mapCoordinates
      };
      
      console.log('🔧 Final quick style contactData:', newContactData);
      console.log('🔧 Colors applied: title =', style.titleColor, ', description =', style.descriptionColor);
      
      onContactChange(newContactData);
      
      // Дополнительная проверка через таймаут
      setTimeout(() => {
        console.log('⏰ ContactData after timeout:', contactData);
      }, 100);
    } else {
      console.error('❌ Quick style not found:', styleKey);
      console.log('❌ Available styles:', Object.keys(STYLE_PRESETS));
    }
  };

  // Эффект для определения текущего пресета при изменении цветов
  useEffect(() => {
    if (contactData) {
      const currentPreset = Object.entries(contactPresets).find(([_, preset]) => {
        return preset.titleColor === contactData.titleColor &&
               preset.descriptionColor === contactData.descriptionColor &&
               preset.formBackgroundColor === contactData.formBackgroundColor &&
               preset.formBorderColor === contactData.formBorderColor;
      });
      
      if (currentPreset) {
        setSelectedPreset(currentPreset[0]);
        // Если найден полный пресет, сбрасываем быстрый стиль
        setSelectedQuickStyle('');
      } else {
        setSelectedPreset('');
        // Если пресет не найден, проверяем соответствие быстрому стилю
        const quickStyleMatch = Object.entries(STYLE_PRESETS).find(([_, style]) => {
          return style.titleColor === contactData.titleColor &&
                 style.descriptionColor === contactData.descriptionColor;
        });
        
        if (quickStyleMatch) {
          setSelectedQuickStyle(quickStyleMatch[0]);
        } else {
          setSelectedQuickStyle('');
        }
      }
    }
  }, [contactData]);

  return (
    <Paper sx={{ 
      p: 2, 
      mb: 2,
      backgroundColor: '#f0fff0'
    }}>
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center',
          cursor: 'pointer'
        }}
        onClick={onToggle}
      >
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Настройки контактов
        </Typography>
        <ExpandMore
          expand={expanded}
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          aria-expanded={expanded}
          aria-label="show more"
          sx={{ cursor: 'pointer' }}
        >
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </ExpandMore>
      </Box>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        {/* Селектор пресетов */}
        <Box sx={{ mb: 3, mt: 2 }}>
          <FormControl fullWidth>
            <InputLabel>Готовые стили оформления</InputLabel>
            <Select
              value={selectedPreset}
              onChange={(e) => handlePresetChange(e.target.value)}
              label="Готовые стили оформления"
            >
              <MenuItem value="">
                <em>Пользовательский</em>
              </MenuItem>
              {Object.entries(contactPresets).map(([key, preset]) => (
                <MenuItem 
                  key={key} 
                  value={key}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      borderRadius: 1,
                      backgroundColor: preset.titleColor,
                      border: '2px solid',
                      borderColor: preset.formBorderColor
                    }}
                  />
                  {preset.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Быстрые стили (как в других разделах) */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>Быстрые стили</Typography>
          <FormControl fullWidth>
            <InputLabel>Выберите стиль</InputLabel>
            <Select
              label="Выберите стиль"
              value={selectedQuickStyle}
              onChange={(e) => handleQuickStyleChange(e.target.value)}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 400,
                    overflowY: 'auto'
                  }
                }
              }}
              sx={{
                '& .MuiSelect-select': {
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }
              }}
            >
              <MenuItem value="">
                <em>Нет стиля</em>
              </MenuItem>
              {Object.entries(STYLE_PRESETS).map(([key, preset]) => (
                <MenuItem 
                  key={key} 
                  value={key}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    minHeight: '48px',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.04)'
                    }
                  }}
                >
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      borderRadius: 1,
                      background: preset.cardBackgroundType === 'gradient'
                        ? `linear-gradient(${preset.cardGradientDirection}, ${preset.cardGradientColor1}, ${preset.cardGradientColor2})`
                        : preset.cardBackgroundColor,
                      border: `1px solid ${preset.borderColor}`,
                      boxShadow: preset.style.shadow
                    }}
                  />
                  <Typography>
                    {key.split('_').map(word => word.charAt(0) + word.slice(1).toLowerCase()).join(' ')}
                  </Typography>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>Основная информация</Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Заголовок"
              value={contactData.title || defaultContactData.title}
              onChange={(e) => handleChange('title', e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Описание"
              multiline
              rows={2}
              value={contactData.description || defaultContactData.description}
              onChange={(e) => handleChange('description', e.target.value)}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ mb: 1, mt: 2 }}>Контактная информация</Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Название компании"
              value={contactData.companyName || headerData.siteName || defaultContactData.companyName}
              onChange={(e) => handleChange('companyName', e.target.value)}
              helperText="Синхронизируется с названием сайта из настроек шапки"
              disabled={!!headerData.siteName}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Адрес"
              value={contactData.address || defaultContactData.address}
              onChange={(e) => handleChange('address', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Телефон"
              value={contactData.phone || defaultContactData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email"
              value={contactData.email || defaultContactData.email}
              onChange={(e) => handleChange('email', e.target.value)}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ mb: 1, mt: 2 }}>Координаты карты</Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Широта"
              type="number"
              value={contactData.mapCoordinates?.lat || defaultContactData.mapCoordinates.lat}
              onChange={(e) => handleChange('mapCoordinates', {
                ...contactData.mapCoordinates || defaultContactData.mapCoordinates,
                lat: parseFloat(e.target.value)
              })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Долгота"
              type="number"
              value={contactData.mapCoordinates?.lng || defaultContactData.mapCoordinates.lng}
              onChange={(e) => handleChange('mapCoordinates', {
                ...contactData.mapCoordinates || defaultContactData.mapCoordinates,
                lng: parseFloat(e.target.value)
              })}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ mb: 1, mt: 2 }}>Настройки стилей</Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={contactData.showBackground !== false}
                  onChange={(e) => handleChange('showBackground', e.target.checked)}
                />
              }
              label="Показывать фон секции"
            />
          </Grid>

          {contactData.showBackground !== false && (
            <>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Тип фона секции</InputLabel>
                  <Select
                    value={contactData.backgroundType || defaultContactData.backgroundType}
                    label="Тип фона секции"
                    onChange={(e) => handleChange('backgroundType', e.target.value)}
                  >
                    <MenuItem value="solid">Сплошной цвет</MenuItem>
                    <MenuItem value="gradient">Градиент</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {contactData.backgroundType === 'solid' ? (
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Цвет фона секции"
                    type="color"
                    value={contactData.backgroundColor || defaultContactData.backgroundColor}
                    onChange={(e) => handleChange('backgroundColor', e.target.value)}
                  />
                </Grid>
              ) : (
                <>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Цвет градиента 1"
                      type="color"
                      value={contactData.gradientColor1 || defaultContactData.gradientColor1}
                      onChange={(e) => handleChange('gradientColor1', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Цвет градиента 2"
                      type="color"
                      value={contactData.gradientColor2 || defaultContactData.gradientColor2}
                      onChange={(e) => handleChange('gradientColor2', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth>
                      <InputLabel>Направление градиента</InputLabel>
                      <Select
                        value={contactData.gradientDirection || defaultContactData.gradientDirection}
                        label="Направление градиента"
                        onChange={(e) => handleChange('gradientDirection', e.target.value)}
                      >
                        <MenuItem value="to bottom">Сверху вниз</MenuItem>
                        <MenuItem value="to right">Слева направо</MenuItem>
                        <MenuItem value="45deg">По диагонали (45°)</MenuItem>
                        <MenuItem value="135deg">По диагонали (135°)</MenuItem>
                        <MenuItem value="to bottom right">К нижнему правому углу</MenuItem>
                        <MenuItem value="to bottom left">К нижнему левому углу</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </>
              )}
            </>
          )}

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Цвет заголовка"
              type="color"
              value={contactData.titleColor || defaultContactData.titleColor}
              onChange={(e) => handleChange('titleColor', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Цвет описания"
              type="color"
              value={contactData.descriptionColor || defaultContactData.descriptionColor}
              onChange={(e) => handleChange('descriptionColor', e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Цвет информации о компании"
              type="color"
              value={contactData.companyInfoColor || defaultContactData.companyInfoColor}
              onChange={(e) => handleChange('companyInfoColor', e.target.value)}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ mb: 1, mt: 2 }}>Настройки формы</Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Стиль формы</InputLabel>
              <Select
                value={contactData.formVariant || defaultContactData.formVariant}
                label="Стиль формы"
                onChange={(e) => handleChange('formVariant', e.target.value)}
              >
                <MenuItem value="outlined">С обводкой</MenuItem>
                <MenuItem value="filled">Заполненный</MenuItem>
                <MenuItem value="standard">Стандартный</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Стиль информации</InputLabel>
              <Select
                value={contactData.infoVariant || defaultContactData.infoVariant}
                label="Стиль информации"
                onChange={(e) => handleChange('infoVariant', e.target.value)}
              >
                <MenuItem value="elevation">С тенью</MenuItem>
                <MenuItem value="outlined">С обводкой</MenuItem>
                <MenuItem value="plain">Плоский</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ mb: 1, mt: 2 }}>Цвета оформления</Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Цвет фона формы"
              type="color"
              value={contactData.formBackgroundColor || defaultContactData.formBackgroundColor}
              onChange={(e) => handleChange('formBackgroundColor', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Цвет фона информации"
              type="color"
              value={contactData.infoBackgroundColor || defaultContactData.infoBackgroundColor}
              onChange={(e) => handleChange('infoBackgroundColor', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Цвет обводки формы"
              type="color"
              value={contactData.formBorderColor || defaultContactData.formBorderColor}
              onChange={(e) => handleChange('formBorderColor', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Цвет обводки информации"
              type="color"
              value={contactData.infoBorderColor || defaultContactData.infoBorderColor}
              onChange={(e) => handleChange('infoBorderColor', e.target.value)}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ mb: 1, mt: 2 }}>Настройки шрифтов</Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Шрифт заголовка</InputLabel>
              <Select
                value={contactData.titleFont || defaultContactData.titleFont}
                label="Шрифт заголовка"
                onChange={(e) => handleChange('titleFont', e.target.value)}
              >
                <MenuItem value="default">Стандартный</MenuItem>
                <MenuItem value="bold">Жирный</MenuItem>
                <MenuItem value="italic">Курсив</MenuItem>
                <MenuItem value="cursive">Рукописный</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Шрифт текста</InputLabel>
              <Select
                value={contactData.textFont || defaultContactData.textFont}
                label="Шрифт текста"
                onChange={(e) => handleChange('textFont', e.target.value)}
              >
                <MenuItem value="default">Стандартный</MenuItem>
                <MenuItem value="bold">Жирный</MenuItem>
                <MenuItem value="italic">Курсив</MenuItem>
                <MenuItem value="cursive">Рукописный</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ mb: 1, mt: 2 }}>Страница спасибо</Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Текст сообщения"
              multiline
              rows={4}
              name="thankYouMessage"
              value={contactData.thankYouMessage || ''}
              onChange={(e) => handleChange('thankYouMessage', e.target.value)}
              placeholder="Введите текст сообщения, которое будет показано после отправки формы"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Название кнопки закрыть"
              name="closeButtonText"
              value={contactData.closeButtonText || 'Закрыть'}
              onChange={(e) => handleChange('closeButtonText', e.target.value)}
              placeholder="Введите текст для кнопки закрытия"
            />
          </Grid>
        </Grid>
      </Collapse>
    </Paper>
  );
};

export default ContactEditor;