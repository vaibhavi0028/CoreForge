from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from database import users_collection
from auth import create_access_token
import bcrypt

router = APIRouter()

class SignupRequest(BaseModel):
    name: str
    email: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

@router.post("/signup")
def signup(req: SignupRequest):
    if users_collection.find_one({"email": req.email}):
        raise HTTPException(status_code=400, detail="Email already exists")

    hashed = bcrypt.hashpw(req.password.encode(), bcrypt.gensalt())

    user = {
        "name": req.name,
        "email": req.email,
        "password": hashed
    }

    result = users_collection.insert_one(user)

    token = create_access_token({"sub": str(result.inserted_id)})

    return {"access_token": token}


@router.post("/login")
def login(req: LoginRequest):
    user = users_collection.find_one({"email": req.email})

    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not bcrypt.checkpw(req.password.encode(), user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"sub": str(user["_id"])})

    return {"access_token": token}
