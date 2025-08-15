import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Alert,
  AlertTitle,
  Button,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Storage as StorageIcon,
  Delete as DeleteIcon,
  Info as InfoIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon
} from '@mui/icons-material';

const ImageCacheStats = ({ onRefresh }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [detailsDialog, setDetailsDialog] = useState(false);

  const loadStats = async () => {
    setLoading(true);
    try {
      const { imageCacheService } = await import('../../../utils/imageCacheService');
      const cacheStats = await imageCacheService.getCacheStats();
      setStats(cacheStats);
    } catch (error) {
      console.error('Ошибка загрузки статистики кеша:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const handleClearCache = async () => {
    if (window.confirm('Вы уверены, что хотите очистить весь кеш изображений? Это действие нельзя отменить.')) {
      setLoading(true);
      try {
        const { imageCacheService } = await import('../../../utils/imageCacheService');
        await imageCacheService.clearAll();
        await loadStats();
        if (onRefresh) onRefresh();
      } catch (error) {
        console.error('Ошибка очистки кеша:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Б';
    const k = 1024;
    const sizes = ['Б', 'КБ', 'МБ', 'ГБ'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('ru-RU');
  };

  if (!stats) {
    return (
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            Загрузка статистики кеша...
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <StorageIcon color="primary" />
              <Typography variant="h6">
                Кеш изображений
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Tooltip title="Обновить статистику">
                <IconButton 
                  size="small" 
                  onClick={loadStats}
                  disabled={loading}
                >
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Подробности">
                <IconButton 
                  size="small" 
                  onClick={() => setDetailsDialog(true)}
                >
                  <InfoIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
            <Chip 
              label={`${stats.totalImages} изображений`}
              color="primary"
              variant="outlined"
            />
            <Chip 
              label={`${stats.totalSizeMB} МБ`}
              color="secondary"
              variant="outlined"
            />
            <Chip 
              label="JPG формат"
              color="success"
              variant="outlined"
            />
          </Box>

          {stats.totalImages > 0 ? (
            <Alert severity="info" sx={{ mb: 2 }}>
              <AlertTitle>✅ Кеш работает корректно</AlertTitle>
              <Typography variant="body2">
                Все изображения автоматически конвертируются в JPG и сохраняются в браузере (IndexedDB + LocalStorage). 
                Каждое изображение привязано к конкретной карточке и не отображается в других карточках.
              </Typography>
            </Alert>
          ) : (
            <Alert severity="warning">
              <AlertTitle>📁 Кеш пуст</AlertTitle>
              <Typography variant="body2">
                Загрузите изображения в карточки, чтобы они сохранились в кеше браузера.
              </Typography>
            </Alert>
          )}

          {stats.totalImages > 0 && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                size="small"
                startIcon={<DeleteIcon />}
                onClick={handleClearCache}
                disabled={loading}
                color="error"
              >
                Очистить кеш
              </Button>
              <Button
                variant="outlined"
                size="small"
                startIcon={<InfoIcon />}
                onClick={() => setDetailsDialog(true)}
                disabled={loading}
              >
                Все изображения
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Диалог с подробностями */}
      <Dialog 
        open={detailsDialog} 
        onClose={() => setDetailsDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <InfoIcon />
            Все изображения в кеше ({stats.totalImages})
          </Box>
        </DialogTitle>
        <DialogContent>
          {stats.images.length > 0 ? (
            <List>
              {stats.images.map((image, index) => (
                <ListItem key={index} divider>
                  <ListItemText
                    primary={image.key}
                    secondary={
                      <Box>
                        <Typography variant="body2">
                          Размер: {formatFileSize(image.size)}
                        </Typography>
                        {image.metadata && (
                          <>
                            <Typography variant="body2">
                              Карточка: {image.metadata.cardTitle || 'Неизвестно'}
                            </Typography>
                            <Typography variant="body2">
                              ID карточки: {image.metadata.cardId || 'Неизвестно'}
                            </Typography>
                            <Typography variant="body2">
                              Загружено: {formatDate(image.metadata.uploadDate)}
                            </Typography>
                            {image.metadata.width && image.metadata.height && (
                              <Typography variant="body2">
                                Размеры: {image.metadata.width}×{image.metadata.height}px
                              </Typography>
                            )}
                            <Typography variant="body2">
                              Оригинальный файл: {image.metadata.originalName || 'Неизвестно'}
                            </Typography>
                          </>
                        )}
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    <Chip 
                      label="JPG" 
                      size="small" 
                      color="success" 
                      variant="outlined"
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body2" color="text.secondary">
              Кеш пуст
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsDialog(false)}>
            Закрыть
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ImageCacheStats; 