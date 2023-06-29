FROM python:3.9

ENV PYTHONUNBUFFERED 1

WORKDIR /app/api

RUN pip install --upgrade pip
COPY requirements.txt ./
RUN pip install -r requirements.txt

COPY . ./
EXPOSE 8000

# COPY ./entrypoint.sh .
# ENTRYPOINT [ "sh", "/app/entrypoint.sh" ]

# ENV DATABASE_HOST=localhost
# ENV DATABASE_PORT=5432
# ENV DATABASE_NAME=byx
# ENV DATABASE_USER=admin
# ENV DATABASE_PASSWORD=admin

# CMD python manage.py runserver 0.0.0.0:8000