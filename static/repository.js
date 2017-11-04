var repoDetailDiv = document.getElementById("repository_detail");
var awesomeContributorDiv = document.getElementById("awesome_contributor");
var awesomeRepositoryDiv = document.getElementById("awesome_repository");

function loadAwesome() {
  $.ajax({
        url: "/awesome",
        success: function (result) {
            console.log(result);

            if (awesomeContributorDiv.childElementCount > 1 ) {
              awesomeContributorDiv.removeChild(awesomeContributorDiv.lastChild);
            }
            if (awesomeRepositoryDiv.childElementCount > 1) {
              awesomeRepositoryDiv.removeChild(awesomeRepositoryDiv.lastChild);
            }

            var data = JSON.parse(result);
            var repo = data["best_commit_repo"];
            var user = data["best_commit_contributor"];

            loadBestContributor("awesome_contributor", user["name"], user["commit"], user["link"]);
            addRepository("awesome_repository", repo["name"], repo["link"], repo["repo_size"],
                          repo["star"], repo["commit"], repo["users"]);
        }
    });
}

function loadBestContributor(container, name, commit, link) {
  var Container = document.getElementById(container);
  var bestUser = document.createElement("div");
  var userName = document.createElement("h2");
  var commitCnt = document.createElement("span");
  var profile = document.createElement("div");
  var profileLink = document.createElement("a");

  userName.append(document.createTextNode(name));
  commitCnt.append(document.createTextNode(" - " + commit + " commits"));
  profileLink.setAttribute("href", link);
  profileLink.append(document.createTextNode("go to profile"));
  profile.append(profileLink);

  userName.append(commitCnt);
  bestUser.append(userName);
  bestUser.append(profile);

  Container.append(bestUser);
}

function loadRepo() {
    $.ajax({
        url: "/repo",
        success: function (result) {
            console.log(result);

            while (repoDetailDiv.hasChildNodes()) {
                repoDetailDiv.removeChild(repoDetailDiv.firstChild);
            }

            var repoDataList = JSON.parse(result);
            repoDataList.forEach(function(repo) {
                addRepository("repository_detail", repo["name"], repo["link"], repo["repo_size"],
                              repo["star"], repo["commit"], repo["users"]);
            });
        }
    });
}

function addRepository(container, name, link, repo_size, star, commit, users) {
  var repoContainer = document.getElementById(container);
  var newRepo = document.createElement("div");
  var repoName = document.createElement("h2");
  var repoLink = document.createElement("a");
  var linkContainer = document.createElement("div");
  var repoStar = document.createElement("span");
  var repoSize = document.createElement("span");
  var repoCommit = document.createElement("div");
  var repoUserContainer = document.createElement("div");

  var maxUserCommit = 0;

  newRepo.setAttribute("id", container + name);
  newRepo.setAttribute("class", "repository");
  newRepo.style.width = "500px";

  repoUserContainer.setAttribute("id", container + name + "_users");
  repoUserContainer.setAttribute("class", "repo_user_container");
  
  repoCommit.setAttribute("class", "repo_total_commit");
  
  linkContainer.setAttribute("class", "repo_link");

  repoName.append(document.createTextNode(name));
  repoLink.setAttribute("href", link);
  repoLink.append(document.createTextNode("go to repository"));
  linkContainer.append(repoLink);
  repoStar.append(document.createTextNode("★" + star));
  repoSize.append(document.createTextNode("size: " + repo_size + " KB"));
  repoCommit.append(document.createTextNode("total " + commit + " commits"));

  newRepo.append(repoName);
  newRepo.append(linkContainer);
  newRepo.append(repoStar);
  newRepo.append(repoSize);
  newRepo.append(repoCommit);
  newRepo.append(repoUserContainer);

  repoContainer.append(newRepo);

  users.forEach(function(user) { maxUserCommit = maxUserCommit < user["commit"] ? user["commit"] : maxUserCommit; });

  users.forEach(function(user) {
    addUser(container, name, user["name"], user["commit"], user["link"], maxUserCommit);
  });
}

function addUser(container, repo_name, name, commit, link, max_commit) {
  var maxWidth = 400;
  var length = maxWidth * commit / max_commit;

  var repoDiv = document.getElementById(container + repo_name + "_users");
  var commitCntBar = document.createElement("div");
  var userLink = document.createElement("a");
  var linkContainer = document.createElement("div");

  commitCntBar.setAttribute("class", "commit_cnt_bar");
  commitCntBar.append(document.createTextNode(name + " - " + commit + " commits"));
  commitCntBar.style.width = length + "px";

  userLink.setAttribute("href", link);
  userLink.append(document.createTextNode("go to profile"));
  linkContainer.append(userLink);

  repoDiv.append(commitCntBar);
  repoDiv.append(linkContainer);
}