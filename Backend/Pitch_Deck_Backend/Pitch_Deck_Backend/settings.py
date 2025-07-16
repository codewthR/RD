# settings.py

from pathlib import Path
import os
import environ

# Initialize the environment variables
env = environ.Env()
environ.Env.read_env()  # This reads the .env file


SITE_ID = 1

# Debugging output to ensure API_KEY and GOOGLE_API_KEY are correctly loaded
API_KEY = env('API_KEY')
GOOGLE_API_KEY = env('GOOGLE_API_KEY')

# Check if the API keys are being loaded
# print(f"API_KEY: {API_KEY}")
# print(f"GOOGLE_API_KEY: {GOOGLE_API_KEY}")

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.getenv('DJANGO_SECRET_KEY', 'default-secret-key')  # Set via environment variable

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True  # Set to False in production

ALLOWED_HOSTS = ['*']

# Application definition
INSTALLED_APPS = [
    # Django default apps
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.sites',  # required by allauth

    # Your apps
    'User',
    'User_Interface',

    # Third-party apps
    'corsheaders',
    'rest_framework',
    'rest_framework.authtoken',
    'rest_framework_simplejwt.token_blacklist',
    'dj_rest_auth',
    'dj_rest_auth.registration',

    # Allauth (for registration & social login)
    'allauth',
    'allauth.account',
    'allauth.socialaccount',
]


EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

# EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.hostinger.com'
EMAIL_PORT = 465
EMAIL_USE_TLS = True
EMAIL_HOST_USER = ''  # Your Gmail
EMAIL_HOST_PASSWORD = '1234'  # App password (not your Gmail password)



ACCOUNT_USERNAME_REQUIRED = True
ACCOUNT_EMAIL_REQUIRED = True

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ]
}


DJREST_AUTH = {
    'USE_JWT': True,
    'SIGNUP_FIELDS': {
        'username': {'required': True},
        'email': {'required': True},
        'password1': {'required': True},
        'password2': {'required': True},
    }
}


REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ]
}

from datetime import timedelta

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=5),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
    'ROTATE_REFRESH_TOKENS': True,
    'AUTH_COOKIE': 'access_token',
    'AUTH_COOKIE_REFRESH': 'refresh_token',
    'AUTH_COOKIE_SECURE': False,  # Set to True in production (HTTPS only)
    'AUTH_COOKIE_HTTP_ONLY': True,
    'AUTH_COOKIE_SAMESITE': 'Lax',
}

MIDDLEWARE = [
    'allauth.account.middleware.AccountMiddleware', 
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'Pitch_Deck_Backend.urls'

CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",  # React dev server
    "http://localhost:3000",  # React development server
    "http://127.0.0.1:3000",  # Local dev URL
]


# For development, allow your Vite/React frontend origin:
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
]

# If using Django's CSRF protection:
CSRF_TRUSTED_ORIGINS = [
    "http://localhost:5173",
]


CORS_ALLOW_ALL_ORIGINS = True  # Set this to True for local dev, False for production

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'Pitch_Deck_Backend.wsgi.application'

# Static files (CSS, JavaScript, Images)
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'productionfiles'

# Media files configuration for file uploads
MEDIA_URL = '/media/'  # URL to access uploaded files
MEDIA_ROOT = BASE_DIR / 'media'  # Path where uploaded files will be saved

# Default primary key field type
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# REST Framework settings
REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny',
    ],
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
    ],
}

# Static and media file serving during development
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    # Your other URL patterns...
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)



# settings.py
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}


# settings.py
APPEND_SLASH = False
