import React, { useState, useEffect } from 'react';
import {
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  TextField,
  Chip,
  Stack,
  IconButton,
  Tooltip,
  Paper
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { ContentElementsLibrary } from '../ContentLibrary';
import ElementEditor from './ElementEditor';



const EnhancedSectionEditor = ({ 
  section, 
  sectionId, 
  onSectionChange,
  className = "",
  selectedElement = null,
  onElementDeselect = () => {}
}) => {
  const [activeAccordion, setActiveAccordion] = useState('content-library');

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setActiveAccordion(isExpanded ? panel : false);
  };

  return (
    <Box className={className} sx={{ mt: 2 }}>
      <Typography variant="h6" sx={{ mb: 2, color: '#1976d2' }}>
        🎨 Расширенное редактирование
      </Typography>









      {/* Библиотека элементов контента */}
      <Accordion 
        expanded={activeAccordion === 'content-library'}
        onChange={handleAccordionChange('content-library')}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle2">
            📚 Библиотека элементов контента
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <ContentElementsLibrary
            onAddElement={(elementData) => {
              // Добавляем новый элемент в секцию
              const currentElements = section.contentElements || [];
              const newElement = {
                id: Date.now(),
                ...elementData,
                timestamp: new Date().toISOString()
              };
              
              console.log('[EnhancedSectionEditor] Adding element to section:', sectionId, newElement);
              console.log('[EnhancedSectionEditor] Current elements:', currentElements);
              
              const updatedElements = [...currentElements, newElement];
              console.log('[EnhancedSectionEditor] Updated elements:', updatedElements);
              
              onSectionChange(sectionId, 'contentElements', updatedElements);
            }}
          />
          
          {/* Показываем добавленные элементы */}
          {section.contentElements && section.contentElements.length > 0 && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                Добавленные элементы:
              </Typography>
              {section.contentElements.map((element, index) => (
                <Chip
                  key={element.id}
                  label={`${element.type} (${element.category})`}
                  onDelete={() => {
                    const updatedElements = section.contentElements.filter(e => e.id !== element.id);
                    onSectionChange(sectionId, 'contentElements', updatedElements);
                  }}
                  sx={{ mr: 1, mb: 1 }}
                  size="small"
                />
              ))}
            </Box>
          )}
        </AccordionDetails>
      </Accordion>

      {/* Редактирование элементов */}
      {section.contentElements && section.contentElements.length > 0 && (
        <Accordion 
          expanded={activeAccordion === 'element-editor'}
          onChange={handleAccordionChange('element-editor')}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle2">
              ⚙️ Редактирование элементов ({section.contentElements.length})
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Настройте добавленные элементы контента:
              </Typography>
              
                            {section.contentElements.map((element) => (
                <ElementEditor
                  key={element.id}
                  element={element}
                  isSelected={selectedElement && 
                             selectedElement.sectionId === sectionId && 
                             selectedElement.elementId === element.id}
                  onElementChange={(elementId, field, value) => {
                    const updatedElements = section.contentElements.map(el => 
                      el.id === elementId 
                        ? { 
                            ...el, 
                            [field]: value,
                            // Если обновляем colorSettings, сохраняем их правильно
                            ...(field === 'colorSettings' ? { colorSettings: value } : {}),
                            // Также обновляем data.colorSettings если это объект данных
                            ...(field === 'colorSettings' && el.data ? { 
                              data: { ...el.data, colorSettings: value } 
                            } : {})
                          }
                        : el
                    );
                    onSectionChange(sectionId, 'contentElements', updatedElements);
                  }}
                  onElementDelete={(elementId) => {
                    const updatedElements = section.contentElements.filter(el => el.id !== elementId);
                    onSectionChange(sectionId, 'contentElements', updatedElements);
                    // Снимаем выделение если удаляем выбранный элемент
                    if (selectedElement && selectedElement.elementId === elementId) {
                      onElementDeselect();
                    }
                  }}
                  onElementDuplicate={(element) => {
                    const duplicatedElement = {
                      ...element,
                      id: Date.now(),
                      timestamp: new Date().toISOString()
                    };
                    const updatedElements = [...section.contentElements, duplicatedElement];
                    onSectionChange(sectionId, 'contentElements', updatedElements);
                  }}
                />
              ))}
            </Box>
          </AccordionDetails>
        </Accordion>
      )}

      {/* Предварительный просмотр секции */}
      <Paper sx={{ p: 2, mt: 2, backgroundColor: '#f8f9fa' }}>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          Предварительный просмотр секции:
        </Typography>
        <Box sx={{
          p: 2,
          border: '1px dashed #ccc',
          borderRadius: 1,
          backgroundColor: '#ffffff'
        }}>
          <Typography variant="h6" sx={{ color: '#1976d2', mb: 1 }}>
            {section.title || 'Заголовок секции'}
          </Typography>
          <Typography variant="body1" sx={{ color: '#666', mb: 2 }}>
            {section.description || 'Описание секции'}
          </Typography>
          
          {/* Показываем количество добавленных элементов */}
          {section.contentElements && section.contentElements.length > 0 && (
            <Box sx={{ mt: 2, p: 1, backgroundColor: 'rgba(25, 118, 210, 0.08)', borderRadius: 1 }}>
              <Typography variant="caption" color="primary">
                📚 Добавлено элементов контента: {section.contentElements.length}
              </Typography>
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default EnhancedSectionEditor; 