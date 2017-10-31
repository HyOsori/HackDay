import json

class ManagedInfo(object):
    def __init__(self, owner, repo_name):
        self.owner = owner
        self.repo_name = repo_name


class Repository(object):
    def __init__(self, repo_name, owner, users):
        self.name = repo_name
        self.users = users

    @staticmethod
    def json_serializable(repository):
        serializable_repo = dict()
        serializable_users = list()
        for user in repository.users:
            serializable_users.append({"name": user.name, "commit_count": user.commit_count})

        serializable_repo["users"] = serializable_users
        serializable_repo["name"] = repository.name
        return serializable_repo


class Contributor(object):
    def __init__(self, name, commit_count):
        self.name = name
        self.commit_count = commit_count

