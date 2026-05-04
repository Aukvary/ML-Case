from fastapi import FastAPI, UploadFile, File, HTTPException
import fitz

app = FastAPI()


@app.post("/parse")
async def parse_pdf(file: UploadFile = File(...)):
    filename = file.filename or ""
    if not filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF supported")

    try:
        content = await file.read()
        doc = fitz.open(stream=content, filetype="pdf")

        text = ""
        for page in doc:
            text += page.get_text()

        doc.close()

        return {
            "text": text.strip(),
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))