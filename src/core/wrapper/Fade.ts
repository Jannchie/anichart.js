import { Ani } from "../ani/Ani";
import { Component } from "../component/Component";

export function getFadeWrapped(
  child: Component | Ani,
  alpha: (sec: number) => number
) {
  const ani = new Ani();
  const comp = new Component();
  if (child instanceof Component) {
    comp.children.push(child);
    ani.getComponent = (sec) => {
      const a = alpha(sec);
      comp.alpha = a;
      return comp;
    };
  } else {
    ani.getComponent = (sec) => {
      const c = child.getComponent(sec);
      if (c == null) return null;
      const a = alpha(sec);
      c.alpha = a;
      comp.children = [c];
      return comp;
    };
  }
  return ani;
}
