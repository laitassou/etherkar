#from django.contrib.auth.models import User
from django.contrib.auth import get_user_model

from rest_framework import serializers, validators
from rest_framework.fields import CurrentUserDefault

from .models import Car
from .models import Travel
from .models import Reservation

from django.db.models import F

from math import pow

from rest_framework.fields import ListField

import string, random, json



def random_generator(size = 4, chars = string.ascii_uppercase + string.digits):
    return ''.join(random.choice(chars) for x in range(size))



User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'first_name', 'last_name', 'city', 'date_of_birth', 'phone_number')


class UserCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'email', 'first_name', 'last_name', 'password', 'city', 'date_of_birth', 'phone_number')

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user


""""
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id','username',)


class UserCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'email', 'first_name', 'last_name', 'password',)

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user
"""""

class CarSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True, default=serializers.CurrentUserDefault())

    class Meta:
        model = Car
        fields = ('brand', 'model', 'year', 'color', 'vehicule_type','user')

    def create(self, validated_data):
        user = self.context['request'].user
        #carexist = Car.objects.filter(user=self.request.user)
        car = Car(**validated_data)
        car.owner = user
        car.save()
        return car



class StringArrayField(ListField):
    """
    String representation of an array field.
    """
    def to_representation(self, obj):
        obj = super().to_representation( obj)
        # convert list to string
        return ",".join([(element) for element in obj])

    def to_internal_value(self, data):

        return super().to_internal_value( data)



class TravelSerializer(serializers.ModelSerializer):
    #resevations = serializers.StringRelatedField(many=True)
    # Create a custom method field
 
    user = serializers.PrimaryKeyRelatedField(read_only=True, default=serializers.CurrentUserDefault())
    ##user = UserSerializer()
    #price = StringArrayField()
    #price = serializers.ListField( child=serializers.IntegerField(min_value=0)  )

    class Meta:
        model = Travel
        fields = ('id', 'departurecity', 'intermediatecities', 'arrivalcity','date','numberofplaces','reservedplaces','price','fundRequested','inBlockchain','description','datecreation','user')


class TravelDetailedSerializer(serializers.ModelSerializer):
    #resevations = serializers.StringRelatedField(many=True)
    # Create a custom method field
    user = UserSerializer()
    ###user = serializers.PrimaryKeyRelatedField(read_only=True, default=serializers.CurrentUserDefault())
    #price = StringArrayField()
    #price = serializers.ListField( child=serializers.IntegerField(min_value=0)  )

    class Meta:
        model = Travel
        fields = ('id', 'departurecity', 'intermediatecities', 'arrivalcity','date','numberofplaces','reservedplaces','price','description','datecreation','user')



class TravelBasePageSerializer(serializers.ModelSerializer):
    #resevations = serializers.StringRelatedField(many=True)
    # Create a custom method field

    ###user = serializers.PrimaryKeyRelatedField(read_only=True, default=serializers.CurrentUserDefault())
    #price = StringArrayField()
    #price = serializers.ListField( child=serializers.IntegerField(min_value=0)  )

    class Meta:
        model = Travel
        fields = ('id', 'departurecity', 'intermediatecities', 'arrivalcity','date','numberofplaces','reservedplaces','price','description','datecreation')




class ReservationSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True, default=serializers.CurrentUserDefault())
    #user = UserSerializer()
    #travel = TravelSerializer()

    #iddepart = serializers.SerializerMethodField('iddepart')
    #idarrivee = serializers.SerializerMethodField('idarrivee')

    def create(self, validated_data):
        #code=  random_generator()        
        ##code = random_generator()
       
        reservation = Reservation(**validated_data)
        reservation.code = random_generator() 
        reservation.save()
        
        iddepart =  validated_data['iddepart']
        idarrivee = validated_data['idarrivee']
        reservedplaces = validated_data['reservedplaces'] 
        resplace = 0
        for i in range (iddepart, idarrivee):
            resplace += (reservedplaces * pow(10,i))
        
        travel_object = Travel.objects.get(pk=reservation.travel_id)    
        travel_object.reservedplaces = F('reservedplaces') +resplace
        travel_object.save()
        #return Reservation.objects.create(code=code, **validated_data)
        return reservation

    class Meta:
        model = Reservation
        fields = ('id','reservedplaces','code','datecreation','address','travel','user','iddepart','idarrivee')
        #fields = ('reservedplaces','code', 'travel','user')


        def create(self, validated_data):
            travel_id = validated_data.pop('travel_id')
            travel_object = Travel.objects.get(pk=travel_id)    
            return travel_object

class ReservationDetailedSerializer(serializers.ModelSerializer):
    #user = serializers.PrimaryKeyRelatedField(read_only=True, default=serializers.CurrentUserDefault())
    user = UserSerializer()
    travel = TravelDetailedSerializer()

    class Meta:
        model = Reservation
        fields = ('id','reservedplaces','code', 'address','datecreation','iddepart','idarrivee','travel','user')


class ReservationBasicSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True, default=serializers.CurrentUserDefault())
    #user = UserSerializer()
    #travel = TravelSerializer()
    """
    code = serializers.SerializerMethodField()

    def get_code(self, obj):
       return random_generator()   
    def set_code(self, obj):
        obj.code = random_generator() 
    """  
    class Meta:
        model = Reservation
        fields = ('__all__')


class ReservationCancelSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True, default=serializers.CurrentUserDefault())
    #user = UserSerializer()
    #travel = TravelSerializer()
    """
    code = serializers.SerializerMethodField()

    def get_code(self, obj):
       return random_generator()   
    def set_code(self, obj):
        obj.code = random_generator() 
    """  

    def update(self, instance, validated_data):
        #instance.reservedplaces = 0
        #instance.save()
        return instance

    class Meta:
        model = Reservation
        fields = ('__all__')
        
        #fields = ('reservedplaces','code', 'travel','user')
        def update(self, validated_data):
            travel_id = validated_data.pop('travel')
            id = validated_data.pop('resid')
            reservation = Reservation.objects.get(pk=reservation_id) 
            reservation.reservedplaces = F('reservedplaces') - 1
            reservation.save()
        


class ReservationCSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True, default=serializers.CurrentUserDefault())
    class Meta:
        model = Reservation
        fields = ('__all__')

