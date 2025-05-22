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
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { styled } from '@mui/material/styles';
import { contactPresets } from '../../utils/contactPresets';

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
    onContactChange({
      ...defaultContactData,
      ...contactData,
      [field]: value
    });
  };

  // Функция для применения пресета
  const handlePresetChange = (presetKey) => {
    const preset = contactPresets[presetKey];
    if (preset) {
      setSelectedPreset(presetKey);
      onContactChange({
        ...contactData,
        ...preset,
        companyName: contactData.companyName || headerData.siteName || defaultContactData.companyName,
        address: contactData.address || defaultContactData.address,
        phone: contactData.phone || defaultContactData.phone,
        email: contactData.email || defaultContactData.email,
        mapCoordinates: contactData.mapCoordinates || defaultContactData.mapCoordinates
      });
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
      } else {
        setSelectedPreset('');
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