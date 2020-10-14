class AniBarChart {
  setOptions(options) {
    _.merge(this, options);
    this.innerMargin = {
      left: this.outerMargin.left,
      right: this.outerMargin.right,
      top: this.outerMargin.top,
      bottom: this.outerMargin.bottom,
    };
  }
}
module.exports = AniBarChart;
