<script setup lang="ts">
import { ref, reactive } from "vue";
import { graphic } from "echarts/core";
import { countUserNum } from "@/api";
import {ElMessage} from "element-plus"

let colors = ["#0BFC7F", "#A0A0A0", "#F48C02", "#F4023C"];
const option = ref({});
const state = reactive({
  lockNum: 0,
  offlineNum: 0,
  onlineNum: 0,
  alarmNum: 0,
  totalNum: 0,
});
const echartsGraphic = (colors: string[]) => {
  return new graphic.LinearGradient(1, 0, 0, 0, [
    { offset: 0, color: colors[0] },
    { offset: 1, color: colors[1] },
  ]);
};
const getData = () => {
  countUserNum().then((res) => {
    console.log("左上--设备状态统计",res);
    if (res.success) {
      state.lockNum = res.data.lockNum;
      state.offlineNum = res.data.offlineNum;
      state.onlineNum = res.data.onlineNum;
      state.totalNum = res.data.totalNum;
      state.alarmNum = res.data.alarmNum;
      setOption();
    }else{
      ElMessage.error(res.msg)
    }
  }).catch(err=>{
    ElMessage.error(err)
  });
};
getData();
const setOption = () => {
  option.value = {
    // title: {
    //   top: "center",
    //   left: "center",
    //   text: [`{value|${state.totalNum}}`, "{name|总数}"].join("\n"),
    //   textStyle: {
    //     rich: {
    //       value: {
    //         color: "#ffffff",
    //         fontSize: 24,
    //         fontWeight: "bold",
    //         lineHeight: 20,
    //         padding:[4,0,4,0]
    //       },
    //       name: {
    //         color: "#ffffff",
    //         lineHeight: 20,
    //       },
    //     },
    //   },
    // },
    // tooltip: {
    //   trigger: "item",
    //   backgroundColor: "rgba(0,0,0,.6)",
    //   borderColor: "rgba(147, 235, 248, .8)",
    //   textStyle: {
    //     color: "#FFF",
    //   },
    // },
    series: [
    {
      type: 'gauge',
      center: ['50%', '60%'],
      startAngle: 180,
      endAngle: 360,
      min: 0,
      max: 100,
      splitNumber: 100,
      // itemStyle: {
      //   color: '#FFAB91'
      // },
      progress: {
        show: true,
        width: 16,
        roundCap: !true, // 是否在两端显示成圆形
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: '#24f2ff' },// 0% 处的颜色
              { offset: 1, color: '#24f2ff' }// 100% 处的颜色
              // { offset: 0, color: 'red' },// 0% 处的颜色
              // { offset: 1, color: 'blue' }// 100% 处的颜色
            ]
          }
        },

      },
      pointer: {
        show: false
      },
      axisLine: {
        show: true,
        roundCap: !true, // 是否在两端显示成圆形
        lineStyle: {
          width: 16,
          color: [[1, '#1f91fd']],
        }
      },
      axisTick: {
        show: false,
        // distance: -45,
        // splitNumber: 5,
        // lineStyle: {
        //   width: 2,
        //   color: '#999'
        // }
      },
      splitLine: {
        show: false,
        distance: -6,
       
        length: 14,
        lineStyle: {
          width: 3,
          color: '#999'
        }
      },
      axisLabel: {
        show: false,
        distance: -20,
        color: '#999',
        fontSize: 20
      },
      anchor: {
        show: false
      },
      title: {
        show: false
      },
      detail: {
        valueAnimation: true,
        // width: '20%',
        lineHeight: 20,
        // borderRadius: 8,
        offsetCenter: [0, '5%'],
        fontSize: 20,
        fontWeight: 'bolder',
        formatter: ' {line2|{value}} {line4|%} \n{line3|完成度}',
        color: 'inherit',
        rich: {
          line2: {
            color: '#fff',
            fontSize:16,
          },
          line4: {
            color: '#fff',
            fontSize:12,
          },
          line3: {
            color: 'red',
            fontSize: 14,
            fontWeight: 600
          }
        }
      },
      data: [
        {
          value: 20
        }
      ]
    },
  ]
  };
};


// setInterval(function () {
//   const random = +(Math.random() * 60).toFixed(2);
//   myChart.setOption({
//     series: [
//       {
//         data: [
//           {
//             value: random
//           }
//         ]
//       },
//       {
//         data: [
//           {
//             value: random
//           }
//         ]
//       }
//     ]
//   });
// }, 2000);


</script>

<template>
  <v-chart class="chart" :option="option" />
</template>

<style scoped lang="scss"></style>
