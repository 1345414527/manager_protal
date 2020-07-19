<template>
    <div class="topic-answer-manage">
        <el-card class="box-card">
            <!--面包屑导航区-->
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item><a >试卷管理</a></el-breadcrumb-item>
                <el-breadcrumb-item>试题管理</el-breadcrumb-item>
            </el-breadcrumb>
            <!--提示-->
            <el-alert
                    title="试题错误率有五个评定标准(0~10%,10%~30%,30%~50%,50%~70%,70%~100%)"
                    type="info"
                    close-text="知道了"
                    center
                    show-icon
                    >
            </el-alert>
            <!--添加和检索行-->
            <el-row justify="space-between" type="flex" >
                <el-col :span="5">
                    <el-tooltip class="item" effect="dark" :enterable="false" content="根据类型进行筛选试题" placement="top-start">
                        <el-dropdown @command="handleTypeCommand">
                            <el-button type="primary">
                                {{search.type==null?"类型":(search.type==='0'?"选择题":"判断题")}}<i class="el-icon-arrow-down el-icon--right"></i>
                            </el-button>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item command="-1" icon="el-icon-orange">全部</el-dropdown-item>
                                <el-dropdown-item command="0" icon="el-icon-watermelon">选择题</el-dropdown-item>
                                <el-dropdown-item command="1" icon="el-icon-apple">判断题</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </el-tooltip>
                </el-col>
                <el-col>
                    <el-tooltip class="item" effect="dark" :enterable="false" content="根据学科进行筛选试题" placement="top-start">
                        <el-select v-model="search.subject" @change="" filterable placeholder="请选择学科类型" clearable>
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
                <el-col :span="8" >
                    <el-input  placeholder="请输入检索内容" v-model="search.key" class="input-with-select" clearable prefix-icon="iconfont icon-sousuo1">
                    </el-input>
                </el-col>
            </el-row>

            <!--表格-->
            <el-table :data="topics" :stripe="true"  border max-height="550"   style="width: 100%" @sort-change="sortChange" :sort-orders="['ascending', 'descending']"
                      cell-class-name="cell"       @cell-dblclick="celldblclick" >
                <el-table-column width="100" type="index"></el-table-column>
                <el-table-column prop="id" label="id" width="280" sortable="custom"></el-table-column>

                <el-table-column prop="type" label="类型" width="100"></el-table-column>
                <el-table-column prop="subject" label="学科" :width="150"></el-table-column>
                <el-table-column  prop="name" label="题目" width="400" show-overflow-tooltip></el-table-column>
                <el-table-column  label="选项" width="250" class="selectForm" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <li v-if="scope.row.typeNum===0" v-for="(value,key,index) in scope.row.select" :key="key">{{key|filterSelect}}:  {{value}}</li>
                    </template>
                </el-table-column>
                <el-table-column  label="答案" width="100" fixed="right">
                    <template slot-scope="scope">
                        <span v-if="scope.row.type==='选择题'">{{scope.row.answer|filterSelect}}</span>
                        <span v-if="scope.row.type==='判断题'">{{scope.row.answer|filterJudge}}</span>
                    </template>
                </el-table-column>

                <el-table-column  label="最多答案(人数)" width="130" fixed="right">
                    <template slot-scope="scope">
                        <span v-if="scope.row.type==='选择题'">{{scope.row.topicAnswerSituation.answer|filterSelect}}({{scope.row.topicAnswerSituation.count}}人)</span>
                        <span v-if="scope.row.type==='判断题'">{{scope.row.topicAnswerSituation.answer|filterJudge}}({{scope.row.topicAnswerSituation.count}}人)</span>
                    </template>
                </el-table-column>

                <el-table-column  prop="answerNum" label="答题总数" width="90"  fixed="right"></el-table-column>
                <el-table-column label="错误率" width="120"  fixed="right">
                    <template slot-scope="scope">
                            <el-tag type="success" class="exam-status" v-if="scope.row.errorRate<0.1"  >{{scope.row.errorRate|numFilter}}%</el-tag>
                            <el-tag type="primary" class="exam-status" v-else-if="scope.row.errorRate<0.3"  >{{scope.row.errorRate|numFilter}}%</el-tag>
                            <el-tag type="info" class="exam-status" v-else-if="scope.row.errorRate<0.5"  >{{scope.row.errorRate|numFilter}}%</el-tag>
                           <el-tag type="warning" class="exam-status" v-else-if="scope.row.errorRate<0.7"  >{{scope.row.errorRate|numFilter}}%</el-tag>
                           <el-tag type="danger" class="exam-status" v-else >{{scope.row.errorRate|numFilter}}%</el-tag>
                    </template>
                </el-table-column>

                <el-table-column prop="note" label="备注" width="250" show-overflow-tooltip></el-table-column>
                <el-table-column prop="created" :formatter="dateFormat" label="创建时间" width="250" sortable="custom"></el-table-column>
            </el-table>

            <!--分页行-->
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="search.page"
                    :page-sizes="[10,15,20,30]"
                    :page-size="totalPage"
                    layout="total,sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
        </el-card>

    </div>
</template>

