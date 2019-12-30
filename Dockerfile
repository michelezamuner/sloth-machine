FROM node:12

RUN apt update && apt install -y vim

WORKDIR /app

COPY . /app

CMD make install ci