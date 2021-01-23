import * as ani from "../src/index";
import * as d3 from "d3";
const stage = new ani.Stage();
stage.options.fps = 60;
stage.options.sec = 12;
stage.output = false;

const bgAni = new ani.RectAni();
bgAni.component.shape = {
  width: stage.canvas.width,
  height: stage.canvas.height,
};
bgAni.component.fillStyle = "#1e1e1e";

const textLinesAni = new ani.TextLinesAni();

textLinesAni.component.fillStyle = "#eee";
textLinesAni.component.textAlign = "center";
textLinesAni.component.textBaseline = "middle";
textLinesAni.component.position = {
  x: stage.canvas.width / 2,
  y: stage.canvas.height / 2,
};

const textAnichart = new ani.TextAni();
textAnichart.component.fontSize = 48;
textAnichart.component.font = "Sarasa Mono Slab SC";
textAnichart.component.text = "Anichart";
textAnichart.component.fontWeight = "bolder";
textAnichart.type = "blur";

const textJannchieStudio = new ani.TextAni();
textJannchieStudio.component.fillStyle = "#666";
textJannchieStudio.component.fontSize = 24;
textJannchieStudio.component.text = "Powered by Jannchie Studio";
textJannchieStudio.component.font = "Sarasa Mono Slab SC";
textJannchieStudio.type = "blur";

textLinesAni.children.push(textAnichart);
textLinesAni.children.push(textJannchieStudio);

ani.recourse.loadImage("./data/ANI.png", "logo");
ani.recourse.loadImage(
  "https://avatars3.githubusercontent.com/u/29743310?s=460&u=8e0d49b98c35738afadc04e70c7f3918d6ad8cdb&v=4",
  "jannchie"
);

ani.recourse.loadData("./data/test.csv", "data");
ani.recourse.loadData("./data/test-meta.csv", "meta");

const rectAni = ani.createAni(
  [
    new ani.Rect({
      position: { x: 100, y: 0 },
      shape: { width: 100, height: 0 },
      fillStyle: "#d23",
    }),
    new ani.Rect({
      shape: { width: 100, height: 200 },
      fillStyle: "#2a3",
      alpha: 1,
    }),
    new ani.Rect({
      shape: { width: 100, height: 0 },
      fillStyle: "#569",
      alpha: 0,
    }),
  ],
  [0, 1, 2],
  ani.ease.easeElastic
);

const logoCenter = new ani.Image({
  path: "./data/ANI.png",
  position: {
    x: stage.canvas.width / 2,
    y: stage.canvas.height / 2,
  },
  alpha: 0.25,
  center: { x: 128, y: 128 },
  shape: { width: 256, height: 256 },
});
const logoAni = ani.createAni(
  [
    new ani.Image({
      path: "./data/ANI.png",
      position: {
        x: 0,
        y: stage.canvas.height - 108,
      },
      shape: { width: 128, height: 128 },
    }),
    new ani.Image({
      path: "./data/ANI.png",
      position: {
        x: stage.canvas.width - 128,
        y: stage.canvas.height - 108,
      },
      shape: { width: 128, height: 128 },
      alpha: 1.0,
    }),
    new ani.Image({
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
  ani.ease.easeBounce
);

const barChart = new ani.BarChart({
  shape: { width: stage.canvas.width, height: stage.canvas.height },
  labelFormat(id) {
    return id;
    // return meta.get(id).name;
  },
  aniTime: [4, 10],
});

const lineChart = new ani.LineChart({
  aniTime: [4, 10],
  shape: { width: stage.canvas.width, height: stage.canvas.height / 2 },
  position: { x: 0, y: stage.canvas.height / 2 },
});
const a = ani
  .customAni(0)
  .keyFrame(
    new ani.Rect({
      position: { x: 300, y: 300 },
      center: { x: 150, y: 150 },
      shape: { width: 300, height: 300 },
      fillStyle: "#fff",
      radius: 150,
    })
  )
  .duration(1, d3.easeBounce)
  .keyFrame(
    new ani.Rect({
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
// stage.addChild(lineChart);

const progress = new ani.Progress({
  position: { x: stage.canvas.width / 2, y: stage.canvas.height / 2 },
});

const pie = new ani.PieChart({
  aniTime: [4, 10],
  radius: [80, 120],
  position: { x: stage.canvas.width / 2, y: stage.canvas.height / 2 },
});
stage.addChild(pie);
stage.addChild(progress);
// // Bit Coin Chart
// ani.recourse.loadData("./data/bitcoin.csv", "bitcoin");
// stage.addChild(
//   new ani.LineChart({
//     shape: { width: stage.canvas.width, height: stage.canvas.height },
//     aniTime: [0, 10],
//     dataName: "bitcoin",
//     valueField: "Price",
//     dateField: "Date",
//     pointerR: 0,
//     valueFormat: (d) => {
//       return d3.format(",.2f")(d.Price);
//     },
//   })
// );
stage.play();

(window as any).stage = stage;
(window as any).d3 = d3;
