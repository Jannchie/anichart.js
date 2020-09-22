import * as d3 from "d3";
import { interrupt } from "d3";
import { Whammy } from "./whammy";
window.d3 = d3;
class AniBarChart {
  constructor(data = {}, setting = {}) {
    this.data = data;
    this.width = 1000;
    this.height = 300;
    this.outerMargin = { left: 10, right: 10, top: 10, bottom: 10 };
    this.background = "#1D1F21";
    this.frameRate = 60;
    this.interval = 10;
    this.barRedius = 4;
    this.itemCount = 6;
    this.labelPandding = 10;
    this.axisTextSize = 20;
    this.tickNumber = 4;
    this.getValueText = (value) => `pts ${value}M`;
    this.output = false;
    this.valueFormat = d3.format(",.2f");
    this.keyDateDelta = 0;
    this.colorKey = "channel";
    this.colorSchame = {
      background: "#1D1F21",
      colors: [
        "#D25252",
        "#569CD6",
        "#4EC9B0",
        "#EFC090",
        "#608B4E",
        "#C5C8C6",
        "#FBA922",
        "#D197D9",
        "#198844",
        "#F92672",
        "#00AD9C",
        "#FB9FB1",
        "#8BC34A",
        "#CC342B",
      ],
    };
    this.useCtl = true;

    this.colorGener = (function* (cs) {
      let i = 0;
      while (true) {
        yield cs.colors[i++ % cs.colors.length];
      }
    })(this.colorSchame);

    this.colorData = {};

    this.getColorKey = (d) => d[this.colorKey];

    this.ready = false;
    this.innerMargin = {
      left: this.outerMargin.left,
      right: this.outerMargin.right,
      top: this.outerMargin.top,
      bottom: this.outerMargin.bottom,
    };
  }

  setOptions(options) {}

  async LoadCsv(path) {
    this.data = [];
    let dateFormat = "%Y-%m-%d";
    let csvData = await d3.csv(path);

    let tsList = [...d3.group(csvData, (d) => d.date).keys()]
      .map((d) => +d3.timeParse(dateFormat)(d))
      .sort();
    let delta = (() => {
      let d = Infinity;
      for (let i = 1; i < tsList.length; i++) {
        const c = tsList[i];
        const p = tsList[i - 1];
        if (c - p < d) d = c - p;
      }
      return d;
    })();
    let firstTs = tsList[0];
    let lastTs = tsList[tsList.length - 1];
    tsList = d3.range(firstTs, lastTs + 1, delta);

    let frameCount = this.frameRate * this.interval * (tsList.length - 1);

    this.getCurrentDate = d3
      .scaleLinear()
      .domain([0, frameCount - 1])
      .range([firstTs, lastTs]);

    csvData.forEach((d) => {
      if (d.id == undefined) d.id = d.name;
      d.date = +d3.timeParse(dateFormat)(d.date);
      d.value = +d.value;
    });

    let temp = d3.group(
      csvData,
      (d) => d.id,
      (d) => d.date
    );
    for (let [id, data] of temp) {
      let dtList = [...data.keys()].sort((a, b) => a - b);
      let valList = [...data.values()]
        .map((d) => d[0])
        .sort((a, b) => a.date - b.date);
      let scale = d3
        .scaleLinear()
        .domain(dtList)
        .range(valList.map((d) => d.value));
      let obj = valList[0];
      for (let i = 0; i < tsList.length; i++) {
        let ct = tsList[i];
        let cData = data.get(ct);
        if (cData != undefined) {
          obj = { ...cData[0] };
          obj.value = cData[0].value;
          obj.date = ct;
        } else {
          obj = { ...obj };
          obj.value = dtList[0] > ct ? NaN : scale(Number(ct));
          obj.date = ct;
        }
        this.data.push(obj);
      }
    }
    this.keyFramesCount = tsList.length;
    this.setKeyFramesInfo();
    this.tsToFi = d3
      .scaleLinear()
      .domain(d3.extent(tsList))
      .range([0, this.totalFrames]);
    this.fiToTs = d3
      .scaleLinear()
      .range(d3.extent(tsList))
      .domain([0, this.totalFrames]);
  }

