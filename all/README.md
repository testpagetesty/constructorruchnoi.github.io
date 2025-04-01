# Deutsche Bank Investment Calculator

Многоязычное веб-приложение с калькулятором инвестиций и формой регистрации.

## Особенности

- Поддержка трех языков (немецкий, английский, русский)
- Интерактивный калькулятор инвестиций
- Адаптивный дизайн
- Форма регистрации
- Опрос пользователей

## Установка

1. Клонируйте репозиторий:
```bash
git clone [repository-url]
```

2. Откройте файл `index.html` в веб-браузере

## Использование в Android Studio

1. Создайте новый проект в Android Studio
2. В папке `app/src/main/assets` создайте веб-директорию и скопируйте туда все файлы проекта
3. Создайте новую Activity с WebView
4. Добавьте следующий код в Activity:

```kotlin
class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        val webView = findViewById<WebView>(R.id.webView)
        webView.settings.javaScriptEnabled = true
        webView.loadUrl("file:///android_asset/web/index.html")
    }
}
```

4. Добавьте разрешение на интернет в `AndroidManifest.xml`:
```xml
<uses-permission android:name="android.permission.INTERNET" />
```

## Структура проекта

- `index.html` - основной HTML файл
- `styles.css` - стили приложения
- `main.js` - основная логика приложения
- `translations.js` - файл с переводами
- `db-logo.svg` - логотип Deutsche Bank

## Технологии

- HTML5
- CSS3
- JavaScript
- SVG

## Лицензия

MIT 