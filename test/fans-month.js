let getAnichart = async () => {
  const anichart = require("../src/index.js");
  const d3 = require("d3");
  const path = require("path");
  const _ = require("lodash");
  let d = path.join(__dirname, "./data/fans-desc-data.csv");
  let m = path.join(__dirname, "./data/fans-desc-meta.csv");
  if (typeof window != "undefined") {
    d = require("./data/fans-desc-data.csv");
    m = require("./data/fans-desc-meta.csv");
  }
  let settings = {
    output: false,

    width: 1960,
    height: 1080,
    outerMargin: { left: 10, right: 10, top: 10, bottom: 10 },
    idField: "mid",
    frameRate: 60,
    freeze: 60,
    sort: 1,
    xDomain(series) {
      // return [0, series.max];
      return [0, series.max];
    },
    imageDict: (metaData, self) => {
      let tmp = Object.entries(metaData).map((d) => d[1]);
      return _.reduce(
        tmp,
        (pv, cv) => {
          if (["jpg", "png"].indexOf(cv.image.split(".")[3]) == -1) {
            return pv;
          }
          pv[
            cv[self.idField]
          ] = `${cv.image}@${self.barHeight}w_${self.barHeight}h.jpg`;
          return pv;
        },
        {}
      );
    },
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

    label: () => ``,
    valueFormat: (d) => {
      return `${d3.format("+,d")(d.value)}粉/周`;
    },

    outputName: "inc",
  };

  let a = new anichart.Bar(settings);
  a.drawBarExt = function (ctx, data, series, self) {
    let p = 12;
    let addWith = this.ctx.measureText(this.valueFormat(data)).width;
    let x = this.innerMargin.left + series.xScale(data.value) + addWith + p;
    let y = series.yScale(data.pos);
    ctx.fillStyle = "#777";
    ctx.fillText(
      `[${(data.total / 10000).toFixed(1)}万粉]`,
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
    ctx.fillText("涨粉排行榜: 7日涨粉数", x, y);
    ctx.fillStyle = "#999";
    this.ctx.font = `900 34px Sarasa Mono SC`;
    ctx.fillText(
      `${top.name} - ${a.metaData[top.mid].official}`,
      x,
      y + (34 + p) * 1
    );
    ctx.fillText(`7日内${d3.format("+,d")(top.value)}粉`, x, y + (34 + p) * 2);

    if (l == undefined || top.name != lastName) {
      console.log(top.name, lastName);
      l = a.getCurrentDate(a.currentFrame);
    }
    lastName = top.name;
    let last = a.getCurrentDate(a.currentFrame) - l;
    ctx.fillText(
      `霸榜${d3.format(",.2f")(last / 86400 / 1000)}天`,
      x,
      y + (34 + p) * 3
    );
    if (recordValue == undefined) {
      recordValue = top.value;
      recordDate = top.date;
      recordName = top.name;
    } else {
      if (recordValue > top.value) {
        recordDate = a.getCurrentDate(a.currentFrame);
        recordValue = top.value;
        recordName = top.name;
      }
    }
    this.ctx.font = `900 38px Sarasa Mono SC`;
    ctx.fillStyle = "#DDD";
    ctx.fillText(`7日记录`, x, y + (38 + p) * 4);
    ctx.fillStyle = "#999";
    this.ctx.font = `900 34px Sarasa Mono SC`;
    ctx.fillText(
      `${recordName}: ${d3.format("+,.0f")(recordValue)}粉`,
      x,
      y + (38 + p) * 4 + 34 + p
    );
    ctx.fillText(
      `约${d3.timeFormat("%Y-%m-%d")(recordDate)}达成`,
      x,
      y + (38 + p) * 4 + (34 + p) * 2
    );
  };
  await a.loadCsv(d);
  await a.loadMetaData(m);
  await a.initCanvas();
  a.ctx.font = `900 ${a.barHeight}px Sarasa Mono SC`;
  a.innerMargin.right += a.ctx.measureText("[1511.1万粉]").width;
  if (typeof window != "undefined") {
    window.a = a;
  }
  return a;
};
module.exports = getAnichart;
