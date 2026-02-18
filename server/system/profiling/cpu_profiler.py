import os
import time
import psutil
import threading
import numpy as np


class CPUProfiler:
    def __init__(self, interval=0.05):
        self.interval = interval
        self.process = psutil.Process(os.getpid())

        self._running = False
        self._thread = None

        self.system_cpu = []
        self.per_core_cpu = []
        self.process_cpu = []
        self.memory_rss = []
        self.memory_vms = []

        self.logical_cores = psutil.cpu_count(logical=True)
        self.physical_cores = psutil.cpu_count(logical=False)

        psutil.cpu_percent(None)
        self.process.cpu_percent(None)

    def _collect(self):
        while self._running:
            self.system_cpu.append(psutil.cpu_percent(percpu=False))
            self.per_core_cpu.append(psutil.cpu_percent(percpu=True))
            self.process_cpu.append(self.process.cpu_percent(interval=None))

            mem = self.process.memory_info()
            self.memory_rss.append(mem.rss / (1024 * 1024))
            self.memory_vms.append(mem.vms / (1024 * 1024))

            time.sleep(self.interval)

    def start(self):
        self._running = True
        self._thread = threading.Thread(target=self._collect, daemon=True)
        self._thread.start()

    def stop(self):
        self._running = False
        if self._thread:
            self._thread.join(timeout=1)

    def summary(self):
        system_cpu = np.array(self.system_cpu)
        process_cpu = np.array(self.process_cpu)
        rss = np.array(self.memory_rss)
        vms = np.array(self.memory_vms)
        per_core = np.array(self.per_core_cpu) if self.per_core_cpu else np.zeros((1, 1))

        return {
            "cpu_usage_percent": {
                "system_avg": float(system_cpu.mean()) if len(system_cpu) else 0.0,
                "system_peak": float(system_cpu.max()) if len(system_cpu) else 0.0,
                "process_avg": float(process_cpu.mean()) if len(process_cpu) else 0.0,
                "process_peak": float(process_cpu.max()) if len(process_cpu) else 0.0
            },
            "memory_info": {
                "rss_avg_mb": float(rss.mean()) if len(rss) else 0.0,
                "rss_peak_mb": float(rss.max()) if len(rss) else 0.0,
                "vms_avg_mb": float(vms.mean()) if len(vms) else 0.0,
                "vms_peak_mb": float(vms.max()) if len(vms) else 0.0
            },
            "cpu_count": {
                "physical": self.physical_cores,
                "logical": self.logical_cores
            },
            "per_core_avg": per_core.mean(axis=0).tolist()
        }
