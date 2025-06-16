import logging
import re
from typing import Dict, List, Tuple
import json

logger = logging.getLogger(__name__)

class ComplianceChecker:
    """
    Compliance checker for legal documents
    """
    
    def __init__(self):
        self.compliance_rules = self._load_compliance_rules()
        self.clause_patterns = self._load_clause_patterns()
        logger.info("ComplianceChecker initialized")
    
    def _load_compliance_rules(self) -> Dict:
        """Load compliance rules and regulations"""
        return {
            "GDPR": {
                "required_terms": [
                    "data protection", "personal data", "data subject rights",
                    "consent", "data processor", "data controller"
                ],
                "prohibited_terms": [
                    "unlimited data retention", "no data subject rights"
                ],
                "risk_indicators": [
                    "automatic data processing", "profiling", "sensitive data"
                ]
            },
            "CCPA": {
                "required_terms": [
                    "california consumer privacy act", "personal information",
                    "consumer rights", "opt-out", "data deletion"
                ],
                "prohibited_terms": [
                    "no consumer rights", "mandatory data sharing"
                ],
                "risk_indicators": [
                    "sale of personal information", "third-party sharing"
                ]
            },
            "SOX": {
                "required_terms": [
                    "financial disclosure", "internal controls", "audit",
                    "financial reporting", "compliance certification"
                ],
                "prohibited_terms": [
                    "no financial oversight", "unrestricted access"
                ],
                "risk_indicators": [
                    "related party transactions", "off-balance sheet"
                ]
            },
            "HIPAA": {
                "required_terms": [
                    "protected health information", "phi", "business associate",
                    "minimum necessary", "security safeguards"
                ],
                "prohibited_terms": [
                    "unrestricted phi access", "no security measures"
                ],
                "risk_indicators": [
                    "phi disclosure", "unsecured transmission"
                ]
            }
        }
    
    def _load_clause_patterns(self) -> Dict:
        """Load patterns for clause detection"""
        return {
            "termination": {
                "patterns": [
                    r"terminat\w+",
                    r"end\s+(?:this\s+)?agreement",
                    r"expir\w+",
                    r"dissolv\w+",
                    r"breach.*terminat\w+"
                ],
                "keywords": ["terminate", "termination", "end", "expire", "dissolution"]
            },
            "liability": {
                "patterns": [
                    r"liabilit\w+",
                    r"liable\s+for",
                    r"damages",
                    r"indemnif\w+",
                    r"limitation\s+of\s+liability"
                ],
                "keywords": ["liability", "liable", "damages", "indemnify", "limitation"]
            },
            "payment": {
                "patterns": [
                    r"payment\s+terms",
                    r"invoice\w*",
                    r"fee\s+schedule",
                    r"compensation",
                    r"\$[\d,]+(?:\.\d{2})?"
                ],
                "keywords": ["payment", "invoice", "fee", "compensation", "cost"]
            },
            "confidentiality": {
                "patterns": [
                    r"confidential\w*",
                    r"non.?disclosure",
                    r"proprietary\s+information",
                    r"trade\s+secret\w*",
                    r"confidentiality\s+agreement"
                ],
                "keywords": ["confidential", "non-disclosure", "proprietary", "trade secret"]
            },
            "intellectual_property": {
                "patterns": [
                    r"intellectual\s+property",
                    r"copyright\w*",
                    r"trademark\w*",
                    r"patent\w*",
                    r"trade\s+secret\w*"
                ],
                "keywords": ["intellectual property", "copyright", "trademark", "patent"]
            },
            "dispute_resolution": {
                "patterns": [
                    r"dispute\s+resolution",
                    r"arbitration",
                    r"mediation",
                    r"governing\s+law",
                    r"jurisdiction"
                ],
                "keywords": ["dispute", "arbitration", "mediation", "governing law"]
            },
            "force_majeure": {
                "patterns": [
                    r"force\s+majeure",
                    r"act\s+of\s+god",
                    r"unforeseeable\s+circumstances",
                    r"beyond\s+reasonable\s+control"
                ],
                "keywords": ["force majeure", "act of god", "unforeseeable"]
            }
        }
    
    def check_compliance(self, text: str) -> Dict:
        """
        Check document compliance against multiple regulations
        
        Args:
            text: Document text
            
        Returns:
            Compliance results dictionary
        """
        results = {
            "overall_score": 0,
            "regulations": {},
            "missing_requirements": [],
            "risk_factors": [],
            "recommendations": []
        }
        
        total_score = 0
        regulation_count = 0
        
        for regulation, rules in self.compliance_rules.items():
            reg_result = self._check_single_regulation(text, regulation, rules)
            results["regulations"][regulation] = reg_result
            total_score += reg_result["score"]
            regulation_count += 1
            
            # Collect missing requirements
            results["missing_requirements"].extend(reg_result["missing_requirements"])
            results["risk_factors"].extend(reg_result["risk_factors"])
        
        # Calculate overall score
        results["overall_score"] = total_score / regulation_count if regulation_count > 0 else 0
        
        # Generate recommendations
        results["recommendations"] = self._generate_recommendations(results)
        
        return results
    
    def check_specific_compliance(self, text: str, regulations: List[str]) -> Dict:
        """
        Check compliance against specific regulations
        
        Args:
            text: Document text
            regulations: List of regulation names to check
            
        Returns:
            Compliance results for specified regulations
        """
        results = {
            "overall_score": 0,
            "regulations": {},
            "missing_requirements": [],
            "risk_factors": [],
            "recommendations": []
        }
        
        total_score = 0
        regulation_count = 0
        
        for regulation in regulations:
            if regulation in self.compliance_rules:
                rules = self.compliance_rules[regulation]
                reg_result = self._check_single_regulation(text, regulation, rules)
                results["regulations"][regulation] = reg_result
                total_score += reg_result["score"]
                regulation_count += 1
                
                results["missing_requirements"].extend(reg_result["missing_requirements"])
                results["risk_factors"].extend(reg_result["risk_factors"])
        
        results["overall_score"] = total_score / regulation_count if regulation_count > 0 else 0
        results["recommendations"] = self._generate_recommendations(results)
        
        return results
    
    def _check_single_regulation(self, text: str, regulation: str, rules: Dict) -> Dict:
        """Check compliance against a single regulation"""
        text_lower = text.lower()
        
        result = {
            "regulation": regulation,
            "score": 0,
            "found_requirements": [],
            "missing_requirements": [],
            "risk_factors": [],
            "prohibited_found": []
        }
        
        # Check required terms
        required_terms = rules.get("required_terms", [])
        found_required = []
        missing_required = []
        
        for term in required_terms:
            if term.lower() in text_lower:
                found_required.append(term)
            else:
                missing_required.append(term)
        
        result["found_requirements"] = found_required
        result["missing_requirements"] = missing_required
        
        # Check prohibited terms
        prohibited_terms = rules.get("prohibited_terms", [])
        prohibited_found = []
        
        for term in prohibited_terms:
            if term.lower() in text_lower:
                prohibited_found.append(term)
        
        result["prohibited_found"] = prohibited_found
        
        # Check risk indicators
        risk_indicators = rules.get("risk_indicators", [])
        risk_factors = []
        
        for indicator in risk_indicators:
            if indicator.lower() in text_lower:
                risk_factors.append(indicator)
        
        result["risk_factors"] = risk_factors
        
        # Calculate score
        if required_terms:
            compliance_ratio = len(found_required) / len(required_terms)
            penalty = len(prohibited_found) * 0.2  # Penalty for prohibited terms
            risk_penalty = len(risk_factors) * 0.1  # Penalty for risk factors
            
            result["score"] = max(0, (compliance_ratio - penalty - risk_penalty) * 100)
        else:
            result["score"] = 100  # No requirements to check
        
        return result
    
    def detect_clauses(self, text: str) -> Dict:
        """
        Detect and classify clauses in the document
        
        Args:
            text: Document text
            
        Returns:
            Dictionary of detected clauses
        """
        detected_clauses = {}
        
        for clause_type, patterns_data in self.clause_patterns.items():
            patterns = patterns_data["patterns"]
            keywords = patterns_data["keywords"]
            
            clause_matches = []
            
            # Pattern matching
            for pattern in patterns:
                matches = re.finditer(pattern, text, re.IGNORECASE)
                for match in matches:
                    # Get surrounding context
                    start = max(0, match.start() - 50)
                    end = min(len(text), match.end() + 50)
                    context = text[start:end].strip()
                    clause_matches.append({
                        "match": match.group(),
                        "context": context,
                        "position": match.start()
                    })
            
            # Keyword matching for additional context
            keyword_matches = []
            text_lower = text.lower()
            for keyword in keywords:
                if keyword.lower() in text_lower:
                    keyword_matches.append(keyword)
            
            if clause_matches or keyword_matches:
                detected_clauses[clause_type] = {
                    "found": True,
                    "matches": clause_matches[:3],  # Limit to first 3 matches
                    "keywords_found": keyword_matches,
                    "confidence": self._calculate_clause_confidence(clause_matches, keyword_matches)
                }
            else:
                detected_clauses[clause_type] = {
                    "found": False,
                    "matches": [],
                    "keywords_found": [],
                    "confidence": 0
                }
        
        return detected_clauses
    
    def extract_specific_clauses(self, text: str, clause_types: List[str]) -> Dict:
        """
        Extract specific types of clauses
        
        Args:
            text: Document text
            clause_types: List of clause types to extract
            
        Returns:
            Dictionary of extracted clauses
        """
        extracted_clauses = {}
        
        for clause_type in clause_types:
            if clause_type in self.clause_patterns:
                patterns_data = self.clause_patterns[clause_type]
                patterns = patterns_data["patterns"]
                
                clause_text = []
                
                # Find sentences containing clause patterns
                sentences = text.split('.')
                for sentence in sentences:
                    for pattern in patterns:
                        if re.search(pattern, sentence, re.IGNORECASE):
                            clause_text.append(sentence.strip())
                            break
                
                extracted_clauses[clause_type] = {
                    "found": len(clause_text) > 0,
                    "text_segments": clause_text[:3],  # Limit to first 3 segments
                    "count": len(clause_text)
                }
            else:
                extracted_clauses[clause_type] = {
                    "found": False,
                    "text_segments": [],
                    "count": 0
                }
        
        return extracted_clauses
    
    def calculate_risk_score(self, text: str) -> Dict:
        """
        Calculate overall risk score for the document
        
        Args:
            text: Document text
            
        Returns:
            Risk score and analysis
        """
        risk_factors = {
            "high_risk": {
                "terms": [
                    "unlimited liability", "personal guarantee", "liquidated damages",
                    "automatic renewal", "non-compete", "exclusive dealing",
                    "penalty clause", "forfeiture"
                ],
                "weight": 3
            },
            "medium_risk": {
                "terms": [
                    "indemnification", "force majeure", "intellectual property",
                    "confidentiality breach", "termination for convenience",
                    "governing law", "arbitration mandatory"
                ],
                "weight": 2
            },
            "low_risk": {
                "terms": [
                    "standard warranty", "mutual agreement", "reasonable notice",
                    "good faith", "best efforts", "industry standard"
                ],
                "weight": 1
            }
        }
        
        text_lower = text.lower()
        risk_analysis = {
            "overall_score": 0,
            "risk_level": "LOW",
            "factors_found": {
                "high_risk": [],
                "medium_risk": [],
                "low_risk": []
            },
            "recommendations": []
        }
        
        total_risk_score = 0
        
        for risk_level, data in risk_factors.items():
            terms = data["terms"]
            weight = data["weight"]
            found_terms = []
            
            for term in terms:
                if term.lower() in text_lower:
                    found_terms.append(term)
                    total_risk_score += weight
            
            risk_analysis["factors_found"][risk_level] = found_terms
        
        # Determine risk level
        if total_risk_score >= 15:
            risk_analysis["risk_level"] = "HIGH"
        elif total_risk_score >= 8:
            risk_analysis["risk_level"] = "MEDIUM"
        else:
            risk_analysis["risk_level"] = "LOW"
        
        risk_analysis["overall_score"] = min(100, total_risk_score * 5)  # Scale to 100
        
        # Generate recommendations
        risk_analysis["recommendations"] = self._generate_risk_recommendations(risk_analysis)
        
        return risk_analysis
    
    def _calculate_clause_confidence(self, clause_matches: List, keyword_matches: List) -> float:
        """Calculate confidence score for clause detection"""
        pattern_score = min(len(clause_matches) * 0.4, 1.0)
        keyword_score = min(len(keyword_matches) * 0.2, 0.6)
        return min(pattern_score + keyword_score, 1.0)
    
    def _generate_recommendations(self, compliance_results: Dict) -> List[str]:
        """Generate compliance recommendations"""
        recommendations = []
        
        if compliance_results["overall_score"] < 70:
            recommendations.append("Document requires significant compliance improvements")
        
        if compliance_results["missing_requirements"]:
            recommendations.append(f"Add missing compliance requirements: {', '.join(compliance_results['missing_requirements'][:3])}")
        
        if compliance_results["risk_factors"]:
            recommendations.append("Review and address identified risk factors")
        
        if not recommendations:
            recommendations.append("Document shows good compliance. Consider periodic review.")
        
        return recommendations
    
    def _generate_risk_recommendations(self, risk_analysis: Dict) -> List[str]:
        """Generate risk-based recommendations"""
        recommendations = []
        
        if risk_analysis["risk_level"] == "HIGH":
            recommendations.append("High-risk document requires legal review before execution")
            recommendations.append("Consider negotiating terms to reduce liability exposure")
        
        elif risk_analysis["risk_level"] == "MEDIUM":
            recommendations.append("Medium-risk document should be reviewed by legal counsel")
            recommendations.append("Ensure adequate insurance coverage for identified risks")
        
        else:
            recommendations.append("Low-risk document with standard terms")
            recommendations.append("Periodic review recommended for ongoing compliance")
        
        # Specific recommendations based on found factors
        if risk_analysis["factors_found"]["high_risk"]:
            recommendations.append("Pay special attention to high-risk clauses identified")
        
        return recommendations