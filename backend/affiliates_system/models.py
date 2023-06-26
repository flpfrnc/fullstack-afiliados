from django.db import models


class TransactionType(models.Model):
    type_id = models.IntegerField(primary_key=True)
    description = models.CharField(max_length=50)
    nature = models.CharField(max_length=50)
    sign = models.CharField(max_length=1)

    def __str__(self):
        return self.description

    class Meta:
        db_table = "tb_transaction_type"


class TransactionData(models.Model):
    transaction_type = models.ForeignKey(
        'TransactionType',
        related_name='transaction',
        on_delete=models.CASCADE,
    )
    date = models.DateTimeField(null=True, name="date")
    product = models.CharField(max_length=50, null=True, name="product")
    value = models.DecimalField(
        decimal_places=2, max_digits=10, null=True, name="value")
    seller = models.CharField(max_length=50, null=True, name="seller")
    created_ad = models.DateTimeField(auto_now_add=True, name="created_at")
    updated_at = models.DateTimeField(auto_now=True, name="updated_at")

    def __str__(self):
        return self.product

    class Meta:
        db_table = "tb_transaction_data"
