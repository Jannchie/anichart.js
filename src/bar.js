const { Image } = require("@canvas/image");

const _ = require("lodash");
const async = require("async");
const d3 = require("d3");
let { createCanvas, loadImage } = require("canvas");
const ColorThiefUmd = require('colorthief/dist/color-thief.umd.js');
const colorThief = require('colorthief');
const { ffmpeg, pngToMp4 } = require('./ffmpeg');
const fs = require('fs');
class AniBarChart {
  constructor(options = {}) {
    this.ffmpeg = ffmpeg;
    this.pngToMp4 = pngToMp4;
    this.imagePath = "./image/"
    this.outputPath = "./out.mp4"
    this.node = false;
    if (typeof window == 'undefined') {
      this.node = true;
      this.loadImage = loadImage;
    } else {
      this.loadImage = function (url) {
        return new Promise(resolve => {
          const image = new Image();
          image.onload = () => {
            resolve(image);
          };
          image.src = url;
        });
      }
    }
    this.language = "zh-CN";
    this.width = 1366;
    this.height = 768;
    this.frameRate = 30;
    this.outerMargin = { left: 10, right: 10, top: 10, bottom: 10 };
    this.freeze = 100;
    if (this.node) {
      this.colorThief = colorThief;
    } else {
      this.colorThief = new ColorThiefUmd();
    }
    this.interval = 1;
    this.barRedius = 4;
    this.itemCount = 22;
    this.labelPandding = 10;
    this.axisTextSize = 20;
    this.tickNumber = 6;
    this.dateLabelSize = 48;
    this.slogenSize = 24;
    this.output = false;
    this.outputName = "out";
    this.idField = "id";
    this.keyFrameDeltaTime = undefined
    this.getId = (data) => {
      data[this.idField];
    };
    this.label = (data) => {
      if (data.name != undefined) {
        return data.name;
      } else {
        return data[this.idField];
      }
    };
    this.colorKey = (data, metaData, self) => {
      return data[this.idField]
    }
    this.colorData = []
    this.imageDict = () => Object()
    this.barInfo = (data) => {
      if (data.name != undefined) {
        if (data.type != undefined) {
          return `${data.type} - ${data.name}`;
        } else {
          return `${data.name}`;
        }
      } else {
        return data[this.idField];
      }
    };

    this.valueFormat = (d) => {
      let v = d.value;
      if (v == undefined) v = d;
      if (String(d).indexOf(".") > -1) return `${d3.format(",.2f")(v)}`;
      return `${d3.format(",d")(v)}`;
    };

    this.tickFormat = (val) =>
      new Intl.NumberFormat(this.language, { notation: "compact" }).format(val);

    this.dateFormat = "%Y-%m-%d %H:%M";

    this.listImageSrc = () => [];

    this.imageData = {}

    this.colorScheme = {
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
    })(this.colorScheme);

    this.numberKey = new Set();

    this.ready = false;
    this.innerMargin = {
      left: this.outerMargin.left,
      right: this.outerMargin.right,
      top: this.outerMargin.top,
      bottom: this.outerMargin.bottom,
    };

