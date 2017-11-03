/**
 * Created by junsu on 2017-10-30.
 */

window.onload = function() {
    var clickEvent = document.createEvent("HTMLEvents");

    startclock();
    moveLine();
    loadRepo();
    loadAwesome();

    clickEvent.initEvent('click', true, false);

    if (noticeList.hasChildNodes()) {
        noticeList.childNodes[0].dispatchEvent(clickEvent);
    }

    var repoRefresh = setInterval(loadRepo, 600000);
    var awesomeRefresh = setInterval(loadAwesome, 600000);
};

console.log(window.location.host);

var chatSocket = new WebSocket("wss://" + window.location.host + "/conn");
chatSocket.onopen = function () {
    chatSendButton.onclick = function () {
        sendMessage();
    }
};

function sendMessage() {
    var chat = new Object();
    chat.name = myNameText.textContent;
    chat.message = chatBox.value;
    chat.type = "message";
    
    data = JSON.stringify(chat)
    chatSocket.send(data);

    chatBox.value = "";
}

function addNotice(title, content) {
    var newNotice = document.createElement("li");
    var noticeContent = document.createElement("p");

    newNotice.appendChild(document.createTextNode(title));
    noticeContent.appendChild(document.createTextNode(content));
    noticeContent.setAttribute('class', 'notice_hidden');
    newNotice.appendChild(noticeContent);

    newNotice.addEventListener("click", function() {
        var child = newNotice.childNodes[1];
        if (child.className == 'notice_hidden') {
            child.className = 'notice';
        } else {
            child.className = 'notice_hidden';
        }
    });

    noticeList.prepend(newNotice);
}

chatSocket.onmessage = function (evt) {
    var data = evt.data;
    data = JSON.parse(data);
    console.log(data);
    if (data["type"] == "message") {
        var message = "[" + data["name"] + "] : " + data["message"];
        var appendedMessage = document.createElement("li");
        appendedMessage.appendChild(document.createTextNode(message));

        if (data["name"] == myNameText.textContent) {
            appendedMessage.setAttribute('class', 'mychat');
        }
        chatChat.appendChild(appendedMessage);
        chatChat.scrollTop = chatChat.scrollHeight;
    }
    else if (data["type"] == "notice") {
        addNotice(data["title"], data["message"]);
    }
};

var chatSendButton = document.getElementById("chat_send");
var chatBox = document.getElementById("chat_box");
var chatChat = document.getElementById("chat_chat");

var repoDetailDiv = document.getElementById("repository_detail");

var myNameText = document.getElementById("my_name");

var noticeList = document.getElementById("notice_list");

chatBox.onkeydown = function (event) {
    if (event.keyCode == 13) {
        sendMessage();
    }
}