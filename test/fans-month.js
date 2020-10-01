import * as anichart from "../src/index.js";
import * as d3 from "d3";
const _ = require("lodash");
import d from "./data/test-data.csv";
import m from "./data/test-meta.csv";

let settings = {
  width: 1366,
  height: 768,
  outerMargin: { left: 10, right: 10, top: 10, bottom: 10 },
  idField: "mid",
  frameRate: 60,
  freeze: 500,

  colorData: {
    生活: "#FFF",
    资讯: "#0CE",
    游戏: "#c02c38",
    美食: "#F7BD0B",
    动画: "#FB9FB1",
    国创: "#CC342B",
    音乐: "#20C38B",
    舞蹈: "#20C38B",
    时尚: "#FB7922",
    娱乐: "#FB7922",
    鬼畜: "#b167a9",
    知识: "#2472C8",
    数码: "#2472C8",
  },

  colorKey: (data, metaData, self) => {
    if (metaData[data.mid] == undefined) {
      return;
    }
    return metaData[data.mid].channel;
  },

  barInfo: (data, metaData, self) =>
    `${metaData[data.mid].channel}-${data.name}`,
  outputName: "fans-increase",
};

let a = new anichart.Bar(settings);

(async () => {
  a.drawBarExt = function (ctx, data, series) {
    let p = 12;
    let addWith = this.ctx.measureText(this.valueFormatter(data.value)).width;
    let x = this.innerMargin.left + series.xScale(data.value) + addWith + p;
    let y = series.yScale(data.pos);
    // ctx.beginPath();
    // ctx.radiusArea(x, y, 100, this.barHeight, this.barHeight / 3);
    // ctx.closePath();
    // ctx.strokeStyle = this.getColor(data);
    // ctx.strokeWidth = 6;
    // ctx.stroke();

    ctx.fillStyle = "#777";
    ctx.fillText(
      `[${new Intl.NumberFormat(this.language, {
        notation: "compact",
      }).format(data.total)}粉]`,
      x,
      y + this.barHeight * 0.88
    );
  };
  var l;
  var lastName;
  var recordValue;
  var recordDate;
  var recordName;
  a.drawExt = function (ctx, series) {
    ctx.fillStyle = "#999";
    ctx.textAlign = "right";
    let x = this.width - this.outerMargin.right;
    let y =
      this.height - this.outerMargin.bottom - this.dateLabelSize - 20 - 250;
    let p = 4;
    let top = _.minBy(series, (d) => d.pos);
    this.ctx.font = `900 38px Sarasa Mono SC`;
    ctx.fillStyle = "#DDD";
    ctx.fillText("涨粉排行榜: 30日涨粉数", x, y);
    ctx.fillStyle = "#999";
    this.ctx.font = `900 32px Sarasa Mono SC`;
    ctx.fillText(
      `${top.name} - ${a.metaData[top.mid].official}`,
      x,
      y + (32 + p) * 1
    );
    ctx.fillText(
      `30日内涨${d3.format(",d")(top.value)}粉`,
      x,
      y + (32 + p) * 2
    );

    if (l == undefined || top.name != lastName)
      l = a.getCurrentDate(a.currentFrame);
    lastName = top.name;
    let last = a.getCurrentDate(a.currentFrame) - l;
    ctx.fillText(
      `霸榜${d3.format(",.2f")(last / 86400 / 1000)}天`,
      x,
      y + (32 + p) * 3
    );
    if (recordValue == undefined) {
      recordValue = top.value;
      recordDate = top.date;
      recordName = top.name;
    } else {
      if (recordValue < top.value) {
        recordDate = a.getCurrentDate(a.currentFrame);
        recordValue = top.value;
        recordName = top.name;
      }
    }
    this.ctx.font = `900 38px Sarasa Mono SC`;
    ctx.fillStyle = "#DDD";
    ctx.fillText(`30日增速记录`, x, y + (38 + p) * 4);
    ctx.fillStyle = "#999";
    this.ctx.font = `900 32px Sarasa Mono SC`;
    ctx.fillText(
      `${recordName}: ${d3.format("+,.0f")(recordValue)}粉`,
      x,
      y + (38 + p) * 4 + 32 + p
    );
    ctx.fillText(
      `约${d3.timeFormat("%Y-%m-%d")(recordDate)}达成`,
      x,
      y + (38 + p) * 4 + (32 + p) * 2
    );
  };

  await a.LoadCsv(d);
  await a.LoadMetaData(m);
  a.initCanvas();
  console.log(a.barHeight);
  a.ctx.font = `900 ${a.barHeight}px Sarasa Mono SC`;
  a.innerMargin.right += a.ctx.measureText("[xxxx万粉]").width;
  a.readyToDraw();

  module.exports = a;
})();
