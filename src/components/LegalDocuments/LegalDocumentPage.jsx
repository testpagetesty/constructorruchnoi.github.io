import React from 'react';
import { Box, Container, Typography, Paper } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const LegalDocumentPage = ({ 
  title, 
  content, 
  language = 'ru',
  backgroundColor = '#ffffff',
  textColor = '#000000'
}) => {
  const theme = useTheme();

  return (
    <Box
      component="main"
      sx={{
        minHeight: '100vh',
        backgroundColor: backgroundColor,
        color: textColor,
        py: 4
      }}
    >
      <Container maxWidth="md">
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4,
            borderRadius: 2,
            backgroundColor: 'rgba(255, 255, 255, 0.9)'
          }}
        >
          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom
            sx={{ 
              mb: 4,
              textAlign: 'center',
              fontWeight: 700
            }}
          >
            {title}
          </Typography>
          
          <Box 
            component="div"
            sx={{
              '& p': {
                mb: 2,
                lineHeight: 1.6
              },
              '& h2': {
                mt: 4,
                mb: 2,
                fontWeight: 600
              },
              '& ul, & ol': {
                pl: 4,
                mb: 2
              },
              '& li': {
                mb: 1
              }
            }}
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </Paper>
      </Container>
    </Box>
  );
};

export default LegalDocumentPage; 