  initCanvas() {
    const canvas = d3
      .select("body")
      .append("canvas")
      .attr("width", this.width)
      .attr("height", this.height)
      .node();
    this.ctx = canvas.getContext("2d");
    this.ctx.drawClipedImg = (
      img,
      x = 0,
      y = 0,
      imageHeight = 100,
      imageWidth = 100,
      r = 4
    ) => {
      if (img != undefined) {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.radiusArea(x, y, imageWidth, imageHeight, r);
        this.ctx.clip(); //call the clip method so the next render is clipped in last path
        this.ctx.closePath();
        this.ctx.drawImage(
          img,
          0,
          0,
          img.width,
          img.height,
          x,
          y,
          imageWidth,
          imageHeight
        );
        this.ctx.restore();
      }
    };

    this.ctx.radiusArea = (left, top, w, h, r) => {
      const pi = Math.PI;
      this.ctx.arc(left + r, top + r, r, -pi, -pi / 2);
      this.ctx.arc(left + w - r, top + r, r, -pi / 2, 0);
      this.ctx.arc(left + w - r, top + h - r, r, 0, pi / 2);
      this.ctx.arc(left + r, top + h - r, r, pi / 2, pi);
    };
    this.ctx.radiusRect = (left, top, w, h, r) => {
      this.ctx.beginPath();
      this.ctx.radiusArea(left, top, w, h, r);
      this.ctx.closePath();
      this.ctx.fill();
    };
    this.ctx.drawBar = (
      xScale,
      x,
      y,
      value,
      height,
      fillColor,
      name,
      alpha = 1
    ) => {
      this.ctx.fillStyle = "#999";

      let width = xScale(value);
      let r = this.barRedius > width / 2 ? width / 2 : this.barRedius;
      let imgPandding = this.imageData[name] == undefined ? 0 : this.barHeight;
      this.ctx.globalAlpha = alpha;

      // draw rect
      this.ctx.fillStyle = fillColor;
      this.ctx.radiusRect(x, y, width, height, r, name);

      // draw bar label text
      this.ctx.fillStyle = fillColor;
      this.ctx.font = `${height}px Sarasa Mono SC black`;
      this.ctx.textAlign = "right";
      this.ctx.fillText(name, x - this.labelPandding, y + height * 0.88);

      // draw bar value text
      this.ctx.textAlign = "left";
      this.ctx.fillText(
        this.getValueText(this.valueFormat(value)),
        width + this.innerMargin.left + this.labelPandding,
        y + height * 0.88
      );

      // draw bar info
      this.ctx.save();

      // clip bar info
      this.ctx.beginPath();
      this.ctx.radiusArea(x, y, width, height, r);
      this.ctx.clip(); //call the clip method so the next render is clipped in last path
      this.ctx.closePath();

      // draw bar text
      this.ctx.textAlign = "right";
      this.ctx.fillStyle = this.background;
      this.ctx.font = `${height}px Sarasa Mono SC black`;
      this.ctx.fillText(
        name,
        xScale(value) +
          this.innerMargin.left -
          this.labelPandding -
          imgPandding,
        y + height * 0.88
      );
      // draw bar img
      this.ctx.drawClipedImg(
        this.imageData[name],
        x + xScale(value) - this.barHeight,
        y,
        this.barHeight,
        this.barHeight,
        4
      );

      this.ctx.restore();

      this.ctx.globalAlpha = 1;
    };
  }

