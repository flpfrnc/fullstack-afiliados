FROM postgres 

ENV POSTGRES_DB byx

COPY initdb.sql /docker-entrypoint-initdb.d/