from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

app = FastAPI()

# Наша импровизированная база данных
fake_database = []


# Pydantic-модель для валидации входящих данных
class Task(BaseModel):
    title: str
    description: str | None = None
    is_completed: bool = False


# 1. READ: Получить все задачи
@app.get("/tasks")
def get_tasks():
    return fake_database


# 2. CREATE: Создать новую задачу
@app.post("/tasks")
def create_task(task: Task):
    # Генерируем ID для новой задачи (просто длина списка + 1)
    new_task = task.dict()  # Превращаем Pydantic-модель в словарь
    new_task["id"] = len(fake_database) + 1

    # Сохраняем в "базу"
    fake_database.append(new_task)
    return new_task


# 3. UPDATE: Обновить задачу по ID
@app.put("/tasks/{task_id}")
def update_task(task_id: int, task: Task):
    # Ищем задачу по ID
    for idx, t in enumerate(fake_database):
        if t["id"] == task_id:
            # Обновляем данные, сохраняя оригинальный ID
            updated_task = task.dict()
            updated_task["id"] = task_id
            fake_database[idx] = updated_task
            return updated_task

    # Если цикл завершился и мы ничего не вернули — задачи нет
    raise HTTPException(status_code=404, detail="Задача не найдена")


# 4. DELETE: Удалить задачу по ID
@app.delete("/tasks/{task_id}")
def delete_task(task_id: int):
    for idx, t in enumerate(fake_database):
        if t["id"] == task_id:
            del fake_database[idx]
            return {"message": "Задача успешно удалена"}

    # Если задача не найдена, выбрасываем ошибку
    raise HTTPException(status_code=404, detail="Задача не найдена")