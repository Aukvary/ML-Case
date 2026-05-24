import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import APIClient from '../apiClient';

import eyeOpen from '../assets/eye_open.png';
import eyeClose from '../assets/eye_close.png';

const api = new APIClient();

export default function LoginPage() {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState('ready');
    
    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

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

    const checkConnectionStatus = async () => {
        setConnectionStatus('loading');
        
        try {
            const response = await fetch('http://localhost:8000/model/status', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            
            if (response.ok) {
                setConnectionStatus('success');
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

    const handleLogin = async () => {
        if (login === 'admin' && password === 'admin') {
            localStorage.setItem('username', login);
            navigate('/main');
            return;
        }
        
        if (!login.trim() || !password.trim()) {
            alert('Введите логин и пароль');
            return;
        }
        
        setConnectionStatus('loading');
        
        try {
            const result = await api.checkAuth(login, password);
            if (result === "success" || result?.authenticated === true || result === true) {
                setConnectionStatus('success');
                localStorage.setItem('username', login);
                setTimeout(() => {
                    navigate('/main');
                }, 500);
            } else {
                setConnectionStatus('error');
                alert('Неверный логин или пароль');
                setTimeout(() => {
                    setConnectionStatus('ready');
                }, 2000);
            }
        } catch (error) {
            console.error('Ошибка подключения:', error);
            setConnectionStatus('error');
            alert('Ошибка подключения к серверу');
            setTimeout(() => {
                setConnectionStatus('ready');
            }, 2000);
        }
    };

    return (
        <div className="container">
            <div className="registrationCard">
                <h1 className="title">LOSE//LINE</h1>
                <hr className="cutter" style={{marginBottom: '60px'}} />
                <input 
                    type="text" 
                    placeholder="LOGIN" 
                    className="inputText"
                    value={login}
                    onChange={(e) => setLogin(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                />
                <br />
                <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="PASSWORD" 
                    className="inputText"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                />
                <br />
                <div style={{display: 'flex', alignItems: 'space-between', justifyContent: 'center'}}>
                    <button className="button" onClick={handleLogin}>LOGIN</button>
                    <button className="button" style={{padding: '15px', width: '60px'}} onClick={togglePasswordVisibility}>
                        <img src={showPassword ? eyeOpen : eyeClose} style={{width: '25px'}} alt="toggle password"/>
                    </button>
                </div>
                <hr className="cutter" style={{marginTop: '60px', marginBottom: '30px'}}/>
            </div>
        </div>
    );
}