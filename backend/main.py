import os
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from utils.pdf import extract_text_from_pdf
from utils.gemini import generate_study_material, StudySuite

app = FastAPI(title="AI Study Buddy API")

# Configure CORS so React app can communicate with the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For local development; restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class StudyTextRequest(BaseModel):
    text: str = Field(..., min_length=50, description="The study notes or text content to analyze. Must be at least 50 characters.")

@app.get("/")
def home():
    return {
        "project": "AI Study Buddy API",
        "status": "Running",
        "documentation": "/docs",
        "health": "/api/health"
    }

@app.get("/api/health")
def health_check():
    """
    Check if the API and configuration are set up properly.
    """
    api_key_set = bool(os.getenv("GEMINI_API_KEY"))
    return {
        "status": "healthy",
        "gemini_api_key_configured": api_key_set
    }

@app.post("/api/study-text", response_model=StudySuite)
def process_study_text(request: StudyTextRequest):
    """
    Accepts text input, calls Gemini, and returns a full StudySuite.
    """
    if not os.getenv("GEMINI_API_KEY"):
        raise HTTPException(
            status_code=500,
            detail="GEMINI_API_KEY is not set. Please create a '.env' file in the 'backend' folder and set GEMINI_API_KEY."
        )
    
    try:
        result = generate_study_material(request.text)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/study-pdf", response_model=StudySuite)
async def process_study_pdf(file: UploadFile = File(...)):
    """
    Accepts a PDF file upload, extracts text, calls Gemini, and returns a full StudySuite.
    """
    if not os.getenv("GEMINI_API_KEY"):
        raise HTTPException(
            status_code=500,
            detail="GEMINI_API_KEY is not set. Please create a '.env' file in the 'backend' folder and set GEMINI_API_KEY."
        )

    if file.content_type != "application/pdf" and not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")

    try:
        # Read file contents in memory
        contents = await file.read()
        
        # Extract text from PDF
        text = extract_text_from_pdf(contents)
        
        if not text or len(text.strip()) < 50:
            raise HTTPException(
                status_code=400,
                detail="Extracted text is too short or empty. Please ensure the PDF has readable text (not scanned images without OCR)."
            )
            
        # Generate study materials
        result = generate_study_material(text)
        return result
        
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
