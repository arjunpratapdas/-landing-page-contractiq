from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import requests
import json
import os
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

@csrf_exempt
@require_http_methods(["POST"])
def generate_contract(request):
    """
    Automated Contract Generation using DeepSeek API
    This function handles requests for generating contracts
    and interacts with the DeepSeek API for contract generation
    """
    
    # Get DeepSeek API key from environment variables
    deepseek_api_key = os.getenv('DEEPSEEK_API_KEY')
    if not deepseek_api_key or deepseek_api_key == 'your_deepseek_api_key_here':
        return JsonResponse({
            'success': False,
            'error': 'DeepSeek API key not configured. Please set DEEPSEEK_API_KEY in .env file.'
        }, status=500)
    
    try:
        # Try to parse the JSON data
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({
                'success': False,
                'error': 'Invalid JSON data in request'
            }, status=400)
            
        # Get the required fields with validation
        document_type = data.get('document_type', 'non-disclosure')
        requirements = data.get('requirements', '')
        jurisdiction = data.get('jurisdiction', '')
        
        if not jurisdiction:
            return JsonResponse({
                'success': False,
                'error': 'Jurisdiction is required'
            }, status=400)
        
        # Get document type label for better prompting
        document_type_label = {
            'non-disclosure': 'Non-Disclosure Agreement',
            'employment': 'Employment Contract',
            'service': 'Service Agreement',
            'partnership': 'Partnership Agreement',
            'legal-agreement': 'Legal Agreement',
            'sale-deed': 'Sale Deed'
        }.get(document_type, 'Legal Document')
        
        # Create a prompt for DeepSeek based on the document type and requirements
        prompt = f"""Generate a professional {document_type_label} for the jurisdiction of {jurisdiction}.

The document should be formatted as a proper legal contract with appropriate sections, clauses, and legal language.

Specific requirements for this contract:
{requirements if requirements else 'Standard terms and conditions appropriate for this type of agreement.'}

The contract should be compliant with the laws of {jurisdiction} and include the current date: {datetime.now().strftime('%B %d, %Y')}.

Format the contract with proper legal headings, numbered sections, and include signature blocks at the end.
"""
        
        # Connect to the DeepSeek API
        try:
            headers = {
                'Authorization': f'Bearer {deepseek_api_key}',
                'Content-Type': 'application/json'
            }
            
            # Create the payload for the DeepSeek API
            payload = {
                'model': 'deepseek-chat',  # Updated model name
                'messages': [
                    {
                        'role': 'system',
                        'content': 'You are a legal document assistant that creates professional, legally-sound contracts. Format the document with proper legal structure and language.'
                    },
                    {
                        'role': 'user',
                        'content': prompt
                    }
                ],
                'temperature': 0.7,
                'max_tokens': 4000
            }
            
            # Make the request to the DeepSeek API
            response = requests.post(
                'https://api.deepseek.com/chat/completions',
                headers=headers,
                json=payload,
                timeout=30
            )
            
            # Check if the response is valid
            if response.status_code != 200:
                try:
                    error_data = response.json()
                    error_message = error_data.get('error', {}).get('message', 'Unknown error')
                except:
                    error_message = f'HTTP {response.status_code}: {response.text}'
                
                return JsonResponse({
                    'success': False,
                    'error': f'DeepSeek API error: {error_message}'
                }, status=500)
            
            # Parse the response from the DeepSeek API
            response_json = response.json()
            
            # Extract the generated contract text
            if 'choices' not in response_json or not response_json['choices']:
                return JsonResponse({
                    'success': False,
                    'error': 'Invalid response from DeepSeek API'
                }, status=500)
            
            contract_text = response_json['choices'][0]['message']['content']
            
            # Return the contract text
            return JsonResponse({
                'success': True,
                'contract_text': contract_text,
                'url': f'/api/contracts/{document_type}-{datetime.now().strftime("%Y%m%d%H%M%S")}.txt',
                'document_type': document_type_label,
                'provider': 'DeepSeek'
            })
            
        except requests.exceptions.Timeout:
            return JsonResponse({
                'success': False,
                'error': 'Request timeout. Please try again.'
            }, status=500)
        except requests.exceptions.RequestException as e:
            return JsonResponse({
                'success': False,
                'error': f'DeepSeek API connection error: {str(e)}'
            }, status=500)
        
    except Exception as e:
        # Handle any other errors
        return JsonResponse({
            'success': False,
            'error': f'Server error: {str(e)}'
        }, status=500)

