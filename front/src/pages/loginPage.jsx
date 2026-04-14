import { useState } from 'react';
// Для перехода по страницам
import { useNavigate } from 'react-router-dom';

import eyeOpen from '../assets/eye_open.png';
import eyeClose from '../assets/eye_close.png';

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState('ready');
    // Переключатель кнопки показа пароля
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    // Функция для отображения статуса подключения
    const getStatusButton = () => {
        switch(connectionStatus) {
            case 'loading':
                return { text: '⏳', style: { backgroundColor: '#ffc107' }, title: 'Подключение...' };
            case 'success':
                return { text: '✅', style: { backgroundColor: '#28a745' }, title: 'Успешно!' };
            case 'error':
                return { text: '❌', style: { backgroundColor: '#dc3545' }, title: 'Ошибка подключения' };
            default:
                return { text: '🔌', style: { backgroundColor: '#6c757d' }, title: 'Готов к подключению' };
        }
    };
    // Функция проверки статуса подключения к БД
    const checkConnectionStatus = async () => {
        setConnectionStatus('loading');
        
        try {
            // Простой GET запрос для проверки подключения
            const response = await fetch('http://localhost:6000/api/status', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            
            if (response.ok) {
                setConnectionStatus('success');
                // Через 2 секунды возвращаем исходный статус
                setTimeout(() => {
                    setConnectionStatus('ready');
                }, 2000);
            } else {
                setConnectionStatus('error');
                setTimeout(() => {
                    setConnectionStatus('ready');
                }, 2000);
            }
        } catch (error) {
            console.error('Ошибка подключения:', error);
            setConnectionStatus('error');
            setTimeout(() => {
                setConnectionStatus('ready');
            }, 2000);
        }
    };
    // Функция для навигации
    const navigate = useNavigate();
    // Функция перехода в main
    const handleLogin = () => {
        // Здесь будет API запрос в БД и проверка LOGIN/PASSWORD
        
        navigate('/main');  // Переход на страницу MainPage
    };

    return (
        <div className="container">
            <div className="registrationCard">
                <h1 className="title">LOSE//LINE</h1>
                <hr className="cutter" style={{'margin-bottom':'60px'}} />
                <input type="login" placeholder="LOGIN" className="inputText"></input>
                <br />
                <input type={showPassword ? "text" : "password"} placeholder="PASSWORD" className="inputText"></input>
                <br />
                <div style={{'display':'flex', 'alignItems':'space-between', 'justifyContent':'center'}}>
                    <button className="button" onClick={handleLogin}>LOGIN</button>
                    <button className="button" style={{'padding':'15px', 'width':'60px'}} onClick={togglePasswordVisibility}>
                        <img src={showPassword ? eyeOpen : eyeClose }  style={{'width':'25px'}}></img>
                    </button>
                </div>
                <input type="text" placeholder={getStatusButton} style={{'background':'#20202f', 'border':'0px solid black'}}></input>
                <hr className="cutter" style={{'margin-top':'60px', 'margin-bottom':'30px'}}/>
            </div>
        </div>
    );
}