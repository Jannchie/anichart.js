class ACBar {
  constructor(data) {
    this.width = 800;
    this.height = 300;
    this.margin = { left: 10, right: 10, top: 10, bottom: 10 };
    this.background = "#1D1F21";
    this.frameRate = 60;
    this.interval = 6;
    this.barRedius = 4;
    this.itemCount = 6;
    this.labelPandding = 10;
    this.barHeight =
      ((this.height - this.margin.top - this.margin.bottom) / this.itemCount) *
      0.8;
    this.initCanvas();
    this.getValueText = (value) => `pts ${value}M`;
    this.loadData(data);
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
        this.ctx.stroke();
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
      let imgPandding = this.imageData[name] == undefined ? 0 : this.barHeight;
      this.ctx.globalAlpha = alpha;
      this.ctx.fillStyle = fillColor;
      this.ctx.radiusRect(x, y, xScale(value), height, this.barRedius, name);
      this.ctx.textAlign = "right";
      this.ctx.fillStyle = this.background;
      this.ctx.font = `${height}px Sarasa Mono SC black`;
      this.ctx.fillText(
        name,
        xScale(value) + this.margin.left - this.labelPandding - imgPandding,
        y + height * 0.88
      );

      this.ctx.fillStyle = fillColor;
      this.ctx.font = `${height}px Sarasa Mono SC black`;
      this.ctx.textAlign = "right";

      this.ctx.fillText(name, x - this.labelPandding, y + height * 0.88);

      this.ctx.textAlign = "left";
      this.ctx.fillText(
        this.getValueText(d3.format(",.2f")(value)),
        xScale(value) + this.margin.left + this.labelPandding,
        y + height * 0.88
      );
      this.ctx.drawClipedImg(
        this.imageData[name],
        x + xScale(value) - this.barHeight,
        y,
        this.barHeight,
        this.barHeight,
        4
      );

      this.ctx.globalAlpha = 1;
    };
  }
  loadData(data) {
    let frameData = [];
    this.imageData = {};
    let nameSet = new Set();
    this.maxValue = 0;
    for (let item of data) {
      if (item.image != undefined) {
        this.imageData[item.name] = item.image;
      }
      let name = item.name;
      nameSet.add(name);
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
        for (let j of d3.range(this.frameRate * this.interval + 1)) {
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
          if (val > this.maxValue) {
            this.maxValue = val;
          }
        }
      }
    }

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
    this.calPosition(nameSet, frameData);
    this.frameData = frameData;
    this.nameSet = nameSet;
  }
  async preRender() {
    function hintText(txt, self) {
      self.ctx.fillStyle = self.background;
      self.ctx.fillRect(0, 0, self.width, self.height);
      self.ctx.fillStyle = "#fff";
      self.ctx.font = `20px Sarasa Mono SC`;
      self.ctx.fillText(txt, 20, 30);
    }

    hintText("Loading Images", this);
    for (let k in this.imageData) {
      console.log(k);
      this.imageData[k] = await d3.image(this.imageData[k]);
    }
    hintText("Loading Layout", this);
    this.ctx.font = `${this.barHeight}px Sarasa Mono SC`;
    let maxTextWidth = d3.max([...this.nameSet], (name) => {
      return this.ctx.measureText(name).width;
    });
    this.margin.left += maxTextWidth;
    this.margin.left += this.labelPandding;
    this.margin.right += this.ctx.measureText(
      this.getValueText(d3.format(",.2f")(this.maxValue))
    ).width;

    this.margin.right += this.labelPandding;
  }
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
    console.log(tempDict);
    for (let i = 0; i < frameData.length; i++) {
      const e = frameData[i];
      for (let j = 0; j < e.length; j++) {
        const d = e[j];
        d.pos += tempDict[d.name][i];
      }
    }
  }
  drawFrame(n, img) {
    let cData = this.frameData[n];
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.ctx.fillStyle = this.background;
    this.ctx.fillRect(0, 0, this.width, this.height);

    var xScale = d3
      .scaleLinear()
      .domain([0, d3.max(cData, (d) => d.value)])
      .range([0, this.width - this.margin.left - this.margin.right]);

    var yScale = d3
      .scaleLinear()
      .domain([0, this.itemCount])
      .range([
        this.margin.top,
        this.height - this.margin.top - this.margin.bottom,
      ]);
    // cData.sort((a, b) => a.rank - b.rank);
    cData.forEach((e) => {
      this.ctx.drawBar(
        xScale,
        this.margin.left,
        yScale(e.pos),
        e.value,
        this.barHeight,
        e.color,
        e.name,
        e.alpha
      );
    });
  }

  async play() {
    await this.preRender();
    let frame = 1;
    let len = this.frameData.length;
    let t = d3.timer(() => {
      try {
        this.drawFrame(frame++);
        if (frame >= len) t.stop();
      } catch (e) {
        console.log(e);
        t.stop();
      }
    });
  }
}

let data = [
  {
    name: "我TM超长",
    value: [1, 1, 4, 5, 6, 12],
    color: "#CC342B",
    image:
      "https://i2.hdslb.com/bfs/face/983034448f81f45f05956d0455a86fe0639d6a36.jpg@80w_80h.jpg",
  },
  { name: "B", value: [1, 2, 3, 4, 5, 6], color: "#198844" },
  { name: "D", value: [1, 3, 4, 5, 6, 7], color: "#3971ED" },
  {
    name: "E",
    value: [undefined, 3.3, undefined, undefined, undefined, undefined],
    color: "white",
  },
  { name: "F", value: [undefined, undefined, 2, 1, 5, 5], color: "#3971ED" },
  { name: "G", value: [undefined, 7, 1, 2, undefined, 3], color: "#3971ED" },
  { name: "H", value: [undefined, 1, 1, 2, 2, 1], color: "#3971ED" },
];

aChartBar = new ACBar(data);
aChartBar.play();
