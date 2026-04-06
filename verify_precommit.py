import subprocess
import sys

def run_command(command):
    print(f"Running: {command}")
    result = subprocess.run(command, shell=True, capture_output=True, text=True)
    if result.returncode != 0:
        print(f"Error running {command}:\n{result.stderr}")
        return False
    print("Success")
    return True

if not run_command("npm run build"):
    sys.exit(1)

if not run_command("npm run lint:spell"):
    sys.exit(1)

print("Pre-commit checks passed!")
