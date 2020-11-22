import ani from "../src/index";
import * as path from "path";
import { scaleLinear } from "d3-scale";
let d = path.join(__dirname, "./data/test.csv");
console.log(d);

const a = new ani.Scene({
  height: 400,
  output: false,
  useCtl: true,
  sec: 4,
  fps: 60,
  itemCount: 4,
});
a.setCanvas();
function calPos(n: number) {
  let x = scaleLinear([0, 3], [0, 100]).clamp(true);
  return { x: x(n / a.fps), y: 100 };
}
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

(async () => {
  await a.loadData(d);
  a.play();
})();

if (typeof window != "undefined") {
  console.log(a);
}
export default a;
