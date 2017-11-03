/**
 * Created by junsu on 2017-11-03.
 */
var noticeTitleTextBox = document.getElementById("notice_title");
var noticeMessageTextBox = document.getElementById("notice_message");
var noticeAuthTextBox = document.getElementById("notice_auth");

var noticeSendButton = document.getElementById("notice_send");
noticeSendButton.onclick = function () {
    $.ajax({
        contentType: 'application/json',
        dataType: "json",
        type: 'POST',
        data: JSON.stringify({
            title: noticeTitleTextBox.value,
            message: noticeMessageTextBox.value,
            auth: noticeAuthTextBox.value
        }),
        url: '/admin',
        success: function (result) {
            console.log(result);
            alert(result["response"]);
        }
    });
};