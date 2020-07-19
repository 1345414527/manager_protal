<template>
<div class="histogram-chart">
    <ve-histogram  :data="chartData" :settings="chartSettings" width="600px"  :extend="extend"
                   :after-set-option="afterSetOption"></ve-histogram>
</div>
</template>

<script>
export default {
    name: "HistogramChart",
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
    },
    data() {
            // this.chartSettings = {
            //     axisSite: { right: ['下单率'] },
            //     yAxisType: ['KMB', 'percent'],
            //     yAxisName: ['数值', '比率']
            // }
            return {
                extend: {
                    color: ['#44F0FF', '#19355A'],
                    series: {
                        label: {
                            normal: {
                                show: true,
                                position: 'top'
                            },
                        }
                    }
                }
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
                        // boundaryGap: true,
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
                    dataZoom : [
                        {
                            type: 'slider',
                            show: true,
                            start: 0,
                            end: 100,
                            handleSize: 8
                        },
                        {
                            type: 'inside',
                            start: 94,
                            end: 100
                        },
                        {
                            type: 'slider',
                            show: true,
                            yAxisIndex: 0,
                            filterMode: 'empty',
                            width: 12,
                            height: '70%',
                            handleSize: 8,
                            showDataShadow: false,
                            left: '99%'
                        }
                    ]
                })
            }
        }

}
</script>

<style scoped>

</style>