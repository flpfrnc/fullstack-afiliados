from django.urls import reverse
from rest_framework.status import *
from django.core.files.uploadedfile import SimpleUploadedFile

from tests.base import BaseTestCase, file_content


class GetTransactionsTestCase(BaseTestCase):
    fixtures = ["data.json"]

    def test_get_all_transactions(self):       
        """It should return status 200 when getting transactions while being authenticated"""
        
        authenticated_client = self.get_client_authenticated()

        text = SimpleUploadedFile("sales.txt", file_content, content_type="text/plain")
        authenticated_client.post(reverse('affiliates:add-transactions'), {'sales': text})

        response = authenticated_client.get(reverse('affiliates:get-transactions'))
        self.assertEqual(response.status_code, HTTP_200_OK)
        self.assertEqual(response.json()["length"], 20)
        self.assertEqual(response.json()["transactions"][0]["id"], 1)
        self.assertEqual(response.json()["transactions"][-1]["id"], 20)
        

    def test_transactions_inaccessible(self):       
        """It should return status 401 when getting transactions while not being authenticated"""

        authenticated_client = self.get_client_authenticated()

        text = SimpleUploadedFile("sales.txt", file_content, content_type="text/plain")
        authenticated_client.post(reverse('affiliates:add-transactions'), {'sales': text})

        response = self.client.get(reverse('affiliates:get-transactions'))
        self.assertEqual(response.status_code, HTTP_401_UNAUTHORIZED)


    def test_get_single_transaction(self):       
        """It should return status 200 when getting a single transaction while being authenticated"""
        
        TRANSACTION_ID = 1

        authenticated_client = self.get_client_authenticated()

        text = SimpleUploadedFile("sales.txt", file_content, content_type="text/plain")
        authenticated_client.post(reverse('affiliates:add-transactions'), {'sales': text})

        response = authenticated_client.get(reverse('affiliates:get-transaction', args={TRANSACTION_ID}))
        self.assertEqual(response.status_code, HTTP_200_OK)


    def test_single_transaction_inaccessible(self):       
        """It should return status 401 when getting a single transaction while not being authenticated"""
        
        TRANSACTION_ID = 1

        authenticated_client = self.get_client_authenticated()

        text = SimpleUploadedFile("sales.txt", file_content, content_type="text/plain")
        authenticated_client.post(reverse('affiliates:add-transactions'), {'sales': text})

        response = self.client.get(reverse('affiliates:get-transaction', args={TRANSACTION_ID}))
        self.assertEqual(response.status_code, HTTP_401_UNAUTHORIZED)