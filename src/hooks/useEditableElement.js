import { useState, useCallback } from 'react';

export const useEditableElement = (initialData, onUpdate, onSave = null, onCancel = null) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(initialData);

  const handleStartEdit = useCallback(() => {
    setIsEditing(true);
    setEditData(initialData);
  }, [initialData]);

  const handleSave = useCallback(() => {
    if (onSave) {
      onSave(editData);
    } else if (onUpdate) {
      onUpdate(editData);
    }
    setIsEditing(false);
  }, [editData, onUpdate, onSave]);

  const handleCancel = useCallback(() => {
    setEditData(initialData);
    if (onCancel) {
      onCancel();
    }
    setIsEditing(false);
  }, [initialData, onCancel]);

  const handleChange = useCallback((field, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const handleNestedChange = useCallback((path, value) => {
    setEditData(prev => {
      const newData = { ...prev };
      const keys = path.split('.');
      let current = newData;
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {};
        }
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newData;
    });
  }, []);

  return {
    isEditing,
    editData,
    handleStartEdit,
    handleSave,
    handleCancel,
    handleChange,
    handleNestedChange,
    setEditData
  };
};

export default useEditableElement; 