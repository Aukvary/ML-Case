import typing

import httpx
import psycopg
import os
from fastapi import APIRouter, HTTPException
from src.cfg import db_url, ai_url

router = APIRouter(prefix="/model", tags=["AI Model Interaction"])
headers = {"App-Secret": os.getenv("INTERNAL_API_KEY")}

class ModelInfo:
    dim: int = 384


model_info: typing.Any

@router.get("/status")
async def model_status():
    if ModelInfo:
        return {
            "status": "hasn't initialize",
            "dim": "NA"
        }

    return {
            "status": "has initialized",
            "dim": ModelInfo.dim
        }

async def init_model_info():
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(
                f"{ai_url}/model-info", headers=headers, timeout=20.0
            )
            response.raise_for_status()

            model_info =  response.json()
        except Exception as e:
            print(f"[ERROR]\t Connection to AI-service failed: {e}")



async def file_to_vec(text) -> tuple[int]:
    pass


async def request_to_vec(text) -> tuple[int]:
    pass
