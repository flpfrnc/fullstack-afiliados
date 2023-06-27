from rest_framework.exceptions import APIException


class IncorretCredentials(APIException):
    status_code = 403
    default_detail = 'Credenciais incorretas'

class TransactionDataNotFound(APIException):
    status_code = 404
    default_detail = 'Transação não encontrada'

class TransactionTypeNotFound(APIException):
    status_code = 404
    default_detail = 'Tipo de transação não encontrado'

class UniqueUserException(APIException):
    status_code = 400
    default_detail = 'Nome de usuário deve ser único'
