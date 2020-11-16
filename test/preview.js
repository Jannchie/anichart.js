const anichart = require("../src/index.js");
const d3 = require("d3");
const path = require("path");
const _ = require("lodash");
let d = path.join(__dirname, "./data/preview.csv");
let m = path.join(__dirname, "./data/preview.csv");
if (typeof window != "undefined") {
  d = require("./data/preview.csv");
  m = require("./data/preview.csv");
}

const a = new window.anichart.Bar({
  height: 400,
  output: false,
  useCtl: false,
  itemCount: 4,
});
(async () => {
  a.initCanvas();
  await a.loadCsv(d);
  await a.readyToDraw();
})();

if (typeof window != "undefined") {
  window.a = a;
}
module.exports = a;
