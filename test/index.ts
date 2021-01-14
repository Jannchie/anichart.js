import { customAni, createAni } from "../src/core/ani/AniCreator";
import { ease } from "../src/core/ani/Ease";
import { RectAni } from "../src/core/ani/RectAni";
import { TextAni } from "../src/core/ani/TextAni";
import { TextLinesAni } from "../src/core/ani/TextLinesAni";
import { Rect } from "../src/core/component/Rect";
import { Stage } from "../src/core/Stage";
import { Image } from "../src/core/component/Image";
import { recourse } from "../src/core/Recourse";
import { BarChart } from "../src/core/chart/BarChart";
import * as d3 from "d3";
import { LineChart } from "../src/core/chart/LineChart";
import { Progress } from "../src/core/ani/Progress";
const stage = new Stage();
stage.options.fps = 60;
stage.options.sec = 12;
stage.output = true;

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

recourse.loadImage("./data/ANI.png", "logo");
recourse.loadImage(
  "https://avatars3.githubusercontent.com/u/29743310?s=460&u=8e0d49b98c35738afadc04e70c7f3918d6ad8cdb&v=4",
  "jannchie"
);

recourse.loadData("./data/test.csv", "data");
recourse.loadData("./data/test-meta.csv", "meta");

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
      alpha: 1,
    }),
    new Rect({
      shape: { width: 100, height: 0 },
      fillStyle: "#569",
      alpha: 0,
    }),
  ],
  [0, 1, 2],
  ease.easeElastic
);

const logoCenter = new Image({
  path: "./data/ANI.png",
  position: {
    x: stage.canvas.width / 2,
    y: stage.canvas.height / 2,
  },
  alpha: 0.25,
  center: { x: 128, y: 128 },
  shape: { width: 256, height: 256 },
});
const logoAni = createAni(
  [
    new Image({
      path: "./data/ANI.png",
      position: {
        x: 0,
        y: stage.canvas.height - 108,
      },
      shape: { width: 128, height: 128 },
    }),
    new Image({
      path: "./data/ANI.png",
      position: {
        x: stage.canvas.width - 128,
        y: stage.canvas.height - 108,
      },
      shape: { width: 128, height: 128 },
      alpha: 1.0,
    }),
    new Image({
      path: "./data/ANI.png",
      position: {
        x: stage.canvas.width - 128,
        y: stage.canvas.height - 108,
      },
      shape: { width: 128, height: 128 },
      alpha: 0,
    }),
  ],
  [0, 1, 2],
  ease.easeBounce
);

const barChart = new BarChart({
  shape: { width: stage.canvas.width, height: stage.canvas.height },
  labelFormat(id) {
    return id;
    // return meta.get(id).name;
  },
  aniTime: [4, 10],
});

const lineChart = new LineChart({
  aniTime: [4, 10],
  shape: { width: stage.canvas.width, height: stage.canvas.height / 2 },
  position: { x: 0, y: stage.canvas.height / 2 },
});
const a = customAni(0)
  .keyFrame(
    new Rect({
      position: { x: 300, y: 300 },
      center: { x: 150, y: 150 },
      shape: { width: 300, height: 300 },
      fillStyle: "#fff",
      radius: 150,
    })
  )
  .duration(1, d3.easeBounce)
  .keyFrame(
    new Rect({
      position: { x: 300, y: 300 },
      center: { x: 0, y: 0 },
      shape: { width: 0, height: 0 },
      fillStyle: "#d23",
      radius: 0,
    })
  );

stage.addChild(bgAni);
stage.addChild(a);
stage.addChild(logoCenter);
stage.addChild(textLinesAni);
stage.addChild(rectAni);
stage.addChild(logoAni);
stage.addChild(barChart);
stage.addChild(lineChart);

const progress = new Progress({
  position: { x: stage.canvas.width / 2, y: stage.canvas.height / 2 },
});
stage.addChild(progress);
stage.play();

(window as any).stage = stage;
(window as any).d3 = d3;
