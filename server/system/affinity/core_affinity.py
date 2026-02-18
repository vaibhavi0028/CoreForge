import psutil
import os

def set_core_affinity(core_index=0):
    try:
        p = psutil.Process(os.getpid())
        available_cores = list(range(psutil.cpu_count()))
        
        if core_index in available_cores:
            p.cpu_affinity([core_index])
            return True
        else:
            return False
    except Exception:
        return False

def get_current_affinity():
    p = psutil.Process(os.getpid())
    return p.cpu_affinity()