import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './styles/cards.css';  // Добавляем импорт стилей карточек
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
); 