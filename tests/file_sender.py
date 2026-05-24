#!/usr/bin/python3

import os
import requests


def upload_generated_files(directory="./pdf", url="http://localhost:8000/front/upload_file"):
    if not os.path.exists(directory):
        print(f"Ошибка: Директория {directory} не найдена.")
        return

    # Получаем список всех pdf файлов в папке
    files_to_upload = [f for f in os.listdir(directory) if f.endswith('.pdf')]

    if not files_to_upload:
        print("Нет файлов для отправки.")
        return

    print(f"Найдено файлов для отправки: {len(files_to_upload)}")

    for filename in files_to_upload:
        file_path = os.path.join(directory, filename)

        # Открываем файл в бинарном режиме
        with open(file_path, 'rb') as f:
            # Передаем файл в словаре 'files'
            # Ключ 'file' должен совпадать с тем, что ожидает твой FastAPI (например, UploadFile)
            files = {'file': (filename, f, 'application/pdf')}

            try:
                response = requests.post(url, files=files)

                if response.status_code == 200:
                    print(f" Успешно отправлен: {filename}")
                else:
                    print(f" Ошибка при отправке {filename}: {response.status_code} - {response.text}")
            except requests.exceptions.ConnectionError:
                print(" Ошибка: Не удалось подключиться к серверу. Убедись, что FastAPI запущен.")
                break


if __name__ == "__main__":
    upload_generated_files()