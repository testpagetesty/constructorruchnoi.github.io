import React from 'react';
import AnimationWrapper from '../components/ContentLibrary/AnimationWrapper';
import AnimationControls from '../components/ContentLibrary/AnimationControls';
import { Box, Typography } from '@mui/material';

/**
 * HOC для добавления анимаций в компоненты
 * @param {React.Component} WrappedComponent - Компонент для обертки
 * @param {Object} defaultAnimationSettings - Настройки анимации по умолчанию
 * @param {string} componentName - Название компонента для режима конструктора
 */
export const withAnimation = (WrappedComponent, defaultAnimationSettings = {
  type: 'fadeIn',
  duration: 0.6,
  delay: 0
}, componentName = 'Component') => {
  return function AnimatedComponent(props) {
    const {
      animationSettings = defaultAnimationSettings,
      isConstructorMode = false,
      onUpdate,
      ...otherProps
    } = props;

    return (
      <AnimationWrapper animationSettings={animationSettings}>
        {/* Режим конструктора */}
        {isConstructorMode && (
          <Box sx={{ p: 2, backgroundColor: '#f5f5f5', borderBottom: '1px solid #e0e0e0', mb: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Настройки {componentName}
            </Typography>
            <AnimationControls
              animationSettings={animationSettings}
              onAnimationChange={(newSettings) => {
                if (onUpdate) {
                  onUpdate({ animationSettings: newSettings });
                }
              }}
            />
          </Box>
        )}

        <WrappedComponent 
          {...otherProps}
          animationSettings={animationSettings}
          isConstructorMode={isConstructorMode}
          onUpdate={onUpdate}
        />
      </AnimationWrapper>
    );
  };
};

export default withAnimation; 