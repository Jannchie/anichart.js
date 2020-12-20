import { TextAni } from "../src/core/ani/TextAni";
import { Stage } from "../src/core/Stage";

const stage = new Stage();
const textAni = new TextAni();
textAni.component.text = "Test";
textAni.component.fontSize = 24;
textAni.component.font = "Sarasa Mono SC";
stage.addChild(textAni);
stage.play();
(window as any).stage = stage;
