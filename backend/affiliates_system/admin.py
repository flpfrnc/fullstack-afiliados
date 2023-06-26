from django.contrib import admin
from .models import TransactionData, TransactionType

admin.site.register(TransactionType)
admin.site.register(TransactionData)
