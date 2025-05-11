import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Typography,
  IconButton,
  Divider,
  Alert,
  FormControlLabel,
  Checkbox,
  FormControl,
  FormGroup,
  Switch,
  Select,
  MenuItem,
  InputLabel
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import RandomStyleSelector from './RandomStyleSelector';
import { STYLE_PRESETS } from '../../utils/editorStylePresets';
import { contactPresets } from '../../utils/contactPresets';
import { headerPresets } from '../../utils/headerPresets';

const SiteStyleManager = ({ 
  open, 
  onClose, 
  headerData,
  sectionsData,
  heroData,
  contactData,
  footerData,
  onApplyToWholeWebsite,
  onHeaderChange,
  onSectionsChange,
  onHeroChange,
  onContactChange
}) => {
  // Добавляем состояние для параметра "один стиль для всех"
  const [useSameStyle, setUseSameStyle] = useState(true);
  // Добавляем состояние для выбранного стиля шапки
  const [selectedHeaderStyle, setSelectedHeaderStyle] = useState('');
  const [headerStyleApplied, setHeaderStyleApplied] = useState(false);
  
  // Проверяем при монтировании компонента, что нужные функции доступны
  useEffect(() => {
    console.log('Компонент SiteStyleManager смонтирован');
    
    if (typeof onApplyToWholeWebsite !== 'function') {
      console.warn('Функция onApplyToWholeWebsite не является функцией');
    }
    
    // Проверяем наличие нужных функций для режима разных стилей
    if (typeof onHeaderChange !== 'function') {
      console.warn('Функция onHeaderChange не является функцией');
    }
    
    if (typeof onSectionsChange !== 'function') {
      console.warn('Функция onSectionsChange не является функцией');
    }
    
    if (typeof onHeroChange !== 'function') {
      console.warn('Функция onHeroChange не является функцией');
    }
    
    if (typeof onContactChange !== 'function') {
      console.warn('Функция onContactChange не является функцией');
    }
  }, [onApplyToWholeWebsite, onHeaderChange, onSectionsChange, onHeroChange, onContactChange]);
  
  // Обработчик для галочки "один стиль для всех"
  const handleSameStyleChange = (event) => {
    setUseSameStyle(event.target.checked);
  };
  
  // Вспомогательная функция для выбора случайного ключа из объекта
  const getRandomKey = (obj) => {
    const keys = Object.keys(obj);
    return keys[Math.floor(Math.random() * keys.length)];
  };
  
  // Функция-обертка для обработки применения стилей
  const handleApplyStyle = (styleName, stylePreset) => {
    console.log('Применение стиля:', styleName, useSameStyle ? 'один стиль' : 'разные стили');
    
    if (useSameStyle) {
      // Если выбран один стиль для всего сайта
      onApplyToWholeWebsite(styleName, stylePreset);
      
      // Дополнительно подбираем и применяем подходящий стиль для шапки
      applyMatchingHeaderStyle(styleName, stylePreset);
    } else {
      // Если выбраны разные стили для разделов
      applyRandomStylesToSections(styleName, stylePreset);
      
      // Также выбираем случайный стиль для шапки
      applyRandomHeaderStyle();
    }
  };
  
  // Функция для подбора и применения стиля шапки, соответствующего выбранному стилю сайта
  const applyMatchingHeaderStyle = (sitStyleName, siteStylePreset) => {
    console.log('Подбираем соответствующий стиль шапки');
    
    // Проверяем, что headerPresets доступны
    if (!headerPresets || typeof headerPresets !== 'object') {
      console.error('headerPresets не определены или не являются объектом');
      return;
    }
    
    // Ищем стиль с таким же именем в headerPresets
    let matchingHeaderStyle = headerPresets[sitStyleName];
    
    // Если не нашли точное совпадение по имени, ищем по цветовой гамме
    if (!matchingHeaderStyle) {
      // Ищем похожий стиль по основным цветам
      const matchingStyles = Object.entries(headerPresets).filter(([key, preset]) => {
        return (
          preset.titleColor === siteStylePreset.titleColor ||
          preset.backgroundColor === siteStylePreset.backgroundColor ||
          (preset.linksColor && preset.linksColor === siteStylePreset.descriptionColor)
        );
      });
      
      if (matchingStyles.length > 0) {
        // Берем первый подходящий стиль
        matchingHeaderStyle = matchingStyles[0][1];
        console.log(`Найден похожий стиль шапки: ${matchingStyles[0][0]}`);
      } else {
        // Ищем стиль с похожим названием
        const styleFirstWord = sitStyleName.split('_')[0].toLowerCase();
        const matchByName = Object.entries(headerPresets).find(([key]) => 
          key.toLowerCase().includes(styleFirstWord)
        );
        
        if (matchByName) {
          matchingHeaderStyle = matchByName[1];
          console.log(`Найден стиль шапки с похожим названием: ${matchByName[0]}`);
        }
      }
    } else {
      console.log(`Найден точно соответствующий стиль шапки: ${sitStyleName}`);
    }
    
    // Если нашли подходящий стиль, применяем его
    if (matchingHeaderStyle) {
      onHeaderChange({
        ...headerData,
        titleColor: matchingHeaderStyle.titleColor,
        backgroundColor: matchingHeaderStyle.backgroundColor,
        linksColor: matchingHeaderStyle.linksColor,
        siteBackgroundType: matchingHeaderStyle.siteBackgroundType,
        ...(matchingHeaderStyle.siteBackgroundType === 'solid' && {
          siteBackgroundColor: matchingHeaderStyle.siteBackgroundColor
        }),
        ...(matchingHeaderStyle.siteBackgroundType === 'gradient' && {
          siteGradientColor1: matchingHeaderStyle.siteGradientColor1,
          siteGradientColor2: matchingHeaderStyle.siteGradientColor2,
          siteGradientDirection: matchingHeaderStyle.siteGradientDirection
        })
      });
      
      // Обновляем выбранный стиль в UI
      const matchedStyleKey = Object.keys(headerPresets).find(key => headerPresets[key] === matchingHeaderStyle);
      if (matchedStyleKey) {
        setSelectedHeaderStyle(matchedStyleKey);
      }
    } else {
      console.log('Не найден подходящий стиль шапки, используем стандартные цвета');
      // Если не нашли подходящий стиль, используем цвета из стиля сайта
      onHeaderChange({
        ...headerData,
        titleColor: siteStylePreset.titleColor,
        backgroundColor: siteStylePreset.backgroundColor,
        linksColor: siteStylePreset.descriptionColor || siteStylePreset.titleColor
      });
    }
  };
  
  // Функция для применения случайного стиля к шапке
  const applyRandomHeaderStyle = () => {
    // Получаем все доступные стили шапки
    const headerStyleKeys = Object.keys(headerPresets);
    
    if (headerStyleKeys.length === 0) {
      console.error('Список стилей шапки пуст');
      return;
    }
    
    // Выбираем случайный стиль
    const randomIndex = Math.floor(Math.random() * headerStyleKeys.length);
    const selectedStyle = headerStyleKeys[randomIndex];
    const preset = headerPresets[selectedStyle];
    
    console.log('Применяем случайный стиль к шапке:', selectedStyle);
    
    // Применяем стиль
    onHeaderChange({
      ...headerData,
      titleColor: preset.titleColor,
      backgroundColor: preset.backgroundColor,
      linksColor: preset.linksColor,
      siteBackgroundType: preset.siteBackgroundType,
      ...(preset.siteBackgroundType === 'solid' && {
        siteBackgroundColor: preset.siteBackgroundColor
      }),
      ...(preset.siteBackgroundType === 'gradient' && {
        siteGradientColor1: preset.siteGradientColor1,
        siteGradientColor2: preset.siteGradientColor2,
        siteGradientDirection: preset.siteGradientDirection
      })
    });
    
    // Обновляем выбранный стиль в UI
    setSelectedHeaderStyle(selectedStyle);
  };
  
  // Функция для применения разных стилей к разным разделам
  const applyRandomStylesToSections = (mainStyleName, mainStylePreset) => {
    // Проверяем, что STYLE_PRESETS существует
    if (!STYLE_PRESETS || typeof STYLE_PRESETS !== 'object') {
      console.error('STYLE_PRESETS не определен или не является объектом');
      return;
    }
    
    // Получаем список всех стилей
    const styleNames = Object.keys(STYLE_PRESETS);
    if (styleNames.length === 0) {
      console.error('Список стилей пуст');
      return;
    }
    
    console.log('Применяем разные стили для разных разделов. Доступные стили:', styleNames);
    
    // Применяем основной стиль к шапке
    if (typeof onHeaderChange === 'function' && headerData) {
      onHeaderChange({
        ...headerData,
        titleColor: mainStylePreset.titleColor,
        backgroundColor: mainStylePreset.backgroundColor,
        borderColor: mainStylePreset.borderColor,
      });
    }
    
    // Применяем стиль к герою
    if (typeof onHeroChange === 'function' && heroData) {
      const randomStyleName = getRandomKey(STYLE_PRESETS);
      const randomStylePreset = STYLE_PRESETS[randomStyleName];
      
      if (randomStylePreset) {
        onHeroChange({
          ...heroData,
          titleColor: randomStylePreset.titleColor,
          descriptionColor: randomStylePreset.descriptionColor,
          backgroundColor: randomStylePreset.backgroundColor,
          borderColor: randomStylePreset.borderColor,
        });
      }
    }
    
    // Применяем разные стили к разным секциям
    if (typeof onSectionsChange === 'function' && sectionsData) {
      const updatedSections = {};
      
      Object.keys(sectionsData).forEach(sectionId => {
        const section = sectionsData[sectionId];
        
        // Выбираем случайный стиль для секции
        const randomIndex = Math.floor(Math.random() * styleNames.length);
        const randomStyleName = styleNames[randomIndex];
        const randomStylePreset = STYLE_PRESETS[randomStyleName];
        
        if (!randomStylePreset) {
          console.error(`Не найден стиль с именем ${randomStyleName}`);
          return;
        }
        
        // Применяем стиль к секции
        updatedSections[sectionId] = {
          ...section,
          titleColor: randomStylePreset.titleColor,
          descriptionColor: randomStylePreset.descriptionColor,
          backgroundColor: randomStylePreset.backgroundColor,
          borderColor: randomStylePreset.borderColor,
          cardType: randomStylePreset.cardType || section.cardType,
          
          // Обновляем свойства карточек
          cards: Array.isArray(section.cards) ? section.cards.map(card => ({
            ...card,
            titleColor: randomStylePreset.cardTitleColor,
            contentColor: randomStylePreset.cardContentColor,
            backgroundColor: randomStylePreset.cardBackgroundColor,
            borderColor: randomStylePreset.cardBorderColor,
            backgroundType: randomStylePreset.cardBackgroundType,
            gradientColor1: randomStylePreset.cardGradientColor1,
            gradientColor2: randomStylePreset.cardGradientColor2,
            gradientDirection: randomStylePreset.cardGradientDirection,
            style: {
              ...card.style,
              shadow: randomStylePreset.style?.shadow || '0 2px 4px rgba(0,0,0,0.1)',
              borderRadius: randomStylePreset.style?.borderRadius || '8px'
            }
          })) : []
        };
      });
      
      // Применяем все изменения
      onSectionsChange(updatedSections);
    }
    
    // Применяем случайный стиль из contactPresets к контактной форме
    if (typeof onContactChange === 'function' && contactData) {
      // Проверяем наличие contactPresets
      if (contactPresets && typeof contactPresets === 'object' && Object.keys(contactPresets).length > 0) {
        // Выбираем случайный стиль для контактов
        const randomContactStyle = getRandomKey(contactPresets);
        const randomContactPreset = contactPresets[randomContactStyle];
        
        console.log(`Применяем стиль ${randomContactStyle} к разделу контактов`);
        
        if (randomContactPreset) {
          onContactChange({
            ...contactData,
            titleColor: randomContactPreset.titleColor,
            descriptionColor: randomContactPreset.descriptionColor,
            companyInfoColor: randomContactPreset.companyInfoColor,
            formVariant: randomContactPreset.formVariant,
            infoVariant: randomContactPreset.infoVariant,
            formBackgroundColor: randomContactPreset.formBackgroundColor,
            infoBackgroundColor: randomContactPreset.infoBackgroundColor,
            formBorderColor: randomContactPreset.formBorderColor,
            infoBorderColor: randomContactPreset.infoBorderColor,
            labelColor: randomContactPreset.labelColor,
            inputBackgroundColor: randomContactPreset.inputBackgroundColor,
            inputTextColor: randomContactPreset.inputTextColor,
            buttonColor: randomContactPreset.buttonColor,
            buttonTextColor: randomContactPreset.buttonTextColor,
            iconColor: randomContactPreset.iconColor,
            infoTitleColor: randomContactPreset.infoTitleColor,
            infoTextColor: randomContactPreset.infoTextColor
          });
        } else {
          // Если не нашли случайный стиль, применяем основной стиль только к основным цветам
          onContactChange({
            ...contactData,
            titleColor: mainStylePreset.titleColor,
            descriptionColor: mainStylePreset.descriptionColor,
            backgroundColor: mainStylePreset.backgroundColor,
            borderColor: mainStylePreset.borderColor,
          });
        }
      } else {
        // Если нет contactPresets, используем стандартные стили
        onContactChange({
          ...contactData,
          titleColor: mainStylePreset.titleColor,
          descriptionColor: mainStylePreset.descriptionColor,
          backgroundColor: mainStylePreset.backgroundColor,
          borderColor: mainStylePreset.borderColor,
        });
      }
    }
  };
  
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { 
          borderRadius: 2,
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
          pb: 2
        }}
      >
        <Typography variant="h5" component="div" fontWeight="500">
          Управление стилями сайта
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent 
        sx={{ 
          mt: 2, 
          px: { xs: 2, sm: 3 },
          pb: 2,
          overflowY: 'auto'
        }}
      >
        <Typography variant="body1" sx={{ mb: 2 }}>
          Здесь вы можете быстро изменить стиль всего сайта, применив одну из предустановленных тем оформления.
        </Typography>
        
        <Alert severity="info" sx={{ mb: 3 }}>
          Выберите готовый стиль из списка или нажмите кнопку "Случайный стиль". Используются те же стили, что доступны в разделе "Быстрые стили" в панели редактирования каждой секции.
        </Alert>
        
        <Box sx={{ 
          mb: 3, 
          p: 2, 
          bgcolor: '#f5f5f5', 
          borderRadius: 2, 
          border: '1px solid #e0e0e0' 
        }}>
          <FormControlLabel
            control={
              <Switch 
                checked={useSameStyle}
                onChange={handleSameStyleChange}
                color="primary"
              />
            }
            label="Один стиль для всех разделов"
          />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {useSameStyle 
              ? "Выбранный стиль будет применен ко всем разделам сайта" 
              : "Каждый раздел получит уникальный случайный стиль при применении"
            }
          </Typography>
        </Box>
        
        <Divider sx={{ mb: 3 }} />
        
        <RandomStyleSelector
          onApplyToWholeWebsite={handleApplyStyle}
          headerData={headerData}
          sectionsData={sectionsData}
          heroData={heroData}
          contactData={contactData}
          footerData={footerData}
          useSameStyle={useSameStyle}
        />
        
        <Divider sx={{ my: 3 }} />
        
        {/* Секция предустановленных стилей для шапки */}
        <Box sx={{ 
          p: 3, 
          mb: 3,
          bgcolor: '#f5f5f5', 
          borderRadius: 2,
          border: '1px solid #e0e0e0'
        }}>
          <Typography variant="h6" gutterBottom sx={{ color: '#1976d2', fontWeight: 500 }}>
            Предустановленные стили оформления шапки
          </Typography>
          
          <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
            Выберите готовый стиль для шапки сайта. Стиль будет применен только к шапке и не затронет другие разделы.
            При использовании функции "Случайный стиль" система автоматически подберет подходящий стиль шапки.
          </Typography>
          
          <FormControl fullWidth size="small" sx={{ 
            mt: 1,
            '& .MuiOutlinedInput-root': {
              borderRadius: 1,
              bgcolor: '#fff',
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#1976d2',
              },
            }
          }}>
            <InputLabel>Выберите стиль</InputLabel>
            <Select
              label="Выберите стиль"
              value={selectedHeaderStyle}
              onChange={(e) => {
                const presetKey = e.target.value;
                setSelectedHeaderStyle(presetKey);
                
                if (!presetKey || !headerPresets[presetKey]) return;
                
                const preset = headerPresets[presetKey];
                onHeaderChange({
                  ...headerData,
                  titleColor: preset.titleColor,
                  backgroundColor: preset.backgroundColor,
                  linksColor: preset.linksColor,
                  siteBackgroundType: preset.siteBackgroundType,
                  ...(preset.siteBackgroundType === 'solid' && {
                    siteBackgroundColor: preset.siteBackgroundColor
                  }),
                  ...(preset.siteBackgroundType === 'gradient' && {
                    siteGradientColor1: preset.siteGradientColor1,
                    siteGradientColor2: preset.siteGradientColor2,
                    siteGradientDirection: preset.siteGradientDirection
                  })
                });
                
                // Устанавливаем флаг, что стиль был применен
                setHeaderStyleApplied(true);
                
                // Автоматически скрываем уведомление через 3 секунды
                setTimeout(() => {
                  setHeaderStyleApplied(false);
                }, 3000);
              }}
              MenuProps={{
                PaperProps: {
                  sx: { 
                    maxHeight: 350,
                    '&::-webkit-scrollbar': {
                      width: '8px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                      backgroundColor: 'rgba(0,0,0,0.2)',
                      borderRadius: '4px',
                    }
                  }
                }
              }}
            >
              <MenuItem value="">
                <em>Выберите стиль шапки</em>
              </MenuItem>
              {Object.entries(headerPresets).map(([key, preset]) => (
                <MenuItem key={key} value={key} sx={{
                  py: 1,
                  borderBottom: '1px solid #f0f0f0',
                  '&:last-child': {
                    borderBottom: 'none'
                  },
                  '&.Mui-selected': {
                    bgcolor: 'rgba(25, 118, 210, 0.08)'
                  }
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: 1,
                        background: preset.siteBackgroundType === 'gradient'
                          ? `linear-gradient(${preset.siteGradientDirection || 'to right'}, ${preset.siteGradientColor1}, ${preset.siteGradientColor2})`
                          : preset.backgroundColor,
                        border: `2px solid ${preset.titleColor}`
                      }}
                    />
                    <Typography variant="body2">{preset.name}</Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          {headerStyleApplied && (
            <Alert severity="success" sx={{ mt: 2 }}>
              Стиль "{headerPresets[selectedHeaderStyle]?.name}" успешно применен к шапке сайта
            </Alert>
          )}
          
          {selectedHeaderStyle && headerPresets[selectedHeaderStyle] && (
            <Box sx={{ 
              mt: 2, 
              p: 2, 
              borderRadius: 1, 
              border: '1px solid #e0e0e0',
              bgcolor: '#fff'
            }}>
              <Typography variant="subtitle2" gutterBottom>
                Предпросмотр стиля шапки:
              </Typography>
              
              <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1
              }}>
                <Box sx={{ 
                  p: 1, 
                  bgcolor: headerPresets[selectedHeaderStyle].backgroundColor,
                  borderRadius: 1,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: headerPresets[selectedHeaderStyle].titleColor,
                      fontWeight: 'bold' 
                    }}
                  >
                    {headerData.siteName || 'Название сайта'}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    {['Меню 1', 'Меню 2', 'Меню 3'].map((item, index) => (
                      <Typography 
                        key={index}
                        variant="caption" 
                        sx={{ color: headerPresets[selectedHeaderStyle].linksColor }}
                      >
                        {item}
                      </Typography>
                    ))}
                  </Box>
                </Box>
                
                <Box sx={{ 
                  display: 'flex', 
                  gap: 2, 
                  mt: 1,
                  alignItems: 'center'
                }}>
                  <Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      Цвет заголовка:
                    </Typography>
                    <Box 
                      sx={{ 
                        width: 24, 
                        height: 24, 
                        bgcolor: headerPresets[selectedHeaderStyle].titleColor,
                        borderRadius: '50%',
                        border: '1px solid #e0e0e0'
                      }} 
                    />
                  </Box>
                  
                  <Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      Цвет фона:
                    </Typography>
                    <Box 
                      sx={{ 
                        width: 24, 
                        height: 24, 
                        bgcolor: headerPresets[selectedHeaderStyle].backgroundColor,
                        borderRadius: '50%',
                        border: '1px solid #e0e0e0'
                      }} 
                    />
                  </Box>
                  
                  <Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      Цвет ссылок:
                    </Typography>
                    <Box 
                      sx={{ 
                        width: 24, 
                        height: 24, 
                        bgcolor: headerPresets[selectedHeaderStyle].linksColor,
                        borderRadius: '50%',
                        border: '1px solid #e0e0e0'
                      }} 
                    />
                  </Box>
                </Box>
              </Box>
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ borderTop: '1px solid rgba(0, 0, 0, 0.12)', px: 3, py: 2 }}>
        <Button 
          onClick={onClose} 
          variant="contained"
          sx={{ 
            minWidth: '120px',
            bgcolor: '#1976d2',
            '&:hover': { bgcolor: '#1565c0' }
          }}
        >
          Закрыть
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SiteStyleManager; 