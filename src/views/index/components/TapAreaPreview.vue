
<template>
  <div class="preview">
    <div v-if="backgroundUrl" class="canvas-area">
      <img
        alt=""
        class="previewBgImg"
        :style="`width: ${canvasWidth}px;`"
        :src="backgroundUrl"
        @load="onImgLoad"
      />

      <div class="tap-area">
        <div
          class="tap-item"
          v-for="(item, key) in defaultRectConfigs"
          :key="key"
          :style="getRectStyles(item)"
          @click="onItemTap(item)"
        ></div>
      </div>
    </div>

    <div v-if="message" class="message">点击区域关联的信息：{{ message }}</div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const props = defineProps({
    backgroundUrl: {
        type: String,
        default: '',
    },
    defaultRectConfigs: {
        type: Array,
        default: () => [],
    },
})
const canvasWidth = ref(500)
const canvasHeight = ref(0)
const message = ref("")

const onImgLoad = (e) => {
      const { width, height } = e.currentTarget;

      console.log(width, height)

      canvasWidth.value = width;
      canvasHeight.value = height;
    }

    const getRectStyles = (config) => {
    //   const { canvasHeight, canvasWidth } = this;

      const top = (config.top * canvasHeight.value) / config.containerHeight;
      const left = (config.left * canvasWidth.value) / config.containerWidth;
      const width = (config.width * canvasWidth.value) / config.containerWidth;
      const height = (config.height * canvasHeight.value) / config.containerHeight;

      return `top:${top}px; left:${left}px; width:${width}px; height:${height}px;`;
    }
    const onItemTap = (item) => {
      message.value = item.link;
    }
</script>

<script>
export default {
  name: "TapAreaPreview",

//   props: {
//     backgroundUrl: String,
//     defaultRectConfigs: Array,
//   },

  data() {
    return {
      canvasWidth: 500,
      canvasHeight: 0,
      message: "",
    };
  },

  methods: {
    onImgLoad(e) {
      const { width, height } = e.currentTarget;

      canvasWidth.value = width;
      canvasHeight.value = height;
    },

    getRectStyles(config) {
    //   const { canvasHeight, canvasWidth } = this;

      const top = (config.top * canvasHeight.value) / config.containerHeight;
      const left = (config.left * canvasWidth.value) / config.containerWidth;
      const width = (config.width * canvasWidth.value) / config.containerWidth;
      const height = (config.height * canvasHeight.value) / config.containerHeight;

      return `top:${top}px; left:${left}px; width:${width}px; height:${height}px;`;
    },

    onItemTap(item) {
      message.value = item.link;
    },
  },
};
</script>

<style scoped>
.preview {
  display: flex;
}

.canvas-area {
  position: relative;
  border: 1px solid;
  margin-right: 20px;
}

.previewBgImg {
  height: auto;
  vertical-align: top;
}

.tap-area {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}

.tap-item {
  position: absolute;
  background-color: rgba(0, 0, 0, 0.2);
}
</style>
