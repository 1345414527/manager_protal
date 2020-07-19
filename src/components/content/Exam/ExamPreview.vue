<template>
    <div class="exam-preview">
        <el-drawer
                :title="testInfo.name"
                close-on-press-escape
                :visible="showTestDrawer"
                :modal="true" :modal-append-to-body="false"
                show-close
                closeDrawer
                :before-close="closeDrawer"
                direction="ltr"
                size="50%" custom-class="testDrawer">
            <el-row type="flex" justify="first">
                <el-col :offset="6">
                    <p>学科: {{subjectName}}</p>
                </el-col>
                <el-col :pull="1">
                    <p>满分: {{totalScore}} 分</p>
                </el-col>
                <el-col :pull="3">
                    <p>限时: {{numberFix(testInfo.astrict,1)}} 分钟</p>
                </el-col>
            </el-row>
            <el-row type="flex" justify="center" >
                <el-col :offset="6">
                    <p>学校: {{testInfo.school}}</p>
                </el-col>
                <el-col >
                    <p>出题人: {{testInfo.creator}} </p>
                </el-col>
            </el-row>

            <el-row justify="fist" type="flex">
                <el-col :offset="15" ><span class="total-score-name">总分：</span><span  class="total-score">{{score}} 分</span></el-col>
            </el-row>

            <!--选择题-->
            <el-row justify="first" type="flex" v-if="testInfo.select!==undefined&&testInfo.select.length>0" style="margin-top: 50px">
                <el-col :offset="5">
                    <p class="topic_title">一. 选择题(每题{{numberFix(testInfo.selectScore,1)}}分)</p>
                </el-col>
            </el-row>
            <el-row justify="first" type="flex" v-if="select.length>0" v-for="(topic,index) in select" :key="topic.id+index" style="margin-top: 30px">

                <el-col :offset="6">
                    <span v-if="topicAnswer[index].answerSituation===1" class="topic-answer  el-icon-check"   > </span>
                    <span v-else class="topic-answer el-icon-close" > </span>

                    <p class="hintInfo">{{index+1}}. {{topic.name}} </p><br/>

                    <el-radio-group v-model="topicAnswer[index].userAnswer" >
                        <li class="select_item" v-for="(value,key,index2) in topic.select" :key="topic.id+key">
                            <el-radio  :label="key" :disabled="topicAnswer[index].userAnswer!==key">{{key|filterSelect}}:  {{value}}</el-radio>
                        </li>
                    </el-radio-group>
                    <br/>
                    <img v-if="topic.image" :src="topic.image" class="exam-image-show" :alt="topic.name"/>
                    <br v-if="topic.image"/><br/><br/>
                    <p>您的答案是：
                        <span  class="my-answer">{{topicAnswer[index].userAnswer|filterSelect}}</span>
                        <span v-if="topicAnswer[index].answerSituation===1" class="right-answer">正确</span>
                        <span v-else class="error-answer">错误</span>
                        <span class="get-score">得分：{{topicAnswer[index].score}}</span>
                    </p><br/><br/>
                </el-col>
            </el-row>
            <el-row justify="first" type="flex" v-if="testInfo.select!==undefined &&testInfo.judge.length>0" style="margin-top: 50px">
                <el-col :offset="5">
                    <p class="topic_title">二. 判断题(每题{{numberFix(testInfo.judgeScore,1)}}分)</p>
                </el-col>
            </el-row>
            <el-row justify="first" type="flex" v-if="testInfo.judge.length>0" v-for="(topic,index) in judge" :key="topic.id+index"  style="margin-top: 30px">
                <el-col :offset="6">
                    <span v-if="topicAnswer[index+testInfo.select.length].answerSituation===1" class="topic-answer  el-icon-check"   > </span>
                    <span v-else class="topic-answer el-icon-close"   > </span>
                    <p class="hintInfo">{{index+1}}. {{topic.name}} </p><br/>
                    <el-radio-group v-model="topicAnswer[index+testInfo.select.length].userAnswer"  >
                        <el-radio style="margin-left: 40px" label="0" :disabled="topicAnswer[index+testInfo.select.length].userAnswer!=='0'" ><li class="judge_item_1 el-icon-check" ></li></el-radio>
                        <el-radio style="margin-left: 40px" label="1" :disabled="topicAnswer[index+testInfo.select.length].userAnswer!=='1'"><li class="judge_item_2 el-icon-close"></li></el-radio>
                    </el-radio-group>
                    <br/>
                    <img v-if="topic.image" :src="topic.image" class="exam-image-show" :alt="topic.name"/>
                    <br/>
                    <br/><br/>
                    <p>您的答案是：

                        <span  class="my-answer el-icon-close" v-if="topicAnswer[index+testInfo.select.length].userAnswer==='1'" ></span>
                        <span  class="my-answer el-icon-check" v-else-if="topicAnswer[index+testInfo.select.length].userAnswer==='0'"  ></span>
                        <span  class="my-answer " v-else  ></span>
                        <span v-if="topicAnswer[index+testInfo.select.length].answerSituation===1" class="right-answer">正确</span>
                        <span v-else class="error-answer">错误</span>
                        <span class="get-score">得分：{{topicAnswer[index+testInfo.select.length].score}}</span>
                    </p>
                    <br/><br/>
                </el-col>
            </el-row>
            <div style="margin-bottom: 110px"></div>
        </el-drawer>
    </div>


