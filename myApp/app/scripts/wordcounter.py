import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
import string


def initWordCounter(condition):
  try:
    nltk.download('stopwords')
    nltk.download('punkt')
  except:
    return False
  return condition


def wordCount(content):
  tokenizer = nltk.RegexpTokenizer(r"\w+")
  _dict = {}

  filtered_sentence = [word
                      for word in tokenizer.tokenize(content.lower().replace('/', ''))
                      if word not in set(stopwords.words('english'))
                      and len(word) > 1]

  for word in filtered_sentence:
    _dict[word] = _dict.get(word, 0)+1
  return _dict
