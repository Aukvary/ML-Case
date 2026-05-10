from fastapi import FastAPI
from contextlib import asynccontextmanager
from src.model_api import router as model_router, init_model_info, ModelInfo
from src.front_api import router as front_router
from src.db_api import router as db_router, init_db
<<<<<<< HEAD
from fastapi.middleware.cors import CORSMiddleware # дипсик сказал чтобы файлы отправлялись
=======
>>>>>>> origin/master


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_model_info()
    init_db(ModelInfo.dim)
    yield


app = FastAPI(lifespan=lifespan)
<<<<<<< HEAD


# Он сказал еще это добавить
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Разрешить все источники (для разработки)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Вот тут конец правок дикпика

=======
>>>>>>> origin/master
app.include_router(model_router)
app.include_router(front_router)
app.include_router(db_router)

@app.get("/")
def read_root():
    return {"message": "Bus API is active"}
