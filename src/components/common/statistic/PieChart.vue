<template>
    <div class="pie-chart">
        <ve-pie :data="chartData" :settings="chartSettings" :after-set-option="afterSetOption"></ve-pie>
    </div>
</template>

<script>
    export default {
        name: "Pie",
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
                    series : [{

                            center : [ '30%', '53%' ],//距离左右，上下距离的百分比
                    }],
                    legend: {
                        left: 20,
                        top: 40,
                        textStyle: {
                            color: 'white'
                        }
                    },

                })
            }
        }
    }
</script>

<style scoped>

</style>