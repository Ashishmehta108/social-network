from django.contrib.auth import get_user_model
from django.test import override_settings
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
  
from posts.models import Post, Like

  
# SQLITE_DATABASE = {
#     "default": {"ENGINE": "django.db.backends.sqlite3", "NAME": ":memory:"}
# }
 

# @override_settings(DATABASES=SQLITE_DATABASE)
class PostApiTests(APITestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(
            email="user@example.com",
            password="strong-password",
            full_name="Test User",
        )
        self.client.force_authenticate(user=self.user)

    def test_can_list_posts_in_reverse_chronological_order(self):
        first_post = Post.objects.create(user=self.user, description="First")
        second_post = Post.objects.create(user=self.user, description="Second")

        url = reverse("posts")
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        # Newest post should come first
        self.assertEqual(response.data[0]["id"], second_post.id)
        self.assertEqual(response.data[1]["id"], first_post.id)

    def test_authenticated_user_can_create_post(self):
        url = reverse("posts")
        payload = {"description": "New Post"}

        response = self.client.post(url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Post.objects.count(), 1)
        post = Post.objects.first()
        self.assertEqual(post.description, "New Post")
        self.assertEqual(post.user, self.user)

    def test_like_toggle_creates_and_removes_like(self):
        post = Post.objects.create(user=self.user, description="Like me")
        url = reverse("like_toggle", args=[post.id])

        first_response = self.client.post(url)
        self.assertEqual(first_response.status_code, status.HTTP_200_OK)
        self.assertTrue(first_response.data["liked"])
        self.assertEqual(post.likes.count(), 1)

        second_response = self.client.post(url)
        self.assertEqual(second_response.status_code, status.HTTP_200_OK)
        self.assertFalse(second_response.data["liked"])
        self.assertEqual(post.likes.count(), 0)

    def test_dislike_toggle_swaps_existing_like(self):
        post = Post.objects.create(user=self.user, description="React to me")
        Like.objects.create(user=self.user, post=post)
        url = reverse("dislike_toggle", args=[post.id])

        response = self.client.post(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data["disliked"])
        self.assertEqual(post.likes.count(), 0)
        self.assertEqual(post.dislikes.count(), 1)
