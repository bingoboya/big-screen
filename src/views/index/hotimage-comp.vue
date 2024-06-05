<template>
  <div>
    <img id="img-map" :src="imgSrc" usemap="#image-map" @load="onImgLoad" @resize="resizeMap" />
    <!-- TODO canvas层做自定义不规则热图 <canvas id="canvasdom" width="100%" height="100%"></canvas> -->
    <map name="image-map">
      <!-- TODO 关掉map这层，热图效果依然正常 -->
      <area v-for="(area, index) in data.areas" :key="index" :shape="area.shape" :coords="area.coords.toString()"
        :href="area.href" fill="#0000FF" :alt="area.alt" @click="areaClick(area)" />
    </map>
    <!-- 萃取车间 -->
    <el-popover @show="showPopper1" @hide="hidePopper1" placement="top" teleported persistent :width="400" trigger="hover" popper-class="bingo-popper-class"
      popper-style="box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px; padding: 20px;background: rgb(2 55 127 / 87%); border: 1px solid #33F3FF;" >
      <template #reference>
        <div style="top: 250px; left: 420px; width: 200px; height: 200px;
          position: absolute; background-color: rgba(89, 89, 89, 0.2); border: 2px solid #00F0FF;cursor: pointer;"
          @click="previewAreaClick(333)">
        </div>
      </template>
      <template #default>
        <div style="display: flex; flex-direction: column; width: 100%; height: 100%; ">
          <div style="margin-bottom: 6px; font-size: 18px;color: #1ED6FF;font-weight: Bold; border-bottom: 1px solid rgb(30 214 255 / 30%);padding-bottom: 10px;">
            萃取车间
          </div>
          <div style="display: flex; flex: 1; border: 1px dashed pink; border-radius: 14px; ">
            <div style="display: flex; flex: 4;">
              <PropperChart v-if="showEchart1" />
            </div>
            <div style="flex: 6;padding: 12px; display: flex; flex-direction: column; justify-content: space-around;">
              <div style="display: flex; flex-direction: row; align-items: center; justify-content: space-evenly;">
                <span style="width: 10px; height: 10px; background: #0BFC7F;"></span><span
                  style="color: #fff; opacity: 80%;">运行</span><span
                  style="font-size: 14px; color: #fff;">1035</span><span
                  style="font-size: 14px; color: #fff;">89.8%</span>
              </div>
              <div style="display: flex; flex-direction: row; align-items: center; justify-content: space-evenly;">
                <span style="width: 10px; height: 10px; background: #A0A0A0;"></span><span
                  style="color: #fff; opacity: 80%;">备用</span><span
                  style="font-size: 14px; color: #fff;">1035</span><span
                  style="font-size: 14px; color: #fff;">89.8%</span>
              </div>
              <div style="display: flex; flex-direction: row; align-items: center; justify-content: space-evenly;">
                <span style="width: 10px; height: 10px; background: #F48C02;"></span><span
                  style="color: #fff; opacity: 80%;">停机</span><span
                  style="font-size: 14px; color: #fff;">1035</span><span
                  style="font-size: 14px; color: #fff;">89.8%</span>
              </div>
            </div>
          </div>
        </div>
      </template>
    </el-popover>
    <!-- 综合车间1 -->
    <el-popover @show="showPopper2" @hide="hidePopper2" placement="top" teleported persistent :width="400" trigger="hover" popper-class="bingo-popper-class"
      popper-style="box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px; padding: 20px;background: rgb(2 55 127 / 87%); border: 1px solid #33F3FF;" >
      <template #reference>
        <div style="top: 58px; left: 196px; width: 250px; height: 62px;
          position: absolute; background-color: rgba(89, 89, 89, 0.2); border: 2px solid #00F0FF;cursor: pointer;"
          @click="previewAreaClick(333)">
        </div>
      </template>
      <template #default>
        <div style="display: flex; flex-direction: column; width: 100%; height: 100%; ">
          <div style="margin-bottom: 6px; font-size: 18px;color: #1ED6FF;font-weight: Bold; border-bottom: 1px solid rgb(30 214 255 / 30%);padding-bottom: 10px;">
            综合车间
          </div>
          <div style="display: flex; flex: 1; border: 1px dashed pink; border-radius: 14px; ">
            <div style="display: flex; flex: 4;">
              <PropperChart v-if="showEchart2" />
            </div>
            <div style="flex: 6;padding: 12px; display: flex; flex-direction: column; justify-content: space-around;">
              <div style="display: flex; flex-direction: row; align-items: center; justify-content: space-evenly;">
                <span style="width: 10px; height: 10px; background: #0BFC7F;"></span><span
                  style="color: #fff; opacity: 80%;">运行</span><span
                  style="font-size: 14px; color: #fff;">1035</span><span
                  style="font-size: 14px; color: #fff;">89.8%</span>
              </div>
              <div style="display: flex; flex-direction: row; align-items: center; justify-content: space-evenly;">
                <span style="width: 10px; height: 10px; background: #A0A0A0;"></span><span
                  style="color: #fff; opacity: 80%;">备用</span><span
                  style="font-size: 14px; color: #fff;">1035</span><span
                  style="font-size: 14px; color: #fff;">89.8%</span>
              </div>
              <div style="display: flex; flex-direction: row; align-items: center; justify-content: space-evenly;">
                <span style="width: 10px; height: 10px; background: #F48C02;"></span><span
                  style="color: #fff; opacity: 80%;">停机</span><span
                  style="font-size: 14px; color: #fff;">1035</span><span
                  style="font-size: 14px; color: #fff;">89.8%</span>
              </div>
            </div>
          </div>
        </div>
      </template>
    </el-popover>
    <!-- 综合车间2 -->
    <el-popover @show="showPopper3" @hide="hidePopper3" placement="top" teleported persistent :width="400" trigger="hover" popper-class="bingo-popper-class"
      popper-style="box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px; padding: 20px;background: rgb(2 55 127 / 87%); border: 1px solid #33F3FF;" >
      <template #reference>
        <div style="top: 122px;
    left: 196px;
    width: 62px;
    height: 53px;

          position: absolute; background-color: rgba(89, 89, 89, 0.2); border: 2px solid #00F0FF;cursor: pointer;"
          @click="previewAreaClick(333)">
        </div>
      </template>
      <template #default>
        <div style="display: flex; flex-direction: column; width: 100%; height: 100%; ">
          <div style="margin-bottom: 6px; font-size: 18px;color: #1ED6FF;font-weight: Bold; border-bottom: 1px solid rgb(30 214 255 / 30%);padding-bottom: 10px;">
            综合车间
          </div>
          <div style="display: flex; flex: 1; border: 1px dashed pink; border-radius: 14px; ">
            <div style="display: flex; flex: 4;">
              <PropperChart v-if="showEchart3" />
            </div>
            <div style="flex: 6;padding: 12px; display: flex; flex-direction: column; justify-content: space-around;">
              <div style="display: flex; flex-direction: row; align-items: center; justify-content: space-evenly;">
                <span style="width: 10px; height: 10px; background: #0BFC7F;"></span><span
                  style="color: #fff; opacity: 80%;">运行</span><span
                  style="font-size: 14px; color: #fff;">1035</span><span
                  style="font-size: 14px; color: #fff;">89.8%</span>
              </div>
              <div style="display: flex; flex-direction: row; align-items: center; justify-content: space-evenly;">
                <span style="width: 10px; height: 10px; background: #A0A0A0;"></span><span
                  style="color: #fff; opacity: 80%;">备用</span><span
                  style="font-size: 14px; color: #fff;">1035</span><span
                  style="font-size: 14px; color: #fff;">89.8%</span>
              </div>
              <div style="display: flex; flex-direction: row; align-items: center; justify-content: space-evenly;">
                <span style="width: 10px; height: 10px; background: #F48C02;"></span><span
                  style="color: #fff; opacity: 80%;">停机</span><span
                  style="font-size: 14px; color: #fff;">1035</span><span
                  style="font-size: 14px; color: #fff;">89.8%</span>
              </div>
            </div>
          </div>
        </div>
      </template>
    </el-popover>
    <!-- 综合车间3 -->
    <el-popover @show="showPopper4" @hide="hidePopper4" placement="top" teleported persistent :width="400" trigger="hover" popper-class="bingo-popper-class"
      popper-style="box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px; padding: 20px;background: rgb(2 55 127 / 87%); border: 1px solid #33F3FF;" >
      <template #reference>
        <div style="top: 138px; left: 272px; width: 42px; height: 72px;
          position: absolute; background-color: rgba(89, 89, 89, 0.2); border: 2px solid #00F0FF;cursor: pointer;"
          @click="previewAreaClick(333)">
        </div>
      </template>
      <template #default>
        <div style="display: flex; flex-direction: column; width: 100%; height: 100%; ">
          <div style="margin-bottom: 6px; font-size: 18px;color: #1ED6FF;font-weight: Bold; border-bottom: 1px solid rgb(30 214 255 / 30%);padding-bottom: 10px;">
            综合车间
          </div>
          <div style="display: flex; flex: 1; border: 1px dashed pink; border-radius: 14px; ">
            <div style="display: flex; flex: 4;">
              <PropperChart v-if="showEchart4" />
            </div>
            <div style="flex: 6;padding: 12px; display: flex; flex-direction: column; justify-content: space-around;">
              <div style="display: flex; flex-direction: row; align-items: center; justify-content: space-evenly;">
                <span style="width: 10px; height: 10px; background: #0BFC7F;"></span><span
                  style="color: #fff; opacity: 80%;">运行</span><span
                  style="font-size: 14px; color: #fff;">1035</span><span
                  style="font-size: 14px; color: #fff;">89.8%</span>
              </div>
              <div style="display: flex; flex-direction: row; align-items: center; justify-content: space-evenly;">
                <span style="width: 10px; height: 10px; background: #A0A0A0;"></span><span
                  style="color: #fff; opacity: 80%;">备用</span><span
                  style="font-size: 14px; color: #fff;">1035</span><span
                  style="font-size: 14px; color: #fff;">89.8%</span>
              </div>
              <div style="display: flex; flex-direction: row; align-items: center; justify-content: space-evenly;">
                <span style="width: 10px; height: 10px; background: #F48C02;"></span><span
                  style="color: #fff; opacity: 80%;">停机</span><span
                  style="font-size: 14px; color: #fff;">1035</span><span
                  style="font-size: 14px; color: #fff;">89.8%</span>
              </div>
            </div>
          </div>
        </div>
      </template>
    </el-popover>
    <!-- 包装 -->
    <el-popover @show="showPopper5" @hide="hidePopper5" placement="top" teleported persistent :width="400" trigger="hover" popper-class="bingo-popper-class"
      popper-style="box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px; padding: 20px;background: rgb(2 55 127 / 87%); border: 1px solid #33F3FF;" >
      <template #reference>
        <div style="top: 248px;
    left: 232px;
    width: 70px;
    height: 109px;
          position: absolute; background-color: rgba(89, 89, 89, 0.2); border: 2px solid #00F0FF;cursor: pointer;"
          @click="previewAreaClick(333)">
        </div>
      </template>
      <template #default>
        <div style="display: flex; flex-direction: column; width: 100%; height: 100%; ">
          <div style="margin-bottom: 6px; font-size: 18px;color: #1ED6FF;font-weight: Bold; border-bottom: 1px solid rgb(30 214 255 / 30%);padding-bottom: 10px;">
            包装
          </div>
          <div style="display: flex; flex: 1; border: 1px dashed pink; border-radius: 14px; ">
            <div style="display: flex; flex: 4;">
              <PropperChart v-if="showEchart5" />
            </div>
            <div style="flex: 6;padding: 12px; display: flex; flex-direction: column; justify-content: space-around;">
              <div style="display: flex; flex-direction: row; align-items: center; justify-content: space-evenly;">
                <span style="width: 10px; height: 10px; background: #0BFC7F;"></span><span
                  style="color: #fff; opacity: 80%;">运行</span><span
                  style="font-size: 14px; color: #fff;">1035</span><span
                  style="font-size: 14px; color: #fff;">89.8%</span>
              </div>
              <div style="display: flex; flex-direction: row; align-items: center; justify-content: space-evenly;">
                <span style="width: 10px; height: 10px; background: #A0A0A0;"></span><span
                  style="color: #fff; opacity: 80%;">备用</span><span
                  style="font-size: 14px; color: #fff;">1035</span><span
                  style="font-size: 14px; color: #fff;">89.8%</span>
              </div>
              <div style="display: flex; flex-direction: row; align-items: center; justify-content: space-evenly;">
                <span style="width: 10px; height: 10px; background: #F48C02;"></span><span
                  style="color: #fff; opacity: 80%;">停机</span><span
                  style="font-size: 14px; color: #fff;">1035</span><span
                  style="font-size: 14px; color: #fff;">89.8%</span>
              </div>
            </div>
          </div>
        </div>
      </template>
    </el-popover>
    <!-- 灼烧 -->
    <el-popover @show="showPopper6" @hide="hidePopper6" placement="top" teleported persistent :width="400" trigger="hover" popper-class="bingo-popper-class"
      popper-style="box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px; padding: 20px;background: rgb(2 55 127 / 87%); border: 1px solid #33F3FF;" >
      <template #reference>
        <div style="top: 248px;
    left: 318px;
    width: 70px;
    height: 70px;
          position: absolute; background-color: rgba(89, 89, 89, 0.2); border: 2px solid #00F0FF;cursor: pointer;"
          @click="previewAreaClick(333)">
        </div>
      </template>
      <template #default>
        <div style="display: flex; flex-direction: column; width: 100%; height: 100%; ">
          <div style="margin-bottom: 6px; font-size: 18px;color: #1ED6FF;font-weight: Bold; border-bottom: 1px solid rgb(30 214 255 / 30%);padding-bottom: 10px;">
            灼烧
          </div>
          <div style="display: flex; flex: 1; border: 1px dashed pink; border-radius: 14px; ">
            <div style="display: flex; flex: 4;">
              <PropperChart v-if="showEchart6" />
            </div>
            <div style="flex: 6;padding: 12px; display: flex; flex-direction: column; justify-content: space-around;">
              <div style="display: flex; flex-direction: row; align-items: center; justify-content: space-evenly;">
                <span style="width: 10px; height: 10px; background: #0BFC7F;"></span><span
                  style="color: #fff; opacity: 80%;">运行</span><span
                  style="font-size: 14px; color: #fff;">1035</span><span
                  style="font-size: 14px; color: #fff;">89.8%</span>
              </div>
              <div style="display: flex; flex-direction: row; align-items: center; justify-content: space-evenly;">
                <span style="width: 10px; height: 10px; background: #A0A0A0;"></span><span
                  style="color: #fff; opacity: 80%;">备用</span><span
                  style="font-size: 14px; color: #fff;">1035</span><span
                  style="font-size: 14px; color: #fff;">89.8%</span>
              </div>
              <div style="display: flex; flex-direction: row; align-items: center; justify-content: space-evenly;">
                <span style="width: 10px; height: 10px; background: #F48C02;"></span><span
                  style="color: #fff; opacity: 80%;">停机</span><span
                  style="font-size: 14px; color: #fff;">1035</span><span
                  style="font-size: 14px; color: #fff;">89.8%</span>
              </div>
            </div>
          </div>
        </div>
      </template>
    </el-popover>
    <!-- 草沉 -->
    <el-popover @show="showPopper7" @hide="hidePopper7" placement="top" teleported persistent :width="400" trigger="hover" popper-class="bingo-popper-class"
      popper-style="box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px; padding: 20px;background: rgb(2 55 127 / 87%); border: 1px solid #33F3FF;" >
      <template #reference>
        <div style="top: 322px;
    left: 318px;
    width: 70px;
    height: 70px;
          position: absolute; background-color: rgba(89, 89, 89, 0.2); border: 2px solid #00F0FF;cursor: pointer;"
          @click="previewAreaClick(333)">
        </div>
      </template>
      <template #default>
        <div style="display: flex; flex-direction: column; width: 100%; height: 100%; ">
          <div style="margin-bottom: 6px; font-size: 18px;color: #1ED6FF;font-weight: Bold; border-bottom: 1px solid rgb(30 214 255 / 30%);padding-bottom: 10px;">
            草沉
          </div>
          <div style="display: flex; flex: 1; border: 1px dashed pink; border-radius: 14px; ">
            <div style="display: flex; flex: 4;">
              <PropperChart v-if="showEchart7" />
            </div>
            <div style="flex: 6;padding: 12px; display: flex; flex-direction: column; justify-content: space-around;">
              <div style="display: flex; flex-direction: row; align-items: center; justify-content: space-evenly;">
                <span style="width: 10px; height: 10px; background: #0BFC7F;"></span><span
                  style="color: #fff; opacity: 80%;">运行</span><span
                  style="font-size: 14px; color: #fff;">1035</span><span
                  style="font-size: 14px; color: #fff;">89.8%</span>
              </div>
              <div style="display: flex; flex-direction: row; align-items: center; justify-content: space-evenly;">
                <span style="width: 10px; height: 10px; background: #A0A0A0;"></span><span
                  style="color: #fff; opacity: 80%;">备用</span><span
                  style="font-size: 14px; color: #fff;">1035</span><span
                  style="font-size: 14px; color: #fff;">89.8%</span>
              </div>
              <div style="display: flex; flex-direction: row; align-items: center; justify-content: space-evenly;">
                <span style="width: 10px; height: 10px; background: #F48C02;"></span><span
                  style="color: #fff; opacity: 80%;">停机</span><span
                  style="font-size: 14px; color: #fff;">1035</span><span
                  style="font-size: 14px; color: #fff;">89.8%</span>
              </div>
            </div>
          </div>
        </div>
      </template>
    </el-popover>
    <!-- 污水 -->
    <el-popover @show="showPopper8" @hide="hidePopper8" placement="top" teleported persistent :width="400" trigger="hover" popper-class="bingo-popper-class"
      popper-style="box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px; padding: 20px;background: rgb(2 55 127 / 87%); border: 1px solid #33F3FF;" >
      <template #reference>
        <div style="top: 382px;
    left: 156px;
    width: 148px;
    height: 60px;
          position: absolute; background-color: rgba(89, 89, 89, 0.2); border: 2px solid #00F0FF;cursor: pointer;"
          @click="previewAreaClick(333)">
        </div>
      </template>
      <template #default>
        <div style="display: flex; flex-direction: column; width: 100%; height: 100%; ">
          <div style="margin-bottom: 6px; font-size: 18px;color: #1ED6FF;font-weight: Bold; border-bottom: 1px solid rgb(30 214 255 / 30%);padding-bottom: 10px;">
            污水
          </div>
          <div style="display: flex; flex: 1; border: 1px dashed pink; border-radius: 14px; ">
            <div style="display: flex; flex: 4;">
              <PropperChart v-if="showEchart8" />
            </div>
            <div style="flex: 6;padding: 12px; display: flex; flex-direction: column; justify-content: space-around;">
              <div style="display: flex; flex-direction: row; align-items: center; justify-content: space-evenly;">
                <span style="width: 10px; height: 10px; background: #0BFC7F;"></span><span
                  style="color: #fff; opacity: 80%;">运行</span><span
                  style="font-size: 14px; color: #fff;">1035</span><span
                  style="font-size: 14px; color: #fff;">89.8%</span>
              </div>
              <div style="display: flex; flex-direction: row; align-items: center; justify-content: space-evenly;">
                <span style="width: 10px; height: 10px; background: #A0A0A0;"></span><span
                  style="color: #fff; opacity: 80%;">备用</span><span
                  style="font-size: 14px; color: #fff;">1035</span><span
                  style="font-size: 14px; color: #fff;">89.8%</span>
              </div>
              <div style="display: flex; flex-direction: row; align-items: center; justify-content: space-evenly;">
                <span style="width: 10px; height: 10px; background: #F48C02;"></span><span
                  style="color: #fff; opacity: 80%;">停机</span><span
                  style="font-size: 14px; color: #fff;">1035</span><span
                  style="font-size: 14px; color: #fff;">89.8%</span>
              </div>
            </div>
          </div>
        </div>
      </template>
    </el-popover>
    <!-- 锅炉 -->
    <el-popover @show="showPopper9" @hide="hidePopper9" placement="top" teleported persistent :width="400" trigger="hover" popper-class="bingo-popper-class"
      popper-style="box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px; padding: 20px;background: rgb(2 55 127 / 87%); border: 1px solid #33F3FF;" >
      <template #reference>
        <div style="top: 404px; left: 310px; width: 26px; height: 45px;
          position: absolute; background-color: rgba(89, 89, 89, 0.2); border: 2px solid #00F0FF;cursor: pointer;"
          @click="previewAreaClick(333)">
        </div>
      </template>
      <template #default>
        <div style="display: flex; flex-direction: column; width: 100%; height: 100%; ">
          <div style="margin-bottom: 6px; font-size: 18px;color: #1ED6FF;font-weight: Bold; border-bottom: 1px solid rgb(30 214 255 / 30%);padding-bottom: 10px;">
            锅炉
          </div>
          <div style="display: flex; flex: 1; border: 1px dashed pink; border-radius: 14px; ">
            <div style="display: flex; flex: 4;">
              <PropperChart v-if="showEchart9" />
            </div>
            <div style="flex: 6;padding: 12px; display: flex; flex-direction: column; justify-content: space-around;">
              <div style="display: flex; flex-direction: row; align-items: center; justify-content: space-evenly;">
                <span style="width: 10px; height: 10px; background: #0BFC7F;"></span><span
                  style="color: #fff; opacity: 80%;">运行</span><span
                  style="font-size: 14px; color: #fff;">1035</span><span
                  style="font-size: 14px; color: #fff;">89.8%</span>
              </div>
              <div style="display: flex; flex-direction: row; align-items: center; justify-content: space-evenly;">
                <span style="width: 10px; height: 10px; background: #A0A0A0;"></span><span
                  style="color: #fff; opacity: 80%;">备用</span><span
                  style="font-size: 14px; color: #fff;">1035</span><span
                  style="font-size: 14px; color: #fff;">89.8%</span>
              </div>
              <div style="display: flex; flex-direction: row; align-items: center; justify-content: space-evenly;">
                <span style="width: 10px; height: 10px; background: #F48C02;"></span><span
                  style="color: #fff; opacity: 80%;">停机</span><span
                  style="font-size: 14px; color: #fff;">1035</span><span
                  style="font-size: 14px; color: #fff;">89.8%</span>
              </div>
            </div>
          </div>
        </div>
      </template>
    </el-popover>
  </div>
