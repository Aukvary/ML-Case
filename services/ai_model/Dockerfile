FROM python:3.12-slim
WORKDIR /app



RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    gcc \
    build-essential \
    libpq-dev && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

RUN pip install --no-cache-dir \
    --default-timeout=3000 \
    --retries=10 \
    --timeout=3000 \
    -r requirements.txt

COPY . .
CMD ["python", "start_model.py"]