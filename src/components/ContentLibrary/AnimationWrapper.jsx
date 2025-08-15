import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';

// Предустановленные анимации
export const animationPresets = {
  none: {
    name: 'Без анимации',
    initial: {},
    animate: {},
    transition: {}
  },
  fadeIn: {
    name: 'Появление',
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.6 }
  },
  slideInLeft: {
    name: 'Слайд слева',
    initial: { x: -100, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    transition: { duration: 0.8 }
  },
  slideInRight: {
    name: 'Слайд справа',
    initial: { x: 100, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    transition: { duration: 0.8 }
  },
  slideInUp: {
    name: 'Слайд снизу',
    initial: { y: 50, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { duration: 0.8 }
  },
  slideInDown: {
    name: 'Слайд сверху',
    initial: { y: -50, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { duration: 0.8 }
  },
  scaleIn: {
    name: 'Увеличение',
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    transition: { duration: 0.6 }
  },
  scaleInBounce: {
    name: 'Увеличение с отскоком',
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    transition: { 
      duration: 0.8,
      type: "spring",
      stiffness: 260,
      damping: 20
    }
  },
  rotateIn: {
    name: 'Поворот',
    initial: { rotate: -180, scale: 0.8, opacity: 0 },
    animate: { rotate: 0, scale: 1, opacity: 1 },
    transition: { duration: 0.8 }
  },
  flipIn: {
    name: 'Переворот',
    initial: { rotateY: -90, opacity: 0, transformPerspective: 1000 },
    animate: { rotateY: 0, opacity: 1, transformPerspective: 1000 },
    transition: { duration: 0.8 }
  },
  zoomIn: {
    name: 'Приближение',
    initial: { scale: 0.3, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    transition: { duration: 0.6 }
  },
  bounceIn: {
    name: 'Прыжок',
    initial: { scale: 0.3, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    transition: {
      duration: 0.8,
      type: "spring",
      stiffness: 400,
      damping: 10
    }
  },
  slideInRotate: {
    name: 'Слайд с поворотом',
    initial: { x: -100, rotate: -10, opacity: 0 },
    animate: { x: 0, rotate: 0, opacity: 1 },
    transition: { duration: 0.8 }
  },
  elastic: {
    name: 'Эластичность',
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    transition: {
      duration: 1,
      type: "spring",
      stiffness: 100,
      damping: 8
    }
  },
  wobble: {
    name: 'Качание',
    initial: { x: 0, rotate: 0, opacity: 0 },
    animate: { 
      x: [0, -25, 20, -15, 10, -5, 0],
      rotate: [0, -5, 3, -3, 2, -1, 0],
      opacity: 1
    },
    transition: { 
      duration: 1,
      times: [0, 0.15, 0.3, 0.45, 0.6, 0.75, 1]
    }
  },
  typewriter: {
    name: 'Печатная машинка',
    initial: { width: 0, opacity: 0, overflow: "hidden" },
    animate: { width: "auto", opacity: 1, overflow: "hidden" },
    transition: { duration: 1.5, ease: "easeInOut" }
  },
  pulse: {
    name: 'Пульсация',
    initial: { scale: 1, opacity: 0 },
    animate: { 
      scale: [1, 1.05, 1],
      opacity: [0, 0.7, 1]
    },
    transition: { 
      duration: 0.8,
      times: [0, 0.5, 1]
    }
  },
  glitch: {
    name: 'Глитч эффект',
    initial: { x: 0, opacity: 0, filter: "hue-rotate(0deg)" },
    animate: { 
      x: [0, -2, 2, -1, 1, 0],
      opacity: [0, 0.5, 1, 0.8, 1, 1],
      filter: ["hue-rotate(0deg)", "hue-rotate(90deg)", "hue-rotate(180deg)", "hue-rotate(270deg)", "hue-rotate(360deg)", "hue-rotate(0deg)"]
    },
    transition: { 
      duration: 0.6,
      times: [0, 0.2, 0.4, 0.6, 0.8, 1]
    }
  },
  morphIn: {
    name: 'Морфинг',
    initial: { 
      borderRadius: "50%", 
      scale: 0.3, 
      opacity: 0,
      rotate: 90
    },
    animate: { 
      borderRadius: "8px", 
      scale: 1, 
      opacity: 1,
      rotate: 0
    },
    transition: { duration: 1 }
  },
  liquidFill: {
    name: 'Жидкое заполнение',
    initial: { scale: 0, opacity: 0, borderRadius: "50%" },
    animate: { scale: 1, opacity: 1, borderRadius: "0%" },
    transition: { duration: 1.2 }
  },
  curtainDrop: {
    name: 'Падение занавеса',
    initial: { scaleY: 0, opacity: 0, transformOrigin: "top" },
    animate: { scaleY: 1, opacity: 1, transformOrigin: "top" },
    transition: { duration: 0.8 }
  },
  rollIn: {
    name: 'Скатывание',
    initial: { rotate: -120, x: -100, opacity: 0 },
    animate: { rotate: 0, x: 0, opacity: 1 },
    transition: { 
      duration: 0.8,
      type: "spring",
      stiffness: 150
    }
  },
  heartbeat: {
    name: 'Сердцебиение',
    initial: { scale: 1, opacity: 0 },
    animate: { 
      scale: [1, 1.3, 1, 1.3, 1],
      opacity: [0, 0.5, 1, 0.5, 1]
    },
    transition: { 
      duration: 1.5,
      times: [0, 0.14, 0.28, 0.42, 1]
    }
  },
  shakeX: {
    name: 'Встряска по X',
    initial: { x: 0, opacity: 0 },
    animate: { 
      x: [0, -10, 10, -10, 10, 0],
      opacity: 1
    },
    transition: { 
      duration: 0.8,
      times: [0, 0.2, 0.4, 0.6, 0.8, 1]
    }
  },
  tada: {
    name: 'Та-да!',
    initial: { scale: 1, rotate: 0, opacity: 0 },
    animate: { 
      scale: [1, 0.9, 1.1, 1.1, 1.1, 1.1, 1.1, 1.1, 1.1, 1],
      rotate: [0, -3, -3, 3, -3, 3, -3, 3, -3, 0],
      opacity: 1
    },
    transition: { 
      duration: 1,
      times: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 1]
    }
  },
  backInUp: {
    name: 'Назад снизу',
    initial: { y: 100, scale: 0.7, opacity: 0 },
    animate: { y: 0, scale: 1, opacity: 1 },
    transition: { 
      duration: 0.8,
      type: "spring",
      stiffness: 100
    }
  },
  backInDown: {
    name: 'Назад сверху',
    initial: { y: -100, scale: 0.7, opacity: 0 },
    animate: { y: 0, scale: 1, opacity: 1 },
    transition: { 
      duration: 0.8,
      type: "spring",
      stiffness: 100
    }
  },
  // Дополнительные простые анимации
  slideInLeftBig: {
    name: 'Большой слайд слева',
    initial: { x: -300, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    transition: { duration: 0.8, ease: "easeOut" }
  },
  slideInRightBig: {
    name: 'Большой слайд справа',
    initial: { x: 300, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    transition: { duration: 0.8, ease: "easeOut" }
  },
  fadeInUp: {
    name: 'Появление снизу',
    initial: { y: 30, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { duration: 0.6, ease: "easeOut" }
  },
  fadeInDown: {
    name: 'Появление сверху',
    initial: { y: -30, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { duration: 0.6, ease: "easeOut" }
  },
  zoomInOut: {
    name: 'Увеличение-уменьшение',
    initial: { scale: 0.5, opacity: 0 },
    animate: { 
      scale: [0.5, 1.1, 1],
      opacity: [0, 0.8, 1]
    },
    transition: { 
      duration: 0.8,
      times: [0, 0.6, 1]
    }
  },
  swing: {
    name: 'Качели',
    initial: { rotate: 0, transformOrigin: "top center", opacity: 0 },
    animate: { 
      rotate: [0, 15, -10, 5, -5, 0],
      opacity: 1
    },
    transition: { 
      duration: 1,
      times: [0, 0.2, 0.4, 0.6, 0.8, 1]
    }
  }
};

const AnimationWrapper = ({ 
  children, 
  animationType = 'none',
  customAnimation = null,
  delay = 0,
  triggerOnView = true,
  triggerOnce = true,
  threshold = 0.1,
  disabled = false,
  className = '',
  style = {},
  // Поддержка передачи настроек как объекта
  ...animationSettings
}) => {
  // Если передан объект настроек, используем его
  const settings = animationSettings.animationType ? animationSettings : {
    animationType,
    delay,
    triggerOnView,
    triggerOnce,
    threshold,
    disabled
  };
  const ref = useRef(null);
  const isInView = useInView(ref, { once: settings.triggerOnce, amount: settings.threshold });
  const controls = useAnimation();

  useEffect(() => {
    if (settings.disabled || settings.animationType === 'none') return;

    // Валидация customAnimation
    if (customAnimation && (!customAnimation.animate || typeof customAnimation.animate !== 'object')) {
      console.warn('Invalid customAnimation structure:', customAnimation);
      return;
    }

    const animation = customAnimation || animationPresets[settings.animationType];
    if (!animation || !animation.animate) return;

    // Сброс анимации в начальное состояние
    if (animation.initial && controls && typeof controls.set === 'function') {
      try {
        controls.set(animation.initial);
      } catch (error) {
        console.warn('Animation set error:', error, {
          initial: animation.initial,
          animationType: settings.animationType
        });
      }
    }

    const startAnimation = () => {
      if (animation.animate && controls && typeof controls.start === 'function') {
        try {
          controls.start(animation.animate);
        } catch (error) {
          console.warn('Animation error:', error, {
            animation: animation.animate,
            animationType: settings.animationType
          });
        }
      } else {
        console.warn('Animation start failed: invalid controls or animation', {
          hasControls: !!controls,
          hasControlsStart: !!(controls && controls.start),
          hasAnimate: !!animation.animate,
          animationType: settings.animationType
        });
      }
    };

    if (settings.triggerOnView) {
      if (isInView) {
        setTimeout(startAnimation, settings.delay * 1000);
      }
    } else {
      setTimeout(startAnimation, settings.delay * 1000);
    }
  }, [isInView, settings.animationType, customAnimation, settings.delay, settings.triggerOnView, settings.disabled, controls]);

  if (settings.disabled || settings.animationType === 'none') {
    return <div className={className} style={style}>{children}</div>;
  }

  const animation = customAnimation || animationPresets[settings.animationType];
  if (!animation) {
    return <div className={className} style={style}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={style}
      initial={animation.initial}
      animate={controls}
      transition={animation.transition}
    >
      {children}
    </motion.div>
  );
};

export default AnimationWrapper; 