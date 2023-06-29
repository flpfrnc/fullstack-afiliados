# Fullstack Afiliados

> This is a challenge by [Coodesh](https://coodesh.com/)

> Project presentation link: https://www.loom.com/embed/8c14315091ca432ea56a23a35fa60683

<p>
    The project goal is to make an practical interface to manage transaction data - <em>read and upload transaction files</em> - given the following structure:
</p>

```
tb_transaction_data:

| field   | type   | relation                 |
| ------- | ------ | ------------------------ |
| id      | int PK |                          |
| type    | int FK | transaction_type.type_id |
| date    | string |                          |
| product | string |                          |
| value   | string |                          |
| seller  | string |                          |

tb_transaction_type:

| field         | type   | relation         |
| ------------- | ------ | ---------------- |
| type_id       | int PK |                  |
| description   | string |                  |
| nature        | string |                  |
| sign          | string |                  |
```

## Thinking Proccess

Here is a brief description of what my thinking proccess was like during this challenge:

### backend:

- Setup db model considering the relations provided in the challenge description
- Get the most familiar technologies matching my experience with Python / Typescript.
- Setup the backend first with a simple api view to test connection
- Setup the main endpoint which was responsible for uploading the sales.txt file to the backend, reading the file hardcoded before sending any file by requests
- Implement the business rule which was to parse the file according to field sizes
- Follow the happy path and insert file using a local db <em>sqlite3</em>
- Handle exceptions by manually changing the sales.txt file to match possible errors
- Setup request file upload
- Validate the data using serializers
- Create authentication endpoints and authentications rules
- Procceed with testing the backend

### frontend:

- Choose the main technologies: <em>Vite/Vitest</em>
- Think about rather needing any contexts / routers
- Setup the main pages and components needed
- Implement routing
- Implement JWT authentication / session handling
- Write frontend tests

## Used techs

The main used technologies were the following:

- Python + [Django](https://www.djangoproject.com/) + [Django REST Framework](https://www.django-rest-framework.org/)
- [Simple JWT](https://django-rest-framework-simplejwt.readthedocs.io/en/latest/)
- Testing: Django Testcase

- [React](https://react.dev/) + [Vite](https://vitejs.dev/) Typescript
- Testing: [Vitest](https://vitest.dev/)
- Handling Requests: [axios](https://axios-http.com/ptbr/docs/intro)
- Routing: [React Router](https://reactrouter.com/en/main)

## Usage:

You'll need to have docker installed to run this project:
https://docs.docker.com/engine/install/

```bash
# properly clone the repository
$ git clone https://github.com/flpfrnc/fullstack-afiliados.git

# Access the project folder
$ cd fullstack-afiliados

# considering you have docker and docker-composed installed
# build the images
$ docker-compose build --no-cache

# start the container
$ docker-compose up
```

> ## **warning**

> some environment template files provided bellow to properly run this project:

> security issues were ignored for this step once it's not a production implementation

`fullstack_afiliados/frontend/.env`

```.env
VITE_AXIOS_BASE_URL=http://127.0.0.1:8000/api/
```

`fullstack_afiliados/backend/api/.env`

```
SECRET_KEY=s3Cr3T
DEBUG=True
JWT_TOKEN_EXPIRE=2

POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=byx
```

## Running tests:

```bash
# test backend
$ docker-compose run --rm backend sh -c "python manage.py test affiliates_system --verbosity 2"

# test frontend
$ docker-compose run --rm frontend sh -c "npm run test"

# coverage frontend
$ docker-compose run --rm frontend sh -c "npm run coverage"
```

## API Documentation:

<details>
<summary>
here are the endpoints and params needed for using the api
</summary>

```
baseUrl: http://127.0.0.1:8000/api
```

> ### Authentication:

```
"/auth"

methods: POST

headers: Content-Type: application/json

body: { "username": string, "password": string }

response:
{
	"user": {
		"username": string
	},
	"exp": number,
	"token": string,
	"refresh_token": string
}
```

> ### Registration:

```
"/register"

methods: POST

headers: Content-Type: application/json

body: { "username": string, "password": string }
```

> ### Logout:

```
"/logout"

methods: GET

headers: [{
    Authorization: "Bearer token"
}]

response:
{
	"detail": "Successfully logged out"
}
```

> ### Add Transactions:

```
"/add-data"

methods: POST

headers: [{
    Content-Type: multipart/form-data,
    Authorization: "Bearer token"
}]


body: { "sales": bytes }

expects: ".txt" file
```

> ### Read Transactions:

```
"/read-data"

methods: GET

headers: [{
    Content-Type: multipart/form-data,
    Authorization: "Bearer token"
}]

body: { "sales": bytes }

response:
{
    transactions:
    [
        {
            "id": number,
            "date": datetime string,
            "product": string,
            "value": string,
            "seller": string,
            "created_at": datetime string,
            "updated_at": datetime string,
            "transaction_type": {
                "type_id": number,
                "description": string,
                "nature": string,
                "sign": string
            }
        }
    ],
    length: number
}
```

> ### Single Transaction:

```
"/read-data/:id"

# only get used in this project
methods: PUT, GET, DELETE

headers: [{
    Content-Type: multipart/form-data,
    Authorization: "Bearer token"
}]

# body only used if not GET method
body: {
    "transaction_type": int,
    "date": datetime string,
    "product": string,
    "value": int,
    "seller": string
}

response:
{
    "id": number,
    "date": datetime string,
    "product": string,
    "value": string,
    "seller": string,
    "created_at": datetime string,
    "updated_at": datetime string,
    "transaction_type": {
        "type_id": number,
        "description": string,
        "nature": string,
        "sign": string
    }
}
```

</details>
