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
import ColorSettings from './ColorSettings';

const Blockquote = ({
  // Основное содержимое
  quote = 'Это пример цитаты. Замените этот текст на нужную вам цитату.',
  author = '',
  source = '',
  title = '',
  
  // Отображение
  showAuthor = true,
  showSource = true,
  showTitle = true,
  
  
  
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
  editable = true,
  colorSettings = {}
}) => {
  const [isInternalEditing, setIsInternalEditing] = useState(false);
  const [editData, setEditData] = useState({
    quote,
    author,
    source,
    title
  });
  const [currentColorSettings, setCurrentColorSettings] = useState(colorSettings || {});

  // Обновляем локальные данные при изменении пропсов
  useEffect(() => {
    setEditData({ quote, author, source, title });
  }, [quote, author, source, title]);

  // Обновляем цветовые настройки при изменении пропсов
  useEffect(() => {
    setCurrentColorSettings(colorSettings || {});
  }, [colorSettings]);

  const handleSaveChanges = () => {
    console.log('[Blockquote] Saving changes:', editData, currentColorSettings);
    setIsInternalEditing(false);
    if (onUpdate) {
      onUpdate({
        ...editData,
        colorSettings: currentColorSettings
      });
    }
  };

  const handleColorUpdate = (newColorSettings) => {
    console.log('[Blockquote] Color settings updated:', newColorSettings);
    setCurrentColorSettings(newColorSettings);
    if (onUpdate) {
      onUpdate({
        ...editData,
        colorSettings: newColorSettings
      });
    }
  };

  const handleCancelChanges = () => {
    console.log('[Blockquote] Canceling changes');
    setEditData({ quote, author, source, title });
    setIsInternalEditing(false);
  };

  const getBorderStyle = (useSettings = false) => {
    const borderStyle = `${borderWidth}px solid ${useSettings ? currentColorSettings.textFields?.border : '#1976d2'}`;
    
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
    let backgroundStyle = {};
    
    if (useSettings && currentColorSettings.sectionBackground?.enabled) {
      const { sectionBackground } = currentColorSettings;
      if (sectionBackground.useGradient) {
        backgroundStyle.background = `linear-gradient(${sectionBackground.gradientDirection}, ${sectionBackground.gradientColor1}, ${sectionBackground.gradientColor2})`;
      } else {
        backgroundStyle.backgroundColor = sectionBackground.solidColor;
      }
      backgroundStyle.opacity = sectionBackground.opacity || 1;
    } else {
      // Используем дефолтные значения
      backgroundStyle.backgroundColor = '#f8f9fa';
    }
    
    let styles = {
      padding: `${padding}px`,
      borderRadius: borderPosition === 'around' ? '8px' : '4px',
      textAlign,
      fontFamily,
      position: 'relative',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      transition: 'all 0.3s ease',
      ...getBorderStyle(useSettings),
      ...backgroundStyle
    };

    // Применяем дополнительные настройки из currentColorSettings
    if (useSettings && currentColorSettings) {
      if (currentColorSettings.borderColor) {
        styles.border = `${currentColorSettings.borderWidth || 1}px solid ${currentColorSettings.borderColor}`;
      }
      if (currentColorSettings.borderRadius !== undefined) {
        styles.borderRadius = `${currentColorSettings.borderRadius}px`;
      }
      if (currentColorSettings.padding !== undefined) {
        styles.padding = `${currentColorSettings.padding}px`;
      }
      if (currentColorSettings.boxShadow) {
        styles.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
      }
    }

    return styles;
  };

  const getQuoteTextStyle = (useSettings = false) => ({
    fontSize: `${quoteFontSize}px`,
    color: useSettings ? (currentColorSettings.textFields?.content || '#555555') : '#555555',
    fontWeight,
    fontStyle: italic ? 'italic' : 'normal',
    lineHeight: 1.6,
    margin: 0,
    marginBottom: (showAuthor && author) || (showSource && source) ? '16px' : 0
  });

  const getAuthorStyle = (useSettings = false) => ({
    fontSize: `${authorFontSize}px`,
    color: useSettings ? (currentColorSettings.textFields?.author || '#888888') : '#888888',
    fontWeight: 'bold',
    margin: 0
  });

  const getSourceStyle = (useSettings = false) => ({
    fontSize: `${authorFontSize - 2}px`,
    color: useSettings ? (currentColorSettings.textFields?.author || '#888888') : '#888888',
    opacity: 0.8,
    margin: 0,
    marginTop: '4px'
  });

  const getTitleStyle = (useSettings = false) => ({
    fontSize: `${quoteFontSize + 4}px`,
    color: useSettings ? (currentColorSettings.textFields?.title || '#555555') : '#555555',
    fontWeight: 'bold',
    margin: 0,
    marginBottom: '16px',
    textAlign,
    lineHeight: 1.4
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
              value={editData.title}
              onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
              label="Заголовок элемента"
              sx={{ mb: 2 }}
              placeholder="Введите заголовок элемента..."
            />
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
                      backgroundColor: currentColorSettings.textFields?.border || '#1976d2',
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

                  {/* Заголовок элемента */}
                  {showTitle && editData.title && (
                    <Typography component="h3" sx={getTitleStyle(true)}>
                      {editData.title}
                    </Typography>
                  )}

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

        {/* Заголовок элемента */}
        {showTitle && title && (
          <Typography component="h3" sx={getTitleStyle(false)}>
            {title}
          </Typography>
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
  }

  // Оригинальная логика для полного компонента с редактированием
  const renderQuote = () => (
    <Paper sx={getQuoteStyle(true)}>
      {/* Иконка цитаты */}
      <Box
        sx={{
          position: 'absolute',
          top: '-12px',
          left: textAlign === 'center' ? '50%' : '16px',
          transform: textAlign === 'center' ? 'translateX(-50%)' : 'none',
          backgroundColor: currentColorSettings.textFields?.border || '#1976d2',
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

      {/* Заголовок элемента */}
      {showTitle && title && (
        <Typography component="h3" sx={getTitleStyle(true)}>
          {title}
        </Typography>
      )}

      {/* Текст цитаты */}
      <Typography component="blockquote" sx={getQuoteTextStyle(true)}>
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
            <Typography component="cite" sx={getAuthorStyle(true)}>
              — {author}
            </Typography>
          )}
          {showSource && source && (
            <Typography component="span" sx={getSourceStyle(true)}>
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

          {/* Заголовок элемента */}
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={8}>
              <TextField
                fullWidth
                value={editData.title}
                onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
                label="Заголовок элемента"
                placeholder="Введите заголовок элемента..."
              />
            </Grid>
            <Grid item xs={4}>
              <FormControlLabel
                control={
                  <Switch
                    checked={showTitle}
                    onChange={(e) => {
                      if (onUpdate) {
                        onUpdate({ ...editData, colorSettings: currentColorSettings, showTitle: e.target.checked });
                      }
                    }}
                  />
                }
                label="Показывать заголовок"
              />
            </Grid>
          </Grid>

          {/* Текст цитаты */}
              <TextField
                fullWidth
                multiline
                rows={3}
                value={editData.quote}
                onChange={(e) => setEditData(prev => ({ ...prev, quote: e.target.value }))}
                label="Текст цитаты"
            sx={{ mb: 2 }}
          />

          {/* Автор */}
              <TextField
                fullWidth
                value={editData.author}
                onChange={(e) => setEditData(prev => ({ ...prev, author: e.target.value }))}
                label="Автор цитаты"
            sx={{ mb: 2 }}
          />

          {/* Источник */}
              <TextField
                fullWidth
                value={editData.source}
                onChange={(e) => setEditData(prev => ({ ...prev, source: e.target.value }))}
                label="Источник"
            sx={{ mb: 2 }}
          />

          {/* Настройки цветов */}
          <Typography variant="h6" sx={{ mb: 2, color: 'green' }}>
            🎨 Новая система цветов работает!
          </Typography>
          <ColorSettings
            title="Настройки цветов цитаты"
            colorSettings={currentColorSettings}
            onUpdate={handleColorUpdate}
            availableFields={[
              {
                name: 'title',
                label: 'Цвет заголовка',
                description: 'Цвет заголовка цитаты',
                defaultColor: '#555555'
              },
              {
                name: 'content',
                label: 'Цвет текста',
                description: 'Цвет основного текста цитаты',
                defaultColor: '#555555'
              },
              {
                name: 'author',
                label: 'Цвет автора',
                description: 'Цвет текста автора и источника',
                defaultColor: '#888888'
              },
              {
                name: 'border',
                label: 'Цвет границы',
                description: 'Цвет границы и акцентов',
                defaultColor: '#1976d2'
              }
            ]}
            defaultColors={{
              title: '#555555',
              content: '#555555',
              author: '#888888',
              border: '#1976d2'
            }}
          />

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
                    backgroundColor: currentColorSettings.textFields?.border || '#1976d2',
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

                {/* Заголовок элемента */}
                {showTitle && editData.title && (
                  <Typography component="h3" sx={getTitleStyle(true)}>
                    {editData.title}
                  </Typography>
                )}

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