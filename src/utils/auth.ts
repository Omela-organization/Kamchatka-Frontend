// utils/auth.js

export async function loginUser(username:any, password:any) {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
  
    if (!response.ok) {
      throw new Error('Ошибка входа');
    }
  
    return response.json();
  }
  
  export async function refreshToken(refreshToken:any) {
    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });
  
    if (!response.ok) {
      throw new Error('Ошибка обновления токена');
    }
  
    return response.json();
  }
  