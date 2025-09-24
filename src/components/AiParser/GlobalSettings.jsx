import React, { useState, useMemo } from 'react';
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
  Checkbox,
  Autocomplete
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

// Доступные языки с русскими названиями для поиска
export const LANGUAGES = [
  { code: 'RU', label: 'Русский (ru)', searchTerms: 'русский ru russia' },
  { code: 'EN', label: 'Английский - English (en)', searchTerms: 'английский english en usa uk' },
  { code: 'ES', label: 'Испанский - Español (es)', searchTerms: 'испанский spanish es spain' },
  { code: 'FR', label: 'Французский - Français (fr)', searchTerms: 'французский french fr france' },
  { code: 'DE', label: 'Немецкий - Deutsch (de)', searchTerms: 'немецкий german de germany' },
  { code: 'IT', label: 'Итальянский - Italiano (it)', searchTerms: 'итальянский italian it italy' },
  { code: 'PT', label: 'Португальский - Português (pt)', searchTerms: 'португальский portuguese pt portugal brazil' },
  { code: 'NL', label: 'Нидерландский - Nederlands (nl)', searchTerms: 'нидерландский dutch nl netherlands' },
  { code: 'PL', label: 'Польский - Polski (pl)', searchTerms: 'польский polish pl poland' },
  { code: 'AR', label: 'Арабский - العربية (ar)', searchTerms: 'арабский arabic ar saudi arabia' },
  { code: 'ZH', label: 'Китайский - 中文 (zh)', searchTerms: 'китайский chinese zh china' },
  { code: 'JA', label: 'Японский - 日本語 (ja)', searchTerms: 'японский japanese ja japan' },
  { code: 'KO', label: 'Корейский - 한국어 (ko)', searchTerms: 'корейский korean ko korea' },
  { code: 'TR', label: 'Турецкий - Türkçe (tr)', searchTerms: 'турецкий turkish tr turkey' },
  { code: 'HE', label: 'Иврит - עברית (he)', searchTerms: 'иврит hebrew he israel' },
  { code: 'HI', label: 'Хинди - हिन्दी (hi)', searchTerms: 'хинди hindi hi india' },
  { code: 'UK', label: 'Украинский - Українська (uk)', searchTerms: 'украинский ukrainian uk ukraine' },
  { code: 'BE', label: 'Белорусский - Беларуская (be)', searchTerms: 'белорусский belarusian be belarus' },
  { code: 'CS', label: 'Чешский - Čeština (cs)', searchTerms: 'чешский czech cs czechia' },
  { code: 'DA', label: 'Датский - Dansk (da)', searchTerms: 'датский danish da denmark' },
  { code: 'FI', label: 'Финский - Suomi (fi)', searchTerms: 'финский finnish fi finland' },
  { code: 'EL', label: 'Греческий - Ελληνικά (el)', searchTerms: 'греческий greek el greece' },
  { code: 'HU', label: 'Венгерский - Magyar (hu)', searchTerms: 'венгерский hungarian hu hungary' },
  { code: 'NO', label: 'Норвежский - Norsk (no)', searchTerms: 'норвежский norwegian no norway' },
  { code: 'RO', label: 'Румынский - Română (ro)', searchTerms: 'румынский romanian ro romania' },
  { code: 'SV', label: 'Шведский - Svenska (sv)', searchTerms: 'шведский swedish sv sweden' },
  { code: 'TH', label: 'Тайский - ไทย (th)', searchTerms: 'тайский thai th thailand' },
  { code: 'VI', label: 'Вьетнамский - Tiếng Việt (vi)', searchTerms: 'вьетнамский vietnamese vi vietnam' },
  { code: 'BG', label: 'Болгарский - Български (bg)', searchTerms: 'болгарский bulgarian bg bulgaria' },
  { code: 'SR', label: 'Сербский - Српски (sr)', searchTerms: 'сербский serbian sr serbia' },
  { code: 'SK', label: 'Словацкий - Slovenčina (sk)', searchTerms: 'словацкий slovak sk slovakia' },
  { code: 'SL', label: 'Словенский - Slovenščina (sl)', searchTerms: 'словенский slovenian sl slovenia' },
  { code: 'CUSTOM', label: 'Другой язык по коду ISO 639-1', searchTerms: 'другой custom iso' }
];

