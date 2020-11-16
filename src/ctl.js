const d3 = require("d3");
class Ctl {
  addCtl(aniChart) {
    let ctl = d3
      .select("body")
      .append("div")
      .style("font-family", "Sarasa Mono SC")
      .attr("class", "ctl")
      .style("width", `${aniChart.width}px`)
      .style("display", "flex");
    ctl
      .append("button")
      .attr("id", "play-btn")
      .style("font-family", "Sarasa Mono SC")
      .text("PLAY")
      .on("click", () => {
        let btn = d3.select("#play-btn");
        let next = btn.text() == "STOP" ? "PLAY" : "STOP";
        aniChart.play();
        d3.select("#play-btn").text(next);
      });

    let slider = ctl.append("input");
    slider
      .style("flex-grow", 1)
      .attr("type", "range")
      .attr("min", 0)
      .attr("max", a.totalTrueFrames + a.freeze + a.frameRate - 1)
      .attr("step", 1)
      .attr("value", 0)
      .on("input", () => {
        aniChart.currentFrame = +this.slider.value;
        this.updatectlCurrentFrame(aniChart);
        aniChart.drawFrame(aniChart.currentFrame);
      });
    this.ctlCurrentFrame = ctl
      .append("input")
      .attr("id", "c-frame")
      .attr("type", "text")
      .style("font-family", "Sarasa Mono SC")
      .attr("size", aniChart.totalTrueFrames.toString().length)
      .on("input", () => {
        let val = +d3.select("#c-frame").node().value;
        if (val < 1) {
          val = 1;
        } else if (val > aniChart.totalTrueFrames + 300) {
          val = aniChart.totalTrueFrames;
        } else if (isNaN(val)) {
          val = 1;
        }
        aniChart.currentFrame = val - 1;
        this.slider.value = aniChart.currentFrame;
        aniChart.drawFrame(aniChart.currentFrame);
      });
    ctl
      .append("text")
      .text(
        ` / ${d3.format(",d")(a.totalTrueFrames + a.freeze + a.frameRate)}`
      );
    this.updatectlCurrentFrame(aniChart);
    this.slider = slider.node();
  }
  updateCtl(aniChart) {
    aniChart.slider.value = n;
    this.updatectlCurrentFrame(aniChart);
  }

  updatectlCurrentFrame(aniChart) {
    this.ctlCurrentFrame.node().value = `${aniChart.currentFrame + 1}`;
  }
}
module.exports = Ctl;
