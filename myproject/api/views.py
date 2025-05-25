from django.shortcuts import render
from django.http import JsonResponse
import requests
import http.client

# Create your views here.

# Automated Contract Generation using DeepSeek API
# This function handles requests for generating contracts
# and interacts with the DeepSeek API for contract generation

def generate_contract(request):
    import json
    import os
    from datetime import datetime
    import requests
    from dotenv import load_dotenv
    
    # Load environment variables from .env file
    load_dotenv()
    
    # Get DeepSeek API key from environment variables
    deepseek_api_key = os.getenv('DEEPSEEK_API_KEY')
    if not deepseek_api_key or deepseek_api_key == 'your_deepseek_api_key_here':
        return JsonResponse({
            'success': False,
            'error': 'DeepSeek API key not configured. Please set DEEPSEEK_API_KEY in .env file.'
        }, status=500)
    
    # Parse the JSON data from the request
    if request.method == 'POST':
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
            
            # Create a prompt for OpenAI based on the document type and requirements
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
                # DeepSeek API is compatible with OpenAI format
                payload = {
                    'model': 'deepseek-coder-v2-instruct',  # Using DeepSeek's latest model for legal document generation
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
                    json=payload
                )
                
                # Check if the response is valid
                if response.status_code != 200:
                    error_data = response.json()
                    error_message = error_data.get('error', {}).get('message', 'Unknown error')
                    return JsonResponse({
                        'success': False,
                        'error': f'DeepSeek API error: {error_message}'
                    }, status=500)
                
                # Parse the response from the DeepSeek API
                response_json = response.json()
                
                # Extract the generated contract text
                # DeepSeek API follows the same response format as OpenAI
                contract_text = response_json['choices'][0]['message']['content']
                
                # For this implementation, we'll return the contract text directly
                # In a production environment, you might want to convert this to PDF
                
                # Create a temporary URL for the contract text
                # In a real application, you would save this to a database or file storage
                # and generate a proper URL
                
                # For now, we'll simulate a URL by returning the contract text in the response
                return JsonResponse({
                    'success': True,
                    'contract_text': contract_text,
                    'url': f'/api/contracts/{document_type}-{datetime.now().strftime("%Y%m%d%H%M%S")}.txt',
                    'document_type': document_type_label,
                    'provider': 'DeepSeek'  # Add provider information
                })
                
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
    
    # If not a POST request, return an error
    return JsonResponse({
        'success': False,
        'error': 'Only POST requests are supported'
    }, status=405)

# AI Document Analysis using DeepSeek API
# This function handles requests for document analysis
# and interacts with the DeepSeek API for document analysis

def analyze_document(request):
    import json
    import os
    from dotenv import load_dotenv
    
    # Load environment variables from .env file
    load_dotenv()
    
    # Get DeepSeek API key from environment variables
    deepseek_api_key = os.getenv('DEEPSEEK_API_KEY')
    if not deepseek_api_key or deepseek_api_key == 'your_deepseek_api_key_here':
        return JsonResponse({
            'success': False,
            'error': 'DeepSeek API key not configured. Please set DEEPSEEK_API_KEY in .env file.'
        }, status=500)
    
    if request.method == 'POST':
        try:
            # Try to parse the JSON data
            try:
                data = json.loads(request.body)
            except json.JSONDecodeError:
                return JsonResponse({
                    'success': False,
                    'error': 'Invalid JSON data in request'
                }, status=400)
            
            # Get the document content or URL
            document_content = data.get('document_content', '')
            document_url = data.get('document_url', '')
            
            if not document_content and not document_url:
                return JsonResponse({
                    'success': False,
                    'error': 'Either document content or URL is required'
                }, status=400)
            
            # Prepare the prompt for document analysis
            prompt = """Analyze the following legal document and provide insights on:
            1. Key terms and conditions
            2. Potential legal risks or issues
            3. Compliance with standard legal practices
            4. Suggestions for improvements
            
            Document: """
            
            if document_content:
                prompt += document_content
            else:
                prompt += f"Available at URL: {document_url}"
            
            # Connect to the DeepSeek API
            try:
                headers = {
                    'Authorization': f'Bearer {deepseek_api_key}',
                    'Content-Type': 'application/json'
                }
                
                # Create the payload for the DeepSeek API
                payload = {
                    'model': 'deepseek-coder-v2-instruct',
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
                    json=payload
                )
                
                # Check if the response is valid
                if response.status_code != 200:
                    error_data = response.json()
                    error_message = error_data.get('error', {}).get('message', 'Unknown error')
                    return JsonResponse({
                        'success': False,
                        'error': f'DeepSeek API error: {error_message}'
                    }, status=500)
                
                # Parse the response from the DeepSeek API
                response_json = response.json()
                
                # Extract the analysis text
                analysis_text = response_json['choices'][0]['message']['content']
                
                return JsonResponse({
                    'success': True,
                    'analysis': analysis_text,
                    'provider': 'DeepSeek'
                })
                
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
    
    # If not a POST request, return an error
    return JsonResponse({
        'success': False,
        'error': 'Only POST requests are supported'
    }, status=405)

# Endpoint for retrieving and analyzing legal documents for a specific contract

def legal_document(request, contract_id):
    import json
    import os
    from dotenv import load_dotenv
    
    # Load environment variables from .env file
    load_dotenv()
    
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
                        'model': 'deepseek-coder-v2-instruct',
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
                        json=payload
                    )
                    
                    # Check if the response is valid
                    if response.status_code != 200:
                        error_data = response.json()
                        error_message = error_data.get('error', {}).get('message', 'Unknown error')
                        return JsonResponse({
                            'success': False,
                            'error': f'DeepSeek API error: {error_message}'
                        }, status=500)
                    
                    # Parse the response from the DeepSeek API
                    response_json = response.json()
                    
                    # Extract the analysis text
                    analysis_text = response_json['choices'][0]['message']['content']
                    
                    return JsonResponse({
                        'success': True,
                        'contract_id': contract_id,
                        'analysis': analysis_text,
                        'provider': 'DeepSeek'
                    })
                    
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
    
    # If not a GET or POST request, return an error
    return JsonResponse({
        'success': False,
        'error': 'Only GET and POST requests are supported'
    }, status=405)
