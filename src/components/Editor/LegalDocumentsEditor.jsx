import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Paper,
  IconButton,
  Collapse,
  Button,
  Stack,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import SaveIcon from '@mui/icons-material/Save';
import PreviewIcon from '@mui/icons-material/Preview';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
  '& .MuiTextField-root': {
    marginBottom: theme.spacing(2)
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
  },
  '& .date': {
    textAlign: 'right',
    marginTop: '30px',
    color: '#666',
    fontStyle: 'italic'
  },
  '& .contact-info': {
    marginTop: '2rem',
    padding: '1rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    '& .emoji': {
      marginRight: '0.5rem',
      fontSize: '1.2em'
    }
  }
}));

const SectionHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(1, 2),
  backgroundColor: '#4caf50',
  color: '#ffffff',
  borderRadius: '8px 8px 0 0',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: '#388e3c'
  }
}));

const PreviewDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    maxWidth: '1000px',
    width: '100%',
    maxHeight: '80vh'
  }
}));

const PreviewContent = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: 'left',
  color: '#333',
  fontFamily: 'Roboto, Arial, sans-serif',
  '& h1': {
    fontSize: '32px',
    fontWeight: 600,
    marginBottom: '30px',
    color: '#333',
    textAlign: 'center',
    paddingBottom: '15px',
    borderBottom: '1px solid #eaeaea',
    [theme.breakpoints.down('sm')]: {
      fontSize: '28px'
    }
  },
  '& h2': {
    fontSize: '26px',
    fontWeight: 600,
    marginTop: '30px',
    marginBottom: '20px',
    color: '#333',
    [theme.breakpoints.down('sm')]: {
      fontSize: '22px'
    }
  },
  '& h3': {
    fontSize: '22px',
    fontWeight: 500,
    marginTop: '25px',
    marginBottom: '15px',
    color: '#444',
    [theme.breakpoints.down('sm')]: {
      fontSize: '18px'
    }
  },
  '& p': {
    fontSize: '18px',
    lineHeight: 1.8,
    marginBottom: '20px',
    color: '#333',
    textAlign: 'left',
    [theme.breakpoints.down('sm')]: {
      fontSize: '16px'
    }
  },
  '& ul, & ol': {
    marginBottom: '20px',
    paddingLeft: '25px',
  },
  '& li': {
    fontSize: '18px',
    lineHeight: 1.8,
    marginBottom: '10px',
    color: '#333',
    textAlign: 'left',
    [theme.breakpoints.down('sm')]: {
      fontSize: '16px'
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
  },
  '& .date': {
    textAlign: 'right',
    marginTop: '30px',
    color: '#666',
    fontStyle: 'italic'
  }
}));

