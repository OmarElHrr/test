# Generated by Django 4.2.1 on 2023-05-18 22:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ABS', '0010_etudiant_email_etudiant_mote_pass'),
    ]

    operations = [
        migrations.AddField(
            model_name='etudiant',
            name='numero_telephone',
            field=models.CharField(default=111111111, max_length=15),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='professeur',
            name='numero_telephone',
            field=models.CharField(default=1213131, max_length=15),
            preserve_default=False,
        ),
    ]
