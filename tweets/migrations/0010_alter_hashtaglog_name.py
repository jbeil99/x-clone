# Generated by Django 5.2 on 2025-04-30 19:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tweets', '0009_hashtaglog'),
    ]

    operations = [
        migrations.AlterField(
            model_name='hashtaglog',
            name='name',
            field=models.CharField(db_index=True, max_length=100),
        ),
    ]
