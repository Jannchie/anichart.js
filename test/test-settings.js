
const d3 = require("d3");
const _ = require("lodash");
let settings = {
  width: 1366,
  height: 768,
  outerMargin: { left: 10, right: 10, top: 10, bottom: 10 },
  idField: "mid",
  frameRate: 24,
  freeze: 500,
  keyFrameDeltaTime: 86400 * 0.5,

  imageDict: (metaData, self) => {
    let tmp = Object.entries(metaData).map((d) => d[1]);
    return _.reduce(tmp, (pv, cv) => {
      pv[cv[self.idField]] = `${cv.image}@${self.barHeight}w_${self.barHeight}h.png`;
      return pv;
    }, {})
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
  valueFormat: (d) => `${d3.format("+,.2f")(d.value / 10000)}万粉/月`,

  outputName: "fans-increase",
};
module.exports = settings;