from django.core.files.uploadedfile import SimpleUploadedFile
from django.urls import reverse
from rest_framework.status import *

from tests.base import BaseTestCase, file_content, incorrect_type_file_content, incorrect_date_file_content, incorrect_value_file_content, empty_seller_file_content



class UploadFileTestCase(BaseTestCase):
    fixtures = ["data.json"]

    def test_upload_file_successfully(self):
        """It should return status 201 when file is upload successfuly"""
        text = SimpleUploadedFile("sales.txt", file_content, content_type="text/plain")
        response = self.get_client_authenticated().post(reverse('affiliates:add-transactions'), {'sales': text})
        self.assertEqual(response.status_code, HTTP_201_CREATED)

        # assert for total quantity of rows
        self.assertEqual(len(response.json()), 20)

        # asserts for object id so it will confirm data is inserted correctly in the db
        self.assertEqual(response.json()[0]["id"], 1)
        self.assertEqual(response.json()[-1]["id"], 20)


    def test_upload_no_valid_file_provided(self):
        """It should return status 400 when no valid file is provided on upload"""
        response = self.get_client_authenticated().post(reverse('affiliates:add-transactions'), {})
        self.assertEqual(response.status_code, HTTP_400_BAD_REQUEST)

    def test_upload_file_incorrect_transaction_type(self):
        """It should return status 404 when file is uploaded with the wrong transaction type id"""
        text = SimpleUploadedFile("sales.txt", incorrect_type_file_content, content_type="text/plain")
        response = self.get_client_authenticated().post(reverse('affiliates:add-transactions'), {'sales': text})
        self.assertEqual(response.status_code, HTTP_404_NOT_FOUND)


    def test_upload_file_incorrect_date(self):
        """It should return status 400 when file is uploaded with an incorrect date string"""
        text = SimpleUploadedFile("sales.txt", incorrect_date_file_content, content_type="text/plain")
        response = self.get_client_authenticated().post(reverse('affiliates:add-transactions'), {'sales': text})
        self.assertEqual(response.status_code, HTTP_400_BAD_REQUEST)


    def test_upload_file_incorrect_value(self):
        """It should return status 400 when file is uploaded with not enough value characters"""
        text = SimpleUploadedFile("sales.txt", incorrect_value_file_content, content_type="text/plain")
        response = self.get_client_authenticated().post(reverse('affiliates:add-transactions'), {'sales': text})
        self.assertEqual(response.status_code, HTTP_400_BAD_REQUEST)
        

    def test_upload_file_empty_seller(self):
        """It should return status 400 when file is uploaded with no seller name"""
        text = SimpleUploadedFile("sales.txt", empty_seller_file_content, content_type="text/plain")
        response = self.get_client_authenticated().post(reverse('affiliates:add-transactions'), {'sales': text})
        self.assertEqual(response.status_code, HTTP_400_BAD_REQUEST)
    
    
    def test_upload_file_without_authentication(self):
        """It should return status 401 when a file is uploadeded by an unauthenticated method"""
        text = SimpleUploadedFile("sales.txt", file_content, content_type="text/plain")
        response = self.client.post(reverse('affiliates:add-transactions'), {'sales': text})
        self.assertEqual(response.status_code, HTTP_401_UNAUTHORIZED)

   