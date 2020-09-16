let datas = [
  [
    { name: "NOT SVG", value: 1111.3 },
    { name: "非 Canvas", value: 2.3 },
    { name: "IS Video", value: 4.3 },
  ],
  [
    { name: "NOT SVG1", value: 1111.3 },
    { name: "NOT SVG2", value: 1111.3 },
    { name: "NOT SVG3", value: 1111.3 },
    { name: "NOT SVG4", value: 1111.3 },
    { name: "NOT SVG5", value: 1111.3 },
    { name: "非 Canvas", value: 2.3 },
    { name: "IS Video", value: 4.3 },
  ],
  [{ name: "非 Canvas", value: 3.6 }],
  [],
  [
    { name: "NOT SVG", value: 6.1 },
    { name: "IS Video", value: 1.1 },
    { name: "非 Canvas", value: 6.1 },
  ],
];
function getName(data) {
  if (data.name != undefined) {
    return data.name;
  } else {
    return data.id;
  }
}

String.prototype.hashCode = function () {
  var hash = 0,
    i,
    chr;
  if (this.length === 0) return hash;
  for (i = 0; i < this.length; i++) {
    chr = this.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
};

function getColor(data) {
  return color[data.name.hashCode() % 5];
}

function redrawAxis() {
  xAxisG
    .transition()
    .ease(d3.easeLinear)
    .duration(interval * 1000)
    .call(xAxis);
  axisG.selectAll("path").style("stroke", "#FFF").selectAll("line");
  axisG.selectAll("line").style("stroke", "#FFF");
  yAxisG
    .selectAll("text")
    .attr("font-size", yScale.bandwidth())
    .attr("fill", "#fff");
  xAxisG.selectAll("text").attr("font-size", 10).attr("fill", "#fff");
}

function enterPosition(selection) {
  selection.attr(
    "transform",
    (d) => `translate(${0},${yScale(d.id) + yScale.bandwidth()})`
  );
}

function updatePosition(selection) {
  selection.attr("transform", (d) => `translate(${0},${yScale(d.id)})`);
}

function enterBarInfo(selection) {
  selection
    .attr("transform", (d) => `translate(${xScale(d.value) * 0.8},0)`)
    .style("font-size", yScale.bandwidth() * 1.1);
  selection
    .append("g")
    .attr("class", "bar-text-group")
    .append("text")
    .attr("class", "bar-text")
    .style(
      "font-family",
      '"Sarasa Mono T SC", "Fira Code", "Source Han Sans CN"'
    )
    .text((d) => d.name)
    .style("alignment-baseline", "text-before-edge")
    .attr("font-weight", "bold")
    .style("stroke-opacity", -1)
    .attr("stroke-width", 10)
    .attr("dx", -10)
    .attr("fill", "#fff")
    .attr("dy", -0.1 * yScale.bandwidth())
    .style("text-anchor", "end")
    .attr("paint-order", "stroke")
    .attr("stroke", (d) => getColor(d))
    .style("font-size", yScale.bandwidth() * 1.2);

  selection
    .append("text")
    .style(
      "font-family",
      '"Sarasa Mono T SC", "Fira Code", "Source Han Sans CN"'
    )
    .attr("class", "bar-value")
    .attr("font-weight", "bold")
    .attr("fill", (d) => "#fff")
    .attr("dx", 5)
    // .attr("dy", -0.2 * yScale.bandwidth())
    .style("alignment-baseline", "text-before-edge")
    .text((d) => d.value);
}

function updateBarInfo(selection) {
  selection.attr("transform", (d) => `translate(${xScale(d.value)},0)`);
  selection
    .select(".bar-text")
    .style("stroke-opacity", (d) => {
      return xScale(d.value) > 600 ? 1 : 0;
    })
    .style("font-size", `${yScale.bandwidth() * 1.2}px`);
  selection.select(".bar-text-group").attr("fill-opacity", (d) => {
    return xScale(d.value) > 600 ? 1 : 0;
  });

  selection
    .select(".bar-value")
    .style("font-size", `${yScale.bandwidth() * 1.2}px`)
    .tween("text", function (d) {
      let self = this;
      let i = d3.interpolate(
          deformat(self.textContent, postfix),
          Number(d.value)
        ),
        prec = (Number(d.value) + "").split("."),
        round = prec.length > 1 ? Math.pow(10, prec[1].length) : 1;
      return function (t) {
        self.textContent = d3.format(",.2f")(Math.round(i(t) * round) / round);
      };
    });
}

function enterAni(selection) {
  let g = selection.append("g").attr("class", "bar-group");
  g.append("g")
    .append("text")
    .attr("class", "bar-label")
    .style(
      "font-family",
      '"Sarasa Mono T SC", "Fira Code", "Source Han Sans CN"'
    )
    // .attr("dy", -0.1 * yScale.bandwidth())
    .attr("dx", -6)
    .text((d) => getName(d))
    .attr("fill", "#fff")
    .style("font-size", yScale.bandwidth())
    .style("dx", yScale.bandwidth())
    .style("alignment-baseline", "text-before-edge")
    .style("text-anchor", "end");
  g.attr("fill-opacity", 0)
    .call(enterPosition)
    .transition()
    .duration((interval * 1000 * 5) / 6)
    .delay((interval * 1000 * 1) / 6)
    .call(updatePosition)
    .attr("fill-opacity", 1);
  g.append("rect")
    .attr("class", "bar")
    .attr("x", 0)
    .attr("rx", 6)
    .attr("width", (d) => xScale(d.value) * 0.8)
    .attr("height", yScale.bandwidth())
    .transition()
    .duration(interval * 1000)
    .ease(d3.easeLinear)
    .call(updateRect);

  let barInfo = g.insert("g").attr("class", "bar-info");
  barInfo
    .call(enterBarInfo)
    .transition()
    .duration(interval * 1000)
    .ease(d3.easeLinear)
    .call(updateBarInfo);
}

function updateRect(selection) {
  selection
    .attr("fill", (d) => getColor(d))
    .attr("width", (d) => xScale(d.value))
    .attr("height", yScale.bandwidth());
}

function updateAni(selection) {
  selection
    .select(".bar-label")
    .transition()
    .ease(d3.easeLinear)
    .duration(interval * 1000)
    .style("font-size", `${yScale.bandwidth()}px`);
  selection
    .select(".bar")
    .transition()
    .ease(d3.easeLinear)
    .duration(interval * 1000)
    .call(updateRect);
  selection
    .transition()
    .duration((interval * 1000 * 5) / 6)
    .delay((interval * 1000 * 1) / 6)
    .call(updatePosition);
  selection
    .select(".bar-info")
    .transition()
    .ease(d3.easeLinear)
    .duration(interval * 1000)
    .call(updateBarInfo);
}

function updateAxis(data) {
  yScale.domain(data.map((d) => d.id));
  xScale.domain([0, d3.max(data, (d) => d.value)]);
}

function exitAni(selection) {
  console.log("exit");
  selection
    .select(".bar-text-group")
    .transition()
    .duration((interval * 1000 * 3) / 6)
    .attr("fill-opacity", 0);
  selection
    .select(".bar-text")
    .transition()
    .duration((interval * 1000 * 3) / 6)
    .style("stroke-opacity", 0);

  selection
    .transition()
    .duration((interval * 1000 * 3) / 6)
    .attr("fill-opacity", 0)
    .remove();
}

function dataPrepare(data) {
  for (d of data) {
    if (d.id == undefined) {
      d.id = d.name.hashCode();
    }
  }
  data = data.sort((a, b) => {
    if (a.value == b.value) {
      return a.id - b.id;
    }
    return b.value - a.value;
  });
  return data;
}

function refreshData(data) {
  data = dataPrepare(data);
  updateAxis(data);
  let b = barG.selectAll(".bar-group").data(data, (d) => d.id);
  b.call(updateAni, data);
  b.enter().call(enterAni);
  b.exit().call(exitAni);
  redrawAxis();
}
var finished = false;
var index = 0;
var t = d3.interval(function (elapsed) {
  let data = datas[index++];
  if (data == undefined) {
    t.stop();
    finished = true;
    return;
  }
  refreshData(data);
}, interval * 1000);
