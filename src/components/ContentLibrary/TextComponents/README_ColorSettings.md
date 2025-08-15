# 🎨 Новая система цветовых настроек для текстовых элементов

## Обзор

Мы создали единую систему цветовых настроек для всех текстовых элементов, которая обеспечивает:
- **Цвета фона раздела** с поддержкой градиентов
- **Цвета для каждого текстового поля** (заголовок, основной текст, автор, и т.д.)
- **Легкую интеграцию с экспортом** в HTML
- **Единообразный интерфейс** для всех компонентов

## Структура данных colorSettings

```javascript
const colorSettings = {
  // Настройки фона раздела
  sectionBackground: {
    enabled: true,                    // Включить настройки фона
    useGradient: true,               // Использовать градиент
    solidColor: '#ffffff',           // Сплошной цвет (если градиент выключен)
    gradientColor1: '#ffffff',       // Первый цвет градиента
    gradientColor2: '#f0f0f0',      // Второй цвет градиента
    gradientDirection: 'to right',   // Направление градиента
    opacity: 1                       // Прозрачность (0-1)
  },
  
  // Цвета текстовых полей
  textFields: {
    title: '#1976d2',               // Цвет заголовка
    text: '#333333',                // Цвет основного текста
    subtitle: '#666666',            // Цвет подзаголовка
    author: '#888888',              // Цвет автора (для цитат)
    source: '#aaaaaa'               // Цвет источника
  },
  
  // Дополнительные настройки
  borderColor: '#e0e0e0',           // Цвет границы
  borderWidth: 1,                   // Ширина границы
  borderRadius: 8,                  // Радиус углов
  padding: 16,                      // Внутренние отступы
  boxShadow: false                  // Добавить тень
}
```

## Использование в компонентах

### 1. Компонент Typography

```javascript
import ColorSettings from './ColorSettings';

const Typography = ({ colorSettings = {}, onUpdate, ... }) => {
  const [currentColorSettings, setCurrentColorSettings] = useState(colorSettings);
  
  const handleColorUpdate = (newColorSettings) => {
    setCurrentColorSettings(newColorSettings);
    if (onUpdate) {
      onUpdate({ colorSettings: newColorSettings, ... });
    }
  };

  return (
    <div>
      {/* В режиме редактирования */}
      <ColorSettings
        title="Настройки цветов заголовка"
        colorSettings={currentColorSettings}
        onUpdate={handleColorUpdate}
        availableFields={[
          {
            name: 'text',
            label: 'Цвет текста',
            description: 'Основной цвет текста заголовка',
            defaultColor: '#333333'
          }
        ]}
      />
    </div>
  );
};
```

### 2. Компонент RichTextEditor

```javascript
const availableFields = [
  {
    name: 'title',
    label: 'Цвет заголовка',
    description: 'Цвет заголовка блока',
    defaultColor: '#1976d2'
  },
  {
    name: 'text',
    label: 'Цвет основного текста',
    description: 'Цвет содержимого блока',
    defaultColor: '#333333'
  }
];

<ColorSettings
  title="Настройки цветов богатого текста"
  colorSettings={currentColorSettings}
  onUpdate={handleColorUpdate}
  availableFields={availableFields}
/>
```

### 3. Компонент Blockquote

```javascript
const availableFields = [
  {
    name: 'quote',
    label: 'Цвет цитаты',
    description: 'Основной цвет текста цитаты',
    defaultColor: '#555555'
  },
  {
    name: 'author',
    label: 'Цвет автора',
    description: 'Цвет имени автора',
    defaultColor: '#888888'
  },
  {
    name: 'source',
    label: 'Цвет источника',
    description: 'Цвет источника цитаты',
    defaultColor: '#aaaaaa'
  }
];
```

## Интеграция с экспортом

В `multiPageSiteExporter.js` используется функция `applyColorSettings`:

```javascript
const applyColorSettings = (colorSettings, defaultStyles = {}) => {
  let containerStyles = { ...defaultStyles };
  let textStyles = {};
  
  // Применяем настройки фона секции
  if (colorSettings?.sectionBackground?.enabled) {
    const { sectionBackground } = colorSettings;
    if (sectionBackground.useGradient) {
      containerStyles.background = `linear-gradient(${sectionBackground.gradientDirection}, ${sectionBackground.gradientColor1}, ${sectionBackground.gradientColor2})`;
    } else {
      containerStyles.backgroundColor = sectionBackground.solidColor;
    }
    // ... дополнительные стили
  }
  
  // Применяем цвета текстовых полей
  if (colorSettings?.textFields) {
    Object.keys(colorSettings.textFields).forEach(fieldName => {
      textStyles[\`\${fieldName}Color\`] = colorSettings.textFields[fieldName];
    });
  }
  
  return { containerStyles, textStyles };
};
```

## Доступные направления градиента

- `to right` → Вправо
- `to left` ← Влево  
- `to bottom` ↓ Вниз
- `to top` ↑ Вверх
- `to bottom right` ↘ Вправо-вниз
- `to bottom left` ↙ Влево-вниз
- `to top right` ↗ Вправо-вверх
- `to top left` ↖ Влево-вверх

## Примеры использования

### Простая настройка цветов

```javascript
const simpleColors = {
  textFields: {
    title: '#1976d2',
    text: '#333333'
  }
};
```

### Полная настройка с градиентом

```javascript
const fullColors = {
  sectionBackground: {
    enabled: true,
    useGradient: true,
    gradientColor1: '#e3f2fd',
    gradientColor2: '#bbdefb',
    gradientDirection: 'to bottom right',
    opacity: 1
  },
  textFields: {
    title: '#1565c0',
    text: '#424242',
    subtitle: '#757575'
  },
  borderWidth: 2,
  borderColor: '#1976d2',
  borderRadius: 12,
  padding: 32,
  boxShadow: true
};
```

## Компоненты

1. **ColorSettings.jsx** - Универсальный компонент настроек
2. **ColorSettingsDemo.jsx** - Демонстрационный компонент
3. Обновленные компоненты: Typography, RichTextEditor, Blockquote, ListComponent, Callout

## Преимущества новой системы

✅ **Единообразие** - все компоненты используют одну систему  
✅ **Гибкость** - поддержка градиентов и множества цветовых настроек  
✅ **Простота** - легко добавлять новые поля для цветов  
✅ **Экспорт** - автоматическое применение стилей при экспорте  
✅ **UI/UX** - интуитивно понятный интерфейс настроек