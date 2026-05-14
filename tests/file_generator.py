import subprocess
import os
import uuid
import re
from gigachat import GigaChat

os.makedirs("typst", exist_ok=True)
os.makedirs("pdf", exist_ok=True)


def clean_markdown(text):
    text = re.sub(r'#+', '', text)
    text = text.replace('*', '').replace('`', '')
    return text.strip()


def generate_typst_document(filename, content_data):
    title = clean_markdown(content_data['title'])
    body = clean_markdown(content_data['body'])

    typst_template = f"""#set page(margin: (x: 1.5cm, y: 1.5cm))
#set text(size: 12pt, font: "Linux Libertine")

= {title}

#v(1em)

{body}

#v(2em)
#line(length: 100%, stroke: 0.5pt + gray)
#text(size: 8pt, fill: gray)[Сгенерировано автоматически]"""

    typ_file = f"typst/{filename}.typ"
    pdf_file = f"pdf/{filename}.pdf"

    with open(typ_file, "w", encoding="utf-8") as f:
        f.write(typst_template)

    try:
        subprocess.run(
            ["typst", "compile", typ_file, pdf_file],
            check=True,
            capture_output=True,
            text=True
        )
        return pdf_file
    except subprocess.CalledProcessError as e:
        print(f"--- Ошибка Typst в файле {filename} ---")
        print(e.stderr)
        return None


def run_generation_pipeline(user_request, count=5):
    with GigaChat(
            credentials="MDE5ZTIwYTAtZjg4OC03Y2Q3LTg1MDEtOGY5ZTEyYTcyNzljOjI5ZTk4NzE4LWEyMjAtNDIwOS1iYzNkLWNhYWUyZTNmYzMzZQ==",
            scope="GIGACHAT_API_PERS",
            model="GigaChat",
            ca_bundle_file="./../russian_ca.crt"
    ) as giga:

        print(f"Запрос к GigaChat для темы: {user_request}...")

        topics_prompt = f"""Придумай список из {count} названий официальных документов для компании. 
        Нужны как минимум: 1 инструкция (например, отпуск), 1 регламент, 1 план, 1 расписание и 1 отчет.
        Пиши ТОЛЬКО список через точку с запятой или нумерованный список."""

        topics_res = giga.chat(topics_prompt)
        topics_text = topics_res.choices[0].message.content

        # ДЕБАГ: посмотрим, что реально прислал чат
        print("--- ОТВЕТ GIGACHAT (ТЕМЫ) ---")
        print(topics_text)
        print("-----------------------------")

        # Более агрессивный поиск тем: берем любые строки, где есть текст
        topics = re.findall(r'(?:^|\n)\d+[\.\)]\s*(.+)', topics_text)
        if not topics:
            # Если нумерация не нашлась, пробуем разбить по строкам
            topics = [line.strip() for line in topics_text.split('\n') if len(line.strip()) > 5]

        if not topics:
            print("Ошибка: Не удалось извлечь список тем из ответа нейросети.")
            return

        # Берем только нужное количество
        topics = topics[:count]

        for i, topic in enumerate(topics):
            topic_clean = clean_markdown(topic)
            print(f"[{i + 1}/{len(topics)}] Генерация контента для: {topic_clean}...")

            content_prompt = f"Напиши содержание реалистичное содержание документа: '{topic_clean}'. Формат: НАЗВАНИЕ: [заголовок] СОДЕРЖАНИЕ: [текст]"
            content_res = giga.chat(content_prompt)
            ai_text = content_res.choices[0].message.content

            try:
                parts = re.split(r'СОДЕРЖАНИЕ:', ai_text, flags=re.IGNORECASE)
                title = parts[0].replace("НАЗВАНИЕ:", "").strip()
                body = parts[1].strip()
            except:
                title = topic_clean
                body = ai_text

            file_id = str(uuid.uuid4())[:8]
            generate_typst_document(f"{topic_clean}", {"title": title, "body": body})


if __name__ == "__main__":
    run_generation_pipeline("рекламное агентство полного цикла", count=30)