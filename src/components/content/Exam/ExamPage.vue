<template>
    <div class="exam-page">
        <el-drawer
                :title="testInfo===null?'':testInfo.name"
                close-on-press-escape
                :visible="showTestDrawer"
                :modal="false" :modal-append-to-body="false"
                show-close
                closeDrawer
                :before-close="closeDrawer"
                direction="ttb"
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

            <el-row justify="end" type="flex">
                    <FlipDown :endDate="finishTime" @timeUp="commitExamTest" :type="3" :theme="2" :timeUnit="['时','分','秒']" class="flip-down"/>
            </el-row>

            <!--选择题-->
            <el-row justify="first" type="flex" v-if="testInfo.select!==undefined&&testInfo.select.length>0" style="margin-top: 50px">
                <el-col :offset="5">
                    <p class="topic_title">一. 选择题(每题{{numberFix(testInfo.selectScore,1)}}分)</p>
                </el-col>
            </el-row>
            <el-row justify="first" type="flex" v-if="select.length>0" v-for="(topic,index) in select" :key="topic.id+index" style="margin-top: 30px">

                <el-col :offset="6">
                    <span v-if="currentStatus===1" class="topic-answer">{{topicAnswer[index].userAnswer|filterSelect}}</span>

                    <p class="hintInfo">{{index+1}}. {{topic.name}} </p><br/>

                    <el-radio-group v-model="topicAnswer[index].userAnswer" >
                        <li class="select_item" v-for="(value,key,index2) in topic.select" :key="topic.id+key">
                            <el-radio  :label="key" :disabled="currentStatus===1&&topicAnswer[index].userAnswer!==key">{{key|filterSelect}}:  {{value}}</el-radio>
                        </li>
                    </el-radio-group>
                    <br/>
                    <img v-if="topic.image" :src="topic.image" class="exam-image-show" :alt="topic.name"/>
                </el-col>
            </el-row>
            <el-row justify="first" type="flex" v-if="testInfo.select!==undefined &&testInfo.judge.length>0" style="margin-top: 50px">
                <el-col :offset="5">
                    <p class="topic_title">二. 判断题(每题{{numberFix(testInfo.judgeScore,1)}}分)</p>
                </el-col>
            </el-row>
            <el-row justify="first" type="flex" v-if="testInfo.judge.length>0" v-for="(topic,index) in judge" :key="topic.id+index"  style="margin-top: 30px">
                <el-col :offset="6">
                    <span v-if="currentStatus===1&&topicAnswer[index+testInfo.select.length].userAnswer==='0'" class="topic-answer  el-icon-check"   > </span>
                    <span v-else-if="currentStatus===1&&topicAnswer[index+testInfo.select.length].userAnswer==='1'" class="topic-answer el-icon-close"   > </span>
                    <p class="hintInfo">{{index+1}}. {{topic.name}} </p><br/>
                    <el-radio-group v-model="topicAnswer[index+testInfo.select.length].userAnswer"  >
                        <el-radio style="margin-left: 40px" label="0" :disabled="currentStatus===1&&topicAnswer[index+testInfo.select.length].userAnswer!==0" ><li class="judge_item_1 el-icon-check" ></li></el-radio>
                        <el-radio style="margin-left: 40px" label="1" :disabled="currentStatus===1&&topicAnswer[index+testInfo.select.length].userAnswer!==1"><li class="judge_item_2 el-icon-close"></li></el-radio>
                    </el-radio-group>
                    <br/>
                    <img v-if="topic.image" :src="topic.image" class="exam-image-show" :alt="topic.name"/>
                </el-col>
            </el-row>
            <el-row >
                <el-col :offset="18" style="margin-bottom: 50px;margin-top: 40px">
                    <el-button type="primary" v-if="currentStatus===1" plain @click="rollback">返回答题</el-button>
                    <el-button type="primary" plain @click="commitExam">{{currentStatus===0?'预览':'提交'}}</el-button>
                </el-col>
            </el-row>

        </el-drawer>
    </div>


