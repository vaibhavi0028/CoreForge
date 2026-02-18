import sys
import uvicorn
from benchmark.benchmark import BenchmarkEngine


def run_api():
    uvicorn.run(
        "api.server:app",
        host="127.0.0.1",
        port=8000,
        reload=True
    )

def run_benchmark():
    engine = BenchmarkEngine()
    path = engine.run()
    print(f"Benchmark completed. Results saved at {path}")

def print_help():
    print(
        """
CoreForge — Zen-Optimized CPU Inference Engine

Usage:
  python main.py api        Start FastAPI backend
  python main.py benchmark  Run benchmark once
  python main.py help       Show this message
        """
    )

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print_help()
        sys.exit(0)

    command = sys.argv[1].lower()

    if command == "api":
        run_api()
    elif command == "benchmark":
        run_benchmark()
    else:
        print_help()