import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ResetPasswordPage from './pages/ResetPasswordPage';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/" element={<div><h1>Головна сторінка</h1><p>Перейдіть на /reset-password?token=ВАШ_ТОКЕН для тестування.</p></div>} />
      </Routes>
    </div>
  );
}

export default App;