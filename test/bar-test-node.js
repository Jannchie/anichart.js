const d3 = require("d3");
const anichart = require("../src/index.js");
const settings = require("./test-settings.js")
const d = "E:/code/d3/anichart/test/data/test-data.csv";
const m = "E:/code/d3/anichart/test/data/test-meta.csv";
(async () => {
  let a = new anichart.Bar(settings);
  await a.loadCsv(d);
  await a.loadMetaData(m);
  await a.initCanvas();
  await a.readyToDraw();
  for (let f in d3.range(a.frameData.length)) {
    a.outputPng(f);
  }
})();
