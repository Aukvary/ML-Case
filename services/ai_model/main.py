from fastapi import FastAPI
from pydantic import BaseModel
from src.model import TextEmbedder

app = FastAPI() # API
embedder = TextEmbedder() # Model

class VectorRequest(BaseModel): # Фильтрация
    type: str
    text: str

# Лехин endpoint
@app.get("/")
def read_root():
    return {"service": "model", "status": "active"}

# Мой endpoint
@app.post("/vectorize")
async def vectorize(data: VectorRequest):
    # Запрос
    if data.type == "query":
        vector = embedder.get_embedding(data.text, data.type)
        return {
            "vector": vector,
            "dim": embedder.dim
        }
    # Документ
    else:
        chunks = embedder.split_text(data.text)
        payload = []
        
        for chunk in chunks: # Обработка чанков
            vector = embedder.get_embedding(chunk, "passage")
            payload.append({
                "content": chunk,
                "vector": vector
            })

        return {
            "type": "passage",
            "chunks": payload
        }