from rest_framework.exceptions import APIException


class IncorretCredentials(APIException):
    status_code = 403
    default_detail = 'Credenciais incorretas'
