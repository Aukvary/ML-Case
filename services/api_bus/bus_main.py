from fastapi import FastAPI
from contextlib import asynccontextmanager
from src.model_api import router as model_router, init_model_info, ModelInfo
from src.front_api import router as front_router
from src.db_api import router as db_router, init_db
from fastapi.middleware.cors import CORSMiddleware


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_model_info()
    init_db(ModelInfo.dim)
    yield


app = FastAPI(lifespan=lifespan)
app.include_router(model_router)
app.include_router(front_router)
app.include_router(db_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Bus API is active"}
