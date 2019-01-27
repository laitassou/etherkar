import string, random

#from django.contrib.auth.models import User

from rest_framework import viewsets, response, permissions, mixins
from rest_framework import generics
from rest_framework.response import Response

from django.views.generic import UpdateView
from django.views.generic import DetailView


from django.views.generic.detail import SingleObjectTemplateResponseMixin
from django.views.generic.edit import ModelFormMixin, ProcessFormView

from rest_framework.permissions import AllowAny    


from django.db.models import Q


from math import pow

from .serializers import UserSerializer
from .serializers import UserCreateSerializer
from .serializers import CarSerializer
from .serializers import TravelSerializer
from .serializers import ReservationSerializer
from .serializers import ReservationDetailedSerializer
from .serializers import ReservationCancelSerializer
from .serializers import ReservationCSerializer
from .serializers import TravelDetailedSerializer
from .serializers import TravelBasePageSerializer

from .models import Car
from .models import Travel
from .models import Reservation

from .models import User

from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger




import logging

logger = logging.getLogger(__name__)


import datetime
from datetime import date

def random_generator(size = 4, chars = string.ascii_uppercase + string.digits):
    return ''.join(random.choice(chars) for x in range(size))

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def retrieve(self, request, pk=None):
        if pk == 'i':
            return response.Response(UserSerializer(request.user,
                                                    context={'request': request}).data)
        return super(UserViewSet, self).retrieve(request, pk)


class UserCreateApiView(generics.CreateAPIView):
    model = User
    serializer_class = UserCreateSerializer


class CarViewSet(mixins.RetrieveModelMixin,
                 mixins.ListModelMixin,
                 mixins.DestroyModelMixin,
                 mixins.CreateModelMixin,
                 viewsets.GenericViewSet):
    queryset = Car.objects.all()
    
    serializer_class = CarSerializer
    permission_classes = (permissions.IsAuthenticated,)

class TravelViewSet(mixins.RetrieveModelMixin,
                 mixins.ListModelMixin,
                 mixins.DestroyModelMixin,
                 mixins.CreateModelMixin,
                 viewsets.GenericViewSet):
    serializer_class = TravelSerializer
    permission_classes = (permissions.IsAuthenticated,)
    queryset = Travel.objects.all()
    def delete(self, request):
        # delete an object and send a confirmation response
        Travel.objects.get(pk=request.DELETE['pk']).delete()
        return 



class TravelViewListSet(mixins.RetrieveModelMixin,
                 mixins.ListModelMixin,
                 mixins.DestroyModelMixin,
                 mixins.CreateModelMixin,
                 viewsets.GenericViewSet):

    serializer_class = TravelDetailedSerializer
    permission_classes = (permissions.IsAuthenticated,)
    ## allow permission if  even user is not logged in 
    #permission_classes = (permissions.IsAuthenticatedOrReadOnly,)    
    paginate_by = 3


    def get_queryset(self):
        date_yyyymmdd = self.request.GET.get('date') 
        depart = self.request.GET.get('depart')
        arrivee = self.request.GET.get('arrivee')   

        return Travel.objects.filter(inBlockchain=True).filter( Q(departurecity__icontains=depart) | Q(intermediatecities__icontains=depart) ,Q(arrivalcity__icontains=arrivee) | Q(intermediatecities__icontains=arrivee)).filter(date__gte=date_yyyymmdd).order_by('date')
        
        #.filter(arrivalcity_containts  arrivee) # Q(valid_until__gte=today)              
        #qs = super(MyClassBasedView, self).get_queryset()
        #return qs.order_by(order_by)

"""
    def retrieve(self, request, pk=None):
        if pk == 'i':
            return response.Response(TravelSerializer(request.user,context={'request': request}).data)
        return super(TravelViewListSet, self).retrieve(request, pk)
"""



