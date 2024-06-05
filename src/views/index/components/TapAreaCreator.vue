<template>
  <div class="scaffold">
    <div class="canvas-area">
      <img id="bgImg" :src="props.backgroundUrl" alt="" @load="onImgLoad" />
      <canvas id="canvasdom" :width="data.canvasWidth" :height="data.canvasHeight"></canvas>
    </div>

    <div class="config-area mt-8">
      <div class="text-center flex-1 text-20px">
        请在左侧图片上拖动鼠标创建热区，点击可以切换选择
      </div>

      <div v-for="(link, key) in data.rectConfig" :key="key" :class="{ 'selected-input': data.selectedRectId === key }">
        <input v-model="data.rectConfig[key]" />
      </div>

      <div class="btn-save" @click="saveDraw">保存配置</div>
    </div>
  </div>
</template>


<script setup>
import { ref, reactive, nextTick, toRaw, onMounted } from 'vue'
import { fabric } from "fabric";
import { checkOverlap, isTwoRectOverlap } from "@/utils/checkOverlap";
const deleteIcon = "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3E%3Csvg version='1.1' id='Ebene_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='595.275px' height='595.275px' viewBox='200 215 230 470' xml:space='preserve'%3E%3Ccircle style='fill:%23F44336;' cx='299.76' cy='439.067' r='218.516'/%3E%3Cg%3E%3Crect x='267.162' y='307.978' transform='matrix(0.7071 -0.7071 0.7071 0.7071 -222.6202 340.6915)' style='fill:white;' width='65.545' height='262.18'/%3E%3Crect x='266.988' y='308.153' transform='matrix(0.7071 0.7071 -0.7071 0.7071 398.3889 -83.3116)' style='fill:white;' width='65.544' height='262.179'/%3E%3C/g%3E%3C/svg%3E";

const BORDER_WIDTH = 3;
const ACTIVE_COLOR = "#F05941";
const emits = defineEmits(['warning', 'saveSetting'])
const props = defineProps({
  backgroundUrl: String,
  // 最多可创建多少个点击区域
  maxAreaCount: {
    type: Number,
    default: 15,
  },
  defaultRectConfigs: {
    type: Array,
    default: () => [],
  }
})


const data = reactive({
  canvas: null,
  currentSelection: {
    startX: 0,
    startY: 0,
  },
  imgWidth: 0,
  imgHeight: 0,
  canvasWidth: 0, // 固定宽度
  canvasHeight: 0,

  selectedRectId: "",
  rectConfig: Array.isArray(props.defaultRectConfigs) &&
    props.defaultRectConfigs.length > 0
    ? props.defaultRectConfigs.reduce(
      (prev, config) => ({ ...prev, [config.rectId]: config.link }),
      {}
    )
    : {}
})

const deleteObject = (target) => {
  delete data.rectConfig[target.rectId];

  const canvas = target.canvas;
  canvas.remove(target);
  canvas.requestRenderAll();
}

const overwriteDeleteControl = () => {
  const deleteIconImg = document.createElement("img");
  deleteIconImg.src = deleteIcon;

  fabric.Object.prototype.controls.deleteControl = new fabric.Control({
    x: 0.5,
    y: -0.5,
    offsetY: 16,
    cursorStyle: "pointer",
    cornerSize: 24,
    mouseUpHandler: (e, transform) => {
      deleteObject(transform.target);
    },
    render(ctx, left, top, styleOverride, fabricObject) {
      const size = 24;
      //   const size = this.cornerSize;

      ctx.save();
      ctx.translate(left, top);
      ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
      ctx.drawImage(deleteIconImg, -size / 2, -size / 2, size, size);
      ctx.restore();
    },
  });
}

const onImgLoad = async (e) => {
  // 获取图片原始宽度
  const { width, height, naturalWidth, naturalHeight } = e.currentTarget;

  console.log('图片原始宽度', width, height, naturalWidth, naturalHeight)
  data.imgWidth = naturalWidth;
  data.imgHeight = naturalHeight;

  data.canvasWidth = width;
  data.canvasHeight = height;

  await nextTick();
  await initCanvas()
}

