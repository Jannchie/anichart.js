import { Text } from "../component/Text";
import { Ani } from "./Ani";

export class TextLinesAni extends Ani {
  component: Text = new Text();
  lineSpacing = 0;
  getComponent(sec: number) {
    this.component.text = "";
    this.component.children = [];
    let basePosY = 0;
    this.children.forEach((textAni) => {
      let comp;
      if (textAni instanceof Ani) {
        comp = textAni.getComponent(sec);
      } else {
        comp = textAni;
      }
      comp.position.y = basePosY;
      if (comp instanceof Text) {
        const fontSize = comp.fontSize
          ? comp.fontSize
          : this.component.fontSize;
        basePosY += comp.position.y + this.lineSpacing + fontSize;
      }
      this.component.children.push(comp);
    });
    return this.component;
  }
}
