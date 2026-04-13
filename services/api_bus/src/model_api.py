import typing
import httpx
import os
from fastapi import APIRouter, HTTPException
from src.cfg import db_url, ai_url

router = APIRouter(prefix="/model", tags=["AI Model Interaction"])
headers = {"App-Secret": os.getenv("INTERNAL_API_KEY")}

class ModelInfo:
    init: bool = False
    dim: int = 384

@router.get("/status")
async def model_status():
    if ModelInfo.init:
        return {
            "status": "has initialized",
            "dim": ModelInfo.dim
        }

    return {
        "status": "hasn't initialize",
        "dim": "NA"
    }



async def init_model_info():
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(
                f"{ai_url}/model-info", headers=headers, timeout=20.0
            )
            response.raise_for_status()

            model_info = response.json()

            ModelInfo.init = True
            ModelInfo.dim = model_info["vector_dim"]
        except Exception as e:
            print(f"[ERROR]\t Connection to AI-service failed: {e}")



async def file_to_vec(text) -> list[float]:
    pass


async def request_to_vec(text) -> list[float]:
    pass
