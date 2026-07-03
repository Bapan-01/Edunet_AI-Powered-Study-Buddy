# AI Study Buddy
A simple, lightweight, and beginner-friendly web application designed to help users study more effectively. Built with **React** (frontend) and **FastAPI** (backend), the app uses the **Gemini API** (`gemini-2.5-flash`) in a single optimized request to process study notes or uploaded PDFs and instantly generate:
- 📝 A concise **Summary** of the material.
- 💡 **Key Concepts** explained in simple, digestible language.
- 🎴 Flippable **Flashcards** with a smooth 3D CSS transition.
- ❓ An interactive **Practice Quiz** (5 MCQs) with instant visual feedback and answer explanations.
This project is built using **Vanilla CSS** (no Tailwind or other CSS frameworks) and contains no complex setups like databases, RAG, authentication, or chat history, making it ideal for beginners.
---
## Project Structure
```text
Study Buddy/
├── backend/
│   ├── utils/
│   │   ├── gemini.py          # Gemini API integration and response schemas
│   │   └── pdf.py             # PDF text extraction using pypdf
│   ├── .env                   # Configuration file (place your API key here)
│   ├── .env.example           # Example environment template
│   ├── main.py                # FastAPI endpoints and middleware setup
│   └── requirements.txt       # Python dependencies
└── frontend/
    ├── src/
    │   ├── assets/            # App icons and graphics
    │   ├── components/        # Sub-components
    │   │   ├── ConceptsView.jsx   # Renders key concepts
    │   │   ├── FlashcardsView.jsx # 3D flippable flashcards deck
    │   │   ├── QuizView.jsx       # Interactive MCQs with scoring
    │   │   ├── StudyInput.jsx     # Handles file upload and notes area
    │   │   └── SummaryView.jsx    # Renders the study summary
    │   ├── App.css            # Custom Vanilla CSS styling
    │   ├── App.jsx            # Main app controller and state
    │   ├── index.css          # Style imports
    │   └── main.jsx           # App entrypoint
    ├── index.html             # HTML layout (Google Fonts imported here)
    ├── package.json           # Frontend dependencies
    └── vite.config.js         # Vite configuration
```
---
## Prerequisites
Ensure you have the following installed on your system:
- **Python** (version 3.10 or higher)
- **Node.js** (version 18 or higher)
- A **Gemini API Key** from [Google AI Studio](https://aistudio.google.com/)
---
## Setup & Installation
### 1. Backend Setup
1. Open a terminal and navigate to the `backend/` directory:
   ```bash
   cd backend
   ```
2. Create a virtual environment:
   ```bash
   python -m venv venv
   ```
3. Activate the virtual environment:
   - **Windows (PowerShell)**:
     ```powershell
     .\venv\Scripts\Activate.ps1
     ```
   - **Windows (CMD)**:
     ```cmd
     .\venv\Scripts\activate.bat
     ```
   - **macOS/Linux**:
     ```bash
     source venv/bin/activate
     ```
4. Install python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
5. Configure your Gemini API key:
   - Copy `.env.example` to `.env` (or create a `.env` file).
   - Insert your actual Gemini API key:
     ```env
     GEMINI_API_KEY=your_actual_api_key_here
     ```
### 2. Frontend Setup
1. Open a new terminal and navigate to the `frontend/` directory:
   ```bash
   cd frontend
   ```
2. Install Node dependencies:
   ```bash
   npm install
   ```
---
## Running the Application
### Step 1: Start the Backend (FastAPI)
Ensure you are in the `backend/` directory with your virtual environment activated, then run:
```bash
uvicorn main:app --reload
```
The backend server will run on **`http://localhost:8000`**. You can verify it by opening `http://localhost:8000/docs` in your browser.
### Step 2: Start the Frontend (Vite + React)
Navigate to the `frontend/` directory and run:
```bash
npm run dev
```
The React development server will start on **`http://localhost:5173`**.
Open **`http://localhost:5173`** in your browser. The top-right badge will show **Ready** (green dot) once the frontend successfully connects to the backend and verifies your API key configuration.
---
## Technologies Used
- **Frontend**:
  - [React](https://react.dev/) (Vite bundler)
  - [Lucide React](https://lucide.dev/) (Sleek modern icon library)
  - Vanilla CSS (Glassmorphism, 3D perspective animations)
- **Backend**:
  - [FastAPI](https://fastapi.tiangolo.com/) (Web framework)
  - [google-genai](https://pypi.org/project/google-genai/) (Official Google GenAI SDK)
  - [pypdf](https://pypdf.readthedocs.io/) (Lightweight PDF parsing)
  - [Pydantic](https://docs.pydantic.dev/) (Strict JSON data schemas)
