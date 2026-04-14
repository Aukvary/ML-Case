import aiofiles
import psycopg
from datetime import datetime
from fastapi import APIRouter
from psycopg import sql
from pydantic import BaseModel
from src.cfg import db_url
from passlib.context import CryptContext

router = APIRouter(prefix="/db", tags=["Data Base Interaction"])
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
files_path = '/app/files'


class User(BaseModel):
    id: int
    username: str
    role: str


class SearchResponse(BaseModel):
    title: str
    path: str


class UserError(Exception):
    def __init__(self, user: str = None, message: str = None):
        self.user = user
        self.message = message


class UserAlreadyExistsError(UserError):
    def __init__(self, user: str = None):
        self.user = user
        super().__init__(user, "Пользователь с таким именем уже зарегистрирован")


class LocalFile:
    def __init__(self, title, path, embedding=None):
        self.title = title
        self.path = path
        self.embedding = embedding


def init_db(dim: int):
    with psycopg.connect(db_url) as conn:
        with conn.cursor() as cur:
            cur.execute("CREATE EXTENSION IF NOT EXISTS vector;")
            cur.execute(f"""
                    CREATE TABLE IF NOT EXISTS documents (
                        title TEXT PRIMARY KEY, 
                        path TEXT,
                        content_type TEXT,
                        size INTEGER,
                        embedding vector({dim})
                    );
                """)

            cur.execute("""
                    CREATE TABLE IF NOT EXISTS users (
                    id SERIAL PRIMARY KEY,
                    username VARCHAR(50) UNIQUE NOT NULL,
                    password_hash VARCHAR(255) NOT NULL,
                    role VARCHAR(20) DEFAULT 'user'
                    );
                """)
            conn.commit()


def compare_request(word_vec: list[float]):
    with psycopg.connect(db_url) as conn:
        with conn.cursor() as cur:
            query = """
                SELECT 
                    title, 
                    path
                FROM documents
                WHERE embedding <=> %s::vector < 1
                ORDER BY embedding <=> %s::vector ASC
            """

            cur.execute(query, (word_vec, word_vec))
            results = cur.fetchall()

            return [SearchResponse(**row) for row in results]


def add_user(username: str, password: str):
    try:
        with psycopg.connect(db_url) as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    INSERT INTO users (username, password_hash)
                    VALUES (%s, %s)
                """,
                    (username, password),
                )
                conn.commit()
    except psycopg.errors.UniqueViolation:
        raise UserAlreadyExistsError(username)
    except Exception as e:
        raise UserError(username, str(e))


def update_user(
    username: str,
    new_username: str | None = None,
    new_password: str | None = None,
    new_role: str | None = None,
):
    updates = []
    params = []

    if new_username is not None:
        updates.append("username = %s")
        params.append(new_username)

    if new_password is not None:
        password_hash = pwd_context.hash(new_password)
        updates.append("password_hash = %s")
        params.append(password_hash)

    if new_role is not None:
        updates.append("role = %s")
        params.append(new_role)

    params.append(username)

    query = sql.SQL("""
        UPDATE users 
        SET {updates}
        WHERE username = %s
    """).format(updates=sql.SQL(", ").join(map(sql.SQL, updates)))

    try:
        with psycopg.connect(db_url) as conn:
            with conn.cursor() as cur:
                cur.execute(query.as_string(conn), params)
                conn.commit()
    except psycopg.errors.UniqueViolation:
        raise ValueError(f"Username '{new_username}' already exists")
    except psycopg.Error as e:
        raise RuntimeError(f"Database error: {e}")


def check_auth(username: str, password: str) -> User | None:
    with psycopg.connect(db_url) as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT id, username, password_hash, role
                FROM users 
                WHERE username = %s
            """,
                (username,),
            )

            user = cur.fetchone()
            if not user:
                return None

            user_id, db_username, password_hash, role = user

            if not pwd_context.verify(password, password_hash):
                return None

            return User(id=user_id, username=db_username, role=role)


def get_all_users() -> list[User]:
    with psycopg.connect(db_url) as conn:
        with conn.cursor() as cur:
            cur.execute("""
                    SELECT id, username, role
                    FROM users
                    ORDER BY username
                """)

            users = cur.fetchall()

            return [User(id=u[0], username=u[1], role=u[2]) for u in users]

def upload_file(title: str, content):
    with aiofiles.open(files_path, 'wb') as out_file:
        out_file.write(content)
