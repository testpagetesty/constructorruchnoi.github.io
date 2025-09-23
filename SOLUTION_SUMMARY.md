# 🎯 Решение проблемы с фоном таблицы

## ✅ Что исправлено:

### 1. **Разграничение фонов в таблице:**
- **Заголовок таблицы (propTitle)** → теперь использует `titleBg` (отдельный цвет)
- **Заголовки столбцов** → продолжают использовать `headerBg` (цвет для первой строки)
- **Строки данных** → используют `rowBg` и `rowAltBg`

### 2. **Восстановлен фон раздела:**
- Добавлена поддержка `sectionBackground` в DataTable
- Настройка "Фон раздела" теперь работает корректно
- Фон применяется ко всему элементу таблицы

## 🛠️ Внесенные изменения:

### DataTable.jsx
```jsx
// Основной контейнер теперь поддерживает sectionBackground
<Box sx={{
  ...(currentColorSettings?.sectionBackground?.enabled && {
    background: currentColorSettings.sectionBackground.useGradient
      ? `linear-gradient(...)`
      : currentColorSettings.sectionBackground.solidColor,
    opacity: currentColorSettings.sectionBackground.opacity || 1,
    padding: '1rem',
    borderRadius: '8px',
    marginBottom: '1rem'
  })
}}>

// Заголовок таблицы использует titleBg
backgroundColor: currentColorSettings?.textFields?.titleBg || 'transparent'
```

## 🎨 Результат:
- ✅ Заголовок таблицы и заголовки столбцов имеют разные цвета
- ✅ Настройка "Фон раздела" работает корректно
- ✅ Все настройки цветов применяются независимо
- ✅ Никаких конфликтов между настройками
