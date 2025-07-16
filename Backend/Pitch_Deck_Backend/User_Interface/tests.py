from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.core.files.uploadedfile import SimpleUploadedFile

class LandingPageViewTests(APITestCase):
    def test_get_all_landing_page_valid_data(self):
        test_image = SimpleUploadedFile("test.jpg", b"fake image content", content_type="image/jpeg")

        url = reverse('get_all_landing_page')  # uses the name from urls.py

        response = self.client.post(
            url,
            data={
                "Model_Name": "gpt-4",
                "Content_type": "text",
                "Prompt_01": "Climate Change",
                "pages_slide": 5,
                "styling": "modern",
                "font_info": "Arial",
                "theme_name": "Nature",
                "All_Content": "A comprehensive breakdown of climate change impacts.",
                "Images": test_image
            },
            format='multipart'
        )

        print(response.content)  # for debugging
        self.assertEqual(response.status_code, status.HTTP_200_OK)
