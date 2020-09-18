import * as anichart from "../src/index.js";
import d from "./data/test.csv";
export default async () => {
  let a = new anichart.Bar();
  await a.LoadCsv(d);
  a.readyToDraw();
  window.a = a;
};
