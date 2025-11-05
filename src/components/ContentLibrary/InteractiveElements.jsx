import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, TextField, Button, Select, MenuItem, FormControl, InputLabel, Grid, Switch, FormControlLabel, Slider, Chip, Rating, Avatar, Badge, Tooltip, Fab, SpeedDial, SpeedDialIcon, SpeedDialAction, Alert, AlertTitle, LinearProgress, CircularProgress } from '@mui/material';
import dynamic from 'next/dynamic';

// Динамический импорт ReactPlayer для клиентской стороны
const ReactPlayer = dynamic(() => import('react-player'), { ssr: false });
import { QRCodeSVG } from 'qrcode.react';
import { SketchPicker } from 'react-color';

// Динамический импорт Confetti для клиентской стороны
const Confetti = dynamic(() => import('react-confetti'), { ssr: false });
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { 
  FacebookShareButton, 
  TwitterShareButton, 
  WhatsappShareButton, 
  EmailShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
  EmailIcon
} from 'react-share';

// Динамический импорт motion для клиентской стороны
const MotionDiv = dynamic(() => import('framer-motion').then(mod => mod.motion.div), { ssr: false });

import AnimationWrapper from './AnimationWrapper';
import AnimationControls from './AnimationControls';
import EditableElementWrapper from './EditableElementWrapper';
import ColorSettings from './TextComponents/ColorSettings';

// Иконки
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import ShareIcon from '@mui/icons-material/Share';
import DownloadIcon from '@mui/icons-material/Download';
import CopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import PaletteIcon from '@mui/icons-material/Palette';
import QrCodeIcon from '@mui/icons-material/QrCode';
import CelebrationIcon from '@mui/icons-material/Celebration';

