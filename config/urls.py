from django.conf.urls import url, include
from django.views.generic import TemplateView
from django.views.decorators.csrf import csrf_exempt

urlpatterns = [
    url(r'^api/', include('api.urls')),
    url(r'^', csrf_exempt(TemplateView.as_view(template_name='index.html'))),
]