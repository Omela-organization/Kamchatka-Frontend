import axios from 'axios';

const BASE_URL = 'http://194.113.35.2:8000/api/v1';

export async function postData(endpoint: string, data: any) {
    try {
        const response = await axios.post(`${BASE_URL}${endpoint}`, data);
        return response.data;
    } catch (error:any) {
        throw new Error(error.response?.data?.detail || 'Что-то пошло не так');
    }
}

interface AuthResponse {
    access_token: string;
    refresh_token: string;
    token_type: string;
}

export async function loginUser(email: string, password: string): Promise<AuthResponse> {
    const data = { email, password };
    return await postData('/auth/login', data);
}

export async function refreshAccessToken(refreshToken: string): Promise<string> {
    const data = { refreshToken };
    return await postData('/auth/refresh', data);
}

export async function getUserDataByToken(accessToken: string): Promise<any> {
    try {
        const response = await axios.post(`${BASE_URL}/auth/user_data_by_token`, {}, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response.data;
    } catch (error:any) {
        throw new Error(error.response?.data?.detail || 'Ошибка при получении данных пользователя');
    }
}
