import * as ani from "../src/index";
import * as path from "path";
import * as d3 from "d3";
import Pos from "../src/utils/position";
const d = path.join(__dirname, "./data/test.csv");
const seriesOptions = {
  player: {
    fps: 144,
  },
};
const s = new ani.Series(seriesOptions);
const sceneOptions = {
  player: {
    sec: 10,
    fps: 144,
  },
};

const a = new ani.Scene(sceneOptions);
sceneOptions.player.fps = 30;
sceneOptions.player.sec = 5;
const lines = new ani.TextLines({
  fillStyle: "#FFF",
  font: { fontSize: 18, font: "Sarasa Mono SC" },
  lineSpacing: 8,
  pos: { x: 50, y: 50 },
});
const shape = { height: 400, width: 800 };

a.addComponent(lines);

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
const lineChart = new ani.LineChart({ days: 2 });
a.addComponent(lineChart);
const logoScene = new ani.Scene(sceneOptions);
logoScene.update();

const scalePos = d3
  .scaleLinear(
    [0, 5],
    [
      { x: shape.width / 2 - 60, y: shape.height / 2 - 100 } as Pos,
      { x: shape.width / 2 - 60, y: shape.height / 2 - 60 } as Pos,
    ]
  )
  .clamp(true);
const posCal = (sec: number) => {
  return scalePos(d3.easeCubicOut(sec / 5) * 5);
};
const scaleAlpha = d3.scaleLinear([1, 2, 4.9, 5], [0, 1, 1, 0]).clamp(true);
const alpha = (sec: number) => {
  return scaleAlpha(d3.easeCubicOut(sec / 5) * 5);
};

logoScene.addComponent(
  new ani.ImageComponent({
    imagePath:
      "https://github.com/Jannchie/anichart.js/blob/master/public/image/ANI.png?raw=true",
    shape: { width: 120, height: 120 },
    pos: posCal,
    alpha,
  })
);
logoScene.addComponent(
  new ani.BlurText({
    pos: {
      x: shape.width / 2,
      y: shape.height / 2,
    },
    fillStyle: "#FFF",
    font: {
      fontSize: 80,
      fontWeight: "bolder",
      textBaseline: "top",
      textAlign: "center",
      font: "微软雅黑",
    },
    text: "Anichart.js",
    time: 1,
    last: 2,
    blur: 20,
    fade: 0.3,
    shadow: {
      enable: true,
      color: "#FFF6",
      blur: 15,
    },
  })
);

logoScene.addComponent(
  new ani.BlurText({
    pos: {
      x: shape.width / 2,
      y: shape.height / 2,
    },
    fillStyle: "#777",
    font: {
      fontSize: 24,
      textBaseline: "bottom",
      textAlign: "center",
      font: "微软雅黑",
    },
    text: "Powered By Jannchie Studio",
    time: 1.2,
    last: 1.8,
    blur: 15,
    fade: 1,
    shadow: {
      color: "#FFF6",
      blur: 12,
      enable: true,
    },
  })
);
s.addScene(logoScene);
s.addScene(a);
s.setCanvas();
s.renderer.shape = shape;
(async () => {
  await lineChart.loadData(d);
  s.play();
})();

export default a;
