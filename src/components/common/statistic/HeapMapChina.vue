<template>
    <div class="heat-map-china">
        <ve-map
                class="echarts-map"
                :data="chartData"
                :settings="chartSettings"
                height="600px"
                width="600px"
                :extend="chartExtend"
                :after-set-option="afterSetOption"
        ></ve-map>
    </div>
</template>

<script>
    export default {
        name: "HeapMapChina",
        props: {
            chartData: {
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
                afterSetOption(chartObj) {
                    chartObj.setOption({
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
                    })
                },
                chartSettings: {
                    position: 'china',
                    metrics: ['userNum'],
                    labelMap: {
                        'province': '地区',
                        'userNum': '用户数'
                    },
                    itemStyle: {
                        normal: {
                            borderColor: '#72F2FF',
                            areaColor: '#7F8FA3',
                            borderWidth: 2,
                            shadowBlur: 1
                        },
                        emphasis: {
                            borderColor: '#72F2FF',
                            areaColor: '#19355A',
                            borderWidth: 1,
                            shadowBlur: 1
                        }
                    },
                    label: {
                        normal: {
                            show: true,
                            formatter: function (params) {
                                if (params.value) {
                                    return params.name + ' ' + params.value // 地图上展示文字 + 数值
                                } else {
                                    return ''
                                }
                            },
                            color: '#fff',
                            backgroundColor: 'rgba(0, 15, 42, 0.3)',
                            fontSize: 12,
                            align: 'right',
                            verticalAlign: 'top',
                            lineHeight: 12,
                            padding: 4,
                            borderRadius: 4
                        },
                        emphasis: {
                            show: true,
                            formatter: function (params) {
                                if (params.value) {
                                    return params.name + ' ' + params.value // 地图上展示文字 + 数值
                                } else {
                                    return ''
                                }
                            },
                            color: '#44F0FF'
                        }
                    },
                    zoom: 1,
                    selectData: true,
                    scaleLimit: {
                        min: 1,
                        max: 2
                    },
                    roam: true
                },
                chartExtend: {
                    legend: {
                        show: false
                    },
                    visualMap: [
                        {
                            type: 'continuous',
                            left: 'left',
                            top: 'bottom',
                            calculable: true,
                            text: ['高', '低'],
                            inRange: {
                                color: ['#4C627F', '#334C6D', '#19355A']
                            },
                            textStyle: {
                                color: '#fff'
                            }
                        }
                    ]
                },
            }
        },
    }
</script>

<style scoped>

</style>