# Generated by Django 5.1 on 2024-10-08 18:00

from django.conf import settings
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0007_salesmodel_salesdetailsmodel_salespaymentsmodel'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.RenameModel(
            old_name='SalesDetailsModel',
            new_name='SaleDetailsModel',
        ),
        migrations.RenameModel(
            old_name='SalesPaymentsModel',
            new_name='SalePaymentsModel',
        ),
    ]
