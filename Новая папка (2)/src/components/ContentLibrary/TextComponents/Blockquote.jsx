import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  Tooltip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Chip,
  Avatar,
  Grid,
  Switch,
  FormControlLabel,
  Divider
} from '@mui/material';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import PersonIcon from '@mui/icons-material/Person';
import EditableElementWrapper from '../EditableElementWrapper';
import useEditableElement from '../../../hooks/useEditableElement';

const Blockquote = ({
  // Основное содержимое
  quote = 'Это пример цитаты. Замените этот текст на нужную вам цитату.',
  author = '',
  source = '',
  
  // Отображение
  showAuthor = true,
  showSource = true,
  
  // Цвета
  quoteColor = '#555555',
  authorColor = '#888888',
  backgroundColor = '#f8f9fa',
  borderColor = '#1976d2',
  
  // Градиент
  useGradient = false,
  gradientColor1 = '#f8f9fa',
  gradientColor2 = '#ffffff',
  gradientDirection = 'to right',
  
  // Шрифт
  fontFamily = 'inherit',
  fontWeight = 'normal',
  
  // Размеры
  quoteFontSize = 18,
  authorFontSize = 14,
  padding = 24,
  borderWidth = 4,
  
  // Стиль
  textAlign = 'left',
  borderPosition = 'left',
  italic = true,
  
  // Прочее
  isPreview = false,
  isEditing = false,
  onSave,
  onCancel,
  onUpdate,
  editable = true
}) => {
  const [isInternalEditing, setIsInternalEditing] = useState(false);
  const [editData, setEditData] = useState({
    quote,
    author,
    source
  });
  const [colorSettings, setColorSettings] = useState({
    quoteColor,
    authorColor,
    backgroundColor,
    borderColor,
    useGradient,
    gradientColor1,
    gradientColor2,
    gradientDirection
  });

  // Обновляем локальные данные при изменении пропсов
  useEffect(() => {
    setEditData({ quote, author, source });
  }, [quote, author, source]);

  // Обновляем цветовые настройки при изменении пропсов
  useEffect(() => {
    setColorSettings({
      quoteColor,
      authorColor,
      backgroundColor,
      borderColor,
      useGradient,
      gradientColor1,
      gradientColor2,
      gradientDirection
    });
  }, [quoteColor, authorColor, backgroundColor, borderColor, useGradient, gradientColor1, gradientColor2, gradientDirection]);

  const handleSaveChanges = () => {
    console.log('[Blockquote] Saving changes:', editData, colorSettings);
    setIsInternalEditing(false);
    if (onUpdate) {
      onUpdate({
        ...editData,
        ...colorSettings
      });
    }
  };

  const handleCancelChanges = () => {
    console.log('[Blockquote] Canceling changes');
    setEditData({ quote, author, source });
    setIsInternalEditing(false);
  };

  const getBorderStyle = (useSettings = false) => {
    const borderStyle = `${borderWidth}px solid ${useSettings ? colorSettings.borderColor : borderColor}`;
    
    switch (borderPosition) {
      case 'left':
        return { borderLeft: borderStyle };
      case 'right':
        return { borderRight: borderStyle };
      case 'top':
        return { borderTop: borderStyle };
      case 'bottom':
        return { borderBottom: borderStyle };
      case 'around':
        return { border: borderStyle };
      default:
        return { borderLeft: borderStyle };
    }
  };

  const getQuoteStyle = (useSettings = false) => {
    const shouldUseGradient = useSettings ? colorSettings.useGradient : useGradient;
    const bg1 = useSettings ? colorSettings.gradientColor1 : gradientColor1;
    const bg2 = useSettings ? colorSettings.gradientColor2 : gradientColor2;
    const direction = useSettings ? colorSettings.gradientDirection : gradientDirection;
    const bgColor = useSettings ? colorSettings.backgroundColor : backgroundColor;
    
    return {
      background: shouldUseGradient 
        ? `linear-gradient(${direction}, ${bg1}, ${bg2})`
        : bgColor,
      padding: `${padding}px`,
      borderRadius: borderPosition === 'around' ? '8px' : '4px',
      textAlign,
      fontFamily,
      position: 'relative',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      transition: 'all 0.3s ease',
      ...getBorderStyle(useSettings)
    };
  };

  const getQuoteTextStyle = (useSettings = false) => ({
    fontSize: `${quoteFontSize}px`,
    color: useSettings ? colorSettings.quoteColor : quoteColor,
    fontWeight,
    fontStyle: italic ? 'italic' : 'normal',
    lineHeight: 1.6,
    margin: 0,
    marginBottom: (showAuthor && author) || (showSource && source) ? '16px' : 0
  });

  const getAuthorStyle = (useSettings = false) => ({
    fontSize: `${authorFontSize}px`,
    color: useSettings ? colorSettings.authorColor : authorColor,
    fontWeight: 'bold',
    margin: 0
  });

  const getSourceStyle = (useSettings = false) => ({
    fontSize: `${authorFontSize - 2}px`,
    color: useSettings ? colorSettings.authorColor : authorColor,
    opacity: 0.8,
    margin: 0,
    marginTop: '4px'
  });

  // Если это режим редактирования в превью
  if (isPreview && isEditing) {
    return (
      <Box sx={{ mb: 2 }}>
        <Paper sx={{ border: '2px solid #1976d2', borderRadius: 1, overflow: 'hidden' }}>
          {/* Панель инструментов для редактирования в превью */}
          <Paper sx={{ p: 1, backgroundColor: '#1976d2', color: 'white' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FormatQuoteIcon />
              <Typography variant="body2" sx={{ flexGrow: 1 }}>
                🎨 Редактирование цитаты
              </Typography>
              <Button
                size="small"
                onClick={handleSaveChanges}
                variant="contained"
                color="success"
                sx={{ minWidth: 'auto', mr: 1 }}
              >
                Сохранить
              </Button>
              <Button
                size="small"
                onClick={handleCancelChanges}
                variant="outlined"
                sx={{ 
                  minWidth: 'auto', 
                  color: 'white', 
                  borderColor: 'white',
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255,255,255,0.1)'
                  }
                }}
              >
                Отмена
              </Button>
            </Box>
          </Paper>

          {/* Поля редактирования */}
          <Box sx={{ p: 2 }}>
            <TextField
              fullWidth
              multiline
              rows={3}
              value={editData.quote}
              onChange={(e) => setEditData(prev => ({ ...prev, quote: e.target.value }))}
              label="Текст цитаты"
              sx={{ mb: 2 }}
              placeholder="Введите текст цитаты..."
            />
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                fullWidth
                value={editData.author}
                onChange={(e) => setEditData(prev => ({ ...prev, author: e.target.value }))}
                label="Автор"
                placeholder="Имя автора"
              />
              <TextField
                fullWidth
                value={editData.source}
                onChange={(e) => setEditData(prev => ({ ...prev, source: e.target.value }))}
                label="Источник"
                placeholder="Книга, компания, должность"
              />
            </Box>
            
            {/* Предварительный просмотр изменений */}
            <Box sx={{ p: 2, backgroundColor: '#f9f9f9', borderRadius: 1, border: '1px dashed #ccc' }}>
              <Typography variant="caption" color="text.secondary" gutterBottom>
                Предварительный просмотр:
              </Typography>
                              <Paper sx={getQuoteStyle(true)}>
                  {/* Иконка цитаты */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '-12px',
                      left: textAlign === 'center' ? '50%' : '16px',
                      transform: textAlign === 'center' ? 'translateX(-50%)' : 'none',
                      backgroundColor: colorSettings.borderColor,
                      borderRadius: '50%',
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                    }}
                  >
                    <FormatQuoteIcon sx={{ color: 'white', fontSize: '18px' }} />
                  </Box>

                  {/* Текст цитаты */}
                  <Typography component="blockquote" sx={getQuoteTextStyle(true)}>
                    "{editData.quote || 'Ваша цитата...'}"
                  </Typography>

                  {/* Автор и источник */}
                  {((showAuthor && editData.author) || (showSource && editData.source)) && (
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: 'column',
                      alignItems: textAlign === 'center' ? 'center' : 
                                 textAlign === 'right' ? 'flex-end' : 'flex-start'
                    }}>
                      {showAuthor && editData.author && (
                        <Typography component="cite" sx={getAuthorStyle(true)}>
                          — {editData.author}
                        </Typography>
                      )}
                      {showSource && editData.source && (
                        <Typography component="span" sx={getSourceStyle(true)}>
                          {editData.source}
                        </Typography>
                      )}
                    </Box>
                  )}
              </Paper>
            </Box>
          </Box>
        </Paper>
      </Box>
    );
  }

  // Если это превью режим, показываем компонент без редактирования
  if (isPreview) {
    return (
      <Paper 
        sx={{
          ...getQuoteStyle()
        }}
      >
        {/* Иконка цитаты */}
        <Box
          sx={{
            position: 'absolute',
            top: '-12px',
            left: textAlign === 'center' ? '50%' : '16px',
            transform: textAlign === 'center' ? 'translateX(-50%)' : 'none',
            backgroundColor: borderColor,
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
          }}
        >
          <FormatQuoteIcon sx={{ color: 'white', fontSize: '18px' }} />
        </Box>

        {/* Текст цитаты */}
        <Typography component="blockquote" sx={getQuoteTextStyle(false)}>
          "{quote}"
        </Typography>

        {/* Автор и источник */}
        {((showAuthor && author) || (showSource && source)) && (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: textAlign === 'center' ? 'center' : 
                       textAlign === 'right' ? 'flex-end' : 'flex-start'
          }}>
            {showAuthor && author && (
              <Typography component="cite" sx={getAuthorStyle(false)}>
                — {author}
              </Typography>
            )}
            {showSource && source && (
              <Typography component="span" sx={getSourceStyle(false)}>
                {source}
              </Typography>
            )}
          </Box>
        )}
      </Paper>
    );
  }

  // Оригинальная логика для полного компонента с редактированием
  const renderQuote = () => (
    <Paper sx={getQuoteStyle()}>
      {/* Иконка цитаты */}
      <Box
        sx={{
          position: 'absolute',
          top: '-12px',
          left: textAlign === 'center' ? '50%' : '16px',
          transform: textAlign === 'center' ? 'translateX(-50%)' : 'none',
          backgroundColor: borderColor,
          borderRadius: '50%',
          width: '32px',
          height: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
        }}
      >
        <FormatQuoteIcon sx={{ color: 'white', fontSize: '18px' }} />
      </Box>

      {/* Кнопка редактирования */}
      {editable && (
        <Box
          sx={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            opacity: 0,
            transition: 'opacity 0.2s ease',
            zIndex: 10,
            '.quote-container:hover &': {
              opacity: 1
            }
          }}
        >
          <Tooltip title="Редактировать цитату">
            <IconButton
              size="small"
              onClick={() => setIsInternalEditing(true)}
              sx={{
                backgroundColor: 'rgba(255,255,255,0.9)',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,1)'
                }
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      )}

      {/* Текст цитаты */}
      <Typography component="blockquote" sx={getQuoteTextStyle(false)}>
        "{quote}"
      </Typography>

      {/* Автор и источник */}
      {((showAuthor && author) || (showSource && source)) && (
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: textAlign === 'center' ? 'center' : 
                     textAlign === 'right' ? 'flex-end' : 'flex-start'
        }}>
          {showAuthor && author && (
            <Typography component="cite" sx={getAuthorStyle(false)}>
              — {author}
            </Typography>
          )}
          {showSource && source && (
            <Typography component="span" sx={getSourceStyle(false)}>
              {source}
            </Typography>
          )}
        </Box>
      )}
    </Paper>
  );

  return (
    <Box className="quote-container">
      {/* Превью */}
      {!isInternalEditing && renderQuote()}

      {/* Простой режим редактирования (если нужен) */}
      {isInternalEditing && (
        <Paper sx={{ p: 3, border: '2px solid #1976d2' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
            <FormatQuoteIcon color="primary" />
            <Typography variant="h6" color="primary">
              Быстрое редактирование цитаты
            </Typography>
            <Chip label="Активно" color="primary" size="small" />
          </Box>

          {/* Текст цитаты */}
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={8}>
              <TextField
                fullWidth
                multiline
                rows={3}
                value={editData.quote}
                onChange={(e) => setEditData(prev => ({ ...prev, quote: e.target.value }))}
                label="Текст цитаты"
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                type="color"
                label="Цвет текста цитаты"
                value={colorSettings.quoteColor}
                onChange={(e) => setColorSettings(prev => ({ ...prev, quoteColor: e.target.value }))}
              />
            </Grid>
          </Grid>

          {/* Автор */}
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={8}>
              <TextField
                fullWidth
                value={editData.author}
                onChange={(e) => setEditData(prev => ({ ...prev, author: e.target.value }))}
                label="Автор цитаты"
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                type="color"
                label="Цвет текста автора"
                value={colorSettings.authorColor}
                onChange={(e) => setColorSettings(prev => ({ ...prev, authorColor: e.target.value }))}
              />
            </Grid>
          </Grid>

          {/* Источник */}
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={8}>
              <TextField
                fullWidth
                value={editData.source}
                onChange={(e) => setEditData(prev => ({ ...prev, source: e.target.value }))}
                label="Источник"
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                type="color"
                label="Цвет рамки"
                value={colorSettings.borderColor}
                onChange={(e) => setColorSettings(prev => ({ ...prev, borderColor: e.target.value }))}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />

          {/* Настройки фона */}
          <Typography variant="subtitle2" gutterBottom>
            Настройки фона
          </Typography>
          
          <FormControlLabel
            control={
              <Switch
                checked={colorSettings.useGradient}
                onChange={(e) => setColorSettings(prev => ({ ...prev, useGradient: e.target.checked }))}
              />
            }
            label="Использовать градиент"
            sx={{ mb: 2 }}
          />

          {!colorSettings.useGradient ? (
            <TextField
              fullWidth
              type="color"
              label="Цвет фона"
              value={colorSettings.backgroundColor}
              onChange={(e) => setColorSettings(prev => ({ ...prev, backgroundColor: e.target.value }))}
              sx={{ mb: 2 }}
            />
          ) : (
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  type="color"
                  label="Цвет 1"
                  value={colorSettings.gradientColor1}
                  onChange={(e) => setColorSettings(prev => ({ ...prev, gradientColor1: e.target.value }))}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  type="color"
                  label="Цвет 2"
                  value={colorSettings.gradientColor2}
                  onChange={(e) => setColorSettings(prev => ({ ...prev, gradientColor2: e.target.value }))}
                />
              </Grid>
              <Grid item xs={4}>
                <FormControl fullWidth>
                  <InputLabel>Направление</InputLabel>
                  <Select
                    value={colorSettings.gradientDirection}
                    label="Направление"
                    onChange={(e) => setColorSettings(prev => ({ ...prev, gradientDirection: e.target.value }))}
                  >
                    <MenuItem value="to right">→ Вправо</MenuItem>
                    <MenuItem value="to left">← Влево</MenuItem>
                    <MenuItem value="to bottom">↓ Вниз</MenuItem>
                    <MenuItem value="to top">↑ Вверх</MenuItem>
                    <MenuItem value="to bottom right">↘ Вправо-вниз</MenuItem>
                    <MenuItem value="to bottom left">↙ Влево-вниз</MenuItem>
                    <MenuItem value="to top right">↗ Вправо-вверх</MenuItem>
                    <MenuItem value="to top left">↖ Влево-вверх</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          )}

          {/* Предварительный просмотр */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Предварительный просмотр:
            </Typography>
            <Box sx={{ border: '1px dashed #ccc', borderRadius: 1, p: 2 }}>
                              <Paper sx={getQuoteStyle(true)}>
                {/* Иконка цитаты */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: '-12px',
                    left: textAlign === 'center' ? '50%' : '16px',
                    transform: textAlign === 'center' ? 'translateX(-50%)' : 'none',
                    backgroundColor: colorSettings.borderColor,
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                  }}
                >
                  <FormatQuoteIcon sx={{ color: 'white', fontSize: '18px' }} />
                </Box>

                {/* Текст цитаты */}
                <Typography component="blockquote" sx={getQuoteTextStyle(true)}>
                  "{editData.quote}"
                </Typography>

                {/* Автор и источник */}
                {((showAuthor && editData.author) || (showSource && editData.source)) && (
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    alignItems: textAlign === 'center' ? 'center' : 
                               textAlign === 'right' ? 'flex-end' : 'flex-start'
                  }}>
                    {showAuthor && editData.author && (
                      <Typography component="cite" sx={getAuthorStyle(true)}>
                        — {editData.author}
                      </Typography>
                    )}
                    {showSource && editData.source && (
                      <Typography component="span" sx={getSourceStyle(true)}>
                        {editData.source}
                      </Typography>
                    )}
                  </Box>
                )}
              </Paper>
            </Box>
          </Box>

          {/* Кнопки */}
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
            <Button onClick={handleCancelChanges}>
              Отмена
            </Button>
            <Button 
              variant="contained" 
              startIcon={<SaveIcon />} 
              onClick={handleSaveChanges}
            >
              Сохранить
            </Button>
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default Blockquote; 