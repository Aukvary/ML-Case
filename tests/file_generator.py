import subprocess
import os
from gigachat import GigaChat

GIGACHAT_CREDENTIALS = "YOUR_AUTH_DATA_BASE64"

def generate_typst_document(filename, content_data):
    typst_template = f"""
    #set page(margin: (x: 1.5cm, y: 1.5cm))
    #set text(size: 12pt, font: "Linux Libertine")

    = {content_data['title']}

    #v(1em)

    {content_data['body']}

    #lorem(20)
    """

    typ_file = f"{filename}.typ"
    pdf_file = f"{filename}.pdf"

    with open(typ_file, "w", encoding="utf-8") as f:
        f.write(typst_template)

    try:
        result = subprocess.run(
            ["typst", "compile", typ_file, pdf_file],
            check=True,
            capture_output=True,
            text=True
        )
        print(f"Успешно: {pdf_file} создан.")
    except subprocess.CalledProcessError as e:
        print(f"Ошибка компиляции: {e.stderr}")
    except FileNotFoundError:
        print("Ошибка: Команда 'typst' не найдена. Установите Typst CLI.")

data = {
    "title": "Результат семантического поиска",
    "body": "Этот документ был сгенерирован автоматически для тестирования системы."
}

generate_typst_document("test_result", data)

if __name__ == "__main__":
    with GigaChat(credentials=GIGACHAT_CREDENTIALS, verify_ssl_certs=False) as giga:
    prompt = f"Напиши название и краткое содержание (3-4 абзаца) для документа на тему: {request.topic}. Ответ дай в формате: НАЗВАНИЕ: [текст] СОДЕРЖАНИЕ: [текст]"
    response = giga.chat(prompt)
    ai_text = response.choices[0].message.content

    try:
        title = ai_text.split("СОДЕРЖАНИЕ:")[0].replace("НАЗВАНИЕ:", "").strip()
        body = ai_text.split("СОДЕРЖАНИЕ:")[1].strip()
    except Exception:
        title = f"Документ по теме {request.topic}"
        body = ai_text

    # 3. Генерируем уникальное имя файла
    file_id = str(uuid.uuid4())[:8]
    file_name = f"doc_{file_id}"

    # 4. Запускаем создание PDF (в бэкграунде, чтобы не заставлять curl ждать долго)
    background_tasks.add_task(compile_typst, file_name, title, body)
    generate_typst_document("test_result", data)