class TravelViewById(mixins.RetrieveModelMixin,
                 mixins.ListModelMixin,
                 mixins.DestroyModelMixin,
                 mixins.CreateModelMixin,
                 viewsets.GenericViewSet):

    serializer_class = TravelDetailedSerializer
    permission_classes = (permissions.IsAuthenticated,)
    ## allow permission if  even user is not logged in 
    #permission_classes = (permissions.IsAuthenticatedOrReadOnly,)    
    paginate_by = 3


    def get_queryset(self):
        get_id = self.request.GET.get('id') 

        return Travel.objects.filter(id=get_id).filter(user=self.request.user)
        
        #.filter(arrivalcity_containts  arrivee) # Q(valid_until__gte=today)              
        #qs = super(MyClassBasedView, self).get_queryset()
        #return qs.order_by(order_by)


class TravelViewLastTravels(mixins.RetrieveModelMixin,
                 mixins.ListModelMixin,
                 mixins.DestroyModelMixin,
                 mixins.CreateModelMixin,
                 viewsets.GenericViewSet):

    serializer_class = TravelBasePageSerializer
    #permission_classes = (permissions.IsAuthenticated,)
    ## allow permission if  even user is not logged in 
    permission_classes = (permissions.AllowAny,)  


    def get_queryset(self):

        return Travel.objects.all().order_by('-date')[:5]
        


class TravelViewListUserSet(mixins.RetrieveModelMixin,
                 mixins.ListModelMixin,
                 mixins.DestroyModelMixin,
                 mixins.CreateModelMixin,
                 viewsets.GenericViewSet):
    #queryset = Travel.objects.all()
    serializer_class = TravelSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return Travel.objects.filter(user=self.request.user)


class TravelViewReserveSet(mixins.RetrieveModelMixin,
                 mixins.ListModelMixin,
                 mixins.DestroyModelMixin,
                 mixins.CreateModelMixin,
                 viewsets.GenericViewSet):

    serializer_class = ReservationSerializer
    permission_classes = (permissions.IsAuthenticated,)
    
    Model = Travel


        #resource_name = 'id'
    """
    def form_valid(self, form):
        object = form.save(commit=False)
        #object.code = random_generator()
        object.save()
        return super(TravelViewReserveSet, self).form_valid(form)  
    """


class ReservationListUserView(mixins.RetrieveModelMixin,
                 mixins.ListModelMixin,
                 mixins.DestroyModelMixin,
                 mixins.CreateModelMixin,
                 viewsets.GenericViewSet):
    #queryset = Travel.objects.all()
    serializer_class = ReservationDetailedSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return Reservation.objects.filter(user=self.request.user)


class ReservationCodeView(mixins.RetrieveModelMixin,
                 mixins.ListModelMixin,
                 mixins.DestroyModelMixin,
                 mixins.CreateModelMixin,
                 viewsets.GenericViewSet):
    #queryset = Reservation.objects.all()
    serializer_class = ReservationSerializer
    permission_classes = (permissions.IsAuthenticated,)


    def get_queryset(self):
        return Reservation.objects.filter( code =self.request.query_params.get('code') )    


"""
class ReservationCancelView(mixins.RetrieveModelMixin,                
                 mixins.DestroyModelMixin,
                 mixins.CreateModelMixin,
                 mixins.UpdateModelMixin,
                 viewsets.GenericViewSet):
    #queryset = Reservation.objects.all()
    #model = Reservation
    serializer_class = ReservationCancelSerializer
    permission_classes = (permissions.IsAuthenticated,)    

   
    def get_queryset(self):
        resid = self.request.POST.get('reservation')  
        Res= Reservation.objects.get(id=resid)
        Res.update(reservedplaces =F('reservedplaces ') - 1)

        return 
        #resource_name = 'id'
    def form_valid(self, form):
        #object = form.save(commit=False)
        #object.code = random_generator()
        #object.save()
        return super(ReservationCancelView, self).form_valid(form)  
"""

class TravelCreateApiView(generics.CreateAPIView):
    model = Travel
    serializer_class = TravelSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def form_valid(self, form):
        object = form.save(commit=False)
        object.owner = self.request.user
        object.save()
        return super(TravelCreateApiView, self).form_valid(form)    


