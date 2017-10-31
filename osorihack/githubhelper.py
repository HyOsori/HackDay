from tornado import gen, httpclient

BASE_GITHUB_URL = "https://api.github.com/"

@gen.coroutine
def get_contributors(owner, repo_name):
    '''
    Get information about
    repositories contributor
    - how many they commit on this repository (per person)

    :param owner: repo owner name
    :param repo_name: repo name
    :return: return reponse of http request (at api.github.com/repos/:owner/:repo/contributors)
    '''
    appended_url = "repos/%s/%s/contributors" % (owner, repo_name)
    url = BASE_GITHUB_URL + appended_url

    print(owner, repo_name, url)

    request = httpclient.HTTPRequest(url, method='GET')
    request.user_agent = 'request'
    response = yield httpclient.AsyncHTTPClient().fetch(request)

    return response

@gen.coroutine
def get_repository(owner, repo_name):
    '''
    Get information about overview of repo
    number of issues, pull requests and etc ..

    - number of open issue
    - number of PR
    - size of project

    :param owner: owner name
    :param repo_name: repo name
    :return: return response of http request (at api.github.com/repos/:owner/:repo)
    '''

    appended_url = "repos/%s/%s" % (owner, repo_name)
    url = BASE_GITHUB_URL + appended_url

    print(owner, repo_name, url)

    request = httpclient.HTTPRequest(url, method='GET')
    request.user_agent = 'request'
    response = yield httpclient.AsyncHTTPClient().fetch(request)

    return response
