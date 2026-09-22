import uvicorn
import os
import sys

# Ensure project root is on PYTHONPATH
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

if __name__ == "__main__":
    print("=" * 70)
    print("Starting Clinical Atlas Medical Backend (FastAPI)")
    print("Documentation available at: http://127.0.0.1:8000/api/v1/docs")
    print("=" * 70)
    uvicorn.run("backend.app.main:app", host="127.0.0.1", port=8000, reload=True)
