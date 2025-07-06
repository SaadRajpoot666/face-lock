from django.contrib import admin
from django.urls import path
from facelockapp import views

urlpatterns = [
    path('signup',views.signup_face,name="signup")
]