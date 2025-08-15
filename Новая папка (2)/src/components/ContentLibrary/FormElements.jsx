import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, TextField, Button, Select, MenuItem, FormControl, InputLabel, Grid, Switch, FormControlLabel, Slider, Chip, Autocomplete, Avatar, Stepper, Step, StepLabel, StepContent, RadioGroup, Radio, FormLabel, Checkbox, FormGroup, Divider } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import ReactSelect from 'react-select';
import dynamic from 'next/dynamic';
import "react-datepicker/dist/react-datepicker.css";
import AnimationWrapper from './AnimationWrapper';
import AnimationControls from './AnimationControls';
import EditableElementWrapper from './EditableElementWrapper';

// Динамический импорт DatePicker для клиентской стороны
const DatePicker = dynamic(() => import('react-datepicker'), { ssr: false });

// Валидационная схема для Formik
const contactSchema = Yup.object().shape({
  firstName: Yup.string().min(2, 'Слишком короткое!').max(50, 'Слишком длинное!').required('Обязательное поле'),
  lastName: Yup.string().min(2, 'Слишком короткое!').max(50, 'Слишком длинное!').required('Обязательное поле'),
  email: Yup.string().email('Неверный email').required('Обязательное поле'),
  age: Yup.number().positive('Должно быть положительным').integer('Должно быть целым числом').required('Обязательное поле'),
});

