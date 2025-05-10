import React, { useState } from 'react';
import {
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  styled
} from '@mui/material';

const StyledTextField = styled(TextField)(({ theme, customStyles }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: customStyles?.inputBackgroundColor || '#f5f9ff',
    color: customStyles?.inputTextColor || '#1a1a1a',
    borderRadius: '8px',
    transition: 'all 0.3s ease',
    ...(customStyles?.inputTextColor?.includes('#ff') || customStyles?.inputTextColor?.includes('#00ff') ? {
      boxShadow: `0 0 5px ${customStyles.inputTextColor}33, 
                  0 0 10px ${customStyles.inputTextColor}33, 
                  0 0 15px ${customStyles.inputTextColor}33`,
      '&:hover': {
        boxShadow: `0 0 5px ${customStyles.inputTextColor}66, 
                    0 0 10px ${customStyles.inputTextColor}66, 
                    0 0 15px ${customStyles.inputTextColor}66`,
        backgroundColor: customStyles.inputBackgroundColor
      },
      '&.Mui-focused': {
        boxShadow: `0 0 5px ${customStyles.inputTextColor}, 
                    0 0 10px ${customStyles.inputTextColor}, 
                    0 0 15px ${customStyles.inputTextColor}`,
        backgroundColor: customStyles.inputBackgroundColor
      }
    } : {
      '&:hover': {
        backgroundColor: customStyles?.inputBackgroundColor 
          ? `${customStyles.inputBackgroundColor}dd`
          : '#f0f0f0',
      },
      '&.Mui-focused': {
        backgroundColor: customStyles?.inputBackgroundColor || '#ffffff',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      }
    }),
    '& fieldset': {
      borderColor: customStyles?.formBorderColor || '#e0e0e0',
      transition: 'all 0.3s ease',
      ...(customStyles?.inputTextColor?.includes('#ff') || customStyles?.inputTextColor?.includes('#00ff') ? {
        borderWidth: '2px'
      } : {})
    },
    '&:hover fieldset': {
      borderColor: customStyles?.formBorderColor || '#1565c0',
    },
    '&.Mui-focused fieldset': {
      borderColor: customStyles?.formBorderColor || '#1565c0',
      borderWidth: '2px',
    },
  },
  '& .MuiInputLabel-root': {
    color: customStyles?.labelColor || '#666666',
    '&.Mui-focused': {
      color: customStyles?.labelColor || '#1565c0',
    },
    ...(customStyles?.inputTextColor?.includes('#ff') || customStyles?.inputTextColor?.includes('#00ff') ? {
      textShadow: `0 0 5px ${customStyles.labelColor}66`
    } : {})
  },
  '& .MuiInputBase-input': {
    fontSize: '16px',
    padding: '12px 16px',
    '&::placeholder': {
      color: customStyles?.inputTextColor 
        ? `${customStyles.inputTextColor}99`
        : '#666666',
    },
  },
  '& .MuiFormHelperText-root': {
    color: customStyles?.labelColor 
      ? `${customStyles.labelColor}cc`
      : '#666666',
    marginLeft: '4px',
    fontSize: '0.875rem',
    ...(customStyles?.inputTextColor?.includes('#ff') || customStyles?.inputTextColor?.includes('#00ff') ? {
      textShadow: `0 0 5px ${customStyles.labelColor}66`
    } : {})
  },
}));

const StyledSelect = styled(Select)(({ theme, customStyles }) => ({
  backgroundColor: customStyles?.inputBackgroundColor || '#f5f9ff',
  color: customStyles?.inputTextColor || '#1a1a1a',
  borderRadius: '8px',
  transition: 'all 0.3s ease',
  ...(customStyles?.inputTextColor?.includes('#ff') || customStyles?.inputTextColor?.includes('#00ff') ? {
    boxShadow: `0 0 5px ${customStyles.inputTextColor}33, 
                0 0 10px ${customStyles.inputTextColor}33, 
                0 0 15px ${customStyles.inputTextColor}33`,
    '&:hover': {
      boxShadow: `0 0 5px ${customStyles.inputTextColor}66, 
                  0 0 10px ${customStyles.inputTextColor}66, 
                  0 0 15px ${customStyles.inputTextColor}66`,
      backgroundColor: customStyles.inputBackgroundColor
    },
    '&.Mui-focused': {
      boxShadow: `0 0 5px ${customStyles.inputTextColor}, 
                  0 0 10px ${customStyles.inputTextColor}, 
                  0 0 15px ${customStyles.inputTextColor}`,
      backgroundColor: customStyles.inputBackgroundColor
    }
  } : {
    '&:hover': {
      backgroundColor: customStyles?.inputBackgroundColor 
        ? `${customStyles.inputBackgroundColor}dd`
        : '#f0f0f0',
    },
    '&.Mui-focused': {
      backgroundColor: customStyles?.inputBackgroundColor || '#ffffff',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    }
  }),
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: customStyles?.formBorderColor || '#e0e0e0',
    transition: 'all 0.3s ease',
    ...(customStyles?.inputTextColor?.includes('#ff') || customStyles?.inputTextColor?.includes('#00ff') ? {
      borderWidth: '2px'
    } : {})
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: customStyles?.formBorderColor || '#1565c0',
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: customStyles?.formBorderColor || '#1565c0',
    borderWidth: '2px',
  }
}));

