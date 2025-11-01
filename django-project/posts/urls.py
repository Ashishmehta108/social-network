from django.urls import path
from .views import PostView, LikeToggleView, DislikeToggleView

urlpatterns = [
    path("post/", PostView.as_view(), name="posts"),
    path("<int:post_id>/like/", LikeToggleView.as_view(), name="like_toggle"),
    path("<int:post_id>/dislike/", DislikeToggleView.as_view(), name="dislike_toggle"),
]
