from django.db import models
from django.conf import settings


class Post(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="posts",
        null=False,
    )
    image = models.ImageField(upload_to="posts/", blank=True, null=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.description[:30]}"

    @property
    def likes_count(self):
        return self.likes.count()

    @property
    def dislikes_count(self):
        return self.dislikes.count()


class Like(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="likes")
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="liked_posts"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("post", "user")

    def __str__(self):
        return f"{self.user.username} liked {self.post.id}"


class Dislike(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="dislikes")
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="disliked_posts",
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("post", "user")

    def __str__(self):
        return f"{self.user.username} disliked {self.post.id}"
