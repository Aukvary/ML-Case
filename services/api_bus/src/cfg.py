import os

ai_url = os.getenv("AI_URL", "http://localhost:5002")
db_url = os.getenv("DATABASE_URL", "postgresql://user:password@localhost:5432/knowledge_base")
front_url = os.getenv("FRONT_URL", "http://localhost:6000")
parser_url = os.getenv("PARSER_URL", "http://localhost:5001")