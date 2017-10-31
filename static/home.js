/**
 * Created by junsu on 2017-10-30.
 */

console.log(window.location.protocol)

var awesomeRefreshButton = document.getElementById("refresh_awesome_button");
var repoRefreshButton = document.getElementById("refresh_repo_button");

var repoDetailDiv = document.getElementById("repository_detail");

awesomeRefreshButton.onclick = function () {
    console.log("awesome");
};

repoRefreshButton.onclick = function () {
    console.log("repo");
    loadRepo();
};

function loadRepo() {
    $.ajax({
        url: "/repo",
        success: function (result) {
            console.log(result);
            var repoDetailHtml = "";
            var repoDataList = JSON.parse(result);
            for (var i = 0; i < repoDataList.length; i++) {
                var repoData = repoDataList[i];
                var totalCommit = 0;
                repoDetailHtml += "<h2>" + repoData["name"] + "</h2>";
                repoDetailHtml += "<br>";
                for (var j = 0; j < repoData["users"].length; j++) {
                    var userData = repoData["users"][j];
                    console.log(userData);
                    totalCommit += userData["commit_count"];
                    repoDetailHtml += userData["name"];
                    repoDetailHtml += ": ";
                    for (var k = 0; k < userData.commit_count; k++) {
                        repoDetailHtml += "★"
                    }
                    repoDetailHtml += String(userData.commit_count);
                    repoDetailHtml += "<br>";
                }
            }
            repoDetailDiv.innerHTML = repoDetailHtml
        }
    });
}