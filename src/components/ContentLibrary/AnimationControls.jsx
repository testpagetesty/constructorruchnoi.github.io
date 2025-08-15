import React from 'react';
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Switch,
  FormControlLabel,
  Slider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Grid,
  Paper,
  Divider
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AnimationIcon from '@mui/icons-material/Animation';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { animationPresets } from './AnimationWrapper';
import { motion } from 'framer-motion';

const AnimationControls = ({ 
  animationSettings = {}, 
  onAnimationChange,
  onUpdate,
  expanded = false,
  onToggle = null
}) => {
  const handleChange = (property, value) => {
    const newSettings = {
      ...animationSettings,
      [property]: value
    };
    
    if (onUpdate) {
      onUpdate(newSettings);
    } else if (onAnimationChange) {
      onAnimationChange(newSettings);
    }
  };

  const currentSettings = {
    animationType: 'none',
    delay: 0,
    triggerOnView: true,
    triggerOnce: true,
    threshold: 0.1,
    disabled: false,
    ...animationSettings
  };

  const renderAnimationPreview = () => {
    const animation = animationPresets[currentSettings.animationType];
    if (!animation || animation.name === 'Без анимации') return null;

    return (
      <Box sx={{ mt: 2, p: 2, border: '1px dashed #ccc', borderRadius: 1, bgcolor: '#f9f9f9' }}>
        <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PlayArrowIcon fontSize="small" />
          Предварительный просмотр:
        </Typography>
        <motion.div
          style={{
            width: 80,
            height: 50,
            backgroundColor: '#1976d2',
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '12px',
            margin: '10px auto'
          }}
          key={`${currentSettings.animationType}-${Date.now()}`} // Уникальный key для перезапуска
          initial={animation.initial}
          animate={animation.animate}
          transition={animation.transition}
        >
          Test
        </motion.div>
      </Box>
    );
  };

  // Группировка анимаций по категориям
  const animationCategories = {
    basic: {
      name: 'Базовые',
      animations: ['fadeIn', 'fadeInUp', 'fadeInDown', 'slideInLeft', 'slideInRight', 'slideInUp', 'slideInDown']
    },
    advanced: {
      name: 'Продвинутые',
      animations: ['slideInLeftBig', 'slideInRightBig', 'slideInRotate', 'backInUp', 'backInDown']
    },
    scale: {
      name: 'Масштаб',
      animations: ['scaleIn', 'scaleInBounce', 'zoomIn', 'zoomInOut', 'bounceIn']
    },
    rotate: {
      name: 'Поворот',
      animations: ['rotateIn', 'flipIn', 'rollIn', 'swing']
    },
    elastic: {
      name: 'Эластичные',
      animations: ['elastic', 'wobble', 'pulse', 'heartbeat']
    },
    effects: {
      name: 'Эффекты',
      animations: ['shakeX', 'tada', 'glitch']
    },
    special: {
      name: 'Специальные',
      animations: ['typewriter', 'morphIn', 'liquidFill', 'curtainDrop']
    }
  };

  const content = (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <AnimationIcon color="primary" />
        <Typography variant="h6" color="primary">
          Настройки анимации
        </Typography>
        <Chip 
          label={animationPresets[currentSettings.animationType]?.name || 'Без анимации'} 
          size="small" 
          color={currentSettings.animationType !== 'none' ? 'primary' : 'default'}
        />
      </Box>

      {/* Включение/отключение анимации */}
      <FormControlLabel
        control={
          <Switch
            checked={!currentSettings.disabled}
            onChange={(e) => handleChange('disabled', !e.target.checked)}
          />
        }
        label="Включить анимацию"
        sx={{ mb: 2 }}
      />

      {!currentSettings.disabled && (
        <>
          {/* Выбор типа анимации по категориям */}
          <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
            Выберите тип анимации:
          </Typography>
          
          {Object.entries(animationCategories).map(([categoryKey, category]) => (
            <Box key={categoryKey} sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {category.name}
              </Typography>
              <Grid container spacing={1}>
                <Grid item xs={12} sm={6}>
                  <Chip
                    label="Без анимации"
                    variant={currentSettings.animationType === 'none' ? 'filled' : 'outlined'}
                    color={currentSettings.animationType === 'none' ? 'primary' : 'default'}
                    onClick={() => handleChange('animationType', 'none')}
                    sx={{ mb: 1, mr: 1, cursor: 'pointer' }}
                  />
                </Grid>
                {category.animations.map((animKey) => (
                  <Grid item xs={12} sm={6} key={animKey}>
                    <Chip
                      label={animationPresets[animKey]?.name}
                      variant={currentSettings.animationType === animKey ? 'filled' : 'outlined'}
                      color={currentSettings.animationType === animKey ? 'primary' : 'default'}
                      onClick={() => handleChange('animationType', animKey)}
                      sx={{ mb: 1, mr: 1, cursor: 'pointer', width: '100%' }}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          ))}

          <Divider sx={{ my: 2 }} />

          {currentSettings.animationType !== 'none' && (
            <>
              {/* Задержка анимации */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Задержка (сек): {currentSettings.delay}
                </Typography>
                <Slider
                  value={currentSettings.delay}
                  onChange={(e, value) => handleChange('delay', value)}
                  min={0}
                  max={3}
                  step={0.1}
                  marks={[
                    { value: 0, label: '0' },
                    { value: 0.5, label: '0.5' },
                    { value: 1, label: '1' },
                    { value: 2, label: '2' },
                    { value: 3, label: '3' }
                  ]}
                />
              </Box>

              {/* Настройки триггера */}
              <Typography variant="subtitle2" gutterBottom>
                Настройки запуска:
              </Typography>
              
              <FormControlLabel
                control={
                  <Switch
                    checked={currentSettings.triggerOnView}
                    onChange={(e) => handleChange('triggerOnView', e.target.checked)}
                  />
                }
                label="Запускать при появлении в области просмотра"
                sx={{ mb: 1, display: 'block' }}
              />

              {currentSettings.triggerOnView && (
                <>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={currentSettings.triggerOnce}
                        onChange={(e) => handleChange('triggerOnce', e.target.checked)}
                      />
                    }
                    label="Воспроизводить только один раз"
                    sx={{ mb: 2, display: 'block' }}
                  />

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" gutterBottom>
                      Порог видимости: {Math.round(currentSettings.threshold * 100)}%
                    </Typography>
                    <Slider
                      value={currentSettings.threshold}
                      onChange={(e, value) => handleChange('threshold', value)}
                      min={0.1}
                      max={1}
                      step={0.1}
                      marks={[
                        { value: 0.1, label: '10%' },
                        { value: 0.5, label: '50%' },
                        { value: 1, label: '100%' }
                      ]}
                    />
                  </Box>
                </>
              )}

              {/* Предварительный просмотр */}
              {renderAnimationPreview()}
            </>
          )}
        </>
      )}
    </Box>
  );

  if (onToggle) {
    return (
      <Accordion expanded={expanded} onChange={onToggle}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AnimationIcon />
            <Typography>Анимация</Typography>
            {!currentSettings.disabled && currentSettings.animationType !== 'none' && (
              <Chip 
                label={animationPresets[currentSettings.animationType]?.name} 
                size="small" 
                color="primary" 
              />
            )}
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          {content}
        </AccordionDetails>
      </Accordion>
    );
  }

  return content;
};

export default AnimationControls; 