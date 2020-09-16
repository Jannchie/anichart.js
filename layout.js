// let data = [];
let svg = d3
  .select("body")
  .append("svg")
  .attr("id", "svg")
  .attr("style", `margin: 0px;background-color:${background}`)
  .attr("fill", background)
  .attr("width", width)
  .attr("height", height);
svg
  .append("rect")
  .attr("width", width)
  .attr("height", height)
  .attr("fill", background);
// 定义x轴
var xScale = d3
  .scaleLinear()
  .domain([0, 10])
  .range([0, width - margin.left - margin.right]);

var yScale = d3
  .scaleBand()
  .range([0, height - margin.top - margin.bottom])
  .padding(0.2);

var xAxis = d3.axisTop().scale(xScale);

var yAxis = d3.axisLeft().scale(yScale);
// axis
let innerG = svg
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);
let barG = innerG.append("g");
let axisG = innerG.append("g");
let xAxisG = axisG.append("g");
let yAxisG = axisG.append("g");
