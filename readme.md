# anichart.js

轻松地制作数据可视化动画视频。

## 安装

### 使用npm

```bash
npm i anichart
```

### 标签导入

```html
<script src="./anichart.js"></script>
```

## 用法

### 准备数据

```js
let data = [
  {
    name: "我TM超长",
    value: [1, 1, 4, 5, 6, 12],
    color: "#CC342B",
    image:
      "https://i2.hdslb.com/bfs/face/983034448f81f45f05956d0455a86fe0639d6a36.jpg@80w_80h.jpg",
  },
  { name: "B", value: [1, 2, 3, 4, 52, 13], color: "#198844" },
  {
    name: "D",
    value: [1, 3, 4, 5, 62, 7],
    color: "#3971ED",
    image:
      "https://i1.hdslb.com/bfs/face/2254162161a60b528cfec449f3450409a81ebc37.jpg@80w_80h.jpg",
  },
  {
    name: "E",
    value: [undefined, 3.3, undefined, undefined, undefined, undefined],
    color: "white",
  },
  {
    name: "F",
    value: [undefined, undefined, 2, 1, 512, 52563],
    color: "#3971ED",
  },
  {
    name: "G",
    value: [undefined, 7, 1, 2, undefined, 52],
    color: "yellow",
  },
  { name: "H", value: [undefined, 1, 1, 2, 52, 64], color: "orange" },
];
```

### 载入数据

```js
let a = new anichart.Bar(data);
```

### 播放动画

```js
a.play();
```