const initCanvas = () => {
  const bgImg = new fabric.Image(document.getElementById("bgImg"));
  bgImg.scale(data.canvasWidth / data.imgWidth);

  // init with id=canvas
  console.log('bgImg', bgImg);

  const canvas = new fabric.Canvas("canvasdom", {
    backgroundImage: bgImg,
    selectionColor: "rgba(255, 255, 255, 0)",
    selectionLineWidth: BORDER_WIDTH, // 画布中鼠标框选边框
    selectionBorderColor: ACTIVE_COLOR,
  })
  console.log('data.canvas', canvas);

  data.canvas = canvas
  console.log('data.canvas11', data.canvas);


  // 自定义删除按钮
  overwriteDeleteControl();

  canvas.on("selection:cleared", onSelectRect);
  canvas.on("selection:updated", onSelectRect);
  canvas.on("selection:created", onSelectRect);

  canvas.on("mouse:down", (options) => {
    console.log('mouse: down', options.e.offsetX, options.e.offsetY);
    data.currentSelection.startX = options.e.offsetX;
    data.currentSelection.startY = options.e.offsetY;
  });

  canvas.on("mouse:up", (options) => {
    const { pageX, pageY } = options.e;
    console.log('mouse: up', pageX, pageY);

    // 检查拖动热区后是否有重叠。
    // 拖动或缩放 rect 之后 isClick==true
    if (options.isClick) {
      if (checkOverlap(getRectList())) {
        emits("warning", {
          message: "热区之间不可重叠框选，请调整热区！",
        });
        return;
      }
    }

    // 防止移动或者缩放矩形时创建新的热区
    if (options.isClick && options.target) return;

    // 防止通过拖动鼠标框选已经创建的热区
    if (!options.isClick) data.canvas.discardActiveObject();

    if (getRectList().length === props.maxAreaCount) {
      emits("warning", {
        message: `最多只能创建${props.maxAreaCount}个热区`,
      });
      return;
    }

    const ret = getEndPoint(options.e)
    console.log('ret', ret);
    
    addRect(ret);
  });

  // 初始化已经创建的热区
  if (props.defaultRectConfigs.length) {
    initDefaultConfig(props.defaultRectConfigs, canvas);
  }
}

const addRect = ({ x, y }) => {
  const canvas = data.canvas;
  const { startX, startY } = data.currentSelection;

  console.log('startX, startY', startX, startY);
  
  const width = x - startX;
  const height = y - startY;

  // 选区太小的时候不创建 rect，防止误操作
  if (Math.abs(width) <= 10 || Math.abs(height) <= 10) {
    return;
  }

  const rect = createRect({
    top: height < 0 ? startY - Math.abs(height) : startY,
    left: width < 0 ? startX - Math.abs(width) : startX,
    width: Math.abs(width),
    height: Math.abs(height),
    rectId: `${Date.now()}`,
  });

  const hasOverlap = getRectList().some((rect2) =>
    isTwoRectOverlap(rect.getBoundingRect(), rect2.getBoundingRect())
  );
  if (hasOverlap) {
    emits("warning", {
      message: "热区之间不可重叠框选，请调整热区！",
    });
    rect.dispose();
    return;
  }

  canvas.add(rect);
  canvas.setActiveObject(rect);
  data.rectConfig[rect.rectId] = ''
}

// 获取矩形结束点的坐标
const getEndPoint = (options) => {
  const { x, y } = document.getElementById("canvasdom")?.getBoundingClientRect() ?? { x: 0, y: 0 };
  const { pageX, pageY } = options;

  let endX = Math.min(data.canvasWidth, pageX - x) - BORDER_WIDTH; // 防止超出右边界
  endX = Math.max(endX, 0); // 防止超出左边界

  let endY = Math.min(data.canvasHeight, pageY - y) - BORDER_WIDTH; // 防止超出下边界
  endY = Math.max(endY, 0); // 防止超出上边界

  return {
    x: endX,
    y: endY,
  };
}

const getRectList = () => {
  const rectList = [];

  if (!data.canvas) return rectList;

  data.canvas.forEachObject((obj) => {
    if (obj.rectId) {
      rectList.push(obj);
    }
  });

  return rectList;
}
const initDefaultConfig = (configList, canvas) => {
  //   const canvas = data.canvas;
  const { canvasHeight, canvasWidth } = toRaw(data);

  if (canvas) {
    configList.forEach((config) => {
      const rect = createRect({
        top: (config.top * canvasHeight) / config.containerHeight,
        left: (config.left * canvasWidth) / config.containerWidth,
        width: (config.width * canvasWidth) / config.containerWidth - BORDER_WIDTH,
        height: (config.height * canvasHeight) / config.containerHeight - BORDER_WIDTH,
        rectId: config.rectId,
      });

      canvas.add(rect);
    });
  }
}

