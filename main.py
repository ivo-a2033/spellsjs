from pathlib import Path
from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

app = FastAPI()

BASE_DIR = Path(__file__).resolve().parent

@app.get("/")
async def read_index():
    return FileResponse(BASE_DIR / "static" / "index.html")

# One mount for everything static
app.mount("/static", StaticFiles(directory=BASE_DIR / "static"), name="static")