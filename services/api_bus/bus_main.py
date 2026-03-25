from fastapi import FastAPI

app = FastAPI()
DB_URL = "postgresql://user:password@db:5432/knowledge_base"

@app.get("/")
def read_root():
    return {"service": "bus"}