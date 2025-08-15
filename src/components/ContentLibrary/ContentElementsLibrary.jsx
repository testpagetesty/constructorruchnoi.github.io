import React, { useState } from 'react';
import {
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Paper,
  TextField,
  InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import ViewCarouselIcon from '@mui/icons-material/ViewCarousel';
import InteractiveIcon from '@mui/icons-material/TouchApp';
import TableViewIcon from '@mui/icons-material/TableView';
import BarChartIcon from '@mui/icons-material/BarChart';

// Описание доступных элементов (только созданные компоненты)
const CONTENT_ELEMENTS = {
  textComponents: {
    title: '📝 Текстовые элементы',
    icon: <TextFieldsIcon />,
    elements: [
      { id: 'typography', name: 'Заголовки и текст', description: 'H1-H6, параграфы, подзаголовки' },
      { id: 'rich-text', name: 'Богатый текст', description: 'WYSIWYG редактор' },

      { id: 'blockquote', name: 'Цитата', description: 'Выделенные цитаты' },
      { id: 'list', name: 'Списки', description: 'Маркированные и нумерованные' },
      { id: 'callout', name: 'Выноски', description: 'Информационные блоки' }
    ]
  },
  advancedTextComponents: {
    title: '✨ Продвинутые текстовые элементы',
    icon: <TextFieldsIcon />,
    elements: [
      { id: 'gradient-text', name: 'Градиентный текст', description: 'Красивые градиенты для заголовков' },
      { id: 'animated-counter', name: 'Анимированные счетчики', description: 'Счетчики с анимацией' },
      { id: 'typewriter-text', name: 'Эффект печатной машинки', description: 'Печатающийся текст' },
      { id: 'highlight-text', name: 'Выделенный текст', description: 'Подсветка ключевых слов' },


    ]
  },
  additionalTextComponents: {
    title: '📋 Дополнительные текстовые элементы',
    icon: <TextFieldsIcon />,
    elements: [
      { id: 'testimonial-card', name: 'Отзывы клиентов', description: 'Карточки с отзывами и рейтингами' },
      { id: 'faq-section', name: 'FAQ секция', description: 'Часто задаваемые вопросы' },
      { id: 'timeline-component', name: 'Временная шкала', description: 'Хронология событий' },

      { id: 'cta-section', name: 'CTA секция', description: 'Призыв к действию с кнопкой перехода' }
    ]
  },
  cardComponents: {
    title: '🃏 Карточки',
    icon: <ViewCarouselIcon />,
    elements: [
      { id: 'basic-card', name: 'Базовая карточка', description: 'Простая карточка с текстом' },
      { id: 'image-card', name: 'Карточка с изображением', description: 'Карточка с картинкой' },
      { id: 'multiple-cards', name: 'Множественные карточки', description: 'Создание нескольких карточек сразу' }
    ]
  },
  interactiveComponents: {
    title: '🎛️ Интерактивные элементы',
    icon: <InteractiveIcon />,
    elements: [
      { id: 'accordion', name: 'Аккордеон', description: 'Раскрывающиеся секции' },
      { id: 'video-player', name: 'Видеоплеер', description: 'YouTube, Vimeo и другие' },
      { id: 'qr-code', name: 'QR код', description: 'Генератор QR кодов' },
      { id: 'image-gallery', name: 'Галерея изображений', description: 'Слайдер изображений с миниатюрами' },
      { id: 'rating', name: 'Рейтинг', description: 'Звездочки и оценки' },
      { id: 'confetti', name: 'Конфетти', description: 'Анимация праздника' },
      { id: 'animated-box', name: 'Анимированный блок', description: 'Различные анимации' },
      { id: 'progress-bars', name: 'Индикаторы прогресса', description: 'Линейные и круговые' }
    ]
  },
  tableComponents: {
    title: '📊 Таблицы',
    icon: <TableViewIcon />,
    elements: [
      { id: 'data-table', name: 'Таблица данных', description: 'С сортировкой и фильтрацией' }
    ]
  },
  chartComponents: {
    title: '📈 Графики',
    icon: <BarChartIcon />,
    elements: [
      { id: 'bar-chart', name: 'Столбчатая диаграмма', description: 'Сравнение данных' },
      { id: 'advanced-line-chart', name: 'Линейный график', description: 'Recharts продвинутый' },
      { id: 'advanced-bar-chart', name: 'Столбчатая диаграмма Pro', description: 'Recharts продвинутая' },
      { id: 'advanced-pie-chart', name: 'Круговая диаграмма', description: 'Recharts с процентами' },
      { id: 'advanced-area-chart', name: 'Диаграмма с областями', description: 'Заполненные области' },
      { id: 'advanced-radar-chart', name: 'Радарная диаграмма', description: 'Многомерные данные' },
      { id: 'chartjs-bar', name: 'Chart.js столбцы', description: 'Chart.js библиотека' },
      { id: 'chartjs-doughnut', name: 'Пончиковая диаграмма', description: 'Chart.js пончик' },
      { id: 'apex-line', name: 'ApexCharts линии', description: 'ApexCharts продвинутый' }
    ]
  },
  formComponents: {
    title: '📋 Формы',
    icon: <InteractiveIcon />,
    elements: [
      { id: 'advanced-contact-form', name: 'Расширенная контактная форма', description: 'React Hook Form' }
    ]
  }
};

const ContentElementsLibrary = ({ onAddElement }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedElement, setSelectedElement] = useState('');
  const [selectedElementData, setSelectedElementData] = useState(null);

  const handleElementSelect = (event) => {
    const value = event.target.value;
    setSelectedElement(value);
    
    if (value) {
      const [categoryId, elementId] = value.split('.');
      const category = CONTENT_ELEMENTS[categoryId];
      const element = category.elements.find(el => el.id === elementId);
      const elementData = { categoryId, category, element };
      
      setSelectedElementData(elementData);
      
      // Сразу добавляем элемент при выборе
      if (onAddElement) {
        // Создаем базовые данные для элемента с анимацией
        let elementData = {
          name: element.name,
          description: element.description,
          animationSettings: {
            animationType: 'fadeIn',
            delay: 0,
            triggerOnView: true,
            triggerOnce: true,
            threshold: 0.1,
            disabled: false
          }
        };

        // Добавляем специфичные данные для каждого типа элемента
        switch (element.id) {
          case 'rich-text':
            elementData = {
              ...elementData,
              title: 'Богатый текст',
              content: 'Текст с **жирным**, *курсивом*, ***жирным курсивом***\n\nВторой абзац с [ссылкой](https://example.com)\n\n## Заголовок 2\n\n* Первый пункт списка\n* Второй пункт списка\n\n`код` встроенный в текст',
              showTitle: true,
              titleColor: '#1976d2',
              textColor: '#333333'
            };
            break;
          case 'typography':
            elementData = {
              ...elementData,
              text: 'Заголовок или текст',
              elementType: 'h2',
              color: '#1976d2',
              alignment: 'left'
            };
            break;
          case 'blockquote':
            elementData = {
              ...elementData,
              quote: 'Важная цитата или высказывание, которое привлекает внимание читателей',
              author: 'Автор цитаты',
              source: 'Источник, книга или компания',
              showAuthor: true,
              showSource: true,
              quoteColor: '#555555',
              authorColor: '#888888',
              backgroundColor: '#f8f9fa',
              borderColor: '#1976d2',
              fontFamily: 'inherit',
              fontWeight: 'normal',
              quoteFontSize: 18,
              authorFontSize: 14,
              padding: 24,
              borderWidth: 4,
              textAlign: 'left',
              borderPosition: 'left',
              italic: true
            };
            break;
          case 'callout':
            elementData = {
              ...elementData,
              title: 'Информационный блок',
              content: 'Это важная информация, которую нужно выделить. Используйте информационные блоки для привлечения внимания к ключевым моментам.',
              type: 'custom',
              showIcon: true,
              backgroundColor: '#e3f2fd',
              borderColor: '#1976d2',
              textColor: '#0d47a1',
              isCustomType: true,
              customTypeName: 'Информация'
            };
            break;
          case 'accordion':
            elementData = {
              ...elementData,
              title: 'Информация для игроков',
              accordionItems: [
                { 
                  id: 1, 
                  title: '🎰 Безопасность и лицензии', 
                  content: '**Наша безопасность - ваша уверенность!**\n\n• **Лицензия Кюрасао** - официальное разрешение на проведение азартных игр\n• **SSL-шифрование** - защита всех финансовых операций\n• **Сертификация RNG** - честность всех игровых результатов\n• **Проверка третьими лицами** - регулярный аудит систем\n• **Защита данных** - соответствие стандартам GDPR\n\n**Мы гарантируем честную игру и полную конфиденциальность ваших данных!**' 
                },
                { 
                  id: 2, 
                  title: '💰 Бонусы и акции', 
                  content: '**Щедрые бонусы для всех игроков!**\n\n• **Приветственный бонус** - 200% на первый депозит + 200 фриспинов\n• **Еженедельный кэшбэк** - возврат до 20% от проигранных средств\n• **Турниры** - призовые фонды до €100,000\n• **VIP-программа** - эксклюзивные привилегии\n• **Бонусы на день рождения** - персональные подарки\n\n**Играйте больше - получайте больше бонусов!**' 
                },
                { 
                  id: 3, 
                  title: 'Третий раздел', 
                  content: 'Описание третьего раздела' 
                }
              ],
              allowMultiple: false,
              variant: 'outlined',
              size: 'medium',
              spacing: 'normal',
              showIcons: true,
              customStyles: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                borderColor: '#c41e3a',
                titleColor: '#ffd700',
                contentColor: '#ffffff',
                hoverColor: 'rgba(196, 30, 58, 0.15)'
              }
            };
            break;
          
          // Диаграммы
          case 'bar-chart':
            elementData = {
              ...elementData,
              title: 'Столбчатая диаграмма',
              data: [
                { label: 'Январь', value: 65, color: '#1976d2' },
                { label: 'Февраль', value: 45, color: '#2196f3' },
                { label: 'Март', value: 80, color: '#03a9f4' },
                { label: 'Апрель', value: 55, color: '#00bcd4' }
              ],
              showValues: true,
              showGrid: true,
              animate: true,
              orientation: 'vertical'
            };
            break;
          
          case 'advanced-line-chart':
            elementData = {
              ...elementData,
              title: 'Линейный график',
              data: [
                { name: 'Янв', value: 400, value2: 240 },
                { name: 'Фев', value: 300, value2: 456 },
                { name: 'Мар', value: 300, value2: 139 },
                { name: 'Апр', value: 200, value2: 980 },
                { name: 'Май', value: 278, value2: 390 },
                { name: 'Июн', value: 189, value2: 480 }
              ],
              strokeWidth: 2,
              showGrid: true,
              showLegend: true
            };
            break;
          
          case 'advanced-bar-chart':
            elementData = {
              ...elementData,
              title: 'Столбчатая диаграмма',
              data: [
                { name: 'Янв', value: 400, value2: 240 },
                { name: 'Фев', value: 300, value2: 456 },
                { name: 'Мар', value: 300, value2: 139 },
                { name: 'Апр', value: 200, value2: 980 },
                { name: 'Май', value: 278, value2: 390 },
                { name: 'Июн', value: 189, value2: 480 }
              ],
              showGrid: true,
              showLegend: true
            };
            break;
          
          case 'advanced-pie-chart':
            elementData = {
              ...elementData,
              title: 'Круговая диаграмма',
              data: [
                { name: 'Группа A', value: 400 },
                { name: 'Группа B', value: 300 },
                { name: 'Группа C', value: 300 },
                { name: 'Группа D', value: 200 }
              ],
              showLabels: true,
              chartSize: 700
            };
            break;
          
          case 'advanced-area-chart':
            elementData = {
              ...elementData,
              title: 'Диаграмма с областями',
              data: [
                { name: 'Янв', value: 400, value2: 240 },
                { name: 'Фев', value: 300, value2: 456 },
                { name: 'Мар', value: 300, value2: 139 },
                { name: 'Апр', value: 200, value2: 980 },
                { name: 'Май', value: 278, value2: 390 },
                { name: 'Июн', value: 189, value2: 480 }
              ],
              showGrid: true,
              showLegend: true,
              stacked: true
            };
            break;
          
          case 'advanced-radar-chart':
            elementData = {
              ...elementData,
              title: 'Радарная диаграмма',
              data: [
                { subject: 'Математика', A: 120, B: 110, fullMark: 150 },
                { subject: 'Китайский', A: 98, B: 130, fullMark: 150 },
                { subject: 'Английский', A: 86, B: 130, fullMark: 150 },
                { subject: 'География', A: 99, B: 100, fullMark: 150 },
                { subject: 'Физика', A: 85, B: 90, fullMark: 150 },
                { subject: 'История', A: 65, B: 85, fullMark: 150 }
              ],
              showLegend: true,
              fillOpacity: 0.6
            };
            break;
          
          case 'chartjs-bar':
            elementData = {
              ...elementData,
              title: 'Chart.js Столбчатая диаграмма',
              data: {
                labels: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь'],
                datasets: [
                  {
                    label: 'Продажи',
                    data: [12, 19, 3, 5, 2, 3],
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1,
                  },
                  {
                    label: 'Прибыль',
                    data: [2, 3, 20, 5, 1, 4],
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1,
                  },
                ],
              },
              showLegend: true,
              chartHeight: 500,
              chartWidth: '100%',
              centerChart: true,
              titleColor: '#1976d2',
              backgroundColor: '#ffffff',
              backgroundType: 'solid',
              gradientStart: '#f5f5f5',
              gradientEnd: '#e0e0e0',
              gradientDirection: 'to bottom',
              borderRadius: 8,
              padding: 24
            };
            break;
          
          case 'chartjs-doughnut':
            elementData = {
              ...elementData,
              title: 'Пончиковая диаграмма',
              data: {
                labels: ['Красный', 'Синий', 'Желтый', 'Зеленый', 'Фиолетовый', 'Оранжевый'],
                datasets: [
                  {
                    label: 'Количество голосов',
                    data: [12, 19, 3, 5, 2, 3],
                    backgroundColor: [
                      'rgba(255, 99, 132, 0.2)',
                      'rgba(54, 162, 235, 0.2)',
                      'rgba(255, 205, 86, 0.2)',
                      'rgba(75, 192, 192, 0.2)',
                      'rgba(153, 102, 255, 0.2)',
                      'rgba(255, 159, 64, 0.2)',
                    ],
                    borderColor: [
                      'rgba(255, 99, 132, 1)',
                      'rgba(54, 162, 235, 1)',
                      'rgba(255, 205, 86, 1)',
                      'rgba(75, 192, 192, 1)',
                      'rgba(153, 102, 255, 1)',
                      'rgba(255, 159, 64, 1)',
                    ],
                    borderWidth: 1,
                  },
                ],
              },
              showLegend: true
            };
            break;
          
          case 'apex-line':
            elementData = {
              ...elementData,
              title: 'ApexCharts Линейный график',
              series: [{
                name: "Продажи",
                data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
              }],
              categories: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен']
            };
            break;
          

          
          // Карточки
          case 'basic-card':
            elementData = {
              ...elementData,
              title: 'Базовая карточка',
              content: 'Содержание базовой карточки с текстом и описанием.',
              buttonText: 'Подробнее',
              buttonLink: '#',
              elevation: 2,
              variant: 'elevated',
              size: 'medium',
              alignment: 'left',
              showActions: false,
              customStyles: {
                backgroundColor: '#ffffff',
                borderColor: '#e0e0e0',
                borderWidth: 1,
                borderRadius: 8,
                textColor: '#333333',
                titleColor: '#1976d2'
              }
            };
            break;
          
          case 'image-card':
            elementData = {
              ...elementData,
              title: 'Карточка с изображением',
              content: 'Описание изображения или дополнительная информация к карточке.',
              imageUrl: 'https://via.placeholder.com/300x200?text=Изображение',
              imageAlt: 'Изображение',
              buttonText: 'Подробнее',
              buttonLink: '#',
              imagePosition: 'top',
              imageHeight: 200,
              elevation: 2,
              variant: 'elevated',
              size: 'medium',
              alignment: 'left',
              showActions: false,
              customStyles: {
                backgroundColor: '#ffffff',
                borderColor: '#e0e0e0',
                borderWidth: 1,
                borderRadius: 8,
                textColor: '#333333',
                titleColor: '#1976d2',
                imageFilter: 'none',
                imageOpacity: 1
              }
            };
            break;
          
          case 'multiple-cards':
            elementData = {
              ...elementData,
              title: 'Множественные карточки',
              description: 'Секция с несколькими карточками',
              cardType: 'image-card',
              gridSize: 'auto', // Используем 'auto' для автоматического расчета размеров
              cards: [
                {
                  id: Date.now() + 1,
                  title: 'Карточка 1',
                  content: 'Описание первой карточки',
                  imageUrl: 'https://via.placeholder.com/300x200?text=Карточка+1',
                  imageAlt: 'Карточка 1',
                  buttonText: 'Подробнее',
                  buttonLink: '#',
                  gridSize: 'medium',
                  variant: 'elevated',
                  size: 'medium',
                  alignment: 'left',
                  showActions: false,
                  customStyles: {
                    backgroundColor: '#ffffff',
                    borderColor: '#e0e0e0',
                    borderWidth: 1,
                    borderRadius: 8,
                    textColor: '#333333',
                    titleColor: '#1976d2'
                  },
                  animationSettings: {
                    animationType: 'fadeIn',
                    delay: 0,
                    triggerOnView: true,
                    triggerOnce: true,
                    threshold: 0.1,
                    disabled: false
                  }
                },
                {
                  id: Date.now() + 2,
                  title: 'Карточка 2',
                  content: 'Описание второй карточки',
                  imageUrl: 'https://via.placeholder.com/300x200?text=Карточка+2',
                  imageAlt: 'Карточка 2',
                  buttonText: 'Подробнее',
                  buttonLink: '#',
                  gridSize: 'medium',
                  variant: 'elevated',
                  size: 'medium',
                  alignment: 'left',
                  showActions: false,
                  customStyles: {
                    backgroundColor: '#ffffff',
                    borderColor: '#e0e0e0',
                    borderWidth: 1,
                    borderRadius: 8,
                    textColor: '#333333',
                    titleColor: '#1976d2'
                  },
                  animationSettings: {
                    animationType: 'fadeIn',
                    delay: 0.1,
                    triggerOnView: true,
                    triggerOnce: true,
                    threshold: 0.1,
                    disabled: false
                  }
                },
                {
                  id: Date.now() + 3,
                  title: 'Карточка 3',
                  content: 'Описание третьей карточки',
                  imageUrl: 'https://via.placeholder.com/300x200?text=Карточка+3',
                  imageAlt: 'Карточка 3',
                  buttonText: 'Подробнее',
                  buttonLink: '#',
                  gridSize: 'medium',
                  variant: 'elevated',
                  size: 'medium',
                  alignment: 'left',
                  showActions: false,
                  customStyles: {
                    backgroundColor: '#ffffff',
                    borderColor: '#e0e0e0',
                    borderWidth: 1,
                    borderRadius: 8,
                    textColor: '#333333',
                    titleColor: '#1976d2'
                  },
                  animationSettings: {
                    animationType: 'fadeIn',
                    delay: 0.2,
                    triggerOnView: true,
                    triggerOnce: true,
                    threshold: 0.1,
                    disabled: false
                  }
                }
              ]
            };
            break;

          // CTA секция
          case 'cta-section':
            elementData = {
              ...elementData,
              title: 'Ознакомьтесь с нашими услугами',
              description: 'Узнайте больше о том, что мы предлагаем',
              buttonText: 'Перейти к услугам',
              targetPage: 'services',
              alignment: 'center',
              backgroundColor: '#1976d2',
              textColor: '#ffffff',
              buttonColor: '#ffd700',
              buttonTextColor: '#000000'
                        };
            break;

          // Дополнительные текстовые элементы
          case 'testimonial-card':
            elementData = {
              ...elementData,
              name: 'Анна Иванова',
              role: 'Менеджер по продажам',
              company: 'ООО "Компания"',
              content: 'Отличный сервис! Рекомендую всем своим коллегам. Профессиональный подход и качественное обслуживание.',
              rating: 5,
              avatar: ''
            };
            break;

          case 'faq-section':
            elementData = {
              ...elementData,
              title: 'Часто задаваемые вопросы',
              items: [
                { question: 'Как это работает?', answer: 'Очень просто и эффективно. Следуйте инструкциям на сайте.' },
                { question: 'Сколько это стоит?', answer: 'Цены очень доступные. Ознакомьтесь с нашими тарифами.' },
                { question: 'Есть ли поддержка?', answer: 'Да, мы предоставляем круглосуточную поддержку клиентов.' }
              ]
            };
            break;

          case 'timeline-component':
            elementData = {
              ...elementData,
              title: 'Наша история',
              events: [
                { year: '2020', title: 'Основание компании', description: 'Началось наше путешествие' },
                { year: '2021', title: 'Первые клиенты', description: 'Завоевали доверие первых клиентов' },
                { year: '2022', title: 'Расширение', description: 'Открыли новые направления' },
                { year: '2023', title: 'Международный рынок', description: 'Вышли на международный уровень' }
              ]
            };
            break;

          case 'image-gallery':
            elementData = {
              ...elementData,
              title: 'Галерея изображений',
              description: 'Просмотрите нашу коллекцию изображений',
              images: [],
              galleryHeight: 400,
              thumbnailSize: 80,
              showThumbnails: true,
              showNavigation: true,
              showPagination: true,
              titleColor: '#1976d2',
              descriptionColor: '#666666',
              backgroundColor: 'transparent',
              colorSettings: {
                textFields: {
                  title: '#1976d2',
                  description: '#666666',
                  background: 'transparent',
                  navigation: 'rgba(255,255,255,0.8)',
                  pagination: '#1976d2',
                  border: '#e0e0e0'
                },
                sectionBackground: {
                  enabled: false,
                  useGradient: false,
                  solidColor: '#ffffff',
                  gradientDirection: 'to right',
                  gradientColor1: '#ffffff',
                  gradientColor2: '#f5f5f5',
                  opacity: 1
                },
                borderColor: '#e0e0e0',
                borderWidth: 1,
                borderRadius: 8,
                padding: 20,
                boxShadow: false
              }
            };
            break;



          // Добавляем данные для других элементов по мере необходимости
          default:
            // Для остальных элементов используем базовые данные
            break;
        }

        const elementToAdd = {
          type: element.id,
          category: categoryId,
          data: elementData
        };
        console.log('[ContentElementsLibrary] Adding element:', elementToAdd);
        onAddElement(elementToAdd);
      }
      
      // Показываем уведомление об успешном добавлении
      setTimeout(() => {
        setSelectedElement('');
        setSelectedElementData(null);
      }, 1500);
    } else {
      setSelectedElementData(null);
    }
  };

  // Создаем плоский список всех элементов для фильтрации
  const allElements = Object.entries(CONTENT_ELEMENTS).flatMap(([categoryId, category]) => 
    category.elements.map(element => ({
      categoryId,
      category,
      element,
      value: `${categoryId}.${element.id}`
    }))
  );

  const filteredElements = allElements.filter(item =>
    item.element.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.element.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

      return (
      <Box sx={{ p: 2 }}>
        <Typography variant="h5" gutterBottom sx={{ color: '#1976d2', fontWeight: 'bold' }}>
          📚 Библиотека элементов контента
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Выберите элемент для добавления в секцию. Все элементы полностью настраиваются.
        </Typography>

        {/* Поиск */}
        <TextField
          fullWidth
          size="small"
          placeholder="Поиск элементов..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            )
          }}
        />

        {/* Выбор элемента */}
        <FormControl fullWidth size="small" sx={{ mb: 2 }}>
          <InputLabel>Выберите элемент для добавления</InputLabel>
          <Select
            value={selectedElement}
            onChange={handleElementSelect}
            label="Выберите элемент для добавления"
          >
            {filteredElements.map(({ categoryId, category, element, value }) => (
              <MenuItem key={value} value={value}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                  {category.icon}
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                      {element.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {element.description}
                    </Typography>
                  </Box>
                  <Chip 
                    label={category.title.replace(/📝|🃏|🎛️|📊|📈/, '').trim()} 
                    size="small" 
                    variant="outlined"
                    color="primary"
                    sx={{ ml: 1 }}
                  />
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Уведомление об успешном добавлении */}
        {selectedElementData && (
          <Paper sx={{ p: 2, mb: 2, backgroundColor: '#e8f5e8', border: '1px solid #4caf50' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Typography variant="body2" sx={{ color: '#2e7d32', fontWeight: 'bold' }}>
                ✅ Элемент добавлен:
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                {selectedElementData.element.name}
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary">
              {selectedElementData.element.description}
            </Typography>
          </Paper>
        )}

        {/* Счетчики элементов */}
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {Object.entries(CONTENT_ELEMENTS).map(([categoryId, category]) => (
            <Chip
              key={categoryId}
              label={`${category.title.replace(/📝|🃏|🎛️|📊|📈/, '').trim()}: ${category.elements.length}`}
              size="small"
              variant="outlined"
              color="default"
            />
          ))}
        </Box>

        {filteredElements.length === 0 && searchTerm && (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
            Элементы не найдены. Попробуйте изменить поисковый запрос.
          </Typography>
        )}
      </Box>
    );
};

export default ContentElementsLibrary; 