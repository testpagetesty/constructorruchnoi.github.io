import React, { useState, useRef } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Paper, 
  Divider, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel,
  Alert,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
  Collapse,
  ListItemText,
  List,
  ListItem,
  Chip,
  FormControlLabel,
  Checkbox,
  Grid
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import SettingsIcon from '@mui/icons-material/Settings';
import EditIcon from '@mui/icons-material/Edit';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLess from '@mui/icons-material/ExpandLess';
import TuneIcon from '@mui/icons-material/Tune';
import { CARD_TYPES } from '../../utils/configUtils';
import GlobalSettings, { WEBSITE_THEMES, LANGUAGES, CONTENT_STYLES } from './GlobalSettings';
import * as parsers from './parsingFunctions';

// Функция для удаления Markdown форматирования
const stripMarkdown = (text) => {
  if (!text) return '';
  
  // Удаляем форматирование жирным (**текст**)
  return text.replace(/\*\*(.*?)\*\*/g, '$1')
    // Удаляем форматирование курсивом (*текст*)
    .replace(/\*(.*?)\*/g, '$1')
    // Другие возможные форматирования Markdown
    .replace(/`(.*?)`/g, '$1') // код
    .replace(/__(.*?)__/g, '$1') // подчеркивание
    .replace(/_(.*?)_/g, '$1') // курсив через подчеркивание
    .replace(/\[(.*?)\]\(.*?\)/g, '$1'); // ссылки
};

// Добавляем объект с предустановленными промптами
const DEFAULT_PROMPTS = {
  // ... existing prompts ...
};

