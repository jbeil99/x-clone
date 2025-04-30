import requests
from django.core.files.base import ContentFile
from django.conf import settings
from datetime import timedelta
from django.utils import timezone
from accounts.models import User
from django.utils.text import slugify


def download_image(url, filename):
    response = requests.get(url)
    if response.status_code == 200:
        return ContentFile(response.content, name=filename)
    return None


def build_absolute_url(url):
    if url is not None:
        return settings.BASE_URL + url
    return url


def time_ago(dt):
    now = timezone.now()
    diff = now - dt

    if diff < timedelta(minutes=1):
        return "just now"
    elif diff < timedelta(hours=1):
        minutes = int(diff.total_seconds() // 60)
        return f"{minutes}min"
    elif diff < timedelta(days=1):
        hours = int(diff.total_seconds() // 3600)
        return f"{hours}h"
    elif diff < timedelta(days=30):
        days = diff.days
        return f"{days}d"
    else:
        return dt.strftime("%Y-%m-%d")


def make_username(given_name, user_id):
    if given_name:
        base_username = slugify(given_name)
    else:
        base_username = "user"
    username = base_username
    counter = 1
    while User.objects.filter(username=username).exists():
        username = f"{base_username}{counter}"
        counter += 1
    return username
