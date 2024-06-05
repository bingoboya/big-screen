<template>

  <!-- <div style="width: 100%; height: 100%;">
    <img id="img-map" :src="imgSrc" usemap="#image-map" @load="onImgLoad" @resize="resizeMap" />
    <canvas id="canvasdom" width="100%" height="100%"></canvas>
    <map name="image-map">
      <area v-for="(area, index) in data.areas" :key="index" :shape="area.shape" :coords="area.coords.toString()"
        :href="area.href" fill="#0000FF" :alt="area.alt" @click="areaClick(area)" />
    </map>
  </div> -->


  <div style="width: 100%; height: 100%; background: #b9b0b169;">
    <!-- <img ref="imgmap" id="img-map" :src="imgSrc" usemap="#image-map" @load="onImgLoad" @resize="resizeMap" /> -->
    <!-- TODO canvas层做自定义不规则热图 <canvas id="canvasdom" width="100%" height="100%"></canvas> -->
    <canvas id="canvasdom" width="100%" height="100%"></canvas>
    <!--  -->
    <!-- <map name="image-map">
      <area v-for="(area, index) in data.areas" :key="index" :shape="area.shape" :coords="area.coords.toString()"
        :href="area.href" fill="#0000FF" :alt="area.alt" @click="areaClick(area)" />
    </map> -->
  </div>
</template>
<script setup>
import imgSrc from "@/assets/img/middlefactoryareaPic.png";
import { ref, reactive, nextTick } from "vue";
import PropperChart from "./propper-chart.vue";

const imgmap = ref()
const data = reactive({
  areas: [
    {
      shape: 'rect',
      coords: [420, 250, 620, 450],
      href: '#',
      alt: 'A rectangular area'
    },
    // {
    //   shape: 'poly',
    //   coords: [19.567164179104466,52.73631840796019,19.567164179104466,1.990049751243781,637.9751243781094,1.4925373134328357,638.9701492537313,28.358208955223876,464.8407960199004,138.8059701492537,131.50746268656715,130.34825870646765],
    //   href: '#',
    //   alt: 'A sssssss area'
    // },
    // {
    //   shape: 'circle',
    //   coords: [200, 200, 50],
    //   href: '#',
    //   alt: 'A circular area'
    // }
  ]
})


const imgWidth = ref(0)
const imgHeight = ref(0)
const canvasWidth = ref(0)
const canvasHeight = ref(0)


const drawArea = (context, coords) => {
    context.beginPath();
    context.moveTo(coords[0], coords[1]);
    for (let i = 2; i < coords.length; i += 2) {
      context.lineTo(coords[i], coords[i+1]);
    }
    context.closePath();
    context.fill();
  }

 const onImgLoad = () =>{
    let canvasdom = document.getElementById('canvasdom');
    let canvasContext = canvasdom.getContext('2d');
    for(let area of data.areas){
      drawArea(canvasContext, area.coords);
    }
  }
  const resizeMap = () => {
    let canvasdom = document.getElementById('canvasdom');
    canvasdom.width = imgmap?.clientWidth;
    canvasdom.height = imgmap?.clientHeight;
    onImgLoad();
  }


  const areaClick = (area) => {
    alert(`You clicked the area: ${area.alt}`);
  }


// const previewAreaClick = (area) => {
//   // alert(`You clicked the area: ${area}`);
// }
// const resizeMap = () => {
//   // 添加对图像尺寸调整的处理代码
//   console.log(1111);

//   // scaleImageMap()
// }
// const scaleImageMap = async () => {
//   await nextTick()
//   console.log('scaleImageMap');

//   const img = document.getElementById('img-map')

//   console.log('img', img, img.useMap, img.useMap.areas);

//   const widthScale = img?.offsetWidth / img?.naturalWidth
//   const heightScale = img?.offsetHeight / img?.naturalHeight

//   img?.useMap?.areas.forEach((area) => {
//     var coords = area.coords.split(',').map((coord) => {
//       return parseInt(coord);
//     });

//     var result;
//     if (area.shape.toLowerCase() === 'rect') {
//       result = [coords[0] * widthScale, coords[1] * heightScale, coords[2] * widthScale, coords[3] * heightScale];
//     } else if (area.shape.toLowerCase() === 'circle') {
//       result = [coords[0] * widthScale, coords[1] * heightScale, coords[2] * Math.min(widthScale, heightScale)];
//     } else if (area.shape.toLowerCase() === 'poly') {
//       result = coords.map((coord, index) => {
//         return coord * (index % 2 == 0 ? widthScale : heightScale);
//       });
//     }

//     area.coords = result.join(',');
//     console.log('area.coords', area.coords);

//   })
// };
// // window.addEventListener('load', scaleImageMap, false);
// // window.addEventListener('resize', scaleImageMap, false);

// const onImgLoad = async (e) => {
//   // 获取图片原始宽度
//   const { width, height, naturalWidth, naturalHeight } = e.currentTarget;

//   console.log('图片原始宽度', width, height, naturalWidth, naturalHeight)
//   imgWidth.value = naturalWidth;
//   imgHeight.value = naturalHeight;

//   canvasWidth.value = width;
//   canvasHeight.value = height;

//   await nextTick();
//   // await initCanvas()
// }


</script>


<style lang="scss">
.bingo-popper-class {
  .el-popper__arrow:before {
    border: 1px solid #33F3FF !important;
    background: rgba(2, 55, 127, 0.4) !important;
  }
}
</style>