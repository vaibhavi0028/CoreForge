import os
import json
from typing import List, Optional
from fastapi import FastAPI, Depends, HTTPException
from pydantic import BaseModel
from benchmark.benchmark import BenchmarkEngine
from fastapi.middleware.cors import CORSMiddleware
from database import benchmarks_collection
from auth import get_current_user, get_optional_user
from routes.auth_routes import router as auth_router

BASE_DIR = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "../")
)
RESULTS_DIR = os.path.join(BASE_DIR, "results", "metrics")
LOG_DIR = os.path.join(BASE_DIR, "results", "logs")

app = FastAPI(
    title="CoreForge API",
    description="Zen-Optimized CPU Inference Benchmarking Engine",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)

class BenchmarkRequest(BaseModel):
    models: Optional[List[str]] = ["all"]

@app.get("/")
def home():
    return {"status": "running", "service": "CoreForge API"}

@app.post("/run-benchmark", summary="Run benchmark")
def run_benchmark(req: BenchmarkRequest, user_id: Optional[str] = Depends(get_optional_user)):
    engine = BenchmarkEngine()

    if req.models and "all" not in req.models:
        engine.model_configs = {
            k: v for k, v in engine.model_configs.items()
            if k in req.models
        }

    path = engine.run()

    with open(path, "r") as f:
        data = json.load(f)
    
    log_content = ""
    log_path = os.path.join(LOG_DIR, "benchmark.log")
    if os.path.exists(log_path):
        with open(log_path, "r") as lf:
            log_content = lf.read()

    benchmarks_collection.insert_one({
        "user_id": user_id if user_id else "anonymous",
        "timestamp": data.get("timestamp"),
        "benchmarks": data.get("benchmarks"),
        "logs": log_content
    })

    return {
        "status": "completed",
        "models_run": list(engine.model_configs.keys()),
        "result_path": path,
        "data": data
    }

@app.get("/metrics", summary="Get latest benchmark metrics")
def get_latest_metrics(user_id: Optional[str] = Depends(get_optional_user)):
    query_user = user_id if user_id else "anonymous"

    record = benchmarks_collection.find_one(
        {"user_id": query_user},
        sort=[("timestamp", -1)]
    )

    if not record:
        return {"status": "no_results"}

    return {
        "status": "ok",
        "data": {
            "timestamp": record["timestamp"],
            "benchmarks": record["benchmarks"]
        }
    }

@app.get("/history")
def get_history(user_id: Optional[str] = Depends(get_optional_user)):
    query_user = user_id if user_id else "anonymous"

    records = list(benchmarks_collection.find({"user_id": query_user}).sort("timestamp", -1))

    for record in records:
        record["_id"] = str(record["_id"])

    return {
        "status": "ok",
        "count": len(records),
        "history": records
    }

@app.get("/metrics")
def get_latest_metrics(user_id: Optional[str] = Depends(get_optional_user)):
    query_user = user_id if user_id else "anonymous"

    record = benchmarks_collection.find_one(
        {"user_id": query_user},
        sort=[("timestamp", -1)]
    )

    if not record:
        return {"status": "no_results"}

    record["_id"] = str(record["_id"])
    
    return {
        "status": "ok",
        "data": record 
    }


@app.get("/logs", summary="Get benchmark logs")
def get_logs(user_id: Optional[str] = Depends(get_optional_user)):
    query_user = user_id if user_id else "anonymous"

    record = benchmarks_collection.find_one(
        {"user_id": query_user},
        sort=[("timestamp", -1)]
    )

    if not record:
        return {"status": "no_logs"}

    return {
        "status": "ok",
        "logs": record.get("logs", "")
    }
