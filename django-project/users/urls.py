from django.urls import path
from .views import (
    FetchProfile,
    RegisterView,
    CookieTokenObtainPairView,
    CookieTokenRefreshView,
    LogoutView,
)
from rest_framework_simplejwt.views import TokenVerifyView

urlpatterns = [
    path("signup/", RegisterView.as_view(), name="register"),
    path("login/", CookieTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", CookieTokenRefreshView.as_view(), name="token_refresh"),
    path("token/verify/", TokenVerifyView.as_view(), name="token_verify"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("profile/", FetchProfile.as_view(), name="profile"),
]
