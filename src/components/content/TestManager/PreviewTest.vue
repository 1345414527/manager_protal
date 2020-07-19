<template>
    <div class="previewTest">
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
            <!--选择题-->
            <el-row justify="first" type="flex" v-if="testInfo.select!==undefined&&testInfo.select.length>0" style="margin-top: 50px">
                <el-col :offset="3">
                    <p class="topic_title">一. 选择题(每题{{numberFix(testInfo.selectScore,1)}}分)</p>
                </el-col>
            </el-row>
            <el-row justify="first" type="flex" v-if="select.length>0" v-for="(topic,index) in select" :key="topic.id+index" style="margin-top: 30px">
                <el-col :offset="4">
                    <p class="hintInfo">{{index+1}}. {{topic.name}} </p><br/>

                    <el-radio-group v-model="topicAnswer[index].answer" >
                         <li class="select_item" v-for="(value,key,index2) in topic.select" :key="topic.id+key">
                             <el-radio  :label="key" >{{key|filterSelect}}:  {{value}}</el-radio>
                         </li>
                    </el-radio-group>

                    <br/>
                    <img v-if="topic.image" :src="topic.image" class="exam-image-show" :alt="topic.name"/>
                </el-col>

            </el-row>
            <el-row justify="first" type="flex" v-if="testInfo.select!==undefined &&testInfo.judge.length>0" style="margin-top: 50px">
                <el-col :offset="3">
                    <p class="topic_title">二. 判断题(每题{{numberFix(testInfo.judgeScore,1)}}分)</p>
                </el-col>
            </el-row>
            <el-row justify="first" type="flex" v-if="testInfo.judge.length>0" v-for="(topic,index) in judge" :key="topic.id+index"  style="margin-top: 30px">
                <el-col :offset="4" >
                    <p class="hintInfo">{{index+1}}. {{topic.name}} </p><br/>
                    <el-radio-group v-model="topicAnswer[index+testInfo.select.length].answer" >
                        <el-radio style="margin-left: 40px" label="0"><li class="judge_item_1 el-icon-check" ></li></el-radio>
                        <el-radio style="margin-left: 40px" label="1"><li class="judge_item_2 el-icon-close"></li></el-radio>
                    </el-radio-group>

                    <br/>
                    <img v-if="topic.image" :src="topic.image" class="exam-image-show" :alt="topic.name"/>
                </el-col>

            </el-row>
            <el-row >
                <el-col :offset="18" style="margin-bottom: 50px;margin-top: 40px">
                    <el-button type="primary" plain disabled>提交</el-button>
                </el-col>
            </el-row>
        </el-drawer>
    </div>
</template>

<script>
    import {queryAllSubjects} from "network/subjects/subjectHttp";
    import {queryTopicsById} from "network/topic/TopicHttp";

    export default {
        name: "PreviewTest",
        props: {
            testInfo: {
                type: Object,
                require: true
            },
            showTestDrawer: {
                type: Boolean,
                default: false
            }
        },
        data(){
            return{
                subjects: [],
                select: [],
                judge: [],
                subjectName: '',
                topicAnswer: [{topicId: '',answer: ''}] //题目id:题目答案
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
                        this.subjectName=this.subjects.find((subject)=>subject.id===this.testInfo.subject).name
                    }
                })
                this.querySelect()
                this.queryJudge()
            },
            //查询选择题
            querySelect(){
                queryTopicsById(this.testInfo.select).then((res)=>{

                    if(res.result_code===250){
                        this.select=res.topics
                        console.log("选择---",res.topics);
                    }else{
                        this.$notify({
                            title: '失败',
                            message: '选择题信息获取失败',
                            type: 'error',
                            offset: 100
                        });
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
                    }
                })
            },
            answerChange(id,result){
                this.topicAnswer.find((topic)=>topic.id===id).id=result+''
            }

        },
        computed: {
            numberFix(){
                return function(number,fix){
                    if(number){
                       return  number.toFixed(fix)
                    }
                    return -1
                }
            },
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
            }
        },
        created() {

        },
        filters: {
            filterSelect(value){
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
                            this.$set(this.topicAnswer, i, {topicId: this.testInfo.select[i], answer: '-1'})
                        }
                        for (let i = 0; i < this.testInfo.judge.length; i++) {
                            this.$set(this.topicAnswer, i + this.testInfo.select.length, {
                                topicId: this.testInfo.judge[i],
                                answer: '-1'
                            })
                        }
                    }
                }
            }
        },

    }
</script>

<style lang="less">

    .previewTest{
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
        background-repeat: no-repeat;
    }




</style>