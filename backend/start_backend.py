#!/usr/bin/env python3
"""
Startup script for the FastAPI backend server
"""

import os
import sys
import subprocess
import logging
from pathlib import Path

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def check_dependencies():
    """Check if required dependencies are installed"""
    try:
        import fastapi
        import uvicorn
        import transformers
        import torch
        logger.info("✅ All required dependencies are available")
        return True
    except ImportError as e:
        logger.error(f"❌ Missing dependency: {e}")
        logger.info("Please install dependencies: pip install -r requirements.txt")
        return False

def check_models():
    """Check if AI models can be loaded"""
    try:
        from transformers import pipeline
        logger.info("🤖 Testing AI model loading...")
        
        # Test a lightweight model
        classifier = pipeline("sentiment-analysis", model="distilbert-base-uncased-finetuned-sst-2-english")
        test_result = classifier("This is a test.")
        logger.info(f"✅ AI models working correctly: {test_result}")
        return True
    except Exception as e:
        logger.warning(f"⚠️ AI models may not work properly: {e}")
        logger.info("The server will still start but AI features may be limited")
        return False

def create_directories():
    """Create necessary directories"""
    directories = ["uploads", "temp", "logs"]
    for directory in directories:
        Path(directory).mkdir(exist_ok=True)
        logger.info(f"📁 Created/verified directory: {directory}")

def start_server():
    """Start the FastAPI server"""
    logger.info("🚀 Starting FastAPI server...")
    
    try:
        import uvicorn
        uvicorn.run(
            "main:app",
            host="0.0.0.0",
            port=8001,
            reload=True,
            log_level="info",
            access_log=True
        )
    except KeyboardInterrupt:
        logger.info("🛑 Server stopped by user")
    except Exception as e:
        logger.error(f"❌ Server error: {e}")

def main():
    """Main startup function"""
    logger.info("🔧 Contract IQ Backend Server Startup")
    logger.info("=" * 50)
    
    # Check dependencies
    if not check_dependencies():
        sys.exit(1)
    
    # Create directories
    create_directories()
    
    # Check AI models (non-blocking)
    check_models()
    
    # Start server
    logger.info("🌐 Server will be available at: http://localhost:8001")
    logger.info("📚 API documentation: http://localhost:8001/docs")
    logger.info("=" * 50)
    
    start_server()

if __name__ == "__main__":
    main()