// Доступные страны для выбора
export const COUNTRIES = [
  { code: 'RU', label: 'Россия', searchTerms: 'россия russia ru' },
  { code: 'US', label: 'США', searchTerms: 'сша usa america' },
  { code: 'GB', label: 'Великобритания', searchTerms: 'великобритания uk britain england' },
  { code: 'DE', label: 'Германия', searchTerms: 'германия germany de' },
  { code: 'FR', label: 'Франция', searchTerms: 'франция france fr' },
  { code: 'ES', label: 'Испания', searchTerms: 'испания spain es' },
  { code: 'IT', label: 'Италия', searchTerms: 'италия italy it' },
  { code: 'CA', label: 'Канада', searchTerms: 'канада canada ca' },
  { code: 'AU', label: 'Австралия', searchTerms: 'австралия australia au' },
  { code: 'JP', label: 'Япония', searchTerms: 'япония japan jp' },
  { code: 'KR', label: 'Южная Корея', searchTerms: 'корея korea kr' },
  { code: 'CN', label: 'Китай', searchTerms: 'китай china cn' },
  { code: 'BR', label: 'Бразилия', searchTerms: 'бразилия brazil br' },
  { code: 'MX', label: 'Мексика', searchTerms: 'мексика mexico mx' },
  { code: 'AR', label: 'Аргентина', searchTerms: 'аргентина argentina ar' },
  { code: 'IN', label: 'Индия', searchTerms: 'индия india in' },
  { code: 'TR', label: 'Турция', searchTerms: 'турция turkey tr' },
  { code: 'SA', label: 'Саудовская Аравия', searchTerms: 'саудовская аравия saudi arabia sa' },
  { code: 'AE', label: 'ОАЭ', searchTerms: 'оаэ uae emirates' },
  { code: 'IL', label: 'Израиль', searchTerms: 'израиль israel il' },
  { code: 'PL', label: 'Польша', searchTerms: 'польша poland pl' },
  { code: 'NL', label: 'Нидерланды', searchTerms: 'нидерланды netherlands nl' },
  { code: 'BE', label: 'Бельгия', searchTerms: 'бельгия belgium be' },
  { code: 'CH', label: 'Швейцария', searchTerms: 'швейцария switzerland ch' },
  { code: 'AT', label: 'Австрия', searchTerms: 'австрия austria at' },
  { code: 'SE', label: 'Швеция', searchTerms: 'швеция sweden se' },
  { code: 'NO', label: 'Норвегия', searchTerms: 'норвегия norway no' },
  { code: 'DK', label: 'Дания', searchTerms: 'дания denmark dk' },
  { code: 'FI', label: 'Финляндия', searchTerms: 'финляндия finland fi' },
  { code: 'PT', label: 'Португалия', searchTerms: 'португалия portugal pt' },
  { code: 'GR', label: 'Греция', searchTerms: 'греция greece gr' },
  { code: 'CZ', label: 'Чехия', searchTerms: 'чехия czech cz' },
  { code: 'HU', label: 'Венгрия', searchTerms: 'венгрия hungary hu' },
  { code: 'RO', label: 'Румыния', searchTerms: 'румыния romania ro' },
  { code: 'BG', label: 'Болгария', searchTerms: 'болгария bulgaria bg' },
  { code: 'UA', label: 'Украина', searchTerms: 'украина ukraine ua' },
  { code: 'BY', label: 'Беларусь', searchTerms: 'беларусь belarus by' },
  { code: 'KZ', label: 'Казахстан', searchTerms: 'казахстан kazakhstan kz' },
  { code: 'UZ', label: 'Узбекистан', searchTerms: 'узбекистан uzbekistan uz' },
  { code: 'TH', label: 'Таиланд', searchTerms: 'таиланд thailand th' },
  { code: 'VN', label: 'Вьетнам', searchTerms: 'вьетнам vietnam vn' },
  { code: 'ID', label: 'Индонезия', searchTerms: 'индонезия indonesia id' },
  { code: 'MY', label: 'Малайзия', searchTerms: 'малайзия malaysia my' },
  { code: 'SG', label: 'Сингапур', searchTerms: 'сингапур singapore sg' },
  { code: 'PH', label: 'Филиппины', searchTerms: 'филиппины philippines ph' },
  { code: 'EG', label: 'Египет', searchTerms: 'египет egypt eg' },
  { code: 'ZA', label: 'ЮАР', searchTerms: 'юар south africa za' },
  { code: 'CUSTOM', label: 'Другая страна', searchTerms: 'другая custom' }
];

