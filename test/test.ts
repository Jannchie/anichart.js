import ani from "../src/index";
import * as path from "path";
import { TextComponent } from "../src/components";
let d = path.join(__dirname, "./data/test.csv");
console.log(d);

const a = new ani.BaseChart({
  height: 400,
  output: false,
  useCtl: true,
  sec: 10,
  itemCount: 4,
});
a.setCanvas();
a.addComponent(
  new TextComponent({
    pos: { x: 50, y: 50 },
    time: 1,
    fade: 1,
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
