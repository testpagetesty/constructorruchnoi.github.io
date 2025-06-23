import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Typography,
  Box,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import TuneIcon from '@mui/icons-material/Tune';

// Предустановленные тематики сайтов
export const WEBSITE_THEMES = {
  LAW: 'Юридическая компания',
  MEDICAL: 'Медицинская клиника',
  CONSTRUCTION: 'Строительная компания',
  EDUCATION: 'Образовательный центр',
  REAL_ESTATE: 'Агентство недвижимости',
  RESTAURANT: 'Ресторан/Кафе',
  BEAUTY: 'Салон красоты',
  AUTO: 'Автосервис',
  RETAIL: 'Магазин/Торговля',
  CUSTOM: 'Другое'
};

// Доступные языки
export const LANGUAGES = {
  RU: 'Русский (ru)',
  EN: 'English (en)',
  ES: 'Español (es)',
  FR: 'Français (fr)',
  DE: 'Deutsch (de)',
  IT: 'Italiano (it)',
  PT: 'Português (pt)',
  NL: 'Nederlands (nl)',
  PL: 'Polski (pl)',
  AR: 'العربية (ar)',
  ZH: '中文 (zh)',
  JA: '日本語 (ja)',
  KO: '한국어 (ko)',
  TR: 'Türkçe (tr)',
  HE: 'עברית (he)',
  HI: 'हिन्दी (hi)',
  UK: 'Українська (uk)',
  BE: 'Беларуская (be)',
  CS: 'Čeština (cs)',
  DA: 'Dansk (da)',
  FI: 'Suomi (fi)',
  EL: 'Ελληνικά (el)',
  HU: 'Magyar (hu)',
  NO: 'Norsk (no)',
  RO: 'Română (ro)',
  SV: 'Svenska (sv)',
  TH: 'ไทย (th)',
  VI: 'Tiếng Việt (vi)',
  BG: 'Български (bg)',
  SR: 'Српски (sr)',
  SK: 'Slovenčina (sk)',
  SL: 'Slovenščina (sl)',
  CUSTOM: 'Другой язык по коду ISO 639-1'
};

// Предустановленные стили контента
export const CONTENT_STYLES = {
  FORMAL: 'Формальный',
  CASUAL: 'Неформальный',
  PROFESSIONAL: 'Профессиональный',
  FRIENDLY: 'Дружелюбный'
};

const GlobalSettings = ({ open, onClose, settings, onSettingsChange }) => {
  const handleChange = (field, value) => {
    onSettingsChange({
      ...settings,
      [field]: value
    });
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { 
          marginTop: '40px',
          minHeight: '500px'
        }
      }}
    >
      <DialogTitle sx={{ 
        borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
        display: 'flex',
        alignItems: 'center',
        gap: 1
      }}>
        <TuneIcon /> Глобальные настройки контента
      </DialogTitle>
      <DialogContent sx={{ pt: 5 }}>
        <Grid container spacing={2} sx={{ mt: 4 }}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Тематика сайта</InputLabel>
              <Select
                value={settings.theme}
                onChange={(e) => handleChange('theme', e.target.value)}
                label="Тематика сайта"
              >
                {Object.entries(WEBSITE_THEMES).map(([key, value]) => (
                  <MenuItem key={key} value={key}>{value}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {settings.theme === 'CUSTOM' && (
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Своя тематика"
                value={settings.customTheme}
                onChange={(e) => handleChange('customTheme', e.target.value)}
              />
            </Grid>
          )}

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Язык контента</InputLabel>
              <Select
                value={settings.language}
                onChange={(e) => handleChange('language', e.target.value)}
                label="Язык контента"
              >
                {Object.entries(LANGUAGES).map(([key, value]) => (
                  <MenuItem key={key} value={key}>{value}</MenuItem>
                ))}
              </Select>
            </FormControl>
            {settings.language === 'CUSTOM' && (
              <TextField
                fullWidth
                sx={{ mt: 2 }}
                label="Введите двухбуквенный код языка (ISO 639-1)"
                placeholder="Например: ru, en, fr, de, es..."
                value={settings.customLanguage || ''}
                onChange={(e) => handleChange('customLanguage', e.target.value.toLowerCase().substring(0, 2))}
                helperText="Пример: ru - русский, en - английский, es - испанский"
                inputProps={{ maxLength: 2 }}
              />
            )}
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Стиль контента</InputLabel>
              <Select
                value={settings.contentStyle}
                onChange={(e) => handleChange('contentStyle', e.target.value)}
                label="Стиль контента"
              >
                {Object.entries(CONTENT_STYLES).map(([key, value]) => (
                  <MenuItem key={key} value={key}>{value}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'red', 
                fontWeight: 'bold', 
                mb: 1 
              }}
            >
              ОБЯЗАТЕЛЬНО укажите страну и язык из Заказа! Например: страна Россия язык русский
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={2}
              label="Ключевые особенности"
              placeholder="Например: страна Россия язык русский, современный подход, инновационные технологии"
              value={settings.additionalKeywords}
              onChange={(e) => handleChange('additionalKeywords', e.target.value)}
              sx={{
                '& .MuiInputBase-input': {
                  color: 'red'
                }
              }}
            />
            
            <Box sx={{ 
              mt: 2, 
              p: 2, 
              backgroundColor: '#f5f5f5', 
              borderRadius: 2,
              border: '1px solid #e0e0e0'
            }}>
              <Typography variant="h6" sx={{ mb: 1, color: '#1976d2', fontWeight: 'bold' }}>
                📋 Пошаговый гайд по настройке:
              </Typography>
              <Box component="ol" sx={{ pl: 2, m: 0 }}>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  <strong>Ввести тематику сайта</strong> - выберите подходящую категорию из списка выше
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  <strong>Обязательно выбрать язык контента</strong> - укажите язык для генерации всего контента
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 0 }}>
                  <strong>В ключевых особенностях прописать по порядку:</strong>
                  <br />
                  <Typography 
                    variant="body2" 
                    component="span" 
                    sx={{ 
                      color: '#d32f2f',
                      fontWeight: 'bold',
                      animation: 'pulse 2s infinite',
                      '@keyframes pulse': {
                        '0%': { opacity: 1 },
                        '50%': { opacity: 0.7 },
                        '100%': { opacity: 1 }
                      }
                    }}
                  >
                    Страна → Язык сайта → Ключевые особенности
                  </Typography>
                </Typography>
              </Box>
              <Typography 
                variant="body2" 
                sx={{ 
                  mt: 1, 
                  fontStyle: 'italic', 
                  color: '#666'
                }}
              >
                Пример: "страна Германия, язык немецкий, премиум качество, экологичность"
              </Typography>
            </Box>
          </Grid>




        </Grid>
      </DialogContent>
      <DialogActions sx={{ borderTop: '1px solid rgba(0, 0, 0, 0.12)', p: 2 }}>
        <Button onClick={onClose}>Отмена</Button>
        <Button 
          variant="contained" 
          onClick={onClose}
          color="primary"
        >
          Сохранить
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GlobalSettings; 