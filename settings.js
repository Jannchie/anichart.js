let width = 1920;
let height = 500;

let margin = {
  left: 500,
  right: 500,
  top: 50,
  bottom: 50,
};

let background = "#1D1F21";
// let background = "#F000";

let color = [
  "#CC342B",
  "#D25252",
  "#3971ED",
  "#A36AC7",
  "#CE9178",
  "#EFC090",
  "#FBA922",
  "#4EC9B0",
  "#CCDF32",
  "#608B4E",
  "#198844",
];

let interval = 2;
var postfix = "";
let deformat = function (val, postfix) {
  return Number(val.replace(postfix, "").replace(/\,/g, ""));
};

let numberTween = function (d, pos = "") {
  let self = this;
  let i = d3.interpolate((self.textContent, pos), Number(d.value)),
    prec = (Number(d.value) + "").split("."),
    round = prec.length > 1 ? Math.pow(10, prec[1].length) : 1;
  return function (t) {
    self.textContent = d3.format(",.2f")(Math.round(i(t) * round) / round);
  };
};

let showPreview = true;
let frameRate = 24;
