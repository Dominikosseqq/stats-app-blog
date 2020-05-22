from django.db import models
from django.contrib.postgres.fields import ArrayField


class Article(models.Model):
    title = models.CharField(max_length=300, default='title')
    author = models.CharField(max_length=50, default='author')
    content = models.CharField(max_length=20000, default='content')

    def __str__(self):
        return self.title


class Author(models.Model):
  author = models.CharField(max_length=50, default='author')
  words = models.CharField(max_length=10000, default='words')

  def __str__(self):
      return self.author
