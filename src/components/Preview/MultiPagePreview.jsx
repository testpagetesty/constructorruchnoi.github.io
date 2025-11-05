import React, { useState, useRef, useEffect } from 'react';
import { imageCacheService } from '../../utils/imageCacheService';
import { 
  Box, 
  Typography, 
  AppBar, 
  Toolbar, 
  Tab, 
  Tabs, 
  Container,
  Paper,
  IconButton,
  Breadcrumbs,
  Link,
  Divider,
  Fade,
  Drawer,
  Button,
  Fab,
  Popover,
  TextField,
  Tooltip,
  FormControl,
  Select,
  MenuItem,
  ToggleButton,
  ToggleButtonGroup
} from '@mui/material';
import PaletteIcon from '@mui/icons-material/Palette';
import TextIncreaseIcon from '@mui/icons-material/TextIncrease';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import { styled } from '@mui/material/styles';
import HomeIcon from '@mui/icons-material/Home';
import ContactsIcon from '@mui/icons-material/Contacts';
import DescriptionIcon from '@mui/icons-material/Description';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import AddIcon from '@mui/icons-material/Add';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Header from '../Header/Header';
import HeroSection from '../Hero/HeroSection';
import ContactSection from '../Contact/ContactSection';
import FooterSection from '../Footer/FooterSection';
import LiveChatWidget from '../LiveChat/LiveChatWidget';
import { ContentElementsLibrary } from '../ContentLibrary';

// Импорты компонентов библиотеки элементов
import {
  Typography as TypographyElement,
  RichTextEditor,
  CodeBlock,
  Blockquote,
  ListComponent,
  Callout,
  BasicCard,
  ImageCard,
  AccordionComponent,
  DataTable,
  BarChart,
  // Новые расширенные компоненты
  AdvancedLineChart,
  AdvancedBarChart,
  AdvancedPieChart,
  AdvancedAreaChart,
  AdvancedRadarChart,
  ChartJSBarChart,
  ChartJSDoughnutChart,
  ApexLineChart,
  VideoPlayer,
  QRCodeGenerator,
  ColorPicker,
  RatingComponent,
  ConfettiComponent,
  ShareButtons,
  AnimatedBox,
  ProgressBars,
  AdvancedContactForm,
  FormikRegistrationForm,
  ReactSelectComponent,
  DatePickerComponent,
  StepperForm,
  // Продвинутые текстовые элементы
  GradientText,
  AnimatedCounter,
  TypewriterText,
  HighlightText,
  MarkdownEditor,
  CodeEditor,
  // Дополнительные текстовые элементы
  TestimonialCard,
  FAQSection,
  TimelineComponent,
  AlertComponent,
  CTASection,
  ImageGallery
} from '../ContentLibrary';
import CardsGridManager from '../ContentLibrary/CardComponents/CardsGridManager';
import MultipleCardsSection from '../ContentLibrary/CardComponents/MultipleCardsSection';
import CardsGridEditor from '../ContentLibrary/CardComponents/CardsGridEditor';
import MultipleCardsEditor from '../ContentLibrary/CardComponents/MultipleCardsEditor';
import BlockquoteNew from '../ContentLibrary/TextComponents/BlockquoteNew';

const StyledTabs = styled(Tabs)(({ theme }) => ({
  backgroundColor: '#f5f5f5',
  borderRadius: '8px',
  minHeight: '48px',
  '& .MuiTabs-indicator': {
    backgroundColor: '#1976d2',
    height: '3px',
    borderRadius: '3px',
  },
  '& .MuiTab-root': {
    minHeight: '48px',
    textTransform: 'none',
    fontSize: '14px',
    fontWeight: 500,
    color: '#666',
    '&:hover': {
      color: '#1976d2',
      backgroundColor: 'rgba(25, 118, 210, 0.04)',
    },
    '&.Mui-selected': {
      color: '#1976d2',
      fontWeight: 600,
    },
  },
}));

const PageContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: 'transparent', // Убираем белый фон по умолчанию
}));

const PageContent = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
}));

const NavigationBar = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  backgroundColor: '#fafafa',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
}));

