# Social Network - Full Stack Application

## 1. Project Overview
A modern social networking platform built with Django REST Framework (DRF) backend and React frontend. The application allows users to create accounts, share posts with images, and interact with content through likes and dislikes.

**Tech Stack:**
- **Backend:** Django REST Framework, Django REST Framework SimpleJWT
- **Frontend:** React, Vite, TailwindCSS
- **Database:** SQLite (development), PostgreSQL (production-ready)
- **Authentication:** JWT (JSON Web Tokens)
- **File Storage:** Local file system (development), S3 compatible storage (production-ready)

## 2. Project Structure
```
social_network_fullstack/
├── django-project/           # Django backend
│   ├── posts/               # Posts app (models, views, serializers, URLs)
│   ├── users/               # Users app (authentication, profiles)
│   ├── social_network/      # Project settings and configurations
│   ├── manage.py            # Django management script
│   └── requirements.txt     # Python dependencies
└── frontend/                # React frontend
    ├── public/             # Static files
    ├── src/                # React source code
    │   ├── components/     # Reusable UI components
    │   ├── pages/          # Page components
    │   ├── services/       # API service functions
    │   ├── utils/          # Utility functions
    │   ├── App.jsx         # Main App component
    │   └── main.jsx        # Entry point
    ├── package.json        # NPM dependencies
    └── vite.config.js      # Vite configuration
```

## 3. Backend Documentation

### Prerequisites
- Python 3.8+
- Node.js 16+
- pip (Python package manager)
- npm or pnpm

### Setup & Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ashishmehta108/social-network.git
   cd social-network/django-project
   ```

2. **Create and activate a virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: .\venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables:**
   Create a `.env` file in the `django-project` directory:
   ```env
   SECRET_KEY=your-secret-key
   DEBUG=True
   ALLOWED_HOSTS=localhost,127.0.0.1
   CORS_ALLOWED_ORIGINS=http://localhost:5173
   ```

5. **Apply migrations:**
   ```bash
   python manage.py migrate
   ```

6. **Create a superuser (admin):**
   ```bash
   python manage.py createsuperuser
   ```

7. **Run the development server:**
   ```bash
   python manage.py runserver
   ```

### API Endpoints

#### Authentication
- `POST /api/login/` - Obtain JWT token (login)
  ```json
  {
    "username": "user@example.com",
    "password": "yourpassword"
  }
  ```

- `POST /api/token/refresh/` - Refresh JWT token
- `POST /api/signup/` - Register new user
  ```json
  {
    "email": "user@example.com",
    "username": "username",
    "password": "securepassword",
    "password2": "securepassword"
  }
  ```

- `POST /api/logout/` - Logout (blacklist refresh token)

#### Posts
- `GET /api/posts/post` - List all posts (chronological order)
- `POST /api/posts/post` - Create a new post
  ```json
  {
    "description": "My first post!",
    "image": [file]
  }
  ```
- `DELETE /api/posts/post` - Delete a post (requires post ID in request body)

#### Post Interactions
- `POST /api/posts/post/{post_id}/like/` - Toggle like on a post
- `POST /api/posts/post/{post_id}/dislike/` - Toggle dislike on a post

## 4. Frontend Documentation

### Setup
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   pnpm install
   ```

3. Create a `.env` file:
   ```env
   VITE_API_URL=http://localhost:8000/api
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

### Key Features
- **Authentication Flow**
  - JWT token management with httpOnly cookies
  - Protected routes using React Router
  - Automatic token refresh

- **State Management**
  - React Context for global state
  - Custom hooks for API calls

- **UI Components**
  - Responsive design with TailwindCSS
  - Loading states and error handling
  - Image upload preview

## 5. Common Issues & Solutions

### CORS Errors
- Ensure `CORS_ALLOWED_ORIGINS` in Django settings includes your frontend URL
- Make sure credentials are included in fetch requests:
  ```javascript
  fetch(url, {
    credentials: 'include'
  })
  ```

### Authentication Issues
- Ensure cookies are being sent with requests (use `credentials: 'include'`)
- Verify JWT token is being properly set in cookies
- Check if the token has expired (default: 5 minutes)

### File Uploads
- Ensure `MEDIA_ROOT` and `MEDIA_URL` are properly configured in Django settings
- Check file size limits (default: 5MB)
- Verify file types are allowed (images only by default)

## 6. Deployment

### Backend (Production)
1. Set up a production-ready database (PostgreSQL recommended)
2. Configure production settings:
   - Set `DEBUG=False`
   - Add your domain to `ALLOWED_HOSTS`
   - Configure static and media file storage (S3 recommended)
   - Set up proper CORS policies

3. Using Gunicorn and Nginx:
   ```bash
   pip install gunicorn
   gunicorn social_network.wsgi:application --bind 0.0.0.0:8000
   ```

### Frontend (Production)
1. Build for production:
   ```bash
   npm run build
   ```

2. Deploy the `dist` folder to your preferred static file hosting (Vercel, Netlify, etc.)

## 7. Environment Variables

### Backend (`.env`)
```env
SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173
DATABASE_URL=sqlite:///db.sqlite3
```

### Frontend (`.env`)
```env
VITE_API_URL=http://localhost:8000/api
```

## 8. Contributing
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 9. License
Distributed under the MIT License. See `LICENSE` for more information.

## 10. Contact
Your Name - [@yourtwitter](https://twitter.com/yourtwitter) - email@example.com

Project Link: [https://github.com/yourusername/social-network](https://github.com/yourusername/social-network)
