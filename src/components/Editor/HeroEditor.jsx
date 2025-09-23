import React, { useRef, useEffect } from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Typography,
  IconButton,
  Stack,
  Slider,
  Switch,
  FormControlLabel,
  Grid,
  Collapse,
  Divider,
  Button
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ImageIcon from '@mui/icons-material/Image';
import ColorPicker from '../ColorPicker/ColorPicker';
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

const HERO_BACKGROUND_TYPES = {
  SOLID: 'solid',
  GRADIENT: 'gradient',
  IMAGE: 'image'
};

const HERO_BACKGROUND_LABELS = {
  [HERO_BACKGROUND_TYPES.SOLID]: 'Сплошной цвет',
  [HERO_BACKGROUND_TYPES.GRADIENT]: 'Градиент',
  [HERO_BACKGROUND_TYPES.IMAGE]: 'Изображение'
};

const ANIMATION_TYPES = {
  NONE: 'none',
  ZOOM: 'zoom',
  PAN: 'pan',
  FADE: 'fade',
  PULSE: 'pulse'
};

const ANIMATION_LABELS = {
  [ANIMATION_TYPES.NONE]: 'Без анимации',
  [ANIMATION_TYPES.ZOOM]: 'Масштабирование',
  [ANIMATION_TYPES.PAN]: 'Панорамирование',
  [ANIMATION_TYPES.FADE]: 'Затухание',
  [ANIMATION_TYPES.PULSE]: 'Пульсация'
};

const SECTIONS_DISPLAY_MODES = {
  CARDS: 'cards'
};

const SECTIONS_DISPLAY_LABELS = {
  [SECTIONS_DISPLAY_MODES.CARDS]: 'Карточки'
};

