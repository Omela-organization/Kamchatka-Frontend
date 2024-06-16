'use client'

import { useState } from 'react';
import { useRouter } from 'next/router'; 
import { loginUser } from '../utils/auth';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter(); 

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const tokens = await loginUser(username, password);
      localStorage.setItem('accessToken', tokens.accessToken);
      router.push('/dashboard');
    } catch (error) {
      setError('Неверное имя пользователя или пароль');
      console.error('Ошибка входа:', error);
    }
  };

  return (
    <div>
      <h1>Вход в систему</h1>
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="username">Имя пользователя:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Пароль:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Войти</button>
      </form>
    </div>
  );
};

export default LoginPage;
