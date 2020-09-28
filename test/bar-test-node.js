const anichart = require("../src/index.js");
const d = "http://localhost:8080/test-data.csv";
const m = "http://localhost:8080/test-meta.csv";
(async () => {
  console.log(anichart);
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
  a.drawExt = function (ctx, series) {
    ctx.fillStyle = "#FFF";
    ctx.textAlign = "right";
    let x = this.width - this.outerMargin.right;
    let y = 600;
    ctx.fillText("Hello, world", x, y);
  };

  await a.LoadCsv(d);
  await a.LoadMetaData(m);
  await a.readyToDraw();

  await outputPng(2, "test");
})();
