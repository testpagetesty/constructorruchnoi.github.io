import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Divider,
  Tooltip,
  ButtonGroup,
  Select,
  MenuItem,
  FormControl,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import LinkIcon from '@mui/icons-material/Link';
import ImageIcon from '@mui/icons-material/Image';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import CodeIcon from '@mui/icons-material/Code';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AnimationWrapper from '../AnimationWrapper';
import AnimationControls from '../AnimationControls';
import ColorSettings from './ColorSettings';

const parseMarkdown = (text) => {
  if (!text) return '';
  
  let result = text;
  
  // Заголовки
  result = result.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  result = result.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  result = result.replace(/^# (.*$)/gim, '<h1>$1</h1>');
  
  // Жирный текст
  result = result.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>');
  result = result.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Курсив
  result = result.replace(/\*(.*?)\*/g, '<em>$1</em>');
  
  // Ссылки
  result = result.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
  
  // Код inline
  result = result.replace(/`([^`]+)`/g, '<code style="background: #f4f4f4; padding: 2px 4px; border-radius: 3px;">$1</code>');
  
  // Списки
  result = result.replace(/^\* (.*)$/gm, '<li>$1</li>');
  result = result.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
  
  result = result.replace(/^\d+\. (.*)$/gm, '<li>$1</li>');
  result = result.replace(/(<li>.*<\/li>)/s, '<ol>$1</ol>');
  
  // Абзацы
  result = result.replace(/\n\n/g, '</p><p>');
  result = '<p>' + result + '</p>';
  
  // Убираем пустые абзацы
  result = result.replace(/<p><\/p>/g, '');
  
  return result;
};

const RichTextEditor = ({ 
  // Для режима элемента контента
  title,
  content,
  showTitle = true,
  titleColor = '#1976d2',
  textColor = '#333333',
  backgroundColor = 'transparent',
  padding = 0,
  borderRadius = 0,
  colorSettings = {},
  isPreview = false,
  isEditing: externalIsEditing = false,
  onUpdate,
  onSave,
  onCancel,
  
  // Для режима standalone редактора  
  initialContent = '<p>Начните печатать здесь...</p>',
  placeholder = 'Введите текст...',
  minHeight = 200,
  readonly = false,
  
  // Параметры анимации
  animationSettings = {
    animationType: 'fadeIn',
    delay: 0,
    triggerOnView: true,
    triggerOnce: true,
    threshold: 0.1,
    disabled: false
  },
  isConstructorMode = false
}) => {
  // Определяем режим работы компонента
  const isContentElement = title !== undefined || content !== undefined;
  
  // Состояния для редактора
  const [localIsEditing, setLocalIsEditing] = useState(false); // По умолчанию не редактируем
  const isEditing = externalIsEditing || localIsEditing;
  const [editorContent, setEditorContent] = useState(() => {
    if (isContentElement) {
      return content ? parseMarkdown(content) : '<p>Нет содержимого</p>';
    }
    return initialContent;
  });
  
  // Состояния для настроек
  const [currentAnimationSettings, setCurrentAnimationSettings] = useState({
    animationType: 'fadeIn',
    delay: 0,
    triggerOnView: true,
    triggerOnce: true,
    threshold: 0.1,
    disabled: false,
    ...animationSettings
  });
  const [currentBackgroundColor, setCurrentBackgroundColor] = useState(backgroundColor);
  const [currentTextColor, setCurrentTextColor] = useState(textColor);
  const [currentTitleColor, setCurrentTitleColor] = useState(titleColor);
  const [currentColorSettings, setCurrentColorSettings] = useState(colorSettings);
  const [animationExpanded, setAnimationExpanded] = useState(false);

  // Принудительное обновление при изменении colorSettings
  useEffect(() => {
    console.log('🔄 [RichTextEditor] colorSettings изменились:', colorSettings);
    
    // Принудительно обновляем состояние ТОЛЬКО если действительно изменились
    if (JSON.stringify(currentColorSettings) !== JSON.stringify(colorSettings || {})) {
      setCurrentColorSettings(colorSettings || {});
    }
    
  }, [colorSettings]);
  
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const editorRef = useRef(null);

  // Обновляем содержимое при изменении пропсов
  // ВРЕМЕННО ОТКЛЮЧЕН - вызывает бесконечный цикл
  // useEffect(() => {
  //   if (isContentElement && content !== undefined) {
  //     setEditorContent(content ? parseMarkdown(content) : '<p>Нет содержимого</p>');
  //   }
  // }, [content, isContentElement]);

  // Синхронизируем состояния с пропсами
  // ВРЕМЕННО ОТКЛЮЧЕН - может вызывать бесконечный цикл
  // useEffect(() => {
  //   setCurrentAnimationSettings({
  //     animationType: 'fadeIn',
  //     delay: 0,
  //     triggerOnView: true,
  //     triggerOnce: true,
  //     threshold: 0.1,
  //     disabled: false,
  //     ...animationSettings
  //   });
  //   setCurrentBackgroundColor(backgroundColor);
  //   setCurrentTextColor(textColor);
  //   setCurrentTitleColor(titleColor);
  //   setCurrentColorSettings(colorSettings);
  // }, [animationSettings, backgroundColor, textColor, titleColor, colorSettings]);

  // Обработчики для редактирования
  const handleSave = () => {
    if (onSave && editorRef.current) {
      const htmlContent = editorRef.current.innerHTML;
      // Преобразуем HTML обратно в markdown для сохранения
      let markdownContent = htmlContent
        .replace(/<h1>(.*?)<\/h1>/g, '# $1\n')
        .replace(/<h2>(.*?)<\/h2>/g, '## $1\n')
        .replace(/<h3>(.*?)<\/h3>/g, '### $1\n')
        .replace(/<strong><em>(.*?)<\/em><\/strong>/g, '***$1***')
        .replace(/<strong>(.*?)<\/strong>/g, '**$1**')
        .replace(/<em>(.*?)<\/em>/g, '*$1*')
        .replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/g, '[$2]($1)')
        .replace(/<code[^>]*>(.*?)<\/code>/g, '`$1`')
        .replace(/<p>(.*?)<\/p>/g, '$1\n\n')
        .replace(/<li>(.*?)<\/li>/g, '* $1\n')
        .replace(/<ul>|<\/ul>|<ol>|<\/ol>/g, '')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
      
      onSave(markdownContent);
      setLocalIsEditing(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    setLocalIsEditing(false);
    // Восстанавливаем исходное содержимое
    if (isContentElement && content) {
      setEditorContent(parseMarkdown(content));
    }
  };

  const handleContentChange = () => {
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML;
      setEditorContent(newContent);
      // Для элементов контента не вызываем onUpdate при каждом изменении
      // Сохранение происходит только при нажатии кнопки "Сохранить"
    }
  };

  // Обработка сохранения для элемента контента
  const handleElementSave = () => {
    console.log('[RichTextEditor] handleElementSave called');
    console.log('[RichTextEditor] onSave function available:', !!onSave);
    console.log('[RichTextEditor] Saving element with content:', editorContent);
    console.log('[RichTextEditor] Current animation settings:', currentAnimationSettings);
    if (onSave) {
      // Конвертируем HTML обратно в markdown для сохранения
      const markdownContent = editorContent
        .replace(/<strong><em>(.*?)<\/em><\/strong>/g, '***$1***')
        .replace(/<strong>(.*?)<\/strong>/g, '**$1**')
        .replace(/<em>(.*?)<\/em>/g, '*$1*')
        .replace(/<a href="([^"]+)"[^>]*>(.*?)<\/a>/g, '[$2]($1)')
        .replace(/<h1>(.*?)<\/h1>/g, '# $1')
        .replace(/<h2>(.*?)<\/h2>/g, '## $1')
        .replace(/<h3>(.*?)<\/h3>/g, '### $1')
        .replace(/<p>(.*?)<\/p>/g, '$1\n\n')
        .replace(/<br\s*\/?>/g, '\n')
        .replace(/<ul><li>(.*?)<\/li><\/ul>/g, '* $1')
        .replace(/<ol><li>(.*?)<\/li><\/ol>/g, '1. $1')
        .replace(/<code>(.*?)<\/code>/g, '`$1`')
        .replace(/<blockquote>(.*?)<\/blockquote>/g, '> $1')
        .trim();
      
      // Сохраняем все настройки
      const dataToSave = {
        content: markdownContent,
        backgroundColor: currentBackgroundColor,
        textColor: currentTextColor,
        titleColor: currentTitleColor,
        colorSettings: currentColorSettings,
        animationSettings: currentAnimationSettings
      };
      
      console.log('[RichTextEditor] Calling onSave with data:', dataToSave);
      onSave(dataToSave);
      
      // Закрываем редактор после сохранения
      console.log('[RichTextEditor] Closing editor');
      setLocalIsEditing(false);
    } else {
      console.error('[RichTextEditor] onSave function not provided!');
    }
  };

  const handleElementCancel = () => {
    console.log('[RichTextEditor] Cancelling element edit');
    // Сбрасываем все изменения
    setCurrentBackgroundColor(backgroundColor);
    setCurrentTextColor(textColor);
    setCurrentTitleColor(titleColor);
    setCurrentColorSettings(colorSettings);
    setCurrentAnimationSettings({
      animationType: 'fadeIn',
      delay: 0,
      triggerOnView: true,
      triggerOnce: true,
      threshold: 0.1,
      disabled: false,
      ...animationSettings
    });
    
    // Закрываем редактор
    setLocalIsEditing(false);
    
    if (onCancel) {
      onCancel();
    }
  };

  // Если это элемент контента в превью без редактирования
  if (isContentElement && isPreview && !onSave && !isEditing) {
    // Применяем настройки фона из colorSettings
    let containerStyles = {
            position: 'relative',
            backgroundColor: currentBackgroundColor || backgroundColor || 'transparent',
            padding: padding ? `${padding}px` : 0,
            borderRadius: borderRadius ? `${borderRadius}px` : 0,
            transition: 'all 0.3s ease'
    };

    // Применяем настройки фона из colorSettings
    if (currentColorSettings && currentColorSettings.sectionBackground && currentColorSettings.sectionBackground.enabled) {
      const { sectionBackground } = currentColorSettings;
      
      if (sectionBackground.useGradient) {
        containerStyles.background = `linear-gradient(${sectionBackground.gradientDirection}, ${sectionBackground.gradientColor1}, ${sectionBackground.gradientColor2})`;
      } else {
        containerStyles.backgroundColor = sectionBackground.solidColor;
      }
      
      containerStyles.opacity = sectionBackground.opacity;
    }

    // Применяем дополнительные настройки
    if (currentColorSettings) {
      if (currentColorSettings.borderColor) {
        containerStyles.border = `${currentColorSettings.borderWidth || 1}px solid ${currentColorSettings.borderColor}`;
      }
      if (currentColorSettings.borderRadius !== undefined) {
        containerStyles.borderRadius = `${currentColorSettings.borderRadius}px`;
      }
      if (currentColorSettings.padding !== undefined) {
        containerStyles.padding = `${currentColorSettings.padding}px`;
      }
      if (currentColorSettings.boxShadow) {
        containerStyles.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
      }
    }

    return (
      <AnimationWrapper {...currentAnimationSettings}>
        <Box 
          className="rich-text-container"
          sx={containerStyles}
        >
          {showTitle && title && (
            <Typography 
              variant="h5" 
              component="h2" 
              gutterBottom
              sx={{ 
                color: currentColorSettings?.textFields?.title || currentTitleColor || titleColor || '#fff',
                fontWeight: 'bold',
                mb: 2,
                textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
              }}
            >
              {title}
            </Typography>
          )}
          <Box 
            onDoubleClick={() => setLocalIsEditing(true)}
            sx={{
              color: currentColorSettings?.textFields?.content || currentTextColor || textColor || '#fff',
              fontSize: '16px',
              lineHeight: 1.6,
              cursor: 'pointer',
              position: 'relative',
              '&:hover': {
                backgroundColor: 'rgba(196, 30, 58, 0.04)',
                borderRadius: 1,
                p: 1,
                m: -1
              },
              '& h1, & h2, & h3, & h4, & h5, & h6': {
                margin: '16px 0 8px 0',
                fontWeight: 'bold',
                color: currentColorSettings?.textFields?.title || currentTitleColor || titleColor || '#ffd700',
                textShadow: '1px 1px 2px rgba(0,0,0,0.7)'
              },
              '& p': {
                margin: '8px 0',
                color: currentColorSettings?.textFields?.content || currentTextColor || textColor || '#fff',
                textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
              },
              '& ul, & ol': {
                margin: '8px 0',
                paddingLeft: '24px'
              },
              '& li': {
                margin: '4px 0',
                color: currentColorSettings?.textFields?.content || currentTextColor || textColor || '#fff',
                textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
              },
              '& a': {
                color: '#ffd700',
                textDecoration: 'underline',
                textShadow: '1px 1px 2px rgba(0,0,0,0.7)'
              },
              '& code': {
                backgroundColor: 'rgba(0,0,0,0.8)',
                color: '#ffd700',
                padding: '2px 4px',
                borderRadius: '3px',
                fontFamily: 'monospace',
                border: '1px solid #ffd700'
              },
              '& blockquote': {
                margin: '16px 0',
                padding: '8px 16px',
                borderLeft: '4px solid #ffd700',
                backgroundColor: 'rgba(0,0,0,0.85)',
                color: currentColorSettings?.textFields?.content || currentTextColor || textColor || '#fff',
                fontStyle: 'italic',
                textShadow: '1px 1px 2px rgba(0,0,0,0.7)'
              },
              '& strong': {
                fontWeight: 'bold',
                color: currentColorSettings?.textFields?.content || currentTextColor || textColor || '#fff',
                textShadow: '1px 1px 2px rgba(0,0,0,0.7)'
              },
              '& em': {
                fontStyle: 'italic',
                color: currentColorSettings?.textFields?.content || currentTextColor || textColor || '#fff',
                textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
              }
            }}
            dangerouslySetInnerHTML={{ __html: editorContent }}
            title="Двойной клик для редактирования"
          />
          
          {/* Кнопка редактирования */}
          <Box
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              opacity: 0,
              transition: 'opacity 0.2s ease',
              zIndex: 10,
              '.rich-text-container:hover &': {
                opacity: 1
              }
            }}
          >
            <Tooltip title="Редактировать текст">
              <IconButton
                size="small"
                onClick={() => setLocalIsEditing(true)}
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
        </Box>
      </AnimationWrapper>
    );
  }

  // Если в режиме редактирования
  if (isContentElement && isPreview && isEditing) {
    return (
      <AnimationWrapper {...currentAnimationSettings}>
        <Box sx={{ mb: 2 }}>
          {showTitle && title && (
            <Typography 
              variant="h5" 
              component="h2" 
              gutterBottom
              sx={{ 
                color: currentTitleColor || titleColor,
                fontWeight: 'bold',
                mb: 2
              }}
            >
              {title}
            </Typography>
          )}
          <Box sx={{ border: '2px solid #1976d2', borderRadius: 1, overflow: 'hidden' }}>
            {/* Панель инструментов для редактирования */}
            <Paper sx={{ p: 1, backgroundColor: '#1976d2', color: 'white' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                <Typography variant="body2" sx={{ flexGrow: 1 }}>
                  🎨 Редактирование текста
                </Typography>
                


                <Button
                  size="small"
                  onClick={handleElementSave}
                  variant="contained"
                  color="success"
                  sx={{ minWidth: 'auto', mr: 1 }}
                >
                  Сохранить
                </Button>
                <Button
                  size="small"
                  onClick={handleElementCancel}
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

            {/* Настройки анимации */}
            <Accordion 
              expanded={animationExpanded} 
              onChange={() => setAnimationExpanded(!animationExpanded)}
              sx={{ boxShadow: 'none', '&:before': { display: 'none' } }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="body2">⚡ Настройки анимации</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <AnimationControls
                  animationSettings={currentAnimationSettings}
                  onUpdate={(newSettings) => {
                    console.log('[RichTextEditor] Animation settings updated:', newSettings);
                    setCurrentAnimationSettings(newSettings);
                    if (onUpdate) {
                      onUpdate({ animationSettings: newSettings });
                    }
                  }}
                />
              </AccordionDetails>
            </Accordion>

            {/* Настройки цветов */}
            <Accordion defaultExpanded sx={{ boxShadow: 'none', '&:before': { display: 'none' } }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="body2">🎨 Настройки цветов</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <ColorSettings
                  title="Настройки цветов текста"
                  colorSettings={currentColorSettings}
                  onUpdate={(newColorSettings) => {
                    console.log('[RichTextEditor] Color settings updated:', newColorSettings);
                    setCurrentColorSettings(newColorSettings);
                    if (onUpdate) {
                      onUpdate({ colorSettings: newColorSettings });
                    }
                  }}
                  availableFields={[
                    {
                      name: 'title',
                      label: 'Цвет заголовка',
                      description: 'Цвет заголовка текста',
                      defaultColor: currentTitleColor || titleColor || '#1976d2'
                    },
                    {
                      name: 'content',
                      label: 'Цвет содержимого',
                      description: 'Цвет основного текста',
                      defaultColor: currentTextColor || textColor || '#333333'
                    }
                  ]}
                  defaultColors={{
                    title: currentTitleColor || titleColor || '#1976d2',
                    content: currentTextColor || textColor || '#333333'
                  }}
                  hideCardBackground={true}
                  hideAreaColors={true}
                />
              </AccordionDetails>
            </Accordion>

            {/* Простой редактор */}
            <Box
              ref={editorRef}
              contentEditable={true}
              suppressContentEditableWarning
              onInput={handleContentChange}
              onBlur={handleContentChange}
              dangerouslySetInnerHTML={{ __html: editorContent }}
              sx={{
                minHeight: 150,
                p: 2,
                outline: 'none',
                cursor: 'text',
                fontSize: '16px',
                lineHeight: 1.6,
                color: currentTextColor || textColor,
                backgroundColor: currentBackgroundColor || backgroundColor || 'transparent',
                '& h1, & h2, & h3, & h4, & h5, & h6': {
                  margin: '16px 0 8px 0',
                  fontWeight: 'bold',
                  color: currentTitleColor || titleColor
                },
                '& p': {
                  margin: '8px 0'
                },
                '& ul, & ol': {
                  margin: '8px 0',
                  paddingLeft: '24px'
                },
                '& li': {
                  margin: '4px 0'
                },
                '& a': {
                  color: '#1976d2',
                  textDecoration: 'underline'
                },
                '& code': {
                  backgroundColor: '#f4f4f4',
                  padding: '2px 4px',
                  borderRadius: '3px',
                  fontFamily: 'monospace'
                },
                '& strong': {
                  fontWeight: 'bold'
                },
                '& em': {
                  fontStyle: 'italic'
                }
              }}
            />
          </Box>
        </Box>
      </AnimationWrapper>
    );
  }

  // Если это элемент контента с возможностью редактирования в превью
  if (isContentElement && isPreview && onSave) {
    return (
      <Box sx={{ mb: 2 }}>
        {showTitle && title && (
          <Typography 
            variant="h5" 
            component="h2" 
            gutterBottom
            sx={{ 
              color: titleColor,
              fontWeight: 'bold',
              mb: 2
            }}
          >
            {title}
          </Typography>
        )}
        <Box sx={{ border: '2px solid #1976d2', borderRadius: 1, overflow: 'hidden' }}>
          {/* Панель инструментов для редактирования в превью */}
          <Paper sx={{ p: 1, backgroundColor: '#1976d2', color: 'white' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" sx={{ flexGrow: 1 }}>
                🎨 Режим редактирования
              </Typography>
              <Button
                size="small"
                onClick={handleSave}
                variant="contained"
                color="success"
                sx={{ minWidth: 'auto', mr: 1 }}
              >
                Сохранить
              </Button>
              <Button
                size="small"
                onClick={handleCancel}
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

          {/* Простой редактор */}
          <Box
            ref={editorRef}
            contentEditable={true}
            suppressContentEditableWarning
            onInput={handleContentChange}
            onBlur={handleContentChange}
            dangerouslySetInnerHTML={{ __html: editorContent }}
            sx={{
              minHeight: 150,
              p: 2,
              outline: 'none',
              cursor: 'text',
              fontSize: '16px',
              lineHeight: 1.6,
              color: textColor,
              '& h1, & h2, & h3, & h4, & h5, & h6': {
                margin: '16px 0 8px 0',
                fontWeight: 'bold',
                color: titleColor
              },
              '& p': {
                margin: '8px 0'
              },
              '& ul, & ol': {
                margin: '8px 0',
                paddingLeft: '24px'
              },
              '& li': {
                margin: '4px 0'
              },
              '& a': {
                color: '#1976d2',
                textDecoration: 'underline'
              },
              '& code': {
                backgroundColor: '#f4f4f4',
                padding: '2px 4px',
                borderRadius: '3px',
                fontFamily: 'monospace'
              },
              '& strong': {
                fontWeight: 'bold'
              },
              '& em': {
                fontStyle: 'italic'
              }
            }}
          />
        </Box>
      </Box>
    );
  }

  // Режим редактирования или standalone редактор
  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current.focus();
    handleContentChange();
  };

  const handleLinkInsert = () => {
    if (linkUrl && linkText) {
      const linkHtml = `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer">${linkText}</a>`;
      execCommand('insertHTML', linkHtml);
      setLinkDialogOpen(false);
      setLinkUrl('');
      setLinkText('');
    }
  };

  const handleImageInsert = () => {
    if (imageUrl) {
      const imageHtml = `<img src="${imageUrl}" alt="${imageAlt}" style="max-width: 100%; height: auto; border-radius: 8px; margin: 10px 0;" />`;
      execCommand('insertHTML', imageHtml);
      setImageDialogOpen(false);
      setImageUrl('');
      setImageAlt('');
    }
  };

  const fontSizes = [
    { value: '1', label: 'Очень маленький' },
    { value: '2', label: 'Маленький' },
    { value: '3', label: 'Нормальный' },
    { value: '4', label: 'Средний' },
    { value: '5', label: 'Большой' },
    { value: '6', label: 'Очень большой' },
    { value: '7', label: 'Максимальный' }
  ];

  const headingOptions = [
    { value: '', label: 'Обычный текст' },
    { value: 'h1', label: 'Заголовок 1' },
    { value: 'h2', label: 'Заголовок 2' },
    { value: 'h3', label: 'Заголовок 3' },
    { value: 'h4', label: 'Заголовок 4' },
    { value: 'h5', label: 'Заголовок 5' },
    { value: 'h6', label: 'Заголовок 6' }
  ];

  const colorOptions = [
    '#000000', '#333333', '#666666', '#999999', '#cccccc', '#ffffff',
    '#ff0000', '#ff6600', '#ffcc00', '#66ff00', '#00ff66', '#00ffff',
    '#0066ff', '#6600ff', '#ff00cc', '#ff6699', '#993366', '#660099'
  ];

  return (
    <AnimationWrapper {...animationSettings}>
      <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 1, overflow: 'hidden' }}>
        {/* Режим конструктора */}
        {isConstructorMode && (
          <Box sx={{ p: 2, backgroundColor: '#f5f5f5', borderBottom: '1px solid #e0e0e0' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Настройки Rich Text Editor
            </Typography>
            <AnimationControls
              animationSettings={animationSettings}
              onUpdate={(newSettings) => {
                if (onUpdate) {
                  onUpdate({ animationSettings: newSettings });
                }
              }}
            />
          </Box>
        )}

        {/* Панель инструментов */}
        {isEditing && (
        <Paper sx={{ p: 1, backgroundColor: '#f5f5f5', borderRadius: 0 }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center', mb: 1 }}>
            {/* Кнопки сохранения и отмены для режима элемента контента */}
            {isContentElement && (
              <>
                <ButtonGroup size="small">
                  <Tooltip title="Сохранить">
                    <IconButton onClick={handleSave} color="primary">
                      <SaveIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Отменить">
                    <IconButton onClick={handleCancel} color="secondary">
                      <CancelIcon />
                    </IconButton>
                  </Tooltip>
                </ButtonGroup>
                <Divider orientation="vertical" flexItem />
              </>
            )}

            {/* Отмена/Повтор */}
            <ButtonGroup size="small">
              <Tooltip title="Отменить">
                <IconButton onClick={() => execCommand('undo')}>
                  <UndoIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Повторить">
                <IconButton onClick={() => execCommand('redo')}>
                  <RedoIcon />
                </IconButton>
              </Tooltip>
            </ButtonGroup>

            <Divider orientation="vertical" flexItem />

            {/* Заголовки */}
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <Select
                defaultValue=""
                onChange={(e) => execCommand('formatBlock', e.target.value)}
                displayEmpty
              >
                {headingOptions.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Размер шрифта */}
            <FormControl size="small" sx={{ minWidth: 100 }}>
              <Select
                defaultValue="3"
                onChange={(e) => execCommand('fontSize', e.target.value)}
              >
                {fontSizes.map(size => (
                  <MenuItem key={size.value} value={size.value}>
                    {size.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Divider orientation="vertical" flexItem />

            {/* Форматирование */}
            <ButtonGroup size="small">
              <Tooltip title="Жирный">
                <IconButton onClick={() => execCommand('bold')}>
                  <FormatBoldIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Курсив">
                <IconButton onClick={() => execCommand('italic')}>
                  <FormatItalicIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Подчеркнутый">
                <IconButton onClick={() => execCommand('underline')}>
                  <FormatUnderlinedIcon />
                </IconButton>
              </Tooltip>
            </ButtonGroup>

            <Divider orientation="vertical" flexItem />

            {/* Выравнивание */}
            <ButtonGroup size="small">
              <Tooltip title="По левому краю">
                <IconButton onClick={() => execCommand('justifyLeft')}>
                  <FormatAlignLeftIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="По центру">
                <IconButton onClick={() => execCommand('justifyCenter')}>
                  <FormatAlignCenterIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="По правому краю">
                <IconButton onClick={() => execCommand('justifyRight')}>
                  <FormatAlignRightIcon />
                </IconButton>
              </Tooltip>
            </ButtonGroup>

            <Divider orientation="vertical" flexItem />

            {/* Списки */}
            <ButtonGroup size="small">
              <Tooltip title="Маркированный список">
                <IconButton onClick={() => execCommand('insertUnorderedList')}>
                  <FormatListBulletedIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Нумерованный список">
                <IconButton onClick={() => execCommand('insertOrderedList')}>
                  <FormatListNumberedIcon />
                </IconButton>
              </Tooltip>
            </ButtonGroup>

            <Divider orientation="vertical" flexItem />

            {/* Цвета */}
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              {colorOptions.slice(0, 8).map(color => (
                <Box
                  key={color}
                  sx={{
                    width: 20,
                    height: 20,
                    backgroundColor: color,
                    border: '1px solid #ccc',
                    borderRadius: 0.5,
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'scale(1.1)'
                    }
                  }}
                  onClick={() => execCommand('foreColor', color)}
                />
              ))}
            </Box>

            <Divider orientation="vertical" flexItem />

            {/* Специальные */}
            <ButtonGroup size="small">
              <Tooltip title="Цитата">
                <IconButton onClick={() => execCommand('formatBlock', 'blockquote')}>
                  <FormatQuoteIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Код">
                <IconButton onClick={() => execCommand('formatBlock', 'pre')}>
                  <CodeIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Вставить ссылку">
                <IconButton onClick={() => setLinkDialogOpen(true)}>
                  <LinkIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Вставить изображение">
                <IconButton onClick={() => setImageDialogOpen(true)}>
                  <ImageIcon />
                </IconButton>
              </Tooltip>
            </ButtonGroup>
          </Box>
          
          {/* Подсказка для markdown */}
          {isContentElement && (
            <Typography variant="caption" color="text.secondary">
              💡 Совет: Используйте разметку Markdown в панели редактирования для более удобного форматирования
            </Typography>
          )}
        </Paper>
      )}

      {/* Редактор */}
      <Box
        ref={editorRef}
        contentEditable={isEditing}
        suppressContentEditableWarning
        onInput={handleContentChange}
        onBlur={handleContentChange}
        dangerouslySetInnerHTML={{ __html: editorContent }}
        sx={{
          minHeight: minHeight,
          p: 2,
          outline: 'none',
          cursor: isEditing ? 'text' : 'default',
          fontSize: '16px',
          lineHeight: 1.6,
          '& h1, & h2, & h3, & h4, & h5, & h6': {
            margin: '16px 0 8px 0',
            fontWeight: 'bold'
          },
          '& p': {
            margin: '8px 0'
          },
          '& blockquote': {
            margin: '16px 0',
            padding: '8px 16px',
            borderLeft: '4px solid #1976d2',
            backgroundColor: '#f5f5f5',
            fontStyle: 'italic'
          },
          '& pre': {
            backgroundColor: '#f5f5f5',
            padding: '12px',
            borderRadius: '4px',
            fontFamily: 'monospace',
            fontSize: '14px',
            overflow: 'auto'
          },
          '& ul, & ol': {
            margin: '8px 0',
            paddingLeft: '24px'
          },
          '& li': {
            margin: '4px 0'
          },
          '& a': {
            color: '#1976d2',
            textDecoration: 'underline'
          },
          '& img': {
            maxWidth: '100%',
            height: 'auto',
            borderRadius: '8px',
            margin: '10px 0'
          }
        }}
      />

      {/* Диалог ссылки */}
      <Dialog open={linkDialogOpen} onClose={() => setLinkDialogOpen(false)}>
        <DialogTitle>Вставить ссылку</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Текст ссылки"
            fullWidth
            value={linkText}
            onChange={(e) => setLinkText(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="URL"
            fullWidth
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="https://example.com"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLinkDialogOpen(false)}>Отмена</Button>
          <Button onClick={handleLinkInsert} variant="contained">Вставить</Button>
        </DialogActions>
      </Dialog>

      {/* Диалог изображения */}
      <Dialog open={imageDialogOpen} onClose={() => setImageDialogOpen(false)}>
        <DialogTitle>Вставить изображение</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="URL изображения"
            fullWidth
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Альтернативный текст"
            fullWidth
            value={imageAlt}
            onChange={(e) => setImageAlt(e.target.value)}
            placeholder="Описание изображения"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setImageDialogOpen(false)}>Отмена</Button>
          <Button onClick={handleImageInsert} variant="contained">Вставить</Button>
        </DialogActions>
      </Dialog>

      {/* Статистика (только в режиме редактирования) */}
      {isEditing && (
        <Box sx={{ p: 1, backgroundColor: '#f9f9f9', borderTop: '1px solid #e0e0e0' }}>
          <Typography variant="caption" color="text.secondary">
            Слов: {editorContent.replace(/<[^>]*>/g, '').split(' ').filter(word => word.length > 0).length} | 
            Символов: {editorContent.replace(/<[^>]*>/g, '').length}
          </Typography>
        </Box>
      )}
      </Box>
    </AnimationWrapper>
  );
};

export default RichTextEditor; 