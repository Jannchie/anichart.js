const _ = require("lodash");
const d3 = require("d3");
const anichart = require("../src/index.js");
const d = "http://localhost:8080/test-data.csv";
const m = "http://localhost:8080/test-meta.csv";
(async () => {
  let a = new anichart.Bar();
  a.node = true;
  a.drawBarExt = function (ctx, data, series) {
    let p = 12;
    let addWith = this.ctx.measureText(this.valueFormatter(data.value)).width;
    let x = this.innerMargin.left + series.xScale(data.value) + addWith + p;
    let y = series.yScale(data.pos);
    ctx.beginPath();
    ctx.radiusArea(x, y, 100, this.barHeight, this.barHeight / 3);
    ctx.closePath();
    ctx.strokeStyle = this.getColor(data);
    ctx.strokeWidth = 6;
    ctx.stroke();
    ctx.fillText("测试文字", x, y + this.barHeight * 0.88);
  };
  var last;
  var lastName;
  a.drawExt = function (ctx, series) {
    ctx.fillStyle = "#666";
    this.ctx.font = `900 32px Sarasa Mono SC`;
    ctx.textAlign = "right";
    let x = this.width - this.outerMargin.right;
    let y = 600;
    let p = 8;
    let top = _.minBy(series, (d) => d.pos);
    console.log(top);
    ctx.fillText("月度涨粉排行榜", x, y);
    ctx.fillText(
      `${top.name}：30日内涨${d3.format(",d")(top.value)}粉`,
      x,
      y + (32 + p) * 1
    );

    if (l == undefined || top.name != lastName)
      l = a.getCurrentDate(a.currentFrame);
    lastName = top.name;
    let last = a.getCurrentDate(a.currentFrame) - l;
    ctx.fillText(
      `霸榜${d3.format(",.2f")(last / 86400 / 1000)}天`,
      x,
      y + (32 + p) * 2
    );
  };

  await a.LoadCsv(d);
  await a.LoadMetaData(m);
  await a.readyToDraw();
  for (let f in d3.range(a.frameData.length)) {
    a.outputPng(f);
  }
})();
