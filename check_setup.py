#!/usr/bin/env python
"""
Pre-run check script to verify the Django and frontend configurations
before running the application.
"""

import os
import sys
import subprocess
import json
import importlib.util
from pathlib import Path

# Colors for terminal output
COLORS = {
    'GREEN': '\033[92m',
    'YELLOW': '\033[93m',
    'RED': '\033[91m',
    'RESET': '\033[0m',
    'BOLD': '\033[1m'
}

def print_colored(text, color):
    """Print colored text to the terminal."""
    print(f"{COLORS[color]}{text}{COLORS['RESET']}")

def check_package_installed(package_name):
    """Check if a Python package is installed."""
    spec = importlib.util.find_spec(package_name)
    return spec is not None

def check_django_settings():
    """Check Django settings for common issues."""
    print_colored("\nChecking Django settings...", "BOLD")
    
    # Check if Django is installed
    if not check_package_installed('django'):
        print_colored("❌ Django is not installed. Please run 'pip install -r requirements.txt'.", "RED")
        return False
    
    # Check if django-cors-headers is installed
    if not check_package_installed('corsheaders'):
        print_colored("❌ django-cors-headers is not installed. Please run 'pip install -r requirements.txt'.", "RED")
        return False
    
    # Check if requests is installed
    if not check_package_installed('requests'):
        print_colored("❌ requests is not installed. Please run 'pip install -r requirements.txt'.", "RED")
        return False
    
    # Check Django settings file
    settings_path = Path('myproject/myproject/settings.py')
    if not settings_path.exists():
        print_colored(f"❌ Django settings file not found at {settings_path}", "RED")
        return False
    
    with open(settings_path, 'r') as f:
        settings_content = f.read()
    
    # Check for CORS settings
    if 'corsheaders' not in settings_content:
        print_colored("❌ 'corsheaders' not found in INSTALLED_APPS", "RED")
        return False
    
    if 'corsheaders.middleware.CorsMiddleware' not in settings_content:
        print_colored("❌ 'corsheaders.middleware.CorsMiddleware' not found in MIDDLEWARE", "RED")
        return False
    
    if 'CORS_ALLOW_ALL_ORIGINS' not in settings_content:
        print_colored("❌ CORS_ALLOW_ALL_ORIGINS setting not found", "YELLOW")
    
    print_colored("✅ Django settings look good!", "GREEN")
    return True

def check_api_urls():
    """Check API URLs configuration."""
    print_colored("\nChecking API URLs...", "BOLD")
    
    # Check main urls.py
    main_urls_path = Path('myproject/myproject/urls.py')
    if not main_urls_path.exists():
        print_colored(f"❌ Main URLs file not found at {main_urls_path}", "RED")
        return False
    
    with open(main_urls_path, 'r') as f:
        main_urls_content = f.read()
    
    if "path('api/', include('api.urls'))" not in main_urls_content:
        print_colored("❌ API URLs not included in main URLs file", "RED")
        return False
    
    # Check API urls.py
    api_urls_path = Path('myproject/api/urls.py')
    if not api_urls_path.exists():
        print_colored(f"❌ API URLs file not found at {api_urls_path}", "RED")
        return False
    
    with open(api_urls_path, 'r') as f:
        api_urls_content = f.read()
    
    if "path('generate-contract/" not in api_urls_content:
        print_colored("❌ 'generate-contract' endpoint not found in API URLs", "RED")
        return False
    
    print_colored("✅ API URLs look good!", "GREEN")
    return True

def check_vite_config():
    """Check Vite configuration for API proxy."""
    print_colored("\nChecking Vite configuration...", "BOLD")
    
    vite_config_path = Path('vite.config.ts')
    if not vite_config_path.exists():
        print_colored(f"❌ Vite config file not found at {vite_config_path}", "RED")
        return False
    
    with open(vite_config_path, 'r') as f:
        vite_config_content = f.read()
    
    if "proxy: {" not in vite_config_content or "'/api'" not in vite_config_content:
        print_colored("❌ API proxy configuration not found in Vite config", "RED")
        return False
    
    print_colored("✅ Vite configuration looks good!", "GREEN")
    return True

def check_frontend_api_calls():
    """Check frontend API calls in Tools.tsx."""
    print_colored("\nChecking frontend API calls...", "BOLD")
    
    tools_path = Path('src/components/Tools.tsx')
    if not tools_path.exists():
        print_colored(f"❌ Tools component not found at {tools_path}", "RED")
        return False
    
    with open(tools_path, 'r') as f:
        tools_content = f.read()
    
    if "fetch('/api/generate-contract/" not in tools_content:
        print_colored("❌ API call to generate-contract not found in Tools.tsx", "RED")
        return False
    
    if "toast.error(" not in tools_content:
        print_colored("⚠️ Error handling with toast notifications might be missing", "YELLOW")
    
    print_colored("✅ Frontend API calls look good!", "GREEN")
    return True

def check_package_json():
    """Check package.json for required dependencies."""
    print_colored("\nChecking package.json...", "BOLD")
    
    package_json_path = Path('package.json')
    if not package_json_path.exists():
        print_colored(f"❌ package.json not found at {package_json_path}", "RED")
        return False
    
    with open(package_json_path, 'r') as f:
        try:
            package_json = json.load(f)
        except json.JSONDecodeError:
            print_colored("❌ package.json is not valid JSON", "RED")
            return False
    
    dependencies = package_json.get('dependencies', {})
    
    required_deps = [
        '@radix-ui/react-select',
        'framer-motion',
        'sonner',  # For toast notifications
    ]
    
    missing_deps = [dep for dep in required_deps if dep not in dependencies]
    
    if missing_deps:
        print_colored(f"❌ Missing dependencies: {', '.join(missing_deps)}", "RED")
        return False
    
    print_colored("✅ package.json looks good!", "GREEN")
    return True

def main():
    """Run all checks and provide a summary."""
    print_colored("\n=== Pre-run Check for UI Glowup Saga ===\n", "BOLD")
    
    checks = [
        ("Django Settings", check_django_settings),
        ("API URLs", check_api_urls),
        ("Vite Configuration", check_vite_config),
        ("Frontend API Calls", check_frontend_api_calls),
        ("Package JSON", check_package_json),
    ]
    
    results = []
    for name, check_func in checks:
        results.append((name, check_func()))
    
    print_colored("\n=== Summary ===\n", "BOLD")
    all_passed = True
    for name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        color = "GREEN" if result else "RED"
        print_colored(f"{status} - {name}", color)
        if not result:
            all_passed = False
    
    if all_passed:
        print_colored("\n✅ All checks passed! You can run the application now.", "GREEN")
        print_colored("\nTo start the Django server, run:", "BOLD")
        print("  cd myproject")
        print("  python manage.py runserver")
        print_colored("\nTo start the frontend, run:", "BOLD")
        print("  npm run dev")
        return 0
    else:
        print_colored("\n❌ Some checks failed. Please fix the issues before running the application.", "RED")
        return 1

if __name__ == "__main__":
    sys.exit(main())