const formatLegalDocument = (content) => {
  if (!content) return '';
  
  const contentLines = content.split('\n');
  const firstLine = contentLines[0] ? `<h1>${contentLines[0]}</h1>` : '';
  const remainingContent = contentLines.slice(1).join('\n');
  
  let processedContent = firstLine;
  
  const sectionHeaderPattern = /^\d+\.\s+(.+)/;
  const sectionHeaderPattern2 = /^([IVX]+)\.\s+(.+)/;
  const sectionHeaderPattern3 = /^([А-ЯA-Z][\wа-яА-Я\s]{2,}):$/;
  
  const paragraphs = remainingContent.split('\n');
  
  let isContactSection = false;
  
  paragraphs.forEach(paragraph => {
    paragraph = paragraph.trim();
    
    if (!paragraph) {
      processedContent += '<br>';
      return;
    }

    // Проверяем, начинается ли строка с эмодзи
    if (/^[🏢📍📞📧🌐⏰📱💬]/.test(paragraph)) {
      if (!isContactSection) {
        isContactSection = true;
        processedContent += '<div class="contact-info">';
      }
      const [emoji, ...rest] = paragraph.split(' ');
      processedContent += `<p><span class="emoji">${emoji}</span>${rest.join(' ')}</p>`;
      return;
    }

    if (isContactSection && !/^[🏢📍📞📧🌐⏰📱💬]/.test(paragraph)) {
      isContactSection = false;
      processedContent += '</div>';
    }
    
    const match1 = paragraph.match(sectionHeaderPattern);
    const match2 = paragraph.match(sectionHeaderPattern2);
    const match3 = paragraph.match(sectionHeaderPattern3);
    
    if (match1) {
      processedContent += `<h2>${paragraph}</h2>`;
    } else if (match2) {
      processedContent += `<h2>${paragraph}</h2>`;
    } else if (match3) {
      processedContent += `<h2>${paragraph}</h2>`;
    } else if (/^\d+\.\d+\./.test(paragraph)) {
      processedContent += `<h3>${paragraph}</h3>`;
    } else if (paragraph.startsWith('•') || paragraph.startsWith('-') || paragraph.startsWith('*')) {
      if (!processedContent.endsWith('</ul>') && !processedContent.endsWith('<ul>')) {
        processedContent += '<ul>';
      }
      processedContent += `<li>${paragraph.substring(1).trim()}</li>`;
      
      if (paragraphs.indexOf(paragraph) === paragraphs.length - 1 || 
          !paragraphs[paragraphs.indexOf(paragraph) + 1].startsWith('•') &&
          !paragraphs[paragraphs.indexOf(paragraph) + 1].startsWith('-') &&
          !paragraphs[paragraphs.indexOf(paragraph) + 1].startsWith('*')) {
        processedContent += '</ul>';
      }
    } else {
      if (paragraph.length > 0) {
        paragraph = paragraph
          .replace(/«([^»]+)»/g, '«<strong>$1</strong>»')
          .replace(/"([^"]+)"/g, '"<strong>$1</strong>"');
          
        processedContent += `<p>${paragraph}</p>`;
      }
    }
  });

  if (isContactSection) {
    processedContent += '</div>';
  }
  
  processedContent = processedContent
    .replace(/(\d+\.\d+\.\d+\.)/g, '<strong>$1</strong>')
    .replace(/([А-ЯA-Z]{2,})/g, '<strong>$1</strong>')
    .replace(/(ФЗ [№"]\d+[^<]*?[»"])/g, '<strong>$1</strong>')
    .replace(/([0-9]+\s*(?:января|февраля|марта|апреля|мая|июня|июля|августа|сентября|октября|ноября|декабря)\s*[0-9]{4})/gi, '<em>$1</em>');
  
  processedContent += `<div class="date">${new Date().toLocaleDateString('ru-RU')}</div>`;
  
  return processedContent;
};

