import os
from dotenv import load_dotenv
from google import genai
from google.genai import types
from pydantic import BaseModel, Field
from typing import List

# Load environment variables
load_dotenv()

class ConceptExplanation(BaseModel):
    concept: str = Field(description="The name of the key or difficult concept/term")
    explanation: str = Field(description="A simple, clear explanation of the concept in beginner-friendly language")

class MCQ(BaseModel):
    question: str = Field(description="The multiple-choice question testing comprehension of the material")
    options: List[str] = Field(description="Exactly 4 distinct options to choose from")
    correct_answer: str = Field(description="The exact string matching the correct option in the options list")
    explanation: str = Field(description="Detailed explanation of why the correct answer is correct")

class Flashcard(BaseModel):
    front: str = Field(description="Front of the card: a term, question, or key concept")
    back: str = Field(description="Back of the card: definition, answer, or brief explanation")

class StudySuite(BaseModel):
    summary: str = Field(description="A concise summary of the main points of the study material")
    difficult_concepts: List[ConceptExplanation] = Field(description="A list of 3-5 key or difficult concepts explained simply")
    quiz: List[MCQ] = Field(description="A list of exactly 5 multiple-choice questions testing understanding of the material")
    flashcards: List[Flashcard] = Field(description="A set of 5-8 flashcards covering terms, formulas, or concepts")

def get_gemini_client() -> genai.Client:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY is not set. Please set it in backend/.env file.")
    # Initialize the client with the provided API key
    return genai.Client(api_key=api_key)

def generate_study_material(text: str) -> StudySuite:
    """
    Calls the Gemini API using the new google-genai SDK to generate a study suite.
    """
    client = get_gemini_client()
    
    prompt = f"""
    You are an expert AI Study Buddy. Analyze the following study material and generate a comprehensive study suite.
    
    Study Material:
    ---
    {text}
    ---
    
    Please provide:
    1. A concise, well-structured summary of the material.
    2. A list of 3 to 5 key or difficult concepts, explaining them in simple, easy-to-understand language.
    3. Exactly 5 multiple-choice questions (MCQs) to test understanding, each with 4 options, a correct answer, and an explanation.
    4. A list of 5 to 8 flashcards (front and back) for key terms, definitions, and concepts.
    """
    
    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=StudySuite,
                temperature=0.2,
            )
        )
        
        if response.text:
            return StudySuite.model_validate_json(response.text)
        elif hasattr(response, 'parsed') and response.parsed:
            return response.parsed
        else:
            raise ValueError("Empty response from Gemini API.")
            
    except Exception as e:
        raise RuntimeError(f"Error calling Gemini API: {str(e)}")
