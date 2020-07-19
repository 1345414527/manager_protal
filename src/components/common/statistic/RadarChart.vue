<template>
    <ve-radar  :data="chartData" :settings="chartSettings" :after-set-option="afterSetOption" height="450px"></ve-radar>
</template>

<script>
    export default {
        name: "RadarChart",
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
                        color: 'white',
                        fontSize: 15
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
                        left: 50,
                    },
                    series: [{
                        // center: ['30%', '53%'],//距离左右，上下距离的百分比
                    }],
                    legend: {
                        // left: 20,
                        // top: -5,
                        textStyle: {
                            color: 'white',
                            fontSize: 12
                        }
                    },

                })
            }
        }
    }
</script>

<style scoped>

</style>