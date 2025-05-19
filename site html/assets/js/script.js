
      document.addEventListener('DOMContentLoaded', function() {
        // Mobile menu toggle
        const menuToggle = document.querySelector('.menu-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (menuToggle && navMenu) {
          menuToggle.addEventListener('click', function() {
            menuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
          });

          // Close menu when clicking a link
          const navLinks = navMenu.querySelectorAll('a');
          navLinks.forEach(link => {
            link.addEventListener('click', () => {
              menuToggle.classList.remove('active');
              navMenu.classList.remove('active');
            });
          });

          // Close menu when clicking outside
          document.addEventListener('click', (e) => {
            if (!menuToggle.contains(e.target) && !navMenu.contains(e.target)) {
              menuToggle.classList.remove('active');
              navMenu.classList.remove('active');
            }
          });
        }

        // Smooth scroll to anchors
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
          anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
              target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
              });
            }
          });
        });

        // Form submission handler
        window.handleSubmit = function(event) {
          event.preventDefault();
          const form = document.getElementById('contactForm');
          const formData = new FormData(form);
          
          // Add server data sending here
          // For example, using fetch or XMLHttpRequest
          
          // Open merci.html in new tab
          window.open('merci.html', '_blank');
        };

        // Cards and images scroll animation
        const animatedEls = document.querySelectorAll('.card, .section-image img, .about-image img');
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('animate-on-scroll');
              observer.unobserve(entry.target);
            }
          });
        }, { threshold: 0.15 });
        animatedEls.forEach(el => observer.observe(el));
        
        // Инициализация автоматических слайд-шоу изображений
        initImageGalleries();
      });
      
      // Функция для инициализации всех галерей изображений на странице
      function initImageGalleries() {
        const galleries = document.querySelectorAll('.section-gallery');
        
        galleries.forEach(gallery => {
          const images = gallery.querySelectorAll('.gallery-img');
          const dots = gallery.querySelectorAll('.gallery-dot');
          let currentIndex = 0;
          let interval = null;
          
          // Если изображений меньше 2, не делаем ничего
          if (images.length < 2) return;
          
          // Функция для переключения слайдов
          function showSlide(index) {
            // Скрываем все изображения
            images.forEach(img => img.style.display = 'none');
            
            // Сбрасываем активные точки
            dots.forEach(dot => dot.style.backgroundColor = 'rgba(255,255,255,0.5)');
            
            // Показываем выбранное изображение
            if (images[index]) {
              images[index].style.display = 'block';
            }
            
            // Обновляем активную точку
            if (dots[index]) {
              dots[index].style.backgroundColor = '#ffffff';
            }
            
            currentIndex = index;
          }
          
          // Устанавливаем обработчики для точек навигации
          dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
              clearInterval(interval); // Останавливаем автопрокрутку при ручном переключении
              showSlide(index);
              startAutoScroll(); // Перезапускаем автопрокрутку
            });
          });
          
          // Функция для запуска автопрокрутки
          function startAutoScroll() {
            // Очищаем предыдущий интервал, если он был
            if (interval) {
              clearInterval(interval);
            }
            
            // Устанавливаем новый интервал
            interval = setInterval(() => {
              const nextIndex = (currentIndex + 1) % images.length;
              showSlide(nextIndex);
            }, 3000); // Интервал 3 секунды между слайдами
          }
          
          // Добавляем обработчики для остановки автопрокрутки при наведении
          gallery.addEventListener('mouseenter', () => {
            clearInterval(interval);
          });
          
          gallery.addEventListener('mouseleave', () => {
            startAutoScroll();
          });
          
          // Запускаем автопрокрутку при загрузке
          startAutoScroll();
          
          // Добавляем свайп на мобильных устройствах
          let touchStartX = 0;
          let touchEndX = 0;
          
          gallery.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
          }, false);
          
          gallery.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
          }, false);
          
          function handleSwipe() {
            if (touchEndX < touchStartX) {
              // Свайп влево - следующий слайд
              clearInterval(interval);
              showSlide((currentIndex + 1) % images.length);
              startAutoScroll();
            } else if (touchEndX > touchStartX) {
              // Свайп вправо - предыдущий слайд
              clearInterval(interval);
              showSlide((currentIndex - 1 + images.length) % images.length);
              startAutoScroll();
            }
          }
        });
      }
    