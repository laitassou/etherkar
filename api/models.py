from django.db import models
from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver

from rest_framework.authtoken.models import Token
from django.contrib.auth.models import AbstractUser

from django.core.validators import RegexValidator

from django.contrib.postgres.fields import ArrayField

from django.contrib.postgres.fields import JSONField

@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)



class User(AbstractUser):
    date_of_birth = models.DateField(null=True)
    city = models.CharField(max_length=64, blank=True)

    phone_number = models.CharField(max_length=17, blank=True, validators=[
        RegexValidator(regex=r'^\+?1?\d{9,15}$',
                       message="Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed.")],
                                    )
    phone_verified = models.BooleanField(default=False)


class Car(models.Model):
    brand = models.CharField(max_length=64)
    model = models.CharField(max_length=64)
    year = models.IntegerField()
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        default = 0
    )
    #user = models.ForeignKey(User,on_delete=models.CASCADE,unique=True)
    color = models.CharField(max_length=64)
    vehicule_type = models.CharField(max_length=64)
    datecreation      = models.DateTimeField(auto_now=True)



class Travel(models.Model):
    #car = models.ForeignKey(Car,on_delete=models.CASCADE,unique=True)

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        default=1
    )
    #user = models.ForeignKey(User,on_delete=models.CASCADE,unique=True)
    departurecity     = models.CharField(max_length=64)
    intermediatecities= models.TextField ()
    arrivalcity       = models.CharField(max_length=64)
    date              = models.DateTimeField()
    numberofplaces    = models.IntegerField()
    reservedplaces    = models.IntegerField()
    price             = JSONField() #ArrayField(models.IntegerField(),default=list)
    fundRequested     = models.BooleanField(default=False)
    inBlockchain      = models.BooleanField(default=False)    
    description       = models.TextField()
    datecreation      = models.DateTimeField(auto_now=True)
    address           = models.CharField(max_length=42)

    

class Reservation(models.Model):
    travel = models.ForeignKey(
        Travel,
        on_delete=models.CASCADE,
        default = 0
    )
    #travel = models.ForeignKey(Travel,on_delete=models.CASCADE,unique=True)
    user = models.ForeignKey(
        User,
        related_name="reserver_id",
        on_delete=models.CASCADE,
        default = 0,
    )
    #user = models.ForeignKey(User,on_delete=models.CASCADE,unique=True)
    reservedplaces  = models.IntegerField()
    code = models.CharField(max_length=4, null = True)
    datecreation      = models.DateTimeField(auto_now=True)
    address           = models.CharField(max_length=42)
    iddepart  = models.IntegerField()    

    idarrivee  = models.IntegerField()


    def __unicode__(self):
        return '%d: %s' % (self.user, self.reservedplaces)



class UserExtension(models.Model):
    user = models.OneToOneField(User,on_delete=models.CASCADE)
    phone_regex = RegexValidator(regex=r'^\+?1?\d{9,15}$', message="Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed.")
    phone_number = models.CharField(validators=[phone_regex], max_length=17, blank=True) # validators should be a list
    phone_verified = models.BooleanField(default=False)


   


class Messages (models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        default = 0,
    )
    travel = models.ForeignKey(
        Travel,
        on_delete=models.CASCADE,
        default = 0
    )
    description    = models.TextField(max_length = 400)
    datecreation   = models.DateTimeField(auto_now=True)    

   

class AdminStats (models.Model):
    travel = models.ForeignKey(
        Travel,
        on_delete=models.CASCADE,
        default = 0
    )
    diffprice = models.IntegerField()