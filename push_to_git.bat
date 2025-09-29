@echo off
echo ================================================
echo           ОТПРАВКА ПРОЕКТА НА GIT
echo ================================================
echo.

echo Проверяем статус Git...
git status
echo.

echo Добавляем все файлы...
git add .
if %errorlevel% neq 0 (
    echo ОШИБКА: Не удалось добавить файлы
    pause
    exit /b 1
)
echo Файлы добавлены успешно!
echo.

echo Создаем коммит...
git commit -m "Update: AI parser improvements, image cards, editor panel, preview components"
if %errorlevel% neq 0 (
    echo ОШИБКА: Не удалось создать коммит
    pause
    exit /b 1
)
echo Коммит создан успешно!
echo.

echo Отправляем на удаленный репозиторий...
git push origin main
if %errorlevel% neq 0 (
    echo Пробуем отправить на master ветку...
    git push origin master
    if %errorlevel% neq 0 (
        echo ОШИБКА: Не удалось отправить на Git
        echo Возможные причины:
        echo - Нет интернета
        echo - Проблемы с аутентификацией
        echo - Удаленный репозиторий не настроен
        pause
        exit /b 1
    )
)

echo.
echo ================================================
echo      ПРОЕКТ УСПЕШНО ОТПРАВЛЕН НА GIT!
echo ================================================
pause
