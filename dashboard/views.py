# # dashboard/views.py
# from django.http import JsonResponse
# from rest_framework.decorators import api_view
# from tweets.models import Tweet
# from accounts.models import User

# from django.contrib.auth.decorators import login_required
# from django.utils.decorators import method_decorator
# from rest_framework.decorators import permission_classes
# from rest_framework.permissions import IsAdminUser
# from django.utils.dateparse import parse_date

# from datetime import datetime

# @api_view(['GET'])
# @permission_classes([IsAdminUser])
# def get_dashboard_stats(request):
#     total_tweets = Tweet.objects.count()
#     total_followers = User.objects.filter(is_active=True).count()

#     return JsonResponse({
#         'total_tweets': total_tweets,
#         'total_followers': total_followers
#     })

# @api_view(['GET'])
# def get_dashboard_stats(request):
#     # Replace with real data from your models or querysets
#     total_tweets = Tweet.objects.count()
#     total_followers = User.objects.filter(is_active=True).count()

#     return JsonResponse({
#         'total_tweets': total_tweets,
#         'total_followers': total_followers
#     })


 
# from django.shortcuts import render

# def admin_dashboard(request):
#     return render(request, 'admin/dashboard/dashboard.html')

from django.shortcuts import render
from django.contrib.admin.views.decorators import staff_member_required

@staff_member_required
def custom_admin_index(request):
    return render(request, 'admin/index.html')