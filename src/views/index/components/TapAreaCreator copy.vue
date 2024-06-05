
<template>
  <div class="scaffold">
    <div class="canvas-area">
      <img id="bgImg" :src="backgroundUrl" alt="" @load="onImgLoad" />
      <canvas id="canvas" :width="canvasWidth" :height="canvasHeight"></canvas>
    </div>

    <div class="config-area mt-8">
      <div class="text-center flex-1 text-20px">
        请在左侧图片上拖动鼠标创建热区，点击可以切换选择
      </div>

      <div
        v-for="(link, key) in rectConfig"
        :key="key"
        :class="{ 'selected-input': selectedRectId === key }"
      >
        <input v-model="rectConfig[key]" />
      </div>

      <div class="btn-save" @click="saveDraw">保存配置</div>
    </div>
  </div>
</template>


<script>
import { fabric } from "fabric";
import { checkOverlap, isTwoRectOverlap } from "@/utils/checkOverlap";
const deleteIcon =
  "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3E%3Csvg version='1.1' id='Ebene_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='595.275px' height='595.275px' viewBox='200 215 230 470' xml:space='preserve'%3E%3Ccircle style='fill:%23F44336;' cx='299.76' cy='439.067' r='218.516'/%3E%3Cg%3E%3Crect x='267.162' y='307.978' transform='matrix(0.7071 -0.7071 0.7071 0.7071 -222.6202 340.6915)' style='fill:white;' width='65.545' height='262.18'/%3E%3Crect x='266.988' y='308.153' transform='matrix(0.7071 0.7071 -0.7071 0.7071 398.3889 -83.3116)' style='fill:white;' width='65.544' height='262.179'/%3E%3C/g%3E%3C/svg%3E";

const BORDER_WIDTH = 3;
const ACTIVE_COLOR = "#F05941";

