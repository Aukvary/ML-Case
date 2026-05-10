import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import LoginPage from './pages/loginPage'
import MainPage from './pages/mainPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>  {/* Routes для маршрутизации */}
        <Route path="/" element={<LoginPage />} />      {/* Главная страница со входом */}
        <Route path="/main" element={<MainPage />} />   {/* Страница с поисковиком     */}
      </Routes>
    </BrowserRouter>
  );
}