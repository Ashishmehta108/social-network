from rest_framework import serializers
from .models import Post, Like, Dislike
from users.serializers import UserSerializer


class PostSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    likes_count = serializers.ReadOnlyField()
    dislikes_count = serializers.ReadOnlyField()
    is_liked = serializers.SerializerMethodField()
    is_disliked = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = [
            "id",
            "user",
            "image",
            "description",
            "created_at",
            "likes_count",
            "dislikes_count",
            "is_liked",
            "is_disliked",
        ]

    def get_is_liked(self, obj):
        user = self.context.get("request").user
        if user.is_authenticated:
            return obj.likes.filter(user=user).exists()
        return False

    def get_is_disliked(self, obj):
        user = self.context.get("request").user
        if user.is_authenticated:
            return obj.dislikes.filter(user=user).exists()
        return False