export const VideoPlayer = ({ 
  animationSettings = {
    animationType: 'fadeIn',
    delay: 0,
    triggerOnView: true,
    triggerOnce: true,
    threshold: 0.1,
    disabled: false
  },
  isPreview = false,
  constructorMode = false,
  isEditing = false,
  onUpdate = () => {},
  onSave = null,
  onCancel = null
}) => {
  const [url, setUrl] = useState('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [title, setTitle] = useState('Видеоплеер');
  const [localEditing, setLocalEditing] = useState(false);
  const [editData, setEditData] = useState({ 
    url, 
    playing, 
    volume, 
    muted, 
    title, 
    animationSettings 
  });

  const handleDoubleClick = () => {
    if (constructorMode) {
      setLocalEditing(true);
    }
  };

  const handleSave = () => {
    setLocalEditing(false);
    if (onSave) {
      onSave(editData);
    } else {
      onUpdate(editData);
    }
  };

  const handleCancel = () => {
    setLocalEditing(false);
    setEditData({ url, playing, volume, muted, title, animationSettings });
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

  const isCurrentlyEditing = isEditing || localEditing;

  if (isCurrentlyEditing) {
    return (
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Заголовок"
            value={editData.title}
            onChange={(e) => setEditData({ ...editData, title: e.target.value })}
            fullWidth
            size="small"
          />
          <TextField
            label="URL видео"
            value={editData.url}
            onChange={(e) => setEditData({ ...editData, url: e.target.value })}
            fullWidth
            size="small"
          />
          <FormControlLabel
            control={
              <Switch
                checked={editData.playing}
                onChange={(e) => setEditData({ ...editData, playing: e.target.checked })}
              />
            }
            label="Автовоспроизведение"
          />
          
          {constructorMode && (
            <AnimationControls
              animationSettings={editData.animationSettings}
              onUpdate={handleAnimationUpdate}
            />
          )}
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <button onClick={handleSave} style={{ flex: 1, padding: '8px', backgroundColor: '#4caf50', color: 'white', border: 'none', borderRadius: '4px' }}>
              Сохранить
            </button>
            <button onClick={handleCancel} style={{ flex: 1, padding: '8px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px' }}>
              Отмена
            </button>
          </Box>
        </Box>
      </Paper>
    );
  }

  return (
    <EditableElementWrapper 
      editable={constructorMode} 
      onStartEdit={handleDoubleClick}
      isEditing={isCurrentlyEditing}
    >
      <AnimationWrapper {...editData.animationSettings}>
        <Paper sx={{ p: 3, mb: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>{editData.title}</Typography>
      {!isPreview && (
        <Box sx={{ mb: 2 }}>
          <TextField
            label="Заголовок"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            size="small"
            sx={{ mb: 1 }}
          />
          <TextField
            label="URL видео"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            fullWidth
            size="small"
            sx={{ mb: 1 }}
          />
          <FormControlLabel
            control={
              <Switch
                checked={playing}
                onChange={(e) => setPlaying(e.target.checked)}
              />
            }
            label="Автовоспроизведение"
          />
        </Box>
      )}
          <Box sx={{ position: 'relative', paddingTop: '56.25%' /* 16:9 aspect ratio */ }}>
            <ReactPlayer
              url={editData.url}
              playing={editData.playing}
              volume={editData.volume}
              muted={editData.muted}
              width="100%"
              height="100%"
              style={{ position: 'absolute', top: 0, left: 0 }}
              controls
            />
          </Box>
          {!isPreview && (
            <Box sx={{ mt: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
              <Button
                variant="contained"
                startIcon={editData.playing ? <PauseIcon /> : <PlayArrowIcon />}
                onClick={() => setEditData({ ...editData, playing: !editData.playing })}
              >
                {editData.playing ? 'Пауза' : 'Играть'}
              </Button>
              <Button
                variant="outlined"
                startIcon={editData.muted ? <VolumeOffIcon /> : <VolumeUpIcon />}
                onClick={() => setEditData({ ...editData, muted: !editData.muted })}
              >
                {editData.muted ? 'Включить звук' : 'Отключить звук'}
              </Button>
              <Typography variant="body2">Громкость:</Typography>
              <Slider
                value={editData.volume}
                onChange={(_, newValue) => setEditData({ ...editData, volume: newValue })}
                min={0}
                max={1}
                step={0.1}
                sx={{ width: 100 }}
              />
            </Box>
          )}
        </Paper>
      </AnimationWrapper>
    </EditableElementWrapper>
  );
};

export const QRCodeGenerator = ({ 
  title: propTitle,
  qrData: propQrData,
  size: propSize,
  backgroundColor: propBgColor,
  foregroundColor: propFgColor,
  animationSettings = {
    animationType: 'fadeIn',
    delay: 0,
    triggerOnView: true,
    triggerOnce: true,
    threshold: 0.1,
    disabled: false
  },
  isPreview = false,
  constructorMode = false,
  isEditing = false,
  onUpdate = () => {},
  onSave = null,
  onCancel = null
}) => {
  // Добавляем логирование для отладки
  console.log('[QRCodeGenerator] Received props:', { 
    propTitle, 
    propQrData, 
    propSize, 
    propBgColor, 
    propFgColor,
    isPreview,
    constructorMode 
  });

  const [value, setValue] = useState(propQrData || 'https://example.com');
  const [size, setSize] = useState(propSize || 200);
  const [level, setLevel] = useState('M');
  const [title, setTitle] = useState(propTitle || 'QR код');
  const [includeMargin, setIncludeMargin] = useState(true);
  const [fgColor, setFgColor] = useState(propFgColor || '#000000');
  const [bgColor, setBgColor] = useState(propBgColor || '#ffffff');
  const [localEditing, setLocalEditing] = useState(false);
  const [editData, setEditData] = useState({ 
    value: propQrData || 'https://example.com', 
    size: propSize || 200, 
    level: 'M', 
    title: propTitle || 'QR код', 
    includeMargin: true, 
    fgColor: propFgColor || '#000000', 
    bgColor: propBgColor || '#ffffff', 
    colorSettings: {},
    animationSettings 
  });

  const handleDoubleClick = () => {
    if (constructorMode) {
      setLocalEditing(true);
    }
  };

  const handleSave = () => {
    setLocalEditing(false);
    if (onSave) {
      onSave(editData);
    } else {
      onUpdate(editData);
    }
  };

  const handleCancel = () => {
    setLocalEditing(false);
    setEditData({
      value: propQrData || 'https://example.com',
      size: propSize || 200,
      level: 'M',
      title: propTitle || 'QR код',
      includeMargin: true,
      fgColor: propFgColor || '#000000',
      bgColor: propBgColor || '#ffffff',
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

  const isCurrentlyEditing = isEditing || localEditing;

  if (isCurrentlyEditing) {
    return (
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Заголовок"
            value={editData.title}
            onChange={(e) => setEditData({ ...editData, title: e.target.value })}
            fullWidth
            size="small"
          />
          <TextField
            label="Текст или URL"
            value={editData.value}
            onChange={(e) => setEditData({ ...editData, value: e.target.value })}
            fullWidth
            size="small"
          />
          <TextField
            label="Размер"
            type="number"
            value={editData.size}
            onChange={(e) => setEditData({ ...editData, size: Number(e.target.value) })}
            fullWidth
            size="small"
            inputProps={{ min: 100, max: 500 }}
          />
          
          {constructorMode && (
            <AnimationControls
              animationSettings={editData.animationSettings}
              onUpdate={handleAnimationUpdate}
            />
          )}
          
          {/* Настройки цветов */}
          <Box sx={{ mb: 2 }}>
            <ColorSettings
              title="Настройки цветов QR кода"
              colorSettings={editData.colorSettings || {}}
              onUpdate={(newColorSettings) => setEditData({ ...editData, colorSettings: newColorSettings })}
              availableFields={[
                { name: 'title', label: 'Заголовок', description: 'Цвет заголовка QR кода', defaultColor: '#333333' },
                { name: 'background', label: 'Фон', description: 'Цвет фона QR кода', defaultColor: '#ffffff' },
                { name: 'foreground', label: 'QR код', description: 'Цвет самого QR кода', defaultColor: '#000000' }
              ]}
              defaultColors={{
                title: '#333333',
                background: '#ffffff',
                foreground: '#000000'
              }}
            />
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <button onClick={handleSave} style={{ flex: 1, padding: '8px', backgroundColor: '#4caf50', color: 'white', border: 'none', borderRadius: '4px' }}>
              Сохранить
            </button>
            <button onClick={handleCancel} style={{ flex: 1, padding: '8px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px' }}>
              Отмена
            </button>
          </Box>
        </Box>
      </Paper>
    );
  }

  return (
    <EditableElementWrapper 
      editable={constructorMode} 
      onStartEdit={handleDoubleClick}
      isEditing={isCurrentlyEditing}
    >
      <AnimationWrapper {...editData.animationSettings}>
        <Paper sx={{ p: 3, mb: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>{editData.title}</Typography>
      {!isPreview && (
        <Box sx={{ mb: 2 }}>
          <TextField
            label="Заголовок"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            size="small"
            sx={{ mb: 1 }}
          />
          <TextField
            label="Текст или URL"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            fullWidth
            size="small"
            sx={{ mb: 1 }}
          />
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                label="Размер"
                type="number"
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                fullWidth
                size="small"
                inputProps={{ min: 100, max: 500 }}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Уровень коррекции</InputLabel>
                <Select
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                >
                  <MenuItem value="L">Низкий</MenuItem>
                  <MenuItem value="M">Средний</MenuItem>
                  <MenuItem value="Q">Высокий</MenuItem>
                  <MenuItem value="H">Максимальный</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <FormControlLabel
            control={
              <Switch
                checked={includeMargin}
                onChange={(e) => setIncludeMargin(e.target.checked)}
              />
            }
            label="Включить отступы"
          />
        </Box>
      )}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <QRCodeSVG
              value={editData.value}
              size={isPreview ? 150 : editData.size}
              level={editData.level}
              includeMargin={editData.includeMargin}
              fgColor={editData.fgColor}
              bgColor={editData.bgColor}
            />
          </Box>
          {!isPreview && (
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <CopyToClipboard text={editData.value}>
                <Button variant="outlined" startIcon={<CopyIcon />}>
                  Копировать текст
                </Button>
              </CopyToClipboard>
              <Button variant="outlined" startIcon={<QrCodeIcon />}>
                Скачать QR код
              </Button>
            </Box>
          )}
        </Paper>
      </AnimationWrapper>
    </EditableElementWrapper>
  );
};

export const ColorPicker = ({ 
  isPreview = false,
  constructorMode = false,
  isEditing = false,
  onUpdate = () => {},
  onSave = null,
  onCancel = null,
  animationSettings = {
    animationType: 'fadeIn',
    delay: 0,
    triggerOnView: true,
    triggerOnce: true,
    threshold: 0.1,
    disabled: false
  }
}) => {
  const [color, setColor] = useState('#1976d2');
  const [showPicker, setShowPicker] = useState(false);
  const [title, setTitle] = useState('Выбор цвета');
  const [copied, setCopied] = useState(false);
  const [localEditing, setLocalEditing] = useState(false);
  const [editData, setEditData] = useState({
    color,
    title,
    animationSettings
  });

  const handleDoubleClick = () => {
    if (constructorMode) {
      setLocalEditing(true);
    }
  };

  const handleSave = () => {
    setLocalEditing(false);
    setColor(editData.color);
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
      color,
      title,
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

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
                Редактирование палитры цветов
              </Typography>
              
              <TextField
                label="Заголовок"
                value={editData.title}
                onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                fullWidth
                size="small"
                sx={{ mb: 2 }}
              />
              
              <TextField
                label="Цвет по умолчанию"
                value={editData.color}
                onChange={(e) => setEditData({ ...editData, color: e.target.value })}
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
              
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                <Button onClick={handleCancel}>Отмена</Button>
                <Button variant="contained" onClick={handleSave}>Сохранить</Button>
              </Box>
            </Box>
          ) : (
            <Box>
              <Typography variant="h6" sx={{ mb: 2 }}>{title}</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<PaletteIcon />}
                  onClick={() => setShowPicker(!showPicker)}
                  sx={{ 
                    backgroundColor: color,
                    color: 'white',
                    '&:hover': {
                      backgroundColor: color,
                      opacity: 0.8
                    }
                  }}
                >
                  Выбрать цвет
                </Button>
                
                {showPicker && (
                  <Box sx={{ position: 'relative', zIndex: 10 }}>
                    <SketchPicker
                      color={color}
                      onChangeComplete={(color) => setColor(color.hex)}
                    />
                  </Box>
                )}
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2">Выбранный цвет: {color}</Typography>
                  <CopyToClipboard text={color} onCopy={handleCopy}>
                    <Button
                      size="small"
                      startIcon={copied ? <CheckIcon /> : <CopyIcon />}
                      color={copied ? 'success' : 'primary'}
                    >
                      {copied ? 'Скопировано!' : 'Копировать'}
                    </Button>
                  </CopyToClipboard>
                </Box>
              </Box>
            </Box>
          )}
        </Paper>
      </AnimationWrapper>
    </EditableElementWrapper>
  );
};

export const RatingComponent = ({ 
  title: propTitle,
  caption: propCaption,
  currentRating: propCurrentRating,
  maxRating: propMaxRating,
  isPreview = false,
  constructorMode = false,
  isEditing = false,
  onUpdate = () => {},
  onSave = null,
  onCancel = null,
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
  // Добавляем логирование для отладки
  console.log('[RatingComponent] Received props:', { 
    propTitle, 
    propCaption, 
    propCurrentRating, 
    propMaxRating,
    isPreview,
    constructorMode 
  });

  const [rating, setRating] = useState(propCurrentRating || 3);
  const [maxRating, setMaxRating] = useState(propMaxRating || 5);
  const [title, setTitle] = useState(propTitle || 'Оценка качества');
  const [label, setLabel] = useState(propCaption || 'Оцените наш сервис:');
  const [readonly, setReadonly] = useState(false);
  
  // Новые настройки стилизации
  const [titleColor, setTitleColor] = useState('#333333');
  const [labelColor, setLabelColor] = useState('#666666');
  const [ratingTextColor, setRatingTextColor] = useState('#999999');
  const [starColor, setStarColor] = useState('#ffc107');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [backgroundType, setBackgroundType] = useState('solid'); // 'solid' или 'gradient'
  const [gradientColors, setGradientColors] = useState(['#ffffff', '#f5f5f5']);
  const [gradientDirection, setGradientDirection] = useState('to bottom');
  const [showBackground, setShowBackground] = useState(true);
  const [borderRadius, setBorderRadius] = useState(8);
  const [padding, setPadding] = useState(20);
  
  const [localEditing, setLocalEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: propTitle || 'Оценка качества',
    label: propCaption || 'Оцените наш сервис:',
    rating: propCurrentRating || 3,
    maxRating: propMaxRating || 5,
    readonly: false,
    showTitle: true,
    showLabel: true,
    interactive: true,
    colorSettings: {},
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
    setLabel(editData.label);
    setRating(editData.rating);
    setMaxRating(editData.maxRating);
    setReadonly(editData.readonly);
    
    // 🔥 ИСПРАВЛЕНИЕ: Обновляем локальные цвета из colorSettings
    if (editData.colorSettings?.textFields) {
      setTitleColor(editData.colorSettings.textFields.title || '#333333');
      setLabelColor(editData.colorSettings.textFields.text || '#666666');
      setRatingTextColor(editData.colorSettings.textFields.text || '#999999');
      setStarColor(editData.colorSettings.textFields.star || '#ffc107');
    }
    
    // 🔥 ИСПРАВЛЕНИЕ: Обновляем локальные настройки фона из colorSettings
    console.log('⭐ [RatingComponent] handleSave - colorSettings:', editData.colorSettings);
    
    if (editData.colorSettings?.sectionBackground?.enabled) {
      const { sectionBackground } = editData.colorSettings;
      console.log('⭐ [RatingComponent] handleSave - sectionBackground enabled:', sectionBackground);
      
      if (sectionBackground.useGradient) {
        console.log('⭐ [RatingComponent] handleSave - Setting gradient background');
        setBackgroundType('gradient');
        setGradientColors([sectionBackground.gradientColor1 || 'rgba(0,0,0,0.85)', sectionBackground.gradientColor2 || 'rgba(0,0,0,0.75)']);
        setGradientDirection(sectionBackground.gradientDirection || 'to right');
      } else {
        console.log('⭐ [RatingComponent] handleSave - Setting solid background');
        setBackgroundType('solid');
        setBackgroundColor(sectionBackground.solidColor || 'rgba(0,0,0,0.85)');
      }
      setShowBackground(true);
      setBorderRadius(editData.colorSettings.borderRadius || 8);
      setPadding(editData.colorSettings.padding || 20);
      
      console.log('⭐ [RatingComponent] handleSave - Updated local background settings');
    } else {
      // Fallback на старые настройки
      console.log('⭐ [RatingComponent] handleSave - Using fallback background settings');
      setBackgroundColor(editData.backgroundColor);
      setBackgroundType(editData.backgroundType);
      setGradientColors(editData.gradientColors);
      setGradientDirection(editData.gradientDirection);
      setShowBackground(editData.showBackground);
      setBorderRadius(editData.borderRadius);
      setPadding(editData.padding);
    }
    
    // 🔥 ИСПРАВЛЕНИЕ: Создаем полный объект данных для экспорта
    const saveData = {
      title: editData.title,
      label: editData.label,
      rating: editData.rating,
      maxRating: editData.maxRating,
      readonly: editData.readonly,
      showTitle: editData.showTitle !== false,
      showLabel: editData.showLabel !== false,
      interactive: editData.interactive !== false,
      colorSettings: editData.colorSettings || {},
      animationSettings: editData.animationSettings
    };
    
    console.log('⭐ [RatingComponent] Saving data:', saveData);
    
    // 🔥 ИСПРАВЛЕНИЕ: Логируем финальные локальные настройки
    console.log('⭐ [RatingComponent] Final local settings after save:', {
      titleColor,
      labelColor,
      ratingTextColor,
      starColor,
      backgroundColor,
      backgroundType,
      gradientColors,
      gradientDirection,
      showBackground,
      borderRadius,
      padding
    });
    
    if (onSave) {
      onSave(saveData);
    } else {
      onUpdate(saveData);
    }
  };

  const handleCancel = () => {
    setLocalEditing(false);
    setEditData({
      title: propTitle || 'Оценка качества',
      label: propCaption || 'Оцените наш сервис:',
      rating: propCurrentRating || 3,
      maxRating: propMaxRating || 5,
      readonly: false,
      showTitle: true,
      showLabel: true,
      interactive: true,
      titleColor: '#333333',
      labelColor: '#666666',
      ratingTextColor: '#999999',
      starColor: '#ffc107',
      backgroundColor: '#ffffff',
      backgroundType: 'solid',
      gradientColors: ['#ffffff', '#f5f5f5'],
      gradientDirection: 'to bottom',
      showBackground: true,
      borderRadius: 8,
      padding: 20,
      animationSettings
    });
    if (onCancel) {
      onCancel();
    }
  };

  const handleAnimationUpdate = (newAnimationSettings) => {
    setEditData({ ...editData, animationSettings: newAnimationSettings });
  };

  // Функция для получения стиля фона
  const getBackgroundStyle = (data = editData) => {
    console.log('⭐ [RatingComponent] getBackgroundStyle called with:', { 
      data, 
      localSettings: { showBackground, backgroundType, backgroundColor, gradientColors, gradientDirection },
      colorSettings: data.colorSettings 
    });
    
    // 🔥 ИСПРАВЛЕНИЕ: Приоритет colorSettings.sectionBackground
    if (data.colorSettings?.sectionBackground?.enabled) {
      const { sectionBackground } = data.colorSettings;
      console.log('⭐ [RatingComponent] Using colorSettings.sectionBackground:', sectionBackground);
      
      if (sectionBackground.useGradient) {
        const gradientStyle = {
          background: `linear-gradient(${sectionBackground.gradientDirection || 'to right'}, ${sectionBackground.gradientColor1 || 'rgba(0,0,0,0.85)'}, ${sectionBackground.gradientColor2 || 'rgba(0,0,0,0.75)'})`
        };
        console.log('⭐ [RatingComponent] Returning gradient style:', gradientStyle);
        return gradientStyle;
      } else {
        const solidStyle = {
          backgroundColor: sectionBackground.solidColor || 'rgba(0,0,0,0.85)'
        };
        console.log('⭐ [RatingComponent] Returning solid style:', solidStyle);
        return solidStyle;
      }
    }
    
    // Fallback на локальные настройки (после сохранения)
    console.log('⭐ [RatingComponent] Using local settings fallback');
    if (!showBackground) return {};
    
    if (backgroundType === 'gradient') {
      const localGradientStyle = {
        background: `linear-gradient(${gradientDirection}, ${gradientColors[0]}, ${gradientColors[1]})`
      };
      console.log('⭐ [RatingComponent] Returning local gradient style:', localGradientStyle);
      return localGradientStyle;
    } else {
      const localSolidStyle = {
        backgroundColor: backgroundColor
      };
      console.log('⭐ [RatingComponent] Returning local solid style:', localSolidStyle);
      return localSolidStyle;
    }
  };

  // Опции направления градиента
  const gradientDirections = [
    { value: 'to bottom', label: 'Сверху вниз' },
    { value: 'to top', label: 'Снизу вверх' },
    { value: 'to right', label: 'Слева направо' },
    { value: 'to left', label: 'Справа налево' },
    { value: 'to bottom right', label: 'По диагонали ↘' },
    { value: 'to bottom left', label: 'По диагонали ↙' },
    { value: 'to top right', label: 'По диагонали ↗' },
    { value: 'to top left', label: 'По диагонали ↖' }
  ];

  const isCurrentlyEditing = isEditing || localEditing;

  // 🔄 РЕАКТИВНОСТЬ: Обновляем локальные настройки при изменении colorSettings
  useEffect(() => {
    if (JSON.stringify(colorSettings) !== JSON.stringify(editData.colorSettings)) {
      console.log('🔄 [RatingComponent] Обновление colorSettings:', colorSettings);
      setEditData(prev => ({
        ...prev,
        colorSettings: colorSettings || {}
      }));
    }
  }, [colorSettings]);

  return (
    <EditableElementWrapper 
      editable={constructorMode} 
      onStartEdit={handleDoubleClick}
      isEditing={isCurrentlyEditing}
    >
      <AnimationWrapper {...(editData.animationSettings || animationSettings)}>
        <Paper 
          sx={{ 
            p: `${editData.padding || padding}px`,
            mb: 2,
            borderRadius: `${editData.borderRadius || borderRadius}px`,
            ...getBackgroundStyle(),
            ...(editData.showBackground || showBackground ? {} : { boxShadow: 'none', background: 'transparent' })
          }}
          onRender={() => {
            console.log('⭐ [RatingComponent] Paper rendered with styles:', {
              padding: editData.padding || padding,
              borderRadius: editData.borderRadius || borderRadius,
              backgroundStyle: getBackgroundStyle(),
              showBackground: editData.showBackground || showBackground
            });
          }}
        >
          {isCurrentlyEditing ? (
            <Box>
              <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
                Редактирование компонента рейтинга
              </Typography>
              
              {/* Основные настройки */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>Основные настройки:</Typography>
                
                <TextField
                  label="Заголовок"
                  value={editData.title}
                  onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                  fullWidth
                  size="small"
                  sx={{ mb: 2 }}
                />
                
                <TextField
                  label="Подпись"
                  value={editData.label}
                  onChange={(e) => setEditData({ ...editData, label: e.target.value })}
                  fullWidth
                  size="small"
                  sx={{ mb: 2 }}
                />
                
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={6}>
                    <TextField
                      label="Текущая оценка"
                      type="number"
                      value={editData.rating}
                      onChange={(e) => setEditData({ ...editData, rating: Number(e.target.value) })}
                      fullWidth
                      size="small"
                      inputProps={{ min: 0, max: editData.maxRating, step: 0.1 }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Максимальная оценка"
                      type="number"
                      value={editData.maxRating}
                      onChange={(e) => setEditData({ ...editData, maxRating: Number(e.target.value) })}
                      fullWidth
                      size="small"
                      inputProps={{ min: 1, max: 10 }}
                    />
                  </Grid>
                </Grid>
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={editData.readonly}
                      onChange={(e) => setEditData({ ...editData, readonly: e.target.checked })}
                    />
                  }
                  label="Только для чтения"
                  sx={{ mb: 2 }}
                />
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={editData.showTitle !== false}
                      onChange={(e) => setEditData({ ...editData, showTitle: e.target.checked })}
                    />
                  }
                  label="Показывать заголовок"
                  sx={{ mb: 2 }}
                />
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={editData.showLabel !== false}
                      onChange={(e) => setEditData({ ...editData, showLabel: e.target.checked })}
                    />
                  }
                  label="Показывать подпись"
                  sx={{ mb: 2 }}
                />
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={editData.interactive !== false}
                      onChange={(e) => setEditData({ ...editData, interactive: e.target.checked })}
                    />
                  }
                  label="Интерактивный рейтинг (выбор звезд)"
                  sx={{ mb: 2 }}
                />
              </Box>

              {/* Настройки цветов */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>Настройки цветов:</Typography>
                <ColorSettings
                  title="Настройки цветов рейтинга"
                  colorSettings={editData.colorSettings || {}}
                  onUpdate={(newColorSettings) => setEditData({ ...editData, colorSettings: newColorSettings })}
                  availableFields={[
                    { name: 'title', label: 'Заголовок', description: 'Цвет заголовка рейтинга', defaultColor: '#333333' },
                    { name: 'text', label: 'Текст', description: 'Цвет текста рейтинга', defaultColor: '#666666' },
                    { name: 'star', label: 'Звезды', description: 'Цвет активных звезд', defaultColor: '#ffc107' },
                    { name: 'emptyStar', label: 'Пустые звезды', description: 'Цвет неактивных звезд', defaultColor: '#e0e0e0' }
                  ]}
                  defaultColors={{
                    title: '#333333',
                    text: '#666666',
                    star: '#ffc107',
                    emptyStar: '#e0e0e0'
                  }}
                  hideCardBackground={true}
                  hideAreaColors={true}
                />
              </Box>



              {/* Настройки отступов и радиуса */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>Настройки внешнего вида:</Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" gutterBottom>
                      Внутренние отступы: {editData.padding}px
                    </Typography>
                    <Slider
                      value={editData.padding}
                      onChange={(e, value) => setEditData({ ...editData, padding: value })}
                      min={0}
                      max={50}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" gutterBottom>
                      Радиус скругления: {editData.borderRadius}px
                    </Typography>
                    <Slider
                      value={editData.borderRadius}
                      onChange={(e, value) => setEditData({ ...editData, borderRadius: value })}
                      min={0}
                      max={30}
                      size="small"
                    />
                  </Grid>
                </Grid>
              </Box>

              {/* Настройки анимации */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>Настройки анимации:</Typography>
                <AnimationControls
                  animationSettings={editData.animationSettings || animationSettings}
                  onUpdate={handleAnimationUpdate}
                />
              </Box>
              
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button variant="contained" onClick={handleSave}>
                  Сохранить
                </Button>
                <Button variant="outlined" onClick={handleCancel}>
                  Отменить
                </Button>
              </Box>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {(editData.showTitle !== false) && (
                <Typography 
                  variant="h5" 
                  sx={{ 
                    mb: 1,
                    color: editData.colorSettings?.textFields?.title || editData.titleColor || titleColor,
                    fontWeight: 'bold'
                  }}
                >
                  {editData.title || title}
                </Typography>
              )}
              
              {(editData.showLabel !== false) && (
                <Typography 
                  variant="body1" 
                  sx={{ 
                    mb: 2,
                    color: editData.colorSettings?.textFields?.text || editData.labelColor || labelColor
                  }}
                >
                  {editData.label || label}
                </Typography>
              )}
              <Rating
                name="rating"
                value={editData.rating || rating}
                max={editData.maxRating || maxRating}
                onChange={(event, newValue) => {
                  if (!(editData.readonly || readonly) && (editData.interactive !== false)) {
                    setRating(newValue);
                    setEditData({ ...editData, rating: newValue });
                  }
                }}
                readOnly={editData.readonly || readonly || (editData.interactive === false)}
                size="large"
                sx={{
                  mb: 1,
                  '& .MuiRating-icon': {
                    color: editData.colorSettings?.textFields?.star || editData.starColor || starColor
                  },
                  '& .MuiRating-iconEmpty': {
                    color: editData.colorSettings?.textFields?.emptyStar || '#e0e0e0'
                  },
                  '& .MuiRating-root': {
                    cursor: (editData.readonly || readonly || (editData.interactive === false)) ? 'default' : 'pointer'
                  }
                }}
              />
              <Typography 
                variant="body2" 
                sx={{ 
                  color: editData.colorSettings?.textFields?.text || editData.ratingTextColor || ratingTextColor,
                  fontWeight: 'medium'
                }}
              >
                {(editData.rating || rating)} из {(editData.maxRating || maxRating)}
              </Typography>
            </Box>
          )}
        </Paper>
      </AnimationWrapper>
    </EditableElementWrapper>
  );
};

export const ConfettiComponent = ({ 
  isPreview = false,
  constructorMode = false,
  isEditing = false,
  onUpdate = () => {},
  onSave = null,
  onCancel = null,
  animationSettings = {
    animationType: 'fadeIn',
    delay: 0,
    triggerOnView: true,
    triggerOnce: true,
    threshold: 0.1,
    disabled: false
  }
}) => {
  const [isActive, setIsActive] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [title, setTitle] = useState('Конфетти');
  const [colors, setColors] = useState(['#f43f5e', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6']);
  const [numberOfPieces, setNumberOfPieces] = useState(200);
  const [localEditing, setLocalEditing] = useState(false);
  const [editData, setEditData] = useState({
    title,
    colors,
    numberOfPieces,
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
    setColors(editData.colors);
    setNumberOfPieces(editData.numberOfPieces);
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
      colors,
      numberOfPieces,
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

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isActive) {
      const timer = setTimeout(() => setIsActive(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [isActive]);

  return (
    <EditableElementWrapper 
      editable={constructorMode} 
      onStartEdit={handleDoubleClick}
      isEditing={isCurrentlyEditing}
    >
      <AnimationWrapper {...(editData.animationSettings || animationSettings)}>
        <Paper sx={{ p: 3, mb: 2, position: 'relative' }}>
          {isCurrentlyEditing ? (
            <Box>
              <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
                Редактирование конфетти
              </Typography>
              
              <TextField
                label="Заголовок"
                value={editData.title}
                onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                fullWidth
                size="small"
                sx={{ mb: 2 }}
              />
              
              <TextField
                label="Количество частиц"
                type="number"
                value={editData.numberOfPieces}
                onChange={(e) => setEditData({ ...editData, numberOfPieces: Number(e.target.value) })}
                fullWidth
                size="small"
                inputProps={{ min: 50, max: 1000 }}
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
                    sx={{ mb: 1 }}
                  />
                  <TextField
                    label="Количество частиц"
                    type="number"
                    value={numberOfPieces}
                    onChange={(e) => setNumberOfPieces(Number(e.target.value))}
                    fullWidth
                    size="small"
                    inputProps={{ min: 50, max: 1000 }}
                  />
                </Box>
              )}
              {isActive && isMounted && (
                <Confetti
                  numberOfPieces={numberOfPieces}
                  colors={colors}
                  recycle={false}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    pointerEvents: 'none'
                  }}
                />
              )}
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  startIcon={<CelebrationIcon />}
                  onClick={() => setIsActive(true)}
                  disabled={isActive}
                >
                  {isActive ? 'Конфетти запущено!' : 'Запустить конфетти!'}
                </Button>
              </Box>
            </Box>
          )}
        </Paper>
      </AnimationWrapper>
    </EditableElementWrapper>
  );
};

export const ShareButtons = ({ 
  isPreview = false,
  constructorMode = false,
  isEditing = false,
  onUpdate = () => {},
  onSave = null,
  onCancel = null,
  title: propTitle,
  content,
  url: propUrl,
  shareTitle: propShareTitle,
  hashtag: propHashtag,
  animationSettings = {
    animationType: 'fadeIn',
    delay: 0,
    triggerOnView: true,
    triggerOnce: true,
    threshold: 0.1,
    disabled: false
  }
}) => {
  // Парсим данные из content, если они там есть
  let parsedTitle = propTitle || 'Поделиться';
  let parsedShareTitle = propShareTitle || 'Посмотрите на этот замечательный сайт!';
  let parsedHashtag = propHashtag || '#webdev';
  
  if (content && !propTitle && !propShareTitle && !propHashtag) {
    // Сначала заменяем экранированные звездочки на обычные, затем разделяем
    const normalizedContent = content.replace(/\\\*/g, '*');
    const parts = normalizedContent.split('*').map(part => part.trim()).filter(part => part);
    
    console.log('[ShareButtons] Parsing content:', {
      originalContent: content,
      normalizedContent,
      parts,
      partsLength: parts.length
    });
    
    if (parts.length >= 1) parsedTitle = parts[0];
    if (parts.length >= 2) parsedShareTitle = parts[1];
    if (parts.length >= 3) parsedHashtag = parts[2];
    
    console.log('[ShareButtons] Parsed data:', {
      parsedTitle,
      parsedShareTitle,
      parsedHashtag
    });
  }
  
  const [url, setUrl] = useState(propUrl || 'https://example.com');
  const [title, setTitle] = useState(parsedTitle);
  const [shareTitle, setShareTitle] = useState(parsedShareTitle);
  const [hashtag, setHashtag] = useState(parsedHashtag);
  const [localEditing, setLocalEditing] = useState(false);
  const [editData, setEditData] = useState({
    url: propUrl || 'https://example.com',
    title: parsedTitle,
    shareTitle: parsedShareTitle,
    hashtag: parsedHashtag,
    animationSettings
  });

  const handleDoubleClick = () => {
    if (constructorMode) {
      setLocalEditing(true);
    }
  };

  const handleSave = () => {
    setLocalEditing(false);
    setUrl(editData.url);
    setTitle(editData.title);
    setShareTitle(editData.shareTitle);
    setHashtag(editData.hashtag);
    if (onSave) {
      onSave(editData);
    } else {
      onUpdate(editData);
    }
  };

  const handleCancel = () => {
    setLocalEditing(false);
    setEditData({
      url,
      title,
      shareTitle,
      hashtag,
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
                Редактирование кнопок поделиться
              </Typography>
              
              <TextField
                label="Заголовок"
                value={editData.title}
                onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                fullWidth
                size="small"
                sx={{ mb: 2 }}
              />
              
              <TextField
                label="URL для шаринга"
                value={editData.url}
                onChange={(e) => setEditData({ ...editData, url: e.target.value })}
                fullWidth
                size="small"
                sx={{ mb: 2 }}
              />
              
              <TextField
                label="Заголовок для шаринга"
                value={editData.shareTitle}
                onChange={(e) => setEditData({ ...editData, shareTitle: e.target.value })}
                fullWidth
                size="small"
                sx={{ mb: 2 }}
              />
              
              <TextField
                label="Хештег"
                value={editData.hashtag}
                onChange={(e) => setEditData({ ...editData, hashtag: e.target.value })}
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
                    sx={{ mb: 1 }}
                  />
                  <TextField
                    label="URL для шаринга"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    fullWidth
                    size="small"
                    sx={{ mb: 1 }}
                  />
                  <TextField
                    label="Заголовок для шаринга"
                    value={shareTitle}
                    onChange={(e) => setShareTitle(e.target.value)}
                    fullWidth
                    size="small"
                    sx={{ mb: 1 }}
                  />
                  <TextField
                    label="Хештег"
                    value={hashtag}
                    onChange={(e) => setHashtag(e.target.value)}
                    fullWidth
                    size="small"
                  />
                </Box>
              )}
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                <FacebookShareButton url={url} quote={shareTitle} hashtag={hashtag}>
                  <FacebookIcon size={40} round />
                </FacebookShareButton>
                <TwitterShareButton url={url} title={shareTitle} hashtags={[hashtag.replace('#', '')]}>
                  <TwitterIcon size={40} round />
                </TwitterShareButton>
                <WhatsappShareButton url={url} title={shareTitle}>
                  <WhatsappIcon size={40} round />
                </WhatsappShareButton>
                <EmailShareButton url={url} subject={shareTitle}>
                  <EmailIcon size={40} round />
                </EmailShareButton>
              </Box>
            </Box>
          )}
        </Paper>
      </AnimationWrapper>
    </EditableElementWrapper>
  );
};

export const AnimatedBox = ({ 
  isPreview = false,
  constructorMode = false,
  isEditing = false,
  onUpdate = () => {},
  onSave = null,
  onCancel = null,
  animationSettings = {
    animationType: 'fadeIn',
    delay: 0,
    triggerOnView: true,
    triggerOnce: true,
    threshold: 0.1,
    disabled: false
  }
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [title, setTitle] = useState('Анимированный блок');
  const [animationType, setAnimationType] = useState('bounce');
  const [localEditing, setLocalEditing] = useState(false);
  const [editData, setEditData] = useState({
    title,
    animationType,
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
    setAnimationType(editData.animationType);
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
      animationType,
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

  const animations = {
    bounce: {
      scale: [1, 1.2, 1],
      transition: { duration: 0.5 }
    },
    rotate: {
      rotate: [0, 360],
      transition: { duration: 1 }
    },
    pulse: {
      scale: [1, 1.1, 1],
      opacity: [1, 0.8, 1],
      transition: { duration: 0.8 }
    },
    shake: {
      x: [0, -10, 10, -10, 10, 0],
      transition: { duration: 0.6 }
    }
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

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
                Редактирование анимированного блока
              </Typography>
              
              <TextField
                label="Заголовок"
                value={editData.title}
                onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                fullWidth
                size="small"
                sx={{ mb: 2 }}
              />
              
              <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                <InputLabel>Тип анимации</InputLabel>
                <Select
                  value={editData.animationType}
                  onChange={(e) => setEditData({ ...editData, animationType: e.target.value })}
                >
                  <MenuItem value="bounce">Подпрыгивание</MenuItem>
                  <MenuItem value="rotate">Вращение</MenuItem>
                  <MenuItem value="pulse">Пульсация</MenuItem>
                  <MenuItem value="shake">Тряска</MenuItem>
                </Select>
              </FormControl>

              {/* Настройки анимации */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>Настройки анимации:</Typography>
                <AnimationControls
                  animationSettings={editData.animationSettings || animationSettings}
                  onUpdate={handleAnimationUpdate}
                />
              </Box>
              
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
                    sx={{ mb: 1 }}
                  />
                  <FormControl fullWidth size="small">
                    <InputLabel>Тип анимации</InputLabel>
                    <Select
                      value={animationType}
                      onChange={(e) => setAnimationType(e.target.value)}
                    >
                      <MenuItem value="bounce">Подпрыгивание</MenuItem>
                      <MenuItem value="rotate">Вращение</MenuItem>
                      <MenuItem value="pulse">Пульсация</MenuItem>
                      <MenuItem value="shake">Тряска</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              )}
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                {isMounted && (
                  <MotionDiv
                    animate={isAnimating ? animations[animationType] : {}}
                    style={{
                      width: 100,
                      height: 100,
                      backgroundColor: '#1976d2',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 'bold'
                    }}
                  >
                    Блок
                  </MotionDiv>
                )}
                <Button
                  variant="contained"
                  onClick={() => setIsAnimating(!isAnimating)}
                >
                  {isAnimating ? 'Остановить' : 'Запустить'} анимацию
                </Button>
              </Box>
            </Box>
          )}
        </Paper>
      </AnimationWrapper>
    </EditableElementWrapper>
  );
};

export const ProgressBars = ({ 
  title: propTitle,
  caption: propCaption,
  progress: propProgress,
  isPreview = false,
  constructorMode = false,
  isEditing = false,
  onUpdate = () => {},
  onSave = null,
  onCancel = null,
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
  // Добавляем логирование для отладки
  console.log('[ProgressBars] Received props:', { 
    propTitle, 
    propCaption, 
    propProgress,
    isPreview,
    constructorMode 
  });
  const [progress, setProgress] = useState(propProgress || 45);
  const [title, setTitle] = useState(propTitle || 'Индикаторы прогресса');
  const [label, setLabel] = useState(propCaption || 'Прогресс загрузки');
  
  // Новые настройки стилизации
  const [titleColor, setTitleColor] = useState('#333333');
  const [labelColor, setLabelColor] = useState('#666666');
  const [progressColor, setProgressColor] = useState('#1976d2');
  const [backgroundColor, setBackgroundColor] = useState('#e0e0e0');
  const [backgroundType, setBackgroundType] = useState('none'); // 'none', 'solid' или 'gradient'
  const [containerBgColor, setContainerBgColor] = useState('#ffffff');
  const [gradientColors, setGradientColors] = useState(['#ffffff', '#f5f5f5']);
  const [gradientDirection, setGradientDirection] = useState('to bottom');
  const [borderRadius, setBorderRadius] = useState(8);
  const [padding, setPadding] = useState(20);
  const [progressHeight, setProgressHeight] = useState(10);
  const [circularSize, setCircularSize] = useState(60);
  const [circularThickness, setCircularThickness] = useState(4);
  const [showLinear, setShowLinear] = useState(true);
  const [showCircular, setShowCircular] = useState(true);
  const [showColoredProgress, setShowColoredProgress] = useState(false);
  
  const [localEditing, setLocalEditing] = useState(false);
  const [editData, setEditData] = useState({
    progress: propProgress || 45,
    title: propTitle || 'Индикаторы прогресса',
    label: propCaption || 'Прогресс загрузки',
    colorSettings: {},
    titleColor: '#333333',
    labelColor: '#666666',
    progressColor: '#1976d2',
    backgroundColor: '#e0e0e0',
    backgroundType: 'none',
    containerBgColor: '#ffffff',
    gradientColors: ['#ffffff', '#f5f5f5'],
    gradientDirection: 'to bottom',
    borderRadius: 8,
    padding: 20,
    progressHeight: 10,
    circularSize: 60,
    circularThickness: 4,
    showLinear,
    showCircular,
    showColoredProgress: false,
    animationSettings
  });

  const handleDoubleClick = () => {
    if (constructorMode) {
      setLocalEditing(true);
    }
  };

  const handleSave = () => {
    setLocalEditing(false);
    setProgress(editData.progress);
    setTitle(editData.title);
    setLabel(editData.label);
    setTitleColor(editData.titleColor);
    setLabelColor(editData.labelColor);
    setProgressColor(editData.progressColor);
    setBackgroundColor(editData.backgroundColor);
    setBackgroundType(editData.backgroundType);
    setContainerBgColor(editData.containerBgColor);
    setGradientColors(editData.gradientColors);
    setGradientDirection(editData.gradientDirection);
    setBorderRadius(editData.borderRadius);
    setPadding(editData.padding);
    setProgressHeight(editData.progressHeight);
    setCircularSize(editData.circularSize);
    setCircularThickness(editData.circularThickness);
    setShowLinear(editData.showLinear);
    setShowCircular(editData.showCircular);
    setShowColoredProgress(editData.showColoredProgress);
    
    if (onSave) {
      onSave(editData);
    } else {
      onUpdate(editData);
    }
  };

  const handleCancel = () => {
    setLocalEditing(false);
    setEditData({
      progress: propProgress || 45,
      title: propTitle || 'Индикаторы прогресса',
      label: propCaption || 'Прогресс загрузки',
      titleColor,
      labelColor,
      progressColor,
      backgroundColor,
      backgroundType,
      containerBgColor,
      gradientColors,
      gradientDirection,
      borderRadius,
      padding,
      progressHeight,
      circularSize,
      circularThickness,
      showLinear,
      showCircular,
      showColoredProgress: false,
      animationSettings
    });
    if (onCancel) {
      onCancel();
    }
  };

  const handleAnimationUpdate = (newAnimationSettings) => {
    setEditData({ ...editData, animationSettings: newAnimationSettings });
  };

  // Функция для получения стиля фона контейнера
  const getContainerBackgroundStyle = (data = editData) => {
    // 🔥 ИСПРАВЛЕНИЕ: Приоритет colorSettings.sectionBackground
    if (data.colorSettings?.sectionBackground?.enabled) {
      const { sectionBackground } = data.colorSettings;
      console.log('🔄 [ProgressBars] Using colorSettings.sectionBackground:', sectionBackground);
      
      if (sectionBackground.useGradient) {
        const gradientStyle = {
          background: `linear-gradient(${sectionBackground.gradientDirection || 'to right'}, ${sectionBackground.gradientColor1 || '#0a0a2e'}, ${sectionBackground.gradientColor2 || '#16213e'})`
        };
        if (sectionBackground.opacity !== undefined) {
          gradientStyle.opacity = sectionBackground.opacity;
        }
        return gradientStyle;
      } else {
        const solidStyle = {
          backgroundColor: sectionBackground.solidColor || '#0a0a2e'
        };
        if (sectionBackground.opacity !== undefined) {
          solidStyle.opacity = sectionBackground.opacity;
        }
        return solidStyle;
      }
    }
    
    // Fallback на старые настройки
    if (data.backgroundType === 'none') return {};
    
    if (data.backgroundType === 'gradient') {
      return {
        background: `linear-gradient(${data.gradientDirection}, ${data.gradientColors[0]}, ${data.gradientColors[1]})`
      };
    } else {
      return {
        backgroundColor: data.containerBgColor
      };
    }
  };

  // Опции направления градиента
  const gradientDirections = [
    { value: 'to bottom', label: 'Сверху вниз' },
    { value: 'to top', label: 'Снизу вверх' },
    { value: 'to right', label: 'Слева направо' },
    { value: 'to left', label: 'Справа налево' },
    { value: 'to bottom right', label: 'По диагонали ↘' },
    { value: 'to bottom left', label: 'По диагонали ↙' },
    { value: 'to top right', label: 'По диагонали ↗' },
    { value: 'to top left', label: 'По диагонали ↖' }
  ];

  const isCurrentlyEditing = isEditing || localEditing;

  // 🔄 РЕАКТИВНОСТЬ: Обновляем локальные настройки при изменении colorSettings
  useEffect(() => {
    if (JSON.stringify(colorSettings) !== JSON.stringify(editData.colorSettings)) {
      console.log('🔄 [ProgressBars] Обновление colorSettings:', colorSettings);
      setEditData(prev => ({
        ...prev,
        colorSettings: colorSettings || {}
      }));
    }
  }, [colorSettings]);

  return (
    <EditableElementWrapper 
      editable={constructorMode} 
      onStartEdit={handleDoubleClick}
      isEditing={isCurrentlyEditing}
    >
      <AnimationWrapper {...(editData.animationSettings || animationSettings)}>
        <Paper 
          sx={{ 
            p: `${editData.padding || padding}px`,
            mb: 2,
            borderRadius: `${editData.borderRadius || borderRadius}px`,
            ...getContainerBackgroundStyle()
          }}
        >
          {isCurrentlyEditing ? (
            <Box>
              <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
                Редактирование индикаторов прогресса
              </Typography>
              
              {/* Основные настройки */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>Основные настройки:</Typography>
                
                <TextField
                  label="Заголовок"
                  value={editData.title}
                  onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                  fullWidth
                  size="small"
                  sx={{ mb: 2 }}
                />
                
                <TextField
                  label="Подпись"
                  value={editData.label}
                  onChange={(e) => setEditData({ ...editData, label: e.target.value })}
                  fullWidth
                  size="small"
                  sx={{ mb: 2 }}
                />
                
                <Typography variant="body2" gutterBottom>
                  Прогресс: {editData.progress}%
                </Typography>
                <Slider
                  value={editData.progress}
                  onChange={(e, value) => setEditData({ ...editData, progress: value })}
                  min={0}
                  max={100}
                  size="small"
                  sx={{ mb: 2 }}
                />
              </Box>

              {/* Настройки отображения */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>Что показывать:</Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={editData.showLinear}
                          onChange={(e) => setEditData({ ...editData, showLinear: e.target.checked })}
                        />
                      }
                      label="Линейный"
                      sx={{ mb: 1 }}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={editData.showCircular}
                          onChange={(e) => setEditData({ ...editData, showCircular: e.target.checked })}
                        />
                      }
                      label="Круговой"
                      sx={{ mb: 1 }}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={editData.showColoredProgress}
                          onChange={(e) => setEditData({ ...editData, showColoredProgress: e.target.checked })}
                        />
                      }
                      label="Цветной"
                      sx={{ mb: 1 }}
                    />
                  </Grid>
                </Grid>
              </Box>

              {/* Настройки цветов */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>Настройки цветов:</Typography>
                <ColorSettings
                  title="Настройки цветов индикатора прогресса"
                  colorSettings={editData.colorSettings || {}}
                  onUpdate={(newColorSettings) => setEditData({ ...editData, colorSettings: newColorSettings })}
                  availableFields={[
                    { name: 'title', label: 'Заголовок', description: 'Цвет заголовка индикатора', defaultColor: '#333333' },
                    { name: 'text', label: 'Текст', description: 'Цвет текста процентов', defaultColor: '#666666' },
                    { name: 'background', label: 'Фон', description: 'Цвет фона индикатора', defaultColor: '#e0e0e0' },
                    { name: 'progress', label: 'Прогресс', description: 'Цвет заполненной части', defaultColor: '#1976d2' }
                  ]}
                  defaultColors={{
                    title: '#333333',
                    text: '#666666',
                    background: '#e0e0e0',
                    progress: '#1976d2'
                  }}
                  hideCardBackground={true}
                  hideAreaColors={true}
                />
              </Box>

              {/* Настройки фона контейнера */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>Настройки фона контейнера:</Typography>
                
                <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                  <InputLabel>Тип фона</InputLabel>
                  <Select
                    value={editData.backgroundType}
                    onChange={(e) => setEditData({ ...editData, backgroundType: e.target.value })}
                    label="Тип фона"
                  >
                    <MenuItem value="none">Без фона</MenuItem>
                    <MenuItem value="solid">Сплошной цвет</MenuItem>
                    <MenuItem value="gradient">Градиент</MenuItem>
                  </Select>
                </FormControl>

                {editData.backgroundType === 'solid' && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" gutterBottom>Цвет фона:</Typography>
                    <SketchPicker
                      color={editData.containerBgColor}
                      onChange={(color) => setEditData({ ...editData, containerBgColor: color.hex })}
                      width="100%"
                      disableAlpha
                    />
                  </Box>
                )}

                {editData.backgroundType === 'gradient' && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" gutterBottom>Цвета градиента:</Typography>
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                      <Grid item xs={6}>
                        <Typography variant="body2" gutterBottom>Первый цвет:</Typography>
                        <SketchPicker
                          color={editData.gradientColors[0]}
                          onChange={(color) => setEditData({ 
                            ...editData, 
                            gradientColors: [color.hex, editData.gradientColors[1]]
                          })}
                          width="100%"
                          disableAlpha
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" gutterBottom>Второй цвет:</Typography>
                        <SketchPicker
                          color={editData.gradientColors[1]}
                          onChange={(color) => setEditData({ 
                            ...editData, 
                            gradientColors: [editData.gradientColors[0], color.hex]
                          })}
                          width="100%"
                          disableAlpha
                        />
                      </Grid>
                    </Grid>
                    
                    <FormControl fullWidth size="small">
                      <InputLabel>Направление градиента</InputLabel>
                      <Select
                        value={editData.gradientDirection}
                        onChange={(e) => setEditData({ ...editData, gradientDirection: e.target.value })}
                        label="Направление градиента"
                      >
                        {gradientDirections.map((dir) => (
                          <MenuItem key={dir.value} value={dir.value}>
                            {dir.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                )}
              </Box>

              {/* Настройки размеров */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>Настройки размеров:</Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="body2" gutterBottom>
                      Внутренние отступы: {editData.padding}px
                    </Typography>
                    <Slider
                      value={editData.padding}
                      onChange={(e, value) => setEditData({ ...editData, padding: value })}
                      min={0}
                      max={50}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="body2" gutterBottom>
                      Радиус скругления: {editData.borderRadius}px
                    </Typography>
                    <Slider
                      value={editData.borderRadius}
                      onChange={(e, value) => setEditData({ ...editData, borderRadius: value })}
                      min={0}
                      max={30}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="body2" gutterBottom>
                      Высота линейного: {editData.progressHeight}px
                    </Typography>
                    <Slider
                      value={editData.progressHeight}
                      onChange={(e, value) => setEditData({ ...editData, progressHeight: value })}
                      min={4}
                      max={30}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="body2" gutterBottom>
                      Размер кругового: {editData.circularSize}px
                    </Typography>
                    <Slider
                      value={editData.circularSize}
                      onChange={(e, value) => setEditData({ ...editData, circularSize: value })}
                      min={40}
                      max={120}
                      size="small"
                    />
                  </Grid>
                </Grid>
              </Box>

              {/* Настройки анимации */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>Настройки анимации:</Typography>
                <AnimationControls
                  animationSettings={editData.animationSettings || animationSettings}
                  onUpdate={handleAnimationUpdate}
                />
              </Box>
              
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button variant="contained" onClick={handleSave}>
                  Сохранить
                </Button>
                <Button variant="outlined" onClick={handleCancel}>
                  Отменить
                </Button>
              </Box>
            </Box>
          ) : (
            <Box>
              <Typography 
                variant="h5" 
                sx={{ 
                  mb: 2,
                  color: editData.colorSettings?.textFields?.title || editData.titleColor || titleColor,
                  fontWeight: 'bold'
                }}
              >
                {editData.title || title}
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {(editData.showLinear || showLinear) && (
                  <Box>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        mb: 1,
                        color: editData.colorSettings?.textFields?.text || editData.labelColor || labelColor
                      }}
                    >
                      {editData.label || label}: {editData.progress || progress}%
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={editData.progress || progress} 
                      sx={{ 
                        height: editData.progressHeight || progressHeight, 
                        borderRadius: (editData.progressHeight || progressHeight) / 2,
                        backgroundColor: editData.colorSettings?.textFields?.background || editData.backgroundColor || backgroundColor,
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: editData.colorSettings?.textFields?.progress || editData.progressColor || progressColor
                        }
                      }}
                    />
                  </Box>
                )}
                
                {(editData.showCircular || showCircular) && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'center' }}>
                    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                      <CircularProgress 
                        variant="determinate" 
                        value={editData.progress || progress} 
                        size={editData.circularSize || circularSize}
                        thickness={editData.circularThickness || circularThickness}
                        sx={{
                          color: editData.colorSettings?.textFields?.progress || editData.progressColor || progressColor,
                          '& .MuiCircularProgress-circle': {
                            strokeLinecap: 'round'
                          }
                        }}
                      />
                      <Box
                        sx={{
                          top: 0,
                          left: 0,
                          bottom: 0,
                          right: 0,
                          position: 'absolute',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Typography 
                          variant="caption" 
                          component="div" 
                          sx={{ 
                            color: editData.colorSettings?.textFields?.progress || editData.progressColor || progressColor,
                            fontWeight: 'bold',
                            fontSize: `${Math.max(12, (editData.circularSize || circularSize) / 6)}px`
                          }}
                        >
                          {`${Math.round(editData.progress || progress)}%`}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                )}
                
                {(editData.showColoredProgress || showColoredProgress) && (
                  <Box>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        mb: 1,
                        color: editData.colorSettings?.textFields?.text || editData.labelColor || labelColor
                      }}
                    >
                      Динамический цвет: {editData.progress || progress}%
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={editData.progress || progress} 
                      sx={{ 
                        height: (editData.progressHeight || progressHeight) - 2, 
                        borderRadius: ((editData.progressHeight || progressHeight) - 2) / 2,
                        backgroundColor: editData.colorSettings?.textFields?.background || editData.backgroundColor || backgroundColor,
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: (editData.progress || progress) < 30 ? '#f44336' : 
                                         (editData.progress || progress) < 70 ? '#ff9800' : '#4caf50'
                        }
                      }}
                    />
                  </Box>
                )}
              </Box>
            </Box>
          )}
        </Paper>
      </AnimationWrapper>
    </EditableElementWrapper>
  );
}; 