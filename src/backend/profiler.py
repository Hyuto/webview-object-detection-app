import psutil


class Profiler:
    cpu = []
    memory = []

    def __init__(self, pid):
        self.pid = pid

    def get_cpu_memory_usage(self):
        currentProcess = psutil.Process(self.pid)
        cpu_usage = currentProcess.cpu_percent(interval=1) / psutil.cpu_count()
        memory_usage = currentProcess.memory_percent()

        self.cpu.append(cpu_usage)
        self.memory.append(memory_usage)

        return {"cpu": cpu_usage, "memory": memory_usage}
