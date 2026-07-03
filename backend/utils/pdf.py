import io
import logging
from pypdf import PdfReader

logger = logging.getLogger("uvicorn")

def extract_text_from_pdf(file_bytes: bytes) -> str:
    """
    Extracts text content from PDF file bytes.
    """
    try:
        pdf = PdfReader(io.BytesIO(file_bytes))
        text = ""
        for i, page in enumerate(pdf.pages):
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
        return text.strip()
    except Exception as e:
        logger.error(f"Error parsing PDF: {str(e)}")
        raise ValueError(f"Failed to extract text from PDF: {str(e)}")