@csrf_exempt
@require_http_methods(["POST"])
def analyze_document(request):
    """
    AI Document Analysis using DeepSeek API
    This function handles requests for document analysis
    and interacts with the DeepSeek API for document analysis
    """
    
    # Get DeepSeek API key from environment variables
    deepseek_api_key = os.getenv('DEEPSEEK_API_KEY')
    if not deepseek_api_key or deepseek_api_key == 'your_deepseek_api_key_here':
        return JsonResponse({
            'success': False,
            'error': 'DeepSeek API key not configured. Please set DEEPSEEK_API_KEY in .env file.'
        }, status=500)
    
    try:
        # Handle both JSON and form data
        if request.content_type and 'multipart/form-data' in request.content_type:
            # Handle file upload
            document_file = request.FILES.get('document')
            question = request.POST.get('question', '')
            
            if not document_file:
                return JsonResponse({
                    'success': False,
                    'error': 'No document file provided'
                }, status=400)
            
            # Read file content (simplified - in production, you'd want proper file parsing)
            try:
                if document_file.content_type == 'text/plain':
                    document_content = document_file.read().decode('utf-8')
                else:
                    # For demo purposes, we'll simulate document content
                    document_content = f"[Document content from {document_file.name} - file parsing would be implemented here]"
            except Exception as e:
                return JsonResponse({
                    'success': False,
                    'error': f'Error reading document: {str(e)}'
                }, status=400)
        else:
            # Handle JSON data
            try:
                data = json.loads(request.body)
            except json.JSONDecodeError:
                return JsonResponse({
                    'success': False,
                    'error': 'Invalid JSON data in request'
                }, status=400)
            
            document_content = data.get('document_content', '')
            question = data.get('question', '')
        
        if not document_content and not question:
            return JsonResponse({
                'success': False,
                'error': 'Either document content or question is required'
            }, status=400)
        
        # Prepare the prompt for document analysis
        if question:
            prompt = f"""Analyze the following document and answer this specific question: {question}

Document content: {document_content[:2000]}...

Please provide a detailed analysis focusing on the question asked."""
        else:
            prompt = f"""Analyze the following legal document and provide insights on:
1. Key terms and conditions
2. Potential legal risks or issues
3. Compliance with standard legal practices
4. Suggestions for improvements

Document content: {document_content[:2000]}..."""
        
        # Connect to the DeepSeek API
        try:
            headers = {
                'Authorization': f'Bearer {deepseek_api_key}',
                'Content-Type': 'application/json'
            }
            
            # Create the payload for the DeepSeek API
            payload = {
                'model': 'deepseek-chat',
                'messages': [
                    {
                        'role': 'system',
                        'content': 'You are a legal document analysis assistant that provides professional insights on legal documents.'
                    },
                    {
                        'role': 'user',
                        'content': prompt
                    }
                ],
                'temperature': 0.3,
                'max_tokens': 2000
            }
            
            # Make the request to the DeepSeek API
            response = requests.post(
                'https://api.deepseek.com/chat/completions',
                headers=headers,
                json=payload,
                timeout=30
            )
            
            # Check if the response is valid
            if response.status_code != 200:
                try:
                    error_data = response.json()
                    error_message = error_data.get('error', {}).get('message', 'Unknown error')
                except:
                    error_message = f'HTTP {response.status_code}: {response.text}'
                
                return JsonResponse({
                    'success': False,
                    'error': f'DeepSeek API error: {error_message}'
                }, status=500)
            
            # Parse the response from the DeepSeek API
            response_json = response.json()
            
            # Extract the analysis text
            if 'choices' not in response_json or not response_json['choices']:
                return JsonResponse({
                    'success': False,
                    'error': 'Invalid response from DeepSeek API'
                }, status=500)
            
            analysis_text = response_json['choices'][0]['message']['content']
            
            return JsonResponse({
                'success': True,
                'analysis': analysis_text,
                'provider': 'DeepSeek'
            })
            
        except requests.exceptions.Timeout:
            return JsonResponse({
                'success': False,
                'error': 'Request timeout. Please try again.'
            }, status=500)
        except requests.exceptions.RequestException as e:
            return JsonResponse({
                'success': False,
                'error': f'DeepSeek API connection error: {str(e)}'
            }, status=500)
            
    except Exception as e:
        # Handle any other errors
        return JsonResponse({
            'success': False,
            'error': f'Server error: {str(e)}'
        }, status=500)

