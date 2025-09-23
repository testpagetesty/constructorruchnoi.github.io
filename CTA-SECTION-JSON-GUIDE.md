# Полный JSON для CTA секции

## Описание
Этот JSON содержит все необходимые поля для полной настройки CTA секции в редакторе. При применении этого JSON будут изменены все поля настроек в редакторе и превью.

**⚠️ ВАЖНО: Текстовые поля (заголовок, описание, текст кнопки) НЕ изменяются - применяются только стили к существующему тексту.**

## Структура JSON

### Основные поля элемента (только стили, текст НЕ изменяется)
```json
{
  "type": "cta-section",
  "alignment": "center",
  "backgroundType": "gradient",
  "backgroundColor": "#1a1a2e",
  "gradientColor1": "#1a1a2e",
  "gradientColor2": "#0f3460",
  "gradientDirection": "to right",
  "textColor": "#ffffff",
  "titleColor": "#00d4ff",
  "descriptionColor": "#ffffff",
  "buttonColor": "#ff6b6b",
  "buttonTextColor": "#ffffff",
  "borderRadius": 12,
  "padding": 48,
  "buttonBorderRadius": 8,
  "showShadow": true
}
```

### Настройки анимации
```json
{
  "animationSettings": {
    "animationType": "fadeIn",
    "delay": 0,
    "triggerOnView": true,
    "triggerOnce": true,
    "threshold": 0.1,
    "disabled": false
  }
}
```

### Настройки цветов (colorSettings)
```json
{
  "colorSettings": {
    "sectionBackground": {
      "enabled": true,
      "useGradient": true,
      "solidColor": "#1a1a2e",
      "gradientColor1": "#1a1a2e",
      "gradientColor2": "#0f3460",
      "gradientDirection": "to right",
      "opacity": 1
    },
    "textFields": {
      "title": "#00d4ff",
      "description": "#ffffff",
      "background": "#1a1a2e",
      "border": "transparent",
      "button": "#ff6b6b",
      "buttonText": "#ffffff",
      "buttonBorderRadius": 8
    },
    "borderColor": "transparent",
    "borderWidth": 0,
    "borderRadius": 12,
    "padding": 48,
    "boxShadow": true
  }
}
```

## Поля, которые изменяются в редакторе

### Секция "Содержание"
- ❌ Заголовок (`title`) - НЕ изменяется, применяется только стиль
- ❌ Описание (`description`) - НЕ изменяется, применяется только стиль
- ❌ Текст кнопки (`buttonText`) - НЕ изменяется, применяется только стиль
- ❌ Страница для перехода (`targetPage`) - НЕ изменяется
- ✅ Выравнивание (`alignment`)

### Секция "Настройки размеров"
- ✅ Внутренние отступы (`padding`)
- ✅ Радиус скругления (`borderRadius`)
- ✅ Показать тень (`showShadow`)

### Секция "Настройки анимации"
- ✅ Тип анимации (`animationSettings.animationType`)
- ✅ Задержка (`animationSettings.delay`)
- ✅ Срабатывание при просмотре (`animationSettings.triggerOnView`)
- ✅ Срабатывание один раз (`animationSettings.triggerOnce`)
- ✅ Порог срабатывания (`animationSettings.threshold`)
- ✅ Отключить анимацию (`animationSettings.disabled`)

### Секция "Настройки цветов через ColorSettings"
- ✅ Цвет заголовка (`colorSettings.textFields.title`)
- ✅ Цвет описания (`colorSettings.textFields.description`)
- ✅ Цвет фона (`colorSettings.textFields.background`)
- ✅ Цвет границы (`colorSettings.textFields.border`)
- ✅ Цвет кнопки (`colorSettings.textFields.button`)
- ✅ Цвет текста кнопки (`colorSettings.textFields.buttonText`)
- ✅ Радиус скругления кнопки (`colorSettings.textFields.buttonBorderRadius`)

### Секция "Настройки раздела"
- ✅ Использовать настройки фона (`colorSettings.sectionBackground.enabled`)
- ✅ Использовать градиент (`colorSettings.sectionBackground.useGradient`)
- ✅ Цвет фона (`colorSettings.sectionBackground.solidColor`)
- ✅ Цвет 1 градиента (`colorSettings.sectionBackground.gradientColor1`)
- ✅ Цвет 2 градиента (`colorSettings.sectionBackground.gradientColor2`)
- ✅ Направление градиента (`colorSettings.sectionBackground.gradientDirection`)
- ✅ Прозрачность (`colorSettings.sectionBackground.opacity`)

### Секция "Дополнительные настройки"
- ✅ Цвет границы (`colorSettings.borderColor`)
- ✅ Ширина границы (`colorSettings.borderWidth`)
- ✅ Радиус углов (`colorSettings.borderRadius`)
- ✅ Внутренние отступы (`colorSettings.padding`)
- ✅ Добавить тень (`colorSettings.boxShadow`)

## Как использовать

1. Скопируйте полный JSON из файла `test-cta-section-complete.json`
2. Вставьте его в поле "Готовый JSON" в AI дизайн-системе
3. Нажмите "Применить стили"
4. Все стили в редакторе CTA секции будут обновлены согласно JSON
5. **Текстовые поля (заголовок, описание, текст кнопки) останутся без изменений**

## Примечания

- Все поля в JSON соответствуют полям в редакторе CTA секции
- При применении JSON обновляются как основные поля, так и colorSettings
- **Текстовые поля (заголовок, описание, текст кнопки) НЕ изменяются - применяются только стили**
- Система автоматически применяет стили к превью
- Логирование в консоли поможет отследить процесс применения стилей
