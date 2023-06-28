from django.urls import reverse
from rest_framework.status import *

from tests.base import BaseTestCase


class SignoutTestCase(BaseTestCase):

    def test_logout_successful(self):
        """It should return status 200 for a successful logout"""
        
        response = self.get_client_authenticated().get(reverse('affiliates:logout'))
        self.assertEqual(response.status_code, HTTP_200_OK)


    def test_logout_inaccessible(self):
        """It should return status 401 when trying to logout while not being authenticated"""
        
        response = self.client.get(reverse('affiliates:logout'))
        self.assertEqual(response.status_code, HTTP_401_UNAUTHORIZED)