const API_BASE = "http://localhost:8000";

class APIClient {
    constructor(baseURL = API_BASE) {
        this.baseURL = baseURL;
        this.token = null;
    }

    // Установка токена аутентификации
    setToken(token) {
        this.token = token;
    }

    // Получение заголовков с авторизацией
    getHeaders() {
        const headers = {};
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }
        return headers;
    }

    // Обработка ответов
    async handleResponse(response) {
        if (!response.ok) {
            let errorMessage;
            try {
                const error = await response.json();
                errorMessage = error.detail || `HTTP ${response.status}: ${response.statusText}`;
            } catch (e) {
                errorMessage = await response.text().catch(() => response.statusText);
            }
            throw new Error(errorMessage);
        }
        
        // Проверяем, есть ли содержимое в ответе
        const text = await response.text();
        if (!text) return {};
        
        try {
            return JSON.parse(text);
        } catch (e) {
            return { result: text };
        }
    }
    
    /**
     * GET /model/status - Проверка статуса модели AI
     * @returns {Promise<string>} Статус модели
     */
    async getModelStatus() {
        const response = await fetch(`${this.baseURL}/model/status`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        return this.handleResponse(response);
    }

    /**
     * POST /front/register_user - Регистрация нового пользователя
     * @param {string} username - Имя пользователя
     * @param {string} password - Пароль
     * @returns {Promise<string>} Результат регистрации
     */
    async registerUser(username, password) {
        const params = new URLSearchParams();
        params.append('username', username);
        params.append('password', password);

        const response = await fetch(`${this.baseURL}/front/register_user?${params}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        return this.handleResponse(response);
    }

    /**
     * PUT /front/update_user - Обновление данных пользователя
     * @param {string} username - Текущее имя пользователя
     * @param {Object} updates - Обновляемые данные
     * @param {string} [updates.new_username] - Новое имя пользователя
     * @param {string} [updates.new_password] - Новый пароль
     * @param {string} [updates.new_role] - Новая роль
     * @returns {Promise<string>} Результат обновления
     */
    async updateUser(username, updates) {
        const params = new URLSearchParams();
        params.append('username', username);
        if (updates.new_username) params.append('new_username', updates.new_username);
        if (updates.new_password) params.append('new_password', updates.new_password);
        if (updates.new_role) params.append('new_role', updates.new_role);

        const response = await fetch(`${this.baseURL}/front/update_user?${params}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        return this.handleResponse(response);
    }

    /**
     * GET /front/check_auth - Проверка аутентификации пользователя
     * @param {string} username - Имя пользователя
     * @param {string} password - Пароль
     * @returns {Promise<string>} Результат проверки
     */
    async checkAuth(username, password) {
        const params = new URLSearchParams();
        params.append('username', username);
        params.append('password', password);

        const response = await fetch(`${this.baseURL}/front/check_auth?${params}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        return this.handleResponse(response);
    }

    /**
     * GET /front/get_all_users - Получение списка всех пользователей
     * @returns {Promise<string>} Список пользователей (строка)
     */
    async getAllUsers() {
        const response = await fetch(`${this.baseURL}/front/get_all_users`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        return this.handleResponse(response);
    }

    /**
     * POST /front/search_request - Семантический поиск документов
     * @param {string} request - Поисковый запрос
     * @returns {Promise<string>} Результаты поиска
     */
    async searchRequest(request) {
        const response = await fetch(`${this.baseURL}/front/search_request`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ request })
        });
        return this.handleResponse(response);
    }

    /**
     * POST /front/upload_file - Загрузка файла
     * @param {File} file - Файл для загрузки
     * @param {Object} options - Дополнительные параметры (не используются в текущем API)
     * @returns {Promise<string>} Результат загрузки
     */
    async uploadFile(file, options = {}) {
        console.log('Uploading file:', file.name, 'Size:', file.size);
        
        const formData = new FormData();
        formData.append('file', file);
        
        // Добавляем дополнительные поля, если бэкенд их ожидает
        if (options.documentName) {
            formData.append('documentName', options.documentName);
        }
        if (options.secretLevel) {
            formData.append('secretLevel', options.secretLevel);
        }

        // Логируем отправляемые данные
        for (let pair of formData.entries()) {
            console.log('FormData entry:', pair[0], pair[1]);
        }

        try {
            const response = await fetch(`${this.baseURL}/front/upload_file`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: formData
            });
            
            console.log('Response status:', response.status);
            console.log('Response headers:', response.headers);
            
            // Пробуем получить текст ответа для диагностики
            const responseText = await response.text();
            console.log('Response text:', responseText);
            
            if (!response.ok) {
                throw new Error(`Server error (${response.status}): ${responseText || response.statusText}`);
            }
            
            // Пробуем распарсить JSON если возможно
            try {
                return JSON.parse(responseText);
            } catch (e) {
                return { result: responseText };
            }
        } catch (error) {
            console.error('Upload error details:', error);
            throw error;
        }
    }

    /**
     * GET /front/get_file - Получение файла по названию
     * @param {string} title - Название файла
     * @returns {Promise<string>} Содержимое файла
     */
    async getFile(title) {
        const params = new URLSearchParams();
        params.append('title', title);

        const response = await fetch(`${this.baseURL}/front/get_file?${params}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        return this.handleResponse(response);
    }

    /**
     * GET / - Корневой эндпоинт
     * @returns {Promise<string>} Базовая информация об API
     */
    async getRoot() {
        const response = await fetch(`${this.baseURL}/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        return this.handleResponse(response);
    }
    /**
     * GET /front/get_file - Скачивание файла
     * @param {string} title - Название файла
     * @returns {Promise<Blob>} Блоб с файлом
     */
    async downloadFile(title) {
        const params = new URLSearchParams();
        params.append('title', title);

        const response = await fetch(`${this.baseURL}/front/get_file?${params}`, {
            method: 'GET',
            headers: this.getHeaders()
        });
        
        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Download failed: ${error}`);
        }
        
        return response.blob();
    }
}

export default APIClient;