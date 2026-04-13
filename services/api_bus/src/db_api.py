import psycopg
from fastapi import APIRouter, HTTPException
from src.cfg import db_url, ai_url
from src.model_api import ModelInfo

router = APIRouter(prefix="/db", tags=["Data Base Interaction"])


def init_db():
    with psycopg.connect(db_url) as conn:
        with conn.cursor() as cur:
            cur.execute("CREATE EXTENSION IF NOT EXISTS vector;")
            cur.execute(f"""
                    CREATE TABLE IF NOT EXISTS documents (
                        title TEXT PRIMARY KEY, 
                        path TEXT, 
                        embedding vector({ModelInfo.dim})
                    );
                """
            )

            cur.execute("""
                    CREATE TABLE IF NOT EXISTS users (
                        login TEXT PRIMARY KEY NOT NULL,
                        password TEXT NOT NULL
                    );
                """
            )
            conn.commit()


def add_file():
    pass

def compare_request(word_vec: tuple[int]):
    pass