const HeroEditor = ({ heroData = {}, onHeroChange, expanded, onToggle, sectionsData = {} }) => {
  const defaultHeroData = {
    title: 'Добро пожаловать',
    subtitle: 'Наш сайт предлагает лучшие решения',
    backgroundType: 'solid',
    backgroundColor: '#ffffff',
    gradientColor1: '#ffffff',
    gradientColor2: '#f5f5f5',
    gradientDirection: 'to right',
    backgroundImage: '',
    titleColor: '#000000',
    subtitleColor: '#666666',
    animationType: 'none',
    enableOverlay: false,
    overlayOpacity: 0.1,
    enableBlur: false,
    blurAmount: 0.1,
    // Новые поля для настройки главной страницы
    homePageSettings: {
      showFeaturedSection: true,
      featuredSectionId: '', // Будет автоматически выбран первый доступный раздел
      showSectionsPreview: true,
      sectionsDisplayMode: 'cards',
      maxSectionsToShow: 6,
      sectionsOrder: [],
      showContactPreview: true
    }
  };

  const fileInputRef = useRef(null);

  // Принудительное обновление при изменении sectionsData
  const [forceUpdate, setForceUpdate] = React.useState(0);
  React.useEffect(() => {
    console.log('🔄 [HeroEditor] sectionsData изменился, принудительно обновляем');
    console.log('📊 sectionsData keys:', Object.keys(sectionsData || {}));
    console.log('📊 sectionsData length:', Object.keys(sectionsData || {}).length);
    console.log('📊 showFeaturedSection:', heroData.homePageSettings?.showFeaturedSection);
    
    // Автоматически выбираем первый раздел, если ничего не выбрано и есть доступные разделы
    if (sectionsData && Object.keys(sectionsData).length > 0) {
      const currentFeaturedId = heroData.homePageSettings?.featuredSectionId || '';
      const availableSections = Object.keys(sectionsData);
      
      // Если ничего не выбрано или выбранный раздел больше не существует
      if (!currentFeaturedId || !availableSections.includes(currentFeaturedId)) {
        const firstSectionId = availableSections[0];
        console.log('🎯 Автоматически выбираем первый раздел:', firstSectionId);
        
        // Обновляем featuredSectionId через onHeroChange
        const updatedHomePageSettings = {
          ...heroData.homePageSettings,
          featuredSectionId: firstSectionId
        };
        
        onHeroChange({
          ...heroData,
          homePageSettings: updatedHomePageSettings
        });
      }
    }
    
    setForceUpdate(prev => prev + 1);
  }, [sectionsData, heroData.homePageSettings?.showFeaturedSection]);

  const handleChange = (field, value) => {
    console.log('HeroEditor handleChange:', field, value);
    console.log('Current heroData:', heroData);
    
    if (field === 'backgroundImage' && value) {
      // Убедимся, что URL начинается с /assets/images/
      if (!value.startsWith('/assets/images/')) {
        console.warn('Image URL should start with /assets/images/');
        value = `/assets/images/${value}`;
      }
    }
    
    // Обработка вложенных полей homePageSettings
    if (field.startsWith('homePageSettings.')) {
      const subField = field.split('.')[1];
      console.log('Updating homePageSettings:', subField, value);
      const newHomePageSettings = {
        ...defaultHeroData.homePageSettings,
        ...heroData.homePageSettings,
        [subField]: value
      };
      console.log('New homePageSettings:', newHomePageSettings);
      
      onHeroChange({
        ...defaultHeroData,
        ...heroData,
        homePageSettings: newHomePageSettings
      });
    } else {
      onHeroChange({
        ...defaultHeroData,
        ...heroData,
        [field]: value
      });
    }

    // Обновление превью при изменении настроек
    const previewHero = document.querySelector('#hero');
    if (previewHero) {
      // Обновление размытия
      const heroOverlay = previewHero.querySelector('.hero-overlay');
      if (heroOverlay) {
        if (field === 'enableBlur') {
          heroOverlay.style.backdropFilter = value ? `blur(${heroData.blurAmount || 0.1}px)` : 'none';
        } else if (field === 'blurAmount') {
          heroOverlay.style.backdropFilter = heroData.enableBlur ? `blur(${value}px)` : 'none';
        }
      }

      // Обновление оверлея
      if (field === 'enableOverlay') {
        if (value) {
          if (!heroOverlay) {
            const overlay = document.createElement('div');
            overlay.className = 'hero-overlay';
            overlay.style.position = 'absolute';
            overlay.style.top = '0';
            overlay.style.left = '0';
            overlay.style.right = '0';
            overlay.style.bottom = '0';
            overlay.style.zIndex = '1';
            overlay.style.pointerEvents = 'none'; // Чтобы оверлей не блокировал взаимодействие
            previewHero.style.position = 'relative'; // Убедимся, что hero имеет position: relative
            previewHero.appendChild(overlay);
          }
        } else if (heroOverlay) {
          heroOverlay.remove();
        }
      } else if (field === 'overlayOpacity' && heroOverlay) {
        heroOverlay.style.backgroundColor = `rgba(0, 0, 0, ${value / 100})`;
      }
    }
  };

  const processImage = async (file) => {
    try {
      // Сжатие изображения
      const compressedFile = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true
      });

      // Конвертация в Blob
      const blob = new Blob([compressedFile], { type: 'image/jpeg' });
      
      // Всегда используем hero.jpg как имя файла
      const filename = 'hero.jpg';

      // Сохранение в кэш
      await imageCacheService.saveImage(filename, blob);

      // Создание URL для превью
      const url = URL.createObjectURL(blob);

      // Сохранение метаданных изображения
      const imageMetadata = {
        filename,
        type: 'image/jpeg',
        size: blob.size,
        lastModified: new Date().toISOString()
      };

      // Сохранение метаданных в кэш
      await imageCacheService.saveMetadata('heroImageMetadata', imageMetadata);
      console.log('✓ Метаданные hero изображения сохранены в кэш:', imageMetadata);

      return { url, filename, blob };
    } catch (error) {
      console.error('Ошибка при обработке изображения:', error);
      throw error;
    }
  };

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      // Проверка формата
      if (!file.type.startsWith('image/')) {
        throw new Error('Пожалуйста, выберите изображение');
      }

      const { url, filename, blob } = await processImage(file);

      // Обновление данных hero
      handleChange('backgroundImage', `/assets/images/${filename}`);

      // Сохранение метаданных изображения
      const imageMetadata = {
        filename,
        type: file.type,
        size: blob.size,
        lastModified: new Date().toISOString()
      };

      // Сохранение метаданных в кэш вместо localStorage
      await imageCacheService.saveMetadata('heroImageMetadata', imageMetadata);
      console.log('✓ Метаданные hero изображения сохранены в кэш:', imageMetadata);

      // Показ уведомления
      alert('Изображение успешно обработано и сохранено в кэш');

      // Принудительное обновление превью
      const heroImage = document.querySelector('.hero-background');
      if (heroImage) {
        heroImage.style.backgroundImage = `url(${url})`;
      }

      // Обновление превью на странице
      const previewHero = document.querySelector('#hero');
      if (previewHero) {
        // Обновляем фоновое изображение
        previewHero.style.backgroundImage = `url(${url})`;
        
        // Создаем или обновляем оверлей
        let heroOverlay = previewHero.querySelector('.hero-overlay');
        if (!heroOverlay) {
          heroOverlay = document.createElement('div');
          heroOverlay.className = 'hero-overlay';
          heroOverlay.style.position = 'absolute';
          heroOverlay.style.top = '0';
          heroOverlay.style.left = '0';
          heroOverlay.style.right = '0';
          heroOverlay.style.bottom = '0';
          heroOverlay.style.zIndex = '1';
          heroOverlay.style.pointerEvents = 'none'; // Чтобы оверлей не блокировал взаимодействие
          previewHero.style.position = 'relative'; // Убедимся, что hero имеет position: relative
          previewHero.appendChild(heroOverlay);
        }

        // Применяем размытие и оверлей
        if (heroData.enableBlur) {
          heroOverlay.style.backdropFilter = `blur(${heroData.blurAmount || 0.1}px)`;
        } else {
          heroOverlay.style.backdropFilter = 'none';
        }

        if (heroData.enableOverlay) {
          heroOverlay.style.backgroundColor = `rgba(0, 0, 0, ${heroData.overlayOpacity / 100})`;
        } else {
          heroOverlay.style.backgroundColor = 'transparent';
        }
      }

      // Принудительное обновление компонента
      setTimeout(() => {
        const event = new CustomEvent('heroImageUpdated', {
          detail: { 
            imageUrl: url,
            blur: heroData.enableBlur ? heroData.blurAmount : 0,
            overlay: heroData.enableOverlay ? heroData.overlayOpacity : 0
          }
        });
        window.dispatchEvent(event);
      }, 100);
    } catch (error) {
      console.error('Ошибка при загрузке:', error);
      alert('Ошибка при обработке изображения: ' + error.message);
    }
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
          Настройка hero
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
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>Основные настройки</Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              size="small"
              label="Заголовок"
              value={heroData.title || defaultHeroData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              margin="dense"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              size="small"
              label="Подзаголовок"
              value={heroData.subtitle || defaultHeroData.subtitle}
              onChange={(e) => handleChange('subtitle', e.target.value)}
              margin="dense"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Цвет заголовка"
              type="color"
              value={heroData.titleColor || defaultHeroData.titleColor}
              onChange={(e) => handleChange('titleColor', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Цвет подзаголовка"
              type="color"
              value={heroData.subtitleColor || defaultHeroData.subtitleColor}
              onChange={(e) => handleChange('subtitleColor', e.target.value)}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ mb: 1, mt: 2 }}>Настройки фона</Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth size="small">
              <InputLabel>Тип фона</InputLabel>
              <Select
                value={heroData.backgroundType || defaultHeroData.backgroundType}
                label="Тип фона"
                onChange={(e) => handleChange('backgroundType', e.target.value)}
              >
                <MenuItem value="solid">Сплошной цвет</MenuItem>
                <MenuItem value="gradient">Градиент</MenuItem>
                <MenuItem value="image">Изображение</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {heroData.backgroundType === 'solid' && (
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Цвет фона"
                type="color"
                value={heroData.backgroundColor || defaultHeroData.backgroundColor}
                onChange={(e) => handleChange('backgroundColor', e.target.value)}
              />
            </Grid>
          )}

          {heroData.backgroundType === 'gradient' && (
            <>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Цвет 1"
                  type="color"
                  value={heroData.gradientColor1 || defaultHeroData.gradientColor1}
                  onChange={(e) => handleChange('gradientColor1', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Цвет 2"
                  type="color"
                  value={heroData.gradientColor2 || defaultHeroData.gradientColor2}
                  onChange={(e) => handleChange('gradientColor2', e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth size="small">
                  <InputLabel>Направление градиента</InputLabel>
                  <Select
                    value={heroData.gradientDirection || defaultHeroData.gradientDirection}
                    label="Направление градиента"
                    onChange={(e) => handleChange('gradientDirection', e.target.value)}
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

          {heroData.backgroundType === 'image' && (
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
          )}

          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ mb: 1, mt: 2 }}>Настройки изображения</Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography sx={{ mr: 2 }}>Наложение</Typography>
              <FormControl size="small">
                <Select
                  value={heroData.enableOverlay ? 'true' : 'false'}
                  onChange={(e) => handleChange('enableOverlay', e.target.value === 'true')}
                >
                  <MenuItem value="true">Включено</MenuItem>
                  <MenuItem value="false">Выключено</MenuItem>
                </Select>
              </FormControl>
            </Box>
            {heroData.enableOverlay && (
              <Box sx={{ mb: 2 }}>
                <Typography gutterBottom>Прозрачность наложения</Typography>
                <Slider
                  value={heroData.overlayOpacity || 0.1}
                  onChange={(e, value) => handleChange('overlayOpacity', value)}
                  min={0.1}
                  max={100}
                  step={0.1}
                  marks={[
                    { value: 0.1, label: '0.1%' },
                    { value: 20, label: '20%' },
                    { value: 40, label: '40%' },
                    { value: 60, label: '60%' },
                    { value: 80, label: '80%' },
                    { value: 100, label: '100%' }
                  ]}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) => `${value}%`}
                  sx={{
                    mt: 2,
                    mb: 3,
                    '& .MuiSlider-mark': {
                      height: 8,
                      width: 2,
                      backgroundColor: '#1976d2',
                    },
                    '& .MuiSlider-markLabel': {
                      fontSize: '12px',
                      color: '#666',
                      fontWeight: 500,
                      marginTop: '8px',
                      transform: 'translateX(-50%)',
                      whiteSpace: 'nowrap',
                      width: 'auto',
                      textAlign: 'center',
                    },
                    '& .MuiSlider-valueLabel': {
                      fontSize: '12px',
                      fontWeight: 500,
                      backgroundColor: '#1976d2',
                    }
                  }}
                />
              </Box>
            )}
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography sx={{ mr: 2 }}>Размытие</Typography>
              <FormControl size="small">
                <Select
                  value={heroData.enableBlur ? 'true' : 'false'}
                  onChange={(e) => handleChange('enableBlur', e.target.value === 'true')}
                >
                  <MenuItem value="true">Включено</MenuItem>
                  <MenuItem value="false">Выключено</MenuItem>
                </Select>
              </FormControl>
            </Box>
            {heroData.enableBlur && (
              <Box>
                <Typography gutterBottom>Интенсивность размытия</Typography>
                <Slider
                  value={heroData.blurAmount || 0.1}
                  onChange={(e, value) => handleChange('blurAmount', value)}
                  min={0.1}
                  max={10}
                  step={0.1}
                  marks={[
                    { value: 0.1, label: '0.1' },
                    { value: 1, label: '1' },
                    { value: 3, label: '3' },
                    { value: 6, label: '6' },
                    { value: 10, label: '10' }
                  ]}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) => `${value}px`}
                  sx={{
                    mt: 2,
                    mb: 3,
                    '& .MuiSlider-mark': {
                      height: 8,
                      width: 2,
                      backgroundColor: '#1976d2',
                    },
                    '& .MuiSlider-markLabel': {
                      fontSize: '12px',
                      color: '#666',
                      fontWeight: 500,
                      marginTop: '8px',
                      transform: 'translateX(-50%)',
                      whiteSpace: 'nowrap',
                      width: 'auto',
                      textAlign: 'center',
                    },
                    '& .MuiSlider-valueLabel': {
                      fontSize: '12px',
                      fontWeight: 500,
                      backgroundColor: '#1976d2',
                    }
                  }}
                />
              </Box>
            )}
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth size="small">
              <InputLabel>Тип анимации</InputLabel>
              <Select
                value={heroData.animationType || defaultHeroData.animationType}
                label="Тип анимации"
                onChange={(e) => handleChange('animationType', e.target.value)}
              >
                <MenuItem value="none">Без анимации</MenuItem>
                <MenuItem value="fade">Появление</MenuItem>
                <MenuItem value="slide">Слайд</MenuItem>
                <MenuItem value="zoom">Увеличение</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Настройки главной страницы */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ mb: 1, mt: 2 }}>Настройки главной страницы</Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={heroData.homePageSettings?.showFeaturedSection ?? defaultHeroData.homePageSettings.showFeaturedSection}
                  onChange={(e) => handleChange('homePageSettings.showFeaturedSection', e.target.checked)}
                />
              }
              label="Показывать выделенный раздел"
            />
          </Grid>

          {(heroData.homePageSettings?.showFeaturedSection ?? defaultHeroData.homePageSettings.showFeaturedSection) && (
            <Grid item xs={12}>
              <FormControl fullWidth size="small">
                <InputLabel>Выделенный раздел</InputLabel>
                <Select
                  value={heroData.homePageSettings?.featuredSectionId || ''}
                  label="Выделенный раздел"
                  onChange={(e) => handleChange('homePageSettings.featuredSectionId', e.target.value)}
                >
                  {sectionsData && Object.keys(sectionsData).length > 0 ? (
                    Object.entries(sectionsData).map(([sectionId, sectionData], index) => (
                      <MenuItem key={sectionId} value={sectionId}>
                        {sectionData.title || sectionId}
                        {index === 0 && ' (выбран по умолчанию)'}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem value="" disabled>
                      Нет доступных разделов
                    </MenuItem>
                  )}
                </Select>
              </FormControl>
            </Grid>
          )}

          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={heroData.homePageSettings?.showSectionsPreview ?? defaultHeroData.homePageSettings.showSectionsPreview}
                  onChange={(e) => handleChange('homePageSettings.showSectionsPreview', e.target.checked)}
                />
              }
              label="Показывать превью разделов"
            />
          </Grid>

          {heroData.homePageSettings?.showSectionsPreview && (
            <>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Режим отображения</InputLabel>
                  <Select
                    value={heroData.homePageSettings?.sectionsDisplayMode || defaultHeroData.homePageSettings.sectionsDisplayMode}
                    label="Режим отображения"
                    onChange={(e) => handleChange('homePageSettings.sectionsDisplayMode', e.target.value)}
                  >
                    <MenuItem value={SECTIONS_DISPLAY_MODES.CARDS}>{SECTIONS_DISPLAY_LABELS[SECTIONS_DISPLAY_MODES.CARDS]}</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Максимум разделов"
                  type="number"
                  value={heroData.homePageSettings?.maxSectionsToShow || defaultHeroData.homePageSettings.maxSectionsToShow}
                  onChange={(e) => handleChange('homePageSettings.maxSectionsToShow', parseInt(e.target.value) || 6)}
                  inputProps={{ min: 1, max: 12 }}
                />
              </Grid>
            </>
          )}

          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={heroData.homePageSettings?.showContactPreview ?? defaultHeroData.homePageSettings.showContactPreview}
                  onChange={(e) => handleChange('homePageSettings.showContactPreview', e.target.checked)}
                />
              }
              label="Показывать превью контактов"
            />
          </Grid>
        </Grid>
      </Collapse>
    </Paper>
  );
};

export default HeroEditor; 