const AiParser = ({ 
  sectionsData = {}, 
  onSectionsChange, 
  headerData, 
  onHeaderChange, 
  contactData, 
  onContactChange, 
  legalDocuments, 
  onLegalDocumentsChange, 
  heroData, 
  onHeroChange 
}) => {
  // Добавляем ref для текстового поля
  const textareaRef = useRef(null);

  // Существующие состояния
  const [customDelimiter, setCustomDelimiter] = useState('\\n\\n');
  const [customTitleContentDelimiter, setCustomTitleContentDelimiter] = useState(':');
  const [showSettings, setShowSettings] = useState(false);
  const [content, setContent] = useState('');
  const [result, setResult] = useState(null);
  const [targetSection, setTargetSection] = useState('AUTO');
  const [parserMessage, setParserMessage] = useState('');
  const [expanded, setExpanded] = useState(false);
  const [expandedSections, setExpandedSections] = useState({});
  const [prompts, setPrompts] = useState(DEFAULT_PROMPTS);
  const [showPromptEditor, setShowPromptEditor] = useState(false);
  const [editingPromptType, setEditingPromptType] = useState(null);
  const [editingPromptText, setEditingPromptText] = useState('');
  
  // Добавляем состояния для глобальных настроек
  const [showGlobalSettings, setShowGlobalSettings] = useState(false);
  const [globalSettings, setGlobalSettings] = useState({
    theme: 'LAW',
    customTheme: '',
    language: 'RU',
    contentStyle: 'PROFESSIONAL',
    additionalKeywords: '',
    usePrice: false,
    usePromotions: false,
    useContacts: false,
    useSocial: false,
    customInstructions: '',
    customLanguage: ''
  });

  // Функция для применения глобальных настроек к промпту
  const applyGlobalSettings = (promptText) => {
    const theme = globalSettings.theme === 'CUSTOM' 
      ? globalSettings.customTheme 
      : WEBSITE_THEMES[globalSettings.theme];

    // Определение языка для промпта
    let language;
    if (globalSettings.language === 'CUSTOM' && globalSettings.customLanguage) {
      language = `языке с кодом ISO ${globalSettings.customLanguage}`;
    } else {
      language = LANGUAGES[globalSettings.language].split(' ')[0]; // Берем только название языка без кода
    }

    let enhancedPrompt = `Создайте контент для сайта "${theme}" на ${language}.\n`;
    enhancedPrompt += `Стиль контента: ${CONTENT_STYLES[globalSettings.contentStyle]}.\n`;
    enhancedPrompt += `ВАЖНО: Не используйте никакого форматирования (Markdown, HTML). Не используйте символы **, ---, ###, _ или другие специальные символы для форматирования. Выдавайте чистый текст.\n`;

    if (globalSettings.additionalKeywords) {
      enhancedPrompt += `Ключевые особенности: ${globalSettings.additionalKeywords}\n`;
    }

    const features = [];
    if (globalSettings.usePrice) features.push('указывать цены');
    if (globalSettings.usePromotions) features.push('включать акции и спецпредложения');
    if (globalSettings.useContacts) features.push('добавлять контактную информацию');
    if (globalSettings.useSocial) features.push('упоминать социальные сети');

    if (features.length > 0) {
      enhancedPrompt += `Дополнительно: ${features.join(', ')}.\n`;
    }

    if (globalSettings.customInstructions) {
      enhancedPrompt += `Особые требования: ${globalSettings.customInstructions}\n`;
    }

    enhancedPrompt += '\nФормат ответа:\n';
    enhancedPrompt += '1. Используйте обычный текст без специальных символов форматирования\n';
    enhancedPrompt += '2. Разделяйте секции с помощью пустых строк\n';
    enhancedPrompt += '3. Цены и акции указывайте в обычном тексте, например: "Цена: 10000 рублей"\n\n';

    enhancedPrompt += promptText;

    return enhancedPrompt;
  };

  // Модифицируем функцию копирования промпта
  const copyPromptToClipboard = () => {
    const prompt = prompts[targetSection] || `Сгенерируйте для меня ${
      targetSection === 'FEATURES' ? 'преимущества' : 
      targetSection === 'ABOUT' ? 'информацию о' :
      'раздел'} для сайта.`;
    
    const enhancedPrompt = applyGlobalSettings(prompt);
    
    navigator.clipboard.writeText(enhancedPrompt)
      .then(() => {
        setParserMessage('Промпт с глобальными настройками скопирован в буфер обмена.');
        // Очищаем текстовое поле после копирования
        handleClearText();
      })
      .catch(() => {
        setParserMessage('Не удалось скопировать промпт.');
      });
  };

  // Обработка изменения текста
  const handleTextChange = (e) => {
    // Нормализуем переносы строк
    const normalizedText = e.target.value.replace(/\r\n/g, '\n');
    setContent(normalizedText);
  };

  // Очищаем Markdown при вставке текста и нормализуем переносы строк
  const handleTextPaste = (e) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text/plain');
    
    // Нормализуем переносы строк в вставленном тексте
    const normalizedText = pastedText
      .replace(/\r\n/g, '\n')  // Заменяем CRLF на LF
      .replace(/\r/g, '\n');   // Заменяем CR на LF
    
    setContent(normalizedText);
    
    // Эмулируем изменение для правильной обработки разделителей
    if (textareaRef.current) {
      const event = new Event('input', { bubbles: true });
      textareaRef.current.value = normalizedText;
      textareaRef.current.dispatchEvent(event);
    }
  };

  const handleClearText = () => {
    setContent('');
    setResult(null);
    setParserMessage('');
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  // Функция для сохранения отредактированного промпта
  const handleSavePrompt = () => {
    if (editingPromptType) {
      setPrompts(prev => ({
        ...prev,
        [editingPromptType]: editingPromptText
      }));
    }
    setShowPromptEditor(false);
    setEditingPromptType(null);
    setEditingPromptText('');
  };

  // Обработка парсинга
  const handleParse = () => {
    try {
      setParserMessage('');
      setResult(null);
      
      if (!content.trim()) {
        setParserMessage('Введите текст для парсинга.');
        return;
      }
      
      if (targetSection) {
        let parsedData = null;
        
        switch (targetSection) {
          case 'SERVICES':
            parsedData = parsers.parseServices(content);
            if (parsedData) onSectionsChange({ ...sectionsData, services: parsedData });
            break;
          case 'FEATURES':
            parsedData = parsers.parseAdvantagesSection(content);
            if (parsedData) onSectionsChange({ ...sectionsData, features: parsedData });
            break;
          case 'ABOUT':
            parsedData = parsers.parseAboutSection(content);
            if (parsedData) onSectionsChange({ ...sectionsData, about: parsedData });
            break;
          case 'TESTIMONIALS':
            parsedData = parsers.parseTestimonials(content);
            if (parsedData) onSectionsChange({ ...sectionsData, testimonials: parsedData });
            break;
          case 'FAQ':
            parsedData = parsers.parseFaq(content);
            if (parsedData) onSectionsChange({ ...sectionsData, faq: parsedData });
            break;
          case 'NEWS':
            parsedData = parsers.parseNews(content);
            if (parsedData) onSectionsChange({ ...sectionsData, news: parsedData });
            break;
          case 'CONTACTS':
            parsedData = parsers.parseContacts(content, headerData);
            if (parsedData) onContactChange(parsedData);
            break;
          case 'LEGAL':
            parsedData = parsers.parseLegalDocuments(content);
            if (parsedData) onLegalDocumentsChange(parsedData);
            break;
          case 'HERO':
            parsedData = parsers.parseHero(content);
            if (parsedData) onHeroChange(parsedData);
            break;
          case 'AUTO':
            smartParseContent();
            break;
          default:
            const detectedType = parsers.autoDetectSectionType(content);
            setTargetSection(detectedType);
            handleParse();
            return;
        }

        if (parsedData) {
          setResult(parsedData);
          setParserMessage('Текст успешно обработан и сохранен.');
        } else {
          setParserMessage('Не удалось обработать текст. Проверьте формат и попробуйте снова.');
        }
      } else {
        const detectedType = parsers.autoDetectSectionType(content);
        setTargetSection(detectedType);
        handleParse();
      }
    } catch (error) {
      console.error('Error in handleParse:', error);
      setParserMessage('Произошла ошибка при обработке текста. Проверьте формат и попробуйте снова.');
    }
  };

  const smartParseContent = () => {
    const sectionType = parsers.autoDetectSectionType(content);
    if (sectionType !== 'AUTO') {
      setTargetSection(sectionType);
      handleParse();
    } else {
      setParserMessage('Не удалось автоматически определить тип контента. Пожалуйста, выберите раздел вручную.');
    }
  };

  return (
    <Accordion defaultExpanded={false} sx={{ mb: 2 }}>
      <AccordionSummary 
        expandIcon={<ExpandMoreIcon />} 
        sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}
      >
        <Typography variant="h6" sx={{ color: '#e53935' }}>
          AI Парсер контента
        </Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ p: 0 }}>
        <Paper sx={{ boxShadow: 'none' }}>
          <Box sx={{ p: 2, borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => setShowSettings(true)}
                startIcon={<SettingsIcon />}
              >
                Настройки парсера
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => setShowGlobalSettings(true)}
                startIcon={<TuneIcon />}
              >
                Настройки контента
              </Button>
            </Box>
          </Box>

          {/* Добавляем компонент глобальных настроек */}
          <GlobalSettings
            open={showGlobalSettings}
            onClose={() => setShowGlobalSettings(false)}
            settings={globalSettings}
            onSettingsChange={setGlobalSettings}
          />
            
          <Box sx={{ p: 2 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="section-select-label">Выберите раздел для заполнения</InputLabel>
              <Select
                labelId="section-select-label"
                value={targetSection}
                label="Выберите раздел для заполнения"
                onChange={(e) => setTargetSection(e.target.value)}
              >
                <MenuItem value="AUTO">Автоопределение</MenuItem>
                <MenuItem value="HERO">Hero секция</MenuItem>
                <MenuItem value="ABOUT">О нас</MenuItem>
                <MenuItem value="FEATURES">Преимущества</MenuItem>
                <MenuItem value="SERVICES">Услуги</MenuItem>
                <MenuItem value="TESTIMONIALS">Отзывы</MenuItem>
                <MenuItem value="FAQ">Вопросы и ответы</MenuItem>
                <MenuItem value="NEWS">Новости</MenuItem>
                <MenuItem value="CONTACTS">Свяжитесь с нами</MenuItem>
                <MenuItem value="LEGAL">Правовые документы</MenuItem>
              </Select>
            </FormControl>
              
            <Box sx={{ 
              display: 'flex', 
              gap: 1, 
              mb: 2,
              '& .MuiButton-root': {
                minWidth: '120px',
                height: '32px',
                borderRadius: '4px',
                textTransform: 'none',
                fontSize: '0.8125rem',
                padding: '4px 12px',
                fontWeight: 500,
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
                  transform: 'translateY(-1px)'
                }
              }
            }}>
              <Tooltip title="Скопировать шаблон промпта" arrow placement="top">
                <span>
                  <Button 
                    variant="outlined" 
                    color="primary" 
                    onClick={copyPromptToClipboard}
                    startIcon={<ContentCopyIcon sx={{ fontSize: '0.9rem' }} />}
                    disabled={!targetSection || targetSection === 'AUTO'}
                    sx={{
                      borderWidth: '1px',
                      '&:hover': {
                        borderWidth: '1px'
                      }
                    }}
                  >
                    Копировать
                  </Button>
                </span>
              </Tooltip>
              <Tooltip title="Настроить шаблон промпта" arrow placement="top">
                <span>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleOpenPromptEditor(targetSection)}
                    startIcon={<EditIcon sx={{ fontSize: '0.9rem' }} />}
                    disabled={!targetSection || targetSection === 'AUTO'}
                    sx={{
                      background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #1565c0 30%, #1976d2 90%)'
                      }
                    }}
                  >
                    Изменить
                  </Button>
                </span>
              </Tooltip>
            </Box>
              
            <TextField
              multiline
              rows={10}
              fullWidth
              value={content}
              onChange={handleTextChange}
              onPaste={handleTextPaste}
              inputRef={textareaRef}
              placeholder="Вставьте сюда текст от AI для обработки..."
            />
              
            <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleParse}
                disabled={!content.trim()}
              >
                Обработать и заполнить
              </Button>
              <Button 
                variant="outlined" 
                color="secondary" 
                onClick={handleClearText}
              >
                Очистить
              </Button>
            </Box>
              
            {parserMessage && (
              <Alert severity="info" sx={{ mt: 2 }}>
                {parserMessage}
              </Alert>
            )}
              
            {result && (
              <Accordion 
                sx={{ mt: 2 }} 
                defaultExpanded={false}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h6">
                    Данные JSON:
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', margin: 0 }}>
                    {JSON.stringify(result, null, 2)}
                  </pre>
                </AccordionDetails>
              </Accordion>
            )}
          </Box>

          {/* Диалог редактирования промпта */}
          <Dialog 
            open={showPromptEditor} 
            onClose={() => setShowPromptEditor(false)}
            maxWidth="md"
            fullWidth
          >
            <DialogTitle>
              Редактирование промпта для раздела {editingPromptType}
            </DialogTitle>
            <DialogContent>
              <TextField
                fullWidth
                multiline
                rows={20}
                value={editingPromptText}
                onChange={(e) => setEditingPromptText(e.target.value)}
                margin="dense"
                variant="outlined"
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setShowPromptEditor(false)}>Отмена</Button>
              <Button onClick={handleSavePrompt} variant="contained" color="primary">
                Сохранить
              </Button>
            </DialogActions>
          </Dialog>

          {/* Диалог настроек */}
          <Dialog open={showSettings} onClose={() => setShowSettings(false)}>
            <DialogTitle>Настройки парсера</DialogTitle>
            <DialogContent>
              <TextField
                label="Разделитель между элементами"
                fullWidth
                margin="dense"
                value={customDelimiter}
                onChange={(e) => setCustomDelimiter(e.target.value)}
                placeholder="\n\n"
                helperText="По умолчанию: двойной перенос строки"
              />
              
              <TextField
                label="Разделитель между заголовком и содержимым"
                fullWidth
                margin="dense"
                value={customTitleContentDelimiter}
                onChange={(e) => setCustomTitleContentDelimiter(e.target.value)}
                placeholder="\n"
                helperText="По умолчанию: одинарный перенос строки"
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setShowSettings(false)}>Закрыть</Button>
            </DialogActions>
          </Dialog>
        </Paper>
      </AccordionDetails>
    </Accordion>
  );
};

export default AiParser; 