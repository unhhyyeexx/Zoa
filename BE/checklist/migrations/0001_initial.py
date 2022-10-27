# Generated by Django 3.2.16 on 2022-10-27 13:05

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Checklist',
            fields=[
                ('id', models.BigAutoField(primary_key=True, serialize=False)),
                ('Text', models.CharField(max_length=20, verbose_name='체크리스트 내용')),
                ('status', models.BooleanField(default=False, verbose_name='완료 여부')),
                ('photo', models.ImageField(blank=True, default='checklist/photo/photo_default1.png', null=True, upload_to='checklist/photo/', verbose_name='체크리스트 사진')),
                ('created_at', models.DateField(auto_now_add=True)),
                ('from_user_id', models.ForeignKey(db_column='from_user_id', on_delete=django.db.models.deletion.CASCADE, related_name='fromUser', to=settings.AUTH_USER_MODEL)),
                ('to_user_id', models.ForeignKey(db_column='to_user_id', on_delete=django.db.models.deletion.CASCADE, related_name='toUser', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
