import { createAni } from "../src/core/ani/AniCreator";
import { ease } from "../src/core/ani/Ease";
import { RectAni } from "../src/core/ani/RectAni";
import { TextAni } from "../src/core/ani/TextAni";
import { TextLinesAni } from "../src/core/ani/TextLinesAni";
import { Rect } from "../src/core/component/Rect";
import { Stage } from "../src/core/Stage";
import { Image } from "../src/core/component/Image";
import { recourse } from "../src/core/Recourse";
const stage = new Stage();

const bgAni = new RectAni();
bgAni.component.shape = {
  width: stage.canvas.width,
  height: stage.canvas.height,
};
bgAni.component.fillStyle = "#1e1e1e";

const textLinesAni = new TextLinesAni();

textLinesAni.component.fillStyle = "#eee";
textLinesAni.component.textAlign = "center";
textLinesAni.component.textBaseline = "middle";
textLinesAni.component.position = {
  x: stage.canvas.width / 2,
  y: stage.canvas.height / 2,
};

const textAnichart = new TextAni();
textAnichart.component.fontSize = 48;
textAnichart.component.font = "Sarasa Mono Slab SC";
textAnichart.component.text = "Anichart";
textAnichart.component.fontWeight = "bolder";
textAnichart.type = "blur";

const textJannchieStudio = new TextAni();
textJannchieStudio.component.fillStyle = "#666";
textJannchieStudio.component.fontSize = 24;
textJannchieStudio.component.text = "Powered by Jannchie Studio";
textJannchieStudio.component.font = "Sarasa Mono Slab SC";
textJannchieStudio.type = "blur";

textLinesAni.children.push(textAnichart);
textLinesAni.children.push(textJannchieStudio);

const rectAni = createAni(
  [
    new Rect({
      position: { x: 100, y: 0 },
      shape: { width: 100, height: 0 },
      fillStyle: "#d23",
    }),
    new Rect({
      shape: { width: 100, height: 200 },
      fillStyle: "#2a3",
    }),
    new Rect({
      shape: { width: 100, height: 0 },
      fillStyle: "#569",
    }),
  ],
  [0, 1, 2],
  ease.easeElastic
);

recourse.load("./data/ANI.png");
const logo = new Image({
  path: "./data/ANI.png",
  position: {
    x: stage.canvas.width - 128,
    y: stage.canvas.height - 108,
  },
  shape: { width: 128, height: 128 },
});
const logo0 = new Image({
  path: "./data/ANI.png",
  position: {
    x: 0,
    y: stage.canvas.height - 108,
  },
  shape: { width: 128, height: 128 },
});
const logoAni = createAni([logo0, logo], [0, 1], ease.easeElastic);

stage.addChild(bgAni);
stage.addChild(textLinesAni);
stage.addChild(rectAni);
stage.addChild(logoAni);

stage.options.sec = 3;
stage.play();
(window as any).stage = stage;