export default {
  name: "TapAreaCreator",

  props: {
    backgroundUrl: String,
    // 最多可创建多少个点击区域
    maxAreaCount: {
      type: Number,
      default: 5,
    },
    defaultRectConfigs: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    this.canvas = null;
    this.currentSelection = {
      startX: 0,
      startY: 0,
    };

    return {
      imgWidth: 0,
      imgHeight: 0,
      canvasWidth: 0, // 固定宽度
      canvasHeight: 0,

      selectedRectId: "",
      rectConfig:
        Array.isArray(this.defaultRectConfigs) &&
        this.defaultRectConfigs.length > 0
          ? this.defaultRectConfigs.reduce(
              (prev, config) => ({ ...prev, [config.rectId]: config.link }),
              {}
            )
          : {},
    };
  },

  methods: {
    onImgLoad(e) {
      // 获取图片原始宽度
      const { width, height, naturalWidth, naturalHeight } = e.currentTarget;

      this.imgWidth = naturalWidth;
      this.imgHeight = naturalHeight;

      this.canvasWidth = width;
      this.canvasHeight = height;

      this.$nextTick(() => {
        this.initCanvas();
      });
    },

    overwriteDeleteControl() {
      const deleteIconImg = document.createElement("img");
      deleteIconImg.src = deleteIcon;

      fabric.Object.prototype.controls.deleteControl = new fabric.Control({
        x: 0.5,
        y: -0.5,
        offsetY: 16,
        cursorStyle: "pointer",
        cornerSize: 24,
        mouseUpHandler: (e, transform) => {
          this.deleteObject(transform.target);
        },
        render(ctx, left, top, styleOverride, fabricObject) {
          const size = this.cornerSize;

          ctx.save();
          ctx.translate(left, top);
          ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
          ctx.drawImage(deleteIconImg, -size / 2, -size / 2, size, size);
          ctx.restore();
        },
      });
    },

    initCanvas() {
      const bgImg = new fabric.Image(document.getElementById("bgImg"));
      bgImg.scale(this.canvasWidth / this.imgWidth);

      // init with id=canvas
      const canvas = (this.canvas = new fabric.Canvas("canvas", {
        backgroundImage: bgImg,
        selectionColor: "rgba(255, 255, 255, 0)",
        selectionLineWidth: BORDER_WIDTH, // 画布中鼠标框选边框
        selectionBorderColor: ACTIVE_COLOR,
      }));

      // 自定义删除按钮
      this.overwriteDeleteControl();

      canvas.on("selection:cleared", this.onSelectRect);
      canvas.on("selection:updated", this.onSelectRect);
      canvas.on("selection:created", this.onSelectRect);

      canvas.on("mouse:down", (options) => {
        this.currentSelection.startX = options.e.offsetX;
        this.currentSelection.startY = options.e.offsetY;
      });

      canvas.on("mouse:up", (options) => {
        // 检查拖动热区后是否有重叠。
        // 拖动或缩放 rect 之后 isClick==true
        if (options.isClick) {
          if (checkOverlap(this.getRectList())) {
            this.$emit("warning", {
              message: "热区之间不可重叠框选，请调整热区！",
            });
            return;
          }
        }

        // 防止移动或者缩放矩形时创建新的热区
        if (options.isClick && options.target) return;

        // 防止通过拖动鼠标框选已经创建的热区
        if (!options.isClick) this.canvas.discardActiveObject();

        if (this.getRectList().length === this.maxAreaCount) {
          this.$emit("warning", {
            message: `最多只能创建${this.maxAreaCount}个热区`,
          });
          return;
        }

        this.addRect(this.getEndPoint(options.e));
      });

      // 初始化已经创建的热区
      if (this.defaultRectConfigs.length) {
        this.initDefaultConfig(this.defaultRectConfigs);
      }
    },

    onSelectRect(options) {
      if (options.selected?.length > 1) {
        this.canvas.discardActiveObject();
      } else if (options.selected?.length === 1) {
        this.selectedRectId = options.selected[0].rectId;
      } else {
        this.selectedRectId = null;
      }
    },

    // 获取矩形结束点的坐标
    getEndPoint(options) {
      const { x, y } = document
        .getElementById("canvas")
        ?.getBoundingClientRect() ?? { x: 0, y: 0 };
      const { pageX, pageY } = options;

      let endX = Math.min(this.canvasWidth, pageX - x) - BORDER_WIDTH; // 防止超出右边界
      endX = Math.max(endX, 0); // 防止超出左边界

      let endY = Math.min(this.canvasHeight, pageY - y) - BORDER_WIDTH; // 防止超出下边界
      endY = Math.max(endY, 0); // 防止超出上边界

      return {
        x: endX,
        y: endY,
      };
    },

    getRectList() {
      const rectList = [];

      if (!this.canvas) return rectList;

      this.canvas.forEachObject((obj) => {
        if (obj.rectId) {
          rectList.push(obj);
        }
      });

      return rectList;
    },

    deleteObject(target) {
      this.$delete(this.rectConfig, target.rectId);

      const canvas = target.canvas;
      canvas.remove(target);
      canvas.requestRenderAll();
    },

    // 防止移动时候超出边界
    onRectMoving(target) {
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

      if (left + width >= this.canvasWidth) {
        target.set("left", this.canvasWidth - width);
      }

      if (top + height >= this.canvasHeight) {
        target.set("top", this.canvasHeight - height);
      }
    },

    // 防止缩放时候超出边界
    onRectMouseup(target) {
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
      } else if (br.x > this.canvasWidth) {
        Object.assign(options, {
          width: this.canvasWidth - tl.x - BORDER_WIDTH,
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
      } else if (br.y > this.canvasHeight) {
        Object.assign(options, {
          height: this.canvasHeight - tl.y - BORDER_WIDTH,
        });
      } else {
        Object.assign(options, {
          height: br.y - tl.y - BORDER_WIDTH,
        });
      }

      // 缩放矩形选区会导致边框变粗或变细，重新设置属性可以触发图形重新渲染，使边框变回原来的粗细
      target.set(options);
    },

    createRect({ top, left, width, height, rectId }) {
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
        (e) => e.transform?.target && this.onRectMoving(e.transform.target)
      );
      rect.on(
        "mouseup",
        (e) => e.transform?.target && this.onRectMouseup(e.transform.target)
      );

      return rect;
    },

    initDefaultConfig(configList) {
      const canvas = this.canvas;
      const { canvasHeight, canvasWidth } = this;

      if (canvas) {
        configList.forEach((config) => {
          const rect = this.createRect({
            top: (config.top * canvasHeight) / config.containerHeight,
            left: (config.left * canvasWidth) / config.containerWidth,
            width:
              (config.width * canvasWidth) / config.containerWidth -
              BORDER_WIDTH,
            height:
              (config.height * canvasHeight) / config.containerHeight -
              BORDER_WIDTH,
            rectId: config.rectId,
          });

          canvas.add(rect);
        });
      }
    },

    addRect({ x, y }) {
      const canvas = this.canvas;
      const { startX, startY } = this.currentSelection;

      const width = x - startX;
      const height = y - startY;

      // 选区太小的时候不创建 rect，防止误操作
      if (Math.abs(width) <= 10 || Math.abs(height) <= 10) {
        return;
      }

      const rect = this.createRect({
        top: height < 0 ? startY - Math.abs(height) : startY,
        left: width < 0 ? startX - Math.abs(width) : startX,
        width: Math.abs(width),
        height: Math.abs(height),
        rectId: `${Date.now()}`,
      });

      const hasOverlap = this.getRectList().some((rect2) =>
        isTwoRectOverlap(rect.getBoundingRect(), rect2.getBoundingRect())
      );
      if (hasOverlap) {
        this.$emit("warning", {
          message: "热区之间不可重叠框选，请调整热区！",
        });
        rect.dispose();
        return;
      }

      canvas.add(rect);
      canvas.setActiveObject(rect);

      this.$set(this.rectConfig, rect.rectId, "");
    },

    saveDraw() {
      const rectList = this.getRectList();

      if (checkOverlap(rectList)) {
        this.$emit("warning", {
          message: "热区之间不可重叠框选，请调整热区！",
        });
        return;
      }

      const tapAreas = rectList.reduce((prev, curr) => {
        return [
          ...prev,
          {
            ...curr.getBoundingRect(),
            link: this.rectConfig[curr.rectId],
            rectId: curr.rectId,
            containerWidth: this.canvasWidth,
            containerHeight: this.canvasHeight,
          },
        ];
      }, []);

      this.$emit("saveSetting", { tapAreas });
    },
  },
};
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
