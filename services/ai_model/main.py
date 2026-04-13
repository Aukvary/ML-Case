import os
import threading
from fastapi import FastAPI, Header, HTTPException, Depends
from dotenv import load_dotenv
from pydantic import BaseModel
from contextlib import asynccontextmanager
from src.model import TextEmbedder

load_dotenv()
INTERNAL_API_KEY = os.getenv("INTERNAL_API_KEY")

# Глобальные переменные
embedder = None
model_ready = False


# Фоновая инициализация
def load_model_task():
    global embedder, model_ready
    print("Загрузка модели началась")
    embedder = TextEmbedder()
    model_ready = True
    print(f"Модель загружена. Размерность эмбеддингов: {embedder.dim}")


@asynccontextmanager
async def lifespan(app: FastAPI):
    thread = threading.Thread(target=load_model_task)
    thread.start()
    yield
    print("Сервис остановлен")

app = FastAPI(lifespan=lifespan)

 # Фильтрация
class VectorRequest(BaseModel):
    type: str
    text: str

# Доступ
async def verify(app_secret: str = Header(None, alias="App-Secret")):
    if app_secret != INTERNAL_API_KEY:
        raise HTTPException(status_code=401, detail="Unauthorized: Invalid App-Secret")
    else:
        return app_secret
    
# ready-check для модели
def get_engine():
    if not model_ready or embedder is None:
        raise HTTPException(status_code=503, detail="Модель инициализируется...")
    return embedder

# health-check
@app.get("/")
def read_root():
    return {
        "service": "model",
        "status": INTERNAL_API_KEY
    }

# model-info
@app.get("/model-info")
async def get_model_info(
    authorized: str = Depends(verify),
    engine: TextEmbedder = Depends(get_engine)
):
    return {
        "model_name": "multilingual-e5-small",
        "vector_dim": engine.dim
    }

# 2vec
@app.post("/vectorize")
async def vectorize(
    data: VectorRequest,
    engine: TextEmbedder = Depends(get_engine)
):
    # Запрос
    if data.type == "query":
        vector = engine.get_embedding(data.text, data.type)
        return {"vector": vector, "dim": engine.dim}
    
    # Документ
    else:
        chunks = engine.split_text(data.text)
        payload = []
        
        for chunk in chunks:
            vector = engine.get_embedding(chunk, "passage")
            payload.append({"content": chunk, "vector": vector})

        return {"type": "passage", "chunks": payload}