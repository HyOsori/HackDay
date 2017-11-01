/**
 * Created by junsu on 2017-10-30.
 */

window.onload = function() {
    startclock();
};

console.log(window.location.host)

var chatSocket = new WebSocket("ws://" + window.location.host + "/chat");
chatSocket.onopen = function () {
    chatSendButton.onclick = function () {
        sendMessage();
    }
};

function sendMessage() {
    var chat = new Object();
    chat.name = myNameText.textContent;
    chat.message = chatBox.value;

    data = JSON.stringify(chat)
    chatSocket.send(data);

    chatBox.value = "";
}

chatSocket.onmessage = function (evt) {
    var data = evt.data;
    data = JSON.parse(data);

    var message = data["name"] + ": " + data["message"];
    var appendedMessage = document.createElement("li");
    appendedMessage.appendChild(document.createTextNode(message));
    chatChat.appendChild(appendedMessage);
};

var chatSendButton = document.getElementById("chat_send");
var chatBox = document.getElementById("chat_box");
var chatChat = document.getElementById("chat_chat");

var awesomeRefreshButton = document.getElementById("refresh_awesome_button");
var repoRefreshButton = document.getElementById("refresh_repo_button");

var repoDetailDiv = document.getElementById("repository_detail");

var myNameText = document.getElementById("my_name");

chatBox.onkeydown = function (event) {
    if (event.keyCode == 13) {
        sendMessage();
    }
}

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
                repoDetailHtml += "<a href=" + "\""+ repoData["link"] + "\"" + ">" + "<h2>" + repoData["name"] + "</h2>" + "</a>";
                repoDetailHtml += "code size: " + String(repoData["repo_size"]) + "KB" + "<br>";
                repoDetailHtml += "star: " + String(repoData["star"]) + "★" + "<br><br>";
                for (var j = 0; j < repoData["users"].length; j++) {
                    var userData = repoData["users"][j];
                    console.log(userData);
                    totalCommit += userData["commit_count"];
                    repoDetailHtml += "<a href=" + "\""+ userData["link"] + "\"" + ">" + userData["name"] + "</a>";
                    repoDetailHtml += ": ";
                    for (var k = 0; k < userData.commit_count; k++) {
                        repoDetailHtml += "★"
                    }
                    repoDetailHtml += "<br>"
                    repoDetailHtml += String(userData.commit_count) + "commit";
                    repoDetailHtml += "<br>";
                }
                repoDetailHtml += "<h4>" + "total Commit: " +  String(totalCommit) + "commit" + "</h4>";
                repoDetailHtml += "<br>"
            }
            repoDetailDiv.innerHTML = repoDetailHtml
        }
    });
}