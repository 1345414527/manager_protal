<template>
    <div class="editTest">
        <el-card class="box-card">
            <!--面包屑导航区-->
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>试卷管理</el-breadcrumb-item>
                <el-breadcrumb-item :to="{path: '/home/testManage'}">试题管理</el-breadcrumb-item>
                <el-breadcrumb-item>编辑试题</el-breadcrumb-item>
            </el-breadcrumb>
            <el-steps :active="active">
                <el-step title="步骤 1" description="填修改基本信息"></el-step>
                <el-step title="步骤 2" description="选择题目"></el-step>
                <el-step title="步骤 3" description="修改备注"></el-step>
                <el-step title="步骤 4" description="完成"></el-step>
            </el-steps>
            <el-tabs tab-position="left" :before-leave="confirmInfo">
                <el-tab-pane label="信息填写" clas="tabPane">
                    <el-form :model="testInfo" :rules="rules" ref="baseInfoRef" label-width="100px" class="demo-ruleForm">
                        <el-form-item prop="subject">
                            <el-row justify="start" type="flex" >

                                <el-col :span="5">
                                    <i class="redStar">*</i>
                                    <span class="hintInfo">试题类型</span>
                                </el-col>
                                <el-col :span="3">
                                    <el-select v-model="testInfo.subject" filterable placeholder="请选择学科类型" >
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
                                </el-col>
                                <el-col :span="8" :offset="6" >
                                    <el-alert
                                            title="如果不输入选择题或判断题分数，接下来将无法进行选择相应题目"
                                            type="warning">
                                    </el-alert>
                                </el-col>

                            </el-row>
                        </el-form-item>
                        <el-form-item prop="name">
                            <el-row justify="start" type="flex" >
                                <el-col :span="5">
                                    <i class="redStar">*</i>
                                    <span class="hintInfo">试卷名称</span>
                                </el-col>
                                <el-col :span="3">
                                    <el-input  type="textarea"  v-model="testInfo.name" placeholder="请输入试卷名称" style="width: 250px"></el-input>
                                </el-col>
                            </el-row>
                        </el-form-item>
                        <el-form-item >
                            <el-row justify="start" type="flex" >
                                <el-col :span="5">
                                    <span class="hintInfo">出题学校</span>
                                </el-col>
                                <el-col :span="3">
                                    <el-input  prefix-icon="el-icon-school" v-model="testInfo.school" placeholder="请输入学校名称" style="width: 250px"></el-input>
                                </el-col>
                                <el-col :span="5" :offset="5">
                                    <span class="hintInfo">出题人</span>
                                </el-col>
                                <el-col :span="3">
                                    <el-input  prefix-icon="el-icon-user"  readonly :value="testInfo.creator"></el-input>
                                </el-col>
                            </el-row>
                        </el-form-item>
                        <el-form-item prop="score">
                            <el-row justify="start" type="flex" >
                                <el-col :span="5">
                                    <span class="hintInfo">选择题分数</span>
                                </el-col>
                                <el-col :span="3">
                                    <el-input type="number" prefix-icon="el-icon-loading" v-model.number="testInfo.selectScore" placeholder="输入选择题分数" >
                                        <template slot="suffix">
                                            <p>分</p>
                                        </template>
                                    </el-input>
                                </el-col>
                                <el-col :span="5" :offset="5">
                                    <span class="hintInfo">判断题分数</span>
                                </el-col>
                                <el-col :span="3">
                                    <el-input type="number" prefix-icon="el-icon-loading" v-model.number="testInfo.judgeScore" placeholder="输入判断题分数" >
                                        <template slot="suffix">
                                            <p>分</p>
                                        </template>
                                    </el-input>
                                </el-col>
                            </el-row>
                        </el-form-item>
                        <el-form-item prop="astrict">
                            <el-row justify="start" type="flex" >
                                <el-col :span="5">
                                    <i class="redStar">*</i>
                                    <span class="hintInfo">考试时间</span>
                                </el-col>
                                <el-col :span="3">
                                    <el-input type="number" prefix-icon="el-icon-time" v-model.number="testInfo.astrict" placeholder="请输入考试时间" >
                                        <template slot="suffix">
                                            <p>分钟</p>
                                        </template>
                                    </el-input>
                                </el-col>
                            </el-row>
                        </el-form-item>
                    </el-form>
                </el-tab-pane>

                <el-tab-pane label="题目选择" clas="tabPane">
                    <el-row type="flex" justify="center" >
                        <el-alert
                                title="如果选择的题目没有显示，请返回上一步检查相关题目的分数是否设置"
                                type="warning"
                                center
                                show-icon class="topic_warning">
                        </el-alert>
                    </el-row>
                    <!--选择题-->
                    <el-row justify="first" type="flex" v-if="testInfo.select.length>0">
                        <el-col>
                            <p class="topic_title">一. 选择题(每题{{testInfo.selectScore.toFixed(1)}}分)</p>
                        </el-col>
                    </el-row>
                    <el-row justify="first" type="flex" v-if="testInfo.select.length>0" v-for="(topic,index) in select" :key="topic.id+index">
                        <el-col :offset="1">
                            <p class="hintInfo">{{index+1}}. {{topic.name}}   <a @click="removeSelect(topic)" style="cursor: pointer;margin-left: 15px"><el-tag type="danger">移除</el-tag></a></p>
                            <li :class="['select_item',{'correct_answer_select': topic.answer===(index+'')}]" v-for="(value,key,index) in topic.select" :key="key+index">{{key|filterSelect}}:  {{value}}</li>
                        </el-col>
                    </el-row>
                    <el-row justify="first" type="flex" v-if="testInfo.judge.length>0">
                        <el-col>
                            <p class="topic_title">二. 判断题(每题{{testInfo.judgeScore.toFixed(1)}}分)</p>
                        </el-col>
                    </el-row>
                    <el-row justify="first" type="flex" v-if="testInfo.judge.length>0" v-for="(topic,index) in judge" :key="topic.id+index">
                        <el-col :offset="1">
                            <p class="hintInfo">{{index+1}}. {{topic.name}}  <a @click="removeJudge(topic)" style="cursor: pointer;margin-left: 20px"><el-tag type="danger">移除</el-tag></a></p>
                            <li :class="['judge_item_1','el-icon-check',{'correct_answer_judge': topic.answer==='0'}]" ></li>
                            <li :class="['judge_item_2','el-icon-close',{'correct_answer_judge': topic.answer==='1'}]"></li>
                        </el-col>
                    </el-row>
                    <el-row justify="end" type="flex" class="select_topic">
                        <el-col  :offset="15" class="total_score" v-if="totalScore>0">
                            <el-tag type="success" class="total_score"><p>总分: {{totalScore}} 分</p></el-tag>
                        </el-col>
                        <el-col :offset="3" v-if="totalScore>0">
                            <el-button type="primary" @click="addTopic" >添加题目</el-button>
                        </el-col>
                        <el-col :offset="18" v-else>
                            <el-button type="primary" @click="addTopic" >添加题目</el-button>
                        </el-col>
                    </el-row>
                </el-tab-pane>
                <el-tab-pane label="备注填写" clas="tabPane">
                    <quill-editor v-model="testInfo.note" style="color: white">

                    </quill-editor>
                </el-tab-pane>
                <el-tab-pane label="完成" clas="complete_pane">
                    <el-row justify="start" type="flex" >
                        <el-col  :offset="4" class="complete_col">
                            <div class="complete_img">
                                <div class="complete_dialog"><p>お兄ちゃん！小埋就要这份试题，小埋这辈子就这一个请求！来生我会弥补你的！</p></div>
                            </div>
                        </el-col>
                        <el-col :span="4" >
                            <ul class="complete_bar">
                                <li @click="publishTest()">
                                    <div class="tuanzi1"><p>发布试题</p></div>
                                </li>
                                <li @click="previewTest()" >
                                    <div class="limulu" ><p>预览试卷</p></div>
                                </li>
                                <li  @click="clickToManage()">
                                    <div class="tuanzi2"><p>返回试卷列表</p></div>
                                </li>
                            </ul>
                        </el-col>
                    </el-row>
                </el-tab-pane>
            </el-tabs>
        </el-card>

        <topic-dialog :is-topic-show="showTopicDialog" @updateState="closeTopicDialog"></topic-dialog>

        <preview-test @closeTestDrawer="closeTestDrawer" :test-info="testInfo" :show-test-drawer="showTestDrawer"></preview-test>

    </div>
