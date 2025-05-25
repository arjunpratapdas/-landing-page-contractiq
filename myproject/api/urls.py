from django.urls import path
from . import views

urlpatterns = [
    path('generate-contract/', views.generate_contract, name='generate_contract'),
    path('analyze-document/', views.analyze_document, name='analyze_document'),
    path('contracts/<int:contract_id>/legal_documents/', views.legal_document, name='legal_document'),
] 