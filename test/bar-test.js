import * as anichart from "../src/index.js";
import * as d3 from "d3";
const _ = require("lodash");
import d from "./data/test-data.csv";
import m from "./data/test-meta.csv";
import { timeFormat } from "d3";
import a from "./fans-month";
export default async () => {
  window.a = a;
  window.d3 = d3;
};