export const AdvancedContactForm = ({ 
  isPreview = false,
  animationSettings = {
    animationType: 'fadeIn',
    delay: 0,
    triggerOnView: true,
    triggerOnce: true,
    threshold: 0.1,
    disabled: false
  },
  isConstructorMode = false,
  constructorMode = false,
  isEditing = false,
  onUpdate = () => {},
  onSave = null,
  onCancel = null,
  // Добавляем пропсы для настройки полей
  formTitle,
  fieldLabels: propFieldLabels,
  placeholders: propPlaceholders,
  subjectOptions: propSubjectOptions,
  validationMessages: propValidationMessages
}) => {
  const [title, setTitle] = useState(formTitle || 'Расширенная форма обратной связи');
  const [fieldLabels, setFieldLabels] = useState(propFieldLabels || {
    name: 'Имя',
    email: 'Email',
    phone: 'Телефон',
    company: 'Компания',
    subject: 'Тема обращения',
    message: 'Сообщение',
    newsletter: 'Подписаться на новости',
    terms: 'Я согласен с условиями использования',
    submitButton: 'Отправить',
    submittingButton: 'Отправка...'
  });
  const [subjectOptions, setSubjectOptions] = useState(propSubjectOptions || [
    { value: 'general', label: 'Общий вопрос' },
    { value: 'support', label: 'Техническая поддержка' },
    { value: 'sales', label: 'Отдел продаж' },
    { value: 'partnership', label: 'Партнерство' }
  ]);
  const [placeholders, setPlaceholders] = useState(propPlaceholders || {
    name: 'Введите ваше имя',
    email: 'example@domain.com',
    phone: '+7 (999) 123-45-67',
    company: 'Название компании',
    message: 'Опишите ваш вопрос подробно...'
  });
  const [validationMessages, setValidationMessages] = useState(propValidationMessages || {
    nameRequired: 'Имя обязательно',
    emailRequired: 'Email обязателен',
    emailInvalid: 'Неверный формат email',
    phoneRequired: 'Телефон обязателен',
    phoneInvalid: 'Неверный формат телефона',
    subjectRequired: 'Выберите тему',
    messageRequired: 'Сообщение обязательно',
    termsRequired: 'Необходимо согласие с условиями'
  });
  const [localEditing, setLocalEditing] = useState(false);
  const [editData, setEditData] = useState({
    title,
    fieldLabels,
    subjectOptions,
    placeholders,
    validationMessages,
    animationSettings
  });

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  // Обновляем состояния при изменении пропсов
  useEffect(() => {
    console.log('[AdvancedContactForm] formTitle prop changed:', formTitle);
    if (formTitle) setTitle(formTitle);
  }, [formTitle]);

  useEffect(() => {
    console.log('[AdvancedContactForm] propFieldLabels changed:', propFieldLabels);
    if (propFieldLabels) setFieldLabels(propFieldLabels);
  }, [propFieldLabels]);

  useEffect(() => {
    console.log('[AdvancedContactForm] propPlaceholders changed:', propPlaceholders);
    if (propPlaceholders) setPlaceholders(propPlaceholders);
  }, [propPlaceholders]);

  useEffect(() => {
    console.log('[AdvancedContactForm] propSubjectOptions changed:', propSubjectOptions);
    if (propSubjectOptions) setSubjectOptions(propSubjectOptions);
  }, [propSubjectOptions]);

  useEffect(() => {
    console.log('[AdvancedContactForm] propValidationMessages changed:', propValidationMessages);
    if (propValidationMessages) setValidationMessages(propValidationMessages);
  }, [propValidationMessages]);

  // Отладочная информация при рендере
  useEffect(() => {
    console.log('[AdvancedContactForm] Component props:', {
      formTitle,
      propFieldLabels,
      propPlaceholders,
      propSubjectOptions,
      propValidationMessages
    });
  }, [formTitle, propFieldLabels, propPlaceholders, propSubjectOptions, propValidationMessages]);

  const handleDoubleClick = () => {
    if (constructorMode || isConstructorMode) {
      setLocalEditing(true);
    }
  };

  const handleSave = () => {
    setLocalEditing(false);
    setTitle(editData.title);
    setFieldLabels(editData.fieldLabels);
    setSubjectOptions(editData.subjectOptions);
    setPlaceholders(editData.placeholders);
    setValidationMessages(editData.validationMessages);
    if (onSave) {
      onSave(editData);
    } else {
      onUpdate(editData);
    }
  };

  const handleCancel = () => {
    setLocalEditing(false);
    setEditData({
      title,
      fieldLabels,
      subjectOptions,
      placeholders,
      validationMessages,
      animationSettings
    });
    if (onCancel) {
      onCancel();
    }
  };

  const handleAnimationUpdate = (newAnimationSettings) => {
    setEditData({ ...editData, animationSettings: newAnimationSettings });
  };

  const isCurrentlyEditing = isEditing || localEditing;

  const onSubmit = async (data) => {
    console.log('Form data:', data);
    await new Promise(resolve => setTimeout(resolve, 1000));
    alert('Форма успешно отправлена!');
  };

  return (
    <EditableElementWrapper 
      editable={constructorMode || isConstructorMode} 
      onStartEdit={handleDoubleClick}
      isEditing={isCurrentlyEditing}
    >
      <AnimationWrapper key={JSON.stringify(editData.animationSettings)} {...(editData.animationSettings || animationSettings)}>
        <Paper sx={{ p: 3, mb: 2 }}>
          {isCurrentlyEditing ? (
            <Box>
              <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
                Редактирование формы обратной связи
              </Typography>
              
              <TextField
                label="Заголовок формы"
                value={editData.title}
                onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                fullWidth
                size="small"
                sx={{ mb: 2 }}
              />

              {/* Редактирование меток полей */}
              <Typography variant="subtitle2" gutterBottom>Названия полей:</Typography>
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Метка поля 'Имя'"
                    value={editData.fieldLabels.name}
                    onChange={(e) => setEditData({ 
                      ...editData, 
                      fieldLabels: { ...editData.fieldLabels, name: e.target.value }
                    })}
                    fullWidth
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Метка поля 'Email'"
                    value={editData.fieldLabels.email}
                    onChange={(e) => setEditData({ 
                      ...editData, 
                      fieldLabels: { ...editData.fieldLabels, email: e.target.value }
                    })}
                    fullWidth
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Метка поля 'Телефон'"
                    value={editData.fieldLabels.phone}
                    onChange={(e) => setEditData({ 
                      ...editData, 
                      fieldLabels: { ...editData.fieldLabels, phone: e.target.value }
                    })}
                    fullWidth
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Метка поля 'Компания'"
                    value={editData.fieldLabels.company}
                    onChange={(e) => setEditData({ 
                      ...editData, 
                      fieldLabels: { ...editData.fieldLabels, company: e.target.value }
                    })}
                    fullWidth
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Метка поля 'Тема'"
                    value={editData.fieldLabels.subject}
                    onChange={(e) => setEditData({ 
                      ...editData, 
                      fieldLabels: { ...editData.fieldLabels, subject: e.target.value }
                    })}
                    fullWidth
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Метка поля 'Сообщение'"
                    value={editData.fieldLabels.message}
                    onChange={(e) => setEditData({ 
                      ...editData, 
                      fieldLabels: { ...editData.fieldLabels, message: e.target.value }
                    })}
                    fullWidth
                    size="small"
                  />
                </Grid>
              </Grid>

              {/* Редактирование плейсхолдеров */}
              <Typography variant="subtitle2" gutterBottom>Плейсхолдеры полей:</Typography>
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Плейсхолдер поля 'Имя'"
                    value={editData.placeholders.name}
                    onChange={(e) => setEditData({ 
                      ...editData, 
                      placeholders: { ...editData.placeholders, name: e.target.value }
                    })}
                    fullWidth
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Плейсхолдер поля 'Email'"
                    value={editData.placeholders.email}
                    onChange={(e) => setEditData({ 
                      ...editData, 
                      placeholders: { ...editData.placeholders, email: e.target.value }
                    })}
                    fullWidth
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Плейсхолдер поля 'Телефон'"
                    value={editData.placeholders.phone}
                    onChange={(e) => setEditData({ 
                      ...editData, 
                      placeholders: { ...editData.placeholders, phone: e.target.value }
                    })}
                    fullWidth
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Плейсхолдер поля 'Компания'"
                    value={editData.placeholders.company}
                    onChange={(e) => setEditData({ 
                      ...editData, 
                      placeholders: { ...editData.placeholders, company: e.target.value }
                    })}
                    fullWidth
                    size="small"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Плейсхолдер поля 'Сообщение'"
                    value={editData.placeholders.message}
                    onChange={(e) => setEditData({ 
                      ...editData, 
                      placeholders: { ...editData.placeholders, message: e.target.value }
                    })}
                    fullWidth
                    size="small"
                  />
                </Grid>
              </Grid>

              {/* Редактирование опций темы */}
              <Typography variant="subtitle2" gutterBottom>Опции темы обращения:</Typography>
              <Grid container spacing={2} sx={{ mb: 2 }}>
                {editData.subjectOptions.map((option, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <TextField
                      label={`Опция ${index + 1}`}
                      value={option.label}
                      onChange={(e) => {
                        const newOptions = [...editData.subjectOptions];
                        newOptions[index].label = e.target.value;
                        setEditData({ ...editData, subjectOptions: newOptions });
                      }}
                      fullWidth
                      size="small"
                    />
                  </Grid>
                ))}
              </Grid>

              {/* Редактирование текста кнопок и чекбоксов */}
              <Typography variant="subtitle2" gutterBottom>Текст элементов:</Typography>
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Текст кнопки отправки"
                    value={editData.fieldLabels.submitButton}
                    onChange={(e) => setEditData({ 
                      ...editData, 
                      fieldLabels: { ...editData.fieldLabels, submitButton: e.target.value }
                    })}
                    fullWidth
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Текст кнопки при отправке"
                    value={editData.fieldLabels.submittingButton}
                    onChange={(e) => setEditData({ 
                      ...editData, 
                      fieldLabels: { ...editData.fieldLabels, submittingButton: e.target.value }
                    })}
                    fullWidth
                    size="small"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Текст чекбокса подписки"
                    value={editData.fieldLabels.newsletter}
                    onChange={(e) => setEditData({ 
                      ...editData, 
                      fieldLabels: { ...editData.fieldLabels, newsletter: e.target.value }
                    })}
                    fullWidth
                    size="small"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Текст согласия с условиями"
                    value={editData.fieldLabels.terms}
                    onChange={(e) => setEditData({ 
                      ...editData, 
                      fieldLabels: { ...editData.fieldLabels, terms: e.target.value }
                    })}
                    fullWidth
                    size="small"
                  />
                </Grid>
              </Grid>

              {/* Настройки анимации */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>Настройки анимации:</Typography>
                <AnimationControls
                  animationSettings={editData.animationSettings || animationSettings}
                  onUpdate={handleAnimationUpdate}
                />
              </Box>
              
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                <Button onClick={handleCancel}>Отмена</Button>
                <Button variant="contained" onClick={handleSave}>Сохранить</Button>
              </Box>
            </Box>
          ) : (
            <Box>
              {/* Режим конструктора */}
              {isConstructorMode && !constructorMode && (
                <Box sx={{ p: 2, backgroundColor: '#f5f5f5', borderBottom: '1px solid #e0e0e0', mb: 2 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Настройки Contact Form
                  </Typography>
                  <AnimationControls
                    animationSettings={animationSettings}
                    onUpdate={(newSettings) => {
                      if (onUpdate) {
                        onUpdate({ animationSettings: newSettings });
                      }
                    }}
                  />
                </Box>
              )}

              <Typography variant="h6" sx={{ mb: 2 }}>{title}</Typography>
              {!isPreview && !constructorMode && !isConstructorMode && (
                <Box sx={{ mb: 2 }}>
                  <TextField
                    label="Заголовок формы"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    fullWidth
                    size="small"
                  />
                </Box>
              )}

              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      {...register('name', { required: validationMessages.nameRequired })}
                      label={fieldLabels.name}
                      placeholder={placeholders.name}
                      error={!!errors.name}
                      helperText={errors.name?.message}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      {...register('email', { 
                        required: validationMessages.emailRequired,
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: validationMessages.emailInvalid
                        }
                      })}
                      label={fieldLabels.email}
                      placeholder={placeholders.email}
                      error={!!errors.email}
                      helperText={errors.email?.message}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      {...register('phone')}
                      label={fieldLabels.phone}
                      placeholder={placeholders.phone}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      {...register('company')}
                      label={fieldLabels.company}
                      placeholder={placeholders.company}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>{fieldLabels.subject}</InputLabel>
                      <Select
                        {...register('subject', { required: validationMessages.subjectRequired })}
                        defaultValue=""
                        error={!!errors.subject}
                      >
                        {subjectOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      {...register('message', { required: validationMessages.messageRequired })}
                      label={fieldLabels.message}
                      placeholder={placeholders.message}
                      multiline
                      rows={4}
                      fullWidth
                      error={!!errors.message}
                      helperText={errors.message?.message}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          {...register('newsletter')}
                        />
                      }
                      label={fieldLabels.newsletter}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          {...register('terms', { required: validationMessages.termsRequired })}
                        />
                      }
                      label={fieldLabels.terms}
                    />
                    {errors.terms && (
                      <Typography variant="caption" color="error" display="block">
                        {errors.terms.message}
                      </Typography>
                    )}
                  </Grid>
                </Grid>
                <Box sx={{ mt: 3 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={isSubmitting}
                    fullWidth
                  >
                    {isSubmitting ? fieldLabels.submittingButton : fieldLabels.submitButton}
                  </Button>
                </Box>
              </form>
            </Box>
          )}
        </Paper>
      </AnimationWrapper>
    </EditableElementWrapper>
  );
};

export const FormikRegistrationForm = ({ 
  isPreview = false,
  animationSettings = {
    animationType: 'slideInUp',
    delay: 0.2,
    triggerOnView: true,
    triggerOnce: true,
    threshold: 0.1,
    disabled: false
  },
  isConstructorMode = false,
  constructorMode = false,
  isEditing = false,
  onUpdate = () => {},
  onSave = null,
  onCancel = null
}) => {
  const [title, setTitle] = useState('Форма регистрации (Formik)');
  const [fieldLabels, setFieldLabels] = useState({
    firstName: 'Имя',
    lastName: 'Фамилия',
    email: 'Email',
    password: 'Пароль',
    confirmPassword: 'Подтверждение пароля',
    age: 'Возраст',
    gender: 'Пол',
    interests: 'Интересы',
    newsletter: 'Подписаться на рассылку',
    submitButton: 'Зарегистрироваться',
    submittingButton: 'Регистрация...'
  });
  const [genderOptions, setGenderOptions] = useState([
    { value: 'male', label: 'Мужской' },
    { value: 'female', label: 'Женский' },
    { value: 'other', label: 'Другой' }
  ]);
  const [interestOptions, setInterestOptions] = useState([
    'Спорт', 'Музыка', 'Технологии', 'Путешествия', 'Кулинария'
  ]);
  const [validationMessages, setValidationMessages] = useState({
    firstNameRequired: 'Имя обязательно',
    lastNameRequired: 'Фамилия обязательна',
    emailRequired: 'Email обязателен',
    emailInvalid: 'Неверный email',
    passwordRequired: 'Пароль обязателен',
    passwordMinLength: 'Минимум 6 символов',
    confirmPasswordRequired: 'Подтверждение пароля обязательно',
    passwordsMustMatch: 'Пароли должны совпадать',
    ageRequired: 'Возраст обязателен',
    ageMinimum: 'Минимальный возраст 18 лет',
    genderRequired: 'Выберите пол'
  });
  const [localEditing, setLocalEditing] = useState(false);
  const [editData, setEditData] = useState({
    title,
    fieldLabels,
    genderOptions,
    interestOptions,
    validationMessages,
    animationSettings
  });

  const handleDoubleClick = () => {
    if (constructorMode || isConstructorMode) {
      setLocalEditing(true);
    }
  };

  const handleSave = () => {
    setLocalEditing(false);
    setTitle(editData.title);
    setFieldLabels(editData.fieldLabels);
    setGenderOptions(editData.genderOptions);
    setInterestOptions(editData.interestOptions);
    setValidationMessages(editData.validationMessages);
    if (onSave) {
      onSave(editData);
    } else {
      onUpdate(editData);
    }
  };

  const handleCancel = () => {
    setLocalEditing(false);
    setEditData({
      title,
      fieldLabels,
      genderOptions,
      interestOptions,
      validationMessages,
      animationSettings
    });
    if (onCancel) {
      onCancel();
    }
  };

  const handleAnimationUpdate = (newAnimationSettings) => {
    setEditData({ ...editData, animationSettings: newAnimationSettings });
  };

  const isCurrentlyEditing = isEditing || localEditing;

  const initialValues = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '',
    gender: '',
    interests: [],
    newsletter: false,
  };

  const validationSchema = Yup.object({
    firstName: Yup.string().required(validationMessages.firstNameRequired),
    lastName: Yup.string().required(validationMessages.lastNameRequired),
    email: Yup.string().email(validationMessages.emailInvalid).required(validationMessages.emailRequired),
    password: Yup.string().min(6, validationMessages.passwordMinLength).required(validationMessages.passwordRequired),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], validationMessages.passwordsMustMatch)
      .required(validationMessages.confirmPasswordRequired),
    age: Yup.number().min(18, validationMessages.ageMinimum).required(validationMessages.ageRequired),
    gender: Yup.string().required(validationMessages.genderRequired),
  });

  const onSubmit = (values, { setSubmitting, resetForm }) => {
    console.log('Registration data:', values);
    setTimeout(() => {
      alert('Регистрация успешна!');
      resetForm();
      setSubmitting(false);
    }, 1000);
  };

  return (
    <EditableElementWrapper 
      editable={constructorMode || isConstructorMode} 
      onStartEdit={handleDoubleClick}
      isEditing={isCurrentlyEditing}
    >
      <AnimationWrapper {...(editData.animationSettings || animationSettings)}>
        <Paper sx={{ p: 3, mb: 2 }}>
          {isCurrentlyEditing ? (
            <Box>
              <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
                Редактирование формы регистрации
              </Typography>
              
              <TextField
                label="Заголовок формы"
                value={editData.title}
                onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                fullWidth
                size="small"
                sx={{ mb: 2 }}
              />

              {/* Редактирование меток полей */}
              <Typography variant="subtitle2" gutterBottom>Названия полей:</Typography>
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Метка поля 'Имя'"
                    value={editData.fieldLabels.firstName}
                    onChange={(e) => setEditData({ 
                      ...editData, 
                      fieldLabels: { ...editData.fieldLabels, firstName: e.target.value }
                    })}
                    fullWidth
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Метка поля 'Фамилия'"
                    value={editData.fieldLabels.lastName}
                    onChange={(e) => setEditData({ 
                      ...editData, 
                      fieldLabels: { ...editData.fieldLabels, lastName: e.target.value }
                    })}
                    fullWidth
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Метка поля 'Email'"
                    value={editData.fieldLabels.email}
                    onChange={(e) => setEditData({ 
                      ...editData, 
                      fieldLabels: { ...editData.fieldLabels, email: e.target.value }
                    })}
                    fullWidth
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Метка поля 'Пароль'"
                    value={editData.fieldLabels.password}
                    onChange={(e) => setEditData({ 
                      ...editData, 
                      fieldLabels: { ...editData.fieldLabels, password: e.target.value }
                    })}
                    fullWidth
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Метка поля 'Подтверждение пароля'"
                    value={editData.fieldLabels.confirmPassword}
                    onChange={(e) => setEditData({ 
                      ...editData, 
                      fieldLabels: { ...editData.fieldLabels, confirmPassword: e.target.value }
                    })}
                    fullWidth
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Метка поля 'Возраст'"
                    value={editData.fieldLabels.age}
                    onChange={(e) => setEditData({ 
                      ...editData, 
                      fieldLabels: { ...editData.fieldLabels, age: e.target.value }
                    })}
                    fullWidth
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Метка поля 'Пол'"
                    value={editData.fieldLabels.gender}
                    onChange={(e) => setEditData({ 
                      ...editData, 
                      fieldLabels: { ...editData.fieldLabels, gender: e.target.value }
                    })}
                    fullWidth
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Метка поля 'Интересы'"
                    value={editData.fieldLabels.interests}
                    onChange={(e) => setEditData({ 
                      ...editData, 
                      fieldLabels: { ...editData.fieldLabels, interests: e.target.value }
                    })}
                    fullWidth
                    size="small"
                  />
                </Grid>
              </Grid>

              {/* Редактирование опций пола */}
              <Typography variant="subtitle2" gutterBottom>Опции пола:</Typography>
              <Grid container spacing={2} sx={{ mb: 2 }}>
                {editData.genderOptions.map((option, index) => (
                  <Grid item xs={12} sm={4} key={index}>
                    <TextField
                      label={`Опция ${index + 1}`}
                      value={option.label}
                      onChange={(e) => {
                        const newOptions = [...editData.genderOptions];
                        newOptions[index].label = e.target.value;
                        setEditData({ ...editData, genderOptions: newOptions });
                      }}
                      fullWidth
                      size="small"
                    />
                  </Grid>
                ))}
              </Grid>

              {/* Редактирование интересов */}
              <Typography variant="subtitle2" gutterBottom>Варианты интересов:</Typography>
              <Grid container spacing={2} sx={{ mb: 2 }}>
                {editData.interestOptions.map((interest, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <TextField
                      label={`Интерес ${index + 1}`}
                      value={interest}
                      onChange={(e) => {
                        const newInterests = [...editData.interestOptions];
                        newInterests[index] = e.target.value;
                        setEditData({ ...editData, interestOptions: newInterests });
                      }}
                      fullWidth
                      size="small"
                    />
                  </Grid>
                ))}
              </Grid>

              {/* Редактирование текста кнопок */}
              <Typography variant="subtitle2" gutterBottom>Текст кнопок:</Typography>
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Текст кнопки отправки"
                    value={editData.fieldLabels.submitButton}
                    onChange={(e) => setEditData({ 
                      ...editData, 
                      fieldLabels: { ...editData.fieldLabels, submitButton: e.target.value }
                    })}
                    fullWidth
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Текст кнопки при отправке"
                    value={editData.fieldLabels.submittingButton}
                    onChange={(e) => setEditData({ 
                      ...editData, 
                      fieldLabels: { ...editData.fieldLabels, submittingButton: e.target.value }
                    })}
                    fullWidth
                    size="small"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Текст чекбокса подписки"
                    value={editData.fieldLabels.newsletter}
                    onChange={(e) => setEditData({ 
                      ...editData, 
                      fieldLabels: { ...editData.fieldLabels, newsletter: e.target.value }
                    })}
                    fullWidth
                    size="small"
                  />
                </Grid>
              </Grid>

              {/* Настройки анимации */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>Настройки анимации:</Typography>
                <AnimationControls
                  animationSettings={editData.animationSettings || animationSettings}
                  onUpdate={handleAnimationUpdate}
                />
              </Box>
              
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                <Button onClick={handleCancel}>Отмена</Button>
                <Button variant="contained" onClick={handleSave}>Сохранить</Button>
              </Box>
            </Box>
          ) : (
            <Box>
              {/* Режим конструктора */}
              {isConstructorMode && !constructorMode && (
                <Box sx={{ p: 2, backgroundColor: '#f5f5f5', borderBottom: '1px solid #e0e0e0', mb: 2 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Настройки Registration Form
                  </Typography>
                  <AnimationControls
                    animationSettings={animationSettings}
                    onUpdate={(newSettings) => {
                      if (onUpdate) {
                        onUpdate({ animationSettings: newSettings });
                      }
                    }}
                  />
                </Box>
              )}

              <Typography variant="h6" sx={{ mb: 2 }}>{title}</Typography>
              {!isPreview && !constructorMode && !isConstructorMode && (
                <Box sx={{ mb: 2 }}>
                  <TextField
                    label="Заголовок формы"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    fullWidth
                    size="small"
                  />
                </Box>
              )}
              
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
              >
                {({ values, errors, touched, handleChange, handleBlur, isSubmitting, setFieldValue }) => (
                  <Form>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          name="firstName"
                          label={fieldLabels.firstName}
                          value={values.firstName}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.firstName && !!errors.firstName}
                          helperText={touched.firstName && errors.firstName}
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          name="lastName"
                          label={fieldLabels.lastName}
                          value={values.lastName}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.lastName && !!errors.lastName}
                          helperText={touched.lastName && errors.lastName}
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          name="email"
                          label={fieldLabels.email}
                          type="email"
                          value={values.email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.email && !!errors.email}
                          helperText={touched.email && errors.email}
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          name="password"
                          label={fieldLabels.password}
                          type="password"
                          value={values.password}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.password && !!errors.password}
                          helperText={touched.password && errors.password}
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          name="confirmPassword"
                          label={fieldLabels.confirmPassword}
                          type="password"
                          value={values.confirmPassword}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.confirmPassword && !!errors.confirmPassword}
                          helperText={touched.confirmPassword && errors.confirmPassword}
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          name="age"
                          label={fieldLabels.age}
                          type="number"
                          value={values.age}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.age && !!errors.age}
                          helperText={touched.age && errors.age}
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth error={touched.gender && !!errors.gender}>
                          <InputLabel>{fieldLabels.gender}</InputLabel>
                          <Select
                            name="gender"
                            value={values.gender}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          >
                            {genderOptions.map((option) => (
                              <MenuItem key={option.value} value={option.value}>
                                {option.label}
                              </MenuItem>
                            ))}
                          </Select>
                          {touched.gender && errors.gender && (
                            <Typography variant="caption" color="error">
                              {errors.gender}
                            </Typography>
                          )}
                        </FormControl>
                      </Grid>
                      <Grid item xs={12}>
                        <FormControl component="fieldset">
                          <FormLabel component="legend">{fieldLabels.interests}</FormLabel>
                          <FormGroup row>
                            {interestOptions.map((interest) => (
                              <FormControlLabel
                                key={interest}
                                control={
                                  <Checkbox
                                    checked={values.interests.includes(interest)}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setFieldValue('interests', [...values.interests, interest]);
                                      } else {
                                        setFieldValue('interests', values.interests.filter(i => i !== interest));
                                      }
                                    }}
                                  />
                                }
                                label={interest}
                              />
                            ))}
                          </FormGroup>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              name="newsletter"
                              checked={values.newsletter}
                              onChange={handleChange}
                            />
                          }
                          label={fieldLabels.newsletter}
                        />
                      </Grid>
                    </Grid>
                    <Box sx={{ mt: 3 }}>
                      <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        disabled={isSubmitting}
                        fullWidth
                      >
                        {isSubmitting ? fieldLabels.submittingButton : fieldLabels.submitButton}
                      </Button>
                    </Box>
                  </Form>
                )}
              </Formik>
            </Box>
          )}
        </Paper>
      </AnimationWrapper>
    </EditableElementWrapper>
  );
};

