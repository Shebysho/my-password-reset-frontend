import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ResetPasswordPage.css';

const BACKEND_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setError('Токен для скидання пароля не знайдено в URL.');
    }
  }, [token]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');

    if (!token) {
      setError('Недійсний або відсутній токен.');
      return;
    }
    if (!password || !confirmPassword) {
      setError('Будь ласка, заповніть обидва поля пароля.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Паролі не співпадають.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(`${BACKEND_API_URL}/auth/reset-pwd`, {
        token: token,
        password: password,
      });

      setMessage(response.data.message || 'Пароль успішно скинуто!');
      setPassword('');
      setConfirmPassword('');
      setError('');
      setTimeout(() => navigate('/login'), 5000);

    } catch (err) {
      setError(err.response?.data?.message || 'Не вдалося скинути пароль. Посилання може бути застарілим або недійсним.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="reset-password-container">
      <h2>Скинути пароль</h2>
      {!token && error ? (
         <p className="error-message">{error}</p>
      ) : (
        <form onSubmit={handleSubmit} className="reset-password-form">
          <div className="form-group">
            <label htmlFor="password">Новий пароль:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading || message}
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Підтвердіть новий пароль:</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={isLoading || message}
            />
          </div>
          <button type="submit" disabled={isLoading || !token || message}>
            {isLoading ? 'Обробка...' : 'Скинути пароль'}
          </button>
        </form>
      )}
      {message && <p className="success-message">{message} Перенаправлення на логін...</p>}
      {error && !message && <p className="error-message">{error}</p>}
    </div>
  );
}

export default ResetPasswordPage;