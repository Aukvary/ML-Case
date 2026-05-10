// apiClient.js
// Полный API клиент для взаимодействия с FastAPI бэкендом

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
        const headers = {
            'Content-Type': 'application/json',
        };
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }
        return headers;
    }

    // Обработка ответов
    async handleResponse(response) {
        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.detail || `HTTP ${response.status}: ${response.statusText}`);
        }
        return response.json();
    }

    // ========== AI Model Interaction ==========
    
    /**
     * GET /model/status - Проверка статуса модели AI
     * @returns {Promise<Object>} Статус модели (загружена/не загружена)
     */
    async getModelStatus() {
        const response = await fetch(`${this.baseURL}/model/status`, {
            method: 'GET',
            headers: this.getHeaders()
        });
        return this.handleResponse(response);
    }

    // ========== Front Interaction ==========

    /**
     * PUT /front/update_user - Обновление данных пользователя
     * @param {string} username - Текущее имя пользователя
     * @param {Object} updates - Обновляемые данные
     * @param {string} [updates.new_username] - Новое имя пользователя
     * @param {string} [updates.new_password] - Новый пароль
     * @param {string} [updates.new_role] - Новая роль
     * @returns {Promise<Object>} Результат обновления
     */
    async updateUser(username, updates) {
        const params = new URLSearchParams();
        params.append('username', username);
        if (updates.new_username) params.append('new_username', updates.new_username);
        if (updates.new_password) params.append('new_password', updates.new_password);
        if (updates.new_role) params.append('new_role', updates.new_role);

        const response = await fetch(`${this.baseURL}/front/update_user?${params}`, {
            method: 'PUT',
            headers: this.getHeaders()
        });
        return this.handleResponse(response);
    }

    /**
     * GET /front/check_auth - Проверка аутентификации пользователя
     * @param {string} username - Имя пользователя
     * @param {string} password - Пароль
     * @returns {Promise<Object>} Результат проверки (обычно строка с результатом)
     */
    async checkAuth(username, password) {
        const params = new URLSearchParams();
        params.append('username', username);
        params.append('password', password);

        const response = await fetch(`${this.baseURL}/front/check_auth?${params}`, {
            method: 'GET',
            headers: this.getHeaders()
        });
        return this.handleResponse(response);
    }

    /**
     * GET /front/get_all_users - Получение списка всех пользователей
     * @returns {Promise<Array>} Список пользователей
     */
    async getAllUsers() {
        const response = await fetch(`${this.baseURL}/front/get_all_users`, {
            method: 'GET',
            headers: this.getHeaders()
        });
        return this.handleResponse(response);
    }

    /**
     * POST /front/search_request - Семантический поиск документов
     * @param {string} request - Поисковый запрос
     * @returns {Promise<Array>} Результаты поиска
     */
    async searchRequest(request) {
        const response = await fetch(`${this.baseURL}/front/search_request`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify({ request })
        });
        return this.handleResponse(response);
    }

    /**
     * POST /front/upload_file - Загрузка файла
     * @param {File} file - Файл для загрузки
     * @param {Object} options - Дополнительные параметры (если нужны)
     * @returns {Promise<Object>} Результат загрузки
     */
    async uploadFile(file, options = {}) {
        const formData = new FormData();
        formData.append('file', file);
        
        // Если есть дополнительные параметры, добавляем их
        if (options.documentName) {
            formData.append('documentName', options.documentName);
        }
        if (options.secretLevel) {
            formData.append('secretLevel', options.secretLevel);
        }

        // Для multipart/form-data не устанавливаем Content-Type: application/json
        const headers = {};
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        const response = await fetch(`${this.baseURL}/front/upload_file`, {
            method: 'POST',
            headers,
            body: formData
        });
        return this.handleResponse(response);
    }

    /**
     * GET / - Корневой эндпоинт (информация о сервере)
     * @returns {Promise<Object>} Базовая информация об API
     */
    async getRoot() {
        const response = await fetch(`${this.baseURL}/`, {
            method: 'GET',
            headers: this.getHeaders()
        });
        return this.handleResponse(response);
    }

    // ========== Комбинированные операции ==========

    /**
     * Полная аутентификация пользователя (проверка + получение роли)
     * @param {string} username - Имя пользователя
     * @param {string} password - Пароль
     * @returns {Promise<Object>} Результат аутентификации
     */
    async authenticate(username, password) {
        try {
            const result = await this.checkAuth(username, password);
            // В зависимости от формата ответа бэкенда
            const isAuthenticated = result === "success" || result?.authenticated === true;
            
            let role = null;
            if (isAuthenticated) {
                // Если нужно получить роль, делаем запрос к информации о пользователе
                const users = await this.getAllUsers();
                const user = users.find(u => u.username === username);
                role = user?.role || "USER";
            }
            
            return {
                authenticated: isAuthenticated,
                role,
                message: result
            };
        } catch (error) {
            return {
                authenticated: false,
                role: null,
                error: error.message
            };
        }
    }

    /**
     * Загрузка нескольких файлов последовательно
     * @param {File[]} files - Массив файлов
     * @param {Function} onProgress - Callback прогресса (current, total)
     * @returns {Promise<Array>} Результаты загрузки
     */
    async uploadMultipleFiles(files, onProgress = null) {
        const results = [];
        for (let i = 0; i < files.length; i++) {
            if (onProgress) {
                onProgress(i + 1, files.length);
            }
            try {
                const result = await this.uploadFile(files[i]);
                results.push({ success: true, file: files[i].name, result });
            } catch (error) {
                results.push({ success: false, file: files[i].name, error: error.message });
            }
        }
        return results;
    }
}

// Создаем экземпляр клиента
const apiClient = new APIClient();

export default APIClient;
export { APIClient };