const StyledButton = styled(Button)(({ theme, customStyles }) => ({
  backgroundColor: customStyles?.buttonColor || '#1565c0',
  color: customStyles?.buttonTextColor || '#ffffff',
  borderRadius: '8px',
  padding: '12px 24px',
  fontSize: '16px',
  fontWeight: 600,
  textTransform: 'none',
  transition: 'all 0.3s ease',
  ...(customStyles?.buttonColor?.includes('#ff') || customStyles?.buttonColor?.includes('#00ff') ? {
    boxShadow: `0 0 5px ${customStyles.buttonColor}66,
                0 0 10px ${customStyles.buttonColor}66,
                0 0 15px ${customStyles.buttonColor}66`,
    '&:hover': {
      backgroundColor: customStyles.buttonColor,
      boxShadow: `0 0 5px ${customStyles.buttonColor},
                  0 0 10px ${customStyles.buttonColor},
                  0 0 15px ${customStyles.buttonColor},
                  0 0 20px ${customStyles.buttonColor}66`,
      transform: 'translateY(-2px)'
    }
  } : {
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    '&:hover': {
      backgroundColor: customStyles?.buttonColor 
        ? `${customStyles.buttonColor}dd`
        : '#1976d2',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
    }
  })
}));

const ContactForm = ({ customStyles }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    country: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    
    // Clear the form after submission
    setFormData({
      fullName: '',
      phone: '',
      email: '',
      country: '',
      message: ''
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <StyledTextField
            fullWidth
            label="ФИО"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
            customStyles={customStyles}
            helperText="Пожалуйста, введите ваше полное имя как в официальных документах"
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel 
              sx={{ 
                color: customStyles?.labelColor || '#666666',
                '&.Mui-focused': {
                  color: customStyles?.labelColor || '#1565c0',
                }
              }}
            >
              Страна
            </InputLabel>
            <StyledSelect
              name="country"
              value={formData.country}
              onChange={handleChange}
              required
              label="Страна"
              customStyles={customStyles}
            >
              <MenuItem value="RU">Россия</MenuItem>
              <MenuItem value="BY">Беларусь</MenuItem>
              <MenuItem value="KZ">Казахстан</MenuItem>
              <MenuItem value="UA">Украина</MenuItem>
              <MenuItem value="US">США</MenuItem>
              <MenuItem value="GB">Великобритания</MenuItem>
              <MenuItem value="DE">Германия</MenuItem>
              <MenuItem value="FR">Франция</MenuItem>
              <MenuItem value="IT">Италия</MenuItem>
              <MenuItem value="ES">Испания</MenuItem>
              <MenuItem value="CN">Китай</MenuItem>
              <MenuItem value="JP">Япония</MenuItem>
            </StyledSelect>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <StyledTextField
            fullWidth
            label="Номер телефона"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            type="tel"
            customStyles={customStyles}
            helperText="Введите номер телефона с кодом страны (например, +7 999 123-45-67)"
            inputProps={{
              pattern: "^\\+?[0-9\\s-()]{7,}$"
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <StyledTextField
            fullWidth
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            type="email"
            customStyles={customStyles}
            helperText="Введите корректный email адрес"
            inputProps={{
              pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <StyledTextField
            fullWidth
            label="Сообщение"
            name="message"
            value={formData.message}
            onChange={handleChange}
            multiline
            rows={4}
            customStyles={customStyles}
            helperText="Введите ваше сообщение (необязательно)"
          />
        </Grid>

        <Grid item xs={12}>
          <StyledButton
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            customStyles={customStyles}
          >
            Отправить сообщение
          </StyledButton>
        </Grid>
      </Grid>
    </form>
  );
};

export default ContactForm; 