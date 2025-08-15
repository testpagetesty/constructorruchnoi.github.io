// Утилита для добавления поддержки анимаций в компоненты
// Эта функция поможет быстро обернуть любой компонент в AnimationWrapper

import React from 'react';
import AnimationWrapper from '../components/ContentLibrary/AnimationWrapper';

/**
 * HOC для добавления поддержки анимаций в любой компонент
 * @param {React.Component} WrappedComponent - Компонент для обертки
 * @param {string} defaultAnimation - Анимация по умолчанию
 * @returns {React.Component} - Компонент с поддержкой анимаций
 */
export const withAnimation = (WrappedComponent, defaultAnimation = 'fadeIn') => {
  const AnimatedComponent = (props) => {
    const { animationSettings = {}, ...otherProps } = props;
    
    // Настройки анимации по умолчанию
    const defaultSettings = {
      animationType: defaultAnimation,
      delay: 0,
      triggerOnView: true,
      triggerOnce: true,
      threshold: 0.1,
      disabled: false,
      ...animationSettings
    };

    return (
      <AnimationWrapper {...defaultSettings}>
        <WrappedComponent {...otherProps} />
      </AnimationWrapper>
    );
  };

  AnimatedComponent.displayName = `withAnimation(${WrappedComponent.displayName || WrappedComponent.name})`;
  return AnimatedComponent;
};

/**
 * Список компонентов, которые нужно обернуть анимациями
 */
export const COMPONENTS_TO_ANIMATE = [
  // Текстовые компоненты
  'RichTextEditor',
  'CodeBlock',
  'ListComponent',
  
  // Карточки
  'ImageCard',
  
  // Интерактивные элементы
  'AccordionComponent',
  'VideoPlayer',
  'QRCodeGenerator',
  'ColorPicker',
  'RatingComponent',
  'ConfettiComponent',
  'ShareButtons',
  'AnimatedBox',
  'ProgressBars',
  
  // Таблицы
  'DataTable',
  
  // Формы
  'AdvancedContactForm',
  'FormikRegistrationForm',
  'ReactSelectComponent',
  'DatePickerComponent',
  'StepperForm'
];

/**
 * Анимации по умолчанию для разных типов компонентов
 */
export const DEFAULT_ANIMATIONS = {
  text: 'fadeInUp',
  card: 'slideInUp',
  interactive: 'scaleIn',
  chart: 'slideInLeft',
  form: 'fadeIn',
  table: 'slideInUp'
};

export default withAnimation; 