<script>
    import utils from "utils/utils";
    import {queryAllSubjects} from "network/subjects/subjectHttp";
    import {calculateTopicAnswerResult} from "network/topic/topicAnswerSituationHttp";

    export default {
        name: "TopicAnswerManage",
        data(){
            return {
                search: {
                    key: '',    //关键字
                    page: 1,    //页数
                    row: 10,      //数据行数
                    type: null,       //试题类型
                    subject: null,    //试题的学科类型
                    orderField: '',   //排序的字段
                    order: 0          //排序0:升序，1：降序
                },
                topics: [
                    {
                        id: '',     //id
                        typeNum: null, //试题类型标识0:选择题，1：判断题
                        type: '',   //试题类型
                        subjectNum: null, //学科类型id
                        subject: '', //学科类型
                        name: '',   //名称
                        select: {}, //选择题的选项
                        answer: '', //答案
                        answerNum: '', //回答的数量
                        errorRate: '', //回答的错误比率
                        topicAnswerSituation: {  //最多的回答
                            answer: '',  //回答情况
                            count: null //回答的数量
                        },
                        note: '',   //备注信息
                        created: '',//创建时间
                    }
                ],
                total: 0,
                totalPage: 0,
                subjects: [],
                hotSujects: []   //热门学科
            }
        },
        methods: {
            //查询试题信息
            queryTopicAnswer(){
                calculateTopicAnswerResult(this.search).then((res)=>{
                    if(res.result_code===250) {
                        this.topics = res.topics.items
                        this.totalPage = res.topics.totalPage
                        this.total = res.topics.total
                        for(let i=0;i<this.topics.length;i++) {
                            this.topics[i].deleted=!this.topics[i].deleted
                        }
                        console.log(res);
                    }else{
                        this.$message.warning("您不是管理员")
                    }
                })
            },
            //分页的页面行数大小改变
            handleSizeChange(newSize){
                this.search.row=newSize
                this.queryTopicAnswer()
            },
            //分页的页面位置改变
            handleCurrentChange(newPage){
                this.search.page=newPage
                this.queryTopicAnswer()
            },
            //日期的转换
            dateFormat(row, column, cellValue, index){
                return utils.formatDate(row.created)
            },
            //排序发生改变
            sortChange( column, prop, order){
                this.$set(this.search,"orderField",column.prop)
                if(column.order==='ascending'){
                    this.search.order=0
                }else if(column.order==='descending'){
                    this.search.order=1
                }
                console.log("排序:"+column + '-' + column.prop + '-' + column.order+'-'+prop+'-'+order)
            },
            //按类型查询
            handleTypeCommand(command){
                if(command==='-1'){
                    this.search.type=null
                }else {
                    this.search.type = command
                }
            },
            //查询所有的学科信息
            querySubjects(){
                queryAllSubjects().then((res)=>{
                    if(res.result_code===200){
                        this.subjects=res.subjects
                        this.hotSujects=[this.subjects[0],this.subjects[2]]
                    }
                })
            },
            //按学科查询
            handleSubjectCommand(command){
                if(command==='-1'){
                    this.search.subject=null
                }else {
                    this.search.subject = command
                }
            },
            //双击复制
            celldblclick (row, column, cell, event) {
                this.$copyText(row[column.property]).then(e=> {
                    this.onCopy()
                }, function (e) {
                    this.onError()
                })
            },
            onCopy() {
                this.$notify({title: '成功', message: '复制成功！', type: 'success', offset: 50, duration: 2000})
            },
            onError() {
                this.$notify({title: '失败', message: '复制失败！', type: 'error', offset: 50, duration: 2000})
            }
        },
        computed: {

        },
        watch: {
            'search': {
                deep: true,
                immediate: true,
                handler(val,val2){
                    this.queryTopicAnswer()
                }
            }
        },
        filters: {
            filterSelect(value){
                if(value==='-1'){
                    return '未答题'
                }else if(value==='-2'){
                    return '空'
                }

                return String.fromCharCode(parseInt(value)+65)
            },
            filterJudge(value){
                return value==='0'?"对":"错"
            },
            numFilter(value){
                return (value*100).toFixed(2)
            }
        },
        created() {
            this.querySubjects()
        }
    }
</script>
<style lang="less">
   .topic-answer-manage{
       .el-input__inner{
           border-radius: 100px !important;
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

       .el-pagination{
           position: relative;
           text-align: center;
           margin-top: 10px;
       }

       .cell{
           max-height: 100px;
           li{
               display: inline-block;
           }
       }

       .el-dropdown{
           .el-dropdown-menu{
               height: 50px !important;
               overflow: hidden !important;
           }
       }
       .el-tag{
           font-size: 17px !important;
           width: 90px !important;
           height: 35px !important;
           line-height: 40px;
           margin-top: 6px;
       }

       .el-alert__closebtn{
           color: red!important;
       }


   }



</style>

<style scoped lang="less">

    .topic-answer-manage{
        position: relative;
        z-index: 1;
        margin-top: 50px;
    }

    .el-card{
        border-radius: 20px;
        background-color: transparent;
    }



    .el-row{
        transform: translateY(10px);
    }

    .topicImage{
        width: 100px !important;
        height: 100px !important;
        background-repeat: no-repeat;
        background-size: 100% 100%;
    }




</style>