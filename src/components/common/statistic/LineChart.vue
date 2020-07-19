<template>
    <div class="line-chart">
            <ve-line :data="chartData" :settings="chartSettings" width="500px"  :extend="extend"
                     :after-set-option="afterSetOption" ></ve-line>
    </div>
</template>

<script>
    import VeLine from "v-charts/lib/line";

    export default {
        name: "LineChart",
        props: {
          chartData: {
              type: Object,
              required: true
          },
          chartSettings: {
              type: Object,
              required: true
          },
          title: {
              type: String,
              default: ''
          },
          dataZoomOption: {
              type: Array,
              default: []
          }
          // formatter: {
          //     type: String,
          //     default: '请初始化'
          // }
        },
        data () {
            // this.chartSettings = {
            //     axisSite: { right: ['下单率'] },
            //     yAxisType: ['KMB', 'percent'],
            //     yAxisName: ['数值', '比率']
            // }
            this.extend={
                color: ['#44F0FF', '#19355A'],
                series: {
                    label: {
                        normal: {
                            show: true
                        }
                    }
                }
            }
            return {
                extend: {}
            }
        },
        methods: {
            afterSetOption(chartObj) {
                chartObj.setOption({
                    textStyle: {
                        color: 'white'
                    },
                    title: {
                        text: this.title,
                        textStyle: {
                            color: 'white',
                            textShadowColor: 'blue',
                            fontSize: 25,
                            textShadowBlur: 10,
                            textShadowOffsetX: 1,
                            textShadowOffsetY: 1
                        },
                        left: 0,
                    },
                    legend: {
                        textStyle: {
                            color: 'white',
                            fontSize: 17
                        }
                    },
                    xAxis: {
                        boundaryGap: true,
                        axisLabel: {
                            textStyle: {
                                fontSize: 15
                            }
                        }
                    },
                    yAxis: {
                        axisLabel: {
                            textStyle: {
                                fontSize: 15
                            }
                        }
                    },
                    //滚动缩放
                    dataZoom : this.dataZoomOption
                })
            }
        },
        mounted() {

        },
        components: {
            // VeLine
        }
    }
</script>

<style scoped>

</style>