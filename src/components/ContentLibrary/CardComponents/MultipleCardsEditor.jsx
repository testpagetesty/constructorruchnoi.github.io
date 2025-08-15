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
import ColorSettings from '../TextComponents/ColorSettings';
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
    },
    sectionColorSettings: {
      textFields: {
        title: sectionStyles?.titleColor || '#1976d2',
        description: sectionStyles?.descriptionColor || '#666666'
      },
      sectionBackground: {
        enabled: sectionStyles?.backgroundType !== 'transparent',
        useGradient: sectionStyles?.backgroundType === 'gradient',
        solidColor: sectionStyles?.backgroundColor || '#ffffff',
        gradientColor1: sectionStyles?.gradientStartColor || '#1976d2',
        gradientColor2: sectionStyles?.gradientEndColor || '#42a5f5',
        gradientDirection: sectionStyles?.gradientDirection || 'to right'
      }
    }
  });


  
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
      // Добавляем sectionColorSettings
      sectionColorSettings: editingData.sectionColorSettings,
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
        backgroundColor: editingData.cards[0]?.customStyles?.backgroundColor || '#ffffff',
        borderColor: editingData.cards[0]?.customStyles?.borderColor || '#e0e0e0',
        borderWidth: 1,
        borderRadius: 8,
        textColor: editingData.cards[0]?.customStyles?.textColor || '#333333',
        titleColor: editingData.cards[0]?.customStyles?.titleColor || '#1976d2',
        backgroundType: editingData.cards[0]?.customStyles?.backgroundType || 'solid',
        gradientColor1: editingData.cards[0]?.customStyles?.gradientColor1 || '#c41e3a',
        gradientColor2: editingData.cards[0]?.customStyles?.gradientColor2 || '#ffd700',
        gradientDirection: editingData.cards[0]?.customStyles?.gradientDirection || 'to right'
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
        </Stack>

        {/* Настройки цветов для раздела */}
          <Stack spacing={2}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
              Настройки цветов раздела
            </Typography>
            
            <ColorSettings
              title="Цвета раздела"
              colorSettings={editingData.sectionColorSettings}
              onUpdate={(newColorSettings) => {
                const newSectionStyles = { ...editingData.sectionStyles };
                
                if (newColorSettings.textFields) {
                  if (newColorSettings.textFields.title) {
                    newSectionStyles.titleColor = newColorSettings.textFields.title;
                  }
                  if (newColorSettings.textFields.description) {
                    newSectionStyles.descriptionColor = newColorSettings.textFields.description;
                  }
                }
                
                if (newColorSettings.sectionBackground) {
                  if (newColorSettings.sectionBackground.enabled) {
                    if (newColorSettings.sectionBackground.useGradient) {
                      newSectionStyles.backgroundType = 'gradient';
                      newSectionStyles.gradientStartColor = newColorSettings.sectionBackground.gradientColor1;
                      newSectionStyles.gradientEndColor = newColorSettings.sectionBackground.gradientColor2;
                      newSectionStyles.gradientDirection = newColorSettings.sectionBackground.gradientDirection;
                    } else {
                      newSectionStyles.backgroundType = 'solid';
                      newSectionStyles.backgroundColor = newColorSettings.sectionBackground.solidColor;
                    }
                  } else {
                    newSectionStyles.backgroundType = 'transparent';
                  }
                }
                
                setEditingData(prev => ({
                  ...prev,
                  sectionStyles: newSectionStyles,
                  sectionColorSettings: newColorSettings
                }));
              }}
              availableFields={[
                {
                  name: 'title',
                  label: 'Цвет заголовка',
                  description: 'Цвет заголовка секции',
                  defaultColor: '#1976d2'
                },
                {
                  name: 'description',
                  label: 'Цвет описания',
                  description: 'Цвет описания секции',
                  defaultColor: '#666666'
                }
              ]}
              defaultColors={{
                textFields: {
                  title: '#1976d2',
                  description: '#666666'
                },
                sectionBackground: {
                  enabled: false,
                  useGradient: false,
                  solidColor: '#ffffff',
                  gradientColor1: '#1976d2',
                  gradientColor2: '#42a5f5',
                  gradientDirection: 'to right'
                }
              }}
            />

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

          {/* Настройки цветов для всех карточек */}
          <Stack spacing={2}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
              Настройки цветов для всех карточек
            </Typography>
            
            <Box sx={{ 
              p: 2, 
              backgroundColor: 'rgba(25, 118, 210, 0.1)', 
              borderRadius: 1,
              border: '1px solid #1976d2',
              mb: 2
            }}>
              <Typography variant="body2" color="primary" sx={{ fontWeight: 'bold' }}>
                💡 Настройки применяются ко всем карточкам одновременно
              </Typography>
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <ColorSettings
                  title="Цвета текста и границ карточек"
                  colorSettings={{
                    textFields: {
                      title: editingData.cards[0]?.customStyles?.titleColor || '#1976d2',
                      text: editingData.cards[0]?.customStyles?.textColor || '#333333',
                      border: editingData.cards[0]?.customStyles?.borderColor || '#e0e0e0'
                    }
                  }}
                  onUpdate={(newColorSettings) => {
                    const updatedCustomStyles = {
                      titleColor: newColorSettings.textFields?.title || '#1976d2',
                      textColor: newColorSettings.textFields?.text || '#333333',
                      borderColor: newColorSettings.textFields?.border || '#e0e0e0'
                    };
                    
                    // Применяем ко всем карточкам
                    setEditingData(prev => ({
                      ...prev,
                      cards: prev.cards.map(card => ({
                        ...card,
                        customStyles: {
                          ...card.customStyles,
                          ...updatedCustomStyles
                        }
                      }))
                    }));
                  }}
                  availableFields={[
                    {
                      name: 'title',
                      label: 'Цвет заголовка',
                      description: 'Цвет заголовка карточки',
                      defaultColor: '#1976d2'
                    },
                    {
                      name: 'text',
                      label: 'Цвет описания',
                      description: 'Цвет основного текста',
                      defaultColor: '#333333'
                    },
                    {
                      name: 'border',
                      label: 'Цвет границы',
                      description: 'Цвет рамки карточки',
                      defaultColor: '#e0e0e0'
                    }
                  ]}
                  defaultColors={{
                    textFields: {
                      title: '#1976d2',
                      text: '#333333',
                      border: '#e0e0e0'
                    }
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <ColorSettings
                  title="Настройки фона карточек"
                  colorSettings={{
                    sectionBackground: {
                      enabled: true,
                      useGradient: editingData.cards[0]?.customStyles?.backgroundType === 'gradient',
                      solidColor: editingData.cards[0]?.customStyles?.backgroundColor || '#ffffff',
                      gradientColor1: editingData.cards[0]?.customStyles?.gradientColor1 || '#c41e3a',
                      gradientColor2: editingData.cards[0]?.customStyles?.gradientColor2 || '#ffd700',
                      gradientDirection: editingData.cards[0]?.customStyles?.gradientDirection || 'to right'
                    }
                  }}
                  onUpdate={(newColorSettings) => {
                    const updatedCustomStyles = {
                      backgroundColor: newColorSettings.sectionBackground?.solidColor || '#ffffff',
                      backgroundType: newColorSettings.sectionBackground?.useGradient ? 'gradient' : 'solid',
                      gradientColor1: newColorSettings.sectionBackground?.gradientColor1 || '#c41e3a',
                      gradientColor2: newColorSettings.sectionBackground?.gradientColor2 || '#ffd700',
                      gradientDirection: newColorSettings.sectionBackground?.gradientDirection || 'to right'
                    };
                    
                    // Применяем ко всем карточкам
                    setEditingData(prev => ({
                      ...prev,
                      cards: prev.cards.map(card => ({
                        ...card,
                        customStyles: {
                          ...card.customStyles,
                          ...updatedCustomStyles
                        }
                      }))
                    }));
                  }}
                  availableFields={[]}
                  defaultColors={{
                    sectionBackground: {
                      enabled: true,
                      useGradient: false,
                      solidColor: '#ffffff',
                      gradientColor1: '#c41e3a',
                      gradientColor2: '#ffd700',
                      gradientDirection: 'to right'
                    }
                  }}
                />
              </Grid>
            </Grid>
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
        <Box sx={{ 
          p: 2, 
          backgroundColor: 'rgba(76, 175, 80, 0.1)', 
          borderRadius: 1,
          border: '1px solid #4caf50'
        }}>
          <Typography variant="body2" color="success.main" sx={{ fontWeight: 'bold' }}>
            🎨 <strong>Настройки цветов карточек применяются ко всем карточкам одновременно!</strong><br />
            Измените цвета в блоке "Настройки цветов для всех карточек" выше, и они будут применены ко всем карточкам в секции.
          </Typography>
        </Box>

        {/* Редактирование карточек */}
        <Stack spacing={2}>
          {editingData.cards.map((card, index) => (
            <Paper key={card.id} sx={{ 
              p: 2, 
              border: '1px solid #e0e0e0',
              backgroundColor: 'white'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="subtitle2">
                  Карточка {index + 1}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
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
                     rows={4}
                     size="small"
                     placeholder="Введите описание карточки (рекомендуется до 50 слов)..."
                     helperText={`${(card.content || '').split(/\s+/).filter(word => word.length > 0).length} слов`}
                   />
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