export const ReactSelectComponent = ({ 
  isPreview = false,
  animationSettings = {
    animationType: 'scaleIn',
    delay: 0.1,
    triggerOnView: true,
    triggerOnce: true,
    threshold: 0.1,
    disabled: false
  },
  isConstructorMode = false,
  constructorMode = false,
  isEditing = false,
  onUpdate = () => {},
  onSave = null,
  onCancel = null
}) => {
  const [title, setTitle] = useState('Расширенный селект');
  const [selectedOption, setSelectedOption] = useState(null);
  const [isMulti, setIsMulti] = useState(false);
  const [selectOptions, setSelectOptions] = useState([
    { value: 'javascript', label: 'JavaScript', color: '#f7df1e' },
    { value: 'python', label: 'Python', color: '#3776ab' },
    { value: 'react', label: 'React', color: '#61dafb' },
    { value: 'vue', label: 'Vue.js', color: '#4fc08d' },
    { value: 'angular', label: 'Angular', color: '#dd0031' },
    { value: 'nodejs', label: 'Node.js', color: '#339933' },
  ]);
  const [selectLabels, setSelectLabels] = useState({
    instruction: 'Выберите технологии:',
    placeholder: 'Выберите технологии...',
    noOptions: 'Нет доступных опций',
    selectedLabel: 'Выбрано:'
  });
  const [localEditing, setLocalEditing] = useState(false);
  const [editData, setEditData] = useState({
    title,
    isMulti,
    selectOptions,
    selectLabels,
    animationSettings
  });

  const handleDoubleClick = () => {
    if (constructorMode || isConstructorMode) {
      setLocalEditing(true);
    }
  };

  const handleSave = () => {
    setLocalEditing(false);
    setTitle(editData.title);
    setIsMulti(editData.isMulti);
    setSelectOptions(editData.selectOptions);
    setSelectLabels(editData.selectLabels);
    if (onSave) {
      onSave(editData);
    } else {
      onUpdate(editData);
    }
  };

  const handleCancel = () => {
    setLocalEditing(false);
    setEditData({
      title,
      isMulti,
      selectOptions,
      selectLabels,
      animationSettings
    });
    if (onCancel) {
      onCancel();
    }
  };

  const handleAnimationUpdate = (newAnimationSettings) => {
    setEditData({ ...editData, animationSettings: newAnimationSettings });
  };

  const isCurrentlyEditing = isEditing || localEditing;

  const formatOptionLabel = ({ value, label, color }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Box
        sx={{
          width: 12,
          height: 12,
          backgroundColor: color,
          borderRadius: '50%'
        }}
      />
      <Typography variant="body2">{label}</Typography>
    </Box>
  );

  const customStyles = {
    control: (provided) => ({
      ...provided,
      minHeight: '48px',
      borderColor: '#c4c4c4',
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 9999,
    }),
  };

  const handleAddOption = () => {
    const newOption = {
      value: `option_${Date.now()}`,
      label: 'Новая опция',
      color: '#' + Math.floor(Math.random()*16777215).toString(16)
    };
    setEditData({
      ...editData,
      selectOptions: [...editData.selectOptions, newOption]
    });
  };

  const handleRemoveOption = (index) => {
    const newOptions = editData.selectOptions.filter((_, i) => i !== index);
    setEditData({
      ...editData,
      selectOptions: newOptions
    });
  };

  return (
    <EditableElementWrapper 
      editable={constructorMode || isConstructorMode} 
      onStartEdit={handleDoubleClick}
      isEditing={isCurrentlyEditing}
    >
      <AnimationWrapper {...(editData.animationSettings || animationSettings)}>
        <Paper sx={{ p: 3, mb: 2 }}>
          {isCurrentlyEditing ? (
            <Box>
              <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
                Редактирование расширенного селекта
              </Typography>
              
              <TextField
                label="Заголовок"
                value={editData.title}
                onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                fullWidth
                size="small"
                sx={{ mb: 2 }}
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={editData.isMulti}
                    onChange={(e) => setEditData({ ...editData, isMulti: e.target.checked })}
                  />
                }
                label="Множественный выбор"
                sx={{ mb: 2 }}
              />

              {/* Редактирование текстовых меток */}
              <Typography variant="subtitle2" gutterBottom>Текстовые метки:</Typography>
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Инструкция"
                    value={editData.selectLabels.instruction}
                    onChange={(e) => setEditData({ 
                      ...editData, 
                      selectLabels: { ...editData.selectLabels, instruction: e.target.value }
                    })}
                    fullWidth
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Плейсхолдер"
                    value={editData.selectLabels.placeholder}
                    onChange={(e) => setEditData({ 
                      ...editData, 
                      selectLabels: { ...editData.selectLabels, placeholder: e.target.value }
                    })}
                    fullWidth
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Сообщение 'Нет опций'"
                    value={editData.selectLabels.noOptions}
                    onChange={(e) => setEditData({ 
                      ...editData, 
                      selectLabels: { ...editData.selectLabels, noOptions: e.target.value }
                    })}
                    fullWidth
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Метка выбранного"
                    value={editData.selectLabels.selectedLabel}
                    onChange={(e) => setEditData({ 
                      ...editData, 
                      selectLabels: { ...editData.selectLabels, selectedLabel: e.target.value }
                    })}
                    fullWidth
                    size="small"
                  />
                </Grid>
              </Grid>

              {/* Редактирование опций */}
              <Typography variant="subtitle2" gutterBottom>Опции селекта:</Typography>
              {editData.selectOptions.map((option, index) => (
                <Box key={index} sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1, mb: 2 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label={`Название опции ${index + 1}`}
                        value={option.label}
                        onChange={(e) => {
                          const newOptions = [...editData.selectOptions];
                          newOptions[index].label = e.target.value;
                          setEditData({ ...editData, selectOptions: newOptions });
                        }}
                        fullWidth
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <TextField
                        label="Значение"
                        value={option.value}
                        onChange={(e) => {
                          const newOptions = [...editData.selectOptions];
                          newOptions[index].value = e.target.value;
                          setEditData({ ...editData, selectOptions: newOptions });
                        }}
                        fullWidth
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <TextField
                        label="Цвет"
                        type="color"
                        value={option.color}
                        onChange={(e) => {
                          const newOptions = [...editData.selectOptions];
                          newOptions[index].color = e.target.value;
                          setEditData({ ...editData, selectOptions: newOptions });
                        }}
                        fullWidth
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => handleRemoveOption(index)}
                        disabled={editData.selectOptions.length <= 1}
                        fullWidth
                      >
                        Удалить
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              ))}
              
              <Button
                variant="outlined"
                onClick={handleAddOption}
                sx={{ mb: 2 }}
              >
                Добавить опцию
              </Button>

              {/* Настройки анимации */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>Настройки анимации:</Typography>
                <AnimationControls
                  animationSettings={editData.animationSettings || animationSettings}
                  onUpdate={handleAnimationUpdate}
                />
              </Box>
              
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                <Button onClick={handleCancel}>Отмена</Button>
                <Button variant="contained" onClick={handleSave}>Сохранить</Button>
              </Box>
            </Box>
          ) : (
            <Box>
              {/* Режим конструктора */}
              {isConstructorMode && !constructorMode && (
                <Box sx={{ p: 2, backgroundColor: '#f5f5f5', borderBottom: '1px solid #e0e0e0', mb: 2 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Настройки React Select
                  </Typography>
                  <AnimationControls
                    animationSettings={animationSettings}
                    onUpdate={(newSettings) => {
                      if (onUpdate) {
                        onUpdate({ animationSettings: newSettings });
                      }
                    }}
                  />
                </Box>
              )}

              <Typography variant="h6" sx={{ mb: 2 }}>{title}</Typography>
              {!isPreview && !constructorMode && !isConstructorMode && (
                <Box sx={{ mb: 2 }}>
                  <TextField
                    label="Заголовок"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    fullWidth
                    size="small"
                    sx={{ mb: 1 }}
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={isMulti}
                        onChange={(e) => setIsMulti(e.target.checked)}
                      />
                    }
                    label="Множественный выбор"
                  />
                </Box>
              )}
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  {selectLabels.instruction}
                </Typography>
                <ReactSelect
                  options={selectOptions}
                  value={selectedOption}
                  onChange={setSelectedOption}
                  isMulti={isMulti}
                  formatOptionLabel={formatOptionLabel}
                  styles={customStyles}
                  placeholder={selectLabels.placeholder}
                  noOptionsMessage={() => selectLabels.noOptions}
                  isClearable
                  isSearchable
                />
              </Box>
              
              {selectedOption && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    {selectLabels.selectedLabel} {
                      Array.isArray(selectedOption) 
                        ? selectedOption.map(opt => opt.label).join(', ')
                        : selectedOption.label
                    }
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </Paper>
      </AnimationWrapper>
    </EditableElementWrapper>
  );
};

export const DatePickerComponent = ({ 
  isPreview = false,
  animationSettings = {
    animationType: 'slideInLeft',
    delay: 0.3,
    triggerOnView: true,
    triggerOnce: true,
    threshold: 0.1,
    disabled: false
  },
  isConstructorMode = false,
  constructorMode = false,
  isEditing = false,
  onUpdate = () => {},
  onSave = null,
  onCancel = null
}) => {
  const [title, setTitle] = useState('Выбор даты');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [dateLabels, setDateLabels] = useState({
    singleDateTitle: 'Выбор одной даты',
    dateRangeTitle: 'Выбор диапазона дат',
    singleDatePlaceholder: 'Выберите дату',
    rangeDatePlaceholder: 'Выберите диапазон дат',
    selectedDateLabel: 'Выбранная дата:',
    selectedRangeLabel: 'Выбранный диапазон:',
    timeLabel: 'в'
  });
  const [localEditing, setLocalEditing] = useState(false);
  const [editData, setEditData] = useState({
    title,
    showTimePicker,
    dateLabels,
    animationSettings
  });

  const handleDoubleClick = () => {
    if (constructorMode || isConstructorMode) {
      setLocalEditing(true);
    }
  };

  const handleSave = () => {
    setLocalEditing(false);
    setTitle(editData.title);
    setShowTimePicker(editData.showTimePicker);
    setDateLabels(editData.dateLabels);
    if (onSave) {
      onSave(editData);
    } else {
      onUpdate(editData);
    }
  };

  const handleCancel = () => {
    setLocalEditing(false);
    setEditData({
      title,
      showTimePicker,
      dateLabels,
      animationSettings
    });
    if (onCancel) {
      onCancel();
    }
  };

  const handleAnimationUpdate = (newAnimationSettings) => {
    setEditData({ ...editData, animationSettings: newAnimationSettings });
  };

  const isCurrentlyEditing = isEditing || localEditing;

  return (
    <EditableElementWrapper 
      editable={constructorMode || isConstructorMode} 
      onStartEdit={handleDoubleClick}
      isEditing={isCurrentlyEditing}
    >
      <AnimationWrapper {...(editData.animationSettings || animationSettings)}>
        <Paper sx={{ p: 3, mb: 2 }}>
          {isCurrentlyEditing ? (
            <Box>
              <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
                Редактирование компонента выбора даты
              </Typography>
              
              <TextField
                label="Заголовок"
                value={editData.title}
                onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                fullWidth
                size="small"
                sx={{ mb: 2 }}
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={editData.showTimePicker}
                    onChange={(e) => setEditData({ ...editData, showTimePicker: e.target.checked })}
                  />
                }
                label="Показывать выбор времени"
                sx={{ mb: 2 }}
              />

              {/* Редактирование текстовых меток */}
              <Typography variant="subtitle2" gutterBottom>Текстовые метки:</Typography>
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Заголовок одиночной даты"
                    value={editData.dateLabels.singleDateTitle}
                    onChange={(e) => setEditData({ 
                      ...editData, 
                      dateLabels: { ...editData.dateLabels, singleDateTitle: e.target.value }
                    })}
                    fullWidth
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Заголовок диапазона дат"
                    value={editData.dateLabels.dateRangeTitle}
                    onChange={(e) => setEditData({ 
                      ...editData, 
                      dateLabels: { ...editData.dateLabels, dateRangeTitle: e.target.value }
                    })}
                    fullWidth
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Плейсхолдер одиночной даты"
                    value={editData.dateLabels.singleDatePlaceholder}
                    onChange={(e) => setEditData({ 
                      ...editData, 
                      dateLabels: { ...editData.dateLabels, singleDatePlaceholder: e.target.value }
                    })}
                    fullWidth
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Плейсхолдер диапазона дат"
                    value={editData.dateLabels.rangeDatePlaceholder}
                    onChange={(e) => setEditData({ 
                      ...editData, 
                      dateLabels: { ...editData.dateLabels, rangeDatePlaceholder: e.target.value }
                    })}
                    fullWidth
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Метка выбранной даты"
                    value={editData.dateLabels.selectedDateLabel}
                    onChange={(e) => setEditData({ 
                      ...editData, 
                      dateLabels: { ...editData.dateLabels, selectedDateLabel: e.target.value }
                    })}
                    fullWidth
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Метка выбранного диапазона"
                    value={editData.dateLabels.selectedRangeLabel}
                    onChange={(e) => setEditData({ 
                      ...editData, 
                      dateLabels: { ...editData.dateLabels, selectedRangeLabel: e.target.value }
                    })}
                    fullWidth
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Слово 'в' для времени"
                    value={editData.dateLabels.timeLabel}
                    onChange={(e) => setEditData({ 
                      ...editData, 
                      dateLabels: { ...editData.dateLabels, timeLabel: e.target.value }
                    })}
                    fullWidth
                    size="small"
                  />
                </Grid>
              </Grid>

              {/* Настройки анимации */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>Настройки анимации:</Typography>
                <AnimationControls
                  animationSettings={editData.animationSettings || animationSettings}
                  onUpdate={handleAnimationUpdate}
                />
              </Box>
              
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                <Button onClick={handleCancel}>Отмена</Button>
                <Button variant="contained" onClick={handleSave}>Сохранить</Button>
              </Box>
            </Box>
          ) : (
            <Box>
              {/* Режим конструктора */}
              {isConstructorMode && !constructorMode && (
                <Box sx={{ p: 2, backgroundColor: '#f5f5f5', borderBottom: '1px solid #e0e0e0', mb: 2 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Настройки Date Picker
                  </Typography>
                  <AnimationControls
                    animationSettings={animationSettings}
                    onUpdate={(newSettings) => {
                      if (onUpdate) {
                        onUpdate({ animationSettings: newSettings });
                      }
                    }}
                  />
                </Box>
              )}

              <Typography variant="h6" sx={{ mb: 2 }}>{title}</Typography>
              {!isPreview && !constructorMode && !isConstructorMode && (
                <Box sx={{ mb: 2 }}>
                  <TextField
                    label="Заголовок"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    fullWidth
                    size="small"
                    sx={{ mb: 1 }}
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={showTimePicker}
                        onChange={(e) => setShowTimePicker(e.target.checked)}
                      />
                    }
                    label="Показывать выбор времени"
                  />
                </Box>
              )}
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" sx={{ mb: 2 }}>
                    {dateLabels.singleDateTitle}
                  </Typography>
                  <Box sx={{ 
                    '& .react-datepicker-wrapper': { width: '100%' },
                    '& .react-datepicker__input-container input': {
                      width: '100%',
                      padding: '16px 14px',
                      border: '1px solid #c4c4c4',
                      borderRadius: '4px',
                      fontSize: '16px',
                      '&:focus': {
                        outline: 'none',
                        borderColor: '#1976d2',
                        borderWidth: '2px'
                      }
                    }
                  }}>
                    <DatePicker
                      selected={selectedDate}
                      onChange={(date) => setSelectedDate(date)}
                      showTimeSelect={showTimePicker}
                      timeFormat="HH:mm"
                      timeIntervals={15}
                      dateFormat={showTimePicker ? "dd/MM/yyyy HH:mm" : "dd/MM/yyyy"}
                      placeholderText={dateLabels.singleDatePlaceholder}
                      locale="ru"
                    />
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" sx={{ mb: 2 }}>
                    {dateLabels.dateRangeTitle}
                  </Typography>
                  <Box sx={{ 
                    '& .react-datepicker-wrapper': { width: '100%' },
                    '& .react-datepicker__input-container input': {
                      width: '100%',
                      padding: '16px 14px',
                      border: '1px solid #c4c4c4',
                      borderRadius: '4px',
                      fontSize: '16px',
                      '&:focus': {
                        outline: 'none',
                        borderColor: '#1976d2',
                        borderWidth: '2px'
                      }
                    }
                  }}>
                    <DatePicker
                      selectsRange={true}
                      startDate={startDate}
                      endDate={endDate}
                      onChange={(update) => {
                        setDateRange(update);
                      }}
                      placeholderText={dateLabels.rangeDatePlaceholder}
                      locale="ru"
                      isClearable={true}
                    />
                  </Box>
                </Grid>
              </Grid>
              
              {selectedDate && (
                <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                  <Typography variant="body2">
                    {dateLabels.selectedDateLabel} <strong>{selectedDate.toLocaleDateString('ru-RU')}</strong>
                    {showTimePicker && (
                      <span> {dateLabels.timeLabel} <strong>{selectedDate.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}</strong></span>
                    )}
                  </Typography>
                </Box>
              )}
              
              {startDate && endDate && (
                <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                  <Typography variant="body2">
                    {dateLabels.selectedRangeLabel} <strong>
                      {startDate.toLocaleDateString('ru-RU')} - {endDate.toLocaleDateString('ru-RU')}
                    </strong>
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </Paper>
      </AnimationWrapper>
    </EditableElementWrapper>
  );
};

export const StepperForm = ({ 
  isPreview = false,
  animationSettings = {
    animationType: 'slideInRight',
    delay: 0.4,
    triggerOnView: true,
    triggerOnce: true,
    threshold: 0.1,
    disabled: false
  },
  isConstructorMode = false,
  constructorMode = false,
  isEditing = false,
  onUpdate = () => {},
  onSave = null,
  onCancel = null
}) => {
  const [title, setTitle] = useState('Пошаговая форма');
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    personalInfo: {},
    contactInfo: {},
    preferences: {}
  });
  const [stepLabels, setStepLabels] = useState([
    'Личная информация',
    'Контактная информация',
    'Предпочтения'
  ]);
  const [fieldLabels, setFieldLabels] = useState({
    // Шаг 1
    firstName: 'Имя',
    lastName: 'Фамилия',
    birthDate: 'Дата рождения',
    // Шаг 2
    email: 'Email',
    phone: 'Телефон',
    address: 'Адрес',
    // Шаг 3
    preferencesTitle: 'Предпочтения',
    newsletter: 'Получать новости по email',
    sms: 'Получать SMS уведомления',
    marketing: 'Получать маркетинговые предложения',
    // Кнопки
    nextButton: 'Далее',
    backButton: 'Назад',
    finishButton: 'Завершить',
    resetButton: 'Заполнить заново',
    // Финальные сообщения
    completedTitle: 'Форма заполнена!',
    completedMessage: 'Спасибо за заполнение формы. Все данные сохранены.'
  });
  const [localEditing, setLocalEditing] = useState(false);
  const [editData, setEditData] = useState({
    title,
    stepLabels,
    fieldLabels,
    animationSettings
  });

  const handleDoubleClick = () => {
    if (constructorMode || isConstructorMode) {
      setLocalEditing(true);
    }
  };

  const handleSave = () => {
    setLocalEditing(false);
    setTitle(editData.title);
    setStepLabels(editData.stepLabels);
    setFieldLabels(editData.fieldLabels);
    if (onSave) {
      onSave(editData);
    } else {
      onUpdate(editData);
    }
  };

  const handleCancel = () => {
    setLocalEditing(false);
    setEditData({
      title,
      stepLabels,
      fieldLabels,
      animationSettings
    });
    if (onCancel) {
      onCancel();
    }
  };

  const handleAnimationUpdate = (newAnimationSettings) => {
    setEditData({ ...editData, animationSettings: newAnimationSettings });
  };

  const isCurrentlyEditing = isEditing || localEditing;

  const steps = stepLabels;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    setFormData({
      personalInfo: {},
      contactInfo: {},
      preferences: {}
    });
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label={fieldLabels.firstName}
                  fullWidth
                  value={formData.personalInfo.firstName || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    personalInfo: { ...formData.personalInfo, firstName: e.target.value }
                  })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label={fieldLabels.lastName}
                  fullWidth
                  value={formData.personalInfo.lastName || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    personalInfo: { ...formData.personalInfo, lastName: e.target.value }
                  })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label={fieldLabels.birthDate}
                  type="date"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={formData.personalInfo.birthDate || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    personalInfo: { ...formData.personalInfo, birthDate: e.target.value }
                  })}
                />
              </Grid>
            </Grid>
          </Box>
        );
      case 1:
        return (
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label={fieldLabels.email}
                  type="email"
                  fullWidth
                  value={formData.contactInfo.email || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    contactInfo: { ...formData.contactInfo, email: e.target.value }
                  })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label={fieldLabels.phone}
                  fullWidth
                  value={formData.contactInfo.phone || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    contactInfo: { ...formData.contactInfo, phone: e.target.value }
                  })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label={fieldLabels.address}
                  multiline
                  rows={3}
                  fullWidth
                  value={formData.contactInfo.address || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    contactInfo: { ...formData.contactInfo, address: e.target.value }
                  })}
                />
              </Grid>
            </Grid>
          </Box>
        );
      case 2:
        return (
          <Box sx={{ mt: 2 }}>
            <FormControl component="fieldset">
              <FormLabel component="legend">{fieldLabels.preferencesTitle}</FormLabel>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.preferences.newsletter || false}
                      onChange={(e) => setFormData({
                        ...formData,
                        preferences: { ...formData.preferences, newsletter: e.target.checked }
                      })}
                    />
                  }
                  label={fieldLabels.newsletter}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.preferences.sms || false}
                      onChange={(e) => setFormData({
                        ...formData,
                        preferences: { ...formData.preferences, sms: e.target.checked }
                      })}
                    />
                  }
                  label={fieldLabels.sms}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.preferences.marketing || false}
                      onChange={(e) => setFormData({
                        ...formData,
                        preferences: { ...formData.preferences, marketing: e.target.checked }
                      })}
                    />
                  }
                  label={fieldLabels.marketing}
                />
              </FormGroup>
            </FormControl>
          </Box>
        );
      default:
        return 'Неизвестный шаг';
    }
  };

  return (
    <EditableElementWrapper 
      editable={constructorMode || isConstructorMode} 
      onStartEdit={handleDoubleClick}
      isEditing={isCurrentlyEditing}
    >
      <AnimationWrapper {...(editData.animationSettings || animationSettings)}>
        <Paper sx={{ p: 3, mb: 2 }}>
          {isCurrentlyEditing ? (
            <Box>
              <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
                Редактирование пошаговой формы
              </Typography>
              
              <TextField
                label="Заголовок формы"
                value={editData.title}
                onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                fullWidth
                size="small"
                sx={{ mb: 2 }}
              />

              {/* Редактирование названий шагов */}
              <Typography variant="subtitle2" gutterBottom>Названия шагов:</Typography>
              <Grid container spacing={2} sx={{ mb: 2 }}>
                {editData.stepLabels.map((step, index) => (
                  <Grid item xs={12} sm={4} key={index}>
                    <TextField
                      label={`Шаг ${index + 1}`}
                      value={step}
                      onChange={(e) => {
                        const newSteps = [...editData.stepLabels];
                        newSteps[index] = e.target.value;
                        setEditData({ ...editData, stepLabels: newSteps });
                      }}
                      fullWidth
                      size="small"
                    />
                  </Grid>
                ))}
              </Grid>

              {/* Редактирование меток полей */}
              <Typography variant="subtitle2" gutterBottom>Поля первого шага:</Typography>
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Метка поля 'Имя'"
                    value={editData.fieldLabels.firstName}
                    onChange={(e) => setEditData({ 
                      ...editData, 
                      fieldLabels: { ...editData.fieldLabels, firstName: e.target.value }
                    })}
                    fullWidth
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Метка поля 'Фамилия'"
                    value={editData.fieldLabels.lastName}
                    onChange={(e) => setEditData({ 
                      ...editData, 
                      fieldLabels: { ...editData.fieldLabels, lastName: e.target.value }
                    })}
                    fullWidth
                    size="small"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Метка поля 'Дата рождения'"
                    value={editData.fieldLabels.birthDate}
                    onChange={(e) => setEditData({ 
                      ...editData, 
                      fieldLabels: { ...editData.fieldLabels, birthDate: e.target.value }
                    })}
                    fullWidth
                    size="small"
                  />
                </Grid>
              </Grid>

              <Typography variant="subtitle2" gutterBottom>Поля второго шага:</Typography>
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Метка поля 'Email'"
                    value={editData.fieldLabels.email}
                    onChange={(e) => setEditData({ 
                      ...editData, 
                      fieldLabels: { ...editData.fieldLabels, email: e.target.value }
                    })}
                    fullWidth
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Метка поля 'Телефон'"
                    value={editData.fieldLabels.phone}
                    onChange={(e) => setEditData({ 
                      ...editData, 
                      fieldLabels: { ...editData.fieldLabels, phone: e.target.value }
                    })}
                    fullWidth
                    size="small"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Метка поля 'Адрес'"
                    value={editData.fieldLabels.address}
                    onChange={(e) => setEditData({ 
                      ...editData, 
                      fieldLabels: { ...editData.fieldLabels, address: e.target.value }
                    })}
                    fullWidth
                    size="small"
                  />
                </Grid>
              </Grid>

              <Typography variant="subtitle2" gutterBottom>Поля третьего шага:</Typography>
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12}>
                  <TextField
                    label="Заголовок предпочтений"
                    value={editData.fieldLabels.preferencesTitle}
                    onChange={(e) => setEditData({ 
                      ...editData, 
                      fieldLabels: { ...editData.fieldLabels, preferencesTitle: e.target.value }
                    })}
                    fullWidth
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Чекбокс новостей"
                    value={editData.fieldLabels.newsletter}
                    onChange={(e) => setEditData({ 
                      ...editData, 
                      fieldLabels: { ...editData.fieldLabels, newsletter: e.target.value }
                    })}
                    fullWidth
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Чекбокс SMS"
                    value={editData.fieldLabels.sms}
                    onChange={(e) => setEditData({ 
                      ...editData, 
                      fieldLabels: { ...editData.fieldLabels, sms: e.target.value }
                    })}
                    fullWidth
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Чекбокс маркетинга"
                    value={editData.fieldLabels.marketing}
                    onChange={(e) => setEditData({ 
                      ...editData, 
                      fieldLabels: { ...editData.fieldLabels, marketing: e.target.value }
                    })}
                    fullWidth
                    size="small"
                  />
                </Grid>
              </Grid>

              <Typography variant="subtitle2" gutterBottom>Текст кнопок и сообщений:</Typography>
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Кнопка 'Далее'"
                    value={editData.fieldLabels.nextButton}
                    onChange={(e) => setEditData({ 
                      ...editData, 
                      fieldLabels: { ...editData.fieldLabels, nextButton: e.target.value }
                    })}
                    fullWidth
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Кнопка 'Назад'"
                    value={editData.fieldLabels.backButton}
                    onChange={(e) => setEditData({ 
                      ...editData, 
                      fieldLabels: { ...editData.fieldLabels, backButton: e.target.value }
                    })}
                    fullWidth
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Кнопка 'Завершить'"
                    value={editData.fieldLabels.finishButton}
                    onChange={(e) => setEditData({ 
                      ...editData, 
                      fieldLabels: { ...editData.fieldLabels, finishButton: e.target.value }
                    })}
                    fullWidth
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Кнопка 'Заполнить заново'"
                    value={editData.fieldLabels.resetButton}
                    onChange={(e) => setEditData({ 
                      ...editData, 
                      fieldLabels: { ...editData.fieldLabels, resetButton: e.target.value }
                    })}
                    fullWidth
                    size="small"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Заголовок завершения"
                    value={editData.fieldLabels.completedTitle}
                    onChange={(e) => setEditData({ 
                      ...editData, 
                      fieldLabels: { ...editData.fieldLabels, completedTitle: e.target.value }
                    })}
                    fullWidth
                    size="small"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Сообщение о завершении"
                    value={editData.fieldLabels.completedMessage}
                    onChange={(e) => setEditData({ 
                      ...editData, 
                      fieldLabels: { ...editData.fieldLabels, completedMessage: e.target.value }
                    })}
                    fullWidth
                    size="small"
                    multiline
                    rows={2}
                  />
                </Grid>
              </Grid>

              {/* Настройки анимации */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>Настройки анимации:</Typography>
                <AnimationControls
                  animationSettings={editData.animationSettings || animationSettings}
                  onUpdate={handleAnimationUpdate}
                />
              </Box>
              
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                <Button onClick={handleCancel}>Отмена</Button>
                <Button variant="contained" onClick={handleSave}>Сохранить</Button>
              </Box>
            </Box>
          ) : (
            <Box>
              {/* Режим конструктора */}
              {isConstructorMode && !constructorMode && (
                <Box sx={{ p: 2, backgroundColor: '#f5f5f5', borderBottom: '1px solid #e0e0e0', mb: 2 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Настройки Stepper Form
                  </Typography>
                  <AnimationControls
                    animationSettings={animationSettings}
                    onUpdate={(newSettings) => {
                      if (onUpdate) {
                        onUpdate({ animationSettings: newSettings });
                      }
                    }}
                  />
                </Box>
              )}

              <Typography variant="h6" sx={{ mb: 2 }}>{title}</Typography>
              {!isPreview && !constructorMode && !isConstructorMode && (
                <Box sx={{ mb: 2 }}>
                  <TextField
                    label="Заголовок формы"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    fullWidth
                    size="small"
                  />
                </Box>
              )}
              
              <Stepper activeStep={activeStep} orientation="vertical">
                {steps.map((label, index) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                    <StepContent>
                      {renderStepContent(index)}
                      <Box sx={{ mb: 2, mt: 2 }}>
                        <div>
                          <Button
                            variant="contained"
                            onClick={index === steps.length - 1 ? handleReset : handleNext}
                            sx={{ mt: 1, mr: 1 }}
                          >
                            {index === steps.length - 1 ? fieldLabels.finishButton : fieldLabels.nextButton}
                          </Button>
                          <Button
                            disabled={index === 0}
                            onClick={handleBack}
                            sx={{ mt: 1, mr: 1 }}
                          >
                            {fieldLabels.backButton}
                          </Button>
                        </div>
                      </Box>
                    </StepContent>
                  </Step>
                ))}
              </Stepper>
              
              {activeStep === steps.length && (
                <Paper square elevation={0} sx={{ p: 3, mt: 2 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    {fieldLabels.completedTitle}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {fieldLabels.completedMessage}
                  </Typography>
                  <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
                    {fieldLabels.resetButton}
                  </Button>
                </Paper>
              )}
            </Box>
          )}
        </Paper>
      </AnimationWrapper>
    </EditableElementWrapper>
  );
}; 