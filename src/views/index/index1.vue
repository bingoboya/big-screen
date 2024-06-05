<script setup lang="ts">
import ItemWrap from "@/components/item-wrap";
import NewRightTop from "./new-right-top.vue";
import NewLeftTop from "./new-left-top.vue";
import CenterBottomLeft from "./center-bottom-left.vue";
import CenterBottomRight from "./center-bottom-right.vue";
import NewRightBottom from "./new-right-bottom.vue";
import NewLeftBottom from "./new-left-bottom.vue";
import NewCenterFabric from './new-center-fabric.vue'
import { ref } from "vue";


const toogleFlag = ref(true)
</script>

<template>
  <div class="index-box">
    <div class="contetn_left">
      <ItemWrap class="contetn_left-top contetn_lr-item" style="height: 620px !important;" title="点检任务情况">
        <div v-show="toogleFlag"
          style="display: flex; height: calc(100% - 20px); flex-direction: column;align-items: center;justify-content: space-between;gap: 20px;">
          <div style="display: flex; flex: 1; border: 1px dashed pink; border-radius: 14px; width: 100%;">
            <div style="display: flex; flex: 4;">
              <NewLeftTop />
            </div>
            <div style="flex: 6;padding: 12px; display: flex; flex-direction: column; justify-content: space-evenly;">
              <div><span style="color: #24f2ff">日点检</span><span>计划任务数：</span><span style="color: #24f2ff">8</span></div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr; gap: 20px;">
                <div>完成：<span style="color: #24f2ff">2</span></div>
                <div>进行中：<span style="color: #24f2ff">2</span></div>
                <div>漏检：<span style="color: #24f2ff">21</span></div>
                <div>未开始：<span style="color: #24f2ff">23</span></div>
              </div>
            </div>
          </div>
          <div style="display: flex; flex: 1; border: 1px dashed pink; border-radius: 14px; width: 100%;">
            <div style="display: flex; flex: 4;">
              <NewLeftTop />
            </div>
            <div style="flex: 6;padding: 12px; display: flex; flex-direction: column; justify-content: space-evenly;">
              <div><span style="color: #24f2ff">月点检</span><span>计划任务数：</span><span style="color: #24f2ff">8</span></div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr; gap: 20px;">
                <div>完成：<span style="color: #24f2ff">2</span></div>
                <div>进行中：<span style="color: #24f2ff">2</span></div>
                <div>漏检：<span style="color: #24f2ff">21</span></div>
                <div>未开始：<span style="color: #24f2ff">23</span></div>
              </div>
            </div>
          </div>
          <div style="display: flex; flex: 1; border: 1px dashed pink; border-radius: 14px; width: 100%;">
            <div style="display: flex; flex: 4;">
              <NewLeftTop />
            </div>
            <div style="flex: 6;padding: 12px; display: flex; flex-direction: column; justify-content: space-evenly;">
              <div><span style="color: #24f2ff">年点检</span><span>计划任务数：</span><span style="color: #24f2ff">8</span></div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr; gap: 20px;">
                <div>完成：<span style="color: #24f2ff">2</span></div>
                <div>进行中：<span style="color: #24f2ff">2</span></div>
                <div>漏检：<span style="color: #24f2ff">21</span></div>
                <div>未开始：<span style="color: #24f2ff">23</span></div>
              </div>
            </div>
          </div>

        </div>
      </ItemWrap>
      <ItemWrap class="contetn_left-bottom contetn_lr-item" title="异常上报情况" style="padding: 0 10px 16px 10px">
        <NewLeftBottom v-show="toogleFlag" />
      </ItemWrap>
    </div>
    <div class="content_center">
      <NewCenterFabric style="flex: 5; margin-top: 20px;" />
      <div style="display: flex; ">
        <ItemWrap class="content_center-bottom" title="设备报警状态">
          <CenterBottomLeft v-show="toogleFlag" />
        </ItemWrap>
        <ItemWrap class="content_center-bottom" title="设备缺陷状态">
          <CenterBottomRight v-show="toogleFlag" />
        </ItemWrap>
      </div>
    </div>
    <div class="contetn_right">
      <ItemWrap class="contetn_left-bottom contetn_lr-item" style="height: 620px !important;" title="设备状态统计">
        <div v-show="toogleFlag"
          style="display: flex; height: calc(100% - 20px); flex-direction: column;align-items: center;justify-content: space-between;gap: 20px;">
          <div style="display: flex; flex: 1; border: 1px dashed pink; border-radius: 14px; width: 100%;">
            <div style="display: flex; flex: 4;">
              <NewRightTop />
            </div>
            <div style="flex: 6;padding: 12px; display: flex; flex-direction: column; justify-content: space-around;">
              <div style="display: flex; flex-direction: row; align-items: center; justify-content: space-evenly;">
                <span
                  style="width: 10px; height: 10px; background: #0BFC7F;"></span><span>运行</span><span>1035</span><span>89.8%</span>
              </div>
              <div style="display: flex; flex-direction: row; align-items: center; justify-content: space-evenly;">
                <span
                  style="width: 10px; height: 10px; background: #A0A0A0;"></span><span>备用</span><span>1035</span><span>89.8%</span>
              </div>
              <div style="display: flex; flex-direction: row; align-items: center; justify-content: space-evenly;">
                <span
                  style="width: 10px; height: 10px; background: #F48C02;"></span><span>停机</span><span>1035</span><span>89.8%</span>
              </div>
              <div style="display: flex; flex-direction: row; align-items: center; justify-content: space-evenly;">
                <span
                  style="width: 10px; height: 10px; background: #F4023C;"></span><span>检修</span><span>1035</span><span>89.8%</span>
              </div>
            </div>
          </div>
          <div style="display: flex; flex: 1; border: 1px dashed pink; border-radius: 14px; width: 100%;">
            <div style="display: flex; flex: 4;">
              <NewRightTop />
            </div>
            <div style="flex: 6;padding: 12px; display: flex; flex-direction: column; justify-content: space-around;">
              <div style="display: flex; flex-direction: row; align-items: center; justify-content: space-evenly;">
                <span
                  style="width: 10px; height: 10px; background: #0BFC7F;"></span><span>运行</span><span>1035</span><span>89.8%</span>
              </div>
              <div style="display: flex; flex-direction: row; align-items: center; justify-content: space-evenly;">
                <span
                  style="width: 10px; height: 10px; background: #A0A0A0;"></span><span>备用</span><span>1035</span><span>89.8%</span>
              </div>
              <div style="display: flex; flex-direction: row; align-items: center; justify-content: space-evenly;">
                <span
                  style="width: 10px; height: 10px; background: #F48C02;"></span><span>停机</span><span>1035</span><span>89.8%</span>
              </div>
              <div style="display: flex; flex-direction: row; align-items: center; justify-content: space-evenly;">
                <span
                  style="width: 10px; height: 10px; background: #F4023C;"></span><span>检修</span><span>1035</span><span>89.8%</span>
              </div>

            </div>
          </div>
          <div style="display: flex; flex: 1; border: 1px dashed pink; border-radius: 14px; width: 100%;">
            <div style="display: flex; flex: 4;">
              <NewRightTop />
            </div>
            <div style="flex: 6;padding: 12px; display: flex; flex-direction: column; justify-content: space-around;">
              <div style="display: flex; flex-direction: row; align-items: center; justify-content: space-evenly;">
                <span
                  style="width: 10px; height: 10px; background: #0BFC7F;"></span><span>运行</span><span>1035</span><span>89.8%</span>
              </div>
              <div style="display: flex; flex-direction: row; align-items: center; justify-content: space-evenly;">
                <span
                  style="width: 10px; height: 10px; background: #A0A0A0;"></span><span>备用</span><span>1035</span><span>89.8%</span>
              </div>
              <div style="display: flex; flex-direction: row; align-items: center; justify-content: space-evenly;">
                <span
                  style="width: 10px; height: 10px; background: #F48C02;"></span><span>停机</span><span>1035</span><span>89.8%</span>
              </div>
              <div style="display: flex; flex-direction: row; align-items: center; justify-content: space-evenly;">
                <span
                  style="width: 10px; height: 10px; background: #F4023C;"></span><span>检修</span><span>1035</span><span>89.8%</span>
              </div>

            </div>
          </div>
        </div>
      </ItemWrap>

      <ItemWrap class="contetn_left-bottom contetn_lr-item" title="检测仪器状态">
        <div style="height: 100%; display: flex; gap: 10px;flex-direction: column;">
          <div
            style="flex: 24; display: flex;justify-content: space-around;border: 1px dashed pink; border-radius: 6px;">
            <div
              style="flex: 1;display: flex; align-items: center; flex-direction: column; justify-content: space-between;padding: 4px;">
              <div>离线设备</div>
              <div>10</div>
            </div>
            <div
              style="flex: 1;display: flex; align-items: center; flex-direction: column; justify-content: space-between;padding: 4px;border-left: 1px dashed;border-right: 1px dashed;">
              <div>在线设备</div>
              <div>2</div>
            </div>
            <div
              style="flex: 1;display: flex; align-items: center; flex-direction: column; justify-content: space-between;padding: 4px;">
              <div>点控设备</div>
              <div>4</div>
            </div>
          </div>
          <div style="flex: 76;">
            <NewRightBottom v-show="toogleFlag" />
          </div>
        </div>
      </ItemWrap>
    </div>
  </div>
</template>

<style scoped lang="scss">
.index-box {
  width: 100%;
  display: flex;
  min-height: calc(100% - 64px);
  justify-content: space-between;
}

//左边 右边 结构一样
.contetn_left,
.contetn_right {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  position: relative;
  width: 440px;
  box-sizing: border-box;
  flex-shrink: 0;
}

.content_center {
  flex: 1;
  margin: 0 10px;
  display: flex;
  flex-direction: column;

  .content_center-bottom {
    height: 315px;
  }
}

.contetn_lr-item {
  height: 310px;
}
</style>