class ReservationCancelView(mixins.RetrieveModelMixin,
                            mixins.ListModelMixin, mixins.DestroyModelMixin, mixins.CreateModelMixin,
                            mixins.UpdateModelMixin, viewsets.GenericViewSet):
    serializer_class = ReservationCSerializer
    permission_classes = (permissions.IsAuthenticated,)    
    queryset = Reservation.objects.all()

    def update(self, request, *args, **kwargs):
        # This retrieves the model instance by the pk in the url
        reservation = self.get_object()
        # request.data is a dictionary containing your data.
        # We copy it because you wanted to change 'reservedplaces' but it is immutable, and copying it makes it mutable
        data = request.data.copy()
        # This edits 'reservedplaces' before we initializes the serializer
        data['reservedplaces'] = int(data['reservedplaces'] ) -1
        # This initializes the serializer
        iddepart =  int(data['iddepart'])
        idarrivee = int(data['idarrivee'])
        reservedplaces = int(data['reservedplaces'] )
        resplace = 0
        for i in range (iddepart, idarrivee):
            resplace += ( pow(10,i))

        serializer = self.get_serializer(reservation, data=data)
        # Always validate the data
        serializer.is_valid(raise_exception=True)
        # perform_update() will save the data to the database
        self.perform_update(serializer)

        travel_object = Travel.objects.get(pk=data['travel_id'])    
        travel_object.reservedplaces = travel_object.reservedplaces - resplace
        travel_object.save()

        # Return the JSON Response
        return Response(serializer.data)



class TravelFundRequestView(mixins.RetrieveModelMixin,
                            mixins.ListModelMixin, mixins.DestroyModelMixin, mixins.CreateModelMixin,
                            mixins.UpdateModelMixin, viewsets.GenericViewSet):
    serializer_class = TravelSerializer
    permission_classes = (permissions.IsAuthenticated,)    
    queryset = Travel.objects.all()

    def update(self, request, *args, **kwargs):

        data = request.data.copy()
        travel_object = Travel.objects.get(pk=data['travel_id'])    
        travel_object.fundRequested = True
        travel_object.save()

        # Return the JSON Response
        return Response(data)
  

class TravelInBlockchainView(mixins.RetrieveModelMixin,
                            mixins.ListModelMixin, mixins.DestroyModelMixin, mixins.CreateModelMixin,
                            mixins.UpdateModelMixin, viewsets.GenericViewSet):
    serializer_class = TravelSerializer
    permission_classes = (permissions.IsAuthenticated,)    
    queryset = Travel.objects.all()

    def update(self, request, *args, **kwargs):

        data = request.data.copy()
        travel_object = Travel.objects.get(pk=data['id'])    
        travel_object.inBlockchain = True
        travel_object.save()

        # Return the JSON Response
        return Response(data) 



"""
import sendgrid
from sendgrid.helpers.mail import Email, Content, Substitution, Mail
"""
from django.views.generic.detail import SingleObjectMixin
from django.views import View
from rest_framework.views import APIView
class contactUs(APIView):
    #email = EmailMessage('Subject', 'Body', to=['etherkar.com@domainsbyproxy.com'] )
    #email.send()
    permission_classes = (permissions.AllowAny,)  

    def post(self, request, format = None):
        
        name= request.POST.get("name", "")
        email= request.POST.get("email", "")
        desc= request.POST.get("description", "")
        
        sg = sendgrid.SendGridAPIClient(apikey='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')
        from_email = Email(email)
        to_email = Email('etherkar.com@domainsbyproxy.com')
  
        subject = 'contact: '+name
        content = Content('text/plain', desc)
        mail = Mail(from_email, subject, to_email, content)
        response = sg.client.mail.send.post(request_body=mail.get())
                 
        return Response('ok')
"""        
    def post(self, request, *args, **kwargs):
        form = self.form_class(request.POST)
        if form.is_valid():
            name= request.POST.get("name", "")
            email= request.POST.get("email", "")
            desc= request.POST.get("description", "")

            sg = sendgrid.SendGridClient('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')
            message = sendgrid.Mail()
            message.add_to('etherkar.com@domainsbyproxy.com')
            message.set_from(email)
            message.set_subject(name)
            message.set_html(desc)
            sg.send(message)
            # <process form cleaned data>
            print('test')
"""