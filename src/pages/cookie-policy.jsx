import React from 'react';
import { Box, Container, Typography, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import { marked } from 'marked';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginBottom: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  borderRadius: '8px'
}));

const StyledContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(6),
  paddingBottom: theme.spacing(6)
}));

const LegalContent = styled(Box)(({ theme }) => ({
  '& h1': {
    fontSize: '2.5rem',
    fontWeight: 600,
    marginBottom: '2rem',
    color: '#333',
    textAlign: 'center',
    [theme.breakpoints.down('sm')]: {
      fontSize: '2rem'
    }
  },
  '& h2': {
    fontSize: '1.8rem',
    fontWeight: 500,
    marginTop: '2.5rem',
    marginBottom: '1.5rem',
    color: '#444',
    [theme.breakpoints.down('sm')]: {
      fontSize: '1.5rem'
    }
  },
  '& h3': {
    fontSize: '1.4rem',
    fontWeight: 500,
    marginTop: '2rem',
    marginBottom: '1rem',
    color: '#555',
    [theme.breakpoints.down('sm')]: {
      fontSize: '1.2rem'
    }
  },
  '& p': {
    fontSize: '1.1rem',
    lineHeight: 1.8,
    marginBottom: '1.5rem',
    color: '#333',
    [theme.breakpoints.down('sm')]: {
      fontSize: '1rem'
    }
  },
  '& ul, & ol': {
    marginBottom: '1.5rem',
    paddingLeft: '2rem'
  },
  '& li': {
    fontSize: '1.1rem',
    lineHeight: 1.8,
    marginBottom: '0.8rem',
    color: '#333',
    [theme.breakpoints.down('sm')]: {
      fontSize: '1rem'
    }
  },
  '& a': {
    color: theme.palette.primary.main,
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline'
    }
  },
  '& blockquote': {
    borderLeft: '4px solid #1976d2',
    paddingLeft: '1rem',
    marginLeft: 0,
    marginRight: 0,
    fontStyle: 'italic',
    color: '#666'
  },
  '& code': {
    backgroundColor: '#f5f5f5',
    padding: '0.2rem 0.4rem',
    borderRadius: '4px',
    fontFamily: 'monospace'
  },
  '& pre': {
    backgroundColor: '#f5f5f5',
    padding: '1rem',
    borderRadius: '4px',
    overflowX: 'auto',
    marginBottom: '1.5rem'
  },
  '& table': {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: '1.5rem'
  },
  '& th, & td': {
    border: '1px solid #ddd',
    padding: '0.75rem',
    textAlign: 'left'
  },
  '& th': {
    backgroundColor: '#f5f5f5',
    fontWeight: 500
  },
  '& hr': {
    border: 'none',
    borderTop: '1px solid #ddd',
    margin: '2rem 0'
  }
}));

export default function CookiePolicy() {
  const content = "1. Введение\n   1.1. Данная политика разъясняет, как используются файлы cookie на сайте и как пользователь может управлять ими.\n   1.2. Используя сайт, пользователь соглашается на использование cookie в соответствии с настоящей политикой.\n\n2. Что такое cookie\n   2.1. Cookie — это небольшие текстовые файлы, сохраняемые в браузере пользователя при посещении сайта.\n   2.2. Cookie позволяют сайту распознавать пользователя при последующих визитах.\n\n3. Какие cookie используются\n   3.1. Технические cookie — обеспечивают работу сайта и отдельных его разделов.\n   3.2. Аналитические cookie — собирают информацию об использовании сайта для улучшения сервиса.\n   3.3. Функциональные cookie — запоминают предпочтения пользователя.\n\n4. Как используются cookie\n   4.1. Для аутентификации, хранения сессии, предоставления персонализированного контента.\n   4.2. Для анализа поведения пользователей и улучшения структуры сайта.\n\n5. Управление cookie\n   5.1. Пользователь может удалить или заблокировать cookie через настройки браузера.\n   5.2. Отключение cookie может привести к некорректной работе сайта.\n\n6. Согласие пользователя\n   6.1. Продолжая использовать сайт, пользователь выражает согласие на использование cookie.\n   6.2. В случае несогласия, пользователь должен изменить настройки браузера или прекратить использование сайта.\n\n7. Изменения политики\n   7.1. Настоящая политика может быть изменена без предварительного уведомления.\n   7.2. Новая версия вступает в силу с момента публикации на сайте.\n\n\\";
  const htmlContent = marked(content);

  return (
    <StyledContainer maxWidth="md">
      <StyledPaper>
        <LegalContent>
          <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
        </LegalContent>
      </StyledPaper>
    </StyledContainer>
  );
}