from django.http import HttpResponse
import json
from django.core import serializers
from app.queries.queries import initDBQuery, getAuthorsQuery, getStatsQuery, getAuthorStatsQuery

# Create your views here.


def index(request):
  response = json.dumps({
      'author': 'Dominik Kisek',
      'prod_for': 'Teonite.com',
      'date': 'May, 2020'
  })
  return HttpResponse(response, content_type='text/json')


def authors(request):
  response = json.dumps(getAuthorsQuery())
  return HttpResponse(response, content_type='text/json')


def authorStats(request, author):
  response = getAuthorStatsQuery(author)
  return HttpResponse(response, content_type='text/json')


def stats(request):
  response = json.dumps(getStatsQuery())
  return HttpResponse(response, content_type='text/json')


def reinitDatabase(request):
  if initDBQuery(condition=True):
    response = json.dumps(
        {'Success': 'Reinitiate database. Articles has been add and saved.'})
  else:
    response = json.dumps({'Error': 'Reinitiate database fail'})
  return HttpResponse(response, content_type='text/json')
