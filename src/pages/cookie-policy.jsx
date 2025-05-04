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
  const content = "Политика использования cookieыыф фыыф";
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