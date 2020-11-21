import ani from "../src/index";
import * as path from "path";
import { Text, FadeText } from "../src/components";
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
  new Text({
    pos: calPos,
    alpha: scaleLinear([0, 1, 2, 3], [0, 1, 1, 0]).clamp(true),
    text: "测试文本",
    fillStyle: "#FFF",
    font: `${18}px Sarasa Mono SC`,
  })
);

a.addComponent(
  new FadeText({
    pos: { x: 20, y: 128 },
    time: 0.5,
    fade: 0.5,
    last: 2,
    text: "测试文本",
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
