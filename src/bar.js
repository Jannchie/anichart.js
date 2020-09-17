import * as d3 from "d3";
import { Whammy } from "./whammy";
class AniBarChart {
  constructor(data, setting) {
    this.width = 1000;
    this.height = 300;
    this.margin = { left: 10, right: 10, top: 10, bottom: 10 };
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

    this.outerMargin = {
      left: this.margin.left,
      right: this.margin.right,
      top: this.margin.top,
      bottom: this.margin.bottom,
    };
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
        this.getValueText(d3.format(",.2f")(value)),
        width + this.margin.left + this.labelPandding,
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
        xScale(value) + this.margin.left - this.labelPandding - imgPandding,
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
    console.log(x, y);
  }
  loadData(data) {
    let frameData = [];
    this.imageData = {};
    let nameSet = new Set();
    this.maxValue = 0;
    // 获取关键帧
    this.keyFrames = d3.range(
      0,
      data[0].value.length * this.frameRate * this.interval,
      this.frameRate * this.interval
    );

    // 对每组数据
    for (let item of data) {
      if (item.image != undefined) {
        this.imageData[item.name] = item.image;
      }
      let name = item.name;
      nameSet.add(name);

      // 对每个value
      for (let i = 0; i < item.value.length - 1; i++) {
        const lValue = item.value[i];
        const rValue = item.value[i + 1];
        let state = "normal";
        if (lValue == undefined && rValue == undefined) {
          state = "null";
        } else if (lValue == undefined && rValue != undefined) {
          state = "in";
        } else if (lValue != undefined && rValue == undefined) {
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
            console.log(lValue, 0);
            aint = d3.interpolateNumber(1, -2);
            break;
          case "in":
            int = d3.interpolateNumber(rValue * 0.8, rValue);
            aint = d3.interpolateNumber(0, 3);
            offsetInt = d3.interpolateNumber(1, -2);
            break;
          default:
            break;
        }

        // 对每一帧
        for (let j of d3.range(this.frameRate * this.interval + 1)) {
          // f: 帧号
          let f = i * this.frameRate * this.interval + j;
          if (frameData[f] == undefined) {
            frameData[f] = [];
          }
          let r = j / (this.frameRate * this.interval);
          let val = int(r);
          let alpha = aint(d3.easePolyOut(r));
          if (alpha == 0) continue;
          let offset = offsetInt(d3.easePolyOut(r));
          frameData[f].push({
            name: name,
            value: val,
            color: item.color,
            alpha: alpha < 0 ? 0 : alpha,
            state: state,
            pos: offset < 0 ? 0 : offset,
          });
          // 全局最大值
          if (val > this.maxValue) {
            this.maxValue = val;
          }
          // TODO: 获取每一帧的最大值和最小值
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
      console.log(k);
      this.imageData[k] = await d3.image(this.imageData[k]);
      this.imageData[k].setAttribute("crossOrigin", "Anonymous");
    }
    this.hintText("Loading Layout", this);

    this.margin.top += this.axisTextSize;
    this.barHeight =
      ((this.height - this.margin.top - this.margin.bottom) / this.itemCount) *
      0.8;
    // TODO: ?

    this.ctx.font = `${this.barHeight}px Sarasa Mono SC`;

    this.margin.left += this.labelPandding;
    this.margin.right += this.ctx.measureText(
      this.getValueText(d3.format(",.2f")(this.maxValue))
    ).width;
    this.margin.right += this.labelPandding;

    let maxTextWidth = d3.max([...this.nameSet], (name) => {
      return this.ctx.measureText(name).width;
    });
    this.margin.left += maxTextWidth;
  }

  // calAxis(axisRangeByFrames) {
  //   for (let axisRange of axisRangeByFrames) {
  //     // console.log(axisRange);
  //     // let [a, b] = this.getTickArray(...axisRange, 6);
  //   }
  // }

  /**
   * Convolution
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
        tmpList[i] = d3.mean(tmpArray);
      }
      dict[name] = tmpList;
      return dict;
    }, {});
    // console.log(tempDict);
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
        .range([0, this.width - this.margin.left - this.margin.right]);
      return scale.ticks(this.tickNumber);
    });
    this.frameData.forEach((f, i) => {
      f.yScale = d3
        .scaleLinear()
        .domain([0, this.itemCount])
        .range([this.margin.top, this.height - this.margin.bottom]);
      f.xScale = d3
        .scaleLinear()
        .domain([0, f.max])
        .range([0, this.width - this.margin.left - this.margin.right]);
    });
  }
  calAxis() {
    //TODO: draw axis
  }
  drawAxis(n, cData) {
    let xScale = cData.xScale;

    let idx = n / (this.interval * this.frameRate);
    let [idx1, idx2] = this.getKeyFrame(n);
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
        this.margin.left + xScale(val),
        this.axisTextSize
      );
    });

    this.ctx.globalAlpha = 1 - a;
    mainTicks.forEach((val) => {
      this.drawTick(xScale, val);
      this.ctx.fillText(
        d3.format(",.1f")(val),
        this.margin.left + xScale(val),
        this.axisTextSize
      );
    });
    this.ctx.globalAlpha = 1;
  }
  drawTick(xScale, val) {
    this.ctx.beginPath();
    this.ctx.moveTo(this.margin.left + xScale(val), this.margin.top);
    this.ctx.lineTo(
      this.margin.left + xScale(val),
      this.height - this.margin.bottom
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
    let cData = this.frameData[n];
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.ctx.fillStyle = this.background;
    this.ctx.fillRect(0, 0, this.width, this.height);
    this.drawWatermark();
    this.drawAxis(n, cData);
    cData.forEach((e) => {
      this.ctx.drawBar(
        cData.xScale,
        this.margin.left,
        cData.yScale(e.pos),
        e.value,
        this.barHeight,
        e.color,
        e.name,
        e.alpha
      );
    });
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
    var video = new Whammy.Video(this.frameRate);
    this.initCanvas();
    this.hintText("Loading Data", this);
    this.loadData(data);
    // 计算x轴坐标
    await this.preRender();
    this.calPosition(this.nameSet, this.frameData);
    this.calRenderSort();
    this.calScale();
    this.calAxis();

    let frame = 1;
    let len = this.frameData.length;
    let t = d3.timer(() => {
      try {
        if (this.output) {
          video.add(this.ctx);
        }
        this.drawFrame(frame++);
        if (frame >= len) {
          t.stop();
          if (this.output) {
            let blob = video.compile();
            this.downloadBlob(blob);
          }
        }
      } catch (e) {
        console.log(e);
        t.stop();
      }
    });
  }
}
export default AniBarChart;
