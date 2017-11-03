/**
 * Created by junsu on 2017-10-30.
 */

window.onload = function() {
    var clickEvent = document.createEvent("HTMLEvents");

    startclock();
    moveLine();

    addNotice("이것은 첫 번째 공지사항입니다.",
              "여름장이란 애시당초에 글러서, 해는 아직 중천에 있건만 장판은 벌써 쓸쓸하고 더운 햇발이 벌여놓은 " +
              "전 휘장 밑으로 등줄기를 훅훅 볶는다. 마을 사람들은 거지 반 돌아간 뒤요, 팔리지 못한 나무꾼 패가" +
              " 길거리에 궁싯거리고들 있으나 석유병이나 받고 고깃마리나 사면 족할 이 축들을 바라고 언제까지든지" +
              " 버티고 있을 법은 없다. 춥춥스럽게 날아드는 파리 떼도 장난꾼 각다귀들도 귀치않다. 얽둑배기요 " +
              "왼손잡이인 드팀전의 허 생원은 기어코 동업의 조 선달에게 나꾸어 보았다.");
    addNotice("이것은 두 번째 공지사항입니다.",
              "어린아이를 달래듯이 목덜미를 어루만져주니 나귀는 코를 벌름거리고 입을 투르르거렸다. 콧물이 " +
              "튀었다. 허 생원은 짐승 때문에 속도 무던히는 썩였다. 아이들의 장난이 심한 눈치여서 땀 밴 몸뚱" +
              "어리가 부들부들 떨리고 좀체 흥분이 식지 않는 모양이었다. 굴레가 벗어지고 안장도 떨어졌다. “요 " +
              "몹쓸 자식들” 하고 허 생원은 호령을 하였으나 패들은 벌써 줄행랑을 논 뒤요 몇 남지 않은 아이들" +
              "이 호령에 놀래 비슬비슬 멀어졌다.");
    addNotice("이것은 세 번째 공지사항입니다.",
              "최신 공지사항은 페이지 로드 시 자동으로 펼쳐집니다. 얍얍");

    clickEvent.initEvent('click', true, false);

    if (noticeList.hasChildNodes()) {
        noticeList.childNodes[0].dispatchEvent(clickEvent);
    }
};

console.log(window.location.host);

var chatSocket = new WebSocket("wss://" + window.location.host + "/chat");
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

    if (data["type"] == "messsage") {
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

var awesomeRefreshButton = document.getElementById("refresh_awesome_button");
var repoRefreshButton = document.getElementById("refresh_repo_button");

var repoDetailDiv = document.getElementById("repository_detail");

var myNameText = document.getElementById("my_name");

var noticeList = document.getElementById("notice_list");

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
                    totalCommit += userData["commit"];
                    repoDetailHtml += "<a href=" + "\""+ userData["link"] + "\"" + ">" + userData["name"] + "</a>";
                    repoDetailHtml += ": ";
                    for (var k = 0; k < userData.commit; k++) {
                        repoDetailHtml += "★"
                    }
                    repoDetailHtml += "<br>"
                    repoDetailHtml += String(userData.commit) + "commit";
                    repoDetailHtml += "<br>";
                }
                repoDetailHtml += "<h4>" + "total Commit: " +  String(totalCommit) + "commit" + "</h4>";
                repoDetailHtml += "<br>"
            }
            repoDetailDiv.innerHTML = repoDetailHtml
        }
    });
}