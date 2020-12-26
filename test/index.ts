import { RectAni } from "../src/core/ani/RectAni";
import { TextAni } from "../src/core/ani/TextAni";
import { Stage } from "../src/core/Stage";

const stage = new Stage();

const bgAni = new RectAni();
bgAni.component.shape = {
  width: stage.canvas.width,
  height: stage.canvas.height,
};
bgAni.component.fillStyle = "#1e1e1e";

const textAni = new TextAni();
textAni.component.text = "Anichart";
textAni.component.fontSize = 48;
textAni.component.font = "Sarasa Mono Slab SC";
textAni.type = "blur";
textAni.component.textAlign = "center";
textAni.component.textBaseline = "middle";
textAni.component.fontWeight = "bolder";
textAni.component.fillStyle = "#eee";
textAni.component.position = {
  x: stage.canvas.width / 2,
  y: stage.canvas.height / 2,
};

stage.addChild(bgAni);
stage.addChild(textAni);

stage.options.sec = 3;
stage.play();
(window as any).stage = stage;
