from rest_framework import serializers

class UserPreferencesSerializer(serializers.Serializer):
    userId = serializers.CharField(max_length=100)
    selectedOptions = serializers.DictField()
    timestamp = serializers.DateTimeField(required=False)

class PromptSerializer(serializers.Serializer):
    userId = serializers.CharField(max_length=100)
    prompt = serializers.CharField()
    timestamp = serializers.DateTimeField(required=False)

class AnalyticsSerializer(serializers.Serializer):
    error = serializers.CharField(required=False)
    userId = serializers.CharField(max_length=100, required=False)
    timestamp = serializers.DateTimeField(required=False)
    optionType = serializers.CharField(required=False)
    selectedValue = serializers.CharField(required=False)
    sessionId = serializers.CharField(required=False)
    feature = serializers.CharField(required=False)

class FileUploadSerializer(serializers.Serializer):
    file = serializers.FileField()
    userId = serializers.CharField(max_length=100)
    uploadType = serializers.CharField(max_length=50, required=False)

class PresentationGenerationSerializer(serializers.Serializer):
    prompt = serializers.CharField()
    attachments = serializers.ListField(required=False)
    selectedOptions = serializers.DictField(required=False)
    timestamp = serializers.DateTimeField(required=False)
