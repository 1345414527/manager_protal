<template>
    <div class="user-score-statistic">
        <el-row justify="start" type="flex" align="middle" class="line-chart-select" >

            <!--折线图-->
            <el-col :offset="1">
                <line-chart :chart-data="lineData" :chart-settings="lineSettings" :title="lineTitle" ></line-chart>
            </el-col>

            <el-col  >
                <el-tooltip effect="dark" :enterable="false" content="根据学科进行分析" placement="top-start">
                    <el-select  class="select-subject" v-model="subject"  filterable placeholder="请选择学科类型" clearable>
                        <el-option-group label="热门学科" :key="0">
                            <el-option
                                    v-for="item in hotSujects"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
                        </el-option-group>
                        <el-option-group label="学科" :key="1">
                            <el-option
                                    v-for="item in subjects"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
                        </el-option-group>
                    </el-select>
                </el-tooltip>
            </el-col>
            <el-col :pull="1">
                <heat-map :chart-data="heatMapData" :title="heatMapTitle"
                          :chart-settings="heatMapSetting" :chart-visual-map="heatMapVisualMap">
                </heat-map>
            </el-col>

        </el-row>

        <el-row justify="first" type="flex" >
            <el-col :offset="1">
                <pie-chart :title="pieChartTitle" :chart-settings="pieChartSetting" :chart-data="pieChartData"></pie-chart>
            </el-col>
                <el-col :pull="2">
                    <scatter-chart :title="scatterChartTitle" :chart-settings="scatterChartSetting" :chart-data="scatterChartData"></scatter-chart>
                </el-col>
        </el-row>




    </div>
</template>

