# Generated by Django 4.2.1 on 2023-05-27 16:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ABS', '0012_fillier_nom_comlaite'),
    ]

    operations = [
        migrations.AddField(
            model_name='etudiant',
            name='image',
            field=models.ImageField(blank=True, upload_to='images'),
        ),
    ]
