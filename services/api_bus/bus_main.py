from fastapi import FastAPI
from contextlib import asynccontextmanager
from src.model_api import router as model_router, get_vector_dim, init_db, VectorInfo
from src.front_api import router as front_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    dim = await get_vector_dim()
    init_db(dim)
    yield


app = FastAPI(lifespan=lifespan)
app.include_router(model_router)
app.include_router(front_router)

@app.get("/")
def read_root():
    return {"message": "Bus API is active"}

@app.get("/dim/")
def get_dim():
    return {"message": f"{VectorInfo.dim}"}
