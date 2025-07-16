from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.urls import reverse
import uuid

class PresentationAPITests(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user_id = "test_user_001"

    def test_get_user_preferences_default(self):
        url = reverse('get_user_preferences')
        response = self.client.get(url, {'userId': self.user_id})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('lastSelectedOptions', response.data)

    def test_save_user_preferences(self):
        url = reverse('save_user_preferences')
        data = {
            'userId': self.user_id,
            'selectedOptions': {
                'Model': 'OpenAI',
                'Slides': '4',
                'Font': 'Verdana',
                'Style': 'Modern',
                'Content': 'High'
            }
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['success'], True)

    def test_auto_save_prompt(self):
        url = reverse('auto_save_prompt')
        data = {
            'userId': self.user_id,
            'prompt': 'The Future of AI in Healthcare'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['message'], 'Prompt saved')

    def test_generate_presentation_with_openai(self):
        url = reverse('generate_presentation')
        data = {
            'prompt': 'Benefits of Using Solar Energy',
            'selectedOptions': {
                'Model': 'OpenAI',
                'Slides': '3',
                'Font': 'Arial',
                'Style': 'Informative',
                'Content': 'Medium'
            },
            'attachments': []
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        self.assertIn('slides', response.data['presentation'])

    def test_generate_presentation_failure(self):
        url = reverse('generate_presentation')
        data = {
            'prompt': '',  # Invalid
            'selectedOptions': {},
            'attachments': []
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_log_analytics_error(self):
        url = reverse('log_analytics_error')
        data = {'error': 'Something went wrong', 'userId': self.user_id}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['success'], True)

    def test_track_option_usage(self):
        url = reverse('track_option_usage')
        data = {
            'optionType': 'Model',
            'selectedValue': 'Gemini',
            'userId': self.user_id,
            'sessionId': str(uuid.uuid4())
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_track_feature_usage(self):
        url = reverse('track_feature_usage')
        data = {
            'feature': 'ThemeSelection',
            'userId': self.user_id
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_track_navigation(self):
        url = reverse('track_navigation')
        data = {'action': 'GoToEditor'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_analytics(self):
        url = reverse('get_analytics')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('analytics', response.data)

    def test_file_upload_and_delete(self):
        upload_url = reverse('upload_file')
        with open(__file__, 'rb') as file:
            response = self.client.post(upload_url, {
                'file': file,
                'userId': self.user_id,
                'uploadType': 'test'
            })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        file_id = response.data.get('fileId')

        # Delete
        delete_url = reverse('remove_attachment', args=[file_id])
        delete_response = self.client.delete(delete_url)
        self.assertEqual(delete_response.status_code, status.HTTP_200_OK)
