# stats-app-blog
Simple stats from blogs pages for Teonite.com

## Quick start
### step one
'<docker-compose build>'
'<docker-compose up>'
### step two
Initalize data in Database for minimalize response time.
It will take about **40 seconds** depends on Your local machine.

'<curl localhost:8080/reinitdatabase>'

Response will explain you that success or fail.

![Response_DB](https://ibb.co/mqPMqyY)

## Usage
Available responses:
'''
curl localhost:8080/
curl localhost:8080/stats/
curl localhost:8080/authors/
curl localhost:8080/stats/<author>
'''
