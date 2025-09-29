# Реализация кнопок загрузки изображений на карточках

## Что добавлено:

### 1. Новый компонент `ImageCardWithUpload.jsx`
- **Местоположение**: `src/components/ContentLibrary/CardComponents/ImageCardWithUpload.jsx`
- **Функции**:
  - Отображение карточки с изображением
  - Кнопка загрузки изображения (FAB в правом верхнем углу)
  - Индикатор загрузки
  - Автоматическое сохранение в IndexedDB
  - Обновление родительского компонента

### 2. Модификация `MultipleCardsSection.jsx`
- **Добавлен пропс**: `showUploadButtons = false`
- **Логика**: Использует `ImageCardWithUpload` если `showUploadButtons && editable`
- **Обратная совместимость**: По умолчанию использует обычный `ImageCard`

### 3. Обновление превью компонентов
- **PagePreview.jsx**: `showUploadButtons={constructorMode}`
- **MultiPagePreview.jsx**: `showUploadButtons={true}`

## Как это работает:

### 1. **Отображение кнопки**:
```javascript
// Кнопка появляется при наведении на карточку
<Fab
  size="small"
  color="primary"
  className="upload-button"
  onClick={handleUploadClick}
  sx={{
    position: 'absolute',
    top: 8,
    right: 8,
    opacity: showUploadButton ? 1 : 0,
    transition: 'opacity 0.3s ease'
  }}
>
  <CloudUploadIcon />
</Fab>
```

### 2. **Загрузка изображения**:
```javascript
const handleImageUpload = async (file) => {
  // Генерация уникального имени файла
  const fileName = `card_${sanitizedTitle}_${cardId}_${timestamp}.${fileExtension}`;
  
  // Сохранение в IndexedDB
  await imageCacheService.saveImage(fileName, file);
  await imageCacheService.saveMetadata(`site-images-metadata-${fileName}`, metadata);
  
  // Обновление карточки
  setCurrentImageUrl(url);
  if (onUpdate) {
    onUpdate({ imageUrl: url, fileName, cardId, metadata });
  }
};
```

### 3. **Сохранение изменений**:
- Изменения автоматически передаются через `onUpdate`
- `MultipleCardsSection` передает их через `onCardUpdate`
- Превью компоненты обновляют состояние через `handleElementSave`

## Результат:
- ✅ Кнопки загрузки изображений на каждой карточке
- ✅ Работают идентично редактору элемента
- ✅ Автоматическое сохранение в IndexedDB
- ✅ Обновление состояния приложения
- ✅ Обратная совместимость
- ✅ Индикаторы загрузки и анимации

## Использование:
```javascript
<MultipleCardsSection
  cards={cards}
  showUploadButtons={true} // Включить кнопки загрузки
  editable={true}          // Карточки должны быть редактируемыми
  onCardUpdate={handleCardUpdate} // Обработчик обновлений
/>
```
