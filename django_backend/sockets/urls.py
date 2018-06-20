from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^doc$', views.publish, name='publish'),
]