</template>
<script setup>
import imgSrc from "@/assets/img/middlefactoryareaPic.png";
import { ref, reactive, nextTick } from "vue";
import PropperChart from "./propper-chart.vue";

const showEchart1 = ref(false)
const showEchart2 = ref(false)
const showEchart3 = ref(false)
const showEchart4 = ref(false)
const showEchart5 = ref(false)
const showEchart6 = ref(false)
const showEchart7 = ref(false)
const showEchart8 = ref(false)
const showEchart9 = ref(false)
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
const showPopper1 = async () => {
  await nextTick()
  showEchart1.value = true
}
const hidePopper1 = async () => {
  await nextTick()
  showEchart1.value = false
}
const showPopper2 = async () => {
  await nextTick()
  showEchart2.value = true
}
const hidePopper2 = async () => {
  await nextTick()
  showEchart2.value = false
}
const showPopper3 = async () => {
  await nextTick()
  showEchart3.value = true
}
const hidePopper3 = async () => {
  await nextTick()
  showEchart3.value = false
}
const showPopper4 = async () => {
  await nextTick()
  showEchart4.value = true
}
const hidePopper4 = async () => {
  await nextTick()
  showEchart4.value = false
}
const showPopper5 = async () => {
  await nextTick()
  showEchart5.value = true
}
const hidePopper5 = async () => {
  await nextTick()
  showEchart5.value = false
}
const showPopper6 = async () => {
  await nextTick()
  showEchart6.value = true
}
const hidePopper6 = async () => {
  await nextTick()
  showEchart6.value = false
}
const showPopper7 = async () => {
  await nextTick()
  showEchart7.value = true
}
const hidePopper7 = async () => {
  await nextTick()
  showEchart7.value = false
}
const showPopper8 = async () => {
  await nextTick()
  showEchart8.value = true
}
const hidePopper8 = async () => {
  await nextTick()
  showEchart8.value = false
}
const showPopper9 = async () => {
  await nextTick()
  showEchart9.value = true
}
const hidePopper9 = async () => {
  await nextTick()
  showEchart9.value = false
}
const imgWidth = ref(0)
const imgHeight = ref(0)
const canvasWidth = ref(0)
const canvasHeight = ref(0)


