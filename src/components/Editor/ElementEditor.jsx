import React, { useState } from 'react';
import {
  Box,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Slider,
  Paper,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
  IconButton,
  Tooltip,
  Button,
  Alert
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { RichTextEditor, Blockquote } from '../ContentLibrary';
import CardsGridManager from '../ContentLibrary/CardComponents/CardsGridManager';
import ColorSettings from '../ContentLibrary/TextComponents/ColorSettings';

const ElementEditor = ({ element, onElementChange, onElementDelete, onElementDuplicate, isSelected = false }) => {
  const [expanded, setExpanded] = useState(false);

  // Автоматически разворачиваем элемент если он выбран
  React.useEffect(() => {
    if (isSelected) {
      setExpanded(true);
    }
  }, [isSelected]);

  const handleChange = (field, value) => {
    onElementChange(element.id, field, value);
  };

  const getElementIcon = (type) => {
    const icons = {
      'gradient-text': '🌈',
      'animated-counter': '🔢',
      'typewriter-text': '⌨️',
      'highlight-text': '🔆',
      'markdown-editor': '📝',
      'code-editor': '💻',
      'testimonial-card': '💬',
      'faq-section': '❓',
      'timeline-component': '📅',
      'alert-component': '🚨'
    };
    return icons[type] || '📄';
  };

  const renderGradientTextEditor = () => (
    <Stack spacing={2}>
      <TextField
        fullWidth
        label="Текст"
        value={element.text || 'Градиентный текст'}
        onChange={(e) => handleChange('text', e.target.value)}
        multiline
        rows={2}
      />
      <FormControl fullWidth size="small">
        <InputLabel>Направление градиента</InputLabel>
        <Select
          value={element.direction || 'to right'}
          onChange={(e) => handleChange('direction', e.target.value)}
        >
          <MenuItem value="to right">Слева направо</MenuItem>
          <MenuItem value="to left">Справа налево</MenuItem>
          <MenuItem value="to bottom">Сверху вниз</MenuItem>
          <MenuItem value="to top">Снизу вверх</MenuItem>
          <MenuItem value="45deg">Диагональ 45°</MenuItem>
          <MenuItem value="135deg">Диагональ 135°</MenuItem>
        </Select>
      </FormControl>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <TextField
          label="Цвет 1"
          type="color"
          value={element.color1 || '#ff6b6b'}
          onChange={(e) => handleChange('color1', e.target.value)}
          sx={{ width: 120 }}
        />
        <TextField
          label="Цвет 2"
          type="color"
          value={element.color2 || '#4ecdc4'}
          onChange={(e) => handleChange('color2', e.target.value)}
          sx={{ width: 120 }}
        />
      </Box>
      <Box>
        <Typography gutterBottom>Размер шрифта: {element.fontSize || 24}px</Typography>
        <Slider
          value={element.fontSize || 24}
          onChange={(_, value) => handleChange('fontSize', value)}
          min={12}
          max={72}
          step={1}
        />
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Настройки цветов */}
      <ColorSettings
        title="Настройки цветов градиентного текста"
        colorSettings={element.colorSettings || {}}
        onUpdate={(newColorSettings) => handleChange('colorSettings', newColorSettings)}
        availableFields={[
          {
            name: 'title',
            label: 'Цвет заголовка',
            description: 'Цвет заголовка градиентного текста',
            defaultColor: '#333333'
          },
          {
            name: 'content',
            label: 'Цвет основного текста',
            description: 'Цвет основного текста градиентного текста',
            defaultColor: '#333333'
          },
          {
            name: 'border',
            label: 'Цвет границы и акцентов',
            description: 'Цвет рамки и акцентных элементов',
            defaultColor: '#1976d2'
          }
        ]}
        defaultColors={{
          textFields: {
            title: '#333333',
            content: '#333333',
            border: '#1976d2'
          }
        }}
      />
    </Stack>
  );

  const renderAnimatedCounterEditor = () => (
    <Stack spacing={2}>
      <TextField
        fullWidth
        label="Заголовок"
        value={element.title || 'Статистика'}
        onChange={(e) => handleChange('title', e.target.value)}
      />
      <TextField
        label="Целевое значение"
        type="number"
        value={element.endValue || 100}
        onChange={(e) => handleChange('endValue', parseInt(e.target.value))}
      />
      <TextField
        label="Начальное значение"
        type="number"
        value={element.startValue || 0}
        onChange={(e) => handleChange('startValue', parseInt(e.target.value))}
      />
      <TextField
        label="Суффикс"
        value={element.suffix || ''}
        onChange={(e) => handleChange('suffix', e.target.value)}
        placeholder="%, +, млн и т.д."
      />
      <TextField
        fullWidth
        label="Описание"
        value={element.description || ''}
        onChange={(e) => handleChange('description', e.target.value)}
        multiline
        rows={2}
      />
      <Box>
        <Typography gutterBottom>Длительность анимации: {element.duration || 2000}мс</Typography>
        <Slider
          value={element.duration || 2000}
          onChange={(_, value) => handleChange('duration', value)}
          min={500}
          max={10000}
          step={100}
        />
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Настройки цветов */}
      <ColorSettings
        title="Настройки цветов счетчика"
        colorSettings={element.colorSettings || {}}
        onUpdate={(newColorSettings) => handleChange('colorSettings', newColorSettings)}
        availableFields={[
          {
            name: 'title',
            label: 'Цвет заголовка',
            description: 'Цвет заголовка счетчика',
            defaultColor: '#333333'
          },
          {
            name: 'content',
            label: 'Цвет числа',
            description: 'Цвет анимированного числа',
            defaultColor: '#1976d2'
          },
          {
            name: 'author',
            label: 'Цвет описания',
            description: 'Цвет описания под счетчиком',
            defaultColor: '#666666'
          }
        ]}
        defaultColors={{
          textFields: {
            title: '#333333',
            content: '#1976d2',
            author: '#666666'
          }
        }}
      />
    </Stack>
  );

  const renderTypewriterTextEditor = () => (
    <Stack spacing={2}>
      <TextField
        fullWidth
        label="Тексты (один на строку)"
        value={element.texts ? element.texts.join('\n') : 'Привет, мир!\nДобро пожаловать\nНа наш сайт'}
        onChange={(e) => handleChange('texts', e.target.value.split('\n'))}
        multiline
        rows={4}
      />
      <Box>
        <Typography gutterBottom>Скорость печати: {element.speed || 150}мс</Typography>
        <Slider
          value={element.speed || 150}
          onChange={(_, value) => handleChange('speed', value)}
          min={50}
          max={500}
          step={10}
        />
      </Box>
      <Box>
        <Typography gutterBottom>Пауза между текстами: {element.pauseTime || 2000}мс</Typography>
        <Slider
          value={element.pauseTime || 2000}
          onChange={(_, value) => handleChange('pauseTime', value)}
          min={500}
          max={5000}
          step={100}
        />
      </Box>
      <Box>
        <Typography gutterBottom>Размер шрифта: {element.fontSize || 32}px</Typography>
        <Slider
          value={element.fontSize || 32}
          onChange={(_, value) => handleChange('fontSize', value)}
          min={12}
          max={72}
          step={1}
        />
      </Box>
      <FormControlLabel
        control={
          <Switch
            checked={element.repeat !== false}
            onChange={(e) => handleChange('repeat', e.target.checked)}
          />
        }
        label="Повторять циклично"
      />

      <Divider sx={{ my: 3 }} />

      {/* Настройки цветов */}
      <ColorSettings
        title="Настройки цветов печатной машинки"
        colorSettings={element.colorSettings || {}}
        onUpdate={(newColorSettings) => handleChange('colorSettings', newColorSettings)}
        availableFields={[
          {
            name: 'content',
            label: 'Цвет текста',
            description: 'Цвет анимированного текста',
            defaultColor: '#333333'
          }
        ]}
        defaultColors={{
          textFields: {
            content: '#333333'
          }
        }}
      />
    </Stack>
  );

  const renderHighlightTextEditor = () => (
    <Stack spacing={2}>
      <TextField
        fullWidth
        label="Текст"
        value={element.text || 'Это важный текст с выделением'}
        onChange={(e) => handleChange('text', e.target.value)}
        multiline
        rows={3}
      />
      <TextField
        label="Цвет выделения"
        type="color"
        value={element.highlightColor || '#ffeb3b'}
        onChange={(e) => handleChange('highlightColor', e.target.value)}
        sx={{ width: 120 }}
      />
      <TextField
        label="Цвет текста"
        type="color"
        value={element.textColor || '#333333'}
        onChange={(e) => handleChange('textColor', e.target.value)}
        sx={{ width: 120 }}
      />
      <Box>
        <Typography gutterBottom>Размер шрифта: {element.fontSize || 16}px</Typography>
        <Slider
          value={element.fontSize || 16}
          onChange={(_, value) => handleChange('fontSize', value)}
          min={12}
          max={48}
          step={1}
        />
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Настройки цветов */}
      <ColorSettings
        title="Настройки цветов выделенного текста"
        colorSettings={element.colorSettings || {}}
        onUpdate={(newColorSettings) => handleChange('colorSettings', newColorSettings)}
        availableFields={[
          {
            name: 'content',
            label: 'Цвет текста',
            description: 'Цвет основного текста',
            defaultColor: '#333333'
          },
          {
            name: 'marker',
            label: 'Цвет выделения',
            description: 'Цвет фона выделения',
            defaultColor: '#ffeb3b'
          }
        ]}
        defaultColors={{
          textFields: {
            content: '#333333',
            marker: '#ffeb3b'
          }
        }}
      />
    </Stack>
  );

  const renderMarkdownEditor = () => (
    <Stack spacing={2}>
      <TextField
        fullWidth
        label="Markdown контент"
        value={element.content || '# Заголовок\n\nЭто **жирный** текст с *курсивом*.\n\n- Элемент списка 1\n- Элемент списка 2\n\n> Это цитата'}
        onChange={(e) => handleChange('content', e.target.value)}
        multiline
        rows={6}
      />
      <FormControlLabel
        control={
          <Switch
            checked={element.showPreview !== false}
            onChange={(e) => handleChange('showPreview', e.target.checked)}
          />
        }
        label="Показывать предпросмотр"
      />
    </Stack>
  );

  const renderCodeEditor = () => (
    <Stack spacing={2}>
      <TextField
        fullWidth
        label="Код"
        value={element.code || 'function hello() {\n  console.log("Привет, мир!");\n}'}
        onChange={(e) => handleChange('code', e.target.value)}
        multiline
        rows={6}
      />
      <FormControl fullWidth size="small">
        <InputLabel>Язык программирования</InputLabel>
        <Select
          value={element.language || 'javascript'}
          onChange={(e) => handleChange('language', e.target.value)}
        >
          <MenuItem value="javascript">JavaScript</MenuItem>
          <MenuItem value="python">Python</MenuItem>
          <MenuItem value="html">HTML</MenuItem>
          <MenuItem value="css">CSS</MenuItem>
          <MenuItem value="json">JSON</MenuItem>
          <MenuItem value="markdown">Markdown</MenuItem>
          <MenuItem value="plaintext">Обычный текст</MenuItem>
        </Select>
      </FormControl>
    </Stack>
  );

  const renderTestimonialEditor = () => (
    <Stack spacing={3}>
      <Alert severity="info">
        <Typography variant="body2">
          💡 <strong>Совет:</strong> Дважды кликните на элемент отзыва в превью для полноценного редактирования с загрузкой изображений и цветовыми настройками
        </Typography>
      </Alert>
      
      <TextField
        fullWidth
        label="Имя клиента"
        value={element.name || 'Иван Иванов'}
        onChange={(e) => handleChange('name', e.target.value)}
      />
      <TextField
        fullWidth
        label="Должность"
        value={element.role || 'Генеральный директор'}
        onChange={(e) => handleChange('role', e.target.value)}
      />
      <TextField
        fullWidth
        label="Компания"
        value={element.company || 'ООО "Компания"'}
        onChange={(e) => handleChange('company', e.target.value)}
      />
      <TextField
        fullWidth
        label="Отзыв"
        value={element.content || 'Отличный сервис! Рекомендую всем.'}
        onChange={(e) => handleChange('content', e.target.value)}
        multiline
        rows={4}
      />
      <Box>
        <Typography gutterBottom>Рейтинг: {element.rating || 5} ⭐</Typography>
        <Slider
          value={element.rating || 5}
          onChange={(_, value) => handleChange('rating', value)}
          min={1}
          max={5}
          step={0.5}
          marks={[
            { value: 1, label: '1' },
            { value: 2, label: '2' },
            { value: 3, label: '3' },
            { value: 4, label: '4' },
            { value: 5, label: '5' }
          ]}
        />
      </Box>
      
      <Divider />
      
      {/* Настройки цветов */}
      <ColorSettings
        title="Настройки цветов отзыва"
        colorSettings={element.colorSettings || {}}
        onUpdate={(newColorSettings) => handleChange('colorSettings', newColorSettings)}
        availableFields={[
          {
            name: 'name',
            label: 'Имя клиента',
            description: 'Цвет имени клиента',
            defaultColor: '#1976d2'
          },
          {
            name: 'role',
            label: 'Должность',
            description: 'Цвет должности',
            defaultColor: '#666666'
          },
          {
            name: 'company',
            label: 'Компания',
            description: 'Цвет названия компании',
            defaultColor: '#888888'
          },
          {
            name: 'content',
            label: 'Текст отзыва',
            description: 'Цвет текста отзыва',
            defaultColor: '#333333'
          },
          {
            name: 'rating',
            label: 'Звезды рейтинга',
            description: 'Цвет звезд рейтинга',
            defaultColor: '#ffc107'
          }
        ]}
        defaultColors={{
          textFields: {
            name: '#1976d2',
            role: '#666666',
            company: '#888888',
            content: '#333333',
            rating: '#ffc107'
          }
        }}
      />
    </Stack>
  );

  const renderFaqEditor = () => (
    <Stack spacing={2}>
      <TextField
        fullWidth
        label="Заголовок секции"
        value={element.title || 'Часто задаваемые вопросы'}
        onChange={(e) => handleChange('title', e.target.value)}
      />
      <TextField
        fullWidth
        label="Вопросы и ответы (формат: Вопрос?|Ответ)"
        value={element.items ? element.items.map(item => `${item.question}|${item.answer}`).join('\n') : 'Как это работает?|Очень просто и эффективно.\nСколько это стоит?|Цены очень доступные.'}
        onChange={(e) => {
          const items = e.target.value.split('\n').map(line => {
            const [question, answer] = line.split('|');
            return { question: question || '', answer: answer || '' };
          });
          handleChange('items', items);
        }}
        multiline
        rows={6}
        helperText="Каждый вопрос и ответ на новой строке, разделенные знаком |"
      />
      
      <Alert severity="info">
        <Typography variant="body2">
          💡 <strong>Совет:</strong> Дважды кликните на элемент FAQ в превью для полноценного редактирования с настройками цветов и стилей
        </Typography>
      </Alert>
    </Stack>
  );

  const renderTimelineEditor = () => (
    <Stack spacing={2}>
      <TextField
        fullWidth
        label="Заголовок"
        value={element.title || 'Временная шкала'}
        onChange={(e) => handleChange('title', e.target.value)}
      />
      <TextField
        fullWidth
        label="События (формат: Дата|Название|Описание|Статус)"
        value={element.events ? element.events.map(event => `${event.date}|${event.title}|${event.description}|${event.status}`).join('\n') : '2024|Запуск проекта|Начало разработки|completed\n2024|Тестирование|Проверка функций|in-progress\n2024|Релиз|Публикация|pending'}
        onChange={(e) => {
          const events = e.target.value.split('\n').map(line => {
            const [date, title, description, status] = line.split('|');
            return { 
              date: date || '', 
              title: title || '', 
              description: description || '', 
              status: status || 'pending' 
            };
          });
          handleChange('events', events);
        }}
        multiline
        rows={6}
        helperText="Каждое событие на новой строке. Статус: completed, in-progress, pending"
      />
      
      <Alert severity="info">
        <Typography variant="body2">
          💡 <strong>Совет:</strong> Дважды кликните на элемент временной шкалы в превью для полноценного редактирования с настройками цветов и стилей
        </Typography>
      </Alert>
    </Stack>
  );

  const renderAlertEditor = () => (
    <Stack spacing={2}>
      <TextField
        fullWidth
        label="Заголовок"
        value={element.title || 'Внимание!'}
        onChange={(e) => handleChange('title', e.target.value)}
      />
      <TextField
        fullWidth
        label="Сообщение"
        value={element.message || 'Это важное уведомление'}
        onChange={(e) => handleChange('message', e.target.value)}
        multiline
        rows={3}
      />
      <FormControl fullWidth size="small">
        <InputLabel>Тип уведомления</InputLabel>
        <Select
          value={element.type || 'info'}
          onChange={(e) => handleChange('type', e.target.value)}
        >
          <MenuItem value="info">Информация</MenuItem>
          <MenuItem value="warning">Предупреждение</MenuItem>
          <MenuItem value="error">Ошибка</MenuItem>
          <MenuItem value="success">Успех</MenuItem>
        </Select>
      </FormControl>
    </Stack>
  );

  const renderImageGalleryEditor = () => (
    <Stack spacing={3}>
      <Alert severity="info">
        <Typography variant="body2">
          💡 <strong>Совет:</strong> Дважды кликните на элемент галереи в превью для полноценного редактирования с загрузкой изображений, настройками отображения и цветов
        </Typography>
      </Alert>
      
      <TextField
        fullWidth
        label="Название галереи"
        value={element.title || 'Галерея изображений'}
        onChange={(e) => handleChange('title', e.target.value)}
      />
      <TextField
        fullWidth
        label="Описание галереи"
        value={element.description || 'Просмотрите нашу коллекцию изображений'}
        onChange={(e) => handleChange('description', e.target.value)}
        multiline
        rows={2}
      />
      
      <Divider />
      <Typography variant="h6" color="primary">⚙️ Базовые настройки</Typography>
      
      <Box>
        <Typography variant="body2" gutterBottom>
          Высота галереи: {element.galleryHeight || 400}px
        </Typography>
        <Slider
          value={element.galleryHeight || 400}
          onChange={(_, value) => handleChange('galleryHeight', value)}
          min={200}
          max={800}
          step={50}
          marks={[
            { value: 200, label: 'Мини' },
            { value: 400, label: 'Средний' },
            { value: 600, label: 'Большой' },
            { value: 800, label: 'Макси' }
          ]}
        />
      </Box>

      <Box>
        <Typography variant="body2" gutterBottom>
          Размер миниатюр: {element.thumbnailSize || 80}px
        </Typography>
        <Slider
          value={element.thumbnailSize || 80}
          onChange={(_, value) => handleChange('thumbnailSize', value)}
          min={50}
          max={150}
          step={10}
          marks={[
            { value: 50, label: 'Мелкий' },
            { value: 80, label: 'Средний' },
            { value: 120, label: 'Крупный' }
          ]}
        />
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
        <FormControlLabel
          control={
            <Switch
              checked={element.showThumbnails !== false}
              onChange={(e) => handleChange('showThumbnails', e.target.checked)}
            />
          }
          label="Показывать миниатюры"
        />
        
        <FormControlLabel
          control={
            <Switch
              checked={element.showNavigation !== false}
              onChange={(e) => handleChange('showNavigation', e.target.checked)}
            />
          }
          label="Показывать навигацию"
        />
        
        <FormControlLabel
          control={
            <Switch
              checked={element.showPagination !== false}
              onChange={(e) => handleChange('showPagination', e.target.checked)}
            />
          }
          label="Показывать пагинацию"
        />
      </Box>
      
      <Divider />
      <Typography variant="h6" color="primary">🎨 Базовые цветовые настройки</Typography>
      
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 2 }}>
        <Box>
          <Typography variant="body2" gutterBottom>Цвет заголовка:</Typography>
          <TextField
            fullWidth
            type="color"
            value={element.titleColor || '#1976d2'}
            onChange={(e) => handleChange('titleColor', e.target.value)}
            size="small"
          />
        </Box>
        
        <Box>
          <Typography variant="body2" gutterBottom>Цвет описания:</Typography>
          <TextField
            fullWidth
            type="color"
            value={element.descriptionColor || '#666666'}
            onChange={(e) => handleChange('descriptionColor', e.target.value)}
            size="small"
          />
        </Box>
        
        <Box>
          <Typography variant="body2" gutterBottom>Цвет фона:</Typography>
          <TextField
            fullWidth
            type="color"
            value={element.backgroundColor || '#ffffff'}
            onChange={(e) => handleChange('backgroundColor', e.target.value)}
            size="small"
          />
        </Box>
        
        <Box>
          <Typography variant="body2" gutterBottom>Цвет рамки:</Typography>
          <TextField
            fullWidth
            type="color"
            value={element.borderColor || '#e0e0e0'}
            onChange={(e) => handleChange('borderColor', e.target.value)}
            size="small"
          />
        </Box>
      </Box>
    </Stack>
  );

  const renderTypographyEditor = () => (
    <Stack spacing={2}>
      <FormControl fullWidth size="small">
        <InputLabel>Тип заголовка</InputLabel>
        <Select
          value={element.headingType || 'h2'}
          onChange={(e) => handleChange('headingType', e.target.value)}
        >
          <MenuItem value="h1">H1 - Главный заголовок</MenuItem>
          <MenuItem value="h2">H2 - Заголовок секции</MenuItem>
          <MenuItem value="h3">H3 - Подзаголовок</MenuItem>
          <MenuItem value="h4">H4 - Мелкий заголовок</MenuItem>
          <MenuItem value="h5">H5 - Очень мелкий</MenuItem>
          <MenuItem value="h6">H6 - Минимальный</MenuItem>
          <MenuItem value="p">P - Параграф</MenuItem>
        </Select>
      </FormControl>
      <TextField
        fullWidth
        label="Текст"
        value={element.text || 'Заголовок или текст'}
        onChange={(e) => handleChange('text', e.target.value)}
        multiline
        rows={3}
      />
      <Box sx={{ display: 'flex', gap: 2 }}>
        <TextField
          label="Цвет текста"
          type="color"
          value={element.textColor || '#333333'}
          onChange={(e) => handleChange('textColor', e.target.value)}
          sx={{ width: 120 }}
        />
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Выравнивание</InputLabel>
          <Select
            value={element.textAlign || 'left'}
            onChange={(e) => handleChange('textAlign', e.target.value)}
          >
            <MenuItem value="left">Слева</MenuItem>
            <MenuItem value="center">По центру</MenuItem>
            <MenuItem value="right">Справа</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </Stack>
  );

  const renderBlockquoteEditor = () => (
    <Stack spacing={2}>
      <TextField
        fullWidth
        label="Цитата"
        value={element.quote || 'Важная цитата или высказывание'}
        onChange={(e) => handleChange('quote', e.target.value)}
        multiline
        rows={4}
        helperText="Основной текст цитаты"
      />
      <TextField
        fullWidth
        label="Автор"
        value={element.author || 'Автор цитаты'}
        onChange={(e) => handleChange('author', e.target.value)}
      />
      <TextField
        fullWidth
        label="Источник"
        value={element.source || ''}
        onChange={(e) => handleChange('source', e.target.value)}
        placeholder="Книга, компания, должность"
      />
      
      {/* Цвета */}
      <Typography variant="subtitle2" sx={{ mt: 2 }}>Цвета:</Typography>
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <TextField
          label="Цвет цитаты"
          type="color"
          value={element.quoteColor || '#555555'}
          onChange={(e) => handleChange('quoteColor', e.target.value)}
          sx={{ width: 120 }}
        />
        <TextField
          label="Цвет автора"
          type="color"
          value={element.authorColor || '#888888'}
          onChange={(e) => handleChange('authorColor', e.target.value)}
          sx={{ width: 120 }}
        />
        <TextField
          label="Цвет фона"
          type="color"
          value={element.backgroundColor || '#f8f9fa'}
          onChange={(e) => handleChange('backgroundColor', e.target.value)}
          sx={{ width: 120 }}
        />
        <TextField
          label="Цвет рамки"
          type="color"
          value={element.borderColor || '#1976d2'}
          onChange={(e) => handleChange('borderColor', e.target.value)}
          sx={{ width: 120 }}
        />
      </Box>
      
      {/* Шрифт */}
      <Typography variant="subtitle2" sx={{ mt: 2 }}>Шрифт:</Typography>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <FormControl fullWidth size="small">
          <InputLabel>Семейство шрифтов</InputLabel>
          <Select
            value={element.fontFamily || 'inherit'}
            onChange={(e) => handleChange('fontFamily', e.target.value)}
          >
            <MenuItem value="inherit">По умолчанию</MenuItem>
            <MenuItem value="Arial, sans-serif">Arial</MenuItem>
            <MenuItem value="Georgia, serif">Georgia</MenuItem>
            <MenuItem value="Times New Roman, serif">Times New Roman</MenuItem>
            <MenuItem value="Helvetica, sans-serif">Helvetica</MenuItem>
            <MenuItem value="Verdana, sans-serif">Verdana</MenuItem>
            <MenuItem value="Trebuchet MS, sans-serif">Trebuchet MS</MenuItem>
            <MenuItem value="Palatino, serif">Palatino</MenuItem>
            <MenuItem value="Courier New, monospace">Courier New</MenuItem>
            <MenuItem value="Comic Sans MS, cursive">Comic Sans MS</MenuItem>
            <MenuItem value="Impact, sans-serif">Impact</MenuItem>
            <MenuItem value="Roboto, sans-serif">Roboto</MenuItem>
            <MenuItem value="Open Sans, sans-serif">Open Sans</MenuItem>
            <MenuItem value="Lato, sans-serif">Lato</MenuItem>
            <MenuItem value="Montserrat, sans-serif">Montserrat</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth size="small">
          <InputLabel>Начертание</InputLabel>
          <Select
            value={element.fontWeight || 'normal'}
            onChange={(e) => handleChange('fontWeight', e.target.value)}
          >
            <MenuItem value="normal">Обычный</MenuItem>
            <MenuItem value="bold">Жирный</MenuItem>
            <MenuItem value="lighter">Тонкий</MenuItem>
            <MenuItem value="100">100 - Тончайший</MenuItem>
            <MenuItem value="200">200 - Очень тонкий</MenuItem>
            <MenuItem value="300">300 - Тонкий</MenuItem>
            <MenuItem value="400">400 - Нормальный</MenuItem>
            <MenuItem value="500">500 - Средний</MenuItem>
            <MenuItem value="600">600 - Полужирный</MenuItem>
            <MenuItem value="700">700 - Жирный</MenuItem>
            <MenuItem value="800">800 - Очень жирный</MenuItem>
            <MenuItem value="900">900 - Сверхжирный</MenuItem>
          </Select>
        </FormControl>
      </Box>
      
      {/* Размеры */}
      <Typography variant="subtitle2" sx={{ mt: 2 }}>Размеры:</Typography>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Box sx={{ flexGrow: 1 }}>
          <Typography gutterBottom>Размер текста цитаты: {element.quoteFontSize || 18}px</Typography>
          <Slider
            value={element.quoteFontSize || 18}
            onChange={(_, value) => handleChange('quoteFontSize', value)}
            min={12}
            max={36}
            step={1}
            marks={[
              { value: 12, label: '12px' },
              { value: 18, label: '18px' },
              { value: 24, label: '24px' },
              { value: 36, label: '36px' }
            ]}
          />
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          <Typography gutterBottom>Размер текста автора: {element.authorFontSize || 14}px</Typography>
          <Slider
            value={element.authorFontSize || 14}
            onChange={(_, value) => handleChange('authorFontSize', value)}
            min={10}
            max={24}
            step={1}
            marks={[
              { value: 10, label: '10px' },
              { value: 14, label: '14px' },
              { value: 18, label: '18px' },
              { value: 24, label: '24px' }
            ]}
          />
        </Box>
      </Box>
      
      {/* Отступы */}
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Box sx={{ flexGrow: 1 }}>
          <Typography gutterBottom>Внутренние отступы: {element.padding || 24}px</Typography>
          <Slider
            value={element.padding || 24}
            onChange={(_, value) => handleChange('padding', value)}
            min={8}
            max={48}
            step={4}
            marks={[
              { value: 8, label: '8px' },
              { value: 24, label: '24px' },
              { value: 48, label: '48px' }
            ]}
          />
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          <Typography gutterBottom>Толщина рамки: {element.borderWidth || 4}px</Typography>
          <Slider
            value={element.borderWidth || 4}
            onChange={(_, value) => handleChange('borderWidth', value)}
            min={0}
            max={8}
            step={1}
            marks={[
              { value: 0, label: '0px' },
              { value: 4, label: '4px' },
              { value: 8, label: '8px' }
            ]}
          />
        </Box>
      </Box>
      
      {/* Стиль */}
      <Typography variant="subtitle2" sx={{ mt: 2 }}>Стиль:</Typography>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <FormControl fullWidth size="small">
          <InputLabel>Выравнивание</InputLabel>
          <Select
            value={element.textAlign || 'left'}
            onChange={(e) => handleChange('textAlign', e.target.value)}
          >
            <MenuItem value="left">По левому краю</MenuItem>
            <MenuItem value="center">По центру</MenuItem>
            <MenuItem value="right">По правому краю</MenuItem>
            <MenuItem value="justify">По ширине</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth size="small">
          <InputLabel>Положение рамки</InputLabel>
          <Select
            value={element.borderPosition || 'left'}
            onChange={(e) => handleChange('borderPosition', e.target.value)}
          >
            <MenuItem value="left">Слева</MenuItem>
            <MenuItem value="right">Справа</MenuItem>
            <MenuItem value="top">Сверху</MenuItem>
            <MenuItem value="bottom">Снизу</MenuItem>
            <MenuItem value="around">Вокруг</MenuItem>
          </Select>
        </FormControl>
      </Box>
      
      {/* Дополнительные настройки */}
      <Box sx={{ display: 'flex', gap: 2 }}>
        <FormControlLabel
          control={
            <Switch
              checked={element.showAuthor !== false}
              onChange={(e) => handleChange('showAuthor', e.target.checked)}
            />
          }
          label="Показывать автора"
        />
        <FormControlLabel
          control={
            <Switch
              checked={element.showSource !== false}
              onChange={(e) => handleChange('showSource', e.target.checked)}
            />
          }
          label="Показывать источник"
        />
        <FormControlLabel
          control={
            <Switch
              checked={element.italic !== false}
              onChange={(e) => handleChange('italic', e.target.checked)}
            />
          }
          label="Курсив"
        />
      </Box>
      
      {/* Предварительный просмотр */}
      <Box sx={{ mt: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 1, backgroundColor: '#f9f9f9' }}>
        <Typography variant="subtitle2" gutterBottom>
          Предварительный просмотр:
        </Typography>
        <Blockquote
          quote={element.quote || 'Важная цитата или высказывание'}
          author={element.author || 'Автор цитаты'}
          source={element.source || ''}
          showAuthor={element.showAuthor !== false}
          showSource={element.showSource !== false}
          quoteColor={element.quoteColor || '#555555'}
          authorColor={element.authorColor || '#888888'}
          backgroundColor={element.backgroundColor || '#f8f9fa'}
          borderColor={element.borderColor || '#1976d2'}
          fontFamily={element.fontFamily || 'inherit'}
          fontWeight={element.fontWeight || 'normal'}
          quoteFontSize={element.quoteFontSize || 18}
          authorFontSize={element.authorFontSize || 14}
          padding={element.padding || 24}
          borderWidth={element.borderWidth || 4}
          textAlign={element.textAlign || 'left'}
          borderPosition={element.borderPosition || 'left'}
          italic={element.italic !== false}
          isPreview={true}
        />
      </Box>
    </Stack>
  );

  const renderListEditor = () => (
    <Stack spacing={2}>
      <FormControl fullWidth size="small">
        <InputLabel>Тип списка</InputLabel>
        <Select
          value={element.listType || 'ul'}
          onChange={(e) => handleChange('listType', e.target.value)}
        >
          <MenuItem value="ul">Маркированный</MenuItem>
          <MenuItem value="ol">Нумерованный</MenuItem>
        </Select>
      </FormControl>
      <TextField
        fullWidth
        label="Элементы списка (один на строку)"
        value={element.items ? element.items.join('\n') : 'Первый элемент\nВторой элемент\nТретий элемент'}
        onChange={(e) => handleChange('items', e.target.value.split('\n'))}
        multiline
        rows={6}
      />
      <TextField
        label="Цвет текста"
        type="color"
        value={element.textColor || '#333333'}
        onChange={(e) => handleChange('textColor', e.target.value)}
        sx={{ width: 120 }}
      />
    </Stack>
  );

  const renderBasicCardEditor = () => (
    <Stack spacing={2}>
      <TextField
        fullWidth
        label="Заголовок карточки"
        value={element.title || 'Заголовок карточки'}
        onChange={(e) => handleChange('title', e.target.value)}
      />
      <TextField
        fullWidth
        label="Содержание"
        value={element.content || 'Содержание карточки'}
        onChange={(e) => handleChange('content', e.target.value)}
        multiline
        rows={4}
      />
      
      <Alert severity="info">
        <Typography variant="body2">
          💡 <strong>Совет:</strong> Дважды кликните на элемент карточки в превью для полноценного редактирования с настройками цветов и стилей
        </Typography>
      </Alert>
    </Stack>
  );

  const renderImageCardEditor = () => (
    <Stack spacing={2}>
      <TextField
        fullWidth
        label="Заголовок карточки"
        value={element.title || 'Заголовок карточки'}
        onChange={(e) => handleChange('title', e.target.value)}
      />
      <TextField
        fullWidth
        label="Содержание"
        value={element.content || 'Описание изображения'}
        onChange={(e) => handleChange('content', e.target.value)}
        multiline
        rows={3}
      />
      <TextField
        fullWidth
        label="URL изображения"
        value={element.imageUrl || ''}
        onChange={(e) => handleChange('imageUrl', e.target.value)}
        placeholder="https://example.com/image.jpg"
      />
      <TextField
        fullWidth
        label="Alt текст для изображения"
        value={element.imageAlt || ''}
        onChange={(e) => handleChange('imageAlt', e.target.value)}
        placeholder="Описание изображения"
      />
      
      <Alert severity="info">
        <Typography variant="body2">
          💡 <strong>Совет:</strong> Дважды кликните на элемент карточки с изображением в превью для полноценного редактирования с настройками цветов и стилей
        </Typography>
      </Alert>
    </Stack>
  );

  const renderCardsGridEditor = () => (
    <Stack spacing={2}>
      <TextField
        fullWidth
        label="Заголовок секции"
        value={element.title || 'Сетка карточек'}
        onChange={(e) => handleChange('title', e.target.value)}
      />
      <TextField
        fullWidth
        label="Описание"
        value={element.description || 'Управление множественными карточками в сетке'}
        onChange={(e) => handleChange('description', e.target.value)}
        multiline
        rows={2}
      />
      
      <FormControl fullWidth size="small">
        <InputLabel>Тип карточек</InputLabel>
        <Select
          value={element.cardType || 'image-card'}
          onChange={(e) => handleChange('cardType', e.target.value)}
        >
          <MenuItem value="image-card">Карточки с изображениями</MenuItem>
          <MenuItem value="basic-card">Базовые карточки</MenuItem>
        </Select>
      </FormControl>
      
      <FormControl fullWidth size="small">
        <InputLabel>Размер сетки по умолчанию</InputLabel>
        <Select
          value={element.gridSize || 'medium'}
          onChange={(e) => handleChange('gridSize', e.target.value)}
        >
          <MenuItem value="xs">Очень маленькая (1/6)</MenuItem>
          <MenuItem value="small">Маленькая (1/4)</MenuItem>
          <MenuItem value="medium">Средняя (1/3)</MenuItem>
          <MenuItem value="large">Большая (1/2)</MenuItem>
          <MenuItem value="xl">Очень большая (2/3)</MenuItem>
          <MenuItem value="full">Полная ширина (1/1)</MenuItem>
        </Select>
      </FormControl>
      
      <Divider />
      
      <Typography variant="subtitle2" gutterBottom>
        Управление карточками:
      </Typography>
      
      <CardsGridManager
        cards={element.cards || []}
        onCardsChange={(cards) => handleChange('cards', cards)}
        cardType={element.cardType || 'image-card'}
        gridSize={element.gridSize || 'medium'}
        onGridSizeChange={(gridSize) => handleChange('gridSize', gridSize)}
        editable={true}
      />
    </Stack>
  );

  const renderVideoPlayerEditor = () => (
    <Stack spacing={2}>
      <TextField
        fullWidth
        label="URL видео"
        value={element.videoUrl || ''}
        onChange={(e) => handleChange('videoUrl', e.target.value)}
        placeholder="https://www.youtube.com/watch?v=... или https://vimeo.com/..."
      />
      <TextField
        fullWidth
        label="Заголовок видео"
        value={element.title || 'Видео'}
        onChange={(e) => handleChange('title', e.target.value)}
      />
      <Box>
        <Typography gutterBottom>Ширина: {element.width || 560}px</Typography>
        <Slider
          value={element.width || 560}
          onChange={(_, value) => handleChange('width', value)}
          min={300}
          max={800}
          step={10}
        />
      </Box>
      <Box>
        <Typography gutterBottom>Высота: {element.height || 315}px</Typography>
        <Slider
          value={element.height || 315}
          onChange={(_, value) => handleChange('height', value)}
          min={200}
          max={500}
          step={5}
        />
      </Box>
    </Stack>
  );

  const renderQrCodeEditor = () => (
    <Stack spacing={2}>
      <TextField
        fullWidth
        label="Текст или URL для QR кода"
        value={element.qrText || 'https://example.com'}
        onChange={(e) => handleChange('qrText', e.target.value)}
      />
      <TextField
        fullWidth
        label="Заголовок"
        value={element.title || 'Сканируйте QR код'}
        onChange={(e) => handleChange('title', e.target.value)}
      />
      <Box>
        <Typography gutterBottom>Размер: {element.size || 200}px</Typography>
        <Slider
          value={element.size || 200}
          onChange={(_, value) => handleChange('size', value)}
          min={100}
          max={400}
          step={10}
        />
      </Box>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <TextField
          label="Цвет QR кода"
          type="color"
          value={element.foregroundColor || '#000000'}
          onChange={(e) => handleChange('foregroundColor', e.target.value)}
          sx={{ width: 120 }}
        />
        <TextField
          label="Цвет фона"
          type="color"
          value={element.backgroundColor || '#ffffff'}
          onChange={(e) => handleChange('backgroundColor', e.target.value)}
          sx={{ width: 120 }}
        />
      </Box>
    </Stack>
  );

  const renderRatingEditor = () => (
    <Stack spacing={2}>
      <TextField
        fullWidth
        label="Заголовок"
        value={element.title || 'Рейтинг'}
        onChange={(e) => handleChange('title', e.target.value)}
      />
      <Box>
        <Typography gutterBottom>Рейтинг: {element.rating || 5}</Typography>
        <Slider
          value={element.rating || 5}
          onChange={(_, value) => handleChange('rating', value)}
          min={0}
          max={5}
          step={0.1}
        />
      </Box>
      <Box>
        <Typography gutterBottom>Максимальный рейтинг: {element.maxRating || 5}</Typography>
        <Slider
          value={element.maxRating || 5}
          onChange={(_, value) => handleChange('maxRating', value)}
          min={5}
          max={10}
          step={1}
        />
      </Box>
      <FormControlLabel
        control={
          <Switch
            checked={element.readOnly !== false}
            onChange={(e) => handleChange('readOnly', e.target.checked)}
          />
        }
        label="Только для чтения"
      />
      <TextField
        label="Цвет звезд"
        type="color"
        value={element.starColor || '#ffc107'}
        onChange={(e) => handleChange('starColor', e.target.value)}
        sx={{ width: 120 }}
      />
    </Stack>
  );

  const renderProgressBarEditor = () => (
    <Stack spacing={2}>
      <TextField
        fullWidth
        label="Заголовок"
        value={element.title || 'Прогресс'}
        onChange={(e) => handleChange('title', e.target.value)}
      />
      <Box>
        <Typography gutterBottom>Значение: {element.value || 50}%</Typography>
        <Slider
          value={element.value || 50}
          onChange={(_, value) => handleChange('value', value)}
          min={0}
          max={100}
          step={1}
        />
      </Box>
      <FormControl fullWidth size="small">
        <InputLabel>Тип индикатора</InputLabel>
        <Select
          value={element.variant || 'linear'}
          onChange={(e) => handleChange('variant', e.target.value)}
        >
          <MenuItem value="linear">Линейный</MenuItem>
          <MenuItem value="circular">Круговой</MenuItem>
        </Select>
      </FormControl>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <TextField
          label="Цвет прогресса"
          type="color"
          value={element.progressColor || '#1976d2'}
          onChange={(e) => handleChange('progressColor', e.target.value)}
          sx={{ width: 120 }}
        />
        <TextField
          label="Цвет фона"
          type="color"
          value={element.backgroundColor || '#e0e0e0'}
          onChange={(e) => handleChange('backgroundColor', e.target.value)}
          sx={{ width: 120 }}
        />
      </Box>
    </Stack>
  );

  const renderRichTextEditor = () => (
    <Stack spacing={2}>
      <TextField
        fullWidth
        label="Заголовок"
        value={element.title || 'Богатый текст'}
        onChange={(e) => handleChange('title', e.target.value)}
      />
      <TextField
        fullWidth
        label="Содержание (Markdown)"
        value={element.content || 'Текст с **жирным**, *курсивом*, ***жирным курсивом***\n\nВторой абзац с [ссылкой](https://example.com)\n\n## Заголовок\n\n* Первый пункт списка\n* Второй пункт списка\n\n`код` встроенный в текст'}
        onChange={(e) => handleChange('content', e.target.value)}
        multiline
        rows={8}
        placeholder="Используйте Markdown разметку:
**жирный**, *курсив*, [ссылка](url)
# Заголовок 1, ## Заголовок 2
* список, `код`"
        helperText="Поддерживается: заголовки (# ## ###), жирный (**текст**), курсив (*текст*), ссылки [текст](url), код (`код`), списки (* пункт)"
      />
      
      {/* Добавляем контролы для цветов */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
          fullWidth
          type="color"
          label="Цвет фона"
          value={element.backgroundColor || '#ffffff'}
          onChange={(e) => handleChange('backgroundColor', e.target.value)}
          sx={{ '& input': { height: 40 } }}
        />
        <TextField
          fullWidth
          type="color"
          label="Цвет текста"
          value={element.textColor || '#000000'}
          onChange={(e) => handleChange('textColor', e.target.value)}
          sx={{ '& input': { height: 40 } }}
        />
      </Box>

      {/* Настройки отображения */}
      <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
        📝 Настройки отображения
      </Typography>
      <FormControlLabel
        control={
          <Switch
            checked={element.showTitle !== false}
            onChange={(e) => handleChange('showTitle', e.target.checked)}
          />
        }
        label="Показывать заголовок"
      />
      
      {/* Цвета */}
      <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
        🎨 Цвета
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <TextField
          label="Цвет заголовка"
          type="color"
          value={element.titleColor || '#1976d2'}
          onChange={(e) => handleChange('titleColor', e.target.value)}
          sx={{ width: 120 }}
        />
        <TextField
          label="Цвет текста"
          type="color"
          value={element.textColor || '#333333'}
          onChange={(e) => handleChange('textColor', e.target.value)}
          sx={{ width: 120 }}
        />
        <TextField
          label="Цвет фона"
          type="color"
          value={element.backgroundColor || 'rgba(0, 0, 0, 0.8)'}
          onChange={(e) => handleChange('backgroundColor', e.target.value)}
          sx={{ width: 120 }}
        />
      </Box>
      
      {/* Размеры и отступы */}
      <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
        📏 Размеры и отступы
      </Typography>
      <Box>
        <Typography gutterBottom>Отступы: {element.padding || 30}px</Typography>
        <Slider
          value={element.padding || 30}
          onChange={(_, value) => handleChange('padding', value)}
          min={0}
          max={100}
          step={5}
        />
      </Box>
      <Box>
        <Typography gutterBottom>Скругление углов: {element.borderRadius || 12}px</Typography>
        <Slider
          value={element.borderRadius || 12}
          onChange={(_, value) => handleChange('borderRadius', value)}
          min={0}
          max={50}
          step={1}
        />
      </Box>
      
      {/* Анимации */}
      <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
        🎭 Анимации
      </Typography>
      <FormControl fullWidth size="small">
        <InputLabel>Тип анимации</InputLabel>
        <Select
          value={element.animationSettings?.animationType || 'fadeIn'}
          onChange={(e) => handleChange('animationSettings', { 
            ...element.animationSettings, 
            animationType: e.target.value 
          })}
        >
          <MenuItem value="fadeIn">Плавное появление</MenuItem>
          <MenuItem value="fadeInUp">Появление снизу</MenuItem>
          <MenuItem value="fadeInDown">Появление сверху</MenuItem>
          <MenuItem value="fadeInLeft">Появление слева</MenuItem>
          <MenuItem value="fadeInRight">Появление справа</MenuItem>
          <MenuItem value="slideInUp">Выезд снизу</MenuItem>
          <MenuItem value="slideInDown">Выезд сверху</MenuItem>
          <MenuItem value="zoomIn">Увеличение</MenuItem>
          <MenuItem value="bounceIn">Отскок</MenuItem>
          <MenuItem value="pulse">Пульсация</MenuItem>
        </Select>
      </FormControl>
      
      <Box>
        <Typography gutterBottom>Задержка анимации: {element.animationSettings?.delay || 0}мс</Typography>
        <Slider
          value={element.animationSettings?.delay || 0}
          onChange={(_, value) => handleChange('animationSettings', { 
            ...element.animationSettings, 
            delay: value 
          })}
          min={0}
          max={2000}
          step={100}
        />
      </Box>
      
      <FormControlLabel
        control={
          <Switch
            checked={element.animationSettings?.triggerOnView !== false}
            onChange={(e) => handleChange('animationSettings', { 
              ...element.animationSettings, 
              triggerOnView: e.target.checked 
            })}
          />
        }
        label="Запускать при появлении на экране"
      />
      
      <FormControlLabel
        control={
          <Switch
            checked={element.animationSettings?.triggerOnce !== false}
            onChange={(e) => handleChange('animationSettings', { 
              ...element.animationSettings, 
              triggerOnce: e.target.checked 
            })}
          />
        }
        label="Запускать только один раз"
      />
      
      {/* Предварительный просмотр */}
      <Box sx={{ mt: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 1, backgroundColor: '#f9f9f9' }}>
        <Typography variant="subtitle2" gutterBottom>
          Предварительный просмотр:
        </Typography>
        <RichTextEditor
          title={element.title || 'Богатый текст'}
          content={element.content || 'Текст с **жирным**, *курсивом*'}
          showTitle={element.showTitle !== false}
          titleColor={element.titleColor || '#1976d2'}
          textColor={element.textColor || '#333333'}
          backgroundColor={element.backgroundColor || 'rgba(0, 0, 0, 0.8)'}
          padding={element.padding || 30}
          borderRadius={element.borderRadius || 12}
          isPreview={true}
        />
      </Box>
    </Stack>
  );

  const renderCodeBlockEditor = () => (
    <Stack spacing={2}>
      <TextField
        fullWidth
        label="Заголовок"
        value={element.title || 'Блок кода'}
        onChange={(e) => handleChange('title', e.target.value)}
      />
      <FormControl fullWidth size="small">
        <InputLabel>Язык программирования</InputLabel>
        <Select
          value={element.language || 'javascript'}
          onChange={(e) => handleChange('language', e.target.value)}
        >
          <MenuItem value="javascript">JavaScript</MenuItem>
          <MenuItem value="python">Python</MenuItem>
          <MenuItem value="html">HTML</MenuItem>
          <MenuItem value="css">CSS</MenuItem>
          <MenuItem value="sql">SQL</MenuItem>
          <MenuItem value="json">JSON</MenuItem>
          <MenuItem value="yaml">YAML</MenuItem>
          <MenuItem value="bash">Bash</MenuItem>
          <MenuItem value="php">PHP</MenuItem>
          <MenuItem value="java">Java</MenuItem>
          <MenuItem value="cpp">C++</MenuItem>
          <MenuItem value="csharp">C#</MenuItem>
        </Select>
      </FormControl>
      <TextField
        fullWidth
        label="Код"
        value={element.code || 'function hello() {\n  console.log("Hello, World!");\n}'}
        onChange={(e) => handleChange('code', e.target.value)}
        multiline
        rows={6}
        sx={{ fontFamily: 'monospace' }}
      />
      <FormControlLabel
        control={
          <Switch
            checked={element.showLineNumbers !== false}
            onChange={(e) => handleChange('showLineNumbers', e.target.checked)}
          />
        }
        label="Показывать номера строк"
      />
      <FormControlLabel
        control={
          <Switch
            checked={element.showTitle !== false}
            onChange={(e) => handleChange('showTitle', e.target.checked)}
          />
        }
        label="Показывать заголовок"
      />
    </Stack>
  );

  const renderCalloutEditor = () => (
    <Stack spacing={2}>
      <TextField
        fullWidth
        label="Заголовок"
        value={element.title || 'Важная информация'}
        onChange={(e) => handleChange('title', e.target.value)}
      />
      <TextField
        fullWidth
        label="Содержание"
        value={element.content || 'Это важная информация, которую пользователи должны заметить.'}
        onChange={(e) => handleChange('content', e.target.value)}
        multiline
        rows={4}
      />
      <FormControl fullWidth size="small">
        <InputLabel>Тип блока</InputLabel>
        <Select
          value={element.calloutType || 'info'}
          onChange={(e) => handleChange('calloutType', e.target.value)}
        >
          <MenuItem value="info">Информация</MenuItem>
          <MenuItem value="warning">Предупреждение</MenuItem>
          <MenuItem value="error">Ошибка</MenuItem>
          <MenuItem value="success">Успех</MenuItem>
          <MenuItem value="note">Заметка</MenuItem>
          <MenuItem value="tip">Совет</MenuItem>
        </Select>
      </FormControl>
      <FormControlLabel
        control={
          <Switch
            checked={element.showIcon !== false}
            onChange={(e) => handleChange('showIcon', e.target.checked)}
          />
        }
        label="Показывать иконку"
      />
      <Box sx={{ display: 'flex', gap: 2 }}>
        <TextField
          label="Цвет заголовка"
          type="color"
          value={element.titleColor || '#1976d2'}
          onChange={(e) => handleChange('titleColor', e.target.value)}
          sx={{ width: 120 }}
        />
        <TextField
          label="Цвет содержания"
          type="color"
          value={element.contentColor || '#333333'}
          onChange={(e) => handleChange('contentColor', e.target.value)}
          sx={{ width: 120 }}
        />
      </Box>
    </Stack>
  );

  const renderAccordionEditor = () => {
    const accordionItems = element.accordionItems || [
      { title: 'Первый элемент', content: 'Содержание первого элемента' },
      { title: 'Второй элемент', content: 'Содержание второго элемента' }
    ];
    
    return (
      <Stack spacing={2}>
        <TextField
          fullWidth
          label="Заголовок аккордеона"
          value={element.title || 'Аккордеон'}
          onChange={(e) => handleChange('title', e.target.value)}
        />
        <Typography variant="subtitle2">Элементы аккордеона:</Typography>
        {accordionItems.map((item, index) => (
          <Box key={index} sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
            <TextField
              fullWidth
              label={`Заголовок ${index + 1}`}
              value={item.title}
              onChange={(e) => {
                const newItems = [...accordionItems];
                newItems[index].title = e.target.value;
                handleChange('accordionItems', newItems);
              }}
              size="small"
              sx={{ mb: 1 }}
            />
            <TextField
              fullWidth
              label={`Содержание ${index + 1}`}
              value={item.content}
              onChange={(e) => {
                const newItems = [...accordionItems];
                newItems[index].content = e.target.value;
                handleChange('accordionItems', newItems);
              }}
              multiline
              rows={3}
              size="small"
            />
          </Box>
        ))}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => {
              const newItems = [...accordionItems, { title: 'Новый элемент', content: 'Содержание нового элемента' }];
              handleChange('accordionItems', newItems);
            }}
          >
            Добавить элемент
          </Button>
          {accordionItems.length > 1 && (
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={() => {
                const newItems = accordionItems.slice(0, -1);
                handleChange('accordionItems', newItems);
              }}
            >
              Удалить последний
            </Button>
          )}
        </Box>
      </Stack>
    );
  };



  const renderConfettiEditor = () => (
    <Stack spacing={2}>
      <TextField
        fullWidth
        label="Заголовок"
        value={element.title || 'Празднование!'}
        onChange={(e) => handleChange('title', e.target.value)}
      />
      <TextField
        fullWidth
        label="Текст кнопки"
        value={element.buttonText || 'Запустить конфетти'}
        onChange={(e) => handleChange('buttonText', e.target.value)}
      />
      <Box>
        <Typography gutterBottom>Интенсивность: {element.intensity || 100}</Typography>
        <Slider
          value={element.intensity || 100}
          onChange={(_, value) => handleChange('intensity', value)}
          min={10}
          max={500}
          step={10}
        />
      </Box>
      <Box>
        <Typography gutterBottom>Длительность: {element.duration || 3000}мс</Typography>
        <Slider
          value={element.duration || 3000}
          onChange={(_, value) => handleChange('duration', value)}
          min={1000}
          max={10000}
          step={500}
        />
      </Box>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <TextField
          label="Цвет кнопки"
          type="color"
          value={element.buttonColor || '#4caf50'}
          onChange={(e) => handleChange('buttonColor', e.target.value)}
          sx={{ width: 120 }}
        />
        <TextField
          label="Цвет текста"
          type="color"
          value={element.textColor || '#ffffff'}
          onChange={(e) => handleChange('textColor', e.target.value)}
          sx={{ width: 120 }}
        />
      </Box>
    </Stack>
  );



  const renderAnimatedBoxEditor = () => (
    <Stack spacing={2}>
      <TextField
        fullWidth
        label="Заголовок"
        value={element.title || 'Анимированный блок'}
        onChange={(e) => handleChange('title', e.target.value)}
      />
      <TextField
        fullWidth
        label="Содержание"
        value={element.content || 'Этот блок имеет красивую анимацию'}
        onChange={(e) => handleChange('content', e.target.value)}
        multiline
        rows={3}
      />
      <FormControl fullWidth size="small">
        <InputLabel>Тип анимации</InputLabel>
        <Select
          value={element.animationType || 'fadeIn'}
          onChange={(e) => handleChange('animationType', e.target.value)}
        >
          <MenuItem value="fadeIn">Плавное появление</MenuItem>
          <MenuItem value="slideUp">Выезд снизу</MenuItem>
          <MenuItem value="slideLeft">Выезд слева</MenuItem>
          <MenuItem value="slideRight">Выезд справа</MenuItem>
          <MenuItem value="zoomIn">Увеличение</MenuItem>
          <MenuItem value="bounce">Подпрыгивание</MenuItem>
          <MenuItem value="pulse">Пульсация</MenuItem>
          <MenuItem value="shake">Тряска</MenuItem>
        </Select>
      </FormControl>
      <Box>
        <Typography gutterBottom>Длительность: {element.duration || 1000}мс</Typography>
        <Slider
          value={element.duration || 1000}
          onChange={(_, value) => handleChange('duration', value)}
          min={300}
          max={3000}
          step={100}
        />
      </Box>
      <FormControlLabel
        control={
          <Switch
            checked={element.loop !== false}
            onChange={(e) => handleChange('loop', e.target.checked)}
          />
        }
        label="Повторять анимацию"
      />
      <Box sx={{ display: 'flex', gap: 2 }}>
        <TextField
          label="Цвет фона"
          type="color"
          value={element.backgroundColor || '#f5f5f5'}
          onChange={(e) => handleChange('backgroundColor', e.target.value)}
          sx={{ width: 120 }}
        />
        <TextField
          label="Цвет текста"
          type="color"
          value={element.textColor || '#333333'}
          onChange={(e) => handleChange('textColor', e.target.value)}
          sx={{ width: 120 }}
        />
      </Box>
    </Stack>
  );

  const renderMultipleCardsEditor = () => (
    <Stack spacing={2}>
      <Typography variant="h6" gutterBottom>
        Множественные карточки
      </Typography>
      
      <TextField
        fullWidth
        label="Заголовок секции"
        value={element.data?.title || ''}
        onChange={(e) => handleChange('title', e.target.value)}
        placeholder="Заголовок для всей секции карточек"
      />
      
      <TextField
        fullWidth
        label="Описание секции"
        value={element.data?.description || ''}
        onChange={(e) => handleChange('description', e.target.value)}
        multiline
        rows={2}
        placeholder="Описание для всей секции карточек"
      />
      
                <FormControl fullWidth size="small">
            <InputLabel>Количество столбцов</InputLabel>
            <Select
              value={element.data?.gridSize || 'medium'}
              onChange={(e) => handleChange('gridSize', e.target.value)}
            >
              <MenuItem value="small">Маленький (4 столбца)</MenuItem>
              <MenuItem value="medium">Средний (3 столбца)</MenuItem>
              <MenuItem value="large">Большой (2 столбца)</MenuItem>
              <MenuItem value="extra-large">Очень большой (1 столбец)</MenuItem>
            </Select>
          </FormControl>
      
      <Typography variant="subtitle2" gutterBottom>
        Карточки в секции: {element.data?.cards?.length || 0}
      </Typography>
      
      {element.data?.cards?.map((card, index) => (
        <Paper key={card.id} sx={{ p: 2, border: '1px solid #e0e0e0' }}>
          <Typography variant="subtitle2" gutterBottom>
            Карточка {index + 1}
          </Typography>
          <TextField
            fullWidth
            label="Заголовок"
            value={card.title || ''}
            onChange={(e) => {
              const updatedCards = [...element.data.cards];
              updatedCards[index] = { ...card, title: e.target.value };
              handleChange('cards', updatedCards);
            }}
            size="small"
            sx={{ mb: 1 }}
          />
          <TextField
            fullWidth
            label="Описание"
            value={card.content || ''}
            onChange={(e) => {
              const updatedCards = [...element.data.cards];
              updatedCards[index] = { ...card, content: e.target.value };
              handleChange('cards', updatedCards);
            }}
            multiline
            rows={2}
            size="small"
            sx={{ mb: 1 }}
          />
          <TextField
            fullWidth
            label="URL изображения"
            value={card.imageUrl || ''}
            onChange={(e) => {
              const updatedCards = [...element.data.cards];
              updatedCards[index] = { ...card, imageUrl: e.target.value };
              handleChange('cards', updatedCards);
            }}
            size="small"
            sx={{ mb: 1 }}
          />
        </Paper>
      ))}
    </Stack>
  );

  const renderElementEditor = () => {
    switch (element.type) {
      case 'gradient-text':
        return renderGradientTextEditor();
      case 'animated-counter':
        return renderAnimatedCounterEditor();
      case 'typewriter-text':
        return renderTypewriterTextEditor();
      case 'highlight-text':
        return renderHighlightTextEditor();
      case 'markdown-editor':
        return renderMarkdownEditor();
      case 'code-editor':
        return renderCodeEditor();
      case 'testimonial-card':
        return renderTestimonialEditor();
      case 'faq-section':
        return renderFaqEditor();
      case 'timeline-component':
        return renderTimelineEditor();
      case 'alert-component':
        return renderAlertEditor();
      case 'image-gallery':
        return renderImageGalleryEditor();
      
      // Текстовые элементы
      case 'typography':
        return renderTypographyEditor();
      case 'blockquote':
        return renderBlockquoteEditor();
      case 'list':
        return renderListEditor();
      
      // Карточки
      case 'basic-card':
        return renderBasicCardEditor();
      case 'image-card':
        return renderImageCardEditor();
      
      case 'cards-grid':
        return renderCardsGridEditor();
      case 'multiple-cards':
        return renderMultipleCardsEditor();
      
      // Остальные текстовые элементы
      case 'rich-text':
        return renderRichTextEditor();
      case 'code-block':
        return renderCodeBlockEditor();
      case 'callout':
        return renderCalloutEditor();
      
      // Интерактивные элементы
      case 'video-player':
        return renderVideoPlayerEditor();
      case 'qr-code':
        return renderQrCodeEditor();
      case 'rating':
        return renderRatingEditor();
      case 'progress-bars':
        return renderProgressBarEditor();
      case 'accordion':
        return renderAccordionEditor();

      case 'confetti':
        return renderConfettiEditor();

      case 'animated-box':
        return renderAnimatedBoxEditor();
      
      default:
        return (
          <Typography color="text.secondary">
            Редактирование для типа "{element.type}" пока не поддерживается
          </Typography>
        );
    }
  };

  return (
    <Paper 
      elevation={isSelected ? 4 : 2} 
      sx={{ 
        mb: 2, 
        border: isSelected ? '2px solid #1976d2' : expanded ? '2px solid #1976d2' : '1px solid #e0e0e0',
        borderRadius: 2,
        backgroundColor: isSelected ? 'rgba(25, 118, 210, 0.04)' : 'transparent',
        boxShadow: isSelected ? '0 0 20px rgba(25, 118, 210, 0.3)' : undefined,
        position: 'relative'
      }}
    >
      {isSelected && (
        <Box
          sx={{
            position: 'absolute',
            top: -10,
            right: -10,
            backgroundColor: '#1976d2',
            color: 'white',
            borderRadius: '50%',
            width: 24,
            height: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            fontWeight: 'bold',
            zIndex: 10,
            boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
          }}
        >
          ✓
        </Box>
      )}
      <Accordion 
        expanded={expanded} 
        onChange={() => setExpanded(!expanded)}
        sx={{ 
          '&:before': { display: 'none' },
          boxShadow: 'none'
        }}
      >
        <AccordionSummary 
          expandIcon={<ExpandMoreIcon />}
          sx={{ 
            backgroundColor: isSelected ? 'rgba(25, 118, 210, 0.08)' : expanded ? '#f8f9fa' : 'transparent',
            '&:hover': { backgroundColor: isSelected ? 'rgba(25, 118, 210, 0.12)' : '#f8f9fa' }
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="h6">{getElementIcon(element.type)}</Typography>
              <Box>
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    fontWeight: 'bold',
                    color: isSelected ? '#1976d2' : 'inherit'
                  }}
                >
                  {element.data?.name || element.type}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {element.data?.description || `Элемент типа ${element.type}`}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }} onClick={(e) => e.stopPropagation()}>
              <Tooltip title="Дублировать">
                <IconButton size="small" onClick={() => onElementDuplicate(element)}>
                  <ContentCopyIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Удалить">
                <IconButton size="small" color="error" onClick={() => onElementDelete(element.id)}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </AccordionSummary>
        
        <AccordionDetails sx={{ pt: 0 }}>
          <Divider sx={{ mb: 2 }} />
          {renderElementEditor()}
        </AccordionDetails>
      </Accordion>
    </Paper>
  );
};

export default ElementEditor; 