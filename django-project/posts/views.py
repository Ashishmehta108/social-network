from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .models import Post, Like, Dislike
from .serializers import PostSerializer


class PostView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        posts = Post.objects.all().order_by("-created_at")
        serializer = PostSerializer(posts, many=True, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = PostSerializer(data=request.data, context={"request": request})
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        post_id = request.data.get("id")
        try:
            post = Post.objects.get(id=post_id, user=request.user)
            post.delete()
            return Response(
                {"message": "Post deleted successfully"}, status=status.HTTP_200_OK
            )
        except Post.DoesNotExist:
            return Response(
                {"error": "Post not found"}, status=status.HTTP_404_NOT_FOUND
            )


class LikeToggleView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, post_id):
        try:
            post = Post.objects.get(id=post_id)
        except Post.DoesNotExist:
            return Response(
                {"error": "Post not found"}, status=status.HTTP_404_NOT_FOUND
            )

        # Remove any existing dislike
        Dislike.objects.filter(post=post, user=request.user).delete()

        like, created = Like.objects.get_or_create(post=post, user=request.user)
        if not created:
            like.delete()
            return Response(
                {
                    "liked": False,
                    "likes_count": post.likes.count(),
                    "dislikes_count": post.dislikes.count(),
                },
                status=status.HTTP_200_OK,
            )

        return Response(
            {
                "liked": True,
                "likes_count": post.likes.count(),
                "dislikes_count": post.dislikes.count(),
            },
            status=status.HTTP_200_OK,
        )


class DislikeToggleView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, post_id):
        try:
            post = Post.objects.get(id=post_id)
        except Post.DoesNotExist:
            return Response(
                {"error": "Post not found"}, status=status.HTTP_404_NOT_FOUND
            )

        # Remove any existing like
        Like.objects.filter(post=post, user=request.user).delete()

        dislike, created = Dislike.objects.get_or_create(post=post, user=request.user)
        if not created:
            dislike.delete()
            return Response(
                {
                    "disliked": False,
                    "likes_count": post.likes.count(),
                    "dislikes_count": post.dislikes.count(),
                },
                status=status.HTTP_200_OK,
            )

        return Response(
            {
                "disliked": True,
                "likes_count": post.likes.count(),
                "dislikes_count": post.dislikes.count(),
            },
            status=status.HTTP_200_OK,
        )
