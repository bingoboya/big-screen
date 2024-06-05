<template>
  <div style="position: relative; width: 100%; height: 100%;">
    <img ref="image" :src="imgSrc" style="width: 100%; height: 100%;" @load="onImgLoad" />
    <canvas ref="canvas" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" @click="canvasClick"></canvas>
  </div>
</template>

<script>
import { ref } from 'vue';
import imgSrc from "@/assets/img/middlefactoryareaPic.png";

export default {
  name: 'ImageMap',
  setup() {

    let canvas = null;
    const areas = [
      { shape: 'rect', coords: [50, 50, 150, 150], action: 'action1' },
      { shape: 'rect', coords: [200, 200, 300, 300], action: 'action2' }
    ];

    const onImgLoad = () => {
      const image = imgRef.value;
      canvas = canvasRef.value;
      resizeMap(image);
      drawShapes();
    };

    const resizeMap = (image) => {
      const scale = image.width / image.naturalWidth;
      areas.forEach(area => {
        area.coords = area.coords.map(coord => coord * scale);
      });
    };

    const drawShapes = () => {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'yellow';
      ctx.strokeStyle = 'red';
      areas.forEach(area => {
        if (area.shape === 'rect') {
          ctx.fillRect(area.coords[0], area.coords[1], area.coords[2] - area.coords[0], area.coords[3] - area.coords[1]);
          ctx.strokeRect(area.coords[0], area.coords[1], area.coords[2] - area.coords[0], area.coords[3] - area.coords[1]);
        }
      });
    };

    const canvasClick = (event) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      areas.forEach(area => {
        if (area.shape === 'rect' &&
          x >= area.coords[0] &&
          x <= area.coords[2] &&
          y >= area.coords[1] &&
          y <= area.coords[3]) {
          actions[area.action]();
        }
      });
    };

    const actions = {
      action1() {
        console.log('Action 1 triggered');
        // 触发你想要的事件
      },
      action2() {
        console.log('Action 2 triggered');
        // 触发你想要的事件
      }
    };

    const imgRef = ref(null);
    const canvasRef = ref(null);

    return {
      imgSrc,
      onImgLoad,
      canvasClick,
      imgRef,
      canvasRef
    };
  }
}
</script>

<style scoped>
/* 可以在这里添加样式 */
</style>
