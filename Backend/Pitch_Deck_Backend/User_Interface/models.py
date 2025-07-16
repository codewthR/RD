# models.py
from django.db import models

class PresentationSubmission(models.Model):
    timestamp = models.DateTimeField(auto_now_add=True)

class QuestionResponse(models.Model):
    submission = models.ForeignKey(PresentationSubmission, on_delete=models.CASCADE, related_name='responses')
    question_id = models.IntegerField()
    question_text = models.TextField()
    answer = models.TextField(blank=True, null=True)
    extra_data = models.JSONField(blank=True, null=True)  # To store additional details (companyName, teamMembers, etc.)

class UploadedFile(models.Model):
    submission = models.ForeignKey(PresentationSubmission, on_delete=models.CASCADE, related_name='files')
    question_id = models.IntegerField()
    file = models.FileField(upload_to='uploads/')
    file_type = models.CharField(max_length=50)  # e.g., "logo", "visual"
