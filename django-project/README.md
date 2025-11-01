# Django Backend Project

## Overview
This project is a Django-based backend API that provides user authentication and profile management using Django REST Framework and JWT for secure token-based authentication.

## Features
- User registration with JWT token issuance
- Login with JWT token handling via cookies
- Token refresh using cookie-based refresh tokens
- Logout with token blacklisting
- Fetch and update user profile
- Create, view, delete posts, and like/unlike posts

## Installation
1. Clone the repository
2. Set up a virtual environment and activate it
3. Install dependencies using `pip install -r requirements.txt`
4. Run migrations with `python manage.py migrate`
5. Start the development server with `python manage.py runserver`

## API Endpoints
- `POST /signup/` : Register a new user. Returns access and refresh tokens.
- `POST /login/` : Login user and set refresh token in an HTTP-only cookie.
- `POST /token/refresh/` : Refresh access token using the refresh token cookie.
- `POST /logout/` : Logout user and blacklist the refresh token.
- `GET /profile/` : Get the authenticated user's profile.
- `PATCH /profile/` : Update the authenticated user's profile.
- `GET /post/` : Get all posts.
- `POST /post/` : Create a new post.
- `DELETE /post/` : Delete a post by ID.
- `POST /posts/{post_id}/like-toggle/` : Toggle like/unlike on a post.

## Authentication
- Uses JWT tokens for authentication.
- Access tokens are returned in response bodies.
- Refresh tokens are stored securely in HTTP-only cookies.

## Code Structure
- `users/views.py` : Contains views for registration, login, token refresh, logout, and profile management.
- `users/urls.py` : Defines URL routes for the user-related API endpoints.
- `users/serializers.py` : Serializers for user registration and profile data.
- `posts/views.py` : Contains views for posts and likes functionality.
- `posts/urls.py` : Defines URL routes for the posts-related API endpoints.
- `posts/serializers.py` : Serializers for post data.

## Posts Functionality

### Overview
This section describes the posts feature of the Django backend project, which allows authenticated users to create, view, delete posts, and like/unlike posts.

### Models
- **Post**: Represents a user post with fields for user (author), image, description, and creation timestamp.
  - `likes_count`: Property to get the number of likes on the post.
  - `is_liked`: Property to check if the current user has liked the post.
- **Like**: Represents a like on a post by a user. Each user can like a post only once.

### Serializers
- **PostSerializer**: Serializes the Post model including user, image, description, created_at, likes_count, and is_liked fields.
  - `is_liked` is a method field that checks if the current user has liked the post.

### Views
- **PostView** (APIView):
  - `GET`: Returns a list of all posts ordered by creation date (newest first).
  - `POST`: Allows authenticated users to create a new post. The user is set automatically.
  - `DELETE`: Allows users to delete their own posts by providing the post ID.

- **LikeToggleView** (APIView):
  - `POST`: Toggles like/unlike on a post for the authenticated user.

### API Endpoints
- `GET /post/` : Get all posts.
- `POST /post/` : Create a new post.
- `DELETE /post/` : Delete a post by ID.
- `POST /post/{post_id}/like-toggle/` : Toggle like/unlike on a post.

### Permissions
- Only authenticated users can interact with posts and likes.

## How to Use
- Register a new user via `/signup/`.
- Login via `/login/` to receive tokens.
- Use the access token to authenticate API requests.
- Refresh tokens automatically handled via cookies.
- Logout to invalidate tokens.
- Create, view, delete posts, and like/unlike posts using the posts API endpoints.
