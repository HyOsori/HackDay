var timerID = null;
var timerRunning = false;

function stopclock () {
    if(timerRunning) clearTimeout(timerID);
    timerRunning = false;
}

function startclock () {
    stopclock();
    showtime();
}

function showtime() {
    now = new Date();
    var CurHour = now.getHours();
    var CurMinute = now.getMinutes();
    var CurDate = now.getDate();
    var CurSecond = now.getSeconds();
    var Hourleft = 9 - CurHour;
    var Minuteleft = 30 - CurMinute;
    var Secondleft = 0 - CurSecond;
    var Dateleft = 5 - CurDate;

    Hourleft += Dateleft * 24;

    if (Secondleft < 0) {
        Secondleft += 60;
        --Minuteleft;
    }
    if (Minuteleft < 0) {
        Minuteleft += 60;
        --Hourleft;
    }

    var timer = document.getElementById('timer');
    deadline = new Date(2017,11,5,9,30,0);

    if ((deadline.getTime() - now.getTime()) > 0) {
        var leftStr = "";
        if (Hourleft >= 0) {
          if (Hourleft < 10) { leftStr += '0'; }
          leftStr += Hourleft + " : ";
        }
        if (Minuteleft >= 0) {
          if (Minuteleft < 10) { leftStr += '0'; }
          leftStr += Minuteleft + " : ";
        }
        if (Secondleft < 10) { leftStr += '0'; }
        leftStr += Secondleft;
        timer.innerHTML = leftStr;
    }else{
        timer.innerHTML = '<div>행사가 종료되었습니다.</div>';
    }

    now = null;
    timerID = setTimeout("showtime()",1000);
    timerRunning = true;

}