const onSelectRect = (options) => {
  if (options.selected?.length > 1) {
    data.canvas.discardActiveObject();
  } else if (options.selected?.length === 1) {
    data.selectedRectId = options.selected[0].rectId;
  } else {
    data.selectedRectId = null;
  }
}

const createRect = ({ top, left, width, height, rectId }) => {
  const rect = new fabric.Rect({
    top,
    left,
    width,
    height,
    fill: "rgba(255, 255, 255, 0)",
    stroke: ACTIVE_COLOR, // 边框颜色
    strokeWidth: BORDER_WIDTH, // 边框大小
    transparentCorners: false,
    lockRotation: true, // 不允许旋转
  }).setControlVisible("mtr", false);

  rect.rectId = rectId || `${Date.now()}`;

  rect.on(
    "moving",
    (e) => e.transform?.target && onRectMoving(e.transform.target)
  );
  rect.on(
    "mouseup",
    (e) => e.transform?.target && onRectMouseup(e.transform.target)
  );

  return rect;
}

// 防止移动时候超出边界
const onRectMoving = (target) => {
  const { top, left, lineCoords } = target;
  const { br, tl } = lineCoords;
  const width = br.x - tl.x;
  const height = br.y - tl.y;

  if (left < 0) {
    target.set("left", 0);
  }

  if (top < 0) {
    target.set("top", 0);
  }

  if (left + width >= data.canvasWidth) {
    target.set("left", data.canvasWidth - width);
  }

  if (top + height >= data.canvasHeight) {
    target.set("top", data.canvasHeight - height);
  }
}

// 防止缩放时候超出边界
const onRectMouseup = (target) => {
  const { lineCoords } = target;
  const { br, tl } = lineCoords;
  const options = {
    scaleX: 1,
    scaleY: 1,
  };

  if (tl.x < 0) {
    Object.assign(options, {
      left: 0,
      width: br.x - BORDER_WIDTH,
    });
  } else if (br.x > data.canvasWidth) {
    Object.assign(options, {
      width: data.canvasWidth - tl.x - BORDER_WIDTH,
    });
  } else {
    Object.assign(options, {
      width: br.x - tl.x - BORDER_WIDTH,
    });
  }

  if (tl.y < 0) {
    Object.assign(options, {
      top: 0,
      height: br.y - BORDER_WIDTH,
    });
  } else if (br.y > data.canvasHeight) {
    Object.assign(options, {
      height: data.canvasHeight - tl.y - BORDER_WIDTH,
    });
  } else {
    Object.assign(options, {
      height: br.y - tl.y - BORDER_WIDTH,
    });
  }

  // 缩放矩形选区会导致边框变粗或变细，重新设置属性可以触发图形重新渲染，使边框变回原来的粗细
  target.set(options);
}




const saveDraw = () => {
  const rectList = getRectList();

  if (checkOverlap(rectList)) {
    emits("warning", {
      message: "热区之间不可重叠框选，请调整热区！",
    });
    return;
  }

  const tapAreas = rectList.reduce((prev, curr) => {
    return [
      ...prev,
      {
        ...curr.getBoundingRect(),
        link: data.rectConfig[curr.rectId],
        rectId: curr.rectId,
        containerWidth: data.canvasWidth,
        containerHeight: data.canvasHeight,
      },
    ];
  }, []);

  emits("saveSetting", { tapAreas });
}

</script>

<style scoped lang='scss'>
.scaffold {
  display: flex;
  align-items: flex-start;
  margin-bottom: 20px;

  .canvas-area {
    position: relative;
    border: 1px solid;
  }

  .config-area {
    padding: 20px;

    input {
      margin: 10px 0;
      border-radius: 4px;
      border: 1px solid #ccc;
      height: 24px;
      width: 300px;
    }

    .selected-input {
      position: relative;

      &:before {
        content: "";
        position: absolute;
        left: -14px;
        top: 0;
        bottom: 0;
        margin: auto;
        width: 10px;
        height: 10px;
        border-radius: 100%;
        background-color: #F05941;
      }
    }
  }

  .btn-save {
    display: inline-block;
    border-radius: 6px;
    border: 1px solid;
    padding: 4px 8px;
  }
}

#bgImg {
  position: absolute;
  top: -99999px;
  max-width: 60vw;
  max-height: 60vh;
}
</style>