const previewAreaClick = (area) => {
  // alert(`You clicked the area: ${area}`);
}
const areaClick = (area) => {
  alert(`You clicked the area: ${area.alt}`);
}
const resizeMap = () => {
  // 添加对图像尺寸调整的处理代码
  console.log(1111);

  // scaleImageMap()
}
const scaleImageMap = async () => {
  await nextTick()
  console.log('scaleImageMap');

  const img = document.getElementById('img-map')

  console.log('img', img, img.useMap, img.useMap.areas);

  const widthScale = img?.offsetWidth / img?.naturalWidth
  const heightScale = img?.offsetHeight / img?.naturalHeight

  img?.useMap?.areas.forEach((area) => {
    var coords = area.coords.split(',').map((coord) => {
      return parseInt(coord);
    });

    var result;
    if (area.shape.toLowerCase() === 'rect') {
      result = [coords[0] * widthScale, coords[1] * heightScale, coords[2] * widthScale, coords[3] * heightScale];
    } else if (area.shape.toLowerCase() === 'circle') {
      result = [coords[0] * widthScale, coords[1] * heightScale, coords[2] * Math.min(widthScale, heightScale)];
    } else if (area.shape.toLowerCase() === 'poly') {
      result = coords.map((coord, index) => {
        return coord * (index % 2 == 0 ? widthScale : heightScale);
      });
    }

    area.coords = result.join(',');
    console.log('area.coords', area.coords);

  })
};
// window.addEventListener('load', scaleImageMap, false);
// window.addEventListener('resize', scaleImageMap, false);

const onImgLoad = async (e) => {
  // 获取图片原始宽度
  const { width, height, naturalWidth, naturalHeight } = e.currentTarget;

  console.log('图片原始宽度', width, height, naturalWidth, naturalHeight)
  imgWidth.value = naturalWidth;
  imgHeight.value = naturalHeight;

  canvasWidth.value = width;
  canvasHeight.value = height;

  await nextTick();
  // await initCanvas()
}


</script>


<style lang="scss">
.bingo-popper-class {
  .el-popper__arrow:before {
    border: 1px solid #33F3FF !important;
    background: rgba(2, 55, 127, 0.4) !important;
  }
}
</style>