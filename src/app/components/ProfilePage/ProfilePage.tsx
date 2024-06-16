import { useEffect, useState } from 'react';
import { getUserDataByToken } from '../../../utils/api';

function ProfilePage() {
    const [userData, setUserData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const accessToken = localStorage.getItem('accessToken');
                if (accessToken) {
                    const userDataResponse = await getUserDataByToken(accessToken);
                    setUserData(userDataResponse);
                }
            } catch (error: any) {
                console.error('Ошибка при получении данных пользователя:', error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div>Загрузка данных...</div>;
    }

    if (!userData) {
        return <div>Данные пользователя не найдены.</div>;
    }

    return (
        <div>
            <h1>Профиль пользователя</h1>
            <p>Имя: {userData.name}</p>
            <p>Email: {userData.email}</p>
        </div>
    );
}

export default ProfilePage;
