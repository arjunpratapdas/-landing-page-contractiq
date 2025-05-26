from django.http import HttpResponse

def home_view(request):
    return HttpResponse("Backend is active. Frontend should be served separately.", status=200)
