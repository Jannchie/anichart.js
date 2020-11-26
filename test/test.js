const ani = require("../dist/anichart");
const path = require("path");
const d3 = require("d3");
let d = path.join(__dirname, "./data/test.csv");

const a = new ani.Scene({
  height: 400,
  output: false,
  useCtl: true,
  sec: 4,
  fps: 60,
  itemCount: 4,
});
a.setCanvas();
let lines = new ani.TextLines({
  fillStyle: "#FFF",
  font: "Sarasa Mono SC",
  fontSize: 18,
  lineSpacing: 8,
  pos: { x: 50, y: 50 },
});
a.addComponent(lines);
lines.addComponent(
  new ani.Text({
    alpha: d3.scaleLinear([0, 1, 2, 3], [0, 1, 1, 0]).clamp(true),
    text: "基础设置文字 - 在lines中无法设置position",
  })
);

lines.addComponent(
  new ani.FadeText({
    time: 0.5,
    fade: 0.5,
    last: 2,
    text: "淡入淡出文字 - 自定义字号",
    fontSize: 24,
  })
);

lines.addComponent(
  new ani.RiseText({
    time: 0.5,
    fade: 0.5,
    last: 2,
    offsetY: 50,
    text: "上下浮现文字 - 自定义颜色",
    fillStyle: "#2AF",
    reverse: true,
  })
);

lines.addComponent(
  new ani.BlurText({
    time: 0.5,
    fade: 0.5,
    last: 2,
    text: "模糊呈现文字 - 使用默认配置",
    blur: 4,
  })
);
const lineChart = new ani.LineChart();
a.addComponent(lineChart);
(async () => {
  lineChart.loadData(d);
  a.update();
  a.player.play();
})();

module.exports = a;
