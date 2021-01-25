import { Ani } from "../ani/Ani";
import { Component } from "../component/Component";
import { Rect } from "../component/Rect";

export function addScaleWrapper(
  child: Ani | Component,
  scale: (sec: number) => { x: number; y: number }
) {
  const ani = new Ani();
  const wrapper = new Component();
  if (child instanceof Ani) {
    ani.getComponent = (sec) => {
      const comp = child.getComponent(sec);
      if (!comp) return null;
      wrapper.position = { x: comp.position.x, y: comp.position.y };
      comp.position = { x: 0, y: 0 };
      wrapper.scale = scale(sec);
      wrapper.children = [comp];
      return wrapper;
    };
  } else {
    wrapper.children.push(child);
    wrapper.position = { x: child.position.x, y: child.position.y };
    ani.getComponent = (sec) => {
      wrapper.scale = scale(sec);
      child.position = { x: 0, y: 0 };
      return wrapper;
    };
  }
  return ani;
}
