import React from 'react';
import { Box, Typography, Paper, TextField, Button, FormControlLabel, Switch, Grid, Divider, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import EditableElementWrapper from '../EditableElementWrapper';
import useEditableElement from '../../../hooks/useEditableElement';
import AnimationWrapper from '../AnimationWrapper';
import AnimationControls from '../AnimationControls';

const BlockquoteNew = ({
  quote = 'Это цитата для демонстрации',
  author = 'Автор',
  source = 'Источник',
  showAuthor = true,
  showSource = true,
  quoteColor = '#555555',
  authorColor = '#888888',
  backgroundColor = '#f8f9fa',
  borderColor = '#dee2e6',
  
  // Градиент
  useGradient = false,
  gradientColor1 = '#f8f9fa',
  gradientColor2 = '#ffffff',
  gradientDirection = 'to right',
  
  fontFamily = 'Georgia',
  quoteFontSize = 18,
  authorFontSize = 14,
  padding = 20,
  borderWidth = 4,
  textAlign = 'left',
  borderPosition = 'left',
  italic = true,
  onUpdate,
  onSave = null,
  onCancel = null,
  editable = true,
  isPreview = false,
  constructorMode = false,
  isConstructorMode = false,
  animationSettings = {}
}) => {
  // Используем универсальный хук для редактирования
  const {
    isEditing,
    editData,
    handleStartEdit,
    handleSave,
    handleCancel,
    handleChange
  } = useEditableElement({
    quote,
    author,
    source,
    showAuthor,
    showSource,
    quoteColor,
    authorColor,
    backgroundColor,
    borderColor,
    useGradient,
    gradientColor1,
    gradientColor2,
    gradientDirection,
    fontFamily,
    quoteFontSize,
    authorFontSize,
    padding,
    borderWidth,
    textAlign,
    borderPosition,
    italic
  }, onUpdate, onSave, onCancel);

  // Функция для получения стилей цитаты
  const getQuoteStyles = () => {
    const data = isEditing ? editData : {
      quote, author, source, showAuthor, showSource, quoteColor, authorColor,
      backgroundColor, borderColor, useGradient, gradientColor1, gradientColor2, gradientDirection,
      fontFamily, quoteFontSize, authorFontSize, padding, borderWidth, textAlign, borderPosition, italic
    };

    const borderStyle = {
      left: { borderLeft: `${data.borderWidth}px solid ${data.borderColor}` },
      right: { borderRight: `${data.borderWidth}px solid ${data.borderColor}` },
      top: { borderTop: `${data.borderWidth}px solid ${data.borderColor}` },
      bottom: { borderBottom: `${data.borderWidth}px solid ${data.borderColor}` },
      around: { border: `${data.borderWidth}px solid ${data.borderColor}` }
    };

    return {
      background: data.useGradient 
        ? `linear-gradient(${data.gradientDirection}, ${data.gradientColor1}, ${data.gradientColor2})`
        : data.backgroundColor,
      padding: `${data.padding}px`,
      borderRadius: '8px',
      margin: '16px 0',
      textAlign: data.textAlign,
      fontFamily: data.fontFamily,
      ...borderStyle[data.borderPosition]
    };
  };

  // Рендер цитаты
  const renderQuote = () => {
    const data = isEditing ? editData : {
      quote, author, source, showAuthor, showSource, quoteColor, authorColor,
      backgroundColor, borderColor, useGradient, gradientColor1, gradientColor2, gradientDirection,
      fontFamily, quoteFontSize, authorFontSize, padding, borderWidth, textAlign, borderPosition, italic
    };

    return (
      <Box sx={getQuoteStyles()}>
        <Typography
          variant="h6"
          component="blockquote"
          sx={{
            fontSize: `${data.quoteFontSize}px`,
            color: data.quoteColor,
            fontStyle: data.italic ? 'italic' : 'normal',
            margin: 0,
            marginBottom: (data.showAuthor || data.showSource) ? 2 : 0,
            lineHeight: 1.4
          }}
        >
          {data.quote}
        </Typography>
        
        {(data.showAuthor || data.showSource) && (
          <Box sx={{ textAlign: 'right', marginTop: 1 }}>
            {data.showAuthor && (
              <Typography
                variant="body2"
                component="cite"
                sx={{
                  fontSize: `${data.authorFontSize}px`,
                  color: data.authorColor,
                  fontStyle: 'normal',
                  display: 'block'
                }}
              >
                — {data.author}
              </Typography>
            )}
            {data.showSource && (
              <Typography
                variant="body2"
                sx={{
                  fontSize: `${data.authorFontSize}px`,
                  color: data.authorColor,
                  fontStyle: 'normal',
                  display: 'block'
                }}
              >
                {data.source}
              </Typography>
            )}
          </Box>
        )}
      </Box>
    );
  };

  // Рендер редактора
  const renderEditor = () => (
    <Paper sx={{ p: 3, border: '2px solid #1976d2', borderRadius: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <FormatQuoteIcon color="primary" />
        <Typography variant="h6" color="primary">
          Редактирование цитаты
        </Typography>
      </Box>

      {/* Текст цитаты с цветом */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={9}>
          <TextField
            fullWidth
            multiline
            rows={3}
            value={editData.quote}
            onChange={(e) => handleChange('quote', e.target.value)}
            label="Текст цитаты"
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            fullWidth
            type="color"
            label="Цвет текста"
            value={editData.quoteColor}
            onChange={(e) => handleChange('quoteColor', e.target.value)}
          />
        </Grid>
      </Grid>

      {/* Автор с цветом */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={9}>
          <TextField
            fullWidth
            value={editData.author}
            onChange={(e) => handleChange('author', e.target.value)}
            label="Автор"
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            fullWidth
            type="color"
            label="Цвет автора"
            value={editData.authorColor}
            onChange={(e) => handleChange('authorColor', e.target.value)}
          />
        </Grid>
      </Grid>

      {/* Источник */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={9}>
          <TextField
            fullWidth
            value={editData.source}
            onChange={(e) => handleChange('source', e.target.value)}
            label="Источник"
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            fullWidth
            type="color"
            label="Цвет границы"
            value={editData.borderColor}
            onChange={(e) => handleChange('borderColor', e.target.value)}
          />
        </Grid>
      </Grid>

      {/* Переключатели */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <FormControlLabel
          control={
            <Switch
              checked={editData.showAuthor}
              onChange={(e) => handleChange('showAuthor', e.target.checked)}
            />
          }
          label="Показать автора"
        />
        <FormControlLabel
          control={
            <Switch
              checked={editData.showSource}
              onChange={(e) => handleChange('showSource', e.target.checked)}
            />
          }
          label="Показать источник"
        />
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Настройки фона */}
      <Typography variant="subtitle2" gutterBottom>
        Настройки фона:
      </Typography>
      
      <FormControlLabel
        control={
          <Switch
            checked={editData.useGradient}
            onChange={(e) => handleChange('useGradient', e.target.checked)}
          />
        }
        label="Использовать градиент"
        sx={{ mb: 2 }}
      />

      {editData.useGradient ? (
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={4}>
            <TextField
              fullWidth
              type="color"
              label="Цвет 1"
              value={editData.gradientColor1}
              onChange={(e) => handleChange('gradientColor1', e.target.value)}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              type="color"
              label="Цвет 2"
              value={editData.gradientColor2}
              onChange={(e) => handleChange('gradientColor2', e.target.value)}
            />
          </Grid>
          <Grid item xs={4}>
            <FormControl fullWidth>
              <InputLabel>Направление</InputLabel>
              <Select
                value={editData.gradientDirection}
                label="Направление"
                onChange={(e) => handleChange('gradientDirection', e.target.value)}
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
      ) : (
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              type="color"
              label="Цвет фона"
              value={editData.backgroundColor}
              onChange={(e) => handleChange('backgroundColor', e.target.value)}
            />
          </Grid>
        </Grid>
      )}

      <Divider sx={{ my: 2 }} />

      {/* Настройки анимации */}
      <AnimationControls
        animationSettings={animationSettings}
        onUpdate={(newSettings) => {
          if (onUpdate) {
            onUpdate({ animationSettings: newSettings });
          }
        }}
        expanded={false}
      />

      {/* Превью */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          Превью:
        </Typography>
        {renderQuote()}
      </Box>

      {/* Кнопки */}
      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
        <Button
          onClick={handleCancel}
          startIcon={<CancelIcon />}
        >
          Отмена
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          startIcon={<SaveIcon />}
          color="primary"
        >
          Сохранить
        </Button>
      </Box>
    </Paper>
  );

  // Если в режиме редактирования, показываем редактор
  if (isEditing) {
    return renderEditor();
  }

  // Если в режиме превью с возможностью редактирования
  if (isPreview && editable) {
    return (
      <AnimationWrapper {...animationSettings}>
        <EditableElementWrapper
          editable={constructorMode}
          onStartEdit={handleStartEdit}
          isEditing={isEditing}
          editButtonTooltip="Редактировать цитату"
        >
          {renderQuote()}
        </EditableElementWrapper>
      </AnimationWrapper>
    );
  }

  // Обычный рендер
  return (
    <AnimationWrapper {...animationSettings}>
      <Box>
        {/* Режим конструктора - настройки в manual режиме */}
        {isConstructorMode && !constructorMode && (
          <Box sx={{ p: 2, backgroundColor: '#f5f5f5', borderBottom: '1px solid #e0e0e0', mb: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Настройки цитаты
            </Typography>
            
            {/* Цветовые настройки */}
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={3}>
                <TextField
                  fullWidth
                  type="color"
                  label="Цвет текста"
                  value={quoteColor}
                  onChange={(e) => onUpdate && onUpdate({ quoteColor: e.target.value })}
                  size="small"
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  fullWidth
                  type="color"
                  label="Цвет автора"
                  value={authorColor}
                  onChange={(e) => onUpdate && onUpdate({ authorColor: e.target.value })}
                  size="small"
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  fullWidth
                  type="color"
                  label="Цвет границы"
                  value={borderColor}
                  onChange={(e) => onUpdate && onUpdate({ borderColor: e.target.value })}
                  size="small"
                />
              </Grid>
              <Grid item xs={3}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={useGradient}
                      onChange={(e) => onUpdate && onUpdate({ useGradient: e.target.checked })}
                    />
                  }
                  label="Градиент"
                />
              </Grid>
            </Grid>

            {/* Настройки градиента */}
            {useGradient && (
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={4}>
                  <TextField
                    fullWidth
                    type="color"
                    label="Цвет 1"
                    value={gradientColor1}
                    onChange={(e) => onUpdate && onUpdate({ gradientColor1: e.target.value })}
                    size="small"
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    fullWidth
                    type="color"
                    label="Цвет 2"
                    value={gradientColor2}
                    onChange={(e) => onUpdate && onUpdate({ gradientColor2: e.target.value })}
                    size="small"
                  />
                </Grid>
                <Grid item xs={4}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Направление</InputLabel>
                    <Select
                      value={gradientDirection}
                      label="Направление"
                      onChange={(e) => onUpdate && onUpdate({ gradientDirection: e.target.value })}
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

            {/* Настройки фона (если не градиент) */}
            {!useGradient && (
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={4}>
                  <TextField
                    fullWidth
                    type="color"
                    label="Цвет фона"
                    value={backgroundColor}
                    onChange={(e) => onUpdate && onUpdate({ backgroundColor: e.target.value })}
                    size="small"
                  />
                </Grid>
              </Grid>
            )}

            {/* Настройки анимации */}
            <AnimationControls
              animationSettings={animationSettings}
              onUpdate={(newSettings) => {
                if (onUpdate) {
                  onUpdate({ animationSettings: newSettings });
                }
              }}
              expanded={false}
            />
          </Box>
        )}

        {renderQuote()}
      </Box>
    </AnimationWrapper>
  );
};

export default BlockquoteNew; 