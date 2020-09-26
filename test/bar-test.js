import * as anichart from "../src/index.js";
import d from "./data/fans_data_final.csv";
import m from "./data/fans_data_meta.csv";

export default async () => {
  let a = new anichart.Bar();
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
  a.readyToDraw();
  window.a = a;
};
