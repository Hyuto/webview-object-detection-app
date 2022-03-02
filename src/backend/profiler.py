import os
import json
import psutil


class Profiler:
    pid = os.getpid()
    cpu = []
    memory = []

    def get_cpu_memory_usage(self):
        currentProcess = psutil.Process(self.pid)

        while True:
            cpu_usage = currentProcess.cpu_percent(interval=1) / psutil.cpu_count()
            memory_usage = currentProcess.memory_percent()

            self.cpu.append(cpu_usage)
            self.memory.append(memory_usage)

            yield json.dumps({"cpu": cpu_usage, "memory": memory_usage})
