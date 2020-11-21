import ani from "../src/index";
import * as path from "path";
import { scaleLinear } from "d3-scale";
let d = path.join(__dirname, "./data/test.csv");
console.log(d);

const a = new ani.BaseChart({
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
a.addComponent(
  new ani.Text({
    pos: calPos,
    alpha: scaleLinear([0, 1, 2, 3], [0, 1, 1, 0]).clamp(true),
    text: "全自定义文字",
    fillStyle: "#FFF",
    font: `${18}px Sarasa Mono SC`,
  })
);

a.addComponent(
  new ani.FadeText({
    pos: { x: 20, y: 128 },
    time: 0.5,
    fade: 0.5,
    last: 2,
    text: "淡入淡出文字",
    fillStyle: "#FFF",
    font: `${18}px Sarasa Mono SC`,
  })
);

a.addComponent(
  new ani.RiseText({
    pos: { x: 20, y: 156 },
    time: 0.5,
    fade: 0.5,
    last: 2,
    offset: 50,
    text: "上下浮现文字",
    reverse: true,
    fillStyle: "#FFF",
    font: `${18}px Sarasa Mono SC`,
  })
);

a.addComponent(
  new ani.BlurText({
    pos: { x: 20, y: 184 },
    time: 0.5,
    fade: 0.5,
    last: 2,
    text: "模糊呈现文字",
    blur: 4,
    fillStyle: "#FFF",
    font: `${18}px Sarasa Mono SC`,
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
