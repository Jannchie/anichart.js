import { LineChart } from "./../src/charts/line";
import * as ani from "../src/index";
import * as path from "path";
import { scaleLinear } from "d3-scale";
let d = path.join(__dirname, "./data/test.csv");
let s = new ani.Series();
let sceneOptions = {
  height: 400,
  width: 1600,
  output: false,
  useCtl: true,
  sec: 8,
  fps: 30,
  itemCount: 4,
};
const a = new ani.Scene(sceneOptions);

a.setCanvas();

function calPos(n: number) {
  let x = scaleLinear([0, 3], [0, 100]).clamp(true);
  return { x: x(n / a.fps), y: 100 };
}

let lines = new ani.TextLines({
  fillStyle: "#FFF",
  font: { fontSize: 18, font: "Sarasa Mono SC" },
  lineSpacing: 8,
  pos: { x: 50, y: 50 },
});

a.addComponent(lines);

lines.addComponent(
  new ani.Text({
    pos: calPos,
    alpha: scaleLinear([0, 1, 2, 3], [0, 1, 1, 0]).clamp(true),
    text: "基础设置文字 - 在lines中无法设置position",
  })
);

lines.addComponent(
  new ani.FadeText({
    time: 0.5,
    fade: 0.5,
    last: 2,
    text: "淡入淡出文字 - 自定义字号",
    font: { fontSize: 28 },
  })
);

lines.addComponent(
  new ani.FadeText({
    time: 0.5,
    fade: 0.5,
    last: 2,
    text: "Oblique / Small Caps / Bold",
    font: { fontStyle: "oblique", fontVariant: "small-caps", fontWeight: 800 },
  })
);

lines.addComponent(
  new ani.FadeText({
    time: 0.5,
    fade: 0.5,
    last: 2,
    text: "仅仅加粗的字体",
    font: { fontWeight: "bolder" },
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
let lineChart = new ani.LineChart({});
a.addComponent(lineChart);
sceneOptions.sec = 5;
let logoScene = new ani.Scene(sceneOptions);
logoScene.addComponent(
  new ani.BlurText({
    pos: { x: sceneOptions.width / 2, y: sceneOptions.height / 2 },
    fillStyle: "#FFF",
    font: {
      fontSize: 50,
      fontWeight: "bolder",
      textBaseline: "top",
      textAlign: "center",
      font: "微软雅黑",
    },
    text: "Anichart.js",
    time: 1,
    last: 2,
    blur: 2000,
    fade: 1.5,
  })
);
logoScene.addComponent(
  new ani.BlurText({
    pos: { x: sceneOptions.width / 2, y: sceneOptions.height / 2 },
    fillStyle: "#777",
    font: {
      fontSize: 24,
      textBaseline: "bottom",
      textAlign: "center",
      font: "微软雅黑",
    },
    text: "Powered By Jannchie Studio",
    time: 1,
    last: 2,
    blur: 2000,
    fade: 1.5,
  })
);
logoScene.setCanvas("canvas");
s.scenes.push(logoScene);
s.scenes.push(a);
(async () => {
  await lineChart.loadData(d);
  await s.play();
})();

export default a;
