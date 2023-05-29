# Generated by Django 4.2.1 on 2023-05-07 00:02

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('ABS', '0007_seance_alter_professeur_mote_pass_abssence'),
    ]

    operations = [
        migrations.AddField(
            model_name='seance',
            name='enseignement',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='Professeur', to='ABS.enseignement'),
            preserve_default=False,
        ),
    ]