  getTickArray(max, min, count) {
    var magic = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    let mul = 100;
    let delta = Math.ceil((max - min) / count);
    // 最小刻度
    let x = magic[0] * mul;
    // 最大刻度
    let y = magic[0] * mul + delta * (count - 1);

    while (magic[0] * mul >= min) {
      mul /= 10;
    }
  }
  calculateFrameData(data) {
    let frameData = [];
    this.imageData = {};
    let nameSet = new Set();
    this.maxValue = 0;

    d3.group(data);
    // 对每组数据
    let idMap = d3.group(data, (d) => d.id);
    for (let [id, dataList] of idMap) {
      nameSet.add(id);
      // 对每个数据区间
      for (let i = 0; i < dataList.length - 1; i++) {
        const lData = dataList[i];
        const rData = dataList[i + 1];
        const lValue = lData.value;
        const rValue = rData.value;
        const lDate = lData.date;
        const rDate = rData.date;
        let state = "normal";
        if (lValue != lValue && rValue != rValue) {
          state = "null";
        } else if (lValue != lValue && rValue == rValue) {
          state = "in";
        } else if (lValue == lValue && rValue != rValue) {
          state = "out";
        }
        let int = d3.interpolateNumber(lValue, rValue);
        let aint = d3.interpolateNumber(1, 1);
        let offsetInt = () => 0;
        switch (state) {
          case "null":
            int = () => undefined;
            aint = d3.interpolateNumber(0, 0);
            break;
          case "out":
            int = d3.interpolateNumber(lValue, 0);
            offsetInt = d3
              .scaleLinear()
              .domain([0, 1])
              .range([0, 1])
              .clamp(true);
            aint = d3.interpolateNumber(1, -2);
            break;
          case "in":
            int = d3.interpolateNumber(rValue * 0.2, rValue);
            aint = d3.interpolateNumber(0, 3);
            offsetInt = d3
              .scaleLinear()
              .domain([0, 1])
              .range([1, 0])
              .clamp(true);
            break;
          default:
            break;
        }
        if (this.colorData[this.getColorKey(lData)] == undefined) {
          this.colorData[
            this.getColorKey(lData)
          ] = this.colorGener.next().value;
        }
        // 对每一帧
        // f: 帧号
        for (let f of d3.range(
          Math.round(this.tsToFi(lDate)),
          Math.round(this.tsToFi(rDate))
        )) {
          if (frameData[f] == undefined) {
            frameData[f] = [];
          }
          let r =
            (f % (this.frameRate * this.interval)) /
            (this.frameRate * this.interval);
          let val = int(r);
          let alpha = aint(d3.easePolyOut(r));
          if (alpha == 0) continue;
          let offset = offsetInt(d3.easePolyOut(r));

          let fd = {
            ...lData,
            color: this.colorData[this.getColorKey(lData)],
            value: val,
            alpha: alpha < 0 ? 0 : alpha,
            state: state,
            pos: offset < -1 ? -1 : offset,
          };

          frameData[f].push(fd);
          // 全局最大值
          if (val > this.maxValue) {
            this.maxValue = val;
          }
          // 获取每一帧的最大值和最小值
          if (frameData[f].max == undefined) frameData[f].max = val;
          if (frameData[f].max < val) {
            frameData[f].max = val;
          }
        }
      }
    }
    // 计算排序
    frameData.forEach((e) => {
      e.sort((a, b) => {
        if (a.value == undefined || a.state == "out" || a.state == "null")
          return 1;
        if (b.value == undefined || b.state == "out" || b.state == "null")
          return -1;
        return b.value - a.value;
      });
      e.forEach((d, i, e) => {
        if (d.state == "out" || d.state == "null") {
          d.rank = this.itemCount + 1;
        }
        d.rank = i;
      });
    });

    this.frameData = frameData;
    this.nameSet = nameSet;
  }

  setKeyFramesInfo() {
    this.totalFrames =
      (this.keyFramesCount - 1) * this.frameRate * this.interval;
    this.keyFrames = d3.range(
      0,
      this.totalFrames,
      this.frameRate * this.interval
    );
  }

  hintText(txt, self) {
    self.ctx.textAlign = "left";
    self.ctx.fillStyle = self.background;
    self.ctx.fillRect(0, 0, self.width, self.height);
    self.ctx.fillStyle = "#fff";
    self.ctx.font = `20px Sarasa Mono SC`;
    self.ctx.fillText(txt, 20, 30);
    this.drawWatermark();
  }

  async preRender() {
    this.hintText("Loading Images", this);
    for (let k in this.imageData) {
      this.imageData[k] = await d3.image(this.imageData[k]);
      this.imageData[k].setAttribute("crossOrigin", "Anonymous");
    }
    this.hintText("Loading Layout", this);

    this.innerMargin.top += this.axisTextSize;
    this.barHeight =
      ((this.height - this.innerMargin.top - this.innerMargin.bottom) /
        this.itemCount) *
      0.8;
    // TODO: ?

    this.ctx.font = `${this.barHeight}px Sarasa Mono SC`;

    this.innerMargin.left += this.labelPandding;
    this.innerMargin.right += this.ctx.measureText(
      this.getValueText(this.valueFormat(this.maxValue))
    ).width;
    this.innerMargin.right += this.labelPandding;

    let maxTextWidth = d3.max([...this.nameSet], (name) => {
      return this.ctx.measureText(name).width;
    });
    this.innerMargin.left += maxTextWidth;
    this.currentFrame = 0;
  }

  // calAxis(axisRangeByFrames) {
  //   for (let axisRange of axisRangeByFrames) {
  //     // let [a, b] = this.getTickArray(...axisRange, 6);
  //   }
  // }

