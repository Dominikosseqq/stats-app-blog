import json
import ast
from collections import Counter, OrderedDict
from app.scripts.webscraping import getArticles as getData
from app.scripts.wordcounter import initWordCounter, wordCount
from app.models import Article, Author


def getStatsQuery():
  auth = Author.objects.values_list('words', flat=True)
  _dict = {}
  for oneDict in list(auth):
    _dict = Counter(_dict) + Counter(ast.literal_eval(oneDict))

  _dict = {key: value
           for key, value in sorted(
               _dict.items(),
               key=lambda item: item[1],
               reverse=True)[:10]}

  return _dict


def getAuthorStatsQuery(author):
  for person in Author.objects.values('author', 'words'):
    if person['author'].lower().replace(' ', '') == author:
      stat = person['words']
  if len(stat) <= 1:
    return {'Error': f'Could not find {author} in db...'}

  return stat


def getAuthorsQuery():
  authors = Author.objects.values('author')
  authors_dict = {}
  for author in authors:
    authors_dict.update({
        author['author'].lower().replace(' ', ''): author['author']
    })
  return authors_dict





def initDBQuery(condition):
  try:
    initArticlesQuery(condition)
    initWordCounter(condition)
    initAuthorsQuery(condition)
  except:
    return False
  return condition


def initArticlesQuery(condition):
  Article.objects.all().delete()
  for pages in getData():
    for article_details in pages:
      try:
        Article(
          title=article_details[0],
          author=article_details[1],
          content=article_details[2]
        ).save()
      except:
        Article.objects.all().delete()
        return False
  return condition


def initAuthorsQuery(condition):
  authors = []
  Author.objects.all().delete()
  for author in sorted(
                        list(
                          Article.objects
                                  .values_list('author',
                                                flat=True))):
    if author not in authors:
      wordsCount = {}
      for article in Article.objects.filter(author=author):
        wordsCount.update(
                          wordCount(
                            article.content))

      wordsCount = {key: value 
                      for key, value in sorted(wordsCount.items(), 
                                          key=lambda 
                                            item: item[1],
                                        reverse=True)}

      wordsCount = json.dumps(
                              dict(
                                list(
                                  wordsCount.items())[0: 10]))

      try:
        Author(
          author=author,
          words=wordsCount
        ).save()
      except:
        Author.objects.all().delete()
        return False 
      authors.append(author)

  return condition
