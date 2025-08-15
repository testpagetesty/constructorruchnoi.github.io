import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  IconButton,
  Tooltip,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import SortIcon from '@mui/icons-material/Sort';
import AnimationWrapper from '../AnimationWrapper';
import AnimationControls from '../AnimationControls';

const DataTable = ({
  // Пропсы для совместимости с AI парсером
  title: propTitle,
  headers: propHeaders,
  rows: propRows,
  // Оригинальные пропсы
  initialColumns = [
    { id: 'name', label: 'Название', sortable: true },
    { id: 'value', label: 'Значение', sortable: true },
    { id: 'description', label: 'Описание', sortable: false }
  ],
  initialRows = [
    { id: 1, name: 'Элемент 1', value: '100', description: 'Описание первого элемента' },
    { id: 2, name: 'Элемент 2', value: '200', description: 'Описание второго элемента' },
    { id: 3, name: 'Элемент 3', value: '150', description: 'Описание третьего элемента' }
  ],
  striped = true,
  bordered = true,
  hover = true,
  dense = false,
  sortable = true,
  customStyles = {},
  onUpdate,
  editable = true,
  
  // Параметры анимации
  animationSettings = {
    animationType: 'fadeIn',
    delay: 0,
    triggerOnView: true,
    triggerOnce: true,
    threshold: 0.1,
    disabled: false
  },
  isConstructorMode = false
}) => {
  // Добавляем логирование для отладки
  console.log('[DataTable] Received props:', { 
    propTitle, 
    propHeaders, 
    propRows,
    initialColumns,
    initialRows,
    isConstructorMode 
  });

  // Обрабатываем данные от AI парсера
  const processedColumns = propHeaders ? propHeaders.map((header, index) => ({
    id: header.id || `col_${index + 1}`,
    label: header.label,
    sortable: header.sortable !== false
  })) : initialColumns;
  
  const processedRows = propRows ? propRows.map((row, index) => {
    const rowObj = { id: index + 1 };
    processedColumns.forEach((col, colIndex) => {
      rowObj[col.id] = row[colIndex] || '';
    });
    return rowObj;
  }) : initialRows;

  const [columns, setColumns] = useState(processedColumns || []);
  const [rows, setRows] = useState(processedRows || []);
  const [isStriped, setIsStriped] = useState(striped);
  const [isBordered, setIsBordered] = useState(bordered);
  const [isHover, setIsHover] = useState(hover);
  const [isDense, setIsDense] = useState(dense);
  const [isSortable, setIsSortable] = useState(sortable);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [tableStyles, setTableStyles] = useState({
    headerBgColor: 'rgba(0,0,0,0.85)',
    headerTextColor: '#ffd700',
    rowBgColor: 'rgba(0,0,0,0.7)',
    rowAltBgColor: 'rgba(0,0,0,0.85)',
    borderColor: '#c41e3a',
    hoverColor: 'rgba(196,30,58,0.15)',
    textColor: '#fff',
    ...customStyles
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentAnimationSettings, setCurrentAnimationSettings] = useState(animationSettings || {
    animationType: 'fadeIn',
    delay: 0,
    triggerOnView: true,
    triggerOnce: true,
    threshold: 0.1,
    disabled: false
  });

  const handleSort = (columnId) => {
    if (!isSortable) return;
    
    const column = columns.find(col => col.id === columnId);
    if (!column?.sortable) return;

    let direction = 'asc';
    if (sortConfig.key === columnId && sortConfig.direction === 'asc') {
      direction = 'desc';
    }

    setSortConfig({ key: columnId, direction });

    const sortedRows = [...rows].sort((a, b) => {
      const aValue = a[columnId];
      const bValue = b[columnId];

      if (aValue < bValue) return direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    setRows(sortedRows);
  };

  const handleAddColumn = () => {
    const newId = `col_${Date.now()}`;
    setColumns([...columns, {
      id: newId,
      label: 'Новая колонка',
      sortable: true
    }]);
    
    // Добавляем значение в каждую строку
    setRows(rows.map(row => ({ ...row, [newId]: '' })));
  };

  const handleDeleteColumn = (columnId) => {
    setColumns(columns.filter(col => col.id !== columnId));
    setRows(rows.map(row => {
      const { [columnId]: deleted, ...rest } = row;
      return rest;
    }));
  };

  const handleAddRow = () => {
    const newRow = { id: Date.now() };
    columns.forEach(col => {
      newRow[col.id] = '';
    });
    setRows([...rows, newRow]);
  };

  const handleDeleteRow = (rowId) => {
    setRows(rows.filter(row => row.id !== rowId));
  };

  const handleCellChange = (rowId, columnId, value) => {
    setRows(rows.map(row => 
      row.id === rowId 
        ? { ...row, [columnId]: value }
        : row
    ));
  };

  const handleColumnChange = (columnId, field, value) => {
    setColumns(columns.map(col => 
      col.id === columnId 
        ? { ...col, [field]: value }
        : col
    ));
  };

  const handleStyleChange = (property, value) => {
    setTableStyles(prev => ({ ...prev, [property]: value }));
  };

  const handleSave = () => {
    setIsEditing(false);
    if (onUpdate) {
      // Преобразуем данные в формат, совместимый с AI парсером
      const headers = columns.map((col, index) => ({
        id: index + 1,
        label: col.label,
        sortable: col.sortable
      }));
      
      const tableRows = rows.map(row => {
        const rowData = [];
        columns.forEach(col => {
          rowData.push(row[col.id] || '');
        });
        return rowData;
      });

      onUpdate({
        title: propTitle || 'Таблица данных',
        headers: headers,
        rows: tableRows,
        // Дополнительные настройки
        striped: isStriped,
        bordered: isBordered,
        hover: isHover,
        dense: isDense,
        sortable: isSortable,
        customStyles: tableStyles,
        animationSettings: currentAnimationSettings,
        // Для совместимости с оригинальным форматом
        columns: columns,
        initialColumns: columns,
        initialRows: rows
      });
    }
  };

  const handleAnimationUpdate = (newAnimationSettings) => {
    setCurrentAnimationSettings(newAnimationSettings);
  };

  // Обновляем анимацию при изменении настроек
  useEffect(() => {
    if (animationSettings) {
      setCurrentAnimationSettings(animationSettings);
    }
  }, [animationSettings]);

  const getTableStyles = () => ({
    border: isBordered ? `1px solid ${tableStyles.borderColor}` : 'none',
    '& .MuiTableCell-head': {
      backgroundColor: tableStyles.headerBgColor,
      color: tableStyles.headerTextColor,
      fontWeight: 'bold',
      borderBottom: `2px solid ${tableStyles.borderColor}`
    },
    '& .MuiTableCell-body': {
      borderBottom: isBordered ? `1px solid ${tableStyles.borderColor}` : 'none'
    },
    '& .MuiTableRow-root:nth-of-type(even)': isStriped ? {
      backgroundColor: tableStyles.rowAltBgColor
    } : {},
    '& .MuiTableRow-root:hover': isHover ? {
      backgroundColor: `${tableStyles.hoverColor} !important`
    } : {}
  });

  const renderTable = () => {
    // Проверяем, что у нас есть данные для отображения
    if (!columns || columns.length === 0) {
      return (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            Нет данных для отображения
          </Typography>
        </Paper>
      );
    }

    return (
      <TableContainer 
        component={Paper} 
        sx={{ 
          position: 'relative',
          '&:hover .table-overlay': editable ? { opacity: 1 } : {}
        }}
      >
      {/* Overlay для редактирования */}
      {editable && (
        <Box
          className="table-overlay"
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            opacity: 0,
            transition: 'opacity 0.2s ease',
            zIndex: 1
          }}
        >
          <Tooltip title="Редактировать таблицу">
            <IconButton
              size="small"
              onClick={() => setIsEditing(true)}
              sx={{
                backgroundColor: 'rgba(255,255,255,0.9)',
                '&:hover': { backgroundColor: 'rgba(255,255,255,1)' }
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      )}

      <Table size={isDense ? 'small' : 'medium'} sx={getTableStyles()}>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell 
                key={column.id}
                sx={{ 
                  cursor: isSortable && column.sortable ? 'pointer' : 'default',
                  position: 'relative'
                }}
                onClick={() => handleSort(column.id)}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {column.label}
                  {isSortable && column.sortable && (
                    <SortIcon 
                      sx={{ 
                        fontSize: '16px',
                        opacity: sortConfig.key === column.id ? 1 : 0.3,
                        transform: sortConfig.key === column.id && sortConfig.direction === 'desc' 
                          ? 'rotate(180deg)' : 'none',
                        transition: 'all 0.2s ease'
                      }} 
                    />
                  )}
                </Box>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              {columns.map((column) => (
                <TableCell key={column.id}>
                  {row[column.id]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Статистика */}
      <Box sx={{ p: 1, backgroundColor: '#f8f9fa', borderTop: '1px solid #e0e0e0' }}>
        <Typography variant="caption" color="text.secondary">
          Строк: {rows.length} | Колонок: {columns.length}
          {sortConfig.key && ` | Сортировка: ${columns.find(c => c.id === sortConfig.key)?.label} (${sortConfig.direction})`}
        </Typography>
      </Box>
    </TableContainer>
    );
  };

  return (
    <AnimationWrapper 
      key={`${currentAnimationSettings.animationType}-${currentAnimationSettings.delay}-${currentAnimationSettings.disabled}`}
      {...currentAnimationSettings}
    >
      <Box>
        {/* Режим конструктора */}
        {isConstructorMode && (
          <Box sx={{ p: 2, backgroundColor: '#f5f5f5', borderBottom: '1px solid #e0e0e0' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Настройки DataTable
            </Typography>
            <AnimationControls
              animationSettings={currentAnimationSettings}
              onUpdate={handleAnimationUpdate}
            />
          </Box>
        )}

        {/* Превью */}
        {!isEditing && renderTable()}

      {/* Редактор */}
      {isEditing && (
        <Paper sx={{ p: 3, border: '2px solid #1976d2' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
            <Typography variant="h6" color="primary">
              Редактирование таблицы данных
            </Typography>
            <Chip label="Активно" color="primary" size="small" />
          </Box>

          {/* Настройки внешнего вида */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Настройки отображения:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <FormControlLabel
                control={<Switch checked={isStriped} onChange={(e) => setIsStriped(e.target.checked)} />}
                label="Полосатые строки"
              />
              <FormControlLabel
                control={<Switch checked={isBordered} onChange={(e) => setIsBordered(e.target.checked)} />}
                label="Границы"
              />
              <FormControlLabel
                control={<Switch checked={isHover} onChange={(e) => setIsHover(e.target.checked)} />}
                label="Подсветка при наведении"
              />
              <FormControlLabel
                control={<Switch checked={isDense} onChange={(e) => setIsDense(e.target.checked)} />}
                label="Компактный размер"
              />
              <FormControlLabel
                control={<Switch checked={isSortable} onChange={(e) => setIsSortable(e.target.checked)} />}
                label="Сортировка"
              />
            </Box>
          </Box>

          {/* Настройки цветов */}
          <Typography variant="subtitle2" gutterBottom>
            Настройки цветов таблицы:
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 2, mb: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Заголовок таблицы
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <input
                  type="color"
                  value={tableStyles.headerBgColor}
                  onChange={(e) => handleStyleChange('headerBgColor', e.target.value)}
                  style={{ 
                    width: '60px', 
                    height: '40px', 
                    border: '2px solid #ccc',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                />
                <Typography variant="body2">Фон заголовка</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <input
                  type="color"
                  value={tableStyles.headerTextColor}
                  onChange={(e) => handleStyleChange('headerTextColor', e.target.value)}
                  style={{ 
                    width: '60px', 
                    height: '40px', 
                    border: '2px solid #ccc',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                />
                <Typography variant="body2">Цвет текста заголовка</Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Строки таблицы
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <input
                  type="color"
                  value={tableStyles.rowBgColor}
                  onChange={(e) => handleStyleChange('rowBgColor', e.target.value)}
                  style={{ 
                    width: '60px', 
                    height: '40px', 
                    border: '2px solid #ccc',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                />
                <Typography variant="body2">Фон обычных строк</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <input
                  type="color"
                  value={tableStyles.rowAltBgColor}
                  onChange={(e) => handleStyleChange('rowAltBgColor', e.target.value)}
                  style={{ 
                    width: '60px', 
                    height: '40px', 
                    border: '2px solid #ccc',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                />
                <Typography variant="body2">Фон четных строк (полосатые)</Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Дополнительные элементы
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <input
                  type="color"
                  value={tableStyles.borderColor}
                  onChange={(e) => handleStyleChange('borderColor', e.target.value)}
                  style={{ 
                    width: '60px', 
                    height: '40px', 
                    border: '2px solid #ccc',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                />
                <Typography variant="body2">Цвет границ таблицы</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <input
                  type="color"
                  value={tableStyles.hoverColor}
                  onChange={(e) => handleStyleChange('hoverColor', e.target.value)}
                  style={{ 
                    width: '60px', 
                    height: '40px', 
                    border: '2px solid #ccc',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                />
                <Typography variant="body2">Цвет при наведении</Typography>
              </Box>
            </Box>
          </Box>

          {/* Редактирование колонок */}
          <Typography variant="subtitle2" gutterBottom>
            Колонки:
          </Typography>
          <Box sx={{ mb: 2 }}>
            {columns.map((column, index) => (
              <Box key={column.id} sx={{ display: 'flex', gap: 1, mb: 1, alignItems: 'center' }}>
                <TextField
                  size="small"
                  value={column.label}
                  onChange={(e) => handleColumnChange(column.id, 'label', e.target.value)}
                  label={`Колонка ${index + 1}`}
                  sx={{ flex: 1 }}
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={column.sortable}
                      onChange={(e) => handleColumnChange(column.id, 'sortable', e.target.checked)}
                    />
                  }
                  label="Сортировка"
                />
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => handleDeleteColumn(column.id)}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}
            <Button
              variant="outlined"
              size="small"
              startIcon={<AddIcon />}
              onClick={handleAddColumn}
            >
              Добавить колонку
            </Button>
          </Box>

          {/* Редактирование данных */}
          <Typography variant="subtitle2" gutterBottom>
            Данные таблицы:
          </Typography>
          <Box sx={{ mb: 3, maxHeight: 300, overflow: 'auto' }}>
            {rows.map((row, rowIndex) => (
              <Paper key={row.id} sx={{ p: 1, mb: 1, border: '1px solid #e0e0e0' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Typography variant="caption">Строка {rowIndex + 1}</Typography>
                  <Box sx={{ flex: 1 }} />
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDeleteRow(row.id)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {columns.map((column) => (
                    <TextField
                      key={column.id}
                      size="small"
                      value={row[column.id] || ''}
                      onChange={(e) => handleCellChange(row.id, column.id, e.target.value)}
                      label={column.label}
                      sx={{ minWidth: 150 }}
                    />
                  ))}
                </Box>
              </Paper>
            ))}
            <Button
              variant="outlined"
              size="small"
              startIcon={<AddIcon />}
              onClick={handleAddRow}
            >
              Добавить строку
            </Button>
          </Box>

          {/* Настройки анимации */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Настройки анимации:
            </Typography>
            <AnimationControls
              animationSettings={currentAnimationSettings}
              onUpdate={handleAnimationUpdate}
            />
          </Box>

          {/* Предварительный просмотр */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Предварительный просмотр:
            </Typography>
            <Box sx={{ border: '1px dashed #ccc', borderRadius: 1, p: 1 }}>
              {renderTable()}
            </Box>
          </Box>

          {/* Кнопки */}
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
            <Button onClick={() => setIsEditing(false)}>
              Отмена
            </Button>
            <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSave}>
              Сохранить
            </Button>
          </Box>
        </Paper>
      )}
      </Box>
    </AnimationWrapper>
  );
};

export default DataTable; 