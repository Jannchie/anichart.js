import * as anichart from "../src/index.js";
import d from "./data/fans_data_final.csv";
import m from "./data/fans_data_meta.csv";
export default async () => {
  let a = new anichart.Bar();
  await a.LoadCsv(d);
  await a.LoadMetaData(m);
  a.readyToDraw();
  window.a = a;
};