</template>

<script>
    import {queryAllSubjects} from "network/subjects/subjectHttp";
    import TopicDialog from "../TopicManager/TopicDialog";
    import {queryTestById,updateTest,updatePublish} from "network/test/testHttp";
    import {queryTopicsById} from "network/topic/TopicHttp";
    import PreviewTest from "./PreviewTest";

    export default {
        name: "EditTest",
        components: {TopicDialog,PreviewTest},
        data(){
            var validateAstrict = (rule, value, callback) => {
                if(value>600||value<0.5){
                    callback(new Error('试题分数请设置在0.5-100之间'));
                }else{
                    callback();
                }
            };
            return {
                testInfo: {
                    id: '',
                    subject: null,
                    school: '',
                    creator: '',
                    name: '',
                    astrict: null,
                    selectScore: null,
                    judgeScore: null,
                    select: [], //选择题
                    judge: [],   //判断题
                    note: ''
                },
                showTopicDialog: false,
                rules:{
                    subject: [
                        {required: true,message: '请选择学科类型',trigger:'blur'}
                    ],
                    astrict: [
                        {required: true,message: '请输入考试时间',trigger:'blur'},
                        {type: 'number',message: '请输入数字',trigger:'blur'},
                        {validator: validateAstrict,message: '考试时间请设置在1-600之间',trigger:'blur'},
                    ],
                    name: [
                        {required: true,message: '请输入试卷名称',trigger:'blur'},
                        {min:1,max: 100,message: '试卷名称请设置在1-100之间',trigger:'blur'}
                    ],
                    score: [
                        {min:0.5,max: 100,message: '试题分数请设置在0.5-100之间',trigger:'blur'}
                    ]
                },
                active: 1,      //步骤条
                subjects: [],    //所有的学科
                hotSujects: [],  //热门学科
                selectTopics: [], //选择的题目
                select: [],      //选择题
                judge: [],        //判断题
                showTestDrawer: false  //是否打开预览
            }
        },
        computed: {
            totalScore(){
                let selectScore=0
                let judgeScore=0
                if(this.testInfo.selectScore!=null) {
                    selectScore = this.testInfo.select.length*this.testInfo.selectScore
                }
                if(this.testInfo.judgeScore!=null) {
                    judgeScore = this.testInfo.judge.length*this.testInfo.judgeScore
                }
                return (selectScore+judgeScore).toFixed(1)
            },
            testId(){
                return this.$route.params.testId
            }
        },
        created() {
            //查询所有学科
            this.querySubjects()
            //查询该试卷的所有信息
            this.queryTest(this.testId)
            console.log("修改的试卷信息",this.testInfo)
        },
        methods: {
            //查询所有的学科信息
            querySubjects(){
                queryAllSubjects().then((res)=>{
                    if(res.result_code===200){
                        this.subjects=res.subjects
                        this.hotSujects=[this.subjects[0],this.subjects[2]]
                    }
                })
            },
            queryTest(id){
                queryTestById(id).then((res)=>{
                    if(res.result_code===251){
                        this.testInfo=res.test
                        //查询选择题
                        this.querySelect()
                        //查询判断题
                        this.queryJudge()
                    }else{
                        this.$notify({
                            title: '失败',
                            message: '试卷信息获取失败',
                            type: 'error',
                            offset: 100
                        });
                    }
                })
            },
            //查询选择题
            querySelect(){
                queryTopicsById(this.testInfo.select).then((res)=>{
                    if(res.result_code===250){
                        this.select=res.topics
                        this.selectTopics.push(...this.select)
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
                        this.selectTopics.push(...this.judge)
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
            //检验信息
            confirmInfo(activeName, oldActiveName){
                let flag=true;

                if(oldActiveName==='3'){
                    return false
                }

                if(oldActiveName==='0') {
                    this.$refs.baseInfoRef.validate(valid => {
                        if (!valid) {
                            flag=false
                        }
                    })
                }else if(oldActiveName==='1'){
                    if(this.selectTopics.length===0) {
                        this.$notify({
                            title: '警告',
                            message: '您没有选择任何题目',
                            type: 'warning',
                            offset: 100
                        });
                    }else {
                        this.$notify({
                            title: '提示',
                            message: '题目选择成功',
                            type: 'info',
                            offset: 100
                        });
                    }

                }else if(activeName==='3'){
                    updateTest(this.testInfo).then((res)=>{
                        if(res.result_code===251){
                            this.$notify({
                                title: '成功',
                                message: '试卷修改成功',
                                type: 'success',
                                offset: 100
                            });
                        }else{
                            this.$notify({title: '错误',message: '试卷修改失败',type: 'error',offset: 100})
                            flag=false
                        }
                    })
                }
                if(flag){
                    this.active=parseInt(activeName)+1
                }
                return flag


            },
            //打开选题对话框
            addTopic(){
                this.showTopicDialog=true
            },
            //关闭选题对话框
            closeTopicDialog(selectTopic){
                //确认的关闭
                if(selectTopic!=='0') {
                    this.showTopicDialog = false
                    if(this.testInfo.judgeScore==null&&this.testInfo.selectScore==null){
                        this.$message.warning("请先设置题目分数再进行选题! ! !")
                    }
                    this.selectTopics.push(...selectTopic)
                    for (let i=0; i < selectTopic.length; i++) {
                        if (selectTopic[i].typeNum === 0&&this.testInfo.selectScore!==null) {
                            this.$set(this.select,this.select.length,selectTopic[i])
                            this.$set(this.testInfo.select,this.testInfo.select.length,selectTopic[i].id)
                        } else if(selectTopic[i].typeNum === 1&&this.testInfo.judgeScore!==null){
                            this.$set(this.judge,this.judge.length,selectTopic[i])
                            this.$set(this.testInfo.judge,this.testInfo.judge.length,selectTopic[i].id)
                        }
                    }
                    console.log("全部题目:", this.selectTopics)
                    console.log("选择题:", this.testInfo.select)
                    console.log("判断题:", this.testInfo.judge)
                }else{
                    this.showTopicDialog = false
                }
            },
            clickToManage(){
                this.$router.push('/home/testManage')
            },
            removeSelect(topic){
                this.selectTopics.splice(this.selectTopics.indexOf(topic),1);
                this.select.splice(this.select.indexOf(topic),1)
                this.testInfo.select.splice(this.testInfo.select.indexOf(topic.id),1)
                console.log("1",this.selectTopics,this.select,this.testInfo.select)
            },
            removeJudge(topic){
                this.selectTopics.splice(this.selectTopics.indexOf(topic),1);
                this.judge.splice(this.judge.indexOf(topic),1)
                this.testInfo.judge.splice(this.testInfo.judge.indexOf(topic.id),1)
                console.log("2",this.selectTopics,this.judge,this.testInfo.judge)
            },
            //发布试卷
            publishTest(){
                updatePublish(this.testInfo.id).then((res)=>{
                    if(res.result_code===251){
                        this.$notify({
                            title: '成功',
                            message: '试卷发布成功',
                            type: 'success',
                            offset: 100
                        });
                    }else{
                        this.$notify({
                            title: '失败',
                            message: '试卷发布失败',
                            type: 'error',
                            offset: 100
                        });
                    }
                })
            },
            previewTest(){
                this.showTestDrawer=true
            },
            closeTestDrawer(){
                this.showTestDrawer=false
            }
        },
        filters: {
            filterSelect(value){
                return String.fromCharCode(parseInt(value)+65)
            },
        }

    }
</script>

<style lang="less">
    .el-input__inner{

    }

    .createTest .el-input__inner{
        border-radius: 10px !important;
    }

    .input-with-select{
        height: 50px;
    }

    .el-table,.el-table-column{
        background-color: rgba(0,0,0,0.5) !important;
        margin-top: 20px;
    }

    .el-table,
    .el-table__expanded-cell {
        background-color: transparent !important;
        font-weight: bolder;
    }
    /*透明化行、单元格*/
    .el-table th,
    .el-table tr,
    .el-table td {
        background-color: rgba(0,0,0,0.3) !important;
        text-align: center!important;
        color: white !important;
        font-size: 16px !important;
    }

    .el-tabs__active-bar{
        line-height: 700px;
    }

    .el-tabs{
        margin-top: 50px;

    }

    .el-step__description,.el-step__title{
        color: white !important;
    }




    .el-tabs__item{
        height: 40px !important;
        font-size: 18px !important;
        margin-bottom: 20px;
        color: white;
    }

    /*.el-tab-pane{*/
    /*    overflow-y: auto !important;*/
    /*}*/


    .editTest{
        .el-row{
            margin-bottom: 30px;
        }
        .el-alert{
            margin-bottom: 3px !important;
        }
        .ql-editor{
            min-height: 300px;
            color: white;
            font-size: 20px;
            max-height: 600px;
        }
        .ql-toolbar,.ql-snow{
            color: white;
        }

    }


</style>

<style scoped lang="less">
    .editTest{
        position: relative;
        z-index: 1;
        margin-top: 30px;
    }

    .el-card{
        border-radius: 20px;
        background-color: transparent;
        height: 800px !important;
        overflow-y: auto !important;
    }



    .el-row{
        transform: translateY(10px);
    }

    .hintInfo{
        font-size: 18px;
        color: white;
    }

    .redStar{
        position: absolute;
        font-size: 30px;
        color: red;
        left: -15px;
        top: 7px;
    }

    .topic_title{
        font-size: 20px;
        color: white;
        margin-left: 15px;
    }

    .select_item{
        margin-left: 40px;
        font-size: 17px;
        color: white;
        margin-top: 10px;
    }


    .judge_item_1{
        display: inline-block;
        margin-left: 70px;
        font-size: 23px;
        color: white;
        margin-top: 20px;
    }

    .judge_item_2{
        display: inline-block;
        margin-left: 100px;
        font-size: 23px;
        color: white;
        margin-top: 20px;
    }

    .correct_answer_select{
        color: red;
        font-size: 18px;
    }

    .correct_answer_judge{
        color: red;
        font-size: 25px;
    }

    .total_score{
        font-size: 25px;
    }

    .topic_warning{
        width: 40%;
    }

    .complete_col{
        div{
            display: inline-block;
        }
    }



    .complete_img{
        display: inline-block;
        background-image: url("~assets/img/xiaomai.png");
        background-repeat: no-repeat;
        background-size: 100% 100%;
        height: 400px;
        width: 450px;
        perspective: 1000px !important;
        transform: translateY(11px);
    }

    .complete_dialog{
        position: relative;
        width: 200px;
        height: 100px;
        border: 1px solid #f9ca24;
        margin-right: 10px;
        margin-top: -20px;
        right: -80%;
        background-color: #f9ca24;
        border-radius: 20px;
        font-size: 20px;
        font-family: "Luckiest Guy", cursive;
        text-align: center;
        text-shadow: 10px 10px 25px;
    }

    .complete_dialog::before{
        content: '';
        width: 0;
        height: 0;
        position: absolute;
        bottom: -2px;
        left: -50px;
        border-right: 60px solid #f9ca24;
        border-top: 20px solid transparent;
        transform: rotate(-25deg);
    }

    .complete_bar li{
        position: relative;
        display: inline-block;
        transform: translateX(-50px);
        cursor: pointer;
    }

    .complete_bar li:first-of-type{
        height: 200px;
        width: 200px;
        background-image: url("~assets/img/tuanzi1.png");
        background-size: 100% 100%;
        position: absolute;
        bottom: -10px;
    }

    .tuanzi2{
        left: 50px;
        top: -20px;
        width: 150px;
        position: relative;
        height: 80px;
        border: 1px solid #b3d4fc;
        margin-right: 10px;
        margin-top: -20px;
        right: -80%;
        background-color: #b3d4fc;
        border-radius: 20px;
        font-size: 20px;
        font-family: "Luckiest Guy", cursive;
        text-align: center;
        text-shadow: 10px 10px 25px;
        p{
            margin-top: 30px;
        }
    }

    .tuanzi2::before{
        content: '';
        width: 0;
        height: 0;
        position: absolute;
        bottom: -10px;
        left: 50px;
        border-right: 50px solid #b3d4fc;
        border-top: 20px solid transparent;
        transform: rotate(-25deg);
    }

    .complete_bar li:nth-of-type(2){
        height: 200px;
        width: 250px;
        background-image: url("~assets/img/limulu.png");
        background-size: 100% 100%;
        position: absolute;
        bottom: -10px;
        right: 210px;
    }

    .complete_bar li:last-of-type{
        height: 200px;
        width: 200px;
        background-image: url("~assets/img/tuanzi2.png");
        background-size: 100% 100%;
        position: absolute;
        bottom: 0;
        right: 500px;
    }

    .limulu{
        left: 50px;
        top: -50px;
        width: 150px;
        position: relative;
        height: 80px;
        border: 1px solid rgba(117, 178, 241);
        margin-right: 10px;
        margin-top: -20px;
        right: -80%;
        background-color: rgba(117, 178, 241);
        border-radius: 20px;
        font-size: 20px;
        font-family: "Luckiest Guy", cursive;
        text-align: center;
        text-shadow: 10px 10px 25px;
        p{
            margin-top: 30px;
        }
    }

    .limulu::before{
        content: '';
        width: 0;
        height: 0;
        position: absolute;
        bottom: -10px;
        left: 50px;
        border-right: 60px solid rgba(117, 178, 241);
        border-top: 20px solid transparent;
        transform: rotate(-25deg);
    }

    .tuanzi1{
        left: -20px;
        top: -30px;
        width: 150px;
        position: relative;
        height: 80px;
        border: 1px solid rgba(252, 166, 175);
        margin-right: 10px;
        margin-top: -20px;
        right: -80%;
        background-color: rgba(252, 166, 175);
        border-radius: 20px;
        font-size: 20px;
        font-family: "Luckiest Guy", cursive;
        text-align: center;
        text-shadow: 10px 10px 25px;
        p{
            margin-top: 30px;
        }
    }

    .tuanzi1::before{
        content: '';
        width: 0;
        height: 0;
        position: absolute;
        bottom: -10px;
        left: 50px;
        border-left: 60px solid rgba(252, 166, 175);
        border-top: 20px solid transparent;
        transform: rotate(25deg);
    }

    /*.select_topic{*/
    /*    margin-bottom: 100px;*/
    /*}*/



</style>