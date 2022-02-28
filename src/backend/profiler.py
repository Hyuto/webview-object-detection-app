import os
import threading
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

    def run(self):
        cpu_thread = threading.Thread(target=self.get_cpu_memory_usage)
        cpu_thread.daemon = True
        cpu_thread.start()
