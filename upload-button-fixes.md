# Исправления для кнопок загрузки изображений

## Проблемы, которые были исправлены:

### 1. **Кнопка не была видна**
**Проблема**: Кнопка показывалась только при наведении (`opacity: showUploadButton ? 1 : 0`)
**Решение**: Изменили на постоянную видимость (`opacity: 0.8`)

### 2. **Кнопка не показывалась из-за `editable={false}`**
**Проблема**: В превью компонентах передавался `editable={false}`
**Решение**: 
- `PagePreview`: `editable={constructorMode}` 
- `MultiPagePreview`: `editable={true}`

### 3. **Отсутствовал обработчик обновлений**
**Проблема**: Изменения не сохранялись в состоянии
**Решение**: Добавили `onCardUpdate` обработчики в оба превью компонента

## Внесенные изменения:

### `ImageCardWithUpload.jsx`:
```javascript
// Было:
opacity: showUploadButton ? 1 : 0,
onMouseEnter={() => setShowUploadButton(true)}
onMouseLeave={() => setShowUploadButton(false)}

// Стало:
opacity: 0.8,
'&:hover': {
  opacity: 1,
  transform: 'scale(1.1)'
}
```

### `PagePreview.jsx`:
```javascript
// Было:
editable={false}
showUploadButtons={constructorMode}

// Стало:
editable={constructorMode}
showUploadButtons={constructorMode}
onCardUpdate={(cardId, updatedData) => {
  const updatedCards = (element.cards || element.data?.cards || []).map(card => 
    card.id === cardId ? { ...card, ...updatedData } : card
  );
  if (onElementUpdate) {
    onElementUpdate(sectionId, element.id, 'cards', updatedCards);
  }
}}
```

### `MultiPagePreview.jsx`:
```javascript
// Было:
editable={false}
showUploadButtons={true}

// Стало:
editable={true}
showUploadButtons={true}
onCardUpdate={(cardId, updatedData) => {
  const updatedCards = (element.data?.cards || element.cards || []).map(card => 
    card.id === cardId ? { ...card, ...updatedData } : card
  );
  if (onElementUpdate) {
    onElementUpdate(sectionId, element.id, 'data', { cards: updatedCards });
  }
}}
```

## Результат:
✅ Кнопки загрузки теперь видны на карточках  
✅ Работают в режиме конструктора  
✅ Изменения сохраняются в состоянии  
✅ Полная функциональность загрузки изображений  

## Как проверить:
1. Откройте превью с множественными карточками
2. Наведите курсор на карточку с изображением
3. Должна появиться синяя кнопка с иконкой загрузки в правом верхнем углу
4. Кликните на неё и выберите изображение
5. Изображение должно обновиться и сохраниться
