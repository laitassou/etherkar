from django.conf.urls import url
from django.views.decorators.csrf import csrf_exempt

from rest_framework.routers import DefaultRouter
from rest_framework.authtoken.views import obtain_auth_token

from .views import UserViewSet
from .views import UserCreateApiView
from .views import CarViewSet
from .views import TravelViewSet
from .views import TravelViewListSet
from .views import TravelViewReserveSet
from .views import TravelViewListUserSet
from .views import TravelViewLastTravels
from .views import TravelViewById

from .views import ReservationListUserView

from .views import ReservationCodeView
from .views import ReservationCancelView

from .views import TravelFundRequestView
from .views import TravelInBlockchainView


from .views import contactUs



router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'car', CarViewSet)
router.register(r'travels', TravelViewSet,'travel')
router.register(r'travelsearch', TravelViewListSet,'travellist')
router.register(r'travelsearchbyid', TravelViewById,'TravelViewById')
router.register(r'travellistuser', TravelViewListUserSet,'travellist')
router.register(r'travelsearchlasttravels', TravelViewLastTravels,'travellist')


router.register(r'travelreserve', TravelViewReserveSet,'travelreserve')
router.register(r'reservations', ReservationListUserView,'reservations')
router.register(r'reservationscode', ReservationCodeView,'reservations')
router.register(r'cancelreservation', ReservationCancelView,'reservationcancel')

router.register(r'updateRequesttravel', TravelFundRequestView,'TravelFundRequestView')
router.register(r'updateInblockchainRequest', TravelInBlockchainView,'TravelInBlockchainView')



router.register(r'dashboard', TravelFundRequestView,'TravelFundRequestView')

#router.register(r'sendmessage', contactUs,'contactUs')


urlpatterns = router.urls

urlpatterns += [
    url(r'^obtain-auth-token/$', csrf_exempt(obtain_auth_token)),
    url(r'^signup/$', UserCreateApiView.as_view()),
    url(r'^travelreserve/(?P<pk>[0-9]+)/$', TravelViewReserveSet, name='travel-detail'),
    url(r'^sendmessage/', contactUs.as_view(), name='sendmessage'),
    #url(r'^reservations/code/\?code=.*$', ReservationCodeView,'reservations'),

]
