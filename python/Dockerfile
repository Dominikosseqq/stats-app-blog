FROM python:3.6

COPY ./myApp /myApp
WORKDIR /myApp
RUN python -m pip install --upgrade pip
RUN pip install -r requirements.txt

## wait for db script
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.7.3/wait /wait
RUN chmod +x /wait
