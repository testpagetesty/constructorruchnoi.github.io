import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Tooltip,
  Chip,
  Switch,
  FormControlLabel
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import AnimationWrapper from '../AnimationWrapper';
import AnimationControls from '../AnimationControls';

const CodeBlock = ({
  initialCode = 'function hello() {\n  console.log("Hello, World!");\n}',
  language = 'javascript',
  title = '',
  showLineNumbers = true,
  theme = 'light',
  copyable = true,
  editable = true,
  onUpdate,
  
  // Параметры анимации
  animationSettings = {
    type: 'fadeIn',
    duration: 0.6,
    delay: 0
  },
  isConstructorMode = false
}) => {
  const [code, setCode] = useState(initialCode);
  const [currentLanguage, setCurrentLanguage] = useState(language);
  const [currentTitle, setCurrentTitle] = useState(title);
  const [isEditing, setIsEditing] = useState(false);
  const [showNumbers, setShowNumbers] = useState(showLineNumbers);
  const [currentTheme, setCurrentTheme] = useState(theme);

  const languages = [
    { value: 'javascript', label: 'JavaScript', extension: '.js' },
    { value: 'typescript', label: 'TypeScript', extension: '.ts' },
    { value: 'python', label: 'Python', extension: '.py' },
    { value: 'java', label: 'Java', extension: '.java' },
    { value: 'csharp', label: 'C#', extension: '.cs' },
    { value: 'cpp', label: 'C++', extension: '.cpp' },
    { value: 'html', label: 'HTML', extension: '.html' },
    { value: 'css', label: 'CSS', extension: '.css' },
    { value: 'scss', label: 'SCSS', extension: '.scss' },
    { value: 'json', label: 'JSON', extension: '.json' },
    { value: 'xml', label: 'XML', extension: '.xml' },
    { value: 'sql', label: 'SQL', extension: '.sql' },
    { value: 'bash', label: 'Bash', extension: '.sh' },
    { value: 'yaml', label: 'YAML', extension: '.yml' },
    { value: 'markdown', label: 'Markdown', extension: '.md' },
    { value: 'php', label: 'PHP', extension: '.php' },
    { value: 'ruby', label: 'Ruby', extension: '.rb' },
    { value: 'go', label: 'Go', extension: '.go' },
    { value: 'rust', label: 'Rust', extension: '.rs' },
    { value: 'swift', label: 'Swift', extension: '.swift' }
  ];

  const themes = [
    { value: 'light', label: 'Светлая', bg: '#ffffff', text: '#000000', border: '#e0e0e0' },
    { value: 'dark', label: 'Темная', bg: '#1e1e1e', text: '#d4d4d4', border: '#333333' },
    { value: 'github', label: 'GitHub', bg: '#f6f8fa', text: '#24292e', border: '#d1d5da' },
    { value: 'monokai', label: 'Monokai', bg: '#272822', text: '#f8f8f2', border: '#49483e' },
    { value: 'solarized', label: 'Solarized', bg: '#fdf6e3', text: '#657b83', border: '#eee8d5' }
  ];

  const getLanguageIcon = (lang) => {
    const icons = {
      javascript: '🟨',
      typescript: '🔷',
      python: '🐍',
      java: '☕',
      csharp: '#️⃣',
      cpp: '⚡',
      html: '🌐',
      css: '🎨',
      scss: '💄',
      json: '📋',
      xml: '📄',
      sql: '🗃️',
      bash: '💻',
      yaml: '⚙️',
      markdown: '📝',
      php: '🐘',
      ruby: '💎',
      go: '🐹',
      rust: '🦀',
      swift: '🍎'
    };
    return icons[lang] || '📄';
  };

  const getThemeStyles = () => {
    const themeData = themes.find(t => t.value === currentTheme);
    return {
      backgroundColor: themeData.bg,
      color: themeData.text,
      border: `1px solid ${themeData.border}`
    };
  };

  const getKeywordHighlighting = (text, lang) => {
    const keywords = {
      javascript: ['function', 'const', 'let', 'var', 'if', 'else', 'for', 'while', 'return', 'class', 'import', 'export'],
      python: ['def', 'class', 'if', 'elif', 'else', 'for', 'while', 'import', 'from', 'return', 'try', 'except'],
      java: ['public', 'private', 'class', 'interface', 'static', 'void', 'int', 'String', 'boolean', 'if', 'else'],
      html: ['<!DOCTYPE>', '<html>', '<head>', '<body>', '<div>', '<span>', '<p>', '<a>', '<img>'],
      css: ['color', 'background', 'margin', 'padding', 'border', 'font-size', 'display', 'position']
    };

    const langKeywords = keywords[lang] || [];
    let highlightedText = text;

    langKeywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'g');
      highlightedText = highlightedText.replace(regex, `<span style="color: #0066cc; font-weight: bold;">${keyword}</span>`);
    });

    // Строки
    highlightedText = highlightedText.replace(
      /(["'])((?:(?!\1)[^\\]|\\.)*)(\1)/g,
      '<span style="color: #22863a;">$1$2$3</span>'
    );

    // Комментарии
    highlightedText = highlightedText.replace(
      /(\/\/.*$|\/\*[\s\S]*?\*\/|#.*$)/gm,
      '<span style="color: #6a737d; font-style: italic;">$1</span>'
    );

    return highlightedText;
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      // Можно добавить уведомление об успешном копировании
    } catch (err) {
      console.error('Ошибка копирования:', err);
    }
  };

  const handleSave = () => {
    setIsEditing(false);
    if (onUpdate) {
      onUpdate({
        code,
        language: currentLanguage,
        title: currentTitle,
        showLineNumbers: showNumbers,
        theme: currentTheme
      });
    }
  };

  const renderLineNumbers = () => {
    if (!showNumbers) return null;
    
    const lines = code.split('\n');
    return (
      <Box sx={{
        width: '40px',
        backgroundColor: currentTheme === 'dark' ? '#2d2d30' : '#f0f0f0',
        borderRight: '1px solid #ccc',
        padding: '12px 8px',
        fontFamily: 'monospace',
        fontSize: '14px',
        lineHeight: '20px',
        color: '#999',
        userSelect: 'none'
      }}>
        {lines.map((_, index) => (
          <div key={index}>{index + 1}</div>
        ))}
      </Box>
    );
  };

  return (
    <AnimationWrapper {...animationSettings}>
      <Paper sx={{ overflow: 'hidden', ...getThemeStyles() }}>
        {/* Режим конструктора */}
        {isConstructorMode && (
          <Box sx={{ p: 2, backgroundColor: '#f5f5f5', borderBottom: '1px solid #e0e0e0' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Настройки CodeBlock
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

        {/* Заголовок */}
        <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        p: 1,
        backgroundColor: currentTheme === 'dark' ? '#2d2d30' : '#f8f9fa',
        borderBottom: '1px solid #e0e0e0'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2">
            {getLanguageIcon(currentLanguage)}
          </Typography>
          <Chip 
            label={languages.find(l => l.value === currentLanguage)?.label || currentLanguage}
            size="small"
            variant="outlined"
          />
          {currentTitle && (
            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
              {currentTitle}
            </Typography>
          )}
        </Box>

        <Box sx={{ display: 'flex', gap: 0.5 }}>
          {copyable && (
            <Tooltip title="Копировать код">
              <IconButton size="small" onClick={handleCopy}>
                <ContentCopyIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          {editable && (
            <Tooltip title="Редактировать">
              <IconButton size="small" onClick={() => setIsEditing(true)}>
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title="Полный экран">
            <IconButton size="small">
              <FullscreenIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Редактор */}
      {isEditing ? (
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              label="Заголовок"
              value={currentTitle}
              onChange={(e) => setCurrentTitle(e.target.value)}
              size="small"
              sx={{ flex: 1 }}
            />
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Язык</InputLabel>
              <Select
                value={currentLanguage}
                label="Язык"
                onChange={(e) => setCurrentLanguage(e.target.value)}
              >
                {languages.map(lang => (
                  <MenuItem key={lang.value} value={lang.value}>
                    {getLanguageIcon(lang.value)} {lang.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 100 }}>
              <InputLabel>Тема</InputLabel>
              <Select
                value={currentTheme}
                label="Тема"
                onChange={(e) => setCurrentTheme(e.target.value)}
              >
                {themes.map(theme => (
                  <MenuItem key={theme.value} value={theme.value}>
                    {theme.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <FormControlLabel
            control={
              <Switch
                checked={showNumbers}
                onChange={(e) => setShowNumbers(e.target.checked)}
              />
            }
            label="Показывать номера строк"
            sx={{ mb: 2 }}
          />

          <TextField
            multiline
            fullWidth
            rows={10}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            label="Код"
            sx={{
              mb: 2,
              '& .MuiInputBase-input': {
                fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                fontSize: '14px',
                lineHeight: '20px'
              }
            }}
          />

          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
            <Button onClick={() => setIsEditing(false)}>
              Отмена
            </Button>
            <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSave}>
              Сохранить
            </Button>
          </Box>
        </Box>
      ) : (
        /* Просмотр кода */
        <Box sx={{ display: 'flex' }}>
          {renderLineNumbers()}
          <Box
            sx={{
              flex: 1,
              padding: '12px',
              fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
              fontSize: '14px',
              lineHeight: '20px',
              overflow: 'auto',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word'
            }}
            dangerouslySetInnerHTML={{
              __html: getKeywordHighlighting(code, currentLanguage)
            }}
          />
        </Box>
      )}

      {/* Статистика */}
      <Box sx={{
        p: 1,
        backgroundColor: currentTheme === 'dark' ? '#2d2d30' : '#f8f9fa',
        borderTop: '1px solid #e0e0e0',
        display: 'flex',
        justifyContent: 'space-between'
      }}>
        <Typography variant="caption" color="text.secondary">
          Строк: {code.split('\n').length} | Символов: {code.length}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {languages.find(l => l.value === currentLanguage)?.extension || ''}
        </Typography>
      </Box>
      </Paper>
    </AnimationWrapper>
  );
};

export default CodeBlock; 