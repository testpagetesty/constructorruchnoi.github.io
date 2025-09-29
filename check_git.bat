@echo off
echo ================================================
echo           ДИАГНОСТИКА GIT
echo ================================================
echo.

echo 1. Проверяем установку Git...
git --version
if %errorlevel% neq 0 (
    echo Git НЕ УСТАНОВЛЕН или не в PATH!
    echo Скачайте Git с https://git-scm.com/
    pause
    exit /b 1
)
echo.

echo 2. Проверяем текущую директорию...
cd
echo.

echo 3. Проверяем статус Git репозитория...
git status
if %errorlevel% neq 0 (
    echo Это НЕ Git репозиторий!
    echo Нужно инициализировать: git init
    pause
    exit /b 1
)
echo.

echo 4. Проверяем удаленные репозитории...
git remote -v
if %errorlevel% neq 0 (
    echo Удаленный репозиторий НЕ НАСТРОЕН!
    echo Добавьте репозиторий: git remote add origin URL
)
echo.

echo 5. Проверяем текущую ветку...
git branch
echo.

echo ================================================
echo           ДИАГНОСТИКА ЗАВЕРШЕНА
echo ================================================
pause
