import os
from fastapi import FastAPI, Header, HTTPException, Depends
from dotenv import load_dotenv
from pydantic import BaseModel
from src.model import TextEmbedder

load_dotenv()
INTERNAL_API_KEY = os.getenv("INTERNAL_API_KEY")

app = FastAPI()
embedder = TextEmbedder() # Model

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

# health-check
@app.get("/")
def read_root():
    return {"service": "model", "status": INTERNAL_API_KEY}

# model-info
@app.get("/model-info")
async def get_model_info(authorized: str = Depends(verify)):
    return {
        "model_name": "multilingual-e5-small",
        "vector_dim": embedder.dim
    }

# 2vec
@app.post("/vectorize")
async def vectorize(data: VectorRequest):
    # Запрос
    if data.type == "query":
        vector = embedder.get_embedding(data.text, data.type)
        return {"vector": vector, "dim": embedder.dim}
    
    # Документ
    else:
        chunks = embedder.split_text(data.text)
        payload = []
        
        for chunk in chunks:
            vector = embedder.get_embedding(chunk, "passage")
            payload.append({"content": chunk, "vector": vector})

        return {"type": "passage", "chunks": payload}