</template>

<script>
    import {queryAllSubjects} from "network/subjects/subjectHttp";
    import {queryTopicsById} from "network/topic/TopicHttp";
    import FlipDown from 'vue-flip-down';
    import {queryAllExamResult} from "network/exam/examResultHttp";

    export default {
        name: "ExamPreview",
        props: {
            testInfo: {
                type: Object,
                require: true
            },
            showTestDrawer: {
                type: Boolean,
                default: false
            },
        },
        data(){
            return{
                subjects: [],
                select: [],
                judge: [],
                subjectName: '',
                topicAnswer: [{topicId: '',userAnswer: '',answerSituation: 0,score: 0}], //题目id；用户答案；是否正确，所得分数
                score: 0,  //总分
                examResult: null
            }
        },
        methods: {
            closeDrawer(){
                this.$emit("closeTestDrawer")
            },
            querySubjects(){
                queryAllSubjects().then((res)=>{
                    if(res.result_code===200){
                        this.subjects=res.subjects
                        let data=this.subjects.find((subject)=>subject.id===this.testInfo.subject)
                        if(data){
                            this.subjectName=data.name
                        }
                    }
                })
                this.querySelect()
                this.queryJudge()
            },
            //查询选择题
            querySelect(){
                console.log("选择题信息是:",this.testInfo.select)

                queryTopicsById(this.testInfo.select).then((res)=>{
                    if(res.result_code===250){
                        this.select=res.topics
                    }else{
                        this.$notify({
                            title: '失败',
                            message: '选择题信息获取失败',
                            type: 'error',
                            offset: 100
                        });
                        this.$emit("closeTestDrawer")
                    }
                })
            },
            //查询判断题
            queryJudge(){
                console.log("判断题信息是:",this.testInfo.judge)
                queryTopicsById(this.testInfo.judge).then((res)=>{
                    if(res.result_code===250){
                        this.judge=res.topics
                    }else{
                        this.$notify({
                            title: '失败',
                            message: '判断题信息获取失败',
                            type: 'error',
                            offset: 100
                        });
                        this.$emit("closeTestDrawer")
                    }
                })
            },
            //查询答题结果
            queryExamResult(){
                queryAllExamResult(this.testInfo.id).then(res=>{
                    if(res.result_code===255){
                        this.examResult=res.examResult
                        this.$message.success("信息获取成功")
                        this.topicAnswer=[{topicId: '',userAnswer: '',answerSituation: 0,score: 0}]
                        this.score=this.examResult.score
                        for (let i = 0; i < this.testInfo.select.length; i++) {
                            let answer;
                            if(this.examResult.examAnswerSituations.length>0){
                                answer= this.examResult.examAnswerSituations.find(answer=>answer.topicId===this.testInfo.select[i])
                                if(answer!==null){
                                    this.$set(this.topicAnswer, i, {topicId: this.testInfo.select[i], userAnswer: answer.userAnswer,
                                        answerSituation: answer.answerSituation,score: answer.score})
                                    continue
                                }

                            }
                            this.$set(this.topicAnswer, i, {topicId: this.testInfo.select[i], userAnswer: '-1',
                                answerSituation: 0,score: 0})

                        }
                        for (let i = 0; i < this.testInfo.judge.length; i++) {
                            let answer
                            if(this.examResult.examAnswerSituations.length>0) {
                                answer = this.examResult.examAnswerSituations.find(answer => answer.topicId === this.testInfo.judge[i])
                                if (answer !== null) {
                                    this.$set(this.topicAnswer, i + this.testInfo.select.length, {
                                        topicId: this.testInfo.judge[i], userAnswer: answer.userAnswer,
                                        answerSituation: answer.answerSituation, score: answer.score
                                    })
                                    continue
                                }
                            }
                            this.$set(this.topicAnswer, i + this.testInfo.select.length, {topicId: this.testInfo.judge[i], userAnswer: '-1',
                                answerSituation: 0,score: 0})
                        }
                    }else{
                        this.$message.error("信息获取失败")
                    }
                })
            }
        },
        computed: {
            //数字的小数转换
            numberFix(){
                return function(number,fix){
                    if(number){
                        return  number.toFixed(fix)
                    }
                    return -1
                }
            },
            //总分
            totalScore(){
                let selectScore=0
                let judgeScore=0
                if(this.testInfo.select!==undefined&&this.testInfo.selectScore!==undefined){
                    selectScore=this.testInfo.select.length*this.testInfo.selectScore
                }
                if(this.testInfo.judge!==undefined&&this.testInfo.judgeScore!==undefined){
                    judgeScore=this.testInfo.judge.length*this.testInfo.judgeScore
                }
                return selectScore+judgeScore
            },
            //计算倒计时
            countdown(){
                let start
            }
        },
        created() {

        },
        components: {
            FlipDown
        },
        filters: {
            filterSelect(value){
                if(value==='-1'){
                    return ''
                }
                return String.fromCharCode(parseInt(value)+65)
            },
        },
        watch: {
            'testInfo': {
                deep: true,
                // immediate: true,
                handler(val,val2){
                    if(val!=null) {
                        this.querySubjects()
                        this.querySelect()
                        this.queryJudge()
                        this.queryExamResult()
                    }
                }
            }
        },
    }
