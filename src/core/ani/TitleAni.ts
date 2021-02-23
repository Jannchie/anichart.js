import { Component } from "../component/Component";
import { getTextWithBackground } from "../custom/TextWithBackGround";
import { customInOut, ease } from "../util/Ease";
import { getFadeWrapped } from "../wrapper/Fade";
import { getScaleWrapped } from "../wrapper/Scale";
import { Ani } from "./Ani";
import { customAni } from "./AniCreator";
export class TiTleAniAlpha extends Ani {
  getComponent(sec: number) {
    const result = new Component();
    return result;
  }
}

export function getTitleAniStyle1({
  txt = "标题文字",
  position = { x: 0, y: 0 },
}) {
  const comp1 = getTextWithBackground({
    txt,
    position,
  });
  (comp1.children[0] as any).shape.width = 15;
  (comp1.children[0] as any).children[0].position.x = 15;
  const comp2 = getTextWithBackground({
    txt,
    position,
  });
  const textAni: Ani = customAni(3.5)
    .keyFrame(comp1)
    .duration(1, ease.easeExpOut)
    .keyFrame(comp2);
  const res = getFadeWrapped(
    getScaleWrapped(textAni, customInOut([3, 3.9, 4, 5], [2, 1])),
    customInOut([3, 3.2, 5.8, 6], [0, 1])
  );
  return res;
}
