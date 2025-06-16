# Contract IQ Backend - AI Document Analysis

FastAPI backend for AI-powered document analysis and processing.

## Features

- **Document Upload & Validation**: Accept PDF, DOC, DOCX files up to 10MB
- **Text Extraction**: Extract clean text from various document formats
- **AI Analysis**: Powered by Hugging Face Transformers
  - Document summarization
  - Question answering
  - Risk assessment
  - Compliance checking
  - Clause detection
- **Compliance Tracking**: Built-in rules for GDPR, CCPA, SOX, HIPAA
- **RESTful API**: Clean JSON responses for frontend integration

## Quick Start

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Start the Server

```bash
python start_backend.py
```

The server will start at `http://localhost:8001`

### 3. API Documentation

Visit `http://localhost:8001/docs` for interactive API documentation.

## API Endpoints

### Document Analysis
- **POST** `/analyze-document` - General document analysis
- **POST** `/extract-clauses` - Extract specific clause types
- **POST** `/compliance-check` - Check regulatory compliance

### Health Check
- **GET** `/health` - Server health status

## Usage Examples

### Basic Document Analysis

```bash
curl -X POST "http://localhost:8001/analyze-document" \
  -F "file=@contract.pdf" \
  -F "question=What are the payment terms?" \
  -F "analysis_type=general"
```

### Compliance Check

```bash
curl -X POST "http://localhost:8001/compliance-check" \
  -F "file=@contract.pdf" \
  -F "regulations=GDPR" \
  -F "regulations=CCPA"
```

### Clause Extraction

```bash
curl -X POST "http://localhost:8001/extract-clauses" \
  -F "file=@contract.pdf" \
  -F "clause_types=liability" \
  -F "clause_types=termination"
```

## Configuration

### Environment Variables

- `LOG_LEVEL`: Logging level (default: INFO)
- `MAX_FILE_SIZE`: Maximum file size in bytes (default: 10MB)
- `MODEL_CACHE_DIR`: Directory for caching AI models

### Supported File Types

- PDF (.pdf)
- Microsoft Word (.doc, .docx)

### AI Models Used

- **Summarization**: facebook/bart-large-cnn
- **Question Answering**: distilbert-base-cased-distilled-squad
- **Classification**: cardiffnlp/twitter-roberta-base-sentiment-latest
- **Zero-shot Classification**: facebook/bart-large-mnli

## Architecture

```
backend/
├── main.py                 # FastAPI application
├── document_parser.py      # Document text extraction
├── ai_processor.py         # AI analysis using Transformers
├── compliance_checker.py   # Compliance rules and checking
├── requirements.txt        # Python dependencies
├── start_backend.py       # Server startup script
└── README.md              # This file
```

## Error Handling

The API returns structured error responses:

```json
{
  "detail": "Error message",
  "status_code": 400
}
```

Common error codes:
- `400`: Bad request (invalid file, unsupported format)
- `413`: File too large
- `500`: Internal server error

## Performance Notes

- First request may be slower due to model loading
- Models are cached after first use
- GPU acceleration used if available
- File processing is done in temporary storage

## Security

- File size limits enforced
- Temporary files automatically cleaned up
- Input validation on all endpoints
- CORS configured for frontend integration

## Troubleshooting

### Models Not Loading
If AI models fail to load, the server will still start but with limited functionality. Check:
- Internet connection for model downloads
- Available disk space for model cache
- Memory requirements for large models

### File Processing Errors
- Ensure files are not corrupted
- Check file format is supported
- Verify file size is under limit

### Performance Issues
- Consider using GPU for faster processing
- Reduce model complexity for faster responses
- Implement caching for repeated requests

## Development

### Adding New Compliance Rules

Edit `compliance_checker.py` and add rules to `_load_compliance_rules()`:

```python
"NEW_REGULATION": {
    "required_terms": ["term1", "term2"],
    "prohibited_terms": ["bad_term"],
    "risk_indicators": ["risk_term"]
}
```

### Adding New Clause Types

Edit `compliance_checker.py` and add patterns to `_load_clause_patterns()`:

```python
"new_clause_type": {
    "patterns": [r"pattern1", r"pattern2"],
    "keywords": ["keyword1", "keyword2"]
}
```

## License

This project is part of Contract IQ and follows the main project license.