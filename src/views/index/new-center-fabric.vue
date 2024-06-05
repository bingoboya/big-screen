<template>
  <div>
    <div style="height: 580px; width: 100%; box-sizing: border-box; position: relative;">
      <!-- <BorderBox13> -->
        <div style="width: 100%; height: 100%; display: flex; flex-direction: column; justify-content: center;">
          <!-- <Hotimagecomp class="bingo-wrap" style="position: relative;" /> -->
          <!-- <HotimagecompCanvas class="bingo-wrap" style="position: relative;" /> -->
          <HotimagecompCanvasGpt class="bingo-wrap" style="position: relative;" />
          <!-- <FabricComp /> -->
        </div>
      <!-- </BorderBox13> -->
    </div>
  </div>
</template>
<script setup lang="ts">
import BorderBox13 from "@/components/datav/border-box-13";
// import { ElMessage } from "element-plus";
// import FabricComp from './fabric-comp.vue'
import HotimagecompCanvasGpt from './hotimage-comp-canvas-gpt.vue'
import HotimagecompCanvas from './hotimage-comp-canvas.vue'
import Hotimagecomp from './hotimage-comp.vue'

</script>
<style scoped lang="scss"></style>
