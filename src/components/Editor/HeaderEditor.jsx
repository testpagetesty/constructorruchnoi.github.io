import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button,
  IconButton,
  Grid,
  Paper,
  Stack,
  useTheme,
  useMediaQuery,
  Collapse,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  FormControlLabel,
  Switch,
  Slider
} from '@mui/material';
import { 
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Image as ImageIcon
} from '@mui/icons-material';
import ColorPicker from '../ColorPicker/ColorPicker';
import ConfigLoader from '../ConfigLoader/ConfigLoader';
import { styled } from '@mui/material/styles';
import imageCompression from 'browser-image-compression';
import { imageCacheService } from '../../utils/imageCacheService';

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

const HeaderEditor = ({ 
  headerData, 
  onHeaderChange,
  sectionsData,
  onSectionsChange,
  heroData,
  expanded,
  onToggle
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const fileInputRef = useRef(null);
  const [showLanguageWarning, setShowLanguageWarning] = useState(false);

  // Инициализация заголовка при первом рендере
  useEffect(() => {
    if (!headerData.title && headerData.siteName) {
      onHeaderChange({ ...headerData, title: headerData.siteName });
    }
  }, []);

  // Синхронизация описания с подзаголовком hero секции
  useEffect(() => {
    if (heroData?.subtitle) {
      onHeaderChange({ ...headerData, description: heroData.subtitle });
    }
  }, [heroData?.subtitle]);

  // Проверка языка при размонтировании компонента
  useEffect(() => {
    return () => {
      const languageValue = typeof headerData.language === 'string' ? headerData.language.trim() : '';
      if (!languageValue) {
        setShowLanguageWarning(true);
        // Предотвращаем размонтирование, если язык не указан
        const event = new CustomEvent('preventNavigation', {
          detail: { message: 'Пожалуйста, укажите код языка перед сохранением' }
        });
        window.dispatchEvent(event);
      }
    };
  }, [headerData.language]);

  const handleConfigLoaded = (config) => {
    if (config.header) {
      onHeaderChange(config.header);
    }
  };

  const handleSaveConfig = () => {
    const config = {
      header: headerData
    };
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'site-config.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleChange = (field, value) => {
    onHeaderChange({ ...headerData, [field]: value });

    // Обновление превью при изменении настроек
    const previewArea = document.querySelector('.preview-area');
    if (previewArea) {
      const backgroundImage = previewArea.querySelector('.background-image');
      if (backgroundImage) {
        if (field === 'siteBackgroundBlur') {
          backgroundImage.style.filter = `blur(${value}px)`;
        } else if (field === 'siteBackgroundDarkness') {
          const overlay = previewArea.querySelector('.site-overlay');
          if (overlay) {
            overlay.style.backgroundColor = `rgba(0, 0, 0, ${value / 100})`;
          }
        }
      }
    }
  };

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      console.log('Начало обработки файла:', file.name);
      
      // Проверка формата
      if (!file.type.startsWith('image/')) {
        throw new Error('Пожалуйста, выберите изображение');
      }

      // Сжатие изображения
      const compressedFile = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true
      });

      // Конвертация в Blob
      const blob = new Blob([compressedFile], { type: 'image/jpeg' });
      
      // Всегда используем fon.jpg как имя файла
      const filename = 'fon.jpg';

      // Сохранение в кеш
      await imageCacheService.saveImage(filename, blob);

      // Создание URL для превью
      const imageUrl = URL.createObjectURL(blob);
      
      // Обновляем путь к изображению в данных шапки
      onHeaderChange({ 
        ...headerData, 
        siteBackgroundImage: `assets/images/${filename}`
      });

      // Сохранение метаданных изображения
      const imageMetadata = {
        filename,
        type: 'image/jpeg',
        size: blob.size,
        lastModified: new Date().toISOString()
      };

      // Сохранение метаданных в localStorage
      localStorage.setItem('siteBackgroundMetadata', JSON.stringify(imageMetadata));

      // Показываем уведомление
      alert('Фоновое изображение успешно обработано и сохранено в кеш');

      // Обновляем превью
      const previewArea = document.querySelector('.preview-area');
      if (previewArea) {
        // Удаляем существующий фон
        const existingBackground = previewArea.querySelector('.background-image');
        if (existingBackground) {
          existingBackground.remove();
        }

        // Создаем новый элемент фона
        const backgroundImage = document.createElement('div');
        backgroundImage.className = 'background-image';
        backgroundImage.style.position = 'absolute';
        backgroundImage.style.top = '0';
        backgroundImage.style.left = '0';
        backgroundImage.style.right = '0';
        backgroundImage.style.bottom = '0';
        backgroundImage.style.background = `url(${imageUrl}) no-repeat center center fixed`;
        backgroundImage.style.backgroundSize = 'cover';
        backgroundImage.style.zIndex = '-2';

        // Применяем размытие
        if (headerData.siteBackgroundBlur > 0) {
          backgroundImage.style.filter = `blur(${headerData.siteBackgroundBlur}px)`;
        }

        previewArea.appendChild(backgroundImage);

        // Обновляем или создаем оверлей
        let overlay = previewArea.querySelector('.site-overlay');
        if (headerData.siteBackgroundDarkness > 0) {
          if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'site-overlay';
            overlay.style.position = 'absolute';
            overlay.style.top = '0';
            overlay.style.left = '0';
            overlay.style.right = '0';
            overlay.style.bottom = '0';
            overlay.style.zIndex = '-1';
            previewArea.appendChild(overlay);
          }
          overlay.style.backgroundColor = `rgba(0, 0, 0, ${headerData.siteBackgroundDarkness / 100})`;
        } else if (overlay) {
          overlay.remove();
        }
      }

      // Проверяем, что изображение действительно загрузилось
      const img = new Image();
      img.onload = () => {
        console.log('Фоновое изображение успешно загружено в превью');
      };
      img.onerror = () => {
        throw new Error('Ошибка при загрузке изображения');
      };
      img.src = imageUrl;
    } catch (error) {
      console.error('Ошибка при загрузке:', error);
      alert('Ошибка при загрузке изображения: ' + error.message);
    }
  };

  const handleFaviconUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      // Проверка формата
      if (!file.type.startsWith('image/')) {
        throw new Error('Пожалуйста, выберите изображение');
      }

      // Сжатие изображения
      const compressedFile = await imageCompression(file, {
        maxSizeMB: 0.1, // Favicon должен быть маленьким
        maxWidthOrHeight: 32, // Стандартный размер favicon
        useWebWorker: true
      });

      // Конвертация в Blob
      const blob = new Blob([compressedFile], { type: 'image/png' });
      
      // Всегда используем Favicon.png как имя файла
      const filename = 'Favicon.png';

      // Сохранение в кеш
      await imageCacheService.saveImage(filename, blob);

      // Создание URL для превью
      const imageUrl = URL.createObjectURL(blob);

      // Обновляем favicon в DOM
      const faviconLink = document.querySelector("link[rel*='icon']") || document.createElement('link');
      faviconLink.type = 'image/png';
      faviconLink.rel = 'shortcut icon';
      faviconLink.href = imageUrl;
      document.getElementsByTagName('head')[0].appendChild(faviconLink);

      // Сохранение метаданных изображения
      const imageMetadata = {
        filename,
        type: 'image/png',
        size: blob.size,
        lastModified: new Date().toISOString()
      };

      // Сохранение метаданных в localStorage
      localStorage.setItem('faviconMetadata', JSON.stringify(imageMetadata));

      // Показываем уведомление
      alert('Favicon успешно обработан и сохранен в кеш');
    } catch (error) {
      console.error('Ошибка при обработке favicon:', error);
      alert('Ошибка при обработке favicon: ' + error.message);
    }
  };

  // Проверка языка при попытке свернуть секцию
  const handleToggle = () => {
    // Если секция разворачивается, просто разворачиваем
    if (!expanded) {
      onToggle();
      return;
    }

    // Если секция сворачивается, проверяем язык
    const languageValue = typeof headerData.language === 'string' ? headerData.language.trim() : '';
    if (!languageValue) {
      setShowLanguageWarning(true);
      return;
    }
    setShowLanguageWarning(false);
    onToggle();
  };

  // Проверка языка при изменении
  const handleLanguageChange = (e) => {
    const value = e.target.value.toLowerCase().trim();
    // Проверяем, что введен корректный код языка (2 буквы)
    if (value.length <= 2 && /^[a-z]*$/.test(value)) {
      onHeaderChange({ 
        ...headerData, 
        language: value || null 
      });
      // Показываем предупреждение, если поле пустое
      setShowLanguageWarning(value === '');
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
        <ConfigLoader onConfigLoaded={handleConfigLoaded} />
        
        <Button 
          variant="contained" 
          onClick={handleSaveConfig}
          sx={{ ml: 2, component: 'label', height: '48px' }}
        >
          Сохранить конфигурацию
        </Button>
      </Box>

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
          onClick={handleToggle}
        >
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Настройки шапки
          </Typography>
          <ExpandMore
            expand={expanded}
            onClick={(e) => {
              e.stopPropagation();
              handleToggle();
            }}
            aria-expanded={expanded}
            aria-label="show more"
            sx={{ cursor: 'pointer' }}
          >
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </ExpandMore>
        </Box>
        
        {showLanguageWarning && (
          <Typography 
            color="error" 
            sx={{ 
              mt: 1, 
              p: 1, 
              backgroundColor: 'rgba(255, 0, 0, 0.1)',
              borderRadius: 1
            }}
          >
            Пожалуйста, укажите код языка перед сохранением
          </Typography>
        )}
        
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <Box sx={{ p: 2 }}>
            {/* Группа настроек оформления шапки */}
            <Paper sx={{ p: 2, bgcolor: '#e3f2fd', borderRadius: 1, mb: 2, boxShadow: 2 }}>
              <Typography variant="h6" sx={{ mb: 2, color: '#1565c0', borderBottom: '2px solid #1565c0', pb: 1 }}>Оформление шапки</Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Название сайта"
                    value={headerData.siteName}
                    onChange={(e) => {
                      const newSiteName = e.target.value;
                      onHeaderChange({ 
                        ...headerData, 
                        siteName: newSiteName,
                        // Если заголовок страницы не был изменен вручную, обновляем его вместе с названием сайта
                        title: headerData.title === headerData.siteName ? newSiteName : headerData.title
                      });
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Title"
                    value={headerData.title || headerData.siteName}
                    onChange={(e) => onHeaderChange({ ...headerData, title: e.target.value })}
                    placeholder={headerData.siteName}
                    helperText="(по умолчанию берется из названия сайта)"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    value={heroData?.subtitle || headerData.description || "Наш сайт предлагает лучшие решения"}
                    onChange={(e) => {
                      const newDescription = e.target.value;
                      onHeaderChange({ ...headerData, description: newDescription });
                    }}
                    multiline
                    rows={2}
                    placeholder="Наш сайт предлагает лучшие решения"
                    helperText="(по умолчанию берется из описания страницы hero)"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Код языка (ISO 639-1)"
                    value={typeof headerData.language === 'string' ? headerData.language : ''}
                    onChange={handleLanguageChange}
                    helperText="Введите двухбуквенный код языка по стандарту ISO 639-1"
                    inputProps={{
                      maxLength: 2,
                      pattern: '[a-zA-Z]{2}'
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'red',
                        },
                        '&:hover fieldset': {
                          borderColor: 'red',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: 'red',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: 'red',
                        '&.Mui-focused': {
                          color: 'red',
                        },
                        '&.Mui-shrink': {
                          color: 'red',
                        }
                      },
                      '& .MuiHelperText-root': {
                        color: 'red',
                      }
                    }}
                    InputLabelProps={{
                      shrink: true,
                      sx: {
                        position: 'absolute',
                        top: '-8px',
                        left: '14px',
                        backgroundColor: 'white',
                        padding: '0 4px'
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box>
                    <Typography variant="body2" sx={{ mb: 1, color: '#1565c0' }}>Цвет заголовка</Typography>
                    <input
                      type="color"
                      value={headerData.titleColor}
                      onChange={(e) => onHeaderChange({ ...headerData, titleColor: e.target.value })}
                      style={{ width: '100%', height: '40px', borderRadius: '4px' }}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box>
                    <Typography variant="body2" sx={{ mb: 1, color: '#1565c0' }}>Цвет фона шапки</Typography>
                    <input
                      type="color"
                      value={headerData.backgroundColor}
                      onChange={(e) => onHeaderChange({ ...headerData, backgroundColor: e.target.value })}
                      style={{ width: '100%', height: '40px', borderRadius: '4px' }}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box>
                    <Typography variant="body2" sx={{ mb: 1, color: '#1565c0' }}>Цвет ссылок</Typography>
                    <input
                      type="color"
                      value={headerData.linksColor}
                      onChange={(e) => onHeaderChange({ ...headerData, linksColor: e.target.value })}
                      style={{ width: '100%', height: '40px', borderRadius: '4px' }}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ mt: 2 }}>
                    <Button
                      variant="outlined"
                      component="label"
                      startIcon={<ImageIcon />}
                      fullWidth
                    >
                      Загрузить Favicon
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleFaviconUpload}
                      />
                    </Button>
                    <Typography variant="caption" sx={{ display: 'block', mt: 1, color: 'text.secondary' }}>
                      Рекомендуемый размер: 32x32 пикселей, формат PNG
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>

            {/* Группа настроек фона сайта */}
            <Paper sx={{ p: 2, bgcolor: '#e8f5e9', borderRadius: 1, boxShadow: 2 }}>
              <Typography variant="h6" sx={{ mb: 2, color: '#2e7d32', borderBottom: '2px solid #2e7d32', pb: 1 }}>Оформление фона сайта</Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Тип фона</InputLabel>
                    <Select
                      value={headerData.siteBackgroundType}
                      onChange={(e) => onHeaderChange({ ...headerData, siteBackgroundType: e.target.value })}
                      label="Тип фона"
                    >
                      <MenuItem value="solid">Сплошной цвет</MenuItem>
                      <MenuItem value="gradient">Градиент</MenuItem>
                      <MenuItem value="image">Изображение</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                {headerData.siteBackgroundType === 'solid' && (
                  <Grid item xs={12}>
                    <Box>
                      <Typography variant="body2" sx={{ mb: 1, color: '#2e7d32' }}>Цвет фона</Typography>
                      <input
                        type="color"
                        value={headerData.siteBackgroundColor}
                        onChange={(e) => onHeaderChange({ ...headerData, siteBackgroundColor: e.target.value })}
                        style={{ width: '100%', height: '40px', borderRadius: '4px' }}
                      />
                    </Box>
                  </Grid>
                )}

                {headerData.siteBackgroundType === 'gradient' && (
                  <>
                    <Grid item xs={12} sm={6}>
                      <Box>
                        <Typography variant="body2" sx={{ mb: 1, color: '#2e7d32' }}>Первый цвет градиента</Typography>
                        <input
                          type="color"
                          value={headerData.siteGradientColor1}
                          onChange={(e) => onHeaderChange({ ...headerData, siteGradientColor1: e.target.value })}
                          style={{ width: '100%', height: '40px', borderRadius: '4px' }}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Box>
                        <Typography variant="body2" sx={{ mb: 1, color: '#2e7d32' }}>Второй цвет градиента</Typography>
                        <input
                          type="color"
                          value={headerData.siteGradientColor2}
                          onChange={(e) => onHeaderChange({ ...headerData, siteGradientColor2: e.target.value })}
                          style={{ width: '100%', height: '40px', borderRadius: '4px' }}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl fullWidth>
                        <InputLabel>Направление градиента</InputLabel>
                        <Select
                          value={headerData.siteGradientDirection}
                          onChange={(e) => onHeaderChange({ ...headerData, siteGradientDirection: e.target.value })}
                          label="Направление градиента"
                        >
                          <MenuItem value="to right">Слева направо</MenuItem>
                          <MenuItem value="to left">Справа налево</MenuItem>
                          <MenuItem value="to bottom">Сверху вниз</MenuItem>
                          <MenuItem value="to top">Снизу вверх</MenuItem>
                          <MenuItem value="to bottom right">По диагонали</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </>
                )}

                {headerData.siteBackgroundType === 'image' && (
                  <>
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                        <Button
                          variant="contained"
                          startIcon={<ImageIcon />}
                          onClick={() => fileInputRef.current.click()}
                          sx={{ minWidth: '200px' }}
                        >
                          Выбрать изображение
                        </Button>
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: 'none' }}
                          ref={fileInputRef}
                          onChange={handleFileSelect}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Box>
                        <Typography variant="body2" sx={{ mb: 1, color: '#2e7d32' }}>Размытие фона</Typography>
                        <Slider
                          value={headerData.siteBackgroundBlur || 0}
                          onChange={(e, value) => onHeaderChange({ ...headerData, siteBackgroundBlur: value })}
                          min={0}
                          max={20}
                          step={1}
                          valueLabelDisplay="auto"
                          sx={{ color: '#2e7d32' }}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Box>
                        <Typography variant="body2" sx={{ mb: 1, color: '#2e7d32' }}>Затемнение фона</Typography>
                        <Slider
                          value={headerData.siteBackgroundDarkness || 0}
                          onChange={(e, value) => onHeaderChange({ ...headerData, siteBackgroundDarkness: value })}
                          min={0}
                          max={100}
                          step={5}
                          valueLabelDisplay="auto"
                          sx={{ color: '#2e7d32' }}
                        />
                      </Box>
                    </Grid>
                  </>
                )}
              </Grid>
            </Paper>
          </Box>
        </Collapse>
      </Paper>
    </Box>
  );
};

export default HeaderEditor; 