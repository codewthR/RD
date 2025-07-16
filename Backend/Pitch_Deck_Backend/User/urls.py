from django.urls import path
from .views import (
    RegisterView, LoginView, LogoutView,
    PasswordResetRequestView, PasswordResetConfirmView,ProfileView
)

urlpatterns = [
    path('api/register/', RegisterView.as_view(), name='register'),
    path('api/login/', LoginView.as_view(), name='login'),
    path('api/logout/', LogoutView.as_view(), name='logout'),
    path('api/password-reset/', PasswordResetRequestView.as_view(), name='password_reset'),
    path('api/password-reset-confirm/<uidb64>/<token>/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),

    #  ===================== profile view =====================
    path('api/profile/', ProfileView.as_view(), name='profile'),
]
