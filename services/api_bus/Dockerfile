FROM python:3.12-slim

RUN sed -i 's/deb.debian.org/mirror.yandex.ru/g' /etc/apt/sources.list.d/debian.sources

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

CMD ["uvicorn", "bus_main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]