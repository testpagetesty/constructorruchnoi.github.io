import React, { useState, useEffect, useMemo } from 'react';
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
import ColorSettings from '../TextComponents/ColorSettings';

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
  
  // Цветовые настройки через ColorSettings
  colorSettings = {},
  
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

  // Обрабатываем данные из element.data если они есть
  const elementData = propRows || propHeaders ? null : (element?.data || element?.rows);
  const processedElementData = elementData ? {
    columns: elementData.columns || initialColumns,
    rows: elementData.rows || initialRows
  } : null;

  const [columns, setColumns] = useState(processedColumns || processedElementData?.columns || initialColumns);
  const [rows, setRows] = useState(processedRows || processedElementData?.rows || initialRows);
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

  // Состояние для ColorSettings
  const [currentColorSettings, setCurrentColorSettings] = useState(colorSettings || {});
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

  // Обработчик обновления цветовых настроек
  const handleColorUpdate = (newColorSettings) => {
    setCurrentColorSettings(newColorSettings);
  };

  const handleSave = () => {
    setIsEditing(false);
    if (onUpdate) {
      console.log('[DataTable] Saving data:', { columns, rows, propTitle });
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

      // Создаем полные данные таблицы включая заголовки
      const fullTableData = [
        columns.map(col => col.label), // Заголовки
        ...tableRows // Данные
      ];

      onUpdate({
        title: propTitle || 'Таблица данных',
        headers: headers,
        rows: tableRows,
        data: fullTableData, // Добавляем полные данные для экспорта
        // Настройки отображения
        striped: isStriped,
        bordered: isBordered,
        hover: isHover,
        dense: isDense,
        sortable: isSortable,
        // Настройки сортировки
        sortConfig: sortConfig,
        // Стили и цвета
        customStyles: tableStyles,
        colorSettings: currentColorSettings,
        animationSettings: currentAnimationSettings,
        // Для совместимости с оригинальным форматом
        columns: columns,
        initialColumns: columns,
        initialRows: rows,
        // Дополнительные настройки для экспорта
        tableSettings: {
          striped: isStriped,
          bordered: isBordered,
          hover: isHover,
          dense: isDense,
          sortable: isSortable,
          sortConfig: sortConfig
        }
      });
    }
  };

  const handleAnimationUpdate = (newAnimationSettings) => {
    setCurrentAnimationSettings(newAnimationSettings);
  };

  // Мемоизируем animationSettings чтобы избежать бесконечного цикла
  const memoizedAnimationSettings = useMemo(() => animationSettings, [
    animationSettings?.animationType,
    animationSettings?.delay,
    animationSettings?.triggerOnView,
    animationSettings?.triggerOnce,
    animationSettings?.threshold,
    animationSettings?.disabled
  ]);

  // Обновляем анимацию при изменении настроек
  useEffect(() => {
    if (memoizedAnimationSettings) {
      setCurrentAnimationSettings(memoizedAnimationSettings);
    }
  }, [memoizedAnimationSettings]);

  // Обновляем данные при изменении пропсов
  useEffect(() => {
    if (propHeaders && propHeaders.length > 0) {
      const newColumns = propHeaders.map((header, index) => ({
        id: header.id || `col_${index + 1}`,
        label: header.label,
        sortable: header.sortable !== false
      }));
      setColumns(newColumns);
    }
  }, [propHeaders]);

  useEffect(() => {
    if (propRows && propRows.length > 0) {
      const newRows = propRows.map((row, index) => {
        const rowObj = { id: index + 1 };
        columns.forEach((col, colIndex) => {
          rowObj[col.id] = row[colIndex] || '';
        });
        return rowObj;
      });
      setRows(newRows);
    }
  }, [propRows, columns]);

  const getTableStyles = () => {
    // Используем colorSettings если они есть, иначе fallback на tableStyles
    const headerBgColor = currentColorSettings?.textFields?.headerBg || tableStyles.headerBgColor;
    const headerTextColor = currentColorSettings?.textFields?.headerText || tableStyles.headerTextColor;
    const rowBgColor = currentColorSettings?.textFields?.rowBg || tableStyles.rowBgColor;
    const rowAltBgColor = currentColorSettings?.textFields?.rowAltBg || tableStyles.rowAltBgColor;
    const borderColor = currentColorSettings?.textFields?.border || tableStyles.borderColor;
    const hoverColor = currentColorSettings?.textFields?.hover || tableStyles.hoverColor;
    const textColor = currentColorSettings?.textFields?.text || tableStyles.textColor;

    return {
      border: isBordered ? `1px solid ${borderColor}` : 'none',
    '& .MuiTableCell-head': {
        backgroundColor: headerBgColor,
        color: headerTextColor,
      fontWeight: 'bold',
        borderBottom: `2px solid ${borderColor}`
    },
    '& .MuiTableCell-body': {
        borderBottom: isBordered ? `1px solid ${borderColor}` : 'none',
        color: textColor
    },
    '& .MuiTableRow-root:nth-of-type(even)': isStriped ? {
        backgroundColor: rowAltBgColor
    } : {},
    '& .MuiTableRow-root:hover': isHover ? {
        backgroundColor: `${hoverColor} !important`
      } : {},
      '& .MuiTableRow-root': {
        transition: 'background-color 0.2s ease'
      }
    };
  };

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
      <Box>
        {/* Заголовок таблицы */}
        {propTitle && (
          <Box sx={{ 
            p: 2, 
            backgroundColor: currentColorSettings?.textFields?.headerBg || tableStyles.headerBgColor || 'rgba(0,0,0,0.85)',
            color: currentColorSettings?.textFields?.headerText || currentColorSettings?.textFields?.title || tableStyles.headerTextColor || '#ffd700',
            borderTopLeftRadius: 4,
            borderTopRightRadius: 4,
            borderBottom: `2px solid ${currentColorSettings?.textFields?.border || tableStyles.borderColor || '#c41e3a'}`
          }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 'bold',
                textAlign: 'center',
                m: 0
              }}
            >
              {propTitle}
            </Typography>
          </Box>
        )}
        
        <TableContainer 
          component={Paper} 
          sx={{ 
            position: 'relative',
            '&:hover .table-overlay': editable ? { opacity: 1 } : {},
            borderTopLeftRadius: propTitle ? 0 : 4,
            borderTopRightRadius: propTitle ? 0 : 4
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
    </Box>
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

          {/* Редактирование заголовка таблицы */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Заголовок таблицы:
            </Typography>
            <TextField
              fullWidth
              value={propTitle || ''}
              onChange={(e) => {
                if (onUpdate) {
                  onUpdate({
                    ...onUpdate,
                    title: e.target.value
                  });
                }
              }}
              placeholder="Введите заголовок таблицы"
              size="small"
            />
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

          {/* Настройки цветов через ColorSettings */}
          <ColorSettings
            title="Настройки цветов таблицы данных"
            colorSettings={currentColorSettings}
            onUpdate={handleColorUpdate}
            availableFields={[
              { name: 'headerBg', label: 'Фон заголовка', description: 'Цвет фона заголовка таблицы', defaultColor: 'rgba(0,0,0,0.85)' },
              { name: 'headerText', label: 'Текст заголовка', description: 'Цвет текста заголовка таблицы', defaultColor: '#ffd700' },
              { name: 'rowBg', label: 'Фон строк', description: 'Цвет фона обычных строк', defaultColor: 'rgba(0,0,0,0.7)' },
              { name: 'rowAltBg', label: 'Фон четных строк', description: 'Цвет фона четных строк (полосатые)', defaultColor: 'rgba(0,0,0,0.85)' },
              { name: 'border', label: 'Границы', description: 'Цвет границ таблицы', defaultColor: '#c41e3a' },
              { name: 'hover', label: 'При наведении', description: 'Цвет при наведении на строки', defaultColor: 'rgba(196,30,58,0.15)' },
              { name: 'text', label: 'Текст', description: 'Цвет основного текста в ячейках', defaultColor: '#fff' }
            ]}
          />

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