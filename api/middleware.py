import re

from django.conf import settings
from django.core import urlresolvers
from django.http import HttpResponse, HttpResponseRedirect,HttpResponsePermanentRedirect


class RequestSSLMiddleware(object):
    def process_request(self, request):
        if not any((DEBUG, request.is_secure(), request.META.get('HTTP_X_FORWARDED_PROTO', '') == 'https')):
            url = request.build_absolute_uri(request.get_full_path())
            secure_url = url.replace('http://', 'https://')
            return HttpResponsePermanentRedirect(secure_url)

class ResponseSSLMiddleware(object):
    def process_response(self, request, response):
        if not DEBUG:
            if 'Location' in response:
                if response['Location'][0] == '/':
                    response['Location'] = 'https://' + get_current_site(request).domain + response['Location']
        return response