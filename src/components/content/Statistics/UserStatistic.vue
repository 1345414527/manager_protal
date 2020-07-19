<template>
    <div class="user-statistic">
        <el-row justify="start" type="flex" align="middle"  >

            <!--中国热力图-->
            <el-col :offset="1">
                <heap-map-china :chart-data="heapMapChinaData" :title="heatMapChinaTitle"></heap-map-china>
            </el-col>

            <el-col>
                <radar-chart :title="radarTitle" :chart-data="radarData" :chart-settings="radarSetting"></radar-chart>
            </el-col>



        </el-row>

        <el-row  justify="end" type="flex" class="histogram_chart">
            <histogram-chart class="histogram_chart" :title="histogramTitle" :chart-data="histogramData" :chart-settings="histogramSetting"></histogram-chart>

        </el-row>





    </div>
</template>

<script>
    import HeapMapChina from "../../common/statistic/HeapMapChina";
    import {calculateAllUserData} from "network/userinfo/userInfoHttp";
    import RadarChart from "../../common/statistic/RadarChart";
    import HistogramChart from "../../common/statistic/HistogramChart";

    export default {
        name: "UserStatistic",
        components: {
            HeapMapChina,
            RadarChart,
            HistogramChart
        },
        data(){
            return{
                heapMapChinaData: {
                    columns: ['地区','用户数'],
                    rows: [
                        {'地区':'河北','用户数':100},
                        {'地区':'安徽','用户数':50}
                    ]
                },
                heatMapChinaTitle: '',
                radarTitle: '',
                radarSetting: {
                    labelMap: {
                        'month': '月份',
                        'monthStr': '月份',
                        'averAge': '平均年龄',
                        'userNum': '用户数量',
                    }
                },
                radarData: {
                    columns: [],
                    rows: [{}]
                },
                histogramTitle: '',
                histogramSetting: {
                    labelMap: {
                        'age': '年龄',
                        'userNum': '用户数量',
                        'num': '用户数量'
                    },
                    showLine: ['num'],
                    yAxisName: ['人数/人'],
                    dataType: function (value) {
                        return value+"人"
                    },
                },
                histogramData: {
                    columns: [],
                    rows: [{}]
                }
            }
        },
        methods: {
            //查询统计数据
            queryData(){
              calculateAllUserData().then(res=>{
                  if(res.result_code===261){
                      this.dataInit(res)
                      this.$notify({title: '成功', message: '信息获取成功！', type: 'success', offset: 100, duration: 2000})
                  }else{
                      this.$notify({title: '失败', message: '信息获取失败！请稍后再试！', type: 'error', offset: 100, duration: 2000})
                  }
              })
            },
            //数据初始化
            dataInit(res){
                this.heatMapInit(res)
                this.radarInit(res)
                this.histogramInit(res)
                console.log(res);
            },
            //热力图初始化
            heatMapInit(res){
                this.heapMapChinaData.columns=['province','userNum']
                this.heapMapChinaData.rows=res.userData.areaData
                this.heatMapChinaTitle='用户分布图'
            },
            //雷达图初始化
            radarInit(res){
                this.radarTitle='用户注册情况'
                this.radarData.columns=['monthStr','month','averAge','userNum']
                this.radarData.rows=res.userData.createdTimeData
            },
            //柱形图初始化
            histogramInit(res){
              this.histogramTitle='用户年龄分布'
              this.histogramData.columns=['age','userNum','num']
              this.histogramData.rows=res.userData.ageData
              this.histogramData.rows.forEach(data=>this.$set(data,'num',data.userNum))
            }
        },
        created() {
            this.queryData()
        }

    }
</script>

<style  lang="less">

    .user-statistic {
        position: relative !important;
        z-index: 1;
        height: 120%;
        overflow-y: hidden;
        overflow-x: auto;
        background-color: rgba(0, 0, 0, 0.3);
    }

    .histogram_chart{
        transform: translateX(-100px) translateY(-30px);
    }

</style>