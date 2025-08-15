# Исправление контрастности текста в Rich Text Editor

## Проблема
Текст в элементах `rich-text` сливался с фоном и был плохо читаем из-за недостаточной контрастности и отсутствия поддержки настроек фона.

## Исправления

### 1. Добавлена поддержка стилей фона
**Файл**: `src/components/ContentLibrary/TextComponents/RichTextEditor.jsx`

Добавлены новые пропсы:
```javascript
backgroundColor = 'transparent',
padding = 0,
borderRadius = 0,
```

### 2. Обновлен контейнер для режима просмотра
Теперь контейнер использует настройки фона из данных элемента:
```javascript
<Box className="rich-text-container" sx={{ 
  mb: 2, 
  position: 'relative',
  backgroundColor: backgroundColor || 'transparent',
  padding: padding ? `${padding}px` : 0,
  borderRadius: borderRadius ? `${borderRadius}px` : 0,
  boxShadow: backgroundColor !== 'transparent' ? '0 2px 8px rgba(0,0,0,0.1)' : 'none'
}}>
```

### 3. Улучшена контрастность всех текстовых элементов
Добавлены тени для лучшей читаемости:

- **Заголовки**: `textShadow: '1px 1px 2px rgba(0,0,0,0.7)'`
- **Обычный текст**: `textShadow: '1px 1px 2px rgba(0,0,0,0.5)'`
- **Ссылки**: `textShadow: '1px 1px 2px rgba(0,0,0,0.7)'`
- **Код**: Тёмный фон с золотой рамкой
- **Цитаты**: `textShadow: '1px 1px 2px rgba(0,0,0,0.7)'`

### 4. Обновлена передача пропсов в компонентах превью
**Файлы**: 
- `src/components/Preview/PagePreview.jsx`
- `src/components/Preview/MultiPagePreview.jsx`

Добавлена передача новых пропсов:
```javascript
backgroundColor={element.data?.backgroundColor}
padding={element.data?.padding}
borderRadius={element.data?.borderRadius}
```

### 5. Улучшены цвета в данных элемента
**Файл**: `src/pages/index.jsx`

Для секции "Наши преимущества":
- `titleColor: '#ffd700'` (золотой для заголовков)
- `textColor: '#ffffff'` (белый для текста)
- `backgroundColor: 'rgba(0, 0, 0, 0.9)'` (более тёмный фон)

## Результат
Теперь текст в элементах `rich-text`:
- **Хорошо читается** благодаря высокому контрасту
- **Имеет тени** для лучшей видимости на любом фоне
- **Поддерживает настройки фона** из данных элемента
- **Использует золотые заголовки** для лучшего визуального восприятия
- **Работает корректно** во всех режимах просмотра

## Файлы, которые были изменены
1. `src/components/ContentLibrary/TextComponents/RichTextEditor.jsx`
2. `src/components/Preview/PagePreview.jsx`
3. `src/pages/index.jsx`

## Тестирование
Для проверки исправления:
1. Откройте секцию "Наши преимущества"
2. Убедитесь, что текст хорошо читается на тёмном фоне
3. Проверьте, что заголовки отображаются золотым цветом
4. Убедитесь, что все элементы (списки, ссылки, цитаты) имеют хорошую контрастность
5. Проверьте режим редактирования - текст должен оставаться читаемым 