// Предустановленные стили контента
export const CONTENT_STYLES = {
  FORMAL: 'Формальный',
  CASUAL: 'Неформальный',
  PROFESSIONAL: 'Профессиональный',
  FRIENDLY: 'Дружелюбный'
};

const GlobalSettings = ({ open, onClose, settings, onSettingsChange }) => {
  const [languageInputValue, setLanguageInputValue] = useState('');
  const [countryInputValue, setCountryInputValue] = useState('');
  
  const handleChange = (field, value) => {
    onSettingsChange({
      ...settings,
      [field]: value
    });
  };

  // Находим выбранный язык для отображения
  const selectedLanguage = useMemo(() => {
    if (!settings.language) return null;
    return LANGUAGES.find(lang => lang.code === settings.language) || null;
  }, [settings.language]);

  // Находим выбранную страну для отображения
  const selectedCountry = useMemo(() => {
    if (!settings.country) return null;
    return COUNTRIES.find(country => country.code === settings.country) || null;
  }, [settings.country]);

  // Фильтрация языков для поиска
  const filteredLanguages = useMemo(() => {
    if (!languageInputValue) return LANGUAGES;
    
    const searchTerm = languageInputValue.toLowerCase();
    return LANGUAGES.filter(lang => 
      lang.label.toLowerCase().includes(searchTerm) ||
      lang.searchTerms.toLowerCase().includes(searchTerm) ||
      lang.code.toLowerCase().includes(searchTerm)
    );
  }, [languageInputValue]);

  // Фильтрация стран для поиска
  const filteredCountries = useMemo(() => {
    if (!countryInputValue) return COUNTRIES;
    
    const searchTerm = countryInputValue.toLowerCase();
    return COUNTRIES.filter(country => 
      country.label.toLowerCase().includes(searchTerm) ||
      country.searchTerms.toLowerCase().includes(searchTerm) ||
      country.code.toLowerCase().includes(searchTerm)
    );
  }, [countryInputValue]);

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
            <Autocomplete
              fullWidth
              options={filteredLanguages}
              value={selectedLanguage}
              onChange={(event, newValue) => {
                handleChange('language', newValue ? newValue.code : '');
              }}
              inputValue={languageInputValue}
              onInputChange={(event, newInputValue) => {
                setLanguageInputValue(newInputValue);
              }}
              getOptionLabel={(option) => option.label}
              renderOption={(props, option) => (
                <Box component="li" {...props} key={option.code}>
                  <Typography variant="body2">
                    {option.label}
                  </Typography>
                </Box>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Выберите язык"
                  placeholder={selectedLanguage ? "" : "Выберите язык"}
                  helperText="Например: русский, английский, spanish, deutsch..."
                  variant="outlined"
                />
              )}
              noOptionsText="Язык не найден"
              clearText="Очистить"
              openText="Открыть список"
              closeText="Закрыть список"
              isClearable
              clearOnBlur={false}
              selectOnFocus
            />
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
            <Autocomplete
              fullWidth
              options={filteredCountries}
              value={selectedCountry}
              onChange={(event, newValue) => {
                handleChange('country', newValue ? newValue.code : '');
              }}
              inputValue={countryInputValue}
              onInputChange={(event, newInputValue) => {
                setCountryInputValue(newInputValue);
              }}
              getOptionLabel={(option) => option.label}
              renderOption={(props, option) => (
                <Box component="li" {...props} key={option.code}>
                  <Typography variant="body2">
                    {option.label}
                  </Typography>
                </Box>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Выберите страну"
                  placeholder={selectedCountry ? "" : "Выберите страну"}
                  helperText="Например: Россия, США, Германия, Франция..."
                  variant="outlined"
                />
              )}
              noOptionsText="Страна не найдена"
              clearText="Очистить"
              openText="Открыть список"
              closeText="Закрыть список"
              isClearable
              clearOnBlur={false}
              selectOnFocus
            />
            {settings.country === 'CUSTOM' && (
              <TextField
                fullWidth
                sx={{ mt: 2 }}
                label="Введите название страны"
                placeholder="Например: Казахстан, Беларусь..."
                value={settings.customCountry || ''}
                onChange={(e) => handleChange('customCountry', e.target.value)}
                helperText="Название страны для генерации контактов"
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