// Компонент для выбора цвета контактов в превью
const ContactColorPicker = ({ label, color, onChange }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [tempColor, setTempColor] = useState(color);

  useEffect(() => {
    setTempColor(color);
  }, [color]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setTempColor(color);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleColorChange = (event) => {
    const newColor = event.target.value;
    setTempColor(newColor);
    onChange(newColor);
  };

  const open = Boolean(anchorEl);
  const id = open ? `color-picker-${label}` : undefined;

  return (
    <>
      <Tooltip title={label}>
        <IconButton
          onClick={handleClick}
          sx={{
            backgroundColor: color,
            color: '#fff',
            width: 40,
            height: 40,
            '&:hover': {
              backgroundColor: color,
              opacity: 0.8
            },
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
          }}
        >
          <PaletteIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <Box sx={{ p: 2, minWidth: 200 }}>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
            {label}
          </Typography>
          <TextField
            type="color"
            value={tempColor}
            onChange={handleColorChange}
            fullWidth
            size="small"
            sx={{
              '& input[type="color"]': {
                width: '100%',
                height: 40,
                cursor: 'pointer',
                border: 'none',
                borderRadius: 1
              }
            }}
          />
          <TextField
            value={tempColor}
            onChange={(e) => {
              const newColor = e.target.value;
              setTempColor(newColor);
              onChange(newColor);
            }}
            placeholder="#000000"
            size="small"
            fullWidth
            sx={{ mt: 1 }}
            inputProps={{
              pattern: '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$',
              maxLength: 7
            }}
          />
        </Box>
      </Popover>
    </>
  );
};

// Расширенный компонент для настройки текста (заголовок/описание) для всех секций
const SectionTextSettings = ({ 
  label, 
  color, 
  textAlign = 'center',
  fontSize,
  fontStyle = 'default',
  fontFamily,
  fontWeight,
  onChangeColor,
  onChangeAlign,
  onChangeFontSize,
  onChangeFontStyle,
  onChangeFontFamily,
  onChangeFontWeight
}) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? `text-settings-${label}` : undefined;

  // Разные размеры для заголовка и описания
  const fontSizeOptions = label.includes('заголовка') ? [
    { value: '1.5rem', label: 'Маленький' },
    { value: '2rem', label: 'Средний' },
    { value: '2.5rem', label: 'Большой' },
    { value: '3rem', label: 'Очень большой' },
    { value: '3.5rem', label: 'Огромный' }
  ] : [
    { value: '0.875rem', label: 'Маленький' },
    { value: '1rem', label: 'Средний' },
    { value: '1.25rem', label: 'Большой' },
    { value: '1.5rem', label: 'Очень большой' },
    { value: '1.75rem', label: 'Огромный' }
  ];

  return (
    <>
      <Tooltip title={`Настройки ${label}`}>
        <IconButton
          onClick={handleClick}
          sx={{
            backgroundColor: '#1976d2',
            color: '#fff',
            width: 40,
            height: 40,
            '&:hover': {
              backgroundColor: '#1565c0',
            },
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
          }}
        >
          <TextIncreaseIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <Box sx={{ p: 2, minWidth: 280, maxHeight: '80vh', overflowY: 'auto' }}>
          <Typography variant="body2" sx={{ mb: 2, fontWeight: 500 }}>
            Настройки {label}
          </Typography>
          
          {/* Выбор цвета */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" sx={{ mb: 0.5, display: 'block' }}>
              Цвет
            </Typography>
            <TextField
              type="color"
              value={color}
              onChange={(e) => onChangeColor(e.target.value)}
              fullWidth
              size="small"
              sx={{
                '& input[type="color"]': {
                  width: '100%',
                  height: 40,
                  cursor: 'pointer',
                  border: 'none',
                  borderRadius: 1
                }
              }}
            />
          </Box>

          {/* Выравнивание */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" sx={{ mb: 0.5, display: 'block' }}>
              Выравнивание
            </Typography>
            <ToggleButtonGroup
              value={textAlign}
              exclusive
              onChange={(e, newAlign) => {
                if (newAlign !== null) {
                  onChangeAlign(newAlign);
                }
              }}
              aria-label="text alignment"
              size="small"
              fullWidth
            >
              <ToggleButton value="left" aria-label="left aligned">
                <FormatAlignLeftIcon />
              </ToggleButton>
              <ToggleButton value="center" aria-label="centered">
                <FormatAlignCenterIcon />
              </ToggleButton>
              <ToggleButton value="right" aria-label="right aligned">
                <FormatAlignRightIcon />
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {/* Размер шрифта */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" sx={{ mb: 0.5, display: 'block' }}>
              Размер шрифта
            </Typography>
            <FormControl fullWidth size="small">
              <Select
                value={fontSize || (label.includes('заголовка') ? '2.5rem' : '1.25rem')}
                onChange={(e) => onChangeFontSize(e.target.value)}
              >
                {fontSizeOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label} ({option.value})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Шрифт */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" sx={{ mb: 0.5, display: 'block' }}>
              Шрифт
            </Typography>
            <FormControl fullWidth size="small">
              <Select
                value={fontFamily || 'Arial'}
                onChange={(e) => onChangeFontFamily(e.target.value)}
              >
                <MenuItem value="Arial">Arial</MenuItem>
                <MenuItem value="Times New Roman">Times New Roman</MenuItem>
                <MenuItem value="Georgia">Georgia</MenuItem>
                <MenuItem value="Verdana">Verdana</MenuItem>
                <MenuItem value="Helvetica">Helvetica</MenuItem>
                <MenuItem value="Courier New">Courier New</MenuItem>
                <MenuItem value="Trebuchet MS">Trebuchet MS</MenuItem>
                <MenuItem value="Comic Sans MS">Comic Sans MS</MenuItem>
                <MenuItem value="Impact">Impact</MenuItem>
                <MenuItem value="Tahoma">Tahoma</MenuItem>
                <MenuItem value="Roboto">Roboto</MenuItem>
                <MenuItem value="Montserrat">Montserrat</MenuItem>
                <MenuItem value="Open Sans">Open Sans</MenuItem>
                <MenuItem value="Lato">Lato</MenuItem>
                <MenuItem value="Playfair Display">Playfair Display</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Толщина шрифта */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" sx={{ mb: 0.5, display: 'block' }}>
              Толщина шрифта
            </Typography>
            <FormControl fullWidth size="small">
              <Select
                value={fontWeight || '400'}
                onChange={(e) => onChangeFontWeight(e.target.value)}
              >
                <MenuItem value="100">Тонкий (100)</MenuItem>
                <MenuItem value="200">Сверх-легкий (200)</MenuItem>
                <MenuItem value="300">Легкий (300)</MenuItem>
                <MenuItem value="400">Обычный (400)</MenuItem>
                <MenuItem value="500">Средний (500)</MenuItem>
                <MenuItem value="600">Полужирный (600)</MenuItem>
                <MenuItem value="700">Жирный (700)</MenuItem>
                <MenuItem value="800">Сверх-жирный (800)</MenuItem>
                <MenuItem value="900">Черный (900)</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Стиль шрифта */}
          <Box>
            <Typography variant="caption" sx={{ mb: 0.5, display: 'block' }}>
              Стиль шрифта
            </Typography>
            <FormControl fullWidth size="small">
              <Select
                value={fontStyle || 'default'}
                onChange={(e) => onChangeFontStyle(e.target.value)}
              >
                <MenuItem value="default">Обычный</MenuItem>
                <MenuItem value="bold">Жирный</MenuItem>
                <MenuItem value="light">Тонкий</MenuItem>
                <MenuItem value="italic">Курсив</MenuItem>
                <MenuItem value="cursive">Рукописный</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>
      </Popover>
    </>
  );
};

const MultiPagePreview = ({ 
  headerData, 
  heroData, 
  sectionsData, 
  contactData, 
  footerData, 
  legalDocuments,
  liveChatData,
  onElementUpdate = () => {},
  selectedElement = null,
  onElementSelect = () => {},
  onSectionsChange = () => {},
  onContactChange = () => {}
}) => {
  // 🔍 ОТЛАДКА: Отслеживаем обновления sectionsData
  console.log('🔍 [MultiPagePreview] РЕНДЕР КОМПОНЕНТА с sectionsData:', sectionsData);
  console.log('🔍 [MultiPagePreview] heroData:', heroData);
  console.log('🔍 [MultiPagePreview] homePageSettings:', heroData?.homePageSettings);
  console.log('🔍 [MultiPagePreview] showSectionsPreview:', heroData?.homePageSettings?.showSectionsPreview);
  console.log('🔍 [MultiPagePreview] showFeaturedSection:', heroData?.homePageSettings?.showFeaturedSection);
  console.log('🔍 [MultiPagePreview] featuredSectionId:', heroData?.homePageSettings?.featuredSectionId);
  
  if (sectionsData && sectionsData.о_нас && sectionsData.о_нас.elements) {
    const multipleCardsElements = sectionsData.о_нас.elements.filter(el => el.type === 'multiple-cards');
    console.log('🔍 [MultiPagePreview] multiple-cards элементы в sectionsData:', multipleCardsElements);
    multipleCardsElements.forEach((el, index) => {
      console.log(`🔍 [MultiPagePreview] multiple-cards #${index} colorSettings:`, el.colorSettings);
    });
  }
  
  const [currentPage, setCurrentPage] = useState('index');
  const [fadeKey, setFadeKey] = useState(0);
  const [editingElement, setEditingElement] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentSectionId, setCurrentSectionId] = useState(null);
  const [heroImageUrl, setHeroImageUrl] = useState(null);

  console.log('[MultiPagePreview] 🎯 Component mounted/updated');
  
  // Применение настроек фона шапки
  useEffect(() => {
    console.log('[MultiPagePreview] 🎨 Applying header background settings:', headerData);
    console.log('[MultiPagePreview] 🎨 siteBackgroundType:', headerData?.siteBackgroundType);
    console.log('[MultiPagePreview] 🎨 siteBackgroundColor:', headerData?.siteBackgroundColor);
    
    // Используем небольшую задержку, чтобы убедиться, что DOM готов
    setTimeout(() => {
      // Находим основной контейнер
      const previewArea = document.querySelector('.multipage-preview-container');
      console.log('[MultiPagePreview] 🎨 Found preview area:', !!previewArea);
      
      if (!previewArea) {
        console.error('[MultiPagePreview] ❌ Preview area not found! Available elements:', 
          Array.from(document.querySelectorAll('[class*="preview"]')).map(el => el.className));
        return;
      }

      // Удаляем существующие фоновые элементы
      const existingBackground = previewArea.querySelector('.background-image');
      const existingOverlay = previewArea.querySelector('.site-overlay');
      if (existingBackground) {
        existingBackground.remove();
        console.log('[MultiPagePreview] 🎨 Removed existing background');
      }
      if (existingOverlay) {
        existingOverlay.remove();
        console.log('[MultiPagePreview] 🎨 Removed existing overlay');
      }

      // Применяем фон в зависимости от типа
      if (headerData?.siteBackgroundType === 'solid') {
        console.log('[MultiPagePreview] 🎨 Applying solid background:', headerData.siteBackgroundColor);
        
        // Применяем к контейнеру с высоким приоритетом
        previewArea.style.setProperty('background', headerData.siteBackgroundColor || '#ffffff', 'important');
        previewArea.style.setProperty('backgroundColor', headerData.siteBackgroundColor || '#ffffff', 'important');
        previewArea.style.setProperty('backgroundImage', 'none', 'important');
        
        // НЕ применяем к body, чтобы не затронуть панель редактирования
        // document.body.style.setProperty('backgroundColor', headerData.siteBackgroundColor || '#ffffff', 'important');
        
        console.log('[MultiPagePreview] 🎨 Applied solid background, final style:', previewArea.style.backgroundColor);
      } else if (headerData?.siteBackgroundType === 'gradient') {
        const gradientStyle = `linear-gradient(${headerData?.siteGradientDirection || 'to right'}, 
          ${headerData?.siteGradientColor1 || '#ffffff'}, 
          ${headerData?.siteGradientColor2 || '#f5f5f5'})`;
        console.log('[MultiPagePreview] 🎨 Applying gradient background:', gradientStyle);
        
        // Применяем к контейнеру с высоким приоритетом
        previewArea.style.setProperty('background', gradientStyle, 'important');
        previewArea.style.setProperty('backgroundColor', 'transparent', 'important');
        previewArea.style.setProperty('backgroundImage', 'none', 'important');
        
        // НЕ применяем к body, чтобы не затронуть панель редактирования
        // document.body.style.setProperty('background', gradientStyle, 'important');
        // document.body.style.setProperty('backgroundColor', 'transparent', 'important');
        
        console.log('[MultiPagePreview] 🎨 Applied gradient background, final style:', previewArea.style.background);
      } else if (headerData?.siteBackgroundType === 'image') {
        console.log('[MultiPagePreview] 🎨 Applying image background');
        
        // Создаем фоновое изображение
        const backgroundImage = document.createElement('div');
        backgroundImage.className = 'background-image';
        backgroundImage.style.position = 'fixed';
        backgroundImage.style.top = '0';
        backgroundImage.style.left = '0';
        backgroundImage.style.right = '0';
        backgroundImage.style.bottom = '0';
        backgroundImage.style.background = `url('/images/hero/fon.jpg') no-repeat center center fixed`;
        backgroundImage.style.backgroundSize = 'cover';
        backgroundImage.style.zIndex = '-2';
        
        // Применяем размытие
        if (headerData?.siteBackgroundBlur > 0) {
          backgroundImage.style.filter = `blur(${headerData.siteBackgroundBlur}px)`;
        }
        
        previewArea.appendChild(backgroundImage);
        console.log('[MultiPagePreview] 🎨 Added background image element');
        
        // Добавляем затемнение
        if (headerData?.siteBackgroundDarkness > 0) {
          const overlay = document.createElement('div');
          overlay.className = 'site-overlay';
          overlay.style.position = 'fixed';
          overlay.style.top = '0';
          overlay.style.left = '0';
          overlay.style.width = '100%';
          overlay.style.height = '100%';
          overlay.style.backgroundColor = `rgba(0, 0, 0, ${headerData.siteBackgroundDarkness / 100})`;
          overlay.style.zIndex = '-1';
          previewArea.appendChild(overlay);
          console.log('[MultiPagePreview] 🎨 Added overlay element');
        }

        // Сбрасываем стили контейнера
        previewArea.style.setProperty('background', 'none', 'important');
        previewArea.style.setProperty('backgroundColor', 'transparent', 'important');
        
        // НЕ сбрасываем стили body, чтобы не затронуть панель редактирования
        // document.body.style.setProperty('background', 'none', 'important');
        // document.body.style.setProperty('backgroundColor', 'transparent', 'important');
      } else {
        console.log('[MultiPagePreview] 🎨 Removing background (default)');
        // По умолчанию убираем фон
        previewArea.style.setProperty('background', 'none', 'important');
        previewArea.style.setProperty('backgroundColor', 'transparent', 'important');
        previewArea.style.setProperty('backgroundImage', 'none', 'important');
        
        // НЕ сбрасываем стили body, чтобы не затронуть панель редактирования
        // document.body.style.setProperty('background', 'none', 'important');
        // document.body.style.setProperty('backgroundColor', 'transparent', 'important');
      }
      
      console.log('[MultiPagePreview] 🎨 Final container styles:', {
        background: previewArea.style.background,
        backgroundColor: previewArea.style.backgroundColor,
        backgroundImage: previewArea.style.backgroundImage
      });
    }, 100);
    
    // Cleanup function для удаления фоновых элементов при размонтировании
    return () => {
      // НЕ сбрасываем стили body, чтобы не затронуть панель редактирования
      // document.body.style.background = '';
      // document.body.style.backgroundColor = '';
      
      // Удаляем фоновые элементы только из области превью
      const previewArea = document.querySelector('.multipage-preview-container');
      if (previewArea) {
        const backgroundImage = previewArea.querySelector('.background-image');
        const overlay = previewArea.querySelector('.site-overlay');
        if (backgroundImage) backgroundImage.remove();
        if (overlay) overlay.remove();
      }
    };
  }, [headerData]);
  
  // Загрузка hero изображения из кеша
  useEffect(() => {
    const loadHeroImage = async () => {
      console.log('[MultiPagePreview] 🔍 useEffect triggered for hero image loading');
      console.log('[MultiPagePreview] heroData:', heroData);
      console.log('[MultiPagePreview] heroData.backgroundType:', heroData?.backgroundType);
      console.log('[MultiPagePreview] heroData.backgroundImage:', heroData?.backgroundImage);
      
      if (heroData?.backgroundType === 'image' && heroData?.backgroundImage) {
        try {
          console.log('[MultiPagePreview] 🖼️ Loading hero image:', heroData.backgroundImage);
          
          // Извлекаем имя файла из пути
          let imageFilename = heroData.backgroundImage;
          if (imageFilename.includes('/')) {
            imageFilename = imageFilename.split('/').pop();
          }
          
          console.log('[MultiPagePreview] Extracted filename:', imageFilename);
          console.log('[MultiPagePreview] Trying to load from cache...');
          
          // Сначала проверим все доступные ключи в кеше
          const allKeys = await imageCacheService.getAllImageKeys();
          console.log('[MultiPagePreview] All cache keys:', allKeys);
          
          // Пытаемся загрузить из кеша
          const blob = await imageCacheService.getImage(imageFilename);
          if (blob) {
            const url = URL.createObjectURL(blob);
            setHeroImageUrl(url);
            console.log('[MultiPagePreview] ✅ Hero image loaded from cache:', url);
            console.log('[MultiPagePreview] Blob details:', { size: blob.size, type: blob.type });
          } else {
            console.log('[MultiPagePreview] ❌ Hero image not found in cache, trying alternative names...');
            
            // Пробуем альтернативные имена файлов
            const alternativeNames = [
              'hero.jpg',
              'hero.jpeg', 
              'hero.png',
              'hero.webp',
              'fon.jpg',
              'background.jpg'
            ];
            
            let foundImage = false;
            for (const altName of alternativeNames) {
              console.log('[MultiPagePreview] Trying alternative name:', altName);
              const altBlob = await imageCacheService.getImage(altName);
              if (altBlob) {
                const url = URL.createObjectURL(altBlob);
                setHeroImageUrl(url);
                console.log('[MultiPagePreview] ✅ Hero image found with alternative name:', altName, url);
                foundImage = true;
                break;
              }
            }
            
            if (!foundImage) {
              // Пытаемся загрузить изображение с сервера и сохранить в кеш
              console.log('[MultiPagePreview] 🌐 Trying to load and cache hero image from server...');
              try {
                const imageUrl = heroData.backgroundImage.startsWith('/') ? heroData.backgroundImage : `/images/hero/${heroData.backgroundImage}`;
                console.log('[MultiPagePreview] Fetching from URL:', imageUrl);
                const response = await fetch(imageUrl);
                console.log('[MultiPagePreview] Fetch response status:', response.status, response.statusText);
                
                if (response.ok) {
                  const blob = await response.blob();
                  console.log('[MultiPagePreview] Downloaded blob:', { size: blob.size, type: blob.type });
                  await imageCacheService.saveImage(imageFilename, blob);
                  const url = URL.createObjectURL(blob);
                  setHeroImageUrl(url);
                  console.log('[MultiPagePreview] ✅ Hero image loaded from server and cached:', url);
                } else {
                  console.log('[MultiPagePreview] ⚠️ Server response not OK, using direct path');
                  setHeroImageUrl(heroData.backgroundImage);
                  console.log('[MultiPagePreview] Using direct path as fallback:', heroData.backgroundImage);
                }
              } catch (fetchError) {
                console.error('[MultiPagePreview] ❌ Error fetching hero image:', fetchError);
                setHeroImageUrl(heroData.backgroundImage);
                console.log('[MultiPagePreview] Using direct hero image path as final fallback:', heroData.backgroundImage);
              }
            }
          }
        } catch (error) {
          console.error('[MultiPagePreview] ❌ Error in loadHeroImage:', error);
          setHeroImageUrl(heroData.backgroundImage);
        }
      } else {
        setHeroImageUrl(null);
        console.log('[MultiPagePreview] 🚫 Hero background is not image type or no backgroundImage specified');
        if (!heroData) {
          console.log('[MultiPagePreview] heroData is null/undefined');
        } else if (heroData.backgroundType !== 'image') {
          console.log('[MultiPagePreview] backgroundType is not "image", it is:', heroData.backgroundType);
        } else if (!heroData.backgroundImage) {
          console.log('[MultiPagePreview] backgroundImage is empty/null/undefined');
        }
      }
    };

    loadHeroImage();
  }, [heroData?.backgroundType, heroData?.backgroundImage]);

  // Функция для добавления новых элементов
  const handleAddElement = (elementData) => {
    if (!currentSectionId) {
      console.warn('[MultiPagePreview] No section selected for adding element');
      return;
    }
    
    const newElement = {
      id: `element_${Date.now()}`,
      ...elementData,
      timestamp: new Date().toISOString()
    };
    
    console.log('[MultiPagePreview] Adding element to section:', currentSectionId, newElement);
    
    // Используем onElementUpdate для добавления нового элемента
    if (onElementUpdate) {
      onElementUpdate(currentSectionId, newElement.id, 'add', newElement);
    }
    
    // Закрываем панель после добавления
    setDrawerOpen(false);
    setCurrentSectionId(null);
  };
  
  // Функция для открытия библиотеки элементов для конкретной секции
  const handleOpenLibrary = (sectionId) => {
    setCurrentSectionId(sectionId);
    setDrawerOpen(true);
  };

  // Функция для удаления элемента из секции
  const handleElementDelete = (sectionId, elementId) => {
    if (!sectionsData || !sectionsData[sectionId]) {
      console.warn('[MultiPagePreview] Section not found:', sectionId);
      return;
    }

    const section = sectionsData[sectionId];
    let updatedSection;

    // Проверяем, используются ли contentElements или data.elements
    if (section.contentElements && Array.isArray(section.contentElements)) {
      // Фильтруем contentElements
      const updatedElements = section.contentElements.filter(el => el.id !== elementId);
      updatedSection = {
        ...section,
        contentElements: updatedElements
      };
    } else if (section.data && section.data.elements && Array.isArray(section.data.elements)) {
      // Фильтруем элементы из data.elements
      const updatedElements = section.data.elements.filter(el => el.id !== elementId);
      updatedSection = {
        ...section,
        data: {
          ...section.data,
          elements: updatedElements
        }
      };
    } else {
      console.warn('[MultiPagePreview] Section has no elements or contentElements:', sectionId);
      return;
    }

    // Обновляем sectionsData через onSectionsChange
    const updatedSectionsData = {
      ...sectionsData,
      [sectionId]: updatedSection
    };

    if (onSectionsChange) {
      onSectionsChange(updatedSectionsData);
    }

    // Снимаем выделение, если удаляем выбранный элемент
    if (selectedElement && selectedElement.id === elementId && selectedElement.sectionId === sectionId) {
      if (onElementSelect) {
        onElementSelect(null, null);
      }
    }
  };

  // Функция для рендеринга элементов контента
  const renderContentElement = (element, sectionId, section = null) => {
    if (!element || !element.type) {
      console.warn('[MultiPagePreview] Invalid element:', element);
      return null;
    }
    
    console.log('[MultiPagePreview] Rendering content element:', element.type, element);
    console.log('[MultiPagePreview] Element data structure:', {
      hasData: !!element.data,
      dataKeys: element.data ? Object.keys(element.data) : [],
      elementKeys: Object.keys(element),
      title: element.title,
      content: element.content,
      items: element.items,
      text: element.text,
      author: element.author,
      headers: element.headers,
      rows: element.rows
    });
    
    const isCurrentlyEditing = editingElement?.id === element.id && editingElement?.sectionId === sectionId;
    
    const handleElementUpdate = (newData) => {
      // Вызываем обработчик обновления с правильными параметрами
      if (onElementUpdate) {
        onElementUpdate(sectionId, element.id, 'data', newData);
      }
    };

    // Универсальная функция для создания onUpdate с поддержкой customStyles и colorSettings
    const createOnUpdateFunction = (elementType) => {
      return (updatedData) => {
        console.log(`🎨 ${elementType} onUpdate called:`, updatedData);
        
        // Обновляем состояние секции через onElementUpdate
        if (onElementUpdate) {
          // Для BarChart используем colorSettings, для остальных - customStyles
          if (elementType === 'BarChart' && updatedData.colorSettings) {
            console.log('🎯 Calling onElementUpdate with colorSettings:', { sectionId, elementId: element.id, field: 'colorSettings', value: updatedData.colorSettings });
            onElementUpdate(sectionId, element.id, 'colorSettings', updatedData.colorSettings);
            console.log('🎨 Updated element colorSettings:', updatedData.colorSettings);
          } else if (updatedData.customStyles) {
            console.log('🎯 Calling onElementUpdate with customStyles:', { sectionId, elementId: element.id, field: 'customStyles', value: updatedData.customStyles });
            onElementUpdate(sectionId, element.id, 'customStyles', updatedData.customStyles);
            console.log('🎨 Updated element customStyles:', updatedData.customStyles);
          }
        }
      };
    };

    const handleElementClick = (e) => {
      e.stopPropagation();
      if (onElementSelect) {
        onElementSelect(element, sectionId);
      }
    };

    const handleElementDoubleClick = (e) => {
      e.stopPropagation();
      if (['cards-grid', 'multiple-cards'].includes(element.type)) {
        setEditingElement({ id: element.id, sectionId, element });
      }
    };

    const handleElementSave = (newContent) => {
      console.log('🎴🎴🎴 [MultiPagePreview] handleElementSave вызван для:', element.type, 'с данными:', newContent);
      
      // Для Typography преобразуем styles в customStyles и сохраняем colorSettings отдельно
      if (element.type === 'typography') {
        const { colorSettings, styles, ...restContent } = newContent;
        
        // Сохраняем colorSettings отдельно если они есть
        if (colorSettings && Object.keys(colorSettings).length > 0) {
          if (onElementUpdate) {
            onElementUpdate(sectionId, element.id, 'colorSettings', colorSettings);
            console.log('🎨 [MultiPagePreview] Сохранены colorSettings для typography:', colorSettings);
          }
        }
        
        // Преобразуем styles в customStyles если есть
        if (styles) {
          const dataToSave = {
            ...restContent,
            customStyles: {
              ...styles,
              // Убеждаемся, что variant включен
              variant: styles.variant || elementProps.variant || 'body1'
            }
          };
          handleElementUpdate(dataToSave);
        } else if (Object.keys(restContent).length > 0) {
          // Сохраняем остальные данные если нет styles
          handleElementUpdate(restContent);
        }
      } else if (element.type === 'multiple-cards') {
        // 🔥 ИСПРАВЛЕНИЕ: Для multiple-cards сохраняем colorSettings отдельно
        const { colorSettings, ...dataToSave } = newContent;
        
        console.log('🎴🎴🎴 [MultiPagePreview] multiple-cards colorSettings:', colorSettings);
        console.log('🎴🎴🎴 [MultiPagePreview] multiple-cards dataToSave:', dataToSave);
        
        // Сохраняем colorSettings отдельно
        if (colorSettings && Object.keys(colorSettings).length > 0) {
          if (onElementUpdate) {
            onElementUpdate(sectionId, element.id, 'colorSettings', colorSettings);
            console.log('🎴🎴🎴 [MultiPagePreview] Сохранены colorSettings:', colorSettings);
          }
        }
        
        // Сохраняем остальные данные
        if (Object.keys(dataToSave).length > 0) {
          handleElementUpdate(dataToSave);
        }
      } else if (element.type === 'list') {
        // Для списка сохраняем colorSettings отдельно и преобразуем items в initialItems
        const { colorSettings, items, ...restData } = newContent;
        
        // Сохраняем colorSettings отдельно если они есть
        if (colorSettings && Object.keys(colorSettings).length > 0) {
          if (onElementUpdate) {
            onElementUpdate(sectionId, element.id, 'colorSettings', colorSettings);
            console.log('🎨 [MultiPagePreview] Сохранены colorSettings для list:', colorSettings);
          }
        }
        
        // Преобразуем items в initialItems для совместимости
        const dataToSave = {
          ...restData,
          ...(items ? { initialItems: items } : {})
        };
        
        // Сохраняем остальные данные
        if (Object.keys(dataToSave).length > 0) {
          handleElementUpdate(dataToSave);
        }
      } else if (element.type === 'blockquote') {
        // 🔥 ИСПРАВЛЕНИЕ: Для blockquote сохраняем colorSettings отдельно
        const { colorSettings, ...restData } = newContent;
        
        console.log('🎨 [MultiPagePreview] blockquote colorSettings:', colorSettings);
        console.log('🎨 [MultiPagePreview] blockquote restData:', restData);
        
        // Сохраняем colorSettings отдельно если они есть
        if (colorSettings && Object.keys(colorSettings).length > 0) {
          if (onElementUpdate) {
            onElementUpdate(sectionId, element.id, 'colorSettings', colorSettings);
            console.log('🎨 [MultiPagePreview] Сохранены colorSettings для blockquote:', colorSettings);
          }
        }
        
        // Сохраняем остальные данные
        if (Object.keys(restData).length > 0) {
          handleElementUpdate(restData);
        }
      } else if (element.type === 'callout') {
        // 🔥 ИСПРАВЛЕНИЕ: Для callout сохраняем colorSettings отдельно
        const { colorSettings, ...restData } = newContent;
        
        console.log('🎨 [MultiPagePreview] callout colorSettings:', colorSettings);
        console.log('🎨 [MultiPagePreview] callout restData:', restData);
        
        // Сохраняем colorSettings отдельно если они есть
        if (colorSettings && Object.keys(colorSettings).length > 0) {
          if (onElementUpdate) {
            onElementUpdate(sectionId, element.id, 'colorSettings', colorSettings);
            console.log('🎨 [MultiPagePreview] Сохранены colorSettings для callout:', colorSettings);
          }
        }
        
        // Сохраняем остальные данные
        if (Object.keys(restData).length > 0) {
          handleElementUpdate(restData);
        }
      } else if (element.type === 'gradient-text') {
        // 🔥 ИСПРАВЛЕНИЕ: Для gradient-text сохраняем colorSettings отдельно
        const { colorSettings, ...restData } = newContent;
        
        console.log('🎨 [MultiPagePreview] gradient-text colorSettings:', colorSettings);
        console.log('🎨 [MultiPagePreview] gradient-text restData:', restData);
        
        // Сохраняем colorSettings отдельно если они есть
        if (colorSettings && Object.keys(colorSettings).length > 0) {
          if (onElementUpdate) {
            onElementUpdate(sectionId, element.id, 'colorSettings', colorSettings);
            console.log('🎨 [MultiPagePreview] Сохранены colorSettings для gradient-text:', colorSettings);
          }
        }
        
        // Сохраняем остальные данные
        if (Object.keys(restData).length > 0) {
          handleElementUpdate(restData);
        }
      } else if (['animated-counter', 'typewriter-text', 'highlight-text'].includes(element.type)) {
        // 🔥 ИСПРАВЛЕНИЕ: Для animated-counter, typewriter-text, highlight-text сохраняем colorSettings отдельно
        const { colorSettings, ...restData } = newContent;
        
        console.log(`🎨 [MultiPagePreview] ${element.type} colorSettings:`, colorSettings);
        console.log(`🎨 [MultiPagePreview] ${element.type} restData:`, restData);
        
        // Сохраняем colorSettings отдельно если они есть
        if (colorSettings && Object.keys(colorSettings).length > 0) {
          if (onElementUpdate) {
            onElementUpdate(sectionId, element.id, 'colorSettings', colorSettings);
            console.log(`🎨 [MultiPagePreview] Сохранены colorSettings для ${element.type}:`, colorSettings);
          }
        }
        
        // Сохраняем остальные данные
        if (Object.keys(restData).length > 0) {
          handleElementUpdate(restData);
        }
      } else if (['timeline-component', 'data-table'].includes(element.type)) {
        // 🔥 ИСПРАВЛЕНИЕ: Для timeline-component, data-table сохраняем colorSettings отдельно
        const { colorSettings, ...restData } = newContent;
        
        console.log(`🎨 [MultiPagePreview] ${element.type} colorSettings:`, colorSettings);
        console.log(`🎨 [MultiPagePreview] ${element.type} restData:`, restData);
        
        // Сохраняем colorSettings отдельно если они есть
        if (colorSettings && Object.keys(colorSettings).length > 0) {
          if (onElementUpdate) {
            onElementUpdate(sectionId, element.id, 'colorSettings', colorSettings);
            console.log(`🎨 [MultiPagePreview] Сохранены colorSettings для ${element.type}:`, colorSettings);
          }
        }
        
        // Сохраняем остальные данные
        if (Object.keys(restData).length > 0) {
          handleElementUpdate(restData);
        }
      } else if (['faq-section', 'accordion', 'rating', 'progress-bars'].includes(element.type)) {
        // 🔥 ИСПРАВЛЕНИЕ: Для faq-section, accordion, rating, progress-bars сохраняем colorSettings отдельно
        const { colorSettings, ...restData } = newContent;
        
        console.log(`🎨 [MultiPagePreview] ${element.type} colorSettings:`, colorSettings);
        console.log(`🎨 [MultiPagePreview] ${element.type} restData:`, restData);
        
        // Сохраняем colorSettings отдельно если они есть
        if (colorSettings && Object.keys(colorSettings).length > 0) {
          if (onElementUpdate) {
            onElementUpdate(sectionId, element.id, 'colorSettings', colorSettings);
            console.log(`🎨 [MultiPagePreview] Сохранены colorSettings для ${element.type}:`, colorSettings);
          }
        }
        
        // Сохраняем остальные данные
        if (Object.keys(restData).length > 0) {
          handleElementUpdate(restData);
        }
      } else if (['testimonial-card', 'testimonial'].includes(element.type)) {
        // 🔥 ИСПРАВЛЕНИЕ: Для testimonial-card, testimonial сохраняем colorSettings отдельно
        const { colorSettings, ...restData } = newContent;
        
        console.log(`🎨 [MultiPagePreview] ${element.type} colorSettings:`, colorSettings);
        console.log(`🎨 [MultiPagePreview] ${element.type} restData:`, restData);
        
        // Сохраняем colorSettings отдельно если они есть
        if (colorSettings && Object.keys(colorSettings).length > 0) {
          if (onElementUpdate) {
            onElementUpdate(sectionId, element.id, 'colorSettings', colorSettings);
            console.log(`🎨 [MultiPagePreview] Сохранены colorSettings для ${element.type}:`, colorSettings);
          }
        }
        
        // Сохраняем остальные данные
        if (Object.keys(restData).length > 0) {
          handleElementUpdate(restData);
        }
      } else if (['basic-card', 'image-card'].includes(element.type)) {
        // 🔥 ИСПРАВЛЕНИЕ: Для basic-card, image-card сохраняем colorSettings отдельно
        const { colorSettings, ...restData } = newContent;
        
        console.log(`🎨 [MultiPagePreview] ${element.type} colorSettings:`, colorSettings);
        console.log(`🎨 [MultiPagePreview] ${element.type} restData:`, restData);
        
        // Сохраняем colorSettings отдельно если они есть
        if (colorSettings && Object.keys(colorSettings).length > 0) {
          if (onElementUpdate) {
            onElementUpdate(sectionId, element.id, 'colorSettings', colorSettings);
            console.log(`🎨 [MultiPagePreview] Сохранены colorSettings для ${element.type}:`, colorSettings);
          }
        }
        
        // Сохраняем остальные данные
        if (Object.keys(restData).length > 0) {
          handleElementUpdate(restData);
        }
      } else if (['bar-chart', 'chart'].includes(element.type)) {
        // 🔥 ИСПРАВЛЕНИЕ: Для bar-chart сохраняем colorSettings отдельно и данные через 'data'
        const { colorSettings, ...restData } = newContent;
        
        console.log(`🎨 [MultiPagePreview] ${element.type} colorSettings:`, colorSettings);
        console.log(`🎨 [MultiPagePreview] ${element.type} restData:`, restData);
        
        // Сохраняем colorSettings отдельно если они есть
        if (colorSettings && Object.keys(colorSettings).length > 0) {
          if (onElementUpdate) {
            onElementUpdate(sectionId, element.id, 'colorSettings', colorSettings);
            console.log(`🎨 [MultiPagePreview] Сохранены colorSettings для ${element.type}:`, colorSettings);
          }
        }
        
        // 🔥 ИСПРАВЛЕНИЕ: Для bar-chart сохраняем данные через onElementUpdate с полем 'data'
        if (Object.keys(restData).length > 0 && onElementUpdate) {
          onElementUpdate(sectionId, element.id, 'data', restData);
          console.log(`🎨 [MultiPagePreview] Сохранены данные для ${element.type}:`, restData);
        }
      } else if (['advanced-line-chart', 'advanced-pie-chart', 'advanced-area-chart', 'advanced-bar-chart'].includes(element.type)) {
        // 🔥 ИСПРАВЛЕНИЕ: Для расширенных графиков сохраняем colorSettings отдельно
        const { colorSettings, ...restData } = newContent;
        
        console.log(`🎨 [MultiPagePreview] ${element.type} colorSettings:`, colorSettings);
        console.log(`🎨 [MultiPagePreview] ${element.type} restData:`, restData);
        
        // Сохраняем colorSettings отдельно если они есть
        if (colorSettings && Object.keys(colorSettings).length > 0) {
          if (onElementUpdate) {
            onElementUpdate(sectionId, element.id, 'colorSettings', colorSettings);
            console.log(`🎨 [MultiPagePreview] Сохранены colorSettings для ${element.type}:`, colorSettings);
          }
        }
        
        // Сохраняем остальные данные
        if (Object.keys(restData).length > 0) {
          handleElementUpdate(restData);
        }
      } else {
        handleElementUpdate(newContent);
      }
      setEditingElement(null);
    };

    const handleElementCancel = () => {
      setEditingElement(null);
    };

    const elementKey = element.id;
    
    // 🔥 ИСПРАВЛЕНИЕ: Обертка для onUpdate чтобы извлекать colorSettings отдельно
    const handleElementUpdateWithColorSettings = (updateData) => {
      console.log('🎨 [MultiPagePreview] handleElementUpdateWithColorSettings вызван для:', element.type, 'с данными:', updateData);
      
      // Для rich-text, blockquote, list, callout, gradient-text, animated-counter, typewriter-text, highlight-text, timeline-component, data-table, faq-section, accordion, rating, progress-bars, testimonial-card, testimonial, basic-card, image-card, multiple-cards, bar-chart, chart, advanced-line-chart, advanced-pie-chart, advanced-area-chart, advanced-bar-chart извлекаем colorSettings отдельно
      if (['rich-text', 'blockquote', 'list', 'callout', 'gradient-text', 'animated-counter', 'typewriter-text', 'highlight-text', 'timeline-component', 'data-table', 'faq-section', 'accordion', 'rating', 'progress-bars', 'testimonial-card', 'testimonial', 'basic-card', 'image-card', 'multiple-cards', 'bar-chart', 'chart', 'advanced-line-chart', 'advanced-pie-chart', 'advanced-area-chart', 'advanced-bar-chart'].includes(element.type) && updateData && typeof updateData === 'object') {
        const { colorSettings, ...restData } = updateData;
        
        // Сохраняем colorSettings отдельно если они есть
        if (colorSettings && Object.keys(colorSettings).length > 0) {
          if (onElementUpdate) {
            onElementUpdate(sectionId, element.id, 'colorSettings', colorSettings);
            console.log(`🎨 [MultiPagePreview] Сохранены colorSettings для ${element.type} через onUpdate:`, colorSettings);
          }
        }
        
        // Сохраняем остальные данные
        if (Object.keys(restData).length > 0) {
          handleElementUpdate(restData);
        }
      } else {
        // Для остальных элементов вызываем как обычно
        handleElementUpdate(updateData);
      }
    };
    
    const elementProps = {
      isPreview: true,
      constructorMode: true, // В MultiPagePreview всегда true, так как это режим превью с редактированием
      onUpdate: handleElementUpdateWithColorSettings,
      onSave: handleElementUpdate,
      onCancel: () => {},
      editable: true
    };
    
    // Добавляем базовые данные элемента
    if (element.data) {
      Object.assign(elementProps, element.data);
    } else {
      Object.assign(elementProps, element);
    }
    
    // Приоритезируем title из data, если он есть, иначе из корня элемента
    if (element.data && element.data.title) {
      elementProps.title = element.data.title;
    } else if (element.title) {
      elementProps.title = element.title;
    }
    
    // 🔥 ОБЩАЯ ОБРАБОТКА colorSettings для всех элементов
    elementProps.colorSettings = element.colorSettings || element.data?.colorSettings || {};
    console.log(`🔍 [MultiPagePreview] Элемент ${element.type} получил colorSettings:`, elementProps.colorSettings);
    
    // 🔍 СПЕЦИАЛЬНАЯ ОТЛАДКА для multiple-cards
    if (element.type === 'multiple-cards') {
      console.log('🔍 [MultiPagePreview] MULTIPLE-CARDS ДЕТАЛЬНАЯ ОТЛАДКА:', {
        elementId: element.id,
        'element.colorSettings': element.colorSettings,
        'element.data?.colorSettings': element.data?.colorSettings,
        'final elementProps.colorSettings': elementProps.colorSettings,
        'element keys': Object.keys(element),
        'element.data keys': element.data ? Object.keys(element.data) : null
      });
    }
    
    // Специальная обработка для callout - добавляем недостающие поля
    if (element.type === 'callout') {
      elementProps.title = element.data?.title || element.title || 'Информационный блок';
      elementProps.content = element.data?.content || element.content || 'Содержимое блока';
      elementProps.type = element.data?.calloutType || element.calloutType || 'custom';
      elementProps.calloutType = element.data?.calloutType || element.calloutType || 'custom';
      elementProps.showIcon = element.data?.showIcon !== undefined ? element.data.showIcon : (element.showIcon !== undefined ? element.showIcon : true);
      elementProps.isCustomType = element.data?.isCustomType !== undefined ? element.data.isCustomType : (element.isCustomType !== undefined ? element.isCustomType : true);
      elementProps.customTypeName = element.data?.customTypeName || element.customTypeName || 'Информация';
      elementProps.backgroundColor = element.data?.backgroundColor || element.backgroundColor || '#e3f2fd';
      elementProps.borderColor = element.data?.borderColor || element.borderColor || '#1976d2';
      elementProps.textColor = element.data?.textColor || element.textColor || '#0d47a1';
      elementProps.dismissible = element.data?.dismissible !== undefined ? element.data.dismissible : (element.dismissible || false);
      elementProps.size = element.data?.size || element.size || 'medium';
      elementProps.animationSettings = element.animationSettings || element.data?.animationSettings || {
        animationType: 'fadeIn',
        delay: 0,
        triggerOnView: true,
        triggerOnce: true,
        threshold: 0.1,
        disabled: true // ВРЕМЕННО отключаем анимации для отладки callout
      };
      console.log('[MultiPagePreview] 🎯 CALLOUT PROPS PREPARED:', elementProps);
      // Добавляем функцию onUpdate для сохранения изменений
      elementProps.onUpdate = createOnUpdateFunction('Callout');
    }
    
    // Специальная обработка для typography - добавляем недостающие поля
    if (element.type === 'typography') {
      elementProps.text = element.text || element.data?.text || element.content || 'Пример текста';
      
      // Загружаем customStyles из данных элемента
      const savedCustomStyles = element.data?.customStyles || element.customStyles;
      const defaultVariant = element.variant || element.data?.variant || 'body1';
      
      elementProps.customStyles = savedCustomStyles || {
        variant: defaultVariant,
        fontFamily: 'inherit',
        fontSize: 'inherit',
        fontWeight: 'normal',
        fontStyle: 'normal',
        textDecoration: 'none',
        textAlign: 'inherit',
        color: '#000000',
        lineHeight: 1.5,
        letterSpacing: 0,
        textTransform: 'none'
      };
      
      // Убеждаемся, что variant присутствует в customStyles
      if (!elementProps.customStyles.variant) {
        elementProps.customStyles.variant = defaultVariant;
      }
      
      elementProps.variant = elementProps.customStyles.variant;
      
      // Также добавляем colorSettings если они есть
      elementProps.colorSettings = element.colorSettings || element.data?.colorSettings || {};
      
      // Добавляем функцию onUpdate для сохранения изменений
      elementProps.onUpdate = createOnUpdateFunction('Typography');
    }
    
    // Специальная обработка для animated-counter - добавляем недостающие поля  
    if (element.type === 'animated-counter') {
      elementProps.title = element.title || element.data?.title || 'Счетчик';
      elementProps.startValue = element.startValue || element.data?.startValue || 0;
      elementProps.endValue = element.endValue || element.data?.endValue || element.value || 0;
      elementProps.suffix = element.suffix || element.data?.suffix || element.unit || '';
      elementProps.duration = element.duration || element.data?.duration || 2000;
      elementProps.titleColor = element.titleColor || element.data?.titleColor || '#333333';
      elementProps.countColor = element.countColor || element.data?.countColor || '#1976d2';
      elementProps.description = element.description || element.data?.description || '';
      elementProps.animationSettings = element.animationSettings || element.data?.animationSettings || {
        animationType: 'fadeIn',
        delay: 0,
        triggerOnView: true,
        triggerOnce: true,
        threshold: 0.1,
        disabled: false
      };
      // Добавляем функцию onUpdate для сохранения изменений
      elementProps.onUpdate = createOnUpdateFunction('AnimatedCounter');
    }
    
    // Специальная обработка для accordion - добавляем недостающие поля
    if (element.type === 'accordion') {
      elementProps.title = element.title || element.data?.title || 'Аккордеон';
      elementProps.items = element.items || element.data?.items || [];
      elementProps.showTitle = element.showTitle !== undefined ? element.showTitle : (element.data?.showTitle !== undefined ? element.data.showTitle : true);
      elementProps.titleColor = element.titleColor || element.data?.titleColor || '#1976d2';
      elementProps.contentColor = element.contentColor || element.data?.contentColor || '#333333';
      elementProps.borderColor = element.borderColor || element.data?.borderColor || '#e0e0e0';
      elementProps.backgroundType = element.backgroundType || element.data?.backgroundType || 'solid';
      elementProps.backgroundColor = element.backgroundColor || element.data?.backgroundColor || '#ffffff';
      // Добавляем функцию onUpdate для сохранения изменений
      elementProps.onUpdate = createOnUpdateFunction('Accordion');
    }
    
    // Специальная обработка для faq-section - добавляем недостающие поля
    if (element.type === 'faq-section') {
      elementProps.title = element.title || element.data?.title || 'Вопросы и ответы';
      elementProps.items = element.items || element.data?.items || [];
      elementProps.showTitle = element.showTitle !== undefined ? element.showTitle : (element.data?.showTitle !== undefined ? element.data.showTitle : true);
      elementProps.titleColor = element.titleColor || element.data?.titleColor || '#1976d2';
      elementProps.contentColor = element.contentColor || element.data?.contentColor || '#333333';
      elementProps.borderColor = element.borderColor || element.data?.borderColor || '#e0e0e0';
      elementProps.backgroundType = element.backgroundType || element.data?.backgroundType || 'solid';
      elementProps.backgroundColor = element.backgroundColor || element.data?.backgroundColor || '#ffffff';
      elementProps.animationSettings = element.animationSettings || element.data?.animationSettings || {
        animationType: 'fadeIn',
        delay: 0,
        triggerOnView: true,
        triggerOnce: true,
        threshold: 0.1,
        disabled: false
      };
      // Добавляем функцию onUpdate для сохранения изменений
      elementProps.onUpdate = createOnUpdateFunction('FaqSection');
    }
    
    // Специальная обработка для multiple-cards - добавляем недостающие поля
    if (element.type === 'multiple-cards') {
      elementProps.title = element.title || element.data?.title || 'Карточки';
      elementProps.description = element.description || element.data?.description || 'Секция с карточками';
      elementProps.cards = element.cards || element.data?.cards || [];
      elementProps.cardType = element.cardType || element.data?.cardType || 'image-card';
      elementProps.gridSize = element.gridSize || element.data?.gridSize || 'auto';
      elementProps.sectionStyles = element.sectionStyles || element.data?.sectionStyles || {
        titleColor: '#1976d2',
        descriptionColor: '#666666',
        backgroundColor: 'transparent',
        backgroundType: 'transparent'
      };
      // Добавляем функцию onUpdate для сохранения изменений
      elementProps.onUpdate = createOnUpdateFunction('MultipleCards');
    }
    
    // Специальная обработка для qr-code - добавляем недостающие поля
    if (element.type === 'qr-code') {
      elementProps.qrData = element.qrData || element.content || 'https://example.com';
      elementProps.size = element.size || 200;
      elementProps.backgroundColor = element.backgroundColor || '#ffffff';
      elementProps.foregroundColor = element.foregroundColor || '#000000';
      // Добавляем функцию onUpdate для сохранения изменений
      elementProps.onUpdate = createOnUpdateFunction('QrCode');
    }
    
    // Специальная обработка для progress-bars - добавляем недостающие поля
    if (element.type === 'progress-bars') {
      elementProps.progress = element.progress || 45;
      elementProps.caption = element.caption || 'Прогресс загрузки';
      // Добавляем функцию onUpdate для сохранения изменений
      elementProps.onUpdate = createOnUpdateFunction('ProgressBars');
    }
    
    // Специальная обработка для bar-chart - копируем данные диаграммы
    if (element.type === 'bar-chart') {
      // 🔥 ИСПРАВЛЕНИЕ: Правильно извлекаем данные - они могут быть в element.data.data или element.data
      const chartData = element.data?.data || (Array.isArray(element.data) ? element.data : []);
      
      elementProps.title = element.data?.title || element.title || 'Диаграмма';
      elementProps.description = element.data?.description || element.description || ''; // Добавляем поле description
      elementProps.data = chartData; // Используем правильно извлеченные данные
      elementProps.showValues = element.data?.showValues !== undefined ? element.data.showValues : (element.showValues !== undefined ? element.showValues : true);
      elementProps.showGrid = element.data?.showGrid !== undefined ? element.data.showGrid : (element.showGrid !== undefined ? element.showGrid : true);
      elementProps.showLegend = element.data?.showLegend !== undefined ? element.data.showLegend : (element.showLegend !== undefined ? element.showLegend : false);
      elementProps.showStatistics = element.data?.showStatistics !== undefined ? element.data.showStatistics : (element.showStatistics !== undefined ? element.showStatistics : false);
      elementProps.animate = element.data?.animate !== undefined ? element.data.animate : (element.animate !== undefined ? element.animate : true);
      elementProps.orientation = element.data?.orientation || element.orientation || 'vertical';
      elementProps.height = element.data?.height || element.height || 300;
      
      // Используем новую систему colorSettings
      elementProps.colorSettings = element.colorSettings || element.data?.colorSettings || element.data?.data?.colorSettings || {};
      
      // Добавляем специальную функцию onUpdate для BarChart
      elementProps.onUpdate = (updatedData) => {
        console.log('🎨 BarChart onUpdate called:', updatedData);
        
        // Обновляем состояние секции через onElementUpdate
        if (onElementUpdate) {
          // Сохраняем все данные BarChart
          const barChartData = {
            title: updatedData.title,
            description: updatedData.description, // Добавляем description в обновляемые данные
            data: updatedData.data,
            showValues: updatedData.showValues,
            showGrid: updatedData.showGrid,
            showLegend: updatedData.showLegend,
            showStatistics: updatedData.showStatistics,
            animate: updatedData.animate,
            orientation: updatedData.orientation,
            height: updatedData.height,
            colorSettings: updatedData.colorSettings,
            animationSettings: updatedData.animationSettings
          };
          
          console.log('🎯 Calling onElementUpdate for BarChart with data:', { sectionId, elementId: element.id, field: 'data', value: barChartData });
          onElementUpdate(sectionId, element.id, 'data', barChartData);
          console.log('🎨 Updated BarChart data:', barChartData);
        }
      };
      elementProps.animationSettings = element.animationSettings || {
        animationType: 'fadeIn',
        delay: 0,
        triggerOnView: true,
        triggerOnce: true,
        threshold: 0.1,
        disabled: false
      };
      
      console.log('[MultiPagePreview] 🎯 BAR-CHART PROPS PREPARED:', elementProps);
    }
    
    // Специальная обработка для advanced-line-chart - копируем данные линейного графика
    if (element.type === 'advanced-line-chart') {
      // Извлекаем данные из разных источников с приоритетом
      const chartData = element.data?.data || element.data || [];
      const chartTitle = element.data?.title || element.title || 'Линейный график';
      
      elementProps.title = chartTitle;
      elementProps.description = element.data?.description || element.description || '';
      elementProps.data = chartData;
      elementProps.strokeWidth = element.data?.strokeWidth || element.strokeWidth || 2;
      elementProps.showGrid = element.data?.showGrid !== undefined ? element.data.showGrid : (element.showGrid !== undefined ? element.showGrid : true);
      elementProps.showLegend = element.data?.showLegend !== undefined ? element.data.showLegend : (element.showLegend !== undefined ? element.showLegend : true);
      elementProps.chartWidth = element.data?.chartWidth || element.chartWidth || '100%';
      elementProps.maxWidth = element.data?.maxWidth || element.maxWidth || '100%';
      
      // Поддержка colorSettings с fallback на старые настройки
      elementProps.colorSettings = element.colorSettings || element.data?.colorSettings || {};
      elementProps.titleColor = element.data?.titleColor || element.titleColor || '#1976d2';
      elementProps.backgroundColor = element.data?.backgroundColor || element.backgroundColor || '#ffffff';
      elementProps.backgroundType = element.data?.backgroundType || element.backgroundType || 'solid';
      elementProps.gradientStart = element.data?.gradientStart || element.gradientStart || '#f5f5f5';
      elementProps.gradientEnd = element.data?.gradientEnd || element.gradientEnd || '#e0e0e0';
      elementProps.gradientDirection = element.data?.gradientDirection || element.gradientDirection || 'to bottom';
      // 🔥 ИСПРАВЛЕНИЕ: Приоритет textFields.line1/line2 для цветов линий
      elementProps.lineColors = [
        element.colorSettings?.textFields?.line1 || element.colorSettings?.lineColors?.line1 || element.data?.lineColors?.[0] || element.lineColors?.[0] || '#8884d8',
        element.colorSettings?.textFields?.line2 || element.colorSettings?.lineColors?.line2 || element.data?.lineColors?.[1] || element.lineColors?.[1] || '#82ca9d'
      ];
      elementProps.lineNames = element.data?.lineNames || element.lineNames || ['Линия 1', 'Линия 2'];
      elementProps.gridColor = element.data?.gridColor || element.gridColor || '#e0e0e0';
      elementProps.axisColor = element.data?.axisColor || element.axisColor || '#666666';
      elementProps.tooltipBg = element.data?.tooltipBg || element.tooltipBg || '#ffffff';
      elementProps.legendColor = element.data?.legendColor || element.legendColor || '#333333';
      elementProps.borderRadius = element.data?.borderRadius || element.borderRadius || 8;
      elementProps.padding = element.data?.padding || element.padding || 24;
      elementProps.chartHeight = element.data?.chartHeight || element.chartHeight || 300;
      elementProps.animationSettings = element.data?.animationSettings || element.animationSettings || {
        type: 'fadeIn',
        duration: 0.8,
        delay: 0.2
      };
      // Добавляем функцию onUpdate для сохранения изменений
      elementProps.onUpdate = createOnUpdateFunction('AdvancedLineChart');
      
      console.log('[MultiPagePreview] 🎯 ADVANCED-LINE-CHART PROPS PREPARED:', elementProps);
    }
    
    // Специальная обработка для advanced-pie-chart - копируем данные круговой диаграммы
    if (element.type === 'advanced-pie-chart') {
      elementProps.title = element.title || 'Круговая диаграмма';
      elementProps.data = element.data || [];
      elementProps.showLabels = element.showLabels !== undefined ? element.showLabels : true;
      elementProps.showPercentage = element.showPercentage !== undefined ? element.showPercentage : true;
      elementProps.titleColor = element.titleColor || '#1976d2';
      elementProps.backgroundColor = element.backgroundColor || '#ffffff';
      elementProps.backgroundType = element.backgroundType || 'solid';
      elementProps.gradientStart = element.gradientStart || '#f5f5f5';
      elementProps.gradientEnd = element.gradientEnd || '#e0e0e0';
      elementProps.gradientDirection = element.gradientDirection || 'to bottom';
      elementProps.pieColors = element.pieColors || ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088fe', '#00c49f', '#ffbb28', '#ff8042'];
      elementProps.tooltipBg = element.tooltipBg || '#ffffff';
      elementProps.legendColor = element.legendColor || '#333333';
      elementProps.borderRadius = element.borderRadius || 1;
      elementProps.padding = element.padding || 1;
      elementProps.chartSize = element.chartSize || 700;
      elementProps.showLegend = element.showLegend !== undefined ? element.showLegend : true;
      elementProps.animationSettings = element.animationSettings || {
        animationType: 'fadeIn',
        delay: 0,
        triggerOnView: true,
        triggerOnce: true,
        threshold: 0.1,
        disabled: false
      };
      // Добавляем функцию onUpdate для сохранения изменений
      elementProps.onUpdate = createOnUpdateFunction('AdvancedPieChart');
    }
    
    // Специальная обработка для advanced-area-chart - копируем данные диаграммы с областями
    if (element.type === 'advanced-area-chart') {
      elementProps.title = element.title || 'Диаграмма с областями';
      elementProps.data = element.data || [];
      elementProps.showGrid = element.showGrid !== undefined ? element.showGrid : true;
      elementProps.showLegend = element.showLegend !== undefined ? element.showLegend : true;
      elementProps.stacked = element.stacked !== undefined ? element.stacked : true;
      elementProps.areaNames = element.areaNames || ['Область 1', 'Область 2'];
      
      // Добавляем colorSettings и связанные настройки
      elementProps.colorSettings = element.colorSettings || element.data?.colorSettings || {};
      elementProps.areaColors = element.areaColors || element.data?.areaColors || ['#8884d8', '#82ca9d'];
      elementProps.titleColor = element.titleColor || element.data?.titleColor || '#1976d2';
      elementProps.backgroundColor = element.backgroundColor || element.data?.backgroundColor || '#ffffff';
      elementProps.gridColor = element.gridColor || element.data?.gridColor || '#e0e0e0';
      elementProps.axisColor = element.axisColor || element.data?.axisColor || '#666666';
      elementProps.legendColor = element.legendColor || element.data?.legendColor || '#333333';
      elementProps.borderRadius = element.borderRadius || element.data?.borderRadius || 8;
      elementProps.padding = element.padding || element.data?.padding || 24;
      
      elementProps.animationSettings = element.animationSettings || {
        animationType: 'fadeIn',
        delay: 0,
        triggerOnView: true,
        triggerOnce: true,
        threshold: 0.1,
        disabled: false
      };
      // Добавляем функцию onUpdate для сохранения изменений
      elementProps.onUpdate = createOnUpdateFunction('AdvancedAreaChart');
    }
    
    // Специальная обработка для apex-line - копируем данные линейной диаграммы ApexCharts
    if (element.type === 'apex-line') {
      elementProps.title = element.title || 'Линейная диаграмма ApexCharts';
      
      // Адаптируем данные для ApexLineChart
      const chartData = element.data || { labels: [], series: [] };
      elementProps.categories = chartData.labels || ['Янв', 'Фев', 'Мар', 'Апр', 'Мая', 'Июн', 'Июл', 'Авг', 'Сен'];
      elementProps.chartSeries = chartData.series || [{
        name: "Продажи",
        data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
      }];
      
      elementProps.showLegend = element.showLegend !== undefined ? element.showLegend : true;
      elementProps.titleColor = element.titleColor || '#1976d2';
      elementProps.backgroundColor = element.backgroundColor || '#ffffff';
      elementProps.backgroundType = element.backgroundType || 'solid';
      elementProps.gradientStart = element.gradientStart || '#f5f5f5';
      elementProps.gradientEnd = element.gradientEnd || '#e0e0e0';
      elementProps.gradientDirection = element.gradientDirection || 'to bottom';
      elementProps.borderRadius = element.borderRadius || 8;
      elementProps.padding = element.padding || 24;
      elementProps.chartHeight = element.chartHeight || 300;
      elementProps.animationSettings = element.animationSettings || {
        animationType: 'fadeIn',
        delay: 0,
        triggerOnView: true,
        triggerOnce: true,
        threshold: 0.1,
        disabled: false
      };
      // Добавляем функцию onUpdate для сохранения изменений
      elementProps.onUpdate = createOnUpdateFunction('ApexLine');
    }
    
    // Специальная обработка для chartjs-bar - копируем данные Chart.js столбчатой диаграммы
    if (element.type === 'chartjs-bar') {
      elementProps.title = element.title || element.data?.title || 'Chart.js Столбчатая диаграмма';
      elementProps.chartData = element.data || element.chartData || {
        labels: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь'],
        datasets: [{
          label: 'Продажи',
          data: [12, 19, 3, 5, 2, 3],
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
        }]
      };
      elementProps.showLegend = element.showLegend !== undefined ? element.showLegend : true;
      elementProps.titleColor = element.titleColor || '#1976d2';
      elementProps.backgroundColor = element.backgroundColor || '#ffffff';
      elementProps.backgroundType = element.backgroundType || 'solid';
      elementProps.gradientStart = element.gradientStart || '#f5f5f5';
      elementProps.gradientEnd = element.gradientEnd || '#e0e0e0';
      elementProps.gradientDirection = element.gradientDirection || 'to bottom';
      elementProps.borderRadius = element.borderRadius || 8;
      elementProps.padding = element.padding || 24;
      elementProps.chartHeight = element.chartHeight || 500;
      elementProps.animationSettings = element.animationSettings || {
        animationType: 'scaleIn',
        delay: 0,
        triggerOnView: true,
        triggerOnce: true,
        threshold: 0.1,
        disabled: false
      };
      // Добавляем функцию onUpdate для сохранения изменений
      elementProps.onUpdate = createOnUpdateFunction('ChartjsBar');
    }
    
    console.log('[MultiPagePreview] ElementProps for', element.type, ':', elementProps);
    
    // Детальное логирование для всех типов - JSON формат
    console.log(`[MultiPagePreview] Detailed ${element.type} data JSON:`, JSON.stringify({
      title: elementProps.title,
      content: elementProps.content,
      type: elementProps.type,
      calloutType: elementProps.calloutType,
      showIcon: elementProps.showIcon,
      isCustomType: elementProps.isCustomType,
      customTypeName: elementProps.customTypeName,
      borderColor: elementProps.borderColor,
      textColor: elementProps.textColor,
      items: elementProps.items,
      rows: elementProps.rows,
      headers: elementProps.headers,
      text: elementProps.text,
      author: elementProps.author,
      data: elementProps.data,
      chartType: elementProps.chartType,
      quote: elementProps.quote,
      description: elementProps.description,
      imageUrl: elementProps.imageUrl,
      cards: elementProps.cards,
      sectionStyles: elementProps.sectionStyles,
      animationSettings: elementProps.animationSettings,
      // Добавляем поля для QR кода
      qrData: elementProps.qrData,
      size: elementProps.size,
      backgroundColor: elementProps.backgroundColor,
      foregroundColor: elementProps.foregroundColor,
      // Добавляем поля для progress-bars
      progress: elementProps.progress,
      caption: elementProps.caption,
      // Добавляем поля для bar-chart
      showValues: elementProps.showValues,
      showGrid: elementProps.showGrid,
      animate: elementProps.animate,
      orientation: elementProps.orientation,
      height: elementProps.height,
      customStyles: elementProps.customStyles,
      animationSettings: elementProps.animationSettings,
      // Добавляем поля для advanced-line-chart
      strokeWidth: elementProps.strokeWidth,
      showLegend: elementProps.showLegend,
      titleColor: elementProps.titleColor,
      backgroundColor: elementProps.backgroundColor,
      backgroundType: elementProps.backgroundType,
      gradientStart: elementProps.gradientStart,
      gradientEnd: elementProps.gradientEnd,
      gradientDirection: elementProps.gradientDirection,
      lineColors: elementProps.lineColors,
      lineNames: elementProps.lineNames,
      gridColor: elementProps.gridColor,
      axisColor: elementProps.axisColor,
      tooltipBg: elementProps.tooltipBg,
      legendColor: elementProps.legendColor,
      borderRadius: elementProps.borderRadius,
      padding: elementProps.padding,
      chartHeight: elementProps.chartHeight,
      colorSettings: elementProps.colorSettings,
      // Добавляем поля для advanced-pie-chart
      showLabels: elementProps.showLabels,
      showPercentage: elementProps.showPercentage,
      pieColors: elementProps.pieColors,
      chartSize: elementProps.chartSize,
      // Добавляем поля для apex-line
      categories: elementProps.categories,
      chartSeries: elementProps.chartSeries
    }, null, 2));
    
    // Специальное логирование для bar-chart
    if (element.type === 'bar-chart') {
      console.log(`[MultiPagePreview] BarChart title: "${elementProps.title}"`);
      console.log(`[MultiPagePreview] BarChart data length: ${elementProps.data?.length || 0}`);
    }
    
    // Специальное логирование для advanced-line-chart
    if (element.type === 'advanced-line-chart') {
      console.log(`[MultiPagePreview] AdvancedLineChart title: "${elementProps.title}"`);
      console.log(`[MultiPagePreview] AdvancedLineChart data length: ${elementProps.data?.length || 0}`);
      console.log(`[MultiPagePreview] AdvancedLineChart lineNames:`, elementProps.lineNames);
    }
    
    // Специальное логирование для advanced-pie-chart
    if (element.type === 'advanced-pie-chart') {
      console.log(`[MultiPagePreview] AdvancedPieChart title: "${elementProps.title}"`);
      console.log(`[MultiPagePreview] AdvancedPieChart data length: ${elementProps.data?.length || 0}`);
      console.log(`[MultiPagePreview] AdvancedPieChart data:`, elementProps.data);
      console.log(`[MultiPagePreview] AdvancedPieChart showLabels:`, elementProps.showLabels);
      console.log(`[MultiPagePreview] AdvancedPieChart showPercentage:`, elementProps.showPercentage);
      console.log(`[MultiPagePreview] AdvancedPieChart pieColors:`, elementProps.pieColors);
    }
    
    // Специальное логирование для chartjs-doughnut
    if (element.type === 'chartjs-doughnut') {
      console.log(`[MultiPagePreview] ChartJSDoughnutChart title: "${elementProps.title}"`);
      console.log(`[MultiPagePreview] ChartJSDoughnutChart data:`, elementProps.data);
      console.log(`[MultiPagePreview] ChartJSDoughnutChart chartData:`, elementProps.chartData);
      console.log(`[MultiPagePreview] ChartJSDoughnutChart showLegend:`, elementProps.showLegend);
      console.log(`[MultiPagePreview] ChartJSDoughnutChart chartSize:`, elementProps.chartSize);
      console.log(`[MultiPagePreview] ChartJSDoughnutChart cutout:`, elementProps.cutout);
    }
    
    // Специальное логирование для advanced-area-chart
    if (element.type === 'advanced-area-chart') {
      console.log(`[MultiPagePreview] AdvancedAreaChart title: "${elementProps.title}"`);
      console.log(`[MultiPagePreview] AdvancedAreaChart data length: ${elementProps.data?.length || 0}`);
      console.log(`[MultiPagePreview] AdvancedAreaChart data:`, elementProps.data);
      console.log(`[MultiPagePreview] AdvancedAreaChart showGrid:`, elementProps.showGrid);
      console.log(`[MultiPagePreview] AdvancedAreaChart showLegend:`, elementProps.showLegend);
      console.log(`[MultiPagePreview] AdvancedAreaChart stacked:`, elementProps.stacked);
    }
    
    // Специальное логирование для apex-line
    if (element.type === 'apex-line') {
      console.log(`[MultiPagePreview] ApexLineChart title: "${elementProps.title}"`);
      console.log(`[MultiPagePreview] ApexLineChart categories:`, elementProps.categories);
      console.log(`[MultiPagePreview] ApexLineChart chartSeries:`, elementProps.chartSeries);
      console.log(`[MultiPagePreview] ApexLineChart showLegend:`, elementProps.showLegend);
      console.log(`[MultiPagePreview] ApexLineChart original data:`, element.data);
    }
    
    // Специальное логирование для chartjs-bar
    if (element.type === 'chartjs-bar') {
      console.log(`[MultiPagePreview] ChartJSBarChart title: "${elementProps.title}"`);
      console.log(`[MultiPagePreview] ChartJSBarChart chartData:`, elementProps.chartData);
      console.log(`[MultiPagePreview] ChartJSBarChart showLegend:`, elementProps.showLegend);
      console.log(`[MultiPagePreview] ChartJSBarChart original element.title:`, element.title);
      console.log(`[MultiPagePreview] ChartJSBarChart original element.data:`, element.data);
      console.log(`[MultiPagePreview] ChartJSBarChart element.data?.title:`, element.data?.title);
      console.log(`[MultiPagePreview] ChartJSBarChart final elementProps after special handling:`, elementProps.title);
    }

    switch (element.type) {
      // Базовые текстовые компоненты
      case 'typography':
        try {
          // Если элемент редактируется, показываем его в режиме редактирования
          if (isCurrentlyEditing) {
            return (
              <TypographyElement 
                {...elementProps}
                isEditing={true}
                onSave={handleElementSave}
                onCancel={handleElementCancel}
              />
            );
          }
          
          // В режиме просмотра показываем с карандашом
          return (
            <Box 
              sx={{ 
                position: 'relative',
                '&:hover .edit-typography-btn': {
                  opacity: 1
                }
              }}
            >
              <TypographyElement {...elementProps} />
              {/* Иконка карандаша для редактирования */}
              <Tooltip title="Редактировать">
                <IconButton
                  className="edit-typography-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Запускаем редактирование для Typography
                    setEditingElement({ id: element.id, sectionId, element });
                  }}
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    color: '#1976d2',
                    opacity: 0,
                    transition: 'opacity 0.2s ease',
                    zIndex: 10,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 1)',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                    }
                  }}
                  size="small"
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          );
        } catch (error) {
          console.error('[MultiPagePreview] Error rendering TypographyElement:', error);
          return <Box sx={{ p: 2, border: '1px dashed #ff0000', borderRadius: 1, mb: 2 }}>
            <Typography variant="body2" color="error">Ошибка рендеринга TypographyElement</Typography>
          </Box>;
        }
      case 'rich-text':
        try {
          return <RichTextEditor {...elementProps} isEditing={false} onSave={null} />;
        } catch (error) {
          console.error('[MultiPagePreview] Error rendering RichTextEditor:', error);
          return <Box sx={{ p: 2, border: '1px dashed #ff0000', borderRadius: 1, mb: 2 }}>
            <Typography variant="body2" color="error">Ошибка рендеринга RichTextEditor</Typography>
          </Box>;
        }
      case 'code-block':
        try {
          return <CodeBlock {...elementProps} />;
        } catch (error) {
          console.error('[MultiPagePreview] Error rendering CodeBlock:', error);
          return <Box sx={{ p: 2, border: '1px dashed #ff0000', borderRadius: 1, mb: 2 }}>
            <Typography variant="body2" color="error">Ошибка рендеринга CodeBlock</Typography>
          </Box>;
        }
      case 'blockquote':
        try {
          // Если элемент редактируется, показываем его в режиме редактирования
          if (isCurrentlyEditing) {
            return (
              <BlockquoteNew 
                {...elementProps}
                isConstructorMode={true}
                onSave={handleElementSave}
                onCancel={handleElementCancel}
              />
            );
          }
          
          // В режиме просмотра показываем с карандашом
          return (
            <Box 
              sx={{ 
                position: 'relative',
                '&:hover .edit-blockquote-btn': {
                  opacity: 1
                }
              }}
            >
              <BlockquoteNew {...elementProps} isConstructorMode={true} />
              {/* Иконка карандаша для редактирования */}
              <Tooltip title="Редактировать">
                <IconButton
                  className="edit-blockquote-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Запускаем редактирование для Blockquote
                    setEditingElement({ id: element.id, sectionId, element });
                  }}
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    color: '#1976d2',
                    opacity: 0,
                    transition: 'opacity 0.2s ease',
                    zIndex: 10,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 1)',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                    }
                  }}
                  size="small"
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          );
        } catch (error) {
          console.error('[MultiPagePreview] Error rendering BlockquoteNew:', error);
          return <Box sx={{ p: 2, border: '1px dashed #ff0000', borderRadius: 1, mb: 2 }}>
            <Typography variant="body2" color="error">Ошибка рендеринга BlockquoteNew</Typography>
          </Box>;
        }
      case 'list':
        try {
          // Если элемент редактируется, показываем его в режиме редактирования
          if (isCurrentlyEditing) {
            return (
              <ListComponent 
                {...elementProps}
                isEditing={true}
                onSave={handleElementSave}
                onCancel={handleElementCancel}
              />
            );
          }
          
          // В режиме просмотра показываем с карандашом
          return (
            <Box 
              sx={{ 
                position: 'relative',
                '&:hover .edit-list-btn': {
                  opacity: 1
                }
              }}
            >
              <ListComponent {...elementProps} />
              {/* Иконка карандаша для редактирования */}
              <Tooltip title="Редактировать">
                <IconButton
                  className="edit-list-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Запускаем редактирование для List
                    setEditingElement({ id: element.id, sectionId, element });
                  }}
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    color: '#1976d2',
                    opacity: 0,
                    transition: 'opacity 0.2s ease',
                    zIndex: 10,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 1)',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                    }
                  }}
                  size="small"
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          );
        } catch (error) {
          console.error('[MultiPagePreview] Error rendering ListComponent:', error);
          return <Box sx={{ p: 2, border: '1px dashed #ff0000', borderRadius: 1, mb: 2 }}>
            <Typography variant="body2" color="error">Ошибка рендеринга ListComponent</Typography>
          </Box>;
        }
      case 'callout':
        try {
          // Если элемент редактируется, показываем его в режиме редактирования
          if (isCurrentlyEditing) {
            return (
              <Callout 
                key={elementKey}
                {...elementProps}
                onSave={handleElementSave}
                onCancel={handleElementCancel}
              />
            );
          }
          
          // В режиме просмотра показываем с карандашом
          return (
            <Box 
              sx={{ 
                position: 'relative',
                '&:hover .edit-callout-btn': {
                  opacity: 1
                }
              }}
            >
              <Callout key={elementKey} {...elementProps} />
              {/* Иконка карандаша для редактирования */}
              <Tooltip title="Редактировать">
                <IconButton
                  className="edit-callout-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Запускаем редактирование для Callout
                    setEditingElement({ id: element.id, sectionId, element });
                  }}
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    color: '#1976d2',
                    opacity: 0,
                    transition: 'opacity 0.2s ease',
                    zIndex: 10,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 1)',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                    }
                  }}
                  size="small"
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          );
        } catch (error) {
          console.error('[MultiPagePreview] Error rendering Callout:', error);
          return <Box sx={{ p: 2, border: '1px dashed #ff0000', borderRadius: 1, mb: 2 }}>
            <Typography variant="body2" color="error">Ошибка рендеринга Callout</Typography>
          </Box>;
        }
        
      // Продвинутые текстовые элементы
      case 'gradient-text':
        try {
          // Если элемент редактируется, показываем его в режиме редактирования
          if (isCurrentlyEditing) {
            return (
              <GradientText 
                {...elementProps}
                onSave={handleElementSave}
                onCancel={handleElementCancel}
              />
            );
          }
          
          // В режиме просмотра показываем с карандашом
          return (
            <Box 
              sx={{ 
                position: 'relative',
                '&:hover .edit-gradient-text-btn': {
                  opacity: 1
                }
              }}
            >
              <GradientText {...elementProps} />
              {/* Иконка карандаша для редактирования */}
              <Tooltip title="Редактировать">
                <IconButton
                  className="edit-gradient-text-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Запускаем редактирование для GradientText
                    setEditingElement({ id: element.id, sectionId, element });
                  }}
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    color: '#1976d2',
                    opacity: 0,
                    transition: 'opacity 0.2s ease',
                    zIndex: 10,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 1)',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                    }
                  }}
                  size="small"
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          );
        } catch (error) {
          console.error('[MultiPagePreview] Error rendering GradientText:', error);
          return <Box sx={{ p: 2, border: '1px dashed #ff0000', borderRadius: 1, mb: 2 }}>
            <Typography variant="body2" color="error">Ошибка рендеринга GradientText</Typography>
          </Box>;
        }
      case 'solid-text':
        try {
          return (
            <Typography 
              sx={{
                color: element.data?.color || element.color || '#1976d2',
                fontSize: `${element.data?.fontSize || element.fontSize || 24}px`,
                fontWeight: element.data?.fontWeight || element.fontWeight || 'bold',
                textAlign: 'center',
                margin: '1rem 0'
              }}
            >
              {element.data?.text || element.text || 'Цветной текст'}
            </Typography>
          );
        } catch (error) {
          console.error('[MultiPagePreview] Error rendering SolidText:', error);
          return <Box sx={{ p: 2, border: '1px dashed #ff0000', borderRadius: 1, mb: 2 }}>
            <Typography variant="body2" color="error">Ошибка рендеринга SolidText</Typography>
          </Box>;
        }
      case 'animated-counter':
        try {
          // Если элемент редактируется, показываем его в режиме редактирования
          if (isCurrentlyEditing) {
            return (
              <AnimatedCounter 
                {...elementProps}
                onSave={handleElementSave}
                onCancel={handleElementCancel}
              />
            );
          }
          
          // В режиме просмотра показываем с карандашом
          return (
            <Box 
              sx={{ 
                position: 'relative',
                '&:hover .edit-animated-counter-btn': {
                  opacity: 1
                }
              }}
            >
              <AnimatedCounter {...elementProps} />
              {/* Иконка карандаша для редактирования */}
              <Tooltip title="Редактировать">
                <IconButton
                  className="edit-animated-counter-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Запускаем редактирование для AnimatedCounter
                    setEditingElement({ id: element.id, sectionId, element });
                  }}
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    color: '#1976d2',
                    opacity: 0,
                    transition: 'opacity 0.2s ease',
                    zIndex: 10,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 1)',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                    }
                  }}
                  size="small"
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          );
        } catch (error) {
          console.error('[MultiPagePreview] Error rendering AnimatedCounter:', error);
          return <Box sx={{ p: 2, border: '1px dashed #ff0000', borderRadius: 1, mb: 2 }}>
            <Typography variant="body2" color="error">Ошибка рендеринга AnimatedCounter</Typography>
          </Box>;
        }
      case 'typewriter-text':
        try {
          // Если элемент редактируется, показываем его в режиме редактирования
          if (isCurrentlyEditing) {
            return (
              <TypewriterText 
                {...elementProps}
                onSave={handleElementSave}
                onCancel={handleElementCancel}
              />
            );
          }
          
          // В режиме просмотра показываем с карандашом
          return (
            <Box 
              sx={{ 
                position: 'relative',
                '&:hover .edit-typewriter-text-btn': {
                  opacity: 1
                }
              }}
            >
              <TypewriterText {...elementProps} />
              {/* Иконка карандаша для редактирования */}
              <Tooltip title="Редактировать">
                <IconButton
                  className="edit-typewriter-text-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Запускаем редактирование для TypewriterText
                    setEditingElement({ id: element.id, sectionId, element });
                  }}
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    color: '#1976d2',
                    opacity: 0,
                    transition: 'opacity 0.2s ease',
                    zIndex: 10,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 1)',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                    }
                  }}
                  size="small"
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          );
        } catch (error) {
          console.error('[MultiPagePreview] Error rendering TypewriterText:', error);
          return <Box sx={{ p: 2, border: '1px dashed #ff0000', borderRadius: 1, mb: 2 }}>
            <Typography variant="body2" color="error">Ошибка рендеринга TypewriterText</Typography>
          </Box>;
        }
      case 'highlight-text':
        try {
          // Если элемент редактируется, показываем его в режиме редактирования
          if (isCurrentlyEditing) {
            return (
              <HighlightText 
                {...elementProps}
                onSave={handleElementSave}
                onCancel={handleElementCancel}
              />
            );
          }
          
          // В режиме просмотра показываем с карандашом
          return (
            <Box 
              sx={{ 
                position: 'relative',
                '&:hover .edit-highlight-text-btn': {
                  opacity: 1
                }
              }}
            >
              <HighlightText {...elementProps} />
              {/* Иконка карандаша для редактирования */}
              <Tooltip title="Редактировать">
                <IconButton
                  className="edit-highlight-text-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Запускаем редактирование для HighlightText
                    setEditingElement({ id: element.id, sectionId, element });
                  }}
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    color: '#1976d2',
                    opacity: 0,
                    transition: 'opacity 0.2s ease',
                    zIndex: 10,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 1)',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                    }
                  }}
                  size="small"
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          );
        } catch (error) {
          console.error('[MultiPagePreview] Error rendering HighlightText:', error);
          return <Box sx={{ p: 2, border: '1px dashed #ff0000', borderRadius: 1, mb: 2 }}>
            <Typography variant="body2" color="error">Ошибка рендеринга HighlightText</Typography>
          </Box>;
        }
      case 'markdown-editor':
        try {
          return <MarkdownEditor {...elementProps} />;
        } catch (error) {
          console.error('[MultiPagePreview] Error rendering MarkdownEditor:', error);
          return <Box sx={{ p: 2, border: '1px dashed #ff0000', borderRadius: 1, mb: 2 }}>
            <Typography variant="body2" color="error">Ошибка рендеринга MarkdownEditor</Typography>
          </Box>;
        }
      case 'code-editor':
        try {
          return <CodeEditor {...elementProps} />;
        } catch (error) {
          console.error('[MultiPagePreview] Error rendering CodeEditor:', error);
          return <Box sx={{ p: 2, border: '1px dashed #ff0000', borderRadius: 1, mb: 2 }}>
            <Typography variant="body2" color="error">Ошибка рендеринга CodeEditor</Typography>
          </Box>;
        }
        
      // Дополнительные текстовые элементы
      case 'testimonial-card':
      case 'testimonial':
        try {
          // Если элемент редактируется, показываем его в режиме редактирования
          if (isCurrentlyEditing) {
            return (
              <TestimonialCard 
                {...elementProps}
                onSave={handleElementSave}
                onCancel={handleElementCancel}
              />
            );
          }
          
          // В режиме просмотра показываем с карандашом
          return (
            <Box 
              sx={{ 
                position: 'relative',
                '&:hover .edit-testimonial-card-btn': {
                  opacity: 1
                }
              }}
            >
              <TestimonialCard {...elementProps} />
              {/* Иконка карандаша для редактирования */}
              <Tooltip title="Редактировать">
                <IconButton
                  className="edit-testimonial-card-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Запускаем редактирование для TestimonialCard
                    setEditingElement({ id: element.id, sectionId, element });
                  }}
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    color: '#1976d2',
                    opacity: 0,
                    transition: 'opacity 0.2s ease',
                    zIndex: 10,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 1)',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                    }
                  }}
                  size="small"
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          );
        } catch (error) {
          console.error('[MultiPagePreview] Error rendering TestimonialCard:', error);
          return <Box sx={{ p: 2, border: '1px dashed #ff0000', borderRadius: 1, mb: 2 }}>
            <Typography variant="body2" color="error">Ошибка рендеринга TestimonialCard</Typography>
          </Box>;
        }
      case 'faq-section':
        try {
          // Если элемент редактируется, показываем его в режиме редактирования
          if (isCurrentlyEditing) {
            return (
              <FAQSection 
                {...elementProps}
                onSave={handleElementSave}
                onCancel={handleElementCancel}
              />
            );
          }
          
          // В режиме просмотра показываем с карандашом
          return (
            <Box 
              sx={{ 
                position: 'relative',
                '&:hover .edit-faq-section-btn': {
                  opacity: 1
                }
              }}
            >
              <FAQSection {...elementProps} />
              {/* Иконка карандаша для редактирования */}
              <Tooltip title="Редактировать">
                <IconButton
                  className="edit-faq-section-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Запускаем редактирование для FAQSection
                    setEditingElement({ id: element.id, sectionId, element });
                  }}
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    color: '#1976d2',
                    opacity: 0,
                    transition: 'opacity 0.2s ease',
                    zIndex: 10,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 1)',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                    }
                  }}
                  size="small"
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          );
        } catch (error) {
          console.error('[MultiPagePreview] Error rendering FAQSection:', error);
          return <Box sx={{ p: 2, border: '1px dashed #ff0000', borderRadius: 1, mb: 2 }}>
            <Typography variant="body2" color="error">Ошибка рендеринга FAQSection</Typography>
          </Box>;
        }
      case 'timeline-component':
        try {
          // Если элемент редактируется, показываем его в режиме редактирования
          if (isCurrentlyEditing) {
            return (
              <TimelineComponent 
                {...elementProps}
                onSave={handleElementSave}
                onCancel={handleElementCancel}
              />
            );
          }
          
          // В режиме просмотра показываем с карандашом
          return (
            <Box 
              sx={{ 
                position: 'relative',
                '&:hover .edit-timeline-component-btn': {
                  opacity: 1
                }
              }}
            >
              <TimelineComponent {...elementProps} />
              {/* Иконка карандаша для редактирования */}
              <Tooltip title="Редактировать">
                <IconButton
                  className="edit-timeline-component-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Запускаем редактирование для TimelineComponent
                    setEditingElement({ id: element.id, sectionId, element });
                  }}
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    color: '#1976d2',
                    opacity: 0,
                    transition: 'opacity 0.2s ease',
                    zIndex: 10,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 1)',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                    }
                  }}
                  size="small"
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          );
        } catch (error) {
          console.error('[MultiPagePreview] Error rendering TimelineComponent:', error);
          return <Box sx={{ p: 2, border: '1px dashed #ff0000', borderRadius: 1, mb: 2 }}>
            <Typography variant="body2" color="error">Ошибка рендеринга TimelineComponent</Typography>
          </Box>;
        }
      case 'alert-component':
        try {
          return <AlertComponent {...elementProps} />;
        } catch (error) {
          console.error('[MultiPagePreview] Error rendering AlertComponent:', error);
          return <Box sx={{ p: 2, border: '1px dashed #ff0000', borderRadius: 1, mb: 2 }}>
            <Typography variant="body2" color="error">Ошибка рендеринга AlertComponent</Typography>
          </Box>;
        }
        
      // CTA секция
      case 'cta-section':
        try {
          return <CTASection {...elementProps} availablePages={pages} />;
        } catch (error) {
          console.error('[MultiPagePreview] Error rendering CTASection:', error);
          return <Box sx={{ p: 2, border: '1px dashed #ff0000', borderRadius: 1, mb: 2 }}>
            <Typography variant="body2" color="error">Ошибка рендеринга CTASection</Typography>
          </Box>;
        }
        
      // Галерея изображений
      case 'image-gallery':
        try {
          return <ImageGallery {...elementProps} />;
        } catch (error) {
          console.error('[MultiPagePreview] Error rendering ImageGallery:', error);
          return <Box sx={{ p: 2, border: '1px dashed #ff0000', borderRadius: 1, mb: 2 }}>
            <Typography variant="body2" color="error">Ошибка рендеринга ImageGallery</Typography>
          </Box>;
        }
        
      // Карточки
      case 'basic-card':
        try {
          // Если элемент редактируется, показываем его в режиме редактирования
          if (isCurrentlyEditing) {
            return (
              <BasicCard 
                {...elementProps}
                onSave={handleElementSave}
                onCancel={handleElementCancel}
              />
            );
          }
          
          // В режиме просмотра показываем с карандашом
          return (
            <Box 
              sx={{ 
                position: 'relative',
                '&:hover .edit-basic-card-btn': {
                  opacity: 1
                }
              }}
            >
              <BasicCard {...elementProps} />
              {/* Иконка карандаша для редактирования */}
              <Tooltip title="Редактировать">
                <IconButton
                  className="edit-basic-card-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Запускаем редактирование для BasicCard
                    setEditingElement({ id: element.id, sectionId, element });
                  }}
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    color: '#1976d2',
                    opacity: 0,
                    transition: 'opacity 0.2s ease',
                    zIndex: 10,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 1)',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                    }
                  }}
                  size="small"
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          );
        } catch (error) {
          console.error('[MultiPagePreview] Error rendering BasicCard:', error);
          return <Box sx={{ p: 2, border: '1px dashed #ff0000', borderRadius: 1, mb: 2 }}>
            <Typography variant="body2" color="error">Ошибка рендеринга BasicCard</Typography>
          </Box>;
        }
      case 'image-card':
      case 'imagecard':
        try {
          // Если элемент редактируется, показываем его в режиме редактирования
          if (isCurrentlyEditing) {
            return (
              <ImageCard 
                key={`${sectionId}-${element.id}`}
                {...elementProps}
                // 🔥 ИСПРАВЛЕНИЕ: Передаем правильные ID
                id={element.id}
                cardId={element.id}
                sectionId={sectionId}
                sectionTitle={section?.title || section?.data?.title}
                onSave={handleElementSave}
                onCancel={handleElementCancel}
              />
            );
          }
          
          // В режиме просмотра показываем с карандашом
          return (
            <Box 
              sx={{ 
                position: 'relative',
                '&:hover .edit-image-card-btn': {
                  opacity: 1
                }
              }}
            >
              <ImageCard 
                key={`${sectionId}-${element.id}`}
                {...elementProps}
                // 🔥 ИСПРАВЛЕНИЕ: Передаем правильные ID
                id={element.id}
                cardId={element.id}
                sectionId={sectionId}
                sectionTitle={section?.title || section?.data?.title}
              />
              {/* Иконка карандаша для редактирования */}
              <Tooltip title="Редактировать">
                <IconButton
                  className="edit-image-card-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Запускаем редактирование для ImageCard
                    setEditingElement({ id: element.id, sectionId, element });
                  }}
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    color: '#1976d2',
                    opacity: 0,
                    transition: 'opacity 0.2s ease',
                    zIndex: 10,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 1)',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                    }
                  }}
                  size="small"
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          );
        } catch (error) {
          console.error('[MultiPagePreview] Error rendering ImageCard:', error);
          return <Box sx={{ p: 2, border: '1px dashed #ff0000', borderRadius: 1, mb: 2 }}>
            <Typography variant="body2" color="error">Ошибка рендеринга ImageCard</Typography>
          </Box>;
        }
      case 'cards-grid':
        return isCurrentlyEditing ? (
          <CardsGridEditor
            title={element.data?.title || ''}
            description={element.data?.description || ''}
            cards={element.data?.cards || []}
            cardType={element.data?.cardType || 'image-card'}
            gridSize={element.data?.gridSize || 'medium'}
            onSave={handleElementSave}
            onCancel={handleElementCancel}
            isPreview={true}
          />
        ) : (
          <Box
            onClick={handleElementClick}
            onDoubleClick={handleElementDoubleClick}
            sx={{ 
              position: 'relative',
              cursor: 'pointer',
              '&:hover': {
                outline: '2px solid #1976d2',
                borderRadius: 1
              }
            }}
          >
            {element.data?.title && (
              <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', mb: 3 }}>
                {element.data.title}
              </Typography>
            )}
            {element.data?.description && (
              <Typography variant="body1" sx={{ textAlign: 'center', mb: 4, color: 'text.secondary' }}>
                {element.data.description}
              </Typography>
            )}
            <CardsGridManager
              cards={element.data?.cards || []}
              onCardsChange={() => {}} // Только для просмотра
              cardType={element.data?.cardType || 'image-card'}
              gridSize={element.data?.gridSize || 'medium'}
              onGridSizeChange={() => {}} // Только для просмотра
              editable={true}
            />
            {/* Подсказка о возможности редактирования */}
            <Box
              sx={{
                position: 'absolute',
                top: -4,
                right: -4,
                backgroundColor: 'rgba(25, 118, 210, 0.9)',
                color: 'white',
                borderRadius: '4px',
                padding: '2px 6px',
                fontSize: '10px',
                fontWeight: 'bold',
                zIndex: 10,
                opacity: 0,
                transition: 'opacity 0.3s ease',
                pointerEvents: 'none',
                '&:hover': {
                  opacity: 1
                }
              }}
            >
              Двойной клик для редактирования
            </Box>
          </Box>
        );
      case 'multiple-cards':
        return isCurrentlyEditing ? (
          <MultipleCardsEditor
            title={element.data?.title || element.title || ''}
            description={element.data?.description || element.description || ''}
            cards={element.data?.cards || element.cards || []}
            cardType={element.data?.cardType || element.cardType || 'image-card'}
            gridSize={element.data?.gridSize || element.gridSize || 'medium'}
            sectionStyles={element.data?.sectionStyles || element.sectionStyles}
            colorSettings={element.data?.colorSettings || element.colorSettings}
            onSave={handleElementSave}
            onCancel={handleElementCancel}
            isPreview={true}
          />
        ) : (
          <Box
            sx={{ 
              position: 'relative',
              '&:hover .edit-multiple-cards-btn': {
                opacity: 1
              },
              '&:hover': {
                outline: '2px solid #1976d2',
                borderRadius: 1
              }
            }}
          >
            <MultipleCardsSection
              cards={element.data?.cards || element.cards || []}
              gridSize={element.data?.gridSize || element.gridSize || 'medium'}
              cardType={element.data?.cardType || element.cardType || 'image-card'}
              title={element.data?.title || element.title}
              description={element.data?.description || element.description}
              sectionStyles={element.data?.sectionStyles || element.sectionStyles}
              colorSettings={(() => {
                const colorSettings = element.colorSettings || element.data?.colorSettings || {};
                console.log('🔥 [MultiPagePreview] ПРЯМОЙ РЕНДЕР MultipleCardsSection с colorSettings:', colorSettings);
                return colorSettings;
              })()}
              onEdit={() => {}}
              onDelete={() => {}}
              editable={true} // Включаем редактирование для показа кнопок
              showUploadButtons={true} // В MultiPagePreview всегда показываем кнопки загрузки
              onCardUpdate={(cardId, updatedData) => {
                // Обновляем карточку в элементе
                const updatedCards = (element.data?.cards || element.cards || []).map(card => 
                  card.id === cardId ? { ...card, ...updatedData } : card
                );
                if (onElementUpdate) {
                  onElementUpdate(sectionId, element.id, 'data', { cards: updatedCards });
                }
              }}
            />
            {/* Иконка карандаша для редактирования */}
            <Tooltip title="Редактировать">
              <IconButton
                className="edit-multiple-cards-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  // Запускаем редактирование для MultipleCards
                  setEditingElement({ id: element.id, sectionId, element });
                }}
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  color: '#1976d2',
                  opacity: 0,
                  transition: 'opacity 0.2s ease',
                  zIndex: 10,
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 1)',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                  }
                }}
                size="small"
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        );
        
      // Интерактивные элементы
      case 'accordion':
        try {
          // Трансформируем данные для AccordionComponent
          const accordionProps = {
            ...elementProps,
            initialPanels: elementProps.items || elementProps.initialPanels || [
              { id: 1, title: 'Заголовок', content: 'Содержимое' }
            ],
            title: element.data?.title,
            showTitle: element.data?.showTitle
          };
          
          console.log('[MultiPagePreview] AccordionComponent props:', accordionProps);
          
          // Если элемент редактируется, показываем его в режиме редактирования
          if (isCurrentlyEditing) {
            return (
              <AccordionComponent 
                key={elementKey}
                {...accordionProps}
                onSave={handleElementSave}
                onCancel={handleElementCancel}
              />
            );
          }
          
          // В режиме просмотра показываем с карандашом
          return (
            <Box 
              sx={{ 
                position: 'relative',
                '&:hover .edit-accordion-btn': {
                  opacity: 1
                }
              }}
            >
              <AccordionComponent key={elementKey} {...accordionProps} />
              {/* Иконка карандаша для редактирования */}
              <Tooltip title="Редактировать">
                <IconButton
                  className="edit-accordion-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Запускаем редактирование для AccordionComponent
                    setEditingElement({ id: element.id, sectionId, element });
                  }}
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    color: '#1976d2',
                    opacity: 0,
                    transition: 'opacity 0.2s ease',
                    zIndex: 10,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 1)',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                    }
                  }}
                  size="small"
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          );
        } catch (error) {
          console.error('[MultiPagePreview] Error rendering AccordionComponent:', error);
          return <Box sx={{ p: 2, border: '1px dashed #ff0000', borderRadius: 1, mb: 2 }}>
            <Typography variant="body2" color="error">Ошибка рендеринга AccordionComponent</Typography>
          </Box>;
        }
      case 'video-player':
        try {
          return <VideoPlayer {...elementProps} />;
        } catch (error) {
          console.error('[MultiPagePreview] Error rendering VideoPlayer:', error);
          return <Box sx={{ p: 2, border: '1px dashed #ff0000', borderRadius: 1, mb: 2 }}>
            <Typography variant="body2" color="error">Ошибка рендеринга VideoPlayer</Typography>
          </Box>;
        }
      case 'qr-code':
        try {
          return <QRCodeGenerator {...elementProps} />;
        } catch (error) {
          console.error('[MultiPagePreview] Error rendering QRCodeGenerator:', error);
          return <Box sx={{ p: 2, border: '1px dashed #ff0000', borderRadius: 1, mb: 2 }}>
            <Typography variant="body2" color="error">Ошибка рендеринга QRCodeGenerator</Typography>
          </Box>;
        }
      case 'color-picker':
        try {
          return <ColorPicker {...elementProps} />;
        } catch (error) {
          console.error('[MultiPagePreview] Error rendering ColorPicker:', error);
          return <Box sx={{ p: 2, border: '1px dashed #ff0000', borderRadius: 1, mb: 2 }}>
            <Typography variant="body2" color="error">Ошибка рендеринга ColorPicker</Typography>
          </Box>;
        }
      case 'rating':
        try {
          // Если элемент редактируется, показываем его в режиме редактирования
          if (isCurrentlyEditing) {
            return (
              <RatingComponent 
                {...elementProps}
                onSave={handleElementSave}
                onCancel={handleElementCancel}
              />
            );
          }
          
          // В режиме просмотра показываем с карандашом
          return (
            <Box 
              sx={{ 
                position: 'relative',
                '&:hover .edit-rating-btn': {
                  opacity: 1
                }
              }}
            >
              <RatingComponent {...elementProps} />
              {/* Иконка карандаша для редактирования */}
              <Tooltip title="Редактировать">
                <IconButton
                  className="edit-rating-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Запускаем редактирование для RatingComponent
                    setEditingElement({ id: element.id, sectionId, element });
                  }}
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    color: '#1976d2',
                    opacity: 0,
                    transition: 'opacity 0.2s ease',
                    zIndex: 10,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 1)',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                    }
                  }}
                  size="small"
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          );
        } catch (error) {
          console.error('[MultiPagePreview] Error rendering RatingComponent:', error);
          return <Box sx={{ p: 2, border: '1px dashed #ff0000', borderRadius: 1, mb: 2 }}>
            <Typography variant="body2" color="error">Ошибка рендеринга RatingComponent</Typography>
          </Box>;
        }
      case 'confetti':
        try {
          return <ConfettiComponent {...elementProps} />;
        } catch (error) {
          console.error('[MultiPagePreview] Error rendering ConfettiComponent:', error);
          return <Box sx={{ p: 2, border: '1px dashed #ff0000', borderRadius: 1, mb: 2 }}>
            <Typography variant="body2" color="error">Ошибка рендеринга ConfettiComponent</Typography>
          </Box>;
        }
      case 'share-buttons':
        try {
          return <ShareButtons {...elementProps} />;
        } catch (error) {
          console.error('[MultiPagePreview] Error rendering ShareButtons:', error);
          return <Box sx={{ p: 2, border: '1px dashed #ff0000', borderRadius: 1, mb: 2 }}>
            <Typography variant="body2" color="error">Ошибка рендеринга ShareButtons</Typography>
          </Box>;
        }
      case 'animated-box':
        try {
          return <AnimatedBox {...elementProps} />;
        } catch (error) {
          console.error('[MultiPagePreview] Error rendering AnimatedBox:', error);
          return <Box sx={{ p: 2, border: '1px dashed #ff0000', borderRadius: 1, mb: 2 }}>
            <Typography variant="body2" color="error">Ошибка рендеринга AnimatedBox</Typography>
          </Box>;
        }
      case 'progress-bars':
        try {
          // Если элемент редактируется, показываем его в режиме редактирования
          if (isCurrentlyEditing) {
            return (
              <ProgressBars 
                {...elementProps}
                onSave={handleElementSave}
                onCancel={handleElementCancel}
              />
            );
          }
          
          // В режиме просмотра показываем с карандашом
          return (
            <Box 
              sx={{ 
                position: 'relative',
                '&:hover .edit-progress-bars-btn': {
                  opacity: 1
                }
              }}
            >
              <ProgressBars {...elementProps} />
              {/* Иконка карандаша для редактирования */}
              <Tooltip title="Редактировать">
                <IconButton
                  className="edit-progress-bars-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Запускаем редактирование для ProgressBars
                    setEditingElement({ id: element.id, sectionId, element });
                  }}
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    color: '#1976d2',
                    opacity: 0,
                    transition: 'opacity 0.2s ease',
                    zIndex: 10,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 1)',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                    }
                  }}
                  size="small"
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          );
        } catch (error) {
          console.error('[MultiPagePreview] Error rendering ProgressBars:', error);
          return <Box sx={{ p: 2, border: '1px dashed #ff0000', borderRadius: 1, mb: 2 }}>
            <Typography variant="body2" color="error">Ошибка рендеринга ProgressBars</Typography>
          </Box>;
        }
        
      // Таблицы
      case 'data-table':
      case 'table':
        try {
          // Трансформируем данные для DataTable
          const tableProps = {
            ...elementProps,
            initialColumns: elementProps.headers ? elementProps.headers.map((header, index) => ({
              id: `col_${index}`,
              label: header,
              sortable: true
            })) : [
              { id: 'col_0', label: 'Название', sortable: true },
              { id: 'col_1', label: 'Значение', sortable: true }
            ],
            initialRows: elementProps.rows ? elementProps.rows.map((row, index) => {
              const rowObj = { id: index };
              row.forEach((cell, cellIndex) => {
                rowObj[`col_${cellIndex}`] = cell;
              });
              return rowObj;
            }) : []
          };
          
          // Если элемент редактируется, показываем его в режиме редактирования
          if (isCurrentlyEditing) {
            return (
              <DataTable 
                {...tableProps}
                onSave={handleElementSave}
                onCancel={handleElementCancel}
              />
            );
          }
          
          // В режиме просмотра показываем с карандашом
          return (
            <Box 
              sx={{ 
                position: 'relative',
                '&:hover .edit-data-table-btn': {
                  opacity: 1
                }
              }}
            >
              <DataTable {...tableProps} />
              {/* Иконка карандаша для редактирования */}
              <Tooltip title="Редактировать">
                <IconButton
                  className="edit-data-table-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Запускаем редактирование для DataTable
                    setEditingElement({ id: element.id, sectionId, element });
                  }}
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    color: '#1976d2',
                    opacity: 0,
                    transition: 'opacity 0.2s ease',
                    zIndex: 10,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 1)',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                    }
                  }}
                  size="small"
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          );
        } catch (error) {
          console.error('[MultiPagePreview] Error rendering DataTable:', error);
          return <Box sx={{ p: 2, border: '1px dashed #ff0000', borderRadius: 1, mb: 2 }}>
            <Typography variant="body2" color="error">Ошибка рендеринга DataTable</Typography>
          </Box>;
        }
        
      // Базовые графики
      case 'bar-chart':
      case 'chart':
        try {
          // Если элемент редактируется, показываем его в режиме редактирования
          if (isCurrentlyEditing) {
            return (
              <BarChart 
                {...elementProps}
                onSave={handleElementSave}
                onCancel={handleElementCancel}
              />
            );
          }
          
          // В режиме просмотра показываем с карандашом
          return (
            <Box 
              sx={{ 
                position: 'relative',
                '&:hover .edit-bar-chart-btn': {
                  opacity: 1
                }
              }}
            >
              <BarChart {...elementProps} />
              {/* Иконка карандаша для редактирования */}
              <Tooltip title="Редактировать">
                <IconButton
                  className="edit-bar-chart-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Запускаем редактирование для BarChart
                    setEditingElement({ id: element.id, sectionId, element });
                  }}
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    color: '#1976d2',
                    opacity: 0,
                    transition: 'opacity 0.2s ease',
                    zIndex: 10,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 1)',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                    }
                  }}
                  size="small"
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          );
        } catch (error) {
          console.error('[MultiPagePreview] Error rendering BarChart:', error);
          return <Box sx={{ p: 2, border: '1px dashed #ff0000', borderRadius: 1, mb: 2 }}>
            <Typography variant="body2" color="error">Ошибка рендеринга BarChart</Typography>
          </Box>;
        }
        
      // Расширенные графики Recharts
      case 'advanced-line-chart':
        try {
          // Специальная обработка для AdvancedLineChart
          const lineChartProps = {
            ...elementProps,
            title: elementProps.title || element.title || 'Линейный график',
            data: elementProps.data || element.data || [],
            showGrid: elementProps.showGrid !== undefined ? elementProps.showGrid : true,
            showLegend: elementProps.showLegend !== undefined ? elementProps.showLegend : true,
            
            // Поддержка colorSettings с fallback на старые настройки
            colorSettings: elementProps.colorSettings || element.colorSettings || element.data?.colorSettings || {},
            // 🔥 ИСПРАВЛЕНИЕ: Приоритет textFields.line1/line2 для цветов линий
            lineColors: elementProps.lineColors || [
              element.colorSettings?.textFields?.line1 || element.colorSettings?.lineColors?.line1 || element.lineColors?.[0] || element.data?.lineColors?.[0] || '#8884d8',
              element.colorSettings?.textFields?.line2 || element.colorSettings?.lineColors?.line2 || element.lineColors?.[1] || element.data?.lineColors?.[1] || '#82ca9d'
            ],
            titleColor: elementProps.titleColor || element.titleColor || element.data?.titleColor || '#1976d2',
            backgroundColor: elementProps.backgroundColor || element.backgroundColor || element.data?.backgroundColor || '#ffffff',
            gridColor: elementProps.gridColor || element.gridColor || element.data?.gridColor || '#e0e0e0',
            axisColor: elementProps.axisColor || element.axisColor || element.data?.axisColor || '#666666',
            legendColor: elementProps.legendColor || element.legendColor || element.data?.legendColor || '#333333',
            borderRadius: elementProps.borderRadius || element.borderRadius || element.data?.borderRadius || 8,
            padding: elementProps.padding || element.padding || element.data?.padding || 24,
            
            animationSettings: elementProps.animationSettings || element.animationSettings || {
              animationType: 'fadeIn',
              delay: 0,
              triggerOnView: true,
              triggerOnce: true,
              threshold: 0.1,
              disabled: false
            }
          };
          
          console.log('[MultiPagePreview] AdvancedLineChart props:', lineChartProps);
          
          // Если элемент редактируется, показываем его в режиме редактирования
          if (isCurrentlyEditing) {
            return (
              <AdvancedLineChart 
                {...lineChartProps}
                onSave={handleElementSave}
                onCancel={handleElementCancel}
              />
            );
          }
          
          // В режиме просмотра показываем с карандашом
          return (
            <Box 
              sx={{ 
                position: 'relative',
                '&:hover .edit-advanced-line-chart-btn': {
                  opacity: 1
                }
              }}
            >
              <AdvancedLineChart {...lineChartProps} />
              {/* Иконка карандаша для редактирования */}
              <Tooltip title="Редактировать">
                <IconButton
                  className="edit-advanced-line-chart-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Запускаем редактирование для AdvancedLineChart
                    setEditingElement({ id: element.id, sectionId, element });
                  }}
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    color: '#1976d2',
                    opacity: 0,
                    transition: 'opacity 0.2s ease',
                    zIndex: 10,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 1)',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                    }
                  }}
                  size="small"
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          );
        } catch (error) {
          console.error('[MultiPagePreview] Error rendering AdvancedLineChart:', error);
          return <Box sx={{ p: 2, border: '1px dashed #ff0000', borderRadius: 1, mb: 2 }}>
            <Typography variant="body2" color="error">Ошибка рендеринга AdvancedLineChart</Typography>
          </Box>;
        }
      case 'advanced-bar-chart':
        try {
          // Если элемент редактируется, показываем его в режиме редактирования
          if (isCurrentlyEditing) {
            return (
              <AdvancedBarChart 
                {...elementProps}
                onSave={handleElementSave}
                onCancel={handleElementCancel}
              />
            );
          }
          
          // В режиме просмотра показываем с карандашом
          return (
            <Box 
              sx={{ 
                position: 'relative',
                '&:hover .edit-advanced-bar-chart-btn': {
                  opacity: 1
                }
              }}
            >
              <AdvancedBarChart {...elementProps} />
              {/* Иконка карандаша для редактирования */}
              <Tooltip title="Редактировать">
                <IconButton
                  className="edit-advanced-bar-chart-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Запускаем редактирование для AdvancedBarChart
                    setEditingElement({ id: element.id, sectionId, element });
                  }}
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    color: '#1976d2',
                    opacity: 0,
                    transition: 'opacity 0.2s ease',
                    zIndex: 10,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 1)',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                    }
                  }}
                  size="small"
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          );
        } catch (error) {
          console.error('[MultiPagePreview] Error rendering AdvancedBarChart:', error);
          return <Box sx={{ p: 2, border: '1px dashed #ff0000', borderRadius: 1, mb: 2 }}>
            <Typography variant="body2" color="error">Ошибка рендеринга AdvancedBarChart</Typography>
          </Box>;
        }
            case 'advanced-pie-chart':
        try {
          // Убеждаемся, что все необходимые props передаются
          const pieChartProps = {
            ...elementProps,
            title: elementProps.title || element.title || 'Круговая диаграмма',
            data: elementProps.data || element.data || [],
            showLabels: elementProps.showLabels !== undefined ? elementProps.showLabels : true,
            showPercentage: elementProps.showPercentage !== undefined ? elementProps.showPercentage : true,
            pieColors: elementProps.pieColors || element.pieColors || ['#8884d8', '#82ca9d', '#ffc658', '#ff7300'],
            showLegend: elementProps.showLegend !== undefined ? elementProps.showLegend : true,
            chartSize: elementProps.chartSize || element.chartSize || 700,
            // Поддержка colorSettings с fallback на старые настройки
            colorSettings: element.colorSettings || element.data?.colorSettings || {},
            titleColor: element.data?.titleColor || element.titleColor || '#1976d2',
            backgroundColor: element.data?.backgroundColor || element.backgroundColor || '#ffffff',
            backgroundType: element.data?.backgroundType || element.backgroundType || 'solid',
            gradientStart: element.data?.gradientStart || element.gradientStart || '#f5f5f5',
            gradientEnd: element.data?.gradientEnd || element.gradientEnd || '#e0e0e0',
            gradientDirection: element.data?.gradientDirection || element.gradientDirection || 'to bottom',
            legendColor: element.data?.legendColor || element.legendColor || '#333333',
            borderRadius: element.data?.borderRadius || element.borderRadius || 1,
            padding: element.data?.padding || element.padding || 1,
            animationSettings: elementProps.animationSettings || element.animationSettings || {
              animationType: 'fadeIn',
              delay: 0,
              triggerOnView: true,
              triggerOnce: true,
              threshold: 0.1,
              disabled: false
            }
          };
          
          console.log('[MultiPagePreview] AdvancedPieChart props:', pieChartProps);
          
          // Если элемент редактируется, показываем его в режиме редактирования
          if (isCurrentlyEditing) {
            return (
              <AdvancedPieChart 
                {...pieChartProps}
                onSave={handleElementSave}
                onCancel={handleElementCancel}
              />
            );
          }
          
          // В режиме просмотра показываем с карандашом
          return (
            <Box 
              sx={{ 
                position: 'relative',
                '&:hover .edit-advanced-pie-chart-btn': {
                  opacity: 1
                }
              }}
            >
              <AdvancedPieChart {...pieChartProps} />
              {/* Иконка карандаша для редактирования */}
              <Tooltip title="Редактировать">
                <IconButton
                  className="edit-advanced-pie-chart-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Запускаем редактирование для AdvancedPieChart
                    setEditingElement({ id: element.id, sectionId, element });
                  }}
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    color: '#1976d2',
                    opacity: 0,
                    transition: 'opacity 0.2s ease',
                    zIndex: 10,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 1)',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                    }
                  }}
                  size="small"
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          );
        } catch (error) {
          console.error('[MultiPagePreview] Error rendering AdvancedPieChart:', error);
          return <Box sx={{ p: 2, border: '1px dashed #ff0000', borderRadius: 1, mb: 2 }}>
            <Typography variant="body2" color="error">Ошибка рендеринга AdvancedPieChart</Typography>
          </Box>;
        }
      case 'advanced-area-chart':
        try {
          // Специальная обработка для AdvancedAreaChart
          const areaChartProps = {
            ...elementProps,
            title: elementProps.title || elementProps.data?.title || 'Диаграмма с областями',
            data: elementProps.data || elementProps.chartData || [],
            showGrid: elementProps.showGrid !== undefined ? elementProps.showGrid : true,
            showLegend: elementProps.showLegend !== undefined ? elementProps.showLegend : true,
            stacked: elementProps.stacked !== undefined ? elementProps.stacked : true,
            areaNames: elementProps.areaNames || ['Область 1', 'Область 2'],
            
            // Поддержка colorSettings с fallback на старые настройки
            colorSettings: elementProps.colorSettings || element.colorSettings || element.data?.colorSettings || {},
            areaColors: elementProps.areaColors || element.areaColors || element.data?.areaColors || ['#8884d8', '#82ca9d'],
            titleColor: elementProps.titleColor || element.titleColor || element.data?.titleColor || '#1976d2',
            backgroundColor: elementProps.backgroundColor || element.backgroundColor || element.data?.backgroundColor || '#ffffff',
            gridColor: elementProps.gridColor || element.gridColor || element.data?.gridColor || '#e0e0e0',
            axisColor: elementProps.axisColor || element.axisColor || element.data?.axisColor || '#666666',
            legendColor: elementProps.legendColor || element.legendColor || element.data?.legendColor || '#333333',
            borderRadius: elementProps.borderRadius || element.borderRadius || element.data?.borderRadius || 8,
            padding: elementProps.padding || element.padding || element.data?.padding || 24,
            
            animationSettings: elementProps.animationSettings || {
              animationType: 'fadeIn',
              delay: 0,
              triggerOnView: true,
              triggerOnce: true,
              threshold: 0.1,
              disabled: false
            }
          };
          
          console.log('[MultiPagePreview] AdvancedAreaChart props:', areaChartProps);
          
          // Если элемент редактируется, показываем его в режиме редактирования
          if (isCurrentlyEditing) {
            return (
              <AdvancedAreaChart 
                {...areaChartProps}
                onSave={handleElementSave}
                onCancel={handleElementCancel}
              />
            );
          }
          
          // В режиме просмотра показываем с карандашом
          return (
            <Box 
              sx={{ 
                position: 'relative',
                '&:hover .edit-advanced-area-chart-btn': {
                  opacity: 1
                }
              }}
            >
              <AdvancedAreaChart {...areaChartProps} />
              {/* Иконка карандаша для редактирования */}
              <Tooltip title="Редактировать">
                <IconButton
                  className="edit-advanced-area-chart-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Запускаем редактирование для AdvancedAreaChart
                    setEditingElement({ id: element.id, sectionId, element });
                  }}
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    color: '#1976d2',
                    opacity: 0,
                    transition: 'opacity 0.2s ease',
                    zIndex: 10,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 1)',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                    }
                  }}
                  size="small"
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          );
        } catch (error) {
          console.error('[MultiPagePreview] Error rendering AdvancedAreaChart:', error);
          return <Box sx={{ p: 2, border: '1px dashed #ff0000', borderRadius: 1, mb: 2 }}>
            <Typography variant="body2" color="error">Ошибка рендеринга AdvancedAreaChart</Typography>
          </Box>;
        }
      case 'advanced-radar-chart':
        try {
          return <AdvancedRadarChart {...elementProps} />;
        } catch (error) {
          console.error('[MultiPagePreview] Error rendering AdvancedRadarChart:', error);
          return <Box sx={{ p: 2, border: '1px dashed #ff0000', borderRadius: 1, mb: 2 }}>
            <Typography variant="body2" color="error">Ошибка рендеринга AdvancedRadarChart</Typography>
          </Box>;
        }
        
      // Chart.js графики
      case 'chartjs-bar':
        try {
          // Специальная обработка для ChartJSBarChart
          const barChartProps = {
            ...elementProps,
            chartData: elementProps.data || elementProps.chartData, // Используем data как chartData
            title: elementProps.title || elementProps.data?.title || elementProps.chartData?.title,
            showLegend: elementProps.showLegend !== undefined ? elementProps.showLegend : true,
            animationSettings: elementProps.animationSettings || {
              animationType: 'scaleIn',
              delay: 0,
              triggerOnView: true,
              triggerOnce: true,
              threshold: 0.1,
              disabled: false
            }
          };
          
          console.log('[MultiPagePreview] ChartJSBarChart elementProps.title:', elementProps.title);
          console.log('[MultiPagePreview] ChartJSBarChart elementProps.chartData?.title:', elementProps.chartData?.title);
          console.log('[MultiPagePreview] ChartJSBarChart elementProps.data?.title:', elementProps.data?.title);
          console.log('[MultiPagePreview] ChartJSBarChart final title:', barChartProps.title);
          console.log('[MultiPagePreview] ChartJSBarChart props:', barChartProps);
          
          return <ChartJSBarChart {...barChartProps} />;
        } catch (error) {
          console.error('[MultiPagePreview] Error rendering ChartJSBarChart:', error);
          return <Box sx={{ p: 2, border: '1px dashed #ff0000', borderRadius: 1, mb: 2 }}>
            <Typography variant="body2" color="error">Ошибка рендеринга ChartJSBarChart</Typography>
          </Box>;
        }
      case 'chartjs-doughnut':
        try {
          // Специальная обработка для ChartJSDoughnutChart
          const doughnutProps = {
            ...elementProps,
            chartData: elementProps.data || elementProps.chartData, // Используем data как chartData
            title: elementProps.title || elementProps.chartData?.title,
            showLegend: elementProps.showLegend !== undefined ? elementProps.showLegend : true,
            titleColor: elementProps.titleColor || '#1976d2',
            backgroundColor: elementProps.backgroundColor || '#ffffff',
            backgroundType: elementProps.backgroundType || 'solid',
            gradientStart: elementProps.gradientStart || '#f5f5f5',
            gradientEnd: elementProps.gradientEnd || '#e0e0e0',
            gradientDirection: elementProps.gradientDirection || 'to bottom',
            borderRadius: elementProps.borderRadius || 1,
            padding: elementProps.padding || 1,
            chartSize: elementProps.chartSize || 700,
            cutout: elementProps.cutout || '30%',
            centerText: elementProps.centerText || '',
            showCenterText: elementProps.showCenterText || false,
            animationSettings: elementProps.animationSettings || {
              animationType: 'scaleIn',
              delay: 0,
              triggerOnView: true,
              triggerOnce: true,
              threshold: 0.1,
              disabled: false
            }
          };
          
          console.log('[MultiPagePreview] ChartJSDoughnutChart props:', doughnutProps);
          
          return <ChartJSDoughnutChart {...doughnutProps} />;
        } catch (error) {
          console.error('[MultiPagePreview] Error rendering ChartJSDoughnutChart:', error);
          return <Box sx={{ p: 2, border: '1px dashed #ff0000', borderRadius: 1, mb: 2 }}>
            <Typography variant="body2" color="error">Ошибка рендеринга ChartJSDoughnutChart</Typography>
          </Box>;
        }
        
      // ApexCharts графики
      case 'apex-line':
        try {
          return <ApexLineChart {...elementProps} />;
        } catch (error) {
          console.error('[MultiPagePreview] Error rendering ApexLineChart:', error);
          return <Box sx={{ p: 2, border: '1px dashed #ff0000', borderRadius: 1, mb: 2 }}>
            <Typography variant="body2" color="error">Ошибка рендеринга ApexLineChart</Typography>
          </Box>;
        }

        
      // Формы
      case 'advanced-contact-form':
        try {
          return <AdvancedContactForm {...elementProps} />;
        } catch (error) {
          console.error('[MultiPagePreview] Error rendering AdvancedContactForm:', error);
          return <Box sx={{ p: 2, border: '1px dashed #ff0000', borderRadius: 1, mb: 2 }}>
            <Typography variant="body2" color="error">Ошибка рендеринга AdvancedContactForm</Typography>
          </Box>;
        }
      case 'formik-registration':
        try {
          return <FormikRegistrationForm {...elementProps} />;
        } catch (error) {
          console.error('[MultiPagePreview] Error rendering FormikRegistrationForm:', error);
          return <Box sx={{ p: 2, border: '1px dashed #ff0000', borderRadius: 1, mb: 2 }}>
            <Typography variant="body2" color="error">Ошибка рендеринга FormikRegistrationForm</Typography>
          </Box>;
        }
      case 'react-select':
        try {
          return <ReactSelectComponent {...elementProps} />;
        } catch (error) {
          console.error('[MultiPagePreview] Error rendering ReactSelectComponent:', error);
          return <Box sx={{ p: 2, border: '1px dashed #ff0000', borderRadius: 1, mb: 2 }}>
            <Typography variant="body2" color="error">Ошибка рендеринга ReactSelectComponent</Typography>
          </Box>;
        }
      case 'date-picker':
        try {
          return <DatePickerComponent {...elementProps} />;
        } catch (error) {
          console.error('[MultiPagePreview] Error rendering DatePickerComponent:', error);
          return <Box sx={{ p: 2, border: '1px dashed #ff0000', borderRadius: 1, mb: 2 }}>
            <Typography variant="body2" color="error">Ошибка рендеринга DatePickerComponent</Typography>
          </Box>;
        }
      case 'stepper-form':
        try {
          return <StepperForm {...elementProps} />;
        } catch (error) {
          console.error('[MultiPagePreview] Error rendering StepperForm:', error);
          return <Box sx={{ p: 2, border: '1px dashed #ff0000', borderRadius: 1, mb: 2 }}>
            <Typography variant="body2" color="error">Ошибка рендеринга StepperForm</Typography>
          </Box>;
        }
        
      default:
        console.warn(`[MultiPagePreview] Unknown content element type: ${element.type}`);
        console.error(`[MultiPagePreview] Element data:`, element);
        return (
          <Box sx={{ p: 2, border: '1px dashed #ccc', borderRadius: 1, mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Неизвестный тип элемента: {element.type}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Данные элемента: {JSON.stringify(element.data, null, 2)}
            </Typography>
          </Box>
        );
    }
  };

  // Получаем список секций для навигации
  const sections = Object.entries(sectionsData || {}).map(([id, data]) => ({
    id,
    title: data.title || id,
    data
  }));

  // Создаем массив всех страниц
  const pages = [
    { id: 'index', title: 'Главная', icon: <HomeIcon /> },
    ...sections.map(section => ({
      id: section.id,
      title: section.title,
      icon: <MenuBookIcon />,
      data: section.data
    })),
    { id: 'contact', title: 'Контакты', icon: <ContactsIcon /> },
    ...(legalDocuments?.privacyPolicy?.content ? [{ id: 'privacy', title: 'Политика конфиденциальности', icon: <DescriptionIcon /> }] : []),
    ...(legalDocuments?.termsOfService?.content ? [{ id: 'terms', title: 'Условия использования', icon: <DescriptionIcon /> }] : []),
    ...(legalDocuments?.cookiePolicy?.content ? [{ id: 'cookies', title: 'Cookie политика', icon: <DescriptionIcon /> }] : []),
  ];

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
    setFadeKey(prev => prev + 1);
  };

  const currentPageData = pages.find(page => page.id === currentPage);

  // Функция для отображения хлебных крошек
  const renderBreadcrumbs = () => {
    if (currentPage === 'index') return null;
    
    return (
      <Breadcrumbs 
        aria-label="breadcrumb" 
        sx={{ 
          mb: 2,
          position: 'relative',
          zIndex: 10,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          padding: '8px 12px',
          borderRadius: '8px',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
        }}
      >
        <Link 
          color="inherit" 
          href="#" 
          onClick={(e) => { e.preventDefault(); setCurrentPage('index'); }}
          sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
        >
          <HomeIcon fontSize="inherit" />
          Главная
        </Link>
        <Typography color="textPrimary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          {currentPageData?.icon}
          {currentPageData?.title}
        </Typography>
      </Breadcrumbs>
    );
  };

  // Функция для отображения главной страницы (главная)
  const renderIndexPage = () => {
    // Упрощаем логику условий
    const homePageSettings = heroData.homePageSettings || {};
    const shouldShowFeatured = homePageSettings.showFeaturedSection && homePageSettings.featuredSectionId;
    const shouldShowSectionsPreview = homePageSettings.showSectionsPreview;
    const shouldShowContactPreview = homePageSettings.showContactPreview && contactData;
    // Показываем обычные разделы только если НЕ включен выделенный раздел И НЕ включено превью разделов
    const shouldShowRegularSections = !shouldShowFeatured && !shouldShowSectionsPreview;
    
    console.log('🔍 [MultiPagePreview] renderIndexPage - Settings:', {
      shouldShowFeatured,
      shouldShowSectionsPreview,
      shouldShowContactPreview,
      shouldShowRegularSections
    });

    return (
      <PageContainer>
        <Header 
          headerData={headerData} 
          onMenuClick={(id) => setCurrentPage(id)}
          contactData={contactData}
        />
        <PageContent>
          <Container maxWidth={false} sx={{ maxWidth: '100%', px: 2 }}>
            {renderBreadcrumbs()}
            <HeroSection 
              title={heroData.title}
              subtitle={heroData.subtitle}
              backgroundType={heroData.backgroundType}
              backgroundImage={heroImageUrl || heroData.backgroundImage}
              backgroundColor={heroData.backgroundColor}
              gradientColor1={heroData.gradientColor1}
              gradientColor2={heroData.gradientColor2}
              gradientDirection={heroData.gradientDirection}
              titleColor={heroData.titleColor}
              subtitleColor={heroData.subtitleColor}
              animationType={heroData.animationType}
              enableOverlay={heroData.enableOverlay}
              overlayOpacity={heroData.overlayOpacity}
              enableBlur={heroData.enableBlur}
              blurAmount={heroData.blurAmount}
            />
          
          {/* Выделенный раздел в полном виде */}
          {shouldShowFeatured && (
            <Box sx={{ mt: 6 }}>
              {(() => {
                const featuredSection = sections.find(s => s.id === heroData.homePageSettings.featuredSectionId);
                if (!featuredSection) return null;
                
                return (
                  <Box>
                    <Typography variant="h4" gutterBottom sx={{ 
                      color: featuredSection.data?.titleColor || '#1976d2', 
                      textAlign: 'center' 
                    }}>
                      {featuredSection.title}
                    </Typography>
                    {featuredSection.data?.description && (
                      <Typography 
                        variant="h6" 
                        component="p" 
                        sx={{ 
                          mb: 4, 
                          textAlign: 'center',
                          color: featuredSection.data?.descriptionColor || '#666',
                          maxWidth: '1200px',
                          margin: '0 auto 2rem auto'
                        }}
                      >
                        {featuredSection.data.description}
                      </Typography>
                    )}
                    {featuredSection.data?.elements && featuredSection.data.elements.length > 0 ? (
                      <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                          <Button
                            variant="contained"
                            size="small"
                            startIcon={<AddIcon />}
                            onClick={() => handleOpenLibrary(featuredSection.id)}
                            sx={{ borderRadius: 2 }}
                          >
                            Добавить элемент
                          </Button>
                        </Box>
                        {featuredSection.data.elements.map((element) => (
                          <Box 
                            key={element.id} 
                            sx={{ 
                              mb: 3,
                              position: 'relative',
                              '&:hover .delete-element-btn': {
                                opacity: 1
                              }
                            }}
                          >
                      {/* Кнопка удаления элемента */}
                      <IconButton
                        className="delete-element-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleElementDelete(featuredSection.id, element.id);
                        }}
                        sx={{
                          position: 'absolute',
                          top: 44,
                          right: 8,
                          zIndex: 1000,
                          backgroundColor: 'rgba(211, 47, 47, 0.9)',
                          color: 'white',
                          opacity: 0,
                          transition: 'opacity 0.2s ease',
                          '&:hover': {
                            backgroundColor: 'rgba(211, 47, 47, 1)',
                            opacity: 1
                          },
                          width: 28,
                          height: 28,
                          padding: 0
                        }}
                        size="small"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                            {renderContentElement(element, featuredSection.id, featuredSection)}
                          </Box>
                        ))}
                      </Box>
                    ) : (
                      <Box sx={{ textAlign: 'center', py: 4 }}>
                        <Typography variant="h6" sx={{ color: '#666', mb: 2 }}>
                          Пока нет элементов контента
                        </Typography>
                        <Button
                          variant="outlined"
                          startIcon={<LibraryBooksIcon />}
                          onClick={() => handleOpenLibrary(featuredSection.id)}
                          sx={{ borderRadius: 2 }}
                        >
                          Добавить первый элемент
                        </Button>
                      </Box>
                    )}
                  </Box>
                );
              })()}
            </Box>
          )}
          
          {/* Превью разделов */}
          {shouldShowSectionsPreview && (
            <SectionsPreview 
              sectionsData={sectionsData}
              headerData={headerData}
              homePageSettings={heroData.homePageSettings}
            />
          )}
          
          {/* Превью контактов */}
          {shouldShowContactPreview && (
            <ContactPreview 
              contactData={contactData}
            />
          )}
          {console.log('[MultiPagePreview] 🏗️ HeroSection rendered with:', {
            backgroundType: heroData.backgroundType,
            backgroundImage: heroImageUrl || heroData.backgroundImage,
            heroImageUrl,
            originalBackgroundImage: heroData.backgroundImage
          })}
          
          {/* Кнопка добавления элементов для Hero секции */}
          <Box sx={{ mt: 2, mb: 4, textAlign: 'center' }}>
            <Button
              variant="outlined"
              startIcon={<LibraryBooksIcon />}
              onClick={() => handleOpenLibrary('hero')}
              sx={{ borderRadius: 2 }}
            >
              Добавить элемент в Hero секцию
            </Button>
          </Box>
          
          {/* Обычные секции - показываем только если не включено превью разделов */}
          {shouldShowRegularSections && sections.map((section) => {
            console.log(`[MultiPagePreview] 🔍 Processing section:`, section.id, 'data:', section.data);
            console.log(`[MultiPagePreview] 🔍 Section elements:`, section.data?.elements);
            return (
            <Box key={section.id} sx={{ mt: 6 }}>
              <Typography variant="h4" gutterBottom sx={{ color: '#1976d2', textAlign: 'center' }}>
                {section.title}
              </Typography>
              {section.data?.elements && section.data.elements.length > 0 ? (
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<AddIcon />}
                      onClick={() => handleOpenLibrary(section.id)}
                      sx={{ borderRadius: 2 }}
                    >
                      Добавить элемент
                    </Button>
                  </Box>
                  {section.data.elements.map((element) => (
                    <Box 
                      key={`${section.id}-${element.id}`} 
                      sx={{ 
                        mb: 3,
                        position: 'relative',
                        '&:hover .delete-element-btn': {
                          opacity: 1
                        }
                      }}
                    >
                      {/* Кнопка удаления элемента */}
                      <IconButton
                        className="delete-element-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleElementDelete(section.id, element.id);
                        }}
                        sx={{
                          position: 'absolute',
                          top: 44,
                          right: 8,
                          zIndex: 1000,
                          backgroundColor: 'rgba(211, 47, 47, 0.9)',
                          color: 'white',
                          opacity: 0,
                          transition: 'opacity 0.2s ease',
                          '&:hover': {
                            backgroundColor: 'rgba(211, 47, 47, 1)',
                            opacity: 1
                          },
                          width: 28,
                          height: 28,
                          padding: 0
                        }}
                        size="small"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                      {renderContentElement(element, section.id, section)}
                    </Box>
                  ))}
                </Box>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="h6" sx={{ color: '#666', mb: 2 }}>
                    Пока нет элементов контента
                  </Typography>
                  <Button
                    variant="outlined"
                    startIcon={<LibraryBooksIcon />}
                    onClick={() => handleOpenLibrary(section.id)}
                    sx={{ borderRadius: 2 }}
                  >
                    Добавить первый элемент
                  </Button>
                </Box>
              )}
            </Box>
            );
          })}
        </Container>
      </PageContent>
      <FooterSection 
        footerData={footerData}
        contactData={contactData}
        legalDocuments={legalDocuments}
        headerData={headerData}
      />
    </PageContainer>
    );
  };

  // Функция для отображения страницы секции
  const renderSectionPage = (sectionData, sectionId) => (
    <PageContainer>
      <Header 
        headerData={headerData} 
        onMenuClick={(id) => setCurrentPage(id)}
        contactData={contactData}
      />
      <PageContent>
        <Container maxWidth={false} sx={{ maxWidth: '100%', px: 2, position: 'relative' }}>
          {renderBreadcrumbs()}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: (contactData?.titleTextAlign || sectionData?.titleTextAlign || 'center') === 'left' ? 'flex-start' :
                          (contactData?.titleTextAlign || sectionData?.titleTextAlign || 'center') === 'right' ? 'flex-end' : 'center',
            gap: 1,
            mb: 2,
            width: '100%'
          }}>
            <Box sx={{
              maxWidth: (contactData?.titleTextAlign || sectionData?.titleTextAlign || 'center') === 'center' ? '800px' : '100%',
              width: '100%'
            }}>
              <Typography 
                variant="h2" 
                component="h1" 
                sx={{ 
                  mb: 0, 
                  textAlign: contactData?.titleTextAlign || sectionData?.titleTextAlign || 'center',
                  color: contactData?.titleColor || sectionData?.titleColor || '#1976d2',
                  fontSize: contactData?.titleFontSize || sectionData?.titleFontSize || 'inherit',
                  fontFamily: contactData?.titleFontFamily || sectionData?.titleFontFamily || 'inherit',
                  fontWeight: contactData?.titleFontWeight || sectionData?.titleFontWeight || 'inherit',
                  fontStyle: contactData?.titleFont === 'italic' ? 'italic' : 'normal',
                  width: '100%'
                }}
              >
                {sectionData?.title}
              </Typography>
            </Box>
            {sectionId && (
              <SectionTextSettings
                label="заголовка"
                color={contactData?.titleColor || sectionData?.titleColor || '#1976d2'}
                textAlign={contactData?.titleTextAlign || sectionData?.titleTextAlign || 'center'}
                fontSize={contactData?.titleFontSize || sectionData?.titleFontSize}
                fontFamily={contactData?.titleFontFamily || sectionData?.titleFontFamily}
                fontWeight={contactData?.titleFontWeight || sectionData?.titleFontWeight}
                fontStyle={contactData?.titleFont || sectionData?.titleFont || 'default'}
                onChangeColor={(color) => {
                  const updatedSections = { ...sectionsData };
                  updatedSections[sectionId] = { ...sectionData, titleColor: color };
                  onSectionsChange(updatedSections);
                  onContactChange({ ...contactData, titleColor: color });
                }}
                onChangeAlign={(align) => {
                  onContactChange({ ...contactData, titleTextAlign: align });
                }}
                onChangeFontSize={(size) => {
                  onContactChange({ ...contactData, titleFontSize: size });
                }}
                onChangeFontFamily={(family) => {
                  onContactChange({ ...contactData, titleFontFamily: family });
                }}
                onChangeFontWeight={(weight) => {
                  onContactChange({ ...contactData, titleFontWeight: weight });
                }}
                onChangeFontStyle={(style) => {
                  onContactChange({ ...contactData, titleFont: style });
                }}
              />
            )}
          </Box>
          {sectionData?.description && (
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: (contactData?.descriptionTextAlign || sectionData?.descriptionTextAlign || 'center') === 'left' ? 'flex-start' :
                            (contactData?.descriptionTextAlign || sectionData?.descriptionTextAlign || 'center') === 'right' ? 'flex-end' : 'center',
              gap: 1,
              mb: 2,
              width: '100%'
            }}>
              <Box sx={{
                maxWidth: (contactData?.descriptionTextAlign || sectionData?.descriptionTextAlign || 'center') === 'center' ? '800px' : '100%',
                width: '100%'
              }}>
                <Typography 
                  variant="h6" 
                  component="p" 
                  sx={{ 
                    mb: 0, 
                    textAlign: contactData?.descriptionTextAlign || sectionData?.descriptionTextAlign || 'center',
                    color: contactData?.descriptionColor || sectionData?.descriptionColor || '#666',
                    fontSize: contactData?.descriptionFontSize || sectionData?.descriptionFontSize || 'inherit',
                    fontFamily: contactData?.descriptionFontFamily || sectionData?.descriptionFontFamily || 'inherit',
                    fontWeight: contactData?.descriptionFontWeight || sectionData?.descriptionFontWeight || 'inherit',
                    fontStyle: contactData?.textFont === 'italic' ? 'italic' : 'normal',
                    width: '100%'
                  }}
                >
                  {sectionData.description}
                </Typography>
              </Box>
              {sectionId && (
                <SectionTextSettings
                  label="описания"
                  color={contactData?.descriptionColor || sectionData?.descriptionColor || '#666666'}
                  textAlign={contactData?.descriptionTextAlign || sectionData?.descriptionTextAlign || 'center'}
                  fontSize={contactData?.descriptionFontSize || sectionData?.descriptionFontSize}
                  fontFamily={contactData?.descriptionFontFamily || sectionData?.descriptionFontFamily}
                  fontWeight={contactData?.descriptionFontWeight || sectionData?.descriptionFontWeight}
                  fontStyle={contactData?.textFont || sectionData?.textFont || 'default'}
                  onChangeColor={(color) => {
                    const updatedSections = { ...sectionsData };
                    updatedSections[sectionId] = { ...sectionData, descriptionColor: color };
                    onSectionsChange(updatedSections);
                    onContactChange({ ...contactData, descriptionColor: color });
                  }}
                  onChangeAlign={(align) => {
                    onContactChange({ ...contactData, descriptionTextAlign: align });
                  }}
                  onChangeFontSize={(size) => {
                    onContactChange({ ...contactData, descriptionFontSize: size });
                  }}
                  onChangeFontFamily={(family) => {
                    onContactChange({ ...contactData, descriptionFontFamily: family });
                  }}
                  onChangeFontWeight={(weight) => {
                    onContactChange({ ...contactData, descriptionFontWeight: weight });
                  }}
                  onChangeFontStyle={(style) => {
                    onContactChange({ ...contactData, textFont: style });
                  }}
                />
              )}
            </Box>
          )}
          
          {/* Отображение карточек секции */}
          {sectionData?.cards && sectionData.cards.length > 0 && (
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
              gap: 3,
              mt: 4 
            }}>
              {sectionData.cards.map((card, index) => (
                <Paper key={card.id || index} sx={{ p: 3, background: card.backgroundColor || sectionData?.backgroundColor || 'rgba(0,0,0,0.85)', color: card.contentColor || sectionData?.contentColor || '#fff' }}>
                  {card.title && (
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        mb: 2, 
                        color: card.titleColor || sectionData?.titleColor || '#ffd700' 
                      }}
                    >
                      {card.title}
                    </Typography>
                  )}
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: card.contentColor || sectionData?.contentColor || '#fff',
                      whiteSpace: 'pre-wrap'
                    }}
                  >
                    {card.content}
                  </Typography>
                </Paper>
              ))}
            </Box>
          )}
          
          {/* Отображение элементов контента */}
          {sectionData?.contentElements && sectionData.contentElements.length > 0 && (
            <Box sx={{ 
              mt: 4,
              // НЕ применяем sectionBackground из элементов к секции
              // sectionBackground должен применяться только к отдельным элементам
              borderRadius: '16px',
              padding: '24px',
              backgroundColor: 'transparent' // Убираем фиксированный фон секции
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" sx={{ color: '#1976d2' }}>
                  Элементы контента
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => handleOpenLibrary(sectionData.id)}
                  sx={{ borderRadius: 2 }}
                >
                  Добавить элемент
                </Button>
              </Box>
              {console.log(`[MultiPagePreview] Section ${sectionData.id} has ${sectionData.contentElements.length} content elements:`, sectionData.contentElements)}
              {sectionData.contentElements.map((element) => (
                <Box 
                  key={`${sectionData.id}-${element.id}`} 
                  sx={{ 
                    mb: 3,
                    position: 'relative',
                    '&:hover .delete-element-btn': {
                      opacity: 1
                    }
                  }}
                >
                  {/* Кнопка удаления элемента */}
                  <IconButton
                    className="delete-element-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleElementDelete(sectionData.id, element.id);
                    }}
                    sx={{
                      position: 'absolute',
                      top: 44,
                      right: 8,
                      zIndex: 1000,
                      backgroundColor: 'rgba(211, 47, 47, 0.9)',
                      color: 'white',
                      opacity: 0,
                      transition: 'opacity 0.2s ease',
                      '&:hover': {
                        backgroundColor: 'rgba(211, 47, 47, 1)',
                        opacity: 1
                      },
                      width: 28,
                      height: 28,
                      padding: 0
                    }}
                    size="small"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                  {renderContentElement(element, sectionData.id, sectionData)}
                </Box>
              ))}
            </Box>
          )}
          
          {/* Кнопка добавления элементов для секций без элементов */}
          {(!sectionData?.contentElements || sectionData.contentElements.length === 0) && (
            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <Typography variant="h6" sx={{ color: '#666', mb: 2 }}>
                Пока нет элементов контента
              </Typography>
              <Button
                variant="outlined"
                size="large"
                startIcon={<LibraryBooksIcon />}
                onClick={() => handleOpenLibrary(sectionData.id)}
                sx={{ borderRadius: 2 }}
              >
                Добавить первый элемент
              </Button>
            </Box>
          )}
        </Container>
      </PageContent>
      <FooterSection 
        footerData={footerData}
        contactData={contactData}
        legalDocuments={legalDocuments}
        headerData={headerData}
      />
    </PageContainer>
  );

  // Функция для отображения страницы контактов
  const renderContactPage = () => (
    <PageContainer>
      <Header 
        headerData={headerData} 
        onMenuClick={(id) => setCurrentPage(id)}
        contactData={contactData}
      />
      <PageContent>
        <Container maxWidth={false} sx={{ maxWidth: '100%', px: 2, position: 'relative' }}>
          {renderBreadcrumbs()}
          <ContactSection 
            contactData={contactData}
            showBorders={false}
            titleColorPicker={
              <ContactColorPicker
                label="Цвет заголовка"
                color={contactData?.titleColor || '#1976d2'}
                onChange={(color) => onContactChange({ ...contactData, titleColor: color })}
              />
            }
            descriptionColorPicker={
              <ContactColorPicker
                label="Цвет описания"
                color={contactData?.descriptionColor || '#666666'}
                onChange={(color) => onContactChange({ ...contactData, descriptionColor: color })}
              />
            }
          />
        </Container>
      </PageContent>
      <FooterSection 
        footerData={footerData}
        contactData={contactData}
        legalDocuments={legalDocuments}
        headerData={headerData}
      />
    </PageContainer>
  );

  // Функция для отображения правовых документов
  const renderLegalPage = (docType) => {
    const docs = {
      privacy: legalDocuments?.privacyPolicy,
      terms: legalDocuments?.termsOfService,
      cookies: legalDocuments?.cookiePolicy
    };
    
    const doc = docs[docType];
    if (!doc?.content) return null;

    return (
      <PageContainer>
        <Header 
          headerData={headerData} 
          onMenuClick={(id) => setCurrentPage(id)}
          contactData={contactData}
        />
        <PageContent>
          <Container maxWidth={false} sx={{ maxWidth: '100%', px: 2 }}>
            {renderBreadcrumbs()}
            <Paper sx={{ p: 4 }}>
              <Typography variant="h3" component="h1" sx={{ mb: 3, textAlign: 'center' }}>
                {doc.title}
              </Typography>
              <Divider sx={{ mb: 3 }} />
              <Typography 
                variant="body1" 
                sx={{ 
                  lineHeight: 1.8,
                  '& p': { mb: 2 },
                  '& h1, & h2, & h3': { mt: 3, mb: 2 },
                  '& ul, & ol': { ml: 2, mb: 2 }
                }}
                dangerouslySetInnerHTML={{ __html: doc.content.replace(/\n/g, '<br />') }}
              />
            </Paper>
          </Container>
        </PageContent>
        <FooterSection 
          footerData={footerData}
          contactData={contactData}
          legalDocuments={legalDocuments}
          headerData={headerData}
        />
      </PageContainer>
    );
  };

  // Функция для отображения текущей страницы
  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'index':
        return renderIndexPage();
      case 'contact':
        return renderContactPage();
      case 'privacy':
        return renderLegalPage('privacy');
      case 'terms':
        return renderLegalPage('terms');
      case 'cookies':
        return renderLegalPage('cookies');
      default:
        const section = sections.find(s => s.id === currentPage);
        const sectionData = section?.data;
        return sectionData ? renderSectionPage(sectionData, section.id) : renderIndexPage();
    }
  };

  return (
    <Box 
      className="multipage-preview-container"
      sx={{ 
        height: '100%', 
        minHeight: '100vh',
        display: 'flex', 
        flexDirection: 'column', 
        position: 'relative',
        width: '100%'
      }}
    >
      {/* Навигационная панель временно отключена */}
      
      {/* Содержимое страницы */}
      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        <Fade key={fadeKey} in={true} timeout={300}>
          <Box>
            {renderCurrentPage()}
          </Box>
        </Fade>
      </Box>
      
      {/* Live Chat Widget */}
      {liveChatData?.enabled && (
        <LiveChatWidget 
          siteName={headerData?.siteName || 'Мой сайт'} 
          apiKey={liveChatData?.apiKey || ''} 
        />
      )}
      
      {/* Floating Action Button для быстрого доступа к библиотеке */}
      <Fab
        color="primary"
        aria-label="add element"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          zIndex: 1000
        }}
        onClick={() => {
          // Если находимся на странице секции, открываем библиотеку для этой секции
          const currentSection = sections.find(s => s.id === currentPage);
          if (currentSection) {
            handleOpenLibrary(currentPage);
          } else {
            // Иначе просто открываем панель
            setDrawerOpen(true);
          }
        }}
      >
        <LibraryBooksIcon />
      </Fab>
      
      {/* Боковая панель с библиотекой элементов */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setCurrentSectionId(null);
        }}
        PaperProps={{
          sx: {
            width: '500px',
            maxWidth: '95vw'
          }
        }}
      >
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ color: '#1976d2', fontWeight: 'bold' }}>
              📚 Библиотека элементов
            </Typography>
            <IconButton
              onClick={() => {
                setDrawerOpen(false);
                setCurrentSectionId(null);
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
          
          {currentSectionId && (
            <Box sx={{ mb: 2, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Добавление элемента в секцию:
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                {currentSectionId === 'hero' ? 'Hero секция' : 
                 sections.find(s => s.id === currentSectionId)?.title || currentSectionId}
              </Typography>
            </Box>
          )}
          
          <ContentElementsLibrary
            onAddElement={handleAddElement}
          />
        </Box>
      </Drawer>
    </Box>
  );
};

// Компонент для превью выделенного раздела
const FeaturedSectionPreview = ({ featuredSectionId, sectionsData, headerData }) => {
  const featuredSection = sectionsData[featuredSectionId];
  
  if (!featuredSection) {
    return null;
  }
  
  const sectionTitle = featuredSection.title || featuredSectionId;
  const sectionDescription = featuredSection.description || '';
  
  // Получаем настройки цветов секции
  const sectionColorSettings = featuredSection.colorSettings || {};
  const titleColor = sectionColorSettings?.textFields?.title || '#1a237e';
  const descriptionColor = sectionColorSettings?.textFields?.description || '#455a64';
  const contentColor = sectionColorSettings?.textFields?.content || '#455a64';
  
  // Получаем изображения секции
  const hasImages = Array.isArray(featuredSection.images) && featuredSection.images.length > 0;
  const hasSingleImage = featuredSection.imagePath && !hasImages;
  
  return (
    <Box sx={{ 
      padding: '4rem 0',
      background: sectionColorSettings?.sectionBackground?.enabled ? 
        (sectionColorSettings.sectionBackground.useGradient ? 
          `linear-gradient(${sectionColorSettings.sectionBackground.gradientDirection}, ${sectionColorSettings.sectionBackground.gradientColor1}, ${sectionColorSettings.sectionBackground.gradientColor2})` :
          sectionColorSettings.sectionBackground.solidColor) : 
        '#f8f9fa',
      margin: 0
    }}>
      <Container maxWidth="lg">
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: hasImages || hasSingleImage ? '1fr 1fr' : '1fr',
          gap: '3rem',
          alignItems: 'center'
        }}>
          <Box>
            <Typography variant="h2" sx={{
              color: titleColor,
              fontSize: '2.5rem',
              fontWeight: 700,
              marginBottom: '1.5rem',
              fontFamily: 'Montserrat, sans-serif'
            }}>
              {sectionTitle}
            </Typography>
            
            {sectionDescription && (
              <Typography sx={{
                color: descriptionColor,
                fontSize: '1.2rem',
                lineHeight: 1.6,
                marginBottom: '2rem',
                fontFamily: 'Montserrat, sans-serif'
              }}>
                {sectionDescription}
              </Typography>
            )}
            
            <Box sx={{ color: contentColor, fontFamily: 'Montserrat, sans-serif' }}>
              {/* Здесь можно добавить элементы контента */}
            </Box>
            
            <Box sx={{ marginTop: '2rem' }}>
              <Button 
                variant="contained" 
                sx={{
                  padding: '1rem 2rem',
                  background: '#1976d2',
                  color: 'white',
                  borderRadius: '8px',
                  fontWeight: 600,
                  '&:hover': {
                    background: '#1565c0',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(25, 118, 210, 0.3)'
                  }
                }}
              >
                Подробнее о {sectionTitle}
              </Button>
            </Box>
          </Box>
          
          {(hasImages || hasSingleImage) && (
            <Box>
              {hasImages ? (
                featuredSection.images.map((image, index) => (
                  <Box key={index} sx={{
                    borderRadius: '15px',
                    overflow: 'hidden',
                    boxShadow: '0 15px 35px rgba(0,0,0,0.1)',
                    marginBottom: '1rem'
                  }}>
                    <img 
                      src={image.url || image} 
                      alt={image.alt || sectionTitle} 
                      style={{
                        width: '100%',
                        height: 'auto',
                        display: 'block',
                        transition: 'transform 0.3s ease'
                      }}
                    />
                  </Box>
                ))
              ) : (
                <Box sx={{
                  borderRadius: '15px',
                  overflow: 'hidden',
                  boxShadow: '0 15px 35px rgba(0,0,0,0.1)'
                }}>
                  <img 
                    src={featuredSection.imagePath} 
                    alt={sectionTitle} 
                    style={{
                      width: '100%',
                      height: 'auto',
                      display: 'block',
                      transition: 'transform 0.3s ease'
                    }}
                  />
                </Box>
              )}
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
};

// Компонент для превью разделов
const SectionsPreview = ({ sectionsData, headerData, homePageSettings }) => {
  console.log('🔍 [SectionsPreview] RENDER START');
  console.log('🔍 [SectionsPreview] sectionsData:', sectionsData);
  console.log('🔍 [SectionsPreview] homePageSettings:', homePageSettings);
  
  const maxSections = homePageSettings.maxSectionsToShow || 6;
  const displayMode = homePageSettings.sectionsDisplayMode || 'cards';
  
  console.log('🔍 [SectionsPreview] maxSections:', maxSections);
  console.log('🔍 [SectionsPreview] displayMode:', displayMode);
  
  // Фильтруем разделы (исключаем выделенный раздел и проверку возраста)
  const filteredSections = Object.entries(sectionsData).filter(([sectionId, sectionData]) => {
    // Исключаем выделенный раздел
    const isNotFeatured = sectionId !== homePageSettings.featuredSectionId;
    console.log(`🔍 [SectionsPreview] Section ${sectionId} is not featured:`, isNotFeatured);
    
    if (!isNotFeatured) {
      return false;
    }
    
    // Исключаем раздел проверки возраста
    if (sectionId === 'age-verification' || 
        sectionData.title?.toLowerCase().includes('подтверждение возраста') ||
        sectionData.title?.toLowerCase().includes('проверка возраста') ||
        sectionData.title?.toLowerCase().includes('age verification') ||
        sectionData.ageVerificationData) {
      console.log('🔞 [SectionsPreview] Исключаем раздел проверки возраста из превью:', sectionId, sectionData.title);
      return false;
    }
    
    return true;
  }).slice(0, maxSections);
  
  console.log('🔍 [SectionsPreview] filteredSections:', filteredSections);
  console.log('🔍 [SectionsPreview] filteredSections.length:', filteredSections.length);
  
  if (filteredSections.length === 0) {
    console.log('🔍 [SectionsPreview] No sections to show, returning null');
    return null;
  }
  
  const getGridClass = () => {
    return {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '2rem'
    };
  };
  
  const getCardStyle = () => {
    return {
      background: 'white',
      borderRadius: '15px',
      padding: '2rem',
      boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
      transition: 'all 0.3s ease',
      border: '1px solid #e9ecef',
      '&:hover': {
        transform: 'translateY(-10px)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
      }
    };
  };
  
  return (
    <Box sx={{ padding: '4rem 0', background: 'transparent' }}>
      <Container maxWidth="lg">
        <Typography variant="h2" sx={{
          textAlign: 'center',
          fontSize: '2.5rem',
          marginBottom: '3rem',
          color: '#2c3e50',
          fontFamily: 'Montserrat, sans-serif'
        }}>
          Наши разделы
        </Typography>
        
        <Box sx={getGridClass()}>
          {filteredSections.map(([sectionId, sectionData]) => {
            const displayName = sectionData.title || sectionId;
            
            // Получаем изображение для карточки
            const cardImage = sectionData.imagePath || 
                             (Array.isArray(sectionData.images) && sectionData.images.length > 0 ? sectionData.images[0].url || sectionData.images[0] : '') ||
                             '';
            
            // Стандартный рендеринг для карточек
            return (
              <Box key={sectionId} sx={getCardStyle()}>
                {cardImage && (
                  <Box sx={{
                    width: '100%',
                    height: '150px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    marginBottom: '1rem'
                  }}>
                    <img 
                      src={cardImage} 
                      alt={displayName} 
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  </Box>
                )}
                
                <Box>
                  <Typography variant="h3" sx={{
                    color: '#2c3e50',
                    fontSize: '1.5rem',
                    marginBottom: '0.5rem'
                  }}>
                    {displayName}
                  </Typography>
                  
                  <Typography sx={{
                    color: '#6c757d',
                    lineHeight: 1.5,
                    marginBottom: '1rem',
                    fontSize: '1rem'
                  }}>
                    {sectionData.description || 'Узнайте больше в этом разделе'}
                  </Typography>
                  
                  <Button 
                    variant="contained" 
                    sx={{
                      background: '#007bff',
                      color: 'white',
                      padding: '0.75rem 1.5rem',
                      borderRadius: '8px',
                      fontWeight: 500,
                      textTransform: 'none',
                      '&:hover': {
                        background: '#0056b3',
                        transform: 'translateY(-2px)'
                      }
                    }}
                    onClick={() => onSectionClick(sectionId)}
                  >
                    ...
                  </Button>
                </Box>
              </Box>
            );
          })}
        </Box>
      </Container>
    </Box>
  );
};

// Компонент для превью контактов
const ContactPreview = ({ contactData }) => {
  console.log('🔍 [ContactPreview] RENDER START');
  console.log('🔍 [ContactPreview] contactData:', contactData);
  
  return (
    <Box sx={{ padding: '4rem 0', background: 'transparent' }}>
      <Container maxWidth="lg">
        <Box sx={{
          textAlign: 'center',
          padding: '3rem',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '20px',
          color: 'white'
        }}>
          <Typography variant="h2" sx={{
            fontSize: '2.5rem',
            marginBottom: '1.5rem',
            fontFamily: 'Montserrat, sans-serif'
          }}>
            {contactData.title || 'Свяжитесь с нами'}
          </Typography>
          
          <Typography sx={{
            fontSize: '1.2rem',
            marginBottom: '2rem',
            opacity: 0.9,
            fontFamily: 'Montserrat, sans-serif'
          }}>
            {contactData.description || 'Мы всегда готовы ответить на ваши вопросы'}
          </Typography>
          
          <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: '3rem',
            marginBottom: '2rem',
            flexWrap: 'wrap'
          }}>
            {contactData.phone && (
              <Box>
                <Typography sx={{ fontWeight: 'bold' }}>Телефон:</Typography>
                <Typography component="a" href={`tel:${contactData.phone}`} sx={{
                  color: 'white',
                  textDecoration: 'none'
                }}>
                  {contactData.phone}
                </Typography>
              </Box>
            )}
            
            {contactData.email && (
              <Box>
                <Typography sx={{ fontWeight: 'bold' }}>Email:</Typography>
                <Typography component="a" href={`mailto:${contactData.email}`} sx={{
                  color: 'white',
                  textDecoration: 'none'
                }}>
                  {contactData.email}
                </Typography>
              </Box>
            )}
          </Box>
          
          <Button 
            variant="contained" 
            sx={{
              padding: '1rem 2rem',
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              borderRadius: '8px',
              fontWeight: 600,
              border: '2px solid rgba(255,255,255,0.3)',
              '&:hover': {
                background: 'rgba(255,255,255,0.3)',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 25px rgba(255,255,255,0.2)'
              }
            }}
          >
            Перейти к контактам
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default MultiPagePreview; 