<script>
    import LineChart from "../../common/statistic/LineChart";
    import {userExamScore} from "network/exam/examDataHttp";
    import {queryAllSubjects} from "network/subjects/subjectHttp";
    import HeatMap from "../../common/statistic/HeatMap";
    import PieChart from "../../common/statistic/PieChart";
    import ScatterChart from "../../common/statistic/ScatterChart";


    export default {
        name: "UserScoreStatistic",
        data(){
            return {
                subject: null,
                subjects: [],           //学科信息
                hotSujects: [],        //热门学科
                dataNum: 6,
                //折线图
                lineFormatter: '',
                lineSettings: {
                    metrics: ['score','averScore','frequency'],
                    dimension: ['index'],
                    axisSite: { right: ['frequency'] },
                    yAxisName: ['分数/分', '考试次数/次'],
                    labelMap: {
                        'testName': '试卷名称',
                        'beginWorkTime': '开始时间',
                        'finishWorkTime': '结束时间',
                        'frequency': '考试次数',
                        'score': '分数',
                        'averScore': '平均分',
                    },
                    label: {
                        normal: {
                            show: true
                        }
                    }
                },
                lineTitle: '',
                lineData: {
                     columns: [],
                     rows: [{}]
                },
                //热力图
                heatMapSetting: {
                    // xAxisList: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul','Aug','Sept','Oct','Nov','Dec'],
                    // yAxisList: ['Mon','Tues','Wed ','Thur','Fri  ','Sat ','Sun']
                    xAxisList: ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],
                    yAxisList: ['星期一','星期二','星期三','星期四','星期五','星期六','星期日'],
                    labelMap: {
                        'examNum': '考试次数'
                    }
                },
                heatMapData: {
                    columns: [],
                    rows: []
                },
                heatMapTitle: '',
                heatMapVisualMap: {
                    min: 0,
                    max: 20,
                    type: 'piecewise',
                    right: 0,
                    top: '50%',
                    textStyle: {
                        color: 'white'
                    },
                },
                //学科考试次数(圆饼图)
                pieChartTitle: '',
                pieChartData: {
                    columns: [],
                    rows: [],
                },
                pieChartSetting: {
                    roseType: 'radius',
                    dataType: function (value) {
                        return value+"次 "
                    },
                    limitShowNum: 8
                },
                //学科试题个数(散点图)
                scatterChartTitle: '',
                scatterChartData: {
                    columns: [],
                    rows: [],
                },
                scatterChartSetting: {
                    yAxisName: ['题数/题'],
                    dataType: function (value) {
                        return value+"题"
                    },
                    labelMap: {
                        'selectNum': '选择题数目',
                        'judgeNum': '判断题数目',
                        'topicNum': '总题目数目'
                    },
                },

            }
        },
        props: {
          userId: {
              type: String,
              required: false
          }
        },
        methods: {
            //查询所有的学科信息
            querySubjects(){
                queryAllSubjects().then((res)=>{
                    if(res.result_code===200){
                        this.subjects=res.subjects
                        this.hotSujects=[this.subjects[0],this.subjects[2]]
                        this.subject=this.hotSujects[0].id

                    }
                })
            },
            queryExamScore(){
                if(this.subject===null) return
                let user_id;
                if(this.$route.path==='/home/statistics/score/one'){
                    user_id=this.$store.state.user.id
                }else{
                    user_id=this.userId
                }
                userExamScore(this.subject,user_id,this.dataNum).then(res=>{
                    if(res.result_code===260){
                        this.dataInit(res)
                        this.$notify({title: '成功', message: '信息获取成功！', type: 'success', offset: 100, duration: 2000})
                    }else if(res.result_code===461){
                        this.$notify({title: '警告', message: '当前用户暂无考试数据！', type: 'warning', offset: 100, duration: 2000})
                        this.dataInit(res)
                    }else{
                        this.$notify({title: '失败', message: '信息获取失败！请稍后再试！', type: 'error', offset: 100, duration: 2000})
                    }
                })
            },
            dataInit(res){
                //折线图数据
               this.lineDataInit(res)
                //热力图数据
                this.heatMapDataInit(res)
                //饼图数据
                this.pieDataInit(res)
                //散点图数据
                this.scatterDataInit(res)
            },
            //初始化折线图数据
            lineDataInit(res){
                this.lineData.rows=res.userScore.examScores
                for(let i=0;i<this.lineData.rows.length;++i) {
                    this.$set(this.lineData.rows[i],'index',i)

                }
                this.lineData.columns=['testId','testName','beginWorkTime','finishWorkTime','frequency','score','averScore','index']
                this.lineTitle='成绩图'
            },
            //初始化热力图数据
            heatMapDataInit(res){
                let tempData=res.userScore.examDates
                for(let i=0;i<tempData.length;++i){
                    if(tempData[i].examNum>0){
                        this.$set(tempData[i],'考试数',tempData[i].examNum)
                        this.heatMapData.rows.push(tempData[i])

                    }
                }
                this.heatMapData.columns=['month','week','考试数']
                this.heatMapTitle='考试时间分布图 '+res.userScore.year
            },
            //初始化饼图数据
            pieDataInit(res){
                this.pieChartData.rows=res.userScore.examSubjectProportions;
                this.mapperSubjectId2Name(this.pieChartData.rows)
                this.pieChartData.columns=['subjectName','examNum']
                this.pieChartTitle='学科考试次数比例图'
            },
            //初始化散点图数据
            scatterDataInit(res){
                this.scatterChartData.rows=this.pieChartData.rows
                this.scatterChartData.columns=['subjectName','selectNum','judgeNum','topicNum']
                this.scatterChartTitle='学科试题数散点图'
            },
            //根据学科id生成学科名称
            mapperSubjectId2Name(datas){
               for(let i=0;i<datas.length;i++){
                   console.log("存在吗："+this.subjects.find(subject => subject.id === datas[i].subjectId));
                   this.$set(datas[i],'subjectName',this.subjects.find(subject=>subject.id===datas[i].subjectId).name)
                }
            }
        },
        components: {
            LineChart,
            HeatMap,
            PieChart,
            ScatterChart,
        },
        watch: {
            'subject': {
                deep: true,
                immediate: true,
                handler(newVal,oldVal){
                    this.queryExamScore()
                }
            },
            'userId': {
                deep: true,
                immediate: true,
                handler(newVal,oldVal){
                    this.queryExamScore()
                }
            }
        },
        created() {
            this.querySubjects()
        }

    }
</script>

<style lang="less">


    .user-score-statistic{
        position: relative !important;
        z-index: 1;
        height: 100%;
        overflow: auto;
        background-color: rgba(0,0,0,0.3);
        .line-chart-select{
            /*margin-right: 1px !important;*/
            margin-top: 25px;
        }
        .el-input__inner{
            border-radius: 100px !important;
            background-color: transparent !important;
            color: white;
            width: 150px;
        }
    }




</style>