  /**
   * Convolution 卷积
   *
   * @param {Set} nameSet
   * @param {List} frameData
   */
  calPosition(nameSet, frameData) {
    let tempDict = [...nameSet].reduce((dict, name) => {
      let rankList = frameData.map((dList) => {
        for (let d of dList) {
          if (d.name != name) {
            continue;
          }
          return d.rank;
        }
      });
      // 修复突变
      for (let i = 1; i < rankList.length - 1; i++) {
        if (rankList[i - 1] == rankList[i + 1]) rankList[i] = rankList[i - 1];
      }
      // 修复首位
      if (rankList[0] != rankList[1]) rankList[0] = rankList[1];

      let tmpList = [];
      for (let i = 0; i < rankList.length; i++) {
        let frames = (this.frameRate * this.interval) / 20;
        let tmpArray = rankList.slice(
          i - frames > 0 ? i - frames : 0,
          i + frames
        );
        let mean = d3.mean(tmpArray);
        // 优化条目变换的缓动效果
        tmpList[i] =
          d3.easePolyInOut.exponent(1.5)(mean % 1) + Math.floor(mean);
      }
      dict[name] = tmpList;
      return dict;
    }, {});
    for (let i = 0; i < frameData.length; i++) {
      const e = frameData[i];
      for (let j = 0; j < e.length; j++) {
        const d = e[j];
        d.pos += tempDict[d.name][i];
      }
    }
  }
  getKeyFrame(i) {
    let idx = i / (this.interval * this.frameRate);
    let idx1 = Math.floor(idx); // 下限
    let idx2 = Math.ceil(idx);
    return [idx1, idx2];
  }

  calScale() {
    this.tickArrays = this.keyFrames.map((f) => {
      let scale = d3
        .scaleLinear()
        .domain([0, this.frameData[f].max])
        .range([
          0,
          this.width - this.innerMargin.left - this.innerMargin.right,
        ]);
      return scale.ticks(this.tickNumber);
    });
    this.frameData.forEach((f, i) => {
      f.yScale = d3
        .scaleLinear()
        .domain([0, this.itemCount])
        .range([this.innerMargin.top, this.height - this.innerMargin.bottom]);
      f.xScale = d3
        .scaleLinear()
        .domain([0, f.max])
        .range([
          0,
          this.width - this.innerMargin.left - this.innerMargin.right,
        ]);
    });
  }
  drawAxis(n, cData) {
    let xScale = cData.xScale;
    let idx = n / (this.interval * this.frameRate);
    let [idx1, idx2] = this.getKeyFrame(n);
    if (idx2 >= this.tickArrays.length) idx2 = idx1;
    let a = d3.easePolyOut.exponent(10)(idx % 1);
    let mainTicks = this.tickArrays[idx1];
    let secondTicks = this.tickArrays[idx2];
    this.ctx.globalAlpha = a;
    this.ctx.font = `${this.axisTextSize}px Sarasa Mono SC`;
    this.ctx.fillStyle = "#888";
    this.ctx.strokeStyle = "#888";
    this.ctx.lineWidth = 2;
    this.ctx.textAlign = "center";
    secondTicks.forEach((val) => {
      this.drawTick(xScale, val);
      this.ctx.fillText(
        d3.format(",.1f")(val),
        this.innerMargin.left + xScale(val),
        this.axisTextSize
      );
    });
    this.ctx.globalAlpha = 1 - a;
    mainTicks.forEach((val) => {
      this.drawTick(xScale, val);
      this.ctx.fillText(
        d3.format(",.1f")(val),
        this.innerMargin.left + xScale(val),
        this.axisTextSize
      );
    });
    this.ctx.globalAlpha = 1;
  }
  drawTick(xScale, val) {
    this.ctx.beginPath();
    this.ctx.moveTo(this.innerMargin.left + xScale(val), this.innerMargin.top);
    this.ctx.lineTo(
      this.innerMargin.left + xScale(val),
      this.height - this.innerMargin.bottom
    );
    this.ctx.stroke();
  }

  drawWatermark() {
    this.ctx.textAlign = "right";
    this.ctx.font = `20px Sarasa Mono SC thin`;

    this.ctx.fillStyle = "#fff4";
    this.ctx.fillText(
      window.atob("UE9XRVIgQlkgSkFOTkNISUU="),
      this.width - this.outerMargin.left,
      this.height - this.outerMargin.bottom
    );
  }

  drawFrame(n) {
    this.ctx.clearRect(0, 0, this.width, this.height);
    let cData = this.frameData[n];
    // console.log(cData);

    this.drawBackground();
    this.drawWatermark();
    this.drawAxis(n, cData);
    this.drawDate(n);
    cData.forEach((e) => {
      this.ctx.drawBar(
        cData.xScale,
        this.innerMargin.left,
        cData.yScale(e.pos),
        e.value,
        this.barHeight,
        e.color,
        e.name,
        e.alpha
      );
    });
  }

