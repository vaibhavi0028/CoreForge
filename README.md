<div align="center">

<h1>CoreForge: Where CPU Meets Intelligence</h1>

<p>
CoreForge is a high-performance CPU-optimized ML inference benchmarking engine designed to measure, compare, and accelerate deep learning models without requiring a GPU.  
By combining ONNX Runtime, INT8 quantization, and thread affinity tuning, CoreForge delivers measurable latency improvements on commodity hardware.
</p>

<!-- <h4>
<a href="https://your-frontend-url.vercel.app">Live Demo</a>
<span> · </span>
<a href="https://github.com/yourusername/CoreForge">Repository</a>
<span> · </span>
<a href="https://your-presentation-link.com">Presentation</a>
</h4> -->

<br>

</div>

---

## 🚀 Overview

CoreForge is built for developers, researchers, and performance engineers who want to:

- Benchmark ML models on CPU
- Compare FP32 vs INT8 quantized performance
- Analyze deep CPU and memory metrics
- Track benchmark history securely per user

It transforms raw performance data into interactive visual insights — all without GPU dependency.

---

## 🎯 Key Features

### ⚡ CPU-Optimized Inference
Run models using ONNX Runtime with CPUExecutionProvider for deterministic performance.

### 📉 FP32 vs INT8 Comparison
Measure real-world improvements using post-training quantization.

### 🧠 Deep Profiling
Capture:
- Average & P95 Latency
- CPU Usage (Avg & Peak)
- Per-Core Utilization
- Memory Usage (RSS & VMS)
- Physical & Logical Core Data

### 📊 Interactive Dashboard
- Real-time bar charts
- Baseline vs Optimized comparison
- Per-run modal deep analysis
- Benchmark history per user

### 🔐 Secure User-Based Storage
- JWT-based authentication
- MongoDB-backed benchmark history
- Anonymous benchmarking supported

---

## 🧩 Supported Models

CoreForge currently supports benchmarking:

- MobileNet
- ResNet18
- EfficientNetB0
- MiniBERT
- DistilBERT
- Wav2Vec2-Tiny

Easily extendable via model configuration.

---

## 🛠 Tech Stack

### Backend
- FastAPI
- ONNX Runtime
- PyTorch
- Pymongo
- Python-JOSE (JWT Auth)

### Frontend
- Next.js 14 (App Router)
- TypeScript
- Recharts
- TailwindCSS
- Framer Motion

### Database
- MongoDB Atlas

---

## 🏗 Architecture

Frontend (Vercel)
        ↓
Backend API (Render / Cloud)
        ↓
MongoDB Atlas

Each benchmark run:
- Executes model inference
- Collects CPU & memory metrics
- Stores results per user
- Provides real-time visual analytics

---

## ⚙ Installation (Local Setup)

### 1️⃣ Clone Repository

```bash
git clone https://github.com/yourusername/CoreForge
cd CoreForge
```

---

### 2️⃣ Backend Setup

```bash
cd server
python -m venv venv
venv\Scripts\activate   # Windows
pip install -r requirements.txt
```

Create `.env`:

```
MONGO_URI=your_mongodb_uri
SECRET_KEY=your_secret
ALGORITHM=HS256
```

Run:

```bash
uvicorn server:app --reload
```

---

### 3️⃣ Frontend Setup

```bash
cd client
npm install
```

Create `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Run:

```bash
npm run dev
```

---

## 🧠 How It Works

### 1️⃣ Model Execution
- Loads ONNX model
- Runs baseline (FP32)
- Runs optimized (INT8)

### 2️⃣ Performance Collection
Captures:
- Avg Latency
- P95 Latency
- CPU usage (process & system)
- Memory consumption
- Per-core stats

### 3️⃣ Result Storage
- Saved to MongoDB
- Linked to authenticated user
- Anonymous runs supported

### 4️⃣ Visualization
Frontend:
- Side-by-side latency comparison
- Speedup calculation
- Modal-based detailed breakdown
- Historical performance logs

---

## 📈 Example Output

| Metric | Baseline (FP32) | Optimized (INT8) |
|--------|----------------|------------------|
| Avg Latency | 25.00 ms | 10.03 ms |
| P95 Latency | 67.13 ms | 12.08 ms |
| CPU Avg | 82.10% | 79.19% |
| Memory Avg | 107 MB | 116 MB |
| Speedup | 2.49x Faster | |

---

## 🌍 Deployment

### Backend
- Render / Railway
- Environment variables configured
- Connected to MongoDB Atlas

### Frontend
- Vercel
- API base URL set via environment variables

---

## 🔮 Future Roadmap

- Multi-node distributed benchmarking
- Dockerized benchmark workers
- GPU benchmarking comparison mode
- Auto-scaling inference service
- Performance anomaly detection
- Benchmark export (CSV / PDF)

---

## 🤝 Author

**Vaibhavi Pandey**  
Integrated M.Tech CSE  
Full-Stack + Systems + AI Engineering  

Building performance-aware intelligent systems that bridge ML and infrastructure.

---

## ⭐ Why CoreForge?

Most ML projects focus on accuracy.  
CoreForge focuses on performance engineering.

Because in production — speed matters.

---

© 2026 CoreForge — High-Performance CPU ML Benchmarking
