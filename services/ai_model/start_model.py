import os
import subprocess
from sentence_transformers import SentenceTransformer

MODEL_PATH = "/app/models/e5-small"
MODEL_NAME = "intfloat/multilingual-e5-small"

def prepare_model():
    weights_exist = os.path.exists(os.path.join(MODEL_PATH, "model.safetensors"))
    
    if not weights_exist:
        print("Модель не найдена. Начинаю загрузку...")

        os.environ['TRANSFORMERS_OFFLINE'] = '0'
        os.environ['HF_HUB_OFFLINE'] = '0'
        
        model = SentenceTransformer(MODEL_NAME)
        model.save(MODEL_PATH)
        print(f"Модель сохранена в {MODEL_PATH}")
    else:
        print("Модель найдена. Перехожу в оффлайн-режим.")
        
        os.environ['TRANSFORMERS_OFFLINE'] = '1'
        os.environ['HF_HUB_OFFLINE'] = '1'

if __name__ == "__main__":
    prepare_model()
    
    print("Запуск основного сервера...")

    subprocess.run(["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "5002"])