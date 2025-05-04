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
  Alert,
  Button,
  Tooltip
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { styled } from '@mui/material/styles';

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
  const [copySuccess, setCopySuccess] = useState(false);
  
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
    titleColor: '#1976d2',
    descriptionColor: '#666666',
    companyInfoColor: '#333333',
    formVariant: 'outlined',
    infoVariant: 'elevation',
    formBackgroundColor: '#ffffff',
    infoBackgroundColor: '#ffffff',
    formBorderColor: '#1976d2',
    infoBorderColor: '#1976d2',
    titleFont: 'default',
    textFont: 'default'
  };

  // Эффект для синхронизации названия сайта с названием компании
  useEffect(() => {
    if (headerData && headerData.siteName) {
      // Если есть название сайта в headerData, обновляем название компании
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
  
  // Шаблон промпта для раздела "Свяжитесь с нами"
  const contactPromptTemplate = `Контакты

(Мы ценим каждого клиента и готовы оказать профессиональную юридическую поддержку. Наши специалисты всегда на связи и оперативно ответят на все ваши вопросы)

Адрес  
г. Санкт-Петербург, Невский проспект, д. 20, офис 101

Телефон  
+7 (812) 123-45-67

Email  
info@vashepravo.ru`;

  const copyPromptToClipboard = () => {
    navigator.clipboard.writeText(contactPromptTemplate);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 3000);
  };

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
        {/* Блок с промптом для генерации контактной информации */}
        <Box sx={{ mb: 3, mt: 2, p: 2, bgcolor: '#e3f2fd', borderRadius: 1 }}>
          <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
            Шаблон для генерации контактной информации
          </Typography>
          <Typography variant="body2" sx={{ mb: 2, whiteSpace: 'pre-line' }}>
            {contactPromptTemplate}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Tooltip title="Копировать в буфер обмена">
              <Button 
                startIcon={<ContentCopyIcon />} 
                size="small" 
                onClick={copyPromptToClipboard}
                variant="outlined"
              >
                Копировать шаблон
              </Button>
            </Tooltip>
          </Box>
          {copySuccess && (
            <Alert severity="success" sx={{ mt: 1 }}>
              Шаблон скопирован в буфер обмена
            </Alert>
          )}
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
        </Grid>
      </Collapse>
    </Paper>
  );
};

export default ContactEditor; 