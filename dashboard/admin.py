# dashboard/admin.py
from django.contrib.admin import AdminSite

class CustomAdminSite(AdminSite):
    site_header = 'X Clone Admin'
    site_title = 'X Admin Portal'
    index_title = 'Welcome to X Admin Dashboard'

    def index(self, request, extra_context=None):
        extra_context = extra_context or {}
        # You can inject data into the template here if needed
        return super().index(request, extra_context)

custom_admin_site = CustomAdminSite(name='custom_admin')