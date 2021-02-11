import { Ani } from "../ani/Ani";
import { Component } from "../component/Component";
export function getScaleWrapped(
  child: Ani | Component,
  scale:
    | ((sec: number) => { x: number; y: number })
    | { x: number; y: number }
    | ((sec: number) => number)
) {
  let scaleFunc: (sec: number) => { x: number; y: number } | number;
  if (typeof scale === "function") {
    scaleFunc = scale;
  } else {
    scaleFunc = () => scale;
  }
  const ani = new Ani();
  const wrapper = new Component();
  if (child instanceof Ani) {
    ani.getComponent = (sec) => {
      const comp = child.getComponent(sec);
      if (!comp) return null;
      wrapper.position = comp.position;
      return getComp(sec, comp);
    };
  } else {
    wrapper.children.push(child);
    wrapper.position = child.position;
    ani.getComponent = (sec) => {
      return getComp(sec, child);
    };
  }
  return ani;

  function getComp(sec: number, comp: Component) {
    let s = scaleFunc(sec);
    if (typeof s === "number") {
      s = { x: s, y: s };
    }
    comp.position = { x: 0, y: 0 };
    wrapper.scale = s;
    wrapper.children = [comp];
    return wrapper;
  }
}
