import React from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

const EditableElementWrapper = ({ 
  children, 
  editable = true, 
  onStartEdit,
  isEditing = false,
  containerClass = 'editable-element-container',
  editButtonClass = 'edit-button',
  editButtonTooltip = 'Редактировать'
}) => {
  if (!editable || isEditing) {
    return children;
  }

  return (
    <Box 
      className={containerClass}
      sx={{ 
        position: 'relative',
        [`&:hover .${editButtonClass}`]: {
          opacity: 1
        }
      }}
    >
      {children}
      
      {/* Кнопка редактирования */}
      <Box
        className={editButtonClass}
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          opacity: 0,
          transition: 'opacity 0.2s ease',
          zIndex: 10
        }}
      >
        <Tooltip title={editButtonTooltip}>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              if (onStartEdit) {
                onStartEdit();
              }
            }}
            sx={{
              backgroundColor: 'rgba(255,255,255,0.9)',
              boxShadow: 1,
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,1)',
                boxShadow: 2
              }
            }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default EditableElementWrapper; 