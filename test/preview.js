const anichart = require("../dist/anichart");
const d3 = require("d3");
const path = require("path");
const _ = require("lodash");
let d = path.join(__dirname, "./data/test.csv");
if (typeof window != "undefined") {
  d = require("./data/test.csv");
}
const a = new window.anichart.Bar({
  height: 400,
  output: false,
  useCtl: true,
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
