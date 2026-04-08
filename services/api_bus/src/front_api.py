import httpx
import psycopg
import os
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from src.cfg import front_url
from src.model_api import file_to_vec

router = APIRouter(prefix="/front", tags=["Front Interaction"])

class FileUploadRequest(BaseModel):
    url: str
    filename: str

@router.put("/upload_file")
async def upload_file(request: FileUploadRequest):
    pass