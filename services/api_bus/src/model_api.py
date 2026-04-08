import httpx
import psycopg
import os
from fastapi import APIRouter, HTTPException
from src.cfg import db_url, ai_url

router = APIRouter(prefix="/model", tags=["AI Model Interaction"])
headers = {"App-Secret": os.getenv("INTERNAL_API_KEY")}

class VectorInfo:
    dim: int = 768

async def get_vector_dim():
    async with httpx.AsyncClient() as client:
        try:
            print(f'\t\t\t{ai_url}')
            response = await client.get(f"{ai_url}/model-info", headers=headers, timeout=20.0)
            response.raise_for_status()
            VectorInfo.dim = response.json()["vector_dim"]
            return VectorInfo.dim
        except Exception as e:
            print(f"[ERROR]\t Connection to AI-service failed: {e}")
            return VectorInfo.dim

def init_db(dim: int):
    with psycopg.connect(db_url) as conn:
        with conn.cursor() as cur:
            cur.execute("CREATE EXTENSION IF NOT EXISTS vector;")
            cur.execute(f"CREATE TABLE IF NOT EXISTS documents (id SERIAL PRIMARY KEY, content TEXT, embedding vector({dim}));")
            conn.commit()
            print(f"--- DB INITIALIZED WITH DIM: {dim} ---")

@router.get("/status")
async def model_status():
    return {"status": "ready"}

async def file_to_vec(text) -> tuple[int]:
    pass

async def request_to_vec(text) -> tuple[int]:
    pass