function loadAwesome() {
  $.ajax({
        url: "/awesome",
        success: function (result) {
            console.log(result);
        }
    });
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
                addRepository(repo["name"], repo["link"], repo["repo_size"], repo["star"],
                              repo["commit"], repo["users"]);
            });
        }
    });
}

function addRepository(name, link, repo_size, star, commit, users) {
  var newRepo = document.createElement("div");
  var repoName = document.createElement("h2");
  var repoLink = document.createElement("a");
  var linkContainer = document.createElement("div");
  var repoStar = document.createElement("span");
  var repoSize = document.createElement("span");
  var repoCommit = document.createElement("div");
  var repoUserContainer = document.createElement("div");

  var maxUserCommit = 0;

  newRepo.setAttribute("id", "repo_" + name);
  newRepo.setAttribute("class", "repository");
  newRepo.style.width = "500px";

  repoUserContainer.setAttribute("id", "repo_" + name + "_users");
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

  repoDetailDiv.append(newRepo);

  users.forEach(function(user) { maxUserCommit = maxUserCommit < user["commit"] ? user["commit"] : maxUserCommit; });

  users.forEach(function(user) {
    addUser(name, user["name"], user["commit"], user["link"], maxUserCommit);
  });
}

function addUser(repo_name, name, commit, link, max_commit) {
  var maxWidth = 400;
  var length = maxWidth * commit / max_commit;

  var repoDiv = document.getElementById("repo_" + repo_name + "_users");
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