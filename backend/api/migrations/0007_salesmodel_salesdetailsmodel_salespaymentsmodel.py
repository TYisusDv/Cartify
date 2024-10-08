# Generated by Django 5.1 on 2024-10-08 17:31

import django.db.models.deletion
import django.utils.timezone
import uuid
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0006_paymentmethodsmodel'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='SalesModel',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('total', models.FloatField(default=0)),
                ('type', models.IntegerField(default=1)),
                ('date_reg', models.DateTimeField(default=django.utils.timezone.now)),
                ('client', models.ForeignKey(on_delete=django.db.models.deletion.RESTRICT, related_name='client_sales', to='api.clientsmodel')),
            ],
            options={
                'db_table': 'sales',
            },
        ),
        migrations.CreateModel(
            name='SalesDetailsModel',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('price', models.FloatField(default=0)),
                ('cost', models.FloatField(default=0)),
                ('inventory', models.ForeignKey(on_delete=django.db.models.deletion.RESTRICT, related_name='inventory_sale_details', to='api.inventorymodel')),
                ('sale', models.ForeignKey(on_delete=django.db.models.deletion.RESTRICT, related_name='sale_sale_details', to='api.salesmodel')),
            ],
            options={
                'db_table': 'sale_details',
            },
        ),
        migrations.CreateModel(
            name='SalesPaymentsModel',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('no', models.IntegerField(blank=True, null=True, unique=True)),
                ('subtotal', models.FloatField(default=0)),
                ('commission', models.FloatField(default=0)),
                ('discount_per', models.FloatField(default=0)),
                ('discount', models.FloatField(default=0)),
                ('total', models.FloatField(default=0)),
                ('pay', models.FloatField(default=0)),
                ('change', models.FloatField(default=0)),
                ('note', models.CharField(max_length=100, null=True)),
                ('date_reg', models.DateTimeField(default=django.utils.timezone.now)),
                ('location', models.ForeignKey(on_delete=django.db.models.deletion.RESTRICT, related_name='location_sales_payments', to='api.locationsmodel')),
                ('payment_method', models.ForeignKey(on_delete=django.db.models.deletion.RESTRICT, related_name='payment_method_sales_payments', to='api.paymentmethodsmodel')),
                ('sale', models.ForeignKey(on_delete=django.db.models.deletion.RESTRICT, related_name='sale_sales_payments', to='api.salesmodel')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.RESTRICT, related_name='user_sales_payments', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'sales_payments',
            },
        ),
    ]