</script>

<style lang="less">
    .exam-preview{
        .el-drawer__header{
            font-size: 30px;
            color: black;
            text-align: center;
        }
        .el-drawer__body{
            overflow-y: auto;
        }
        .el-radio {
            color: black !important;
        }
        .flip-down{
            position: fixed;
        }
    }

</style>

<style scoped>
    p{
        display: inline-block;
        max-width: 800px;
    }

    .judge_item_1{
        margin-left: 60px;
        font-size: 23px;
        margin-top: 20px;
    }

    .judge_item_2{
        margin-left: 80px;
        font-size: 23px;
        margin-top: 20px;
    }

    .select_item{
        margin-left: 40px;
        font-size: 17px;
        margin-top: 10px;
    }
    .exam-image-show{
        margin-left: 80px;
        margin-top: 30px;
        height: 150px;
        width: 200px;
    }

    .topic-answer{
        position: absolute;
        transform: translateX(-40px);
        font-size: 30px;
        color: #5c2223;
        text-shadow:2px -3px 3px #eea2a4;
    }

    .right-answer{
        color: green;
        margin-left: 50px;
        text-shadow:2px -3px 3px #eea2a4;
    }

    .error-answer{
        color: red;
        margin-left: 50px;
        text-shadow:5px -5px 5px #eea2a4;
    }

    .get-score{
        color: black;
        margin-left: 40px;
        text-shadow:5px -5px 5px #eea2a4;
    }

    .my-answer{
        color: #5c2223;
        text-shadow:5px -5px 5px #eea2a4;
    }

    .total-score-name{
        font-size: 30px;
        color: green;
        text-shadow:10px -10px 7px #eea2a4;
    }

    .total-score{
        font-size: 60px;
        color: #5c2223;
        text-shadow:10px -10px 7px #eea2a4;
    }
</style>