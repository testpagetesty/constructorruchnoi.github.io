import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ViewCarouselIcon from '@mui/icons-material/ViewCarousel';
import ImageCard from './ImageCard';
import BasicCard from './BasicCard';
import ImageUploadPreview from './ImageUploadPreview';

const CardsGridManager = ({
  cards = [],
  onCardsChange,
  cardType = 'image-card',
  gridSize = 'medium',
  onGridSizeChange,
  editable = true
}) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [newCardData, setNewCardData] = useState({
    title: '',
    content: '',
    imageUrl: '',
    imageAlt: '',
    buttonText: '',
    buttonLink: '',
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
      animationType: 'none',
      delay: 0,
      triggerOnView: true,
      triggerOnce: true,
      threshold: 0.1,
      disabled: false
    }
  });

  const handleAddCard = () => {
    const card = {
      id: Date.now(),
      ...newCardData,
      timestamp: new Date().toISOString()
    };
    
    const updatedCards = [...cards, card];
    onCardsChange(updatedCards);
    
    // Сброс формы
    setNewCardData({
      title: '',
      content: '',
      imageUrl: '',
      imageAlt: '',
      buttonText: '',
      buttonLink: '',
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
        animationType: 'none',
        delay: 0,
        triggerOnView: true,
        triggerOnce: true,
        threshold: 0.1,
        disabled: false
      }
    });
    
    setIsAddDialogOpen(false);
  };

  const handleEditCard = (cardId) => {
    const card = cards.find(c => c.id === cardId);
    if (card) {
      setEditingCard(card);
    }
  };

  const handleSaveCard = (updatedCard) => {
    const updatedCards = cards.map(card => 
      card.id === updatedCard.id ? updatedCard : card
    );
    onCardsChange(updatedCards);
    setEditingCard(null);
  };

  const handleDeleteCard = (cardId) => {
    const updatedCards = cards.filter(card => card.id !== cardId);
    onCardsChange(updatedCards);
  };

  const handleDuplicateCard = (card) => {
    const duplicatedCard = {
      ...card,
      id: Date.now(),
      title: `${card.title} (копия)`,
      timestamp: new Date().toISOString()
    };
    const updatedCards = [...cards, duplicatedCard];
    onCardsChange(updatedCards);
  };

  const handleImageSelect = (url, fileName, metadata) => {
    if (editingCard) {
      setEditingCard({
        ...editingCard,
        imageUrl: url,
        imageAlt: metadata.cardTitle || editingCard.title || `Изображение для ${editingCard.title}`,
        fileName: fileName // Сохраняем имя файла для экспорта
      });
      
      // Принудительно обновляем превью
      setTimeout(() => {
        const event = new CustomEvent('cardImageUpdated', { 
          detail: { url, fileName, metadata } 
        });
        window.dispatchEvent(event);
      }, 50);
    }
  };

  // Функция для определения размера карточки
  const getCardSize = () => {
    // Если gridSize равен 'auto', используем автоматический расчет
    if (gridSize === 'auto') {
      const count = cards.length;
      if (count === 1) return 'xxxl';
      if (count === 2) return 'xxl';
      if (count === 3) return 'xl';
      if (count === 4) return 'large';
      return 'medium';
    }
    
    // Иначе используем переданный размер
    return gridSize;
  };

  const renderCard = (card) => {
    const commonProps = {
      key: card.id,
      editable: editable,
      onUpdate: (updatedData) => handleSaveCard({ ...card, ...updatedData }),
      onDelete: () => handleDeleteCard(card.id),
      size: getCardSize(),
      // Добавляем специальные стили для множественных карточек
      sx: {
        height: '280px !important', // Уменьшенная фиксированная высота
        maxHeight: '280px',
        '& .MuiCardContent-root': {
          height: 'calc(280px - 160px)', // Высота контента минус изображение
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        },
        '& .card-content-text': {
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 2, // Уменьшаем до 2 строк
          WebkitBoxOrient: 'vertical',
          textOverflow: 'ellipsis',
          position: 'relative',
          '&::after': {
            content: '"..."',
            position: 'absolute',
            bottom: 0,
            right: 0,
            backgroundColor: 'inherit',
            padding: '0 4px'
          }
        }
      },
      ...card
    };

    if (cardType === 'image-card') {
      return <ImageCard {...commonProps} />;
    } else {
      return <BasicCard {...commonProps} />;
    }
  };

  const renderAddCardDialog = () => (
    <Dialog 
      open={isAddDialogOpen} 
      onClose={() => setIsAddDialogOpen(false)}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AddIcon />
          Добавить новую карточку
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Заголовок карточки"
                value={newCardData.title}
                onChange={(e) => setNewCardData({ ...newCardData, title: e.target.value })}
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Размер в сетке</InputLabel>
                <Select
                  value={newCardData.gridSize}
                  onChange={(e) => setNewCardData({ ...newCardData, gridSize: e.target.value })}
                >
                  <MenuItem value="xs">Очень маленькая (1/6)</MenuItem>
                  <MenuItem value="small">Маленькая (1/4)</MenuItem>
                  <MenuItem value="medium">Средняя (1/3)</MenuItem>
                  <MenuItem value="large">Большая (1/2)</MenuItem>
                  <MenuItem value="xl">Очень большая (2/3)</MenuItem>
                  <MenuItem value="full">Полная ширина (1/1)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Содержание"
                value={newCardData.content}
                onChange={(e) => setNewCardData({ ...newCardData, content: e.target.value })}
                multiline
                rows={3}
                size="small"
              />
            </Grid>
            {cardType === 'image-card' && (
              <>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="URL изображения"
                    value={newCardData.imageUrl}
                    onChange={(e) => setNewCardData({ ...newCardData, imageUrl: e.target.value })}
                    size="small"
                    placeholder="https://example.com/image.jpg"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Alt текст для изображения"
                    value={newCardData.imageAlt}
                    onChange={(e) => setNewCardData({ ...newCardData, imageAlt: e.target.value })}
                    size="small"
                    placeholder="Описание изображения"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>
                    Выбор изображения из кеша:
                  </Typography>
                  <ImageUploadPreview 
                    onImageSelect={(url, fileName, metadata) => setNewCardData({ 
                      ...newCardData, 
                      imageUrl: url,
                      imageAlt: metadata.cardTitle || metadata.originalName || 'Изображение',
                      fileName: fileName // Сохраняем имя файла для экспорта
                    })}
                    selectedImageUrl={newCardData.imageUrl || ''}
                    cardId={newCardData.id}
                    cardTitle={newCardData.title}
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
                            const cardTitle = newCardData.title || `card_${Date.now()}`;
                            const sanitizedTitle = cardTitle.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
                            const timestamp = Date.now();
                            const cardId = newCardData.id || Date.now();
                            const fileExtension = file.name.split('.').pop();
                            const fileName = `card_${sanitizedTitle}_${cardId}_${timestamp}.${fileExtension}`;
                            
                            await imageCacheService.saveImage(fileName, file);
                            
                            const metadata = {
                              fileName: fileName,
                              originalName: file.name,
                              cardTitle: cardTitle,
                              cardId: cardId,
                              size: file.size,
                              type: file.type,
                              uploadDate: new Date().toISOString()
                            };
                            await imageCacheService.saveMetadata(`site-images-metadata-${fileName}`, metadata);
                            
                            const blob = await imageCacheService.getImage(fileName);
                            if (blob) {
                              const url = URL.createObjectURL(blob);
                              setNewCardData({ 
                                ...newCardData, 
                                imageUrl: url,
                                imageAlt: metadata.cardTitle || metadata.originalName || 'Изображение',
                                fileName: fileName
                              });
                              
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
              </>
            )}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Текст кнопки"
                value={newCardData.buttonText}
                onChange={(e) => setNewCardData({ ...newCardData, buttonText: e.target.value })}
                size="small"
                placeholder="Нажмите здесь"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Ссылка кнопки"
                value={newCardData.buttonLink}
                onChange={(e) => setNewCardData({ ...newCardData, buttonLink: e.target.value })}
                size="small"
                placeholder="https://example.com"
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setIsAddDialogOpen(false)}>
          Отмена
        </Button>
        <Button 
          onClick={handleAddCard} 
          variant="contained"
          disabled={!newCardData.title.trim()}
        >
          Добавить карточку
        </Button>
      </DialogActions>
    </Dialog>
  );

  const renderEditCardDialog = () => (
    <Dialog 
      open={!!editingCard} 
      onClose={() => setEditingCard(null)}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <EditIcon />
          Редактировать карточку
        </Box>
      </DialogTitle>
      <DialogContent>
        {editingCard && (
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Заголовок карточки"
                  value={editingCard.title}
                  onChange={(e) => setEditingCard({ ...editingCard, title: e.target.value })}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Размер в сетке</InputLabel>
                  <Select
                    value={editingCard.gridSize}
                    onChange={(e) => setEditingCard({ ...editingCard, gridSize: e.target.value })}
                  >
                    <MenuItem value="xs">Очень маленькая (1/6)</MenuItem>
                    <MenuItem value="small">Маленькая (1/4)</MenuItem>
                    <MenuItem value="medium">Средняя (1/3)</MenuItem>
                    <MenuItem value="large">Большая (1/2)</MenuItem>
                    <MenuItem value="xl">Очень большая (2/3)</MenuItem>
                    <MenuItem value="full">Полная ширина (1/1)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Содержание"
                  value={editingCard.content}
                  onChange={(e) => setEditingCard({ ...editingCard, content: e.target.value })}
                  multiline
                  rows={3}
                  size="small"
                />
              </Grid>
              {cardType === 'image-card' && (
                <>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="URL изображения"
                      value={editingCard.imageUrl}
                      onChange={(e) => setEditingCard({ ...editingCard, imageUrl: e.target.value })}
                      size="small"
                      placeholder="https://example.com/image.jpg"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Alt текст для изображения"
                      value={editingCard.imageAlt}
                      onChange={(e) => setEditingCard({ ...editingCard, imageAlt: e.target.value })}
                      size="small"
                      placeholder="Описание изображения"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" gutterBottom>
                      Выбор изображения из кеша:
                    </Typography>
                    <ImageUploadPreview 
                      onImageSelect={handleImageSelect}
                      selectedImageUrl={editingCard.imageUrl || ''}
                      cardId={editingCard.id}
                      cardTitle={editingCard.title}
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
                              const cardTitle = editingCard.title || `card_${editingCard.id}`;
                              const sanitizedTitle = cardTitle.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
                              const timestamp = Date.now();
                              const fileExtension = file.name.split('.').pop();
                              const fileName = `card_${sanitizedTitle}_${editingCard.id}_${timestamp}.${fileExtension}`;
                              
                              await imageCacheService.saveImage(fileName, file);
                              
                              const metadata = {
                                fileName: fileName,
                                originalName: file.name,
                                cardTitle: cardTitle,
                                cardId: editingCard.id,
                                size: file.size,
                                type: file.type,
                                uploadDate: new Date().toISOString()
                              };
                              await imageCacheService.saveMetadata(`site-images-metadata-${fileName}`, metadata);
                              
                              const blob = await imageCacheService.getImage(fileName);
                              if (blob) {
                                const url = URL.createObjectURL(blob);
                                handleImageSelect(url, fileName, metadata);
                                
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
                </>
              )}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Текст кнопки"
                  value={editingCard.buttonText}
                  onChange={(e) => setEditingCard({ ...editingCard, buttonText: e.target.value })}
                  size="small"
                  placeholder="Нажмите здесь"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Ссылка кнопки"
                  value={editingCard.buttonLink}
                  onChange={(e) => setEditingCard({ ...editingCard, buttonLink: e.target.value })}
                  size="small"
                  placeholder="https://example.com"
                />
              </Grid>
            </Grid>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setEditingCard(null)}>
          Отмена
        </Button>
        <Button 
          onClick={() => handleSaveCard(editingCard)} 
          variant="contained"
          disabled={!editingCard?.title?.trim()}
        >
          Сохранить изменения
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <Box>
      {/* Панель управления */}
      <Paper sx={{ p: 2, mb: 2, backgroundColor: '#f8f9fa' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ViewCarouselIcon color="primary" />
            <Typography variant="h6" color="primary">
              Управление карточками
            </Typography>
            <Chip label={`${cards.length} карточек`} size="small" color="primary" />
          </Box>
          
          {editable && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setIsAddDialogOpen(true)}
            >
              Добавить карточку
            </Button>
          )}
        </Box>

        {/* Настройки сетки */}
                    <Accordion defaultExpanded={false}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle2">
              ⚙️ Настройки сетки
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <FormControl size="small" sx={{ minWidth: 200 }}>
                <InputLabel>Количество столбцов (максимум 4)</InputLabel>
                <Select
                  value={gridSize}
                  onChange={(e) => onGridSizeChange(e.target.value)}
                >
                  <MenuItem value="xs">1 столбец</MenuItem>
                  <MenuItem value="small">2 столбца</MenuItem>
                  <MenuItem value="medium">3 столбца</MenuItem>
                  <MenuItem value="large">4 столбца</MenuItem>
                </Select>
              </FormControl>
              
              <Typography variant="body2" color="text.secondary">
                Размер по умолчанию для новых карточек
              </Typography>
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* Список карточек */}
        {cards.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Список карточек:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {cards.map((card, index) => (
                <Chip
                  key={card.id}
                  label={`${index + 1}. ${card.title || 'Без названия'}`}
                  onDelete={editable ? () => handleDeleteCard(card.id) : undefined}
                  onClick={editable ? () => handleEditCard(card.id) : undefined}
                  variant="outlined"
                  size="small"
                  sx={{ cursor: editable ? 'pointer' : 'default' }}
                  deleteIcon={
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDuplicateCard(card);
                        }}
                        sx={{ p: 0 }}
                      >
                        <ContentCopyIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCard(card.id);
                        }}
                        sx={{ p: 0 }}
                        color="error"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  }
                />
              ))}
            </Box>
          </Box>
        )}

        {cards.length === 0 && (
          <Alert severity="info" sx={{ mt: 2 }}>
            Карточки не добавлены. Нажмите "Добавить карточку" для создания первой карточки.
          </Alert>
        )}
      </Paper>

      {/* Сетка карточек */}
      {cards.length > 0 && (
        <Box 
          className="cards-grid" 
          sx={{ 
            mt: 2,
            display: 'flex',
            flexWrap: 'wrap',
            gap: 1.5,
            justifyContent: 'center',
            alignItems: 'flex-start',
            width: '100%',
            '& > *': {
              width: cards.length === 1 ? '300px' : 
                     cards.length === 2 ? 'calc(50% - 12px)' :
                     cards.length === 3 ? 'calc(33.333% - 16px)' : 
                     'calc(25% - 18px)', // 4+ карточек по 25% ширины
              minWidth: '250px',
              maxWidth: cards.length === 1 ? '400px' : '320px'
            }
          }}
        >
          {cards.map(renderCard)}
        </Box>
      )}

      {/* Диалоги */}
      {renderAddCardDialog()}
      {renderEditCardDialog()}
    </Box>
  );
};

export default CardsGridManager; 