import httpx
from src.cfg import parser_url

async def parse_file(file_name: str, content: bytes) -> str:
    async with httpx.AsyncClient() as client:
        file = {
            'file': (file_name, content)
        }

        response = await client.post(f'{parser_url}/parse', files=file)

        return response.json()['text']