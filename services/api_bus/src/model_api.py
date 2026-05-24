import httpx
import os
from fastapi import APIRouter, HTTPException
import asyncio
from src.cfg import ai_url

router = APIRouter(prefix="/model", tags=["AI Model Interaction"])
headers = {"App-Secret": os.getenv("INTERNAL_API_KEY")}


class ModelInfo:
    init: bool = False
    dim: int = 384


@router.get("/status")
async def model_status():
    if ModelInfo.init:
        return {"status": "has initialized", "dim": ModelInfo.dim}

    return {"status": "hasn't initialize", "dim": "NA"}


async def init_model_info():
    async with httpx.AsyncClient() as client:
        while True:
            try:
                response = await client.get(
                    f"{ai_url}/model-info", headers=headers, timeout=5.0
                )
                response.raise_for_status()

                model_info = response.json()

                ModelInfo.init = True
                ModelInfo.dim = model_info["vector_dim"]
                break
            except Exception as e:
                print(f"[ERROR]\t Connection to AI-service failed: {e}")
                await asyncio.sleep(2)


async def file_to_vec(text: str) -> list[float]:
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                f"{ai_url}/vectorize",
                json={"type": "passage", "text": text},
                headers=headers,
                timeout=30.0
            )
            
            if response.status_code == 503:
                raise HTTPException(status_code=503, detail="ИИ-модель еще загружается")
            
            response.raise_for_status()
            data = response.json()

            return data["vector"]


        except Exception as e:
            print(f"file_to_vec failed: {e}")
            raise HTTPException(status_code=500, detail="Ошибка векторизации файла")


async def request_to_vec(text) -> list[float]:
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                f"{ai_url}/vectorize",
                json={"type": "query", "text": text},
                headers=headers,
                timeout=20.0
            )
            
            if response.status_code == 503:
                raise HTTPException(status_code=503, detail="ИИ-модель еще загружается")
            
            response.raise_for_status()
            return response.json()["vector"]
        except Exception as e:
            print(f"[ERROR] request_to_vec failed: {e}")
            raise HTTPException(status_code=500, detail="Ошибка векторизации запроса")