  drawDate(n) {
    let timestamp = this.getCurrentDate(n);
    this.ctx.textAlign = "right";
    this.ctx.font = `20px Sarasa Mono SC thin`;

    this.ctx.fillStyle = "#fff4";
    this.ctx.fillText(
      d3.timeFormat("%Y-%m-%d %H:%M")(new Date(timestamp)),
      this.width - this.outerMargin.left,
      this.height - this.outerMargin.bottom - 20
    );
  }

  drawBackground() {
    this.ctx.fillStyle = this.background;
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  downloadBlob(blob) {
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    a.href = url;
    a.download = "test.webm";
    a.click();
    window.URL.revokeObjectURL(url);
  }

  calRenderSort() {
    // 调整渲染顺序
    for (let i = 0; i < this.frameData.length; i++) {
      const e = this.frameData[i];
      let t = i == this.frameData.length - 1 ? i : i + 1;
      let afterDict = this.frameData[t].reduce((pv, cv) => {
        pv[cv.name] = cv.pos;
        return pv;
      }, {});
      e.sort((a, b) => {
        // a上升
        if (afterDict[a.name] - a.pos < 0 || afterDict[b.name] - b.pos > 0) {
          return 1;
        }
        return -1;
      });
    }
  }
  async play() {
    if (this.player) {
      this.player.stop();
      this.player = false;
      return;
    }
    if (!this.ready) {
      await this.readyToDraw();
    }
    var video = new Whammy.Video(this.frameRate);
    let len = this.frameData.length;
    this.player = d3.timer(() => {
      try {
        if (this.currentFrame == len - 1) {
          this.player.stop();
          if (this.output) {
            let blob = video.compile();
            this.downloadBlob(blob);
          }
        }
        if (this.useCtl) {
          this.slider.value = this.currentFrame;
          this.updatectlCurrentFrame();
        }
        this.drawFrame(this.currentFrame++);
        if (this.output) {
          video.add(this.ctx);
        }
      } catch (e) {
        this.player.stop();
      }
    });
  }
  postProcessData() {
    this.frameData.forEach((fd, i) => {
      fd.forEach((bd, j) => {});
    });
  }
  async readyToDraw() {
    this.initCanvas();
    this.hintText("Loading Data", this);
    this.calculateFrameData(this.data);

    // 计算x轴坐标
    await this.preRender();
    this.calPosition(this.nameSet, this.frameData);
    this.calRenderSort();
    this.calScale();
    // this.calAxis();
    this.postProcessData();
    if (this.useCtl) {
      this.addCtl();
    }
    this.ready = true;
  }
  addCtl() {
    let ctl = d3
      .select("body")
      .append("div")
      .style("font-family", "Sarasa Mono SC")
      .attr("class", "ctl")
      .style("width", `${this.width}px`)
      .style("display", "flex");
    ctl
      .append("button")

      .attr("id", "play-btn")
      .style("font-family", "Sarasa Mono SC")
      .text("PLAY")
      .on("click", () => {
        let btn = d3.select("#play-btn");
        let text = btn.text();
        let next = btn.text() == "STOP" ? "PLAY" : "STOP";
        this.play();
        d3.select("#play-btn").text(next);
      });

    let slider = ctl.append("input");
    slider
      .style("flex-grow", 1)
      .attr("type", "range")
      .attr("min", 0)
      .attr("max", this.totalFrames - 1)
      .attr("step", 1)
      .attr("value", 0)
      .on("input", () => {
        this.currentFrame = +this.slider.value;
        this.updatectlCurrentFrame();
        this.drawFrame(this.currentFrame);
      });
    this.ctlCurrentFrame = ctl
      .append("input")
      .attr("id", "c-frame")
      .attr("type", "text")
      .style("font-family", "Sarasa Mono SC")
      .attr("size", this.totalFrames.toString().length)
      .on("input", () => {
        let val = +d3.select("#c-frame").node().value;
        if (val < 1) {
          val = 1;
        } else if (val > this.totalFrames) {
          val = this.totalFrames;
        } else if (isNaN(val)) {
          val = 1;
        }
        this.currentFrame = val - 1;
        this.slider.value = this.currentFrame;
        this.drawFrame(this.currentFrame);
      });
    ctl.append("text").text(` / ${d3.format(",d")(this.totalFrames)}`);
    this.updatectlCurrentFrame();
    this.slider = slider.node();
  }
  updateCtl() {
    this.slider.value = n;
    this.updatectlCurrentFrame();
  }
  updatectlCurrentFrame() {
    let b = this.totalFrames.toString().length;
    let f = d3.format(`0${b},d`);
    this.ctlCurrentFrame.node().value = `${this.currentFrame + 1}`;
  }
}
export default AniBarChart;
