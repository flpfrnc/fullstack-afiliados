from rest_framework.urlpatterns import format_suffix_patterns
from django.urls import path
from .views import StatusView, SignInView, SignOutView, RegisterUserView, GetTransactionsView, SingleTransactionView, LoadTransactionsView


urlpatterns = [
    path('', StatusView.as_view(), name="status"),
    path('api/', StatusView.as_view(), name="status"),
    path('api/auth', SignInView.as_view(), name="login"),
    path('api/logout', SignOutView.as_view(), name="logout"),
    path('api/register', RegisterUserView.as_view(), name="register"),
    path('api/add-data', LoadTransactionsView.as_view(), name="add-transactions"),
    path('api/read-data', GetTransactionsView.as_view(), name="status"),
    path('api/read-data/<int:id>',
         SingleTransactionView.as_view(), name="status"),
]

urlpatterns = format_suffix_patterns(urlpatterns, allowed=['json', 'html'])
