import requests
from django.core.files.base import ContentFile
from django.conf import settings


def download_image(url, filename):
    response = requests.get(url)
    if response.status_code == 200:
        return ContentFile(response.content, name=filename)
    return None


def build_absolute_url(url):
    if url is not None:
        return settings.BASE_URL + url
    return url
