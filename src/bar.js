import * as d3 from "d3";
import { Whammy } from "./whammy";
window.d3 = d3;
class AniBarChart {
  constructor(data = {}, options = {}) {
    this.data = data;
    this.language = "zh-CN";
    this.width = 1366;
    this.height = 768;
    this.outerMargin = { left: 10, right: 10, top: 10, bottom: 10 };
    this.background = "#1D1F21";
    this.frameRate = 60;
    this.interval = 1;
    this.barRedius = 4;
    this.itemCount = 22;
    this.labelPandding = 10;
    this.axisTextSize = 20;
    this.tickNumber = 6;
    this.output = false;
    this.getLabel = (data) => ``;
    this.getBarInfo = (data) =>
      `${this.metaData[data.name].channel}-${data.name}`;
    this.valueFormatter = (d) => `${d3.format("+,.2f")(d / 10000)}万粉/月`;
    this.tickFormatter = (val) =>
      new Intl.NumberFormat(this.language, { notation: "compact" }).format(val);
    this.tickFormat = ",d";
    this.keyDateDelta = 0;
    this.colorKey = "channel";
    this.dateFormat = "%Y-%m-%d %H:%M";
    this.dateFormatForLoad = "%Y-%m-%d %H:%M";

    this.colorSchame = {
      background: "#1D1F21",
      colors: [
        "#27C",
        "#FB0",
        "#FFF",
        "#2C8",
        "#D23",
        "#0CE",
        "#F72",
        "#C8C",
        "#C86",
        "#F8B",
        "#DDA",
        "#BCA",
        "#F27",
      ],
    };
    this.useCtl = true;

    this.colorGener = (function* (cs) {
      let i = 0;
      while (true) {
        yield cs.colors[i++ % cs.colors.length];
      }
    })(this.colorSchame);

    this.colorData = {
      生活: "#FFF",
      资讯: "#0CE",
      游戏: "#c02c38",
      美食: "#F7BD0B",
      动画: "#FB9FB1",
      国创: "#CC342B",
      音乐: "#20C38B",
      舞蹈: "#20C38B",
      时尚: "#FB7922",
      娱乐: "#FB7922",
      鬼畜: "#b167a9",
      知识: "#2472C8",
      数码: "#2472C8",
    };

    this.getColorKey = (d) => this.metaData[d.name].channel;

    this.ready = false;
    this.innerMargin = {
      left: this.outerMargin.left,
      right: this.outerMargin.right,
      top: this.outerMargin.top,
      bottom: this.outerMargin.bottom,
    };

    this.innerMargin.right += 108;

    this.drawBarExt = () => {};
    this.drawExt = () => {};
  }