const LegalDocumentsEditor = ({
  documents,
  onSave,
  expanded,
  onToggle
}) => {
  const [localDocuments, setLocalDocuments] = useState({
    privacyPolicy: '',
    termsOfService: '',
    cookiePolicy: ''
  });

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewContent, setPreviewContent] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');

  useEffect(() => {
    console.log('Documents received:', documents);
    if (documents) {
      setLocalDocuments({
        privacyPolicy: documents.privacyPolicy?.content || '',
        termsOfService: documents.termsOfService?.content || '',
        cookiePolicy: documents.cookiePolicy?.content || ''
      });
    }
  }, [documents]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = 'Вы уверены, что хотите покинуть страницу редактирования правовых документов?';
      return e.returnValue;
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const handleChange = (field) => (event) => {
    const newValue = event.target.value;
    console.log(`Changing ${field}:`, newValue);
    const newLocalDocuments = {
      ...localDocuments,
      [field]: newValue
    };
    setLocalDocuments(newLocalDocuments);

    if (onSave) {
      const formattedDocuments = {
        privacyPolicy: {
          title: '',
          content: newLocalDocuments.privacyPolicy
        },
        termsOfService: {
          title: '',
          content: newLocalDocuments.termsOfService
        },
        cookiePolicy: {
          title: '',
          content: newLocalDocuments.cookiePolicy
        }
      };
      onSave(formattedDocuments);
    }
  };

  const handleSave = () => {
    console.log('Saving documents:', localDocuments);
    if (onSave) {
      const formattedDocuments = {
        privacyPolicy: {
          title: '',
          content: localDocuments.privacyPolicy
        },
        termsOfService: {
          title: '',
          content: localDocuments.termsOfService
        },
        cookiePolicy: {
          title: '',
          content: localDocuments.cookiePolicy
        }
      };
      onSave(formattedDocuments);
    }
  };

  const handlePreview = (field) => {
    setPreviewContent(localDocuments[field]);
    setPreviewTitle(
      field === 'privacyPolicy' ? 'Политика конфиденциальности' :
      field === 'termsOfService' ? 'Пользовательское соглашение' :
      'Политика использования cookie'
    );
    setPreviewOpen(true);
  };

  const handleClosePreview = () => {
    setPreviewOpen(false);
  };

  return (
    <StyledPaper>
      <SectionHeader onClick={onToggle}>
        <Typography variant="h6" sx={{ fontWeight: 500 }}>
          Правовые документы
        </Typography>
        <IconButton 
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          sx={{ 
            color: 'inherit',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)'
            }
          }}
        >
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </SectionHeader>
      <Collapse in={expanded}>
        <Box sx={{ p: 2 }}>
          <Stack spacing={2}>
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="subtitle1">Политика конфиденциальности</Typography>
                <IconButton
                  size="small"
                  onClick={() => handlePreview('privacyPolicy')}
                >
                  <PreviewIcon />
                </IconButton>
              </Box>
              <TextField
                fullWidth
                multiline
                rows={15}
                value={localDocuments.privacyPolicy || ''}
                onChange={handleChange('privacyPolicy')}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: '#4caf50'
                    }
                  },
                  '& .MuiInputBase-input': {
                    fontSize: '16px',
                    lineHeight: '1.6'
                  }
                }}
              />
            </Box>
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="subtitle1">Пользовательское соглашение</Typography>
                <IconButton
                  size="small"
                  onClick={() => handlePreview('termsOfService')}
                >
                  <PreviewIcon />
                </IconButton>
              </Box>
              <TextField
                fullWidth
                multiline
                rows={15}
                value={localDocuments.termsOfService || ''}
                onChange={handleChange('termsOfService')}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: '#4caf50'
                    }
                  },
                  '& .MuiInputBase-input': {
                    fontSize: '16px',
                    lineHeight: '1.6'
                  }
                }}
              />
            </Box>
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="subtitle1">Политика использования cookie</Typography>
                <IconButton
                  size="small"
                  onClick={() => handlePreview('cookiePolicy')}
                >
                  <PreviewIcon />
                </IconButton>
              </Box>
              <TextField
                fullWidth
                multiline
                rows={15}
                value={localDocuments.cookiePolicy || ''}
                onChange={handleChange('cookiePolicy')}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: '#4caf50'
                    }
                  },
                  '& .MuiInputBase-input': {
                    fontSize: '16px',
                    lineHeight: '1.6'
                  }
                }}
              />
            </Box>
          </Stack>
        </Box>
      </Collapse>

      <PreviewDialog
        open={previewOpen}
        onClose={handleClosePreview}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {previewTitle}
            <IconButton
              edge="end"
              color="inherit"
              onClick={handleClosePreview}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ backgroundColor: '#f9f9f9', padding: '20px' }}>
          <Box sx={{ 
            backgroundColor: '#fff', 
            padding: '40px', 
            borderRadius: '10px',
            boxShadow: '0 2px 15px rgba(0,0,0,0.05)'
          }}>
            <PreviewContent dangerouslySetInnerHTML={{ __html: formatLegalDocument(previewContent) }} />
          </Box>
        </DialogContent>
      </PreviewDialog>
    </StyledPaper>
  );
};

export default LegalDocumentsEditor; 