    this.drawBarExt = () => { };
    this.drawExt = () => { };
    this.setOptions(options);
  }

  setOptions(options) {
    _.merge(this, options);
    this.innerMargin = {
      left: this.outerMargin.left,
      right: this.outerMargin.right,
      top: this.outerMargin.top,
      bottom: this.outerMargin.bottom,
    };
  }

  async loadMetaData(path) {
    let metaData = await this.readCsv(path);
    metaData = metaData.reduce((pv, cv) => {
      pv[cv[this.idField]] = { ...cv };
      return pv;
    }, {});
    this.metaData = metaData;
  }

  async readCsv(path) {
    if (this.node) {
      return d3.csvParse(fs.readFileSync(path).toString());
    } else {
      if ('object' == typeof path) {
        return d3.csv(path.default)
      }
      return await d3.csv(path);
    }
  }

  async loadCsv(path) {
    this.data = [];
    let csvData = await this.readCsv(path);
    let tsList = [...d3.group(csvData, (d) => d.date).keys()]
      .map(
        (d) =>
          new Date().getTimezoneOffset() * 60 * 1000 + new Date(d).getTime()
      )
      .sort((a, b) => a - b);
    let delta = (() => {
      let d = Infinity;
      for (let i = 1; i < tsList.length; i++) {
        const c = tsList[i];
        const p = tsList[i - 1];
        if (c - p < d) d = c - p;
      }
      return d;
    })();
    if (this.keyFrameDeltaTime != undefined) delta = this.keyFrameDeltaTime * 1000;

    let firstTs = tsList[0];
    let lastTs = tsList[tsList.length - 1];
    tsList = d3.range(firstTs, lastTs + 1, delta);
    let frameCount = this.frameRate * this.interval * (tsList.length - 1);

    this.getCurrentDate = d3
      .scaleLinear()
      .domain([0, frameCount - 1])
      .range([firstTs, lastTs])
      .clamp(true);

    csvData.forEach((d) => {
      if (this.id == undefined) this.id = d.name;
      d.date =
        new Date().getTimezoneOffset() * 60 * 1000 + new Date(d.date).getTime();
      d.value = +d.value;
    });
    let temp = d3.group(
      csvData,
      (d) => d[this.idField],
      (d) => d.date
    );
    // 对每一个项目
    for (let [id, data] of temp) {
      let dtList = [...data.keys()].sort((a, b) => a - b);
      let valList = [...data.values()]
        .map((d) => d[0])
        .sort((a, b) => a.date - b.date);
      let scales = {};
      _.keys(valList[0]).forEach((key) => {
        if (
          valList[0][key] != id &&
          Number(valList[0][key]) == Number(valList[0][key])
        ) {
          this.numberKey.add(key);
          scales[key] = d3
            .scaleLinear()
            .domain(dtList)
            .range(valList.map((d) => d[key]));
        }
      });

      let obj = valList[0];
      // 对每一个关键帧
      for (let i = 0; i < tsList.length; i++) {
        if (valList[i] != undefined) obj = valList[i];
        let ct = tsList[i];
        if (ct <= dtList[dtList.length - 1] && ct >= dtList[0]) {
          // 在区间内
          obj = { ...obj };
          _.keys(scales).forEach((key) => {
            obj[key] = scales[key](Number(ct));
          });
          obj.date = ct;
        } else {
          obj = { ...obj };
          _.keys(scales).forEach((key) => {
            obj[key] = NaN;
          });
          obj.date = ct;
        }
        this.data.push(obj);
        // let last = _.last(_.filter(dtList, (d) => d.date < ct))
        // let next = _.head(_.filter(dtList, (d) => d.date > ct))
        // if (last == undefined || last.value != last.value) {
        //   obj = { ...obj };
        //   obj.value = NaN;
        //   obj.date = ct - delta;
        //   this.data.push(obj);
        // }
        // if (next == undefined || next.value != next.value) {
        //   obj = { ...obj };
        //   obj.value = NaN;
        //   obj.date = ct + delta;
        //   this.data.push(obj);
        // }
      }
    }
    this.keyFramesCount = tsList.length;
    this.setKeyFramesInfo();
    this.tsToFi = d3
      .scaleLinear()
      .domain(d3.extent(tsList))
      .range([0, this.totalFrames])
      .clamp(true);
    this.fiToTs = d3
      .scaleLinear()
      .range(d3.extent(tsList))
      .domain([0, this.totalFrames])
      .clamp(true);
  }
  getColor(data) {
    return this.colorData[this.colorKey(data, this.metaData, this)];
  }
  async initCanvas() {
    this.canvas;
    if (!this.node) {
      this.canvas = d3
        .select("body")
        .append("canvas")
        .attr("width", this.width)
        .attr("height", this.height)
        .node();
    } else {
      this.canvas = createCanvas(this.width, this.height);
    }
    this.ctx = this.canvas.getContext("2d");
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
        try {
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
        } catch (error) {
          console.log(error)
        }
        this.ctx.strokeStyle = this.colorScheme.background;
        this.ctx.lineWidth = 1;
        this.ctx.stroke();

        this.ctx.restore();
      }
    };

    this.ctx.radiusArea = (left, top, w, h, r) => {
      this.ctx.lineWidth = 0;
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
        this.imageData[data[this.idField]] == undefined ? 0 : this.barHeight;
      this.ctx.globalAlpha = data.alpha;

      let x = this.innerMargin.left;
      let y = series.yScale(data.pos);
      // draw rect
      this.ctx.fillStyle = fillColor;
      this.ctx.radiusRect(x, y, barWidth, this.barHeight, r);

      // draw bar label text
      this.ctx.fillStyle = fillColor;
      this.ctx.font = `900 ${this.barHeight}px Sarasa Mono SC`;
      this.ctx.textAlign = "right";
      this.ctx.fillText(
        this.label(data, this.metaData, this),
        x - this.labelPandding,
        y + this.barHeight * 0.88
      );

      // draw bar value text
      this.ctx.textAlign = "left";
      this.ctx.fillText(
        this.valueFormat(data),
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
      this.ctx.fillStyle = this.colorScheme.background;
      this.ctx.font = `900 ${this.barHeight}px Sarasa Mono SC`;
      this.ctx.fillText(
        this.barInfo(data, this.metaData, this),
        barWidth + x - this.labelPandding - imgPandding,
        y + this.barHeight * 0.88
      );
      // draw bar img
      this.ctx.drawClipedImg(
        this.imageData[data[this.idField]],
        x + series.xScale(data.value) - this.barHeight,
        y,
        this.barHeight,
        this.barHeight,
        4
      );

      this.ctx.restore();

      this.drawBarExt(this.ctx, data, series, this);

      this.ctx.globalAlpha = 1;
    };
  }

  calculateFrameData(data) {
    let frameData = [];
    let idSet = new Set();
    this.maxValue = 0;

    // 对每组数据
    let idMap = d3.group(data, (d) => d[this.idField]);
    for (let [id, dataList] of idMap) {
      idSet.add(id);
      // 对每个数据区间
      dataList.sort((a, b) => a.date - b.date);
      for (let i = 0; i < dataList.length - 1; i++) {
        const lData = dataList[i];
        const rData = dataList[i + 1];
        let ints = _.reduce(
          [...this.numberKey],
          (dict, key) => {
            dict[key] = {
              lValue: lData[key] == undefined ? NaN : lData[key],
              rValue: rData[key] == undefined ? NaN : rData[key],
            };
            return dict;
          },
          {}
        );
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
        _.keys(ints).forEach((key) => {
          ints[key].int = d3
            .scaleLinear()
            .range([ints[key].lValue, ints[key].rValue])
            .domain([0, 1])
            .clamp(true);
        });
        let aint = d3.interpolateNumber(1, 1);
        let offsetInt = () => 0;
        switch (state) {
          case "null":
            aint = d3.interpolateNumber(0, 0);
            break;
          case "out":
            offsetInt = d3
              .scaleLinear()
              .domain([0, 1])
              .range([0, 1])
              .clamp(true);
            _.keys(ints).forEach((key) => {
              ints[key].int = d3.interpolateNumber(
                ints[key].lValue,
                ints[key].lValue * 0.1
              );
            });
            aint = d3.scaleLinear().domain([0, 0.4]).range([1, 0]).clamp(true);
            break;
          case "in":
            _.keys(ints).forEach((key) => {
              ints[key].int = d3.interpolateNumber(
                ints[key].rValue * 0.3,
                ints[key].rValue
              );
            });
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

        if (
          this.colorData[this.colorKey(lData, this.metaData, this)] == undefined
        ) {
          this.colorData[
            this.colorKey(lData, this.metaData, this)
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
          let val = ints.value.int(r);
          let alpha = aint(d3.easePolyOut(r));
          if (alpha == 0) continue;
          let offset = offsetInt(d3.easePolyOut(r));
          let fd = {
            ...lData,
            alpha: alpha,
            state: state,
            pos: offset,
          };
          _.keys(ints).forEach((key) => {
            fd[key] = ints[key].int(r);
          });
          frameData[f].push(fd);
          // 全局最大值
          if (val > this.maxValue) {
            this.maxValue = val;
            this.maxData = fd;
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
    this.idSet = idSet;
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

  async hintText(txt, self) {
    console.log(txt);
    self.ctx.textAlign = "left";
    self.ctx.fillStyle = self.colorScheme.background;
    self.ctx.fillRect(0, 0, self.width, self.height);
    self.ctx.fillStyle = "#fff";
    self.ctx.font = `20px Sarasa Mono SC`;
    self.ctx.fillText(txt, 20, 30);
    this.drawWatermark();
  }
  addImageProcess(src) {
    function timeout(ms, callback) {
      return new Promise(function (resolve, reject) {
        callback(resolve, reject);
        setTimeout(function () {
          reject("Promise timed out after " + ms + " ms");
        }, ms);
      });
    }
    return timeout(3000, async (resolve, reject) => {
      try {
        resolve(this.loadImage(src));
      } catch {
        console.log(src);
      }
    });
  }
  async preRender() {
    await this.hintText("Loading Layout", this);
    this.innerMargin.top += this.axisTextSize;


    this.ctx.font = `${this.barHeight}px Sarasa Mono SC`;

    this.innerMargin.left += this.labelPandding;
    this.innerMargin.right += this.ctx.measureText(
      this.valueFormat(this.maxData)
    ).width;
    this.innerMargin.right += this.labelPandding;

    let maxTextWidth = d3.max(this.frameData, (fd) =>
      d3.max(
        fd,
        (d) => this.ctx.measureText(this.label(d, this.metaData, this)).width
      )
    );
    this.innerMargin.left += maxTextWidth;
    this.currentFrame = 0;
  }

  async loadImages() {
    let all = Object.entries(this.metaData).length;
    let c = 0;
    let imgMap = this.imageDict(this.metaData, this);
    var wait = ms => new Promise((reslove, reject) => setTimeout(reject, ms));
    await async.mapValues(imgMap, async (src, key) => {
      let count = 0
      while (true) {
        try {
          await Promise.race([this.loadImageFromSrcAndKey(src, key), wait(10000)]);
          break;
        } catch {
          if (++count >= 5) {
            console.log("Over the number of retries! ");
            break;
          }
          console.log(`Timeout! Reload Image..times:${count}`);
        }
      }
      this.hintText(`Loading Images ${++c}/ ${all}`, this);
    })
    console.log("image Loaded")
  }


  async loadImageFromSrcAndKey(src, key) {
    this.imageData[key] = await this.loadImage(src);
    if (!this.node) {
      this.imageData[key].setAttribute("crossOrigin", "Anonymous");
    }
  }

  async autoGetColorFromImage(key, src) {
    const rgbToHex = (r, g, b) => '#' + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
    if (this.colorData[key] == undefined) {
      if (this.node) {
        let color = await this.colorThief.getColor(src);
        this.colorData[key] = rgbToHex(...color);
      } else {
        if (this.imageData[key].complete) {
          let color = this.colorThief.getColor(this.imageData[key]);
          this.colorData[key] = rgbToHex(...color);
        } else {
          this.imageData[key].addEventListener('load', () => {
            let color = this.colorThief.getColor(this.imageData[key]);
            this.colorData[key] = rgbToHex(...color);
          });
        }
      }
    }
  }

  /**
   * Convolution 卷积
   *
   * @param {Set} idSet
   * @param {List} frameData
   */
  calPosition(idSet, frameData) {
    for (let i of d3.range(300)) {
      frameData.push(_.cloneDeep(frameData[this.totalFrames - 1]));
      frameData[frameData.length - 1].max = frameData[this.totalFrames - 1].max;
    }
    let tempDict = [...idSet].reduce((dict, id) => {
      let rankList = frameData.map((dList) => {
        for (let d of dList) {
          if (d[this.idField] != id) {
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
      dict[id] = tmpList;
      return dict;
    }, {});
    for (let i = 0; i < frameData.length; i++) {
      const e = frameData[i];
      for (let j = 0; j < e.length; j++) {
        const d = e[j];
        d.pos += tempDict[d[this.idField]][i];
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
    while (idx1 >= this.tickArrays.length) idx1 -= 1;
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
        this.tickFormat(val),
        this.innerMargin.left + xScale(val),
        this.axisTextSize
      );
    });
    this.ctx.globalAlpha = d3.max(mainTicks) == d3.max(secondTicks) ? 1 : 1 - a;
    mainTicks.forEach((val) => {
      this.drawTick(xScale, val);
      this.ctx.fillText(
        this.tickFormat(val),
        this.innerMargin.left + xScale(val),
        this.axisTextSize
      );
    });
    this.ctx.globalAlpha = 1;
    this.ctx.lineWidth = 0;
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
    this.ctx.font = `${this.slogenSize}px Sarasa Mono SC`;

    this.ctx.fillStyle = "#fff4";
    this.ctx.fillText(
      "Powered by Jannchie Studio",
      // window.atob("UE9XRVIgQlkgSkFOTkNISUU="),
      this.width - this.outerMargin.left,
      this.height - this.outerMargin.bottom
    );
  }

  async drawFrame(n) {
    this.ctx.clearRect(0, 0, this.width, this.height);
    let cData = this.frameData[n];
    this.drawBackground();
    this.drawWatermark();
    this.drawAxis(n, cData);
    this.drawDate(n);
    cData.forEach((e) => {
      this.ctx.drawBar(e, cData);
    });
    this.drawExt(this.ctx, cData, this);
  }

  drawDate(n) {
    let timestamp = this.getCurrentDate(n);
    this.ctx.textAlign = "right";
    this.ctx.font = `${this.dateLabelSize}px Sarasa Mono SC`;
    this.ctx.fillStyle = "#fff4";
    this.ctx.fillText(
      d3.timeFormat(this.dateFormat)(new Date(timestamp)),
      this.width - this.outerMargin.left,
      this.height - this.outerMargin.bottom - this.slogenSize - 4
    );
  }

  drawBackground() {
    this.ctx.fillStyle = this.colorScheme.background;
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  downloadBlob(blob, name = "untitled.mp4") {
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    a.href = url;
    a.download = `${name}`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  calRenderSort() {
    // 调整渲染顺序
    for (let i = 0; i < this.frameData.length; i++) {
      const e = this.frameData[i];
      let t = i == this.frameData.length - 1 ? i : i + 1;
      let afterDict = this.frameData[t].reduce((pv, cv) => {
        pv[cv[this.idField]] = cv.pos;
        return pv;
      }, {});
      e.sort((a, b) => {
        // a上升
        if (afterDict[a[this.idField]] - a.pos < 0 || afterDict[b[this.idField]] - b.pos > 0) {
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
    if (this.output) {
      await ffmpeg.load();
    }

    let delay = this.output ? 0 : 1000 / this.frameRate;
    this.player = d3.interval(async () => {
      try {
        if (this.currentFrame == this.totalFrames + this.freeze) {
          this.player.stop();
          let btn = d3.select("#play-btn");
          btn.text(btn.text() == "STOP" ? "PLAY" : "STOP");
          if (this.output) {
            await this.ffmpeg.run(`-r ${this.frameRate} -threads ${8} -i ${this.outputName}-%d.png out.mp4`)
            let data = await ffmpeg.read("./out.mp4");
            this.downloadBlob(new Blob([data.buffer], { type: 'video/mp4' }), this.outputName)
          }
          return;
        }
        if (this.useCtl) {
          this.slider.value = this.currentFrame;
          this.updatectlCurrentFrame();
        }
        await this.drawFrame(this.currentFrame++);
        if (this.output) {
          await ffmpeg.write(`${this.outputName}-${this.currentFrame}.png`, this.canvas.toDataURL('image/png', 1));
        }
      } catch (e) {
        console.error(e);
        this.player.stop();
      }
    }, delay);
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
    this.barHeight = Math.round(
      ((this.height - this.innerMargin.top - this.innerMargin.bottom) /
        this.itemCount) *
      0.8
    );

    await this.loadImages();
    await this.hintText("Loading Data", this);
    this.calculateFrameData(this.data);
    this.calPosition(this.idSet, this.frameData);

    await this.preRender();
    await this.fixAlpha(this.frameData);
    this.calScale();

    this.calRenderSort();
    if (this.node) {
      this.useCtl = false;
    }
    if (this.useCtl) {
      this.addCtl();
    }
    this.ready = true;
    if (this.node) {
      for (let f in d3.range(this.frameData.length)) {
        this.outputPng(f, this.outputName);
      }
      await this.pngToMp4(this.imagePath, this.outputName, this.outputPath, this.frameRate)
    }
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
      .attr("max", this.totalFrames - 1 + this.freeze)
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
        } else if (val > this.totalFrames + 300) {
          val = this.totalFrames;
        } else if (isNaN(val)) {
          val = 1;
        }
        this.currentFrame = val - 1;
        this.slider.value = this.currentFrame;
        this.drawFrame(this.currentFrame);
      });
    ctl
      .append("text")
      .text(` / ${d3.format(",d")(this.totalFrames + this.freeze)}`);
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
  async outputPng(n, name) {
    if (!this.node) {
      console.log("Cannot output png in browser!");
      this.canvas.toBlob((b) =>
        this.downloadBlob(b, `${name}.png`)
      );
    } else {
      let fs = require("fs");
      let path = require("path");
      async function mkdirPath(pathStr) {
        var projectPath = path.join(process.cwd());
        var tempDirArray = pathStr.split("\\");
        for (var i = 0; i < tempDirArray.length; i++) {
          projectPath = projectPath + "/" + tempDirArray[i];
          if (fs.existsSync(projectPath)) {
            var tempstats = fs.statSync(projectPath);
            if (!tempstats.isDirectory()) {
              fs.unlinkSync(projectPath);
              fs.mkdirSync(projectPath);
            }
          } else {
            fs.mkdirSync(projectPath);
          }
        }
        return projectPath;
      }
      await mkdirPath(this.imagePath);
      this.drawFrame(n);
      // window.a = a;
      console.log(`output frame:${n}, name: ${name}`);
      // string generated by canvas.toDataURL()
      var img = this.canvas.toDataURL();
      // strip off the data: url prefix to get just the base64-encoded bytes
      var data = img.replace(/^data:image\/\w+;base64,/, "");
      var buf = new Buffer.from(data, "base64");
      fs.writeFileSync(`${this.imagePath}${name}-${n}.png`, buf);
    }
  }
}
module.exports = AniBarChart;
