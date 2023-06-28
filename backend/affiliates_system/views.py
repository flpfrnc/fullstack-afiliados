from django.db import IntegrityError
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User, AbstractBaseUser
from rest_framework.status import *
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.request import Request
from rest_framework.response import Response
from .exceptions import IncorretCredentials, UserNotFoundException, UniqueUserException, TransactionDataNotFound, TransactionTypeNotFound, ValueParsingException
from .models import TransactionData, TransactionType
from .serializers import TransactionDataSerializer, SigninSerializer, UserSerializer
from datetime import datetime, timedelta
import environ

env = environ.Env()
environ.Env.read_env()

# APIViews were used over function based views or viewsets to keep the implementation simple

class StatusView(APIView):
    """checks either the base endpoint is accessible or not"""

    def get(self, request: Request) -> Response:
        return Response({"status": "online"},  status=HTTP_200_OK)


class RegisterUserView(APIView):
    """basic user registration in order to set up token authentication"""

    def post(self, request: Request) -> Response:
        try:
            user = User(username=request.data['username'])
            user.set_password(request.data['password'])
            user.save()

        except IntegrityError:
            raise UniqueUserException
            

        return Response({"id": user.id, "username": user.username},  status=HTTP_201_CREATED)


class SignInView(APIView):
    """basic authentication / token generation route"""

    def post(self, request: Request) -> Response:
        serializer = SigninSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        username = serializer.data.get('username')
        password = serializer.data.get('password')

        user = User.objects.filter(username=username)

        if not user:
            raise UserNotFoundException

        user_authenticated = authenticate(request, username=username, password=password)

        if not user_authenticated:
            raise IncorretCredentials

        login(request, user_authenticated)

        response = self.generate_access_token(user_authenticated)

        return Response(response, status=HTTP_200_OK)
    
    
    def generate_access_token(self, user: AbstractBaseUser):
        """generates authentication data for a given valid user"""

        refresh_token = RefreshToken.for_user(user)
        serializer = UserSerializer(user)

        return{
            'user': {'username': serializer.data['username']},
            'exp': self.get_jwt_expiration(),
            'token': str(refresh_token.access_token),
            'refresh_token': str(refresh_token),
        }


    def get_jwt_expiration(self):
        jwt_expiration_limit = env('JWT_TOKEN_EXPIRE')
     
        jwt_exp_time = datetime.now() + timedelta(hours=int(jwt_expiration_limit))

        # parsing to int to remove decimals from timestamp
        return int(jwt_exp_time.timestamp())



class SignOutView(APIView):
    """logout route based on builtin session logou function"""
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request: Request):

        logout(request)
        # 200 chosen over 204 for returning a successful logout message
        return Response({'detail': 'Successfully logged out'}, status=HTTP_200_OK)


class GetTransactionsView(APIView):
    """list all transactions"""
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request: Request) -> Response:
        t = TransactionData.objects.all()
        serializer = TransactionDataSerializer(t, many=True)

        return Response({"transactions": serializer.data, "length": len(serializer.data)},  status=HTTP_200_OK)


class SingleTransactionView(APIView):
    """list and edit single transactions route"""
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request: Request, id: int) -> Response:
        transaction = self.get_existent_transaction(id)
        serializer = TransactionDataSerializer(transaction)
        return Response(serializer.data,  status=HTTP_200_OK)
    

    # the following methods are implemented but will not be used in this application
    # i chose not to write tests for them as well

    def put(self, request: Request, id: int) -> Response:
        transaction = self.get_existent_transaction(id)

        serializer = TransactionDataSerializer(transaction, data=request.data)
        if serializer.is_valid():
            serializer.save()

            return Response(serializer.data, status=HTTP_200_OK)
        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)

    def delete(self, request: Request, id: int) -> Response:

        transaction = self.get_existent_transaction(id)
        transaction.delete()
        return Response({"detail": f"transaction {id} deleted"}, status=HTTP_204_NO_CONTENT)

    def get_existent_transaction(self, id: int):
        try:
            transaction = TransactionData.objects.get(pk=id)

        except TransactionData.DoesNotExist:
            raise TransactionDataNotFound

        return transaction


class LoadTransactionsView(APIView):
    """loads transaction data from file upload"""
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def check_data_size(self, date, product, value, seller) -> bool:
            return len(date) == 25 and len(product) == 30 and len(value) == 10 and len(seller) <= 20

    def post(self, request: Request) -> Response:
        file = request.FILES['sales'].open()
        rows = file.readlines()

        transactions = []
        for row in rows:
            if row.decode('utf-8') == "\n":
                continue

            try:
                transaction_type_id = TransactionType.objects.get(
                    type_id=row.decode('utf-8')[0]).type_id

                transactions.append({
                    "transaction_type": transaction_type_id,
                    "date": datetime.strptime(row.decode('utf-8')[1:26], "%Y-%m-%dT%H:%M:%S%z"),
                    "product": row.decode('utf-8')[26:56].strip(),
                    "value": int(row.decode('utf-8')[56:66]),
                    "seller": row.decode('utf-8')[66:86].strip()

                })

            except Exception as e:
                if isinstance(e, ValueError):
                    raise ValueParsingException

                if isinstance(e, ObjectDoesNotExist):
                    raise TransactionTypeNotFound
                
        serializer = TransactionDataSerializer(data=transactions, many=True)
        if serializer.is_valid():
            serializer.save()
            
            return Response(serializer.data, status=HTTP_201_CREATED)

        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)
    
        
               
    