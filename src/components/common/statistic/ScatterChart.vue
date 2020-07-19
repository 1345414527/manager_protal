<template>
    <div class="scatter-chart">
        <ve-scatter :data="chartData" :settings="chartSettings" :after-set-option="afterSetOption"
                    width="900px"></ve-scatter>
    </div>
</template>

<script>
    export default {
        name: "ScatterChart",
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
        data () {
            return {

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
                    // series : [{
                    //
                    //     center : [ '25%', '50%' ],//距离左右，上下距离的百分比
                    // }],
                    legend: {
                        textStyle: {
                            color: 'white'
                        }
                    },
                    xAxis: {
                        boundaryGap: true,
                        axisLabel: {
                            textStyle: {
                                fontSize: 15
                            }
                        },

                    },
                    yAxis: {
                        axisLabel: {
                            textStyle: {
                                fontSize: 15
                            }
                        }
                    },
                    series: {
                        // symbolSize: 16
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