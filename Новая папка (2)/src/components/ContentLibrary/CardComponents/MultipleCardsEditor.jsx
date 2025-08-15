import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Paper,
  Stack,
  Divider,
  IconButton,
  Grid,
  Chip,
  FormControlLabel,
  Checkbox,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MultipleCardsSection from './MultipleCardsSection';
import ImageUploadPreview from './ImageUploadPreview';
import ColorPicker from '../../ColorPicker/ColorPicker';
import AnimationControls from '../AnimationControls';

const MultipleCardsEditor = ({
  title = '',
  description = '',
  cards = [],
  cardType = 'image-card',
  gridSize = 'medium',
  sectionStyles = null,
  onSave,
  onCancel,
  isPreview = true
}) => {
  const [editingData, setEditingData] = useState({
    title,
    description,
    cards: cards.map(card => ({
      ...card,
      customStyles: {
        backgroundColor: '#ffffff',
        borderColor: '#e0e0e0',
        borderWidth: 1,
        borderRadius: 8,
        textColor: '#333333',
        titleColor: '#1976d2',
        backgroundType: 'solid',
        gradientColor1: '#c41e3a',
        gradientColor2: '#ffd700',
        gradientDirection: 'to right',
        ...card.customStyles // Сохраняем существующие стили
      }
    })),
    cardType,
    gridSize,
    sectionStyles: sectionStyles || {
      titleColor: '#1976d2',
      descriptionColor: '#666666',
      backgroundColor: '#ffffff',
      backgroundType: 'transparent',
      gradientDirection: 'to right',
      gradientStartColor: '#1976d2',
      gradientEndColor: '#42a5f5',
      padding: '20px',
      borderRadius: '0px'
    }
  });

  // Добавляем состояние для галочки "использовать для всех карточек"
  const [applyToAllCards, setApplyToAllCards] = useState(true);
  
  // Состояние для анимаций секции
  const [sectionAnimationSettings, setSectionAnimationSettings] = useState({
    animationType: 'fadeIn',
    delay: 0,
    triggerOnView: true,
    triggerOnce: true,
    threshold: 0.1,
    disabled: false
  });
  
  // Состояние для анимаций карточек
  const [cardsAnimationSettings, setCardsAnimationSettings] = useState({
    animationType: 'fadeIn',
    delay: 0.1,
    triggerOnView: true,
    triggerOnce: true,
    threshold: 0.1,
    disabled: false
  });

  const handleSave = () => {
    // Убеждаемся, что все карточки имеют правильные customStyles
    const dataToSave = {
      ...editingData,
      // Добавляем настройки анимаций
      sectionAnimationSettings,
      cardsAnimationSettings,
      cards: editingData.cards.map(card => ({
        ...card,
        customStyles: {
          backgroundColor: '#ffffff',
          borderColor: '#e0e0e0',
          borderWidth: 1,
          borderRadius: 8,
          textColor: '#333333',
          titleColor: '#1976d2',
          backgroundType: 'solid',
          gradientColor1: '#c41e3a',
          gradientColor2: '#ffd700',
          gradientDirection: 'to right',
          ...card.customStyles // Сохраняем все изменения пользователя
        },
        // Убеждаемся, что у каждой карточки есть настройки анимации
        animationSettings: {
          ...cardsAnimationSettings,
          delay: cardsAnimationSettings.delay + (editingData.cards.indexOf(card) * 0.1),
          ...card.animationSettings
        }
      }))
    };
    
    console.log('Сохранение данных multiple-cards:', dataToSave);
    onSave(dataToSave);
  };

  const handleCancel = () => {
    onCancel();
  };

  const handleAddCard = () => {
    const cardNumber = editingData.cards.length + 1;
    const newCard = {
      id: Date.now(),
      title: `Карточка ${cardNumber}`,
      content: 'Описание карточки',
      imageUrl: '', // Пустое изображение - пользователь загрузит свое
      imageAlt: `Карточка ${cardNumber}`,
      buttonText: 'Подробнее',
      buttonLink: '#',
      gridSize: 'medium',
      variant: 'elevated',
      size: 'medium',
      alignment: 'left',
      showActions: false,
      customStyles: {
        backgroundColor: '#ffffff',
        borderColor: '#e0e0e0',
        borderWidth: 1,
        borderRadius: 8,
        textColor: '#333333',
        titleColor: '#1976d2',
        backgroundType: 'solid',
        gradientColor1: '#c41e3a',
        gradientColor2: '#ffd700',
        gradientDirection: 'to right'
      },
      animationSettings: {
        animationType: 'fadeIn',
        delay: editingData.cards.length * 0.1,
        triggerOnView: true,
        triggerOnce: true,
        threshold: 0.1,
        disabled: false
      }
    };
    
    setEditingData(prev => ({
      ...prev,
      cards: [...prev.cards, newCard]
    }));
  };

  const handleDeleteCard = (cardId) => {
    setEditingData(prev => ({
      ...prev,
      cards: prev.cards.filter(card => card.id !== cardId)
    }));
  };

  const handleUpdateCard = (cardId, updatedData) => {
    setEditingData(prev => ({
      ...prev,
      cards: prev.cards.map(card => 
        card.id === cardId ? { ...card, ...updatedData } : card
      )
    }));
  };

  // Новая функция для применения стилей ко всем карточкам
  const handleUpdateCardWithApplyToAll = (cardId, updatedData) => {
    if (applyToAllCards && updatedData.customStyles) {
      // Применяем стили ко всем карточкам
      setEditingData(prev => ({
        ...prev,
        cards: prev.cards.map(card => ({
          ...card,
          customStyles: {
            ...card.customStyles,
            ...updatedData.customStyles
          }
        }))
      }));
    } else {
      // Применяем только к текущей карточке
      handleUpdateCard(cardId, updatedData);
    }
  };

  const handleImageSelect = (cardId, url, fileName, metadata) => {
    setEditingData(prev => ({
      ...prev,
      cards: prev.cards.map(card => 
        card.id === cardId ? { 
          ...card, 
          imageUrl: url,
          imageAlt: metadata.cardTitle || card.title || `Изображение для ${card.title}`,
          fileName: fileName // Сохраняем имя файла для экспорта
        } : card
      )
    }));
    
    // Принудительно обновляем превью
    setTimeout(() => {
      const event = new CustomEvent('cardImageUpdated', { 
        detail: { cardId, url, fileName, metadata } 
      });
      window.dispatchEvent(event);
    }, 50);
  };

  // Функция для обновления стилей секции
  const handleSectionStyleChange = (property, value) => {
    setEditingData(prev => {
      const newSectionStyles = { ...prev.sectionStyles };
      newSectionStyles[property] = value;
      
      return {
        ...prev,
        sectionStyles: newSectionStyles
      };
    });
  };
  
  // Функция для обработки анимаций секции
  const handleSectionAnimationChange = (newSettings) => {
    setSectionAnimationSettings(newSettings);
  };
  
  // Функция для обработки анимаций карточек
  const handleCardsAnimationChange = (newSettings) => {
    setCardsAnimationSettings(newSettings);
    // Применяем анимации ко всем карточкам
    setEditingData(prev => ({
      ...prev,
      cards: prev.cards.map((card, index) => ({
        ...card,
        animationSettings: {
          ...newSettings,
          delay: newSettings.delay + (index * 0.1) // Каждая карточка с небольшой задержкой
        }
      }))
    }));
  };

  return (
    <Paper sx={{ p: 3, border: '2px solid #1976d2', borderRadius: 2 }}>
      <Stack spacing={3}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" color="primary">
            Редактирование множественных карточек
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSave}
              size="small"
            >
              Сохранить
            </Button>
            <Button
              variant="outlined"
              startIcon={<CancelIcon />}
              onClick={handleCancel}
              size="small"
            >
              Отмена
            </Button>
          </Box>
        </Box>

        <Divider />

        <Stack spacing={2}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            fullWidth
            label="Заголовок секции"
            value={editingData.title}
            onChange={(e) => setEditingData(prev => ({ ...prev, title: e.target.value }))}
            size="small"
          />
            <Box sx={{ minWidth: 120 }}>
              <Typography variant="caption" display="block" gutterBottom>
                Цвет заголовка
              </Typography>
              <input
                type="color"
                value={editingData.sectionStyles.titleColor}
                onChange={(e) => handleSectionStyleChange('titleColor', e.target.value)}
                style={{ width: '40px', height: '30px', border: 'none', borderRadius: '4px' }}
              />
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            fullWidth
            label="Описание секции"
            value={editingData.description}
            onChange={(e) => setEditingData(prev => ({ ...prev, description: e.target.value }))}
            multiline
            rows={2}
            size="small"
          />
            <Box sx={{ minWidth: 120 }}>
              <Typography variant="caption" display="block" gutterBottom>
                Цвет описания
              </Typography>
              <input
                type="color"
                value={editingData.sectionStyles.descriptionColor}
                onChange={(e) => handleSectionStyleChange('descriptionColor', e.target.value)}
                style={{ width: '40px', height: '30px', border: 'none', borderRadius: '4px' }}
              />
            </Box>
          </Box>

          <FormControl fullWidth size="small">
            <InputLabel>Тип карточек</InputLabel>
            <Select
              value={editingData.cardType}
              onChange={(e) => setEditingData(prev => ({ ...prev, cardType: e.target.value }))}
            >
              <MenuItem value="image-card">Карточки с изображениями</MenuItem>
              <MenuItem value="basic-card">Базовые карточки</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth size="small">
            <InputLabel>Количество столбцов (максимум 4)</InputLabel>
            <Select
              value={editingData.gridSize}
              onChange={(e) => setEditingData(prev => ({ ...prev, gridSize: e.target.value }))}
            >
              <MenuItem value="extra-large">1 столбец</MenuItem>
              <MenuItem value="large">2 столбца</MenuItem>
              <MenuItem value="medium">3 столбца</MenuItem>
              <MenuItem value="small">4 столбца</MenuItem>
            </Select>
          </FormControl>

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle2" gutterBottom>
            Настройки фона секции
          </Typography>

          <FormControl fullWidth size="small">
            <InputLabel>Тип фона</InputLabel>
            <Select
              value={editingData.sectionStyles.backgroundType}
              onChange={(e) => handleSectionStyleChange('backgroundType', e.target.value)}
            >
              <MenuItem value="transparent">Прозрачный</MenuItem>
              <MenuItem value="solid">Сплошной цвет</MenuItem>
              <MenuItem value="gradient">Градиент</MenuItem>
            </Select>
          </FormControl>

          {editingData.sectionStyles.backgroundType === 'transparent' ? (
            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', py: 1 }}>
              Фон секции будет прозрачным
            </Typography>
          ) : editingData.sectionStyles.backgroundType === 'solid' ? (
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Typography variant="body2" sx={{ minWidth: 100 }}>
                Цвет фона:
              </Typography>
              <input
                type="color"
                value={editingData.sectionStyles.backgroundColor}
                onChange={(e) => handleSectionStyleChange('backgroundColor', e.target.value)}
                style={{ width: '40px', height: '30px', border: 'none', borderRadius: '4px' }}
              />
            </Box>
          ) : (
            <Stack spacing={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Направление градиента</InputLabel>
                <Select
                  value={editingData.sectionStyles.gradientDirection}
                  onChange={(e) => handleSectionStyleChange('gradientDirection', e.target.value)}
                >
                  <MenuItem value="to right">Слева направо</MenuItem>
                  <MenuItem value="to left">Справа налево</MenuItem>
                  <MenuItem value="to bottom">Сверху вниз</MenuItem>
                  <MenuItem value="to top">Снизу вверх</MenuItem>
                  <MenuItem value="to bottom right">По диагонали ↘</MenuItem>
                  <MenuItem value="to bottom left">По диагонали ↙</MenuItem>
                  <MenuItem value="to top right">По диагонали ↗</MenuItem>
                  <MenuItem value="to top left">По диагонали ↖</MenuItem>
                </Select>
              </FormControl>

              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Typography variant="body2" sx={{ minWidth: 100 }}>
                  Начальный цвет:
                </Typography>
                <input
                  type="color"
                  value={editingData.sectionStyles.gradientStartColor}
                  onChange={(e) => handleSectionStyleChange('gradientStartColor', e.target.value)}
                  style={{ width: '40px', height: '30px', border: 'none', borderRadius: '4px' }}
                />
              </Box>

              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Typography variant="body2" sx={{ minWidth: 100 }}>
                  Конечный цвет:
                </Typography>
                <input
                  type="color"
                  value={editingData.sectionStyles.gradientEndColor}
                  onChange={(e) => handleSectionStyleChange('gradientEndColor', e.target.value)}
                  style={{ width: '40px', height: '30px', border: 'none', borderRadius: '4px' }}
                />
              </Box>
            </Stack>
          )}

          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              fullWidth
              label="Отступы (px)"
              value={editingData.sectionStyles.padding.replace('px', '')}
              onChange={(e) => handleSectionStyleChange('padding', `${e.target.value}px`)}
              size="small"
              type="number"
            />
            <TextField
              fullWidth
              label="Скругление углов (px)"
              value={editingData.sectionStyles.borderRadius.replace('px', '')}
              onChange={(e) => handleSectionStyleChange('borderRadius', `${e.target.value}px`)}
              size="small"
              type="number"
            />
          </Box>
        </Stack>

        <Divider />

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="subtitle2">
            Карточки в секции: {editingData.cards.length}
          </Typography>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={handleAddCard}
            size="small"
          >
            Добавить карточку
          </Button>
        </Box>

        {/* Информационное сообщение */}
        {applyToAllCards && (
          <Box sx={{ 
            p: 2, 
            backgroundColor: 'rgba(25, 118, 210, 0.1)', 
            borderRadius: 1,
            border: '1px solid #1976d2'
          }}>
            <Typography variant="body2" color="primary">
              ✅ <strong>Режим "Использовать для всех карточек" активен</strong><br />
              Изменения цветов будут применены ко всем карточкам в секции одновременно.
            </Typography>
          </Box>
        )}

        {/* Редактирование карточек */}
        <Stack spacing={2}>
          {editingData.cards.map((card, index) => (
            <Paper key={card.id} sx={{ 
              p: 2, 
              border: applyToAllCards ? '2px solid #1976d2' : '1px solid #e0e0e0',
              backgroundColor: applyToAllCards ? 'rgba(25, 118, 210, 0.02)' : 'white'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="subtitle2">
                  Карточка {index + 1}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {!applyToAllCards && (
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => {
                        // Применяем стили текущей карточки ко всем остальным
                        setEditingData(prev => ({
                          ...prev,
                          cards: prev.cards.map(c => ({
                            ...c,
                            customStyles: {
                              ...c.customStyles,
                              ...card.customStyles
                            }
                          }))
                        }));
                      }}
                      sx={{ fontSize: '0.75rem', px: 1 }}
                    >
                      Применить ко всем
                    </Button>
                  )}
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => handleDeleteCard(card.id)}
                >
                  <DeleteIcon />
                </IconButton>
                </Box>
              </Box>
              
                             <Grid container spacing={2}>
                 <Grid item xs={12} sm={6}>
                   <TextField
                     fullWidth
                     label="Заголовок"
                     value={card.title || ''}
                     onChange={(e) => handleUpdateCard(card.id, { title: e.target.value })}
                     size="small"
                   />
                 </Grid>
                 <Grid item xs={12} sm={6}>
                   <TextField
                     fullWidth
                     label="URL изображения"
                     value={card.imageUrl || ''}
                     onChange={(e) => handleUpdateCard(card.id, { imageUrl: e.target.value })}
                     size="small"
                     placeholder="https://example.com/image.jpg"
                   />
                 </Grid>
                 {editingData.cardType === 'image-card' && (
                   <Grid item xs={12}>
                     <Typography variant="subtitle2" gutterBottom>
                       Выбор изображения из кеша:
                     </Typography>
                                        <ImageUploadPreview 
                     onImageSelect={(url, fileName, metadata) => handleImageSelect(card.id, url, fileName, metadata)}
                     selectedImageUrl={card.imageUrl || ''}
                     cardId={card.id}
                     cardTitle={card.title}
                     onUploadNew={() => {
                       // Открыть диалог загрузки изображения
                       const input = document.createElement('input');
                       input.type = 'file';
                       input.accept = 'image/*';
                       input.onchange = async (e) => {
                         const file = e.target.files[0];
                         if (file) {
                           try {
                             const { imageCacheService } = await import('../../../utils/imageCacheService');
                             
                             // Генерируем уникальное имя файла на основе названия карточки
                             const cardTitle = card.title || `card_${card.id}`;
                             const sanitizedTitle = cardTitle.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
                             const timestamp = Date.now();
                             const fileExtension = file.name.split('.').pop();
                             const fileName = `card_${sanitizedTitle}_${card.id}_${timestamp}.${fileExtension}`;
                             
                             await imageCacheService.saveImage(fileName, file);
                             
                             const metadata = {
                               fileName: fileName,
                               originalName: file.name,
                               cardTitle: cardTitle,
                               cardId: card.id,
                               size: file.size,
                               type: file.type,
                               uploadDate: new Date().toISOString()
                             };
                             await imageCacheService.saveMetadata(`site-images-metadata-${fileName}`, metadata);
                             
                             const blob = await imageCacheService.getImage(fileName);
                             if (blob) {
                               const url = URL.createObjectURL(blob);
                               handleImageSelect(card.id, url, fileName, metadata);
                               
                               // Принудительно обновляем компонент ImageUploadPreview
                               setTimeout(() => {
                                 const event = new CustomEvent('imageUploaded', { 
                                   detail: { fileName, url, metadata } 
                                 });
                                 window.dispatchEvent(event);
                               }, 100);
                             }
                           } catch (error) {
                             console.error('Ошибка при загрузке изображения:', error);
                           }
                         }
                       };
                       input.click();
                     }}
                   />
                   </Grid>
                 )}
                 <Grid item xs={12}>
                   <TextField
                     fullWidth
                     label="Описание"
                     value={card.content || ''}
                     onChange={(e) => handleUpdateCard(card.id, { content: e.target.value })}
                     multiline
                     rows={2}
                     size="small"
                   />
                 </Grid>
                 
                 {/* Настройки цветов для каждого поля */}
                 <Grid item xs={12}>
                   <Divider sx={{ my: 2 }} />
                   <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                     <Typography variant="subtitle2">
                     Настройки цветов полей
                   </Typography>
                     <FormControlLabel
                       control={
                         <Checkbox
                           checked={applyToAllCards}
                           onChange={(e) => setApplyToAllCards(e.target.checked)}
                           color="primary"
                         />
                       }
                       label="Использовать для всех карточек"
                       sx={{ 
                         color: applyToAllCards ? 'primary.main' : 'text.secondary',
                         fontWeight: applyToAllCards ? 'bold' : 'normal'
                       }}
                     />
                   </Box>
                 </Grid>
                 
                 <Grid item xs={12} sm={6}>
                   <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                     <input
                       type="color"
                       value={card.customStyles?.titleColor || '#1976d2'}
                       onChange={(e) => handleUpdateCardWithApplyToAll(card.id, { 
                         customStyles: { 
                           ...card.customStyles, 
                           titleColor: e.target.value 
                         }
                       })}
                       style={{ width: '40px', height: '30px' }}
                     />
                     <Typography variant="body2">Цвет заголовка</Typography>
                   </Box>
                   
                   <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                     <input
                       type="color"
                       value={card.customStyles?.textColor || '#333333'}
                       onChange={(e) => handleUpdateCardWithApplyToAll(card.id, { 
                         customStyles: { 
                           ...card.customStyles, 
                           textColor: e.target.value 
                         }
                       })}
                       style={{ width: '40px', height: '30px' }}
                     />
                     <Typography variant="body2">Цвет описания</Typography>
                   </Box>
                   
                   <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                     <input
                       type="color"
                       value={card.customStyles?.borderColor || '#e0e0e0'}
                       onChange={(e) => handleUpdateCardWithApplyToAll(card.id, { 
                         customStyles: { 
                           ...card.customStyles, 
                           borderColor: e.target.value 
                         }
                       })}
                       style={{ width: '40px', height: '30px' }}
                     />
                     <Typography variant="body2">Цвет границы</Typography>
                   </Box>
                 </Grid>
                 
                 <Grid item xs={12} sm={6}>
                   {/* Настройки фона карточки */}
                   <Typography variant="body2" gutterBottom sx={{ fontWeight: 'bold' }}>
                     Настройки фона карточки:
                   </Typography>
                   
                   <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                     <InputLabel>Тип фона</InputLabel>
                     <Select
                       value={card.customStyles?.backgroundType || 'solid'}
                       onChange={(e) => handleUpdateCardWithApplyToAll(card.id, { 
                         customStyles: { 
                           ...card.customStyles, 
                           backgroundType: e.target.value 
                         }
                       })}
                     >
                       <MenuItem value="solid">Сплошной цвет</MenuItem>
                       <MenuItem value="gradient">Градиент</MenuItem>
                     </Select>
                   </FormControl>

                   {card.customStyles?.backgroundType === 'solid' ? (
                     <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                       <input
                         type="color"
                     value={card.customStyles?.backgroundColor || '#ffffff'}
                         onChange={(e) => handleUpdateCardWithApplyToAll(card.id, { 
                       customStyles: { 
                         ...card.customStyles, 
                         backgroundColor: e.target.value 
                       }
                     })}
                         style={{ width: '40px', height: '30px' }}
                       />
                       <Typography variant="body2">Цвет фона</Typography>
                     </Box>
                   ) : (
                     <Stack spacing={1}>
                       <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                         <input
                           type="color"
                           value={card.customStyles?.gradientColor1 || '#c41e3a'}
                           onChange={(e) => handleUpdateCardWithApplyToAll(card.id, { 
                             customStyles: { 
                               ...card.customStyles, 
                               gradientColor1: e.target.value 
                             }
                           })}
                           style={{ width: '40px', height: '30px' }}
                         />
                         <Typography variant="body2">Первый цвет</Typography>
                       </Box>
                       
                       <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                         <input
                           type="color"
                           value={card.customStyles?.gradientColor2 || '#ffd700'}
                           onChange={(e) => handleUpdateCardWithApplyToAll(card.id, { 
                             customStyles: { 
                               ...card.customStyles, 
                               gradientColor2: e.target.value 
                             }
                           })}
                           style={{ width: '40px', height: '30px' }}
                         />
                         <Typography variant="body2">Второй цвет</Typography>
                       </Box>
                       
                       <FormControl fullWidth size="small">
                         <InputLabel>Направление</InputLabel>
                         <Select
                           value={card.customStyles?.gradientDirection || 'to right'}
                           onChange={(e) => handleUpdateCardWithApplyToAll(card.id, { 
                             customStyles: { 
                               ...card.customStyles, 
                               gradientDirection: e.target.value 
                             }
                           })}
                         >
                           <MenuItem value="to right">Слева направо</MenuItem>
                           <MenuItem value="to left">Справа налево</MenuItem>
                           <MenuItem value="to bottom">Сверху вниз</MenuItem>
                           <MenuItem value="to top">Снизу вверх</MenuItem>
                           <MenuItem value="to bottom right">По диагонали ↘</MenuItem>
                           <MenuItem value="to bottom left">По диагонали ↙</MenuItem>
                           <MenuItem value="to top right">По диагонали ↗</MenuItem>
                           <MenuItem value="to top left">По диагонали ↖</MenuItem>
                         </Select>
                       </FormControl>
                     </Stack>
                   )}
                 </Grid>
               </Grid>
            </Paper>
          ))}
        </Stack>

        {/* Настройки анимаций */}
        <Divider />
        <Typography variant="subtitle2" gutterBottom>
          Настройки анимаций:
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle2">Анимация секции</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <AnimationControls
                  animationSettings={sectionAnimationSettings}
                  onUpdate={handleSectionAnimationChange}
                />
              </AccordionDetails>
            </Accordion>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle2">Анимация карточек</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <AnimationControls
                  animationSettings={cardsAnimationSettings}
                  onUpdate={handleCardsAnimationChange}
                />
              </AccordionDetails>
            </Accordion>
          </Grid>
        </Grid>

        {/* Предварительный просмотр */}
        <Divider />
        <Typography variant="subtitle2" gutterBottom>
          Предварительный просмотр:
        </Typography>
        
        <MultipleCardsSection
          cards={editingData.cards}
          gridSize={editingData.gridSize}
          cardType={editingData.cardType}
          title={editingData.title}
          description={editingData.description}
          sectionStyles={editingData.sectionStyles}
          sectionAnimationSettings={sectionAnimationSettings}
          onEdit={() => {}}
          onDelete={() => {}}
          editable={false}
          onCardUpdate={(cardId, updatedData) => {
            console.log('Обновление карточки:', cardId, updatedData);
            setEditingData(prev => ({
              ...prev,
              cards: prev.cards.map(card => 
                card.id === cardId ? { ...card, ...updatedData } : card
              )
            }));
          }}
        />
      </Stack>
    </Paper>
  );
};

export default MultipleCardsEditor; 