from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    # ------------------------------
    # User Preferences & Profile APIs
    # ------------------------------
    path('api/user/preferences/', views.get_user_preferences, name='get_user_preferences'),
    path('api/user/save-preferences/', views.save_user_preferences, name='save_user_preferences'),
    path('api/user/auto-save-prompt/', views.auto_save_prompt, name='auto_save_prompt'),
    path('api/user/remove-attachment/<str:attachment_id>/', views.remove_attachment, name='remove_attachment'),

    # ------------------------------
    # AI Generation
    # ------------------------------
    path('api/generate-presentation/', views.generate_presentation, name='generate_presentation'),

    #  =======================presentation genration redirect -======================================
    path('generate-ppt/', views.generate_ppt, name='generate_ppt'),

    # saving smart prompt data 
    # path('api/save-presentation-data/', views.save_presentation_data, name='save_presentation'),
    # ------------------------------
    # Analytics & Tracking
    # ------------------------------
    path('api/analytics/', views.get_analytics, name='get_analytics'),
    path('api/analytics/log-error/', views.log_analytics_error, name='log_analytics_error'),
    path('api/analytics/track-option-usage/', views.track_option_usage, name='track_option_usage'),
    path('api/analytics/track-feature-usage/', views.track_feature_usage, name='track_feature_usage'),
    path('api/track-navigation/', views.track_navigation, name='track_navigation'),

    # ------------------------------
    # File Upload/Attachment Handling
    # ------------------------------
    path('api/upload-file/', views.upload_file, name='upload_file'),

]
