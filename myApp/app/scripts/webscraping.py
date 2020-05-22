import requests
from bs4 import BeautifulSoup as BS
import nltk





# HELPERS
def decodeText(text):
    return text.encode('latin1', 'ignore').decode('utf8')


def pathCondition(path):
    new_path = path.find('a').get('href')
    if '../../' in new_path:
        new_path = new_path.replace('../../', '')
    if '../blog/' in new_path:
        new_path = new_path.replace('../blog/', '')
    return new_path


# function returns array of paths (string) to single articles from one blogpage
def getArticlePath(url):
    return map(
            lambda path: pathCondition(path),
                BS(
                    requests
                        .get(url)
                        .text, 'lxml')
                        .findAll('h2', {'class': 'post-title'}))



# function returns information about article (title, author, content)
def getArticleData(path, url):
    data = BS(
        requests
        .get(f'{url}{path}')
        .text, 'lxml').find('h1', {'class': 'post-title'})
    return [
        decodeText(data.text),
        decodeText(data
                    .parent
                    .find('span', {'class': 'author-name'})
                    .text),
        decodeText(data
                    .parent
                    .find('div', {'class': 'post-content'})
                    .text)]


# function returns array of paths array using getArticlePath from all blog page
def getManyArticlePath(url, pagesNumber):
    return map(
        lambda i:
            getArticlePath(url) if i < 2
            else getArticlePath(
                f'{url}/page/{str(i)}/index.html'),
        range(1, pagesNumber + 1))


# function returns array information all articles (titles, authors, content)
def getManyArticleData(pathList, url):
    return map(
            lambda pathArr:
                map(
                    lambda path: 
                        getArticleData(path, url),
                    pathArr),
                pathList)


# function returns list of blog posts
def getArticles():
    url = 'https://teonite.com/blog/'
    pagesNumber = int(
        BS(
            requests.get(url)
            .text, 'lxml')
        .find('span', {'class': 'page-number'})
        .text
        .replace('1/', ''))

    return getManyArticleData(getManyArticlePath(url, pagesNumber), url)