  setOptions(options) {}
  async LoadMetaData(path) {
    let metaData = await d3.csv(path);
    metaData = metaData.reduce((pv, cv) => {
      pv[cv.name] = { ...cv };
      return pv;
    }, {});
    this.metaData = metaData;
  }
  async LoadCsv(path) {
    this.data = [];
    let dateFormat = this.dateFormatForLoad;
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
      d.date = +d3.timeParse(this.dateFormat)(d.date);
      d.value = +d.value;
    });

    let temp = d3.group(
      csvData,
      (d) => d.id,
      (d) => d.date
    );
    // 对每一个项目
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
      // 对每一个关键帧
      for (let i = 0; i < tsList.length; i++) {
        let ct = tsList[i];
        if (ct <= dtList[dtList.length - 1] && ct >= dtList[0]) {
          // 在区间内
          obj = { ...obj };
          obj.value = scale(Number(ct));
          obj.date = ct;
        } else {
          continue;
        }
        this.data.push(obj);
        if (-1 == dtList.indexOf(ct - delta)) {
          obj = { ...obj };
          obj.value = NaN;
          obj.date = ct - delta;
          this.data.push(obj);
        }
        if (-1 == dtList.indexOf(ct + delta)) {
          obj = { ...obj };
          obj.value = NaN;
          obj.date = ct + delta;
          this.data.push(obj);
        }
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
  getColor(data) {
    return this.colorData[this.getColorKey(data)];
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
    this.ctx.drawBar = (data, series) => {
      this.ctx.fillStyle = "#999";
      let fillColor = this.getColor(data);
      let barWidth = series.xScale(data.value);
      let r = this.barRedius > barWidth / 2 ? barWidth / 2 : this.barRedius;
      let imgPandding =
        this.imageData[data.name] == undefined ? 0 : this.barHeight;
      this.ctx.globalAlpha = data.alpha;

      let x = this.innerMargin.left;
      let y = series.yScale(data.pos);
      // draw rect
      this.ctx.fillStyle = fillColor;
      this.ctx.radiusRect(x, y, barWidth, this.barHeight, r);

      // draw bar label text
      this.ctx.fillStyle = fillColor;
      this.ctx.font = `${this.barHeight}px Sarasa Mono SC black`;
      this.ctx.textAlign = "right";
      this.ctx.fillText(
        this.getLabel(data),
        x - this.labelPandding,
        y + this.barHeight * 0.88
      );

      // draw bar value text
      this.ctx.textAlign = "left";
      this.ctx.fillText(
        this.valueFormatter(data.value),
        barWidth + x + this.labelPandding,
        y + this.barHeight * 0.88
      );

      // draw bar info
      this.ctx.save();

      // clip bar info
      this.ctx.beginPath();
      this.ctx.radiusArea(x, y, barWidth, this.barHeight, r);
      this.ctx.clip(); //call the clip method so the next render is clipped in last path
      this.ctx.closePath();

      // draw bar text
      this.ctx.textAlign = "right";
      this.ctx.fillStyle = this.background;
      this.ctx.font = `${this.barHeight}px Sarasa Mono SC black`;
      this.ctx.fillText(
        this.getBarInfo(data),
        barWidth + x - this.labelPandding - imgPandding,
        y + this.barHeight * 0.88
      );
      // draw bar img
      this.ctx.drawClipedImg(
        this.imageData[data.name],
        x + series.xScale(data.value) - this.barHeight,
        y,
        this.barHeight,
        this.barHeight,
        4
      );

      this.ctx.restore();

      this.drawBarExt(this.ctx, data, series);

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
      dataList.sort((a, b) => a.date - b.date);
      for (let i = 0; i < dataList.length - 1; i++) {
        const lData = dataList[i];
        const rData = dataList[i + 1];
        const lValue = lData.value == undefined ? NaN : lData.value;
        const rValue = rData.value == undefined ? NaN : rData.value;
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
        let int = d3
          .scaleLinear()
          .range([lValue, rValue])
          .domain([0, 1])
          .clamp(true);

        let aint = d3.interpolateNumber(1, 1);
        let offsetInt = () => 0;
        switch (state) {
          case "null":
            int = () => undefined;
            aint = d3.interpolateNumber(0, 0);
            break;
          case "out":
            int = d3.interpolateNumber(lValue, lValue * 0.8);
            offsetInt = d3
              .scaleLinear()
              .domain([0.8, 1])
              .range([0, 1])
              .clamp(true);
            aint = d3.scaleLinear().domain([0, 0.4]).range([1, 0]).clamp(true);
            break;
          case "in":
            int = d3.interpolateNumber(rValue * 0.8, rValue);
            aint = d3.scaleLinear().domain([0, 0.2]).range([0, 1]).clamp(true);
            offsetInt = d3
              .scaleLinear()
              .domain([0.2, 1])
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
            value: val,
            alpha: alpha,
            state: state,
            pos: offset,
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
    this.hintText("Loading Layout", this);
    this.innerMargin.top += this.axisTextSize;
    this.barHeight = Math.round(
      ((this.height - this.innerMargin.top - this.innerMargin.bottom) /
        this.itemCount) *
        0.8
    );
    let all = Object.entries(this.metaData).length;
    let c = 0;
    let ps = [];
    for (let m of Object.entries(this.metaData).map((d) => d[1])) {
      try {
        ps.push(
          (async () => {
            this.imageData[m.name] = await d3.image(
              `${m.image}@${this.barHeight}w_${this.barHeight}h.webp`
            );
            this.imageData[m.name].setAttribute("crossOrigin", "Anonymous");
            this.hintText(`Loading Images  ${++c}/ ${all}`, this);
          })()
        );
      } catch (e) {
        console.log(e);
        console.log(m.name);
        console.log(m.image);
      }
    }
    await Promise.all(ps);
    this.ctx.font = `${this.barHeight}px Sarasa Mono SC`;

    this.innerMargin.left += this.labelPandding;
    this.innerMargin.right += this.ctx.measureText(
      this.valueFormatter(this.maxValue)
    ).width;
    this.innerMargin.right += this.labelPandding;

    let maxTextWidth = d3.max(this.frameData, (fd) =>
      d3.max(fd, (d) => this.ctx.measureText(this.getLabel(d)).width)
    );
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
        let frames = (this.frameRate * this.interval) / 7;
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
    let a = d3.easePolyInOut.exponent(10)(idx % 1);
    let mainTicks = this.tickArrays[idx1];
    let secondTicks = this.tickArrays[idx2];
    this.ctx.globalAlpha = d3.max(mainTicks) == d3.max(secondTicks) ? 1 : a;
    this.ctx.font = `${this.axisTextSize}px Sarasa Mono SC`;
    this.ctx.fillStyle = "#888";
    this.ctx.strokeStyle = "#888";
    this.ctx.lineWidth = 2;
    this.ctx.textAlign = "center";
    secondTicks.forEach((val) => {
      this.drawTick(xScale, val);
      this.ctx.fillText(
        this.tickFormatter(val),
        this.innerMargin.left + xScale(val),
        this.axisTextSize
      );
    });
    this.ctx.globalAlpha = d3.max(mainTicks) == d3.max(secondTicks) ? 1 : 1 - a;
    mainTicks.forEach((val) => {
      this.drawTick(xScale, val);
      this.ctx.fillText(
        this.tickFormatter(val),
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
    this.drawBackground();
    this.drawWatermark();
    this.drawAxis(n, cData);
    this.drawDate(n);
    cData.forEach((e) => {
      this.ctx.drawBar(e, cData);
    });
    this.drawExt(this.ctx, cData);
  }

  drawDate(n) {
    let timestamp = this.getCurrentDate(n);
    this.ctx.textAlign = "right";
    this.ctx.font = `20px Sarasa Mono SC thin`;

    this.ctx.fillStyle = "#fff4";
    this.ctx.fillText(
      d3.timeFormat(this.dateFormat)(new Date(timestamp)),
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
    this.player = d3.interval(() => {
      try {
        if (this.currentFrame == this.totalFrames) {
          this.player.stop();
          btn.text(btn.text() == "STOP" ? "PLAY" : "STOP");
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
    }, 1000 / this.frameRate);
  }
  postProcessData() {
    this.frameData.forEach((fd, i) => {
      fd.forEach((bd, j) => {});
    });
  }
  async fixAlpha() {
    for (let fd of this.frameData) {
      for (let data of fd) {
        if (data.pos > this.itemCount - 1) {
          let newAlpha = d3
            .scaleLinear()
            .domain([0, 1])
            .range([1, 0])
            .clamp(true)(data.pos - this.itemCount + 1);
          if (data.alpha > newAlpha) data.alpha = newAlpha;
        }
      }
    }
  }
  async readyToDraw() {
    this.initCanvas();
    this.hintText("Loading Data", this);
    this.calculateFrameData(this.data);

    // 计算x轴坐标
    await this.preRender();
    this.calPosition(this.nameSet, this.frameData);
    this.fixAlpha(this.frameData);
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
