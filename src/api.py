import os
import shutil
import tempfile

from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from src.pipeline import SoundAwarenessPipeline


app = FastAPI(
    title="Sound Awareness API",
    version="1.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


pipeline = SoundAwarenessPipeline()


@app.get("/")
def root():
    return {
        "status": "Sound Awareness API is running"
    }


@app.post("/process")
async def process_audio(file: UploadFile = File(...)):

    with tempfile.NamedTemporaryFile(
            delete=False,
            suffix=".wav"
    ) as temp_file:

        shutil.copyfileobj(
            file.file,
            temp_file
        )

        temp_path = temp_file.name

    try:
        result = pipeline.process(temp_path)

        return result

    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)