</template>

<script>
    import {queryAllSubjects} from "network/subjects/subjectHttp";
    import {queryTopicsById} from "network/topic/TopicHttp";
    import FlipDown from 'vue-flip-down';
    import {commitTest} from "network/exam/ExamAnswerHttp";

    export default {
        name: "ExamPage",
        props: {
            testInfo: {
                type: Object,
                require: true
            },
            showTestDrawer: {
                type: Boolean,
                default: false
            },
            finishTime: {
                type: Number,
                require: true,
            }
        },
        data(){
            return{
                subjects: [],
                select: [],
                judge: [],
                subjectName: '',
                topicAnswer: [{topicId: '',userAnswer: ''}], //题目id:题目答案
                currentStatus: 0,                        //状态，0：预览，1：提价
            }
        },
        methods: {
            closeDrawer(){
                this.$confirm('&emsp;&emsp;<span style="color: red">您确定退出吗？退出不会自动提交。退出若刷新页面会清空您的作答！计时不会停止！</span>', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    dangerouslyUseHTMLString: true,

                }).then(() => {
                    this.currentStatus=0
                    this.$message.success("退出成功 ！")
                    this.$emit("closeTestDrawer")
                }).catch(()=>{
                    this.$message.success("请您继续答题 ！")
                })
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
            answerChange(id,result){
                this.topicAnswer.find((topic)=>topic.id===id).id=result+''
            },
            commitExamTest(){
                this.topicAnswer.map(answer=>{
                    this.$set(answer,"subscribeExamId",this.testInfo.id)
                })
                commitTest(this.topicAnswer).then(res=>{
                    if(res.result_code===254){
                        this.currentStatus=0
                        this.topicAnswer=[]
                        this.$notify({title: '成功', message: '提交成功！', type: 'success', offset: 100, duration: 2000})
                        this.$router.go(0)
                    }else{
                        this.$notify({title: '失败', message: '提交失败！请稍后再试！', type: 'error', offset: 100, duration: 2000})
                    }
                })
            },
            //按钮相关操作
            commitExam(){
              if(this.currentStatus===0){
                  let result = this.topicAnswer.find(answer=>answer.userAnswer==='-1');
                  if(result) {
                      this.$confirm('&emsp;&emsp;<span style="color: red">您还有题目没有完成！确认预览吗？</span>', '提示', {
                          confirmButtonText: '确定',
                          cancelButtonText: '取消',
                          type: 'warning',
                          dangerouslyUseHTMLString: true,
                      }).then(() => {
                          this.currentStatus = 1;
                      }).catch(() => {
                          this.$message.success("请您继续答题 ！")
                      })
                  }else{
                      this.currentStatus = 1;
                  }

              }else if(this.currentStatus===1){
                  this.$confirm('&emsp;&emsp;<span style="color: red">您确定提交吗？</span>', '提示', {
                      confirmButtonText: '确定',
                      cancelButtonText: '取消',
                      type: 'warning',
                      dangerouslyUseHTMLString: true,
                  }).then(() => {
                      this.commitExamTest();
                  }).catch(() => {
                      this.$message.success("请您继续答题 ！")
                  })
              }
            },
            rollback(){
                this.currentStatus=0
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
                        for (let i = 0; i < this.testInfo.select.length; i++) {
                            this.$set(this.topicAnswer, i, {topicId: this.testInfo.select[i], userAnswer: '-1'})
                        }
                        for (let i = 0; i < this.testInfo.judge.length; i++) {
                            this.$set(this.topicAnswer, i + this.testInfo.select.length, {
                                topicId: this.testInfo.judge[i],
                                userAnswer: '-1'
                            })
                        }

                    }
                }
            }
        },
    }
</script>

<style lang="less">
    .exam-page{
        .el-drawer{
            width: 90%;
            margin: auto;
            height: 95%!important;
        }
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
</style>