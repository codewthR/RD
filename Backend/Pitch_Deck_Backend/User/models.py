from django.db import models
from django.contrib.auth.models import User

class Presentation(models.Model):
    title = models.CharField(max_length=100)
    ppt_file = models.FileField(upload_to='presentations/')
    # uploaded_by = models.ForeignKey(User, on_delete=models.CASCADE)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    # def __str__(self):
    #     return f"{self.title} by {self.uploaded_by.username}"

class Send_ppt(models.Model):
    title = models.CharField(max_length=200)
    ppt_file = models.FileField(upload_to='presentations/')
    uploaded_at = models.DateTimeField(auto_now_add=True)


class GeneratedPresentation(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    file = models.FileField(upload_to='presentations/')
    created_at = models.DateTimeField(auto_now_add=True)
    topic_name = models.CharField(max_length=255)
