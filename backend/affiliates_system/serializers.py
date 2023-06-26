from rest_framework import serializers
from .models import TransactionData, TransactionType
from django.contrib.auth.models import User


class TransactionTypeSerializer(serializers.ModelSerializer):

    class Meta:
        model = TransactionType
        fields = '__all__'


class TransactionDataSerializer(serializers.ModelSerializer):

    class Meta:
        model = TransactionData
        fields = '__all__'

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['transaction_type'] = TransactionTypeSerializer(
            instance.transaction_type).data
        return representation


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ['username', 'password']


class SigninSerializer(serializers.Serializer):

    username = serializers.CharField()
    password = serializers.CharField()
