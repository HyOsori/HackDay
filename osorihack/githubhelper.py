from tornado import gen, httpclient

BASE_GITHUB_URL = "https://api.github.com/"

@gen.coroutine
def get_contributors(owner, repo_name):
    appended_url = "repos/%s/%s/contributors" % (owner, repo_name)
    url = BASE_GITHUB_URL + appended_url

    print(owner, repo_name, url)

    request = httpclient.HTTPRequest(url, method='GET')
    request.user_agent = 'request'
    response = yield httpclient.AsyncHTTPClient().fetch(request)

    return response