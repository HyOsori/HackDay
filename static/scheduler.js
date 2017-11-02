var Type = ["total", "event", "development", "break"];
var color = ["#F5D0A9", "#F2F5A9", "#F6E3CE", "#F6CEE3"];
var schedule = [
  {
    "time": "15:30 - 16:00",
    "length": 3, // * 10minutes
    "activity": "집합 및 행사 소개",
    "type": "event"
  },
  {
    "time": "16:00 - 16:40",
    "length": 4,
    "activity": "선배들의 강연",
    "type": "event"
  },
  {
    "time": "16:40 - 18:30",
    "length": 11,
    "activity": "아이디어 회의",
    "type": "development"
  },
  {
    "time": "18:30 - 20:00",
    "length": 9,
    "activity": "저녁 식사",
    "type": "break"
  },
  {
    "time": "20:00 - 20:40",
    "length": 4,
    "activity": "팀별 아이디어 발표",
    "type": "event"
  },
  {
    "time": "20:40 - 00:00",
    "length": 20,
    "activity": "프로그래밍",
    "type": "development"
  },
  {
    "time": "00:00 - 01:00",
    "length": 6,
    "activity": "야식 및 중간점검",
    "type": "break"
  },
  {
    "time": "01:00 - 08:00",
    "length": 42,
    "activity": "프로그래밍",
    "type": "development"
  },
  {
    "time": "08:00 - 09:00",
    "length": 6,
    "activity": "최종 발표 및 시상",
    "type": "event"
  },
  {
    "time": "09:00 - 09:30",
    "length": 3,
    "activity": "청소 및 행사 종료",
    "type": "event"
  }
];

var margin = {top: 20, right: 20, left: 50, bottom: 20};

var chart
  = d3.select("#schedule_chart")
      .append("svg")
      .attr("width", "930px")
      .attr("height", "200px")
      .append("g")
      .attr("id", "schedules")
      .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

var y
  = d3.scale.linear()
      .domain([0, 2])
      .range([20, 80]);

var x
  = d3.scale.linear()
      .domain([0, 108])
      .range([0, 756]);

var type
  = chart.selectAll(".type")
          .data(Type)
          .enter()
          .append("g")
          .attr("class", "type")
          .attr("transform", function(d, i) { return "translate(0, " + y(i) + ")" });

var time = 80;

schedule.forEach(function(obj, i) {
  chart.selectAll(".type")
        .append("rect")
        .attr("class", "minutes")
        .attr("y", -10)
        .attr("height", 20)
        .attr("x", time)
        .attr('width', x(obj.length))
        .style('fill', function(d, index) {
          if (index == 0) {
            return color[0];
          }
          if (Type[index] == obj.type) {
            return color[index];
          } else {
            return "rgba(0,0,0,0)";
          }
        })
        .on('mouseover', function(d, index) {
          if (index == 0 || Type[index] == obj.type) {
            d3.select(this).style('fill', '#FFF9C4');

            d3.select('#tooltip')
              .style({
                left: window.event.clientX + 'px',
                top: window.event.clientY + 'px'
              })
              .select('#time')
              .text(obj.time);

            d3.select('#tooltip')
              .select('#activity')
              .text(obj.activity);

            d3.select('#tooltip').classed('hidden', false);
          }
        })
        .on('mouseout', function(d, index) {
          d3.select(this)
            .style('fill', function() {
              if (index == 0) {
                return color[0];
              }
              if (Type[index] == obj.type) {
                return color[index];
              } else {
                return "rgba(0,0,0,0)";
              }
            });
          d3.select('#tooltip').classed('hidden', true);
        });
  time += x(obj.length);
});

chart.selectAll(".type")
  .append("text")
  .attr("x", -50)
  .attr("y", 5)
  .text(function(d, i) { return Type[i] });

d3.select("#schedules")
  .append("rect")
  .attr('id', 'schedule_line')
  .attr('width', 2)
  .attr('height', 112)
  .attr('x', 80)
  .attr('y', 9)
  .style('fill', '#ff0000');


var startMoveLine = setInterval(moveLine, 60000);

function moveLine() {
  var now = new Date();
  var start = new Date("Sat Nov 04 2017 15:30:00 GMT+0900");
  var end = new Date("Sun Nov 05 2017 09:30:00 GMT+0900");

  if (start.getTime() > now.getTime()) {
    d3.select("#schedule_line").attr("x", 80);
    clearInterval(startMoveLine);
    return;
  } else if (now.getTime() > end.getTime()) {
    d3.select("#schedule_line").attr("x", 836);
    clearInterval(startMoveLine);
    return;
  }

  var pastDate = now.getDate() - start.getDate();
  var pastHour = now.getHours() - start.getHours();
  var pastMinute = now.getMinutes() - start.getMinutes();
  var pastSecond = now.getSeconds() - start.getSeconds();

  pastHour += pastDate * 24;
  pastMinute += pastHour * 60;

  d3.select("#schedule_line")
    .attr("x", 80 + pastMinute * 0.7);
}