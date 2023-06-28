from django.urls import reverse
from django.contrib.auth.models import User
from rest_framework.status import *

from tests.base import BaseTestCase


user_data = {
    "username": "test",
    "password": "test", 
}


class SigninTestCase(BaseTestCase):
    
    def test_login_successfull(self):
        """It should return status 200 for successfully logging in"""

        user = User(username="test")
        user.set_password("test")
        user.save()

        response = self.client.post(reverse('affiliates:login'), data=user_data)
        self.assertEqual(response.status_code, HTTP_200_OK)


    def test_incorrect_credentials(self):
        """It should return status 403 for incorrect valid user data"""

        user = User(username="test")
        user.set_password("incorrect")
        user.save()

        response = self.client.post(reverse('affiliates:login'), data=user_data)
        self.assertEqual(response.status_code, HTTP_403_FORBIDDEN)


    def test_invalid_user(self):
        """It should return status 404 for not existent user"""

        response = self.client.post(reverse('affiliates:login'), data=user_data)
        self.assertEqual(response.status_code, HTTP_404_NOT_FOUND)
        