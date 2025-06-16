import logging
import re
from typing import Optional, Dict, List
import json

# Hugging Face Transformers
try:
    from transformers import pipeline, AutoTokenizer, AutoModelForSequenceClassification
    from transformers import AutoModelForQuestionAnswering, AutoTokenizer
    import torch
except ImportError:
    print("Transformers not available. Please install: pip install transformers torch")
    pipeline = None

logger = logging.getLogger(__name__)

class AIProcessor:
    """
    AI processor using Hugging Face Transformers for document analysis
    """
    
    def __init__(self):
        self.device = 0 if torch.cuda.is_available() else -1
        logger.info(f"AIProcessor initialized with device: {'GPU' if self.device == 0 else 'CPU'}")
        
        # Initialize models
        self._init_models()
    
    def _init_models(self):
        """Initialize Hugging Face models"""
        try:
            # Summarization model
            self.summarizer = pipeline(
                "summarization",
                model="facebook/bart-large-cnn",
                device=self.device
            )
            
            # Question answering model
            self.qa_pipeline = pipeline(
                "question-answering",
                model="distilbert-base-cased-distilled-squad",
                device=self.device
            )
            
            # Text classification for sentiment/risk
            self.classifier = pipeline(
                "text-classification",
                model="cardiffnlp/twitter-roberta-base-sentiment-latest",
                device=self.device
            )
            
            # Zero-shot classification for clause detection
            self.zero_shot_classifier = pipeline(
                "zero-shot-classification",
                model="facebook/bart-large-mnli",
                device=self.device
            )
            
            logger.info("All AI models loaded successfully")
            
        except Exception as e:
            logger.error(f"Error loading AI models: {str(e)}")
            # Fallback to simpler models or rule-based processing
            self.summarizer = None
            self.qa_pipeline = None
            self.classifier = None
            self.zero_shot_classifier = None
    
    def analyze_document(self, text: str, question: Optional[str] = None) -> str:
        """
        Perform general document analysis
        
        Args:
            text: Document text
            question: Optional specific question
            
        Returns:
            Analysis result
        """
        try:
            analysis_parts = []
            
            # Document summary
            summary = self.summarize_document(text)
            analysis_parts.append(f"**Document Summary:**\n{summary}\n")
            
            # Key insights
            insights = self._extract_key_insights(text)
            analysis_parts.append(f"**Key Insights:**\n{insights}\n")
            
            # Answer specific question if provided
            if question:
                answer = self.answer_question(text, question)
                analysis_parts.append(f"**Answer to your question:**\n{answer}\n")
            
            # Risk assessment
            risk_level = self._assess_risk_level(text)
            analysis_parts.append(f"**Risk Assessment:**\n{risk_level}\n")
            
            return "\n".join(analysis_parts)
        
        except Exception as e:
            logger.error(f"Error in document analysis: {str(e)}")
            return f"Analysis completed with basic text processing. Document contains {len(text)} characters. For specific questions, please provide more details."
    
    def summarize_document(self, text: str, max_length: int = 150) -> str:
        """
        Generate document summary
        
        Args:
            text: Document text
            max_length: Maximum summary length
            
        Returns:
            Document summary
        """
        try:
            if self.summarizer and len(text) > 100:
                # Chunk text if too long
                max_chunk_length = 1024
                if len(text) > max_chunk_length:
                    # Take first and last parts for summary
                    text_chunk = text[:max_chunk_length//2] + text[-max_chunk_length//2:]
                else:
                    text_chunk = text
                
                summary = self.summarizer(
                    text_chunk,
                    max_length=max_length,
                    min_length=30,
                    do_sample=False
                )
                return summary[0]['summary_text']
            else:
                # Fallback: extract first few sentences
                sentences = text.split('.')[:3]
                return '. '.join(sentences) + '.'
        
        except Exception as e:
            logger.error(f"Error in summarization: {str(e)}")
            # Fallback summary
            words = text.split()[:50]
            return ' '.join(words) + "..."
    
    def answer_question(self, text: str, question: str) -> str:
        """
        Answer specific question about the document
        
        Args:
            text: Document text
            question: Question to answer
            
        Returns:
            Answer to the question
        """
        try:
            if self.qa_pipeline:
                # Limit context length for the model
                max_context_length = 512
                if len(text) > max_context_length:
                    # Try to find relevant section
                    text_lower = text.lower()
                    question_lower = question.lower()
                    
                    # Look for keywords from question in text
                    question_words = question_lower.split()
                    best_start = 0
                    best_score = 0
                    
                    for i in range(0, len(text) - max_context_length, 100):
                        chunk = text[i:i + max_context_length].lower()
                        score = sum(1 for word in question_words if word in chunk)
                        if score > best_score:
                            best_score = score
                            best_start = i
                    
                    context = text[best_start:best_start + max_context_length]
                else:
                    context = text
                
                result = self.qa_pipeline(question=question, context=context)
                return f"{result['answer']} (Confidence: {result['score']:.2f})"
            else:
                # Fallback: simple keyword search
                return self._simple_question_answer(text, question)
        
        except Exception as e:
            logger.error(f"Error answering question: {str(e)}")
            return f"I found relevant information in the document, but couldn't process your specific question. Please try rephrasing or ask about specific terms mentioned in the document."
    
    def analyze_compliance(self, text: str, question: Optional[str] = None) -> str:
        """
        Analyze document for compliance issues
        """
        try:
            compliance_analysis = []
            
            # Check for common compliance elements
            compliance_elements = {
                "Data Protection": ["personal data", "privacy", "gdpr", "data protection", "consent"],
                "Financial Compliance": ["sox", "sarbanes", "financial disclosure", "audit", "accounting"],
                "Employment Law": ["equal opportunity", "discrimination", "harassment", "workplace safety"],
                "Contract Law": ["force majeure", "indemnification", "limitation of liability", "termination"]
            }
            
            for category, keywords in compliance_elements.items():
                found_keywords = [kw for kw in keywords if kw.lower() in text.lower()]
                if found_keywords:
                    compliance_analysis.append(f"**{category}:** Found references to {', '.join(found_keywords)}")
            
            if not compliance_analysis:
                compliance_analysis.append("No specific compliance keywords detected. Manual review recommended.")
            
            # Add risk assessment
            risk_indicators = self._find_risk_indicators(text)
            if risk_indicators:
                compliance_analysis.append(f"**Risk Indicators:** {', '.join(risk_indicators)}")
            
            return "\n".join(compliance_analysis)
        
        except Exception as e:
            logger.error(f"Error in compliance analysis: {str(e)}")
            return "Compliance analysis completed. Please review document manually for specific regulatory requirements."
    
    def assess_risks(self, text: str, question: Optional[str] = None) -> str:
        """
        Assess risks in the document
        """
        try:
            risk_analysis = []
            
            # High-risk terms
            high_risk_terms = [
                "unlimited liability", "personal guarantee", "liquidated damages",
                "automatic renewal", "non-compete", "exclusive dealing"
            ]
            
            medium_risk_terms = [
                "indemnification", "force majeure", "intellectual property",
                "confidentiality", "termination", "penalty"
            ]
            
            found_high_risk = [term for term in high_risk_terms if term.lower() in text.lower()]
            found_medium_risk = [term for term in medium_risk_terms if term.lower() in text.lower()]
            
            if found_high_risk:
                risk_analysis.append(f"**HIGH RISK TERMS DETECTED:** {', '.join(found_high_risk)}")
            
            if found_medium_risk:
                risk_analysis.append(f"**MEDIUM RISK TERMS:** {', '.join(found_medium_risk)}")
            
            # Overall risk assessment
            total_risk_terms = len(found_high_risk) * 3 + len(found_medium_risk)
            if total_risk_terms > 10:
                risk_level = "HIGH"
            elif total_risk_terms > 5:
                risk_level = "MEDIUM"
            else:
                risk_level = "LOW"
            
            risk_analysis.append(f"**OVERALL RISK LEVEL:** {risk_level}")
            
            return "\n".join(risk_analysis)
        
        except Exception as e:
            logger.error(f"Error in risk assessment: {str(e)}")
            return "Risk assessment completed. Please review document for specific risk factors."
    
    def analyze_clauses(self, text: str, question: Optional[str] = None) -> str:
        """
        Analyze and classify clauses in the document
        """
        try:
            clause_analysis = []
            
            # Common clause types to detect
            clause_types = [
                "termination clause", "payment terms", "liability clause",
                "confidentiality clause", "intellectual property clause",
                "dispute resolution clause", "force majeure clause"
            ]
            
            if self.zero_shot_classifier:
                # Use AI to classify text sections
                sentences = text.split('.')[:20]  # Analyze first 20 sentences
                for sentence in sentences:
                    if len(sentence.strip()) > 20:
                        result = self.zero_shot_classifier(sentence, clause_types)
                        if result['scores'][0] > 0.5:  # High confidence
                            clause_analysis.append(f"**{result['labels'][0]}:** {sentence.strip()}")
            else:
                # Fallback: keyword-based detection
                clause_keywords = {
                    "Termination": ["terminate", "termination", "end this agreement", "expire"],
                    "Payment": ["payment", "pay", "invoice", "fee", "cost", "price"],
                    "Liability": ["liable", "liability", "responsible", "damages", "loss"],
                    "Confidentiality": ["confidential", "non-disclosure", "proprietary", "secret"]
                }
                
                for clause_type, keywords in clause_keywords.items():
                    found = [kw for kw in keywords if kw.lower() in text.lower()]
                    if found:
                        clause_analysis.append(f"**{clause_type} Clause:** Keywords found - {', '.join(found)}")
            
            if not clause_analysis:
                clause_analysis.append("No specific clauses automatically detected. Manual review recommended.")
            
            return "\n".join(clause_analysis)
        
        except Exception as e:
            logger.error(f"Error in clause analysis: {str(e)}")
            return "Clause analysis completed. Please review document for specific clause types."
    
    def _extract_key_insights(self, text: str) -> str:
        """Extract key insights from document"""
        insights = []
        
        # Document length analysis
        word_count = len(text.split())
        insights.append(f"Document contains {word_count} words")
        
        # Detect document type
        doc_type = self._detect_document_type(text)
        insights.append(f"Appears to be a {doc_type}")
        
        # Find important entities (simple version)
        entities = self._extract_simple_entities(text)
        if entities:
            insights.append(f"Key entities: {', '.join(entities[:5])}")
        
        return "; ".join(insights)
    
    def _assess_risk_level(self, text: str) -> str:
        """Simple risk level assessment"""
        risk_keywords = [
            "penalty", "damages", "liability", "breach", "default",
            "termination", "indemnify", "sue", "court", "arbitration"
        ]
        
        risk_count = sum(1 for keyword in risk_keywords if keyword.lower() in text.lower())
        
        if risk_count > 10:
            return "HIGH - Multiple risk-related terms detected"
        elif risk_count > 5:
            return "MEDIUM - Some risk-related terms found"
        else:
            return "LOW - Few risk indicators detected"
    
    def _detect_document_type(self, text: str) -> str:
        """Detect type of document"""
        text_lower = text.lower()
        
        if any(term in text_lower for term in ["employment", "employee", "employer", "job"]):
            return "Employment Agreement"
        elif any(term in text_lower for term in ["non-disclosure", "nda", "confidential"]):
            return "Non-Disclosure Agreement"
        elif any(term in text_lower for term in ["service", "services", "provider"]):
            return "Service Agreement"
        elif any(term in text_lower for term in ["partnership", "partner", "joint venture"]):
            return "Partnership Agreement"
        elif any(term in text_lower for term in ["sale", "purchase", "buy", "sell"]):
            return "Sales Agreement"
        else:
            return "Legal Document"
    
    def _extract_simple_entities(self, text: str) -> List[str]:
        """Extract simple entities using regex"""
        entities = []
        
        # Find potential company names (capitalized words)
        company_pattern = r'\b[A-Z][a-z]+ (?:Inc|LLC|Corp|Corporation|Company|Ltd)\b'
        companies = re.findall(company_pattern, text)
        entities.extend(companies[:3])
        
        # Find dates
        date_pattern = r'\b\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b'
        dates = re.findall(date_pattern, text)
        entities.extend(dates[:2])
        
        # Find monetary amounts
        money_pattern = r'\$[\d,]+(?:\.\d{2})?'
        amounts = re.findall(money_pattern, text)
        entities.extend(amounts[:2])
        
        return entities
    
    def _simple_question_answer(self, text: str, question: str) -> str:
        """Fallback simple question answering"""
        question_lower = question.lower()
        text_lower = text.lower()
        
        # Simple keyword matching
        question_words = question_lower.split()
        relevant_sentences = []
        
        for sentence in text.split('.'):
            sentence_lower = sentence.lower()
            if any(word in sentence_lower for word in question_words):
                relevant_sentences.append(sentence.strip())
        
        if relevant_sentences:
            return relevant_sentences[0]
        else:
            return "I couldn't find specific information related to your question in the document."
    
    def _find_risk_indicators(self, text: str) -> List[str]:
        """Find risk indicators in text"""
        risk_patterns = {
            "Unlimited Liability": r"unlimited.*liability",
            "Personal Guarantee": r"personal.*guarantee",
            "Automatic Renewal": r"automatic.*renew",
            "Liquidated Damages": r"liquidated.*damages",
            "Non-Compete": r"non.?compete",
            "Exclusive Dealing": r"exclusive.*dealing"
        }
        
        found_risks = []
        text_lower = text.lower()
        
        for risk_name, pattern in risk_patterns.items():
            if re.search(pattern, text_lower):
                found_risks.append(risk_name)
        
        return found_risks