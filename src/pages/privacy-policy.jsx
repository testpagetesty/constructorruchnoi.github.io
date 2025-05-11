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

export default function PrivacyPolicy() {
  const content = "Настоящая политика конфиденциальности регулирует порядок сбора, использования, хранения и раскрытия информации, полученной от пользователей сайта.\n\n1. Общие положения\n   1.1. Использование сайта означает согласие пользователя с настоящей политикой конфиденциальности.\n   1.2. Администрация сайта обязуется обеспечивать защиту личной информации пользователей.\n\n2. Сбор персональных данных\n   2.1. Мы собираем только те данные, которые пользователь предоставляет добровольно: имя, адрес электронной почты, номер телефона и иные сведения.\n   2.2. Также мы можем собирать технические данные, автоматически передаваемые браузером пользователя: IP-адрес, cookies, параметры устройства.\n\n3. Использование информации\n   3.1. Собранные данные используются исключительно для предоставления и улучшения услуг, связи с пользователем, отправки уведомлений, исполнения обязательств.\n   3.2. Информация не передается третьим лицам без согласия пользователя, за исключением случаев, предусмотренных законом.\n\n4. Хранение и защита информации\n   4.1. Персональные данные хранятся на защищенных серверах с ограниченным доступом.\n   4.2. Применяются организационные и технические меры для предотвращения утечки, потери, несанкционированного доступа.\n\n5. Права пользователя\n   5.1. Пользователь имеет право запросить информацию о своих данных, требовать их изменения или удаления.\n   5.2. Пользователь может отозвать согласие на обработку данных, обратившись в администрацию сайта.\n\n6. Использование файлов cookie\n   6.1. Сайт использует cookie для обеспечения корректной работы и анализа посещаемости.\n   6.2. Пользователь может отключить cookie в настройках браузера.\n\n7. Изменения в политике\n   7.1. Администрация оставляет за собой право вносить изменения в настоящую политику.\n   7.2. Актуальная версия публикуется на сайте.\n\n8. Контактная информация\n   По всем вопросам, связанным с обработкой персональных данных, пользователь может обратиться к администрации сайта.";
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