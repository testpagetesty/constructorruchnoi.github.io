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
  const content = "ID секции: about\nО нашей компании\nПрофессиональный подход к решению ваших юридических вопросов\n\nИстория компании\nЮридическая компания \"Правовой Стандарт\" основана в 2008 году. За 15 лет работы мы помогли более 2500 клиентам и заслужили репутацию надежного партнера в решении сложных правовых задач.\n\nНаша миссия\nМы предоставляем квалифицированную юридическую помощь, используя индивидуальный подход к каждому случаю. Наша цель - защитить ваши интересы и добиться наилучшего результата.\n\nНаши ценности\nВ основе нашей работы лежат профессионализм, конфиденциальность и прозрачность. Мы строго соблюдаем закон и этические нормы юридической профессии.\n\nНаша команда\nВ компании работают 35 специалистов с опытом от 7 лет. Каждый год наши юристы проходят дополнительное обучение и повышают квалификацию.\n\nНаши достижения\nЗа последние 3 года мы выиграли 92% судебных дел наших клиентов. В 2023 году вошли в ТОП-50 юридических компаний России по версии Legal Awards.\n\n(Важно: Первичная консультация бесплатна и ни к чему вас не обязывает)\n\nДля записи на консультацию звоните: +7 (495) 789-45-23\nИли пишите: info@pravovoy-standart.ru\nРежим работы: пн-пт 9:00-19:00";
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