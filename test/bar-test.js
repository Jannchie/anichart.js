import * as anichart from "../src/index.js";
import d from "./data/fans_data_final.csv";
export default async () => {
  let a = new anichart.Bar();
  await a.LoadCsv(d);
  a.readyToDraw();
  window.a = a;
};
