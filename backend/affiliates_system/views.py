from django.db import IntegrityError
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from rest_framework.status import *
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.request import Request
from rest_framework.response import Response
from .exceptions import IncorretCredentials
from .models import TransactionData, TransactionType
from .serializers import TransactionDataSerializer, SigninSerializer


# APIViews were used over function based views or viewsets to keep the implementation simple

class StatusView(APIView):
    """checks either the base endpoint is accessible or not"""

    def get(self, request: Request) -> Response:
        return Response({"status": "online"},  status=HTTP_200_OK)


class RegisterUserView(APIView):
    """basic user registration in order to set up token authentication"""

    def post(self, request: Request) -> Response:
        try:
            print(request.data)
            user = User(username=request.data['username'])
            user.set_password(request.data['password'])
            user.save()

        except IntegrityError:
            raise Exception(f"Nome de usuário deve ser único")

        return Response({"id": user.id, "username": user.username},  status=HTTP_201_CREATED)


class SignInView(APIView):
    """basic authentication / token generation route"""

    def post(self, request: Request) -> Response:
        serializer = SigninSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        username = serializer.data.get('username')
        password = serializer.data.get('password')

        user = authenticate(request, username=username, password=password)

        if not user:
            raise IncorretCredentials

        login(request, user)

        refresh_token = RefreshToken.for_user(user)

        response = {
            'message': 'Successfully logged in',
            'token': str(refresh_token.access_token),
            'refresh_token': str(refresh_token),
        }
        return Response(response, status=HTTP_200_OK)


class SignOutView(APIView):
    """logout route based on builtin session logou function"""

    def post(self, request: Request):
        logout(request)
        return Response({'message': 'Successfully logged out'}, status=HTTP_200_OK)


class GetTransactionsView(APIView):
    """list all transactions"""

    permission_classes = [IsAuthenticated]

    def get(self, request: Request) -> Response:
        t = TransactionData.objects.all()
        serializer = TransactionDataSerializer(t, many=True)

        return Response({"transactions": serializer.data, "length": len(serializer.data)},  status=HTTP_200_OK)


class SingleTransactionView(APIView):
    """list and edit single transactions route"""

    permission_classes = [IsAuthenticated]

    def get(self, request: Request, id: int) -> Response:
        transaction = self.get_existent_transaction(id)
        serializer = TransactionDataSerializer(transaction)
        return Response(serializer.data,  status=HTTP_200_OK)

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
        return Response({"profiles": f"profile {id} deleted"}, status=HTTP_204_NO_CONTENT)

    def get_existent_transaction(self, id: int):
        try:
            transaction = TransactionData.objects.get(pk=id)

        except TransactionData.DoesNotExist:
            raise ObjectDoesNotExist("Transação não encontrada")

        return transaction


class LoadTransactionsView(APIView):
    """loads transaction data from file upload"""

    permission_classes = [IsAuthenticated]

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
                    "date": row.decode('utf-8')[1:26],
                    "product": row.decode('utf-8')[26:56].strip(),
                    "value": row.decode('utf-8')[56:66],
                    "seller": row.decode('utf-8')[66:86].strip()

                })
            except TransactionType.DoesNotExist:
                raise ObjectDoesNotExist("Tipo de transação não encontrado")

        serializer = TransactionDataSerializer(data=transactions, many=True)
        if serializer.is_valid():
            serializer.save()

            return Response(serializer.data, status=HTTP_201_CREATED)

        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)
