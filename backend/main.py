from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
import os
import tempfile
import shutil
from pathlib import Path
import logging
from typing import Optional, List
import json

# Import our custom modules
from document_parser import DocumentParser
from ai_processor import AIProcessor
from compliance_checker import ComplianceChecker

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Contract IQ Document Analysis API",
    description="AI-powered document analysis and processing",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080", "http://127.0.0.1:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize processors
document_parser = DocumentParser()
ai_processor = AIProcessor()
compliance_checker = ComplianceChecker()

# Create uploads directory
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

# File size limit (10MB)
MAX_FILE_SIZE = 10 * 1024 * 1024

@app.get("/")
async def root():
    return {"message": "Contract IQ Document Analysis API", "status": "running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "document-analysis"}

@app.post("/analyze-document")
async def analyze_document(
    file: UploadFile = File(...),
    question: Optional[str] = Form(None),
    analysis_type: str = Form("general")
):
    """
    Analyze uploaded document with AI
    
    Args:
        file: Uploaded document (PDF, DOC, DOCX)
        question: Optional specific question about the document
        analysis_type: Type of analysis (general, compliance, risk, clauses)
    """
    try:
        # Validate file
        if not file.filename:
            raise HTTPException(status_code=400, detail="No file provided")
        
        # Check file extension
        allowed_extensions = {'.pdf', '.doc', '.docx'}
        file_extension = Path(file.filename).suffix.lower()
        if file_extension not in allowed_extensions:
            raise HTTPException(
                status_code=400, 
                detail=f"Unsupported file type. Allowed: {', '.join(allowed_extensions)}"
            )
        
        # Check file size
        file_content = await file.read()
        if len(file_content) > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=400, 
                detail=f"File too large. Maximum size: {MAX_FILE_SIZE // (1024*1024)}MB"
            )
        
        # Save file temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix=file_extension) as temp_file:
            temp_file.write(file_content)
            temp_file_path = temp_file.name
        
        try:
            # Parse document
            logger.info(f"Parsing document: {file.filename}")
            extracted_text = document_parser.extract_text(temp_file_path, file_extension)
            
            if not extracted_text.strip():
                raise HTTPException(status_code=400, detail="Could not extract text from document")
            
            # Perform AI analysis
            logger.info(f"Performing {analysis_type} analysis")
            
            if analysis_type == "compliance":
                # Compliance-specific analysis
                compliance_results = compliance_checker.check_compliance(extracted_text)
                ai_analysis = ai_processor.analyze_compliance(extracted_text, question)
                
                return JSONResponse({
                    "success": True,
                    "filename": file.filename,
                    "analysis_type": analysis_type,
                    "analysis": ai_analysis,
                    "compliance_results": compliance_results,
                    "document_length": len(extracted_text),
                    "provider": "Hugging Face Transformers"
                })
            
            elif analysis_type == "risk":
                # Risk assessment
                risk_analysis = ai_processor.assess_risks(extracted_text, question)
                risk_score = compliance_checker.calculate_risk_score(extracted_text)
                
                return JSONResponse({
                    "success": True,
                    "filename": file.filename,
                    "analysis_type": analysis_type,
                    "analysis": risk_analysis,
                    "risk_score": risk_score,
                    "document_length": len(extracted_text),
                    "provider": "Hugging Face Transformers"
                })
            
            elif analysis_type == "clauses":
                # Clause detection and analysis
                detected_clauses = compliance_checker.detect_clauses(extracted_text)
                clause_analysis = ai_processor.analyze_clauses(extracted_text, question)
                
                return JSONResponse({
                    "success": True,
                    "filename": file.filename,
                    "analysis_type": analysis_type,
                    "analysis": clause_analysis,
                    "detected_clauses": detected_clauses,
                    "document_length": len(extracted_text),
                    "provider": "Hugging Face Transformers"
                })
            
            else:
                # General analysis
                analysis_result = ai_processor.analyze_document(extracted_text, question)
                summary = ai_processor.summarize_document(extracted_text)
                
                return JSONResponse({
                    "success": True,
                    "filename": file.filename,
                    "analysis_type": analysis_type,
                    "analysis": analysis_result,
                    "summary": summary,
                    "document_length": len(extracted_text),
                    "provider": "Hugging Face Transformers"
                })
        
        finally:
            # Clean up temporary file
            if os.path.exists(temp_file_path):
                os.unlink(temp_file_path)
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error analyzing document: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@app.post("/extract-clauses")
async def extract_clauses(
    file: UploadFile = File(...),
    clause_types: List[str] = Form(["liability", "termination", "payment", "confidentiality"])
):
    """
    Extract specific types of clauses from document
    """
    try:
        # Validate and process file (similar to analyze_document)
        if not file.filename:
            raise HTTPException(status_code=400, detail="No file provided")
        
        file_extension = Path(file.filename).suffix.lower()
        if file_extension not in {'.pdf', '.doc', '.docx'}:
            raise HTTPException(status_code=400, detail="Unsupported file type")
        
        file_content = await file.read()
        if len(file_content) > MAX_FILE_SIZE:
            raise HTTPException(status_code=400, detail="File too large")
        
        with tempfile.NamedTemporaryFile(delete=False, suffix=file_extension) as temp_file:
            temp_file.write(file_content)
            temp_file_path = temp_file.name
        
        try:
            # Extract text and find clauses
            extracted_text = document_parser.extract_text(temp_file_path, file_extension)
            clauses = compliance_checker.extract_specific_clauses(extracted_text, clause_types)
            
            return JSONResponse({
                "success": True,
                "filename": file.filename,
                "extracted_clauses": clauses,
                "clause_types_requested": clause_types,
                "provider": "Hugging Face Transformers"
            })
        
        finally:
            if os.path.exists(temp_file_path):
                os.unlink(temp_file_path)
    
    except Exception as e:
        logger.error(f"Error extracting clauses: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Clause extraction failed: {str(e)}")

@app.post("/compliance-check")
async def compliance_check(
    file: UploadFile = File(...),
    regulations: List[str] = Form(["GDPR", "CCPA", "SOX"])
):
    """
    Check document compliance against specific regulations
    """
    try:
        # File validation and processing
        if not file.filename:
            raise HTTPException(status_code=400, detail="No file provided")
        
        file_extension = Path(file.filename).suffix.lower()
        if file_extension not in {'.pdf', '.doc', '.docx'}:
            raise HTTPException(status_code=400, detail="Unsupported file type")
        
        file_content = await file.read()
        if len(file_content) > MAX_FILE_SIZE:
            raise HTTPException(status_code=400, detail="File too large")
        
        with tempfile.NamedTemporaryFile(delete=False, suffix=file_extension) as temp_file:
            temp_file.write(file_content)
            temp_file_path = temp_file.name
        
        try:
            # Extract text and check compliance
            extracted_text = document_parser.extract_text(temp_file_path, file_extension)
            compliance_results = compliance_checker.check_specific_compliance(extracted_text, regulations)
            
            return JSONResponse({
                "success": True,
                "filename": file.filename,
                "compliance_results": compliance_results,
                "regulations_checked": regulations,
                "provider": "Hugging Face Transformers"
            })
        
        finally:
            if os.path.exists(temp_file_path):
                os.unlink(temp_file_path)
    
    except Exception as e:
        logger.error(f"Error checking compliance: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Compliance check failed: {str(e)}")

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8001,
        reload=True,
        log_level="info"
    )