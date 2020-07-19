<template>
    <div class="heat-map">
        <ve-heat-map :data="chartData" width="850px" :after-set-option="afterSetOption"
                    :settings="chartSettings" :grid="chartGrid"
                    :visual-map="chartVisualMap"></ve-heat-map>

    </div>
</template>

<script>



    import VeHeatMap  from 'v-charts/lib/heatmap';


    export default {
        name: "HeatMap",
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
            chartVisualMap: {
                type: Object,
                default: {}
            }
        },
        data(){
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
                })
            }
        },
        components: {
            VeHeatMap
        },
        computed: {
            chartGrid(){
                return {
                    right: 80
                }
            }
        }
    }
</script>

<style scoped>

</style>