@csrf_exempt
@require_http_methods(["GET", "POST"])
def legal_document(request, contract_id):
    """
    Endpoint for retrieving and analyzing legal documents for a specific contract
    """
    
    # Get DeepSeek API key from environment variables
    deepseek_api_key = os.getenv('DEEPSEEK_API_KEY')
    if not deepseek_api_key or deepseek_api_key == 'your_deepseek_api_key_here':
        return JsonResponse({
            'success': False,
            'error': 'DeepSeek API key not configured. Please set DEEPSEEK_API_KEY in .env file.'
        }, status=500)
    
    # In a real application, you would fetch the contract from a database
    # For this example, we'll simulate retrieving a contract
    
    # Simulate contract data
    contract_data = {
        'id': contract_id,
        'title': f'Contract #{contract_id}',
        'type': 'Legal Agreement',
        'content': 'This is a simulated contract content for demonstration purposes.'
    }
    
    if request.method == 'GET':
        # Return the contract data
        return JsonResponse({
            'success': True,
            'contract': contract_data
        })
    
    elif request.method == 'POST':
        try:
            # Try to parse the JSON data
            try:
                data = json.loads(request.body)
            except json.JSONDecodeError:
                return JsonResponse({
                    'success': False,
                    'error': 'Invalid JSON data in request'
                }, status=400)
            
            # Get the action to perform
            action = data.get('action', '')
            
            if action == 'analyze':
                # Prepare the prompt for contract analysis
                prompt = f"""Analyze the following legal contract (ID: {contract_id}) and provide insights on:
                1. Key terms and conditions
                2. Potential legal risks or issues
                3. Compliance with standard legal practices
                4. Suggestions for improvements
                
                Contract Content: {contract_data['content']}
                """
                
                # Connect to the DeepSeek API
                try:
                    headers = {
                        'Authorization': f'Bearer {deepseek_api_key}',
                        'Content-Type': 'application/json'
                    }
                    
                    # Create the payload for the DeepSeek API
                    payload = {
                        'model': 'deepseek-chat',
                        'messages': [
                            {
                                'role': 'system',
                                'content': 'You are a legal document analysis assistant that provides professional insights on legal documents.'
                            },
                            {
                                'role': 'user',
                                'content': prompt
                            }
                        ],
                        'temperature': 0.3,
                        'max_tokens': 2000
                    }
                    
                    # Make the request to the DeepSeek API
                    response = requests.post(
                        'https://api.deepseek.com/chat/completions',
                        headers=headers,
                        json=payload,
                        timeout=30
                    )
                    
                    # Check if the response is valid
                    if response.status_code != 200:
                        try:
                            error_data = response.json()
                            error_message = error_data.get('error', {}).get('message', 'Unknown error')
                        except:
                            error_message = f'HTTP {response.status_code}: {response.text}'
                        
                        return JsonResponse({
                            'success': False,
                            'error': f'DeepSeek API error: {error_message}'
                        }, status=500)
                    
                    # Parse the response from the DeepSeek API
                    response_json = response.json()
                    
                    # Extract the analysis text
                    if 'choices' not in response_json or not response_json['choices']:
                        return JsonResponse({
                            'success': False,
                            'error': 'Invalid response from DeepSeek API'
                        }, status=500)
                    
                    analysis_text = response_json['choices'][0]['message']['content']
                    
                    return JsonResponse({
                        'success': True,
                        'contract_id': contract_id,
                        'analysis': analysis_text,
                        'provider': 'DeepSeek'
                    })
                    
                except requests.exceptions.Timeout:
                    return JsonResponse({
                        'success': False,
                        'error': 'Request timeout. Please try again.'
                    }, status=500)
                except requests.exceptions.RequestException as e:
                    return JsonResponse({
                        'success': False,
                        'error': f'DeepSeek API connection error: {str(e)}'
                    }, status=500)
            else:
                return JsonResponse({
                    'success': False,
                    'error': f'Unknown action: {action}'
                }, status=400)
                
        except Exception as e:
            # Handle any other errors
            return JsonResponse({
                'success': False,
                'error': f'Server error: {str(e)}'
            }, status=500)