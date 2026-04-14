from fastapi import APIRouter, status, HTTPException, UploadFile
from fastapi.params import File
from pydantic import BaseModel
from src.db_api import (
    User,
    get_all_users as db_get_all_users,
    add_user as db_add_user,
    update_user as db_update_user,
    check_auth as db_check_auth,
    UserAlreadyExistsError,
    UserError,
    compare_request,
    upload_file as db_upload_file
)

router = APIRouter(prefix="/front", tags=["Front Interaction"])

class SearchRequest(BaseModel):
    request: str

class FileUploadRequest(BaseModel):
    url: str
    filename: str


@router.post("/register_user")
def register_user(username: str, password: str):
    if not username or not username.strip():
        raise ValueError("Username cannot be empty")

    if not password or not password.strip():
        raise ValueError("Password cannot be empty")

    try:
        db_add_user(username, password)
        return {"status": "User registered", "username": username}

    except UserAlreadyExistsError as e:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"User '{e.user}' already exists"
        )

    except UserError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid user data: {str(e)}"
        )

    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )


@router.put("/update_user")
def update_user(
        username: str,
        new_username: str | None = None,
        new_password: str | None = None,
        new_role: str | None = None):
    if (new_username is None) and (new_password is None) and (new_role is None):
        return

    try:
        db_update_user(username, new_username, new_password, new_role)
    except UserAlreadyExistsError as e:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"User '{e.user}' already exists"
        )

    except UserError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid user data: {str(e)}"
        )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )

@router.get("/check_auth")
def check_auth(username: str, password: str):
    user = db_check_auth(username, password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid user data"
        )
    return user


@router.get("/get_all_users")
def get_all_users():
    users: list[User] = db_get_all_users()

    return {
        user.id: {
            "username": user.username,
            "role": user.role
        }
        for user in users
    }


@router.post("/search_request")
async def search_request(request: SearchRequest):
    from src.model_api import request_to_vec
    request_vec = await request_to_vec(request.request)
    return compare_request(request_vec)

@router.post("/upload_file")
async def upload_file(file: UploadFile = File(...)):
    try:
        file_content = await file.read()
        db_upload_file(file.filename, file_content)

    except Exception as e:
        pass