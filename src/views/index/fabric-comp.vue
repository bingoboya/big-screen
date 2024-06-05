<!-- fabric-comp.vue -->
<template>
    <div>
        <div v-if="!warningMessage" class="warning-toast">{{ warningMessage }}</div>

        <!-- <div class="wrapper">
            <div class="title">
                <span>编辑区</span>
                <span class="small-text">保存配置后可在下方预览区区域</span>
            </div>
            <TapAreaCreator :backgroundUrl="bg" :defaultRectConfigs="data.initialConfigs" @warning="showWarning" @saveSetting="saveSetting" />
        </div> -->

        <div class="divider"></div>

        <div class="wrapper">
            <div class="title">
                <span>预览区</span>
                <span class="small-text">点击灰色区域可查看关联的内容</span>
            </div>
            <TapAreaPreview :backgroundUrl="bg" :defaultRectConfigs="data.initialConfigs" />
        </div>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import TapAreaCreator from "./components/TapAreaCreator.vue";
import TapAreaPreview from "./components/TapAreaPreview.vue";
import bg from "@/assets/img/minions.jpg";


const warningMessage = ref('')
const timer = ref(null)

const data = reactive({
    initialConfigs: [
        {
            left: 10,
            top: 10,
            width: 210,
            height: 210,
            link: "123123",
            rectId: "1700203645020",
            containerWidth: 664,
            containerHeight: 373,
        },
    ],
})


const saveSetting = ({ tapAreas }) => {
    data.initialConfigs = tapAreas;
}

const showWarning = ({ message }) => {
    clearTimeout(timer.value);

    warningMessage.value = message;
    timer.value = setTimeout(() => {
        warningMessage.value = "";
    }, 1500);
}




</script>

<style lang="scss" scoped></style>
<style>
.warning-toast {
    position: fixed;
    z-index: 99;
    left: 50%;
    top: 20px;
    transform: translateX(-50%);
    padding: 6px 20px;
    border-radius: 4px;
    background-color: #EC8F5E;
    color: #fff;
}

.wrapper {
    padding: 30px 20px;
}

.title {
    font-size: 28px;
}

.small-text {
    font-size: 16px;
    color: #999;
}

.divider {
    width: 100%;
    height: 1px;
    background-color: #333;
}
</style>