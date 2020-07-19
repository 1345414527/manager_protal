<template>
    <div class="exam-subscribe">

    <<el-card class="box-card">
        <!--面包屑导航区-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item><a >试卷选择</a></el-breadcrumb-item>
            <el-breadcrumb-item>试卷中心</el-breadcrumb-item>
        </el-breadcrumb>
        <!--添加和检索行-->
        <el-row justify="space-around" type="flex" >
            <el-col :span="5">
                <el-tooltip class="item" effect="dark" :enterable="false" content="根据状态进行筛选试题" placement="top-start">
                    <el-dropdown @command="handlePublishCommand">
                        <el-button type="primary">
                            {{search.status==null?"全部":examStatus(search.status)}}<i class="el-icon-arrow-down el-icon--right"></i>
                        </el-button>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="-1" icon="el-icon-orange">全部</el-dropdown-item>
                            <el-dropdown-item command="0" icon="el-icon-watermelon">未答题</el-dropdown-item>
                            <el-dropdown-item command="1" icon="el-icon-grape">答题中</el-dropdown-item>
                            <el-dropdown-item command="2" icon="el-icon-apple">已答题</el-dropdown-item>
                            <el-dropdown-item command="3" icon="el-icon-pear">再次答题</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </el-tooltip>
            </el-col>
            <el-col>
                <el-tooltip class="item" effect="dark" :enterable="false" content="根据学科进行筛选试题" placement="top-start">
                    <el-select v-model="search.subject"  filterable placeholder="请选择学科类型" clearable>
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
        <el-table :data="publicTests" :stripe="true"  border max-height="550"   style="width: 100%" @sort-change="sortChange" :sort-orders="['ascending', 'descending']"
                  cell-class-name="testCell"  header-cell-class-name="test-header"       @cell-dblclick="celldblclick">
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="id" label="id" width="230" sortable="custom"></el-table-column>
            <el-table-column prop="subject" label="学科" :width="150" :formatter="subjectMapping"></el-table-column>
            <el-table-column  prop="name" label="标题" width="250" resizable></el-table-column>
            <el-table-column  label="出题学校" prop="school" width="230" show-overflow-tooltip></el-table-column>
            <el-table-column  label="出题人" prop="creator" width="200" ></el-table-column>
            <el-table-column prop="startTime" label="开始时间" :width="200" sortable="custom"></el-table-column>
            <el-table-column prop="endTime" label="结束时间" :width="200" sortable="custom"></el-table-column>
            <el-table-column  label="限时" prop="astrict" width="100" :formatter="timeFormat" ></el-table-column>
            <el-table-column label="选择题(每题分数)" width="200" >
                <template slot-scope="scope">
                    <p>{{totalNum(scope.row.select)}}道 ({{scope.row.selectScore.toFixed(1)}}分)</p>
                </template>
            </el-table-column>
            <el-table-column label="判断题(每题分数)" width="200" >
                <template slot-scope="scope">
                    <p>{{totalNum(scope.row.judge)}}道 ({{scope.row.judgeScore.toFixed(1)}}分)</p>
                </template>
            </el-table-column>
            <el-table-column label="总分" width="100" >
                <template slot-scope="scope">
                    <p>{{totalPoint(scope.row)}}分</p>
                </template>
            </el-table-column>
            <el-table-column prop="beginWorkTime" label="开始答题时间" :width="200" sortable="custom"></el-table-column>
            <el-table-column prop="finishWorkTime" label="结束答题时间" :width="200" sortable="custom"></el-table-column>
            <el-table-column prop="publicTestCreated"  label="创建时间" width="200" sortable="custom"></el-table-column>



            <el-table-column  label="状态" :width="120"  fixed="right">
                <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" :enterable="false" content="考试的状态" placement="top-start">
                        <el-tag type="danger" v-if="scope.row.publicTestStatus===-1" v-text="testStatus(scope.row.publicTestStatus)" ></el-tag>
                        <el-tag type="success" v-else-if="scope.row.publicTestStatus===0" v-text="testStatus(scope.row.publicTestStatus)" ></el-tag>
                        <el-tag v-else-if="scope.row.publicTestStatus===1" v-text="testStatus(scope.row.publicTestStatus)" ></el-tag>
                        <el-tag type="warning" v-else v-text="testStatus(scope.row.publicTestStatus)" ></el-tag>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" :enterable="false" content="学生的答题情况" placement="top-start">
                        <el-tag type="danger" class="exam-status" v-if="scope.row.status===0"  >未答题</el-tag>
                        <el-tag type="warning" class="exam-status" v-else-if="scope.row.status===1"  >答题中</el-tag>
                        <el-tag type="success" class="exam-status" v-else-if="scope.row.status===2"  >已答题</el-tag>
                        <el-tag type="primary" class="exam-status" v-else>再答题</el-tag>
                    </el-tooltip>
                </template>
            </el-table-column>


            <el-table-column prop="frequency"  label="答题次数" width="120" sortable="custom" fixed="right" >
                <template slot-scope="scope">
                    <el-tag  type="info">{{scope.row.frequency}} 次</el-tag>
                </template>
            </el-table-column>

            <el-table-column label="操作" min-width="170"  fixed="right" class-name="operateButton" key="operate">
                <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" :enterable="false" content="开始答题" placement="top-start">
                        <el-button  @click="startExam(scope.row)" type="success" icon="el-icon-edit" circle class="edit"></el-button>
                    </el-tooltip>
                    <el-tooltip class="item2" effect="dark" :enterable="false" content="查看试卷" placement="top-start">
                        <el-button @click="previewTest(scope.row)" type="primary" icon="el-icon-check" circle></el-button>
                    </el-tooltip>
                    <el-tooltip class="item2" effect="dark" :enterable="false" content="取消订阅" placement="top-start">
                        <el-button @click="deleteSubscribeInfo(scope.row.publicTestId)" type="danger" icon="el-icon-delete" circle></el-button>
                    </el-tooltip>
                </template>
            </el-table-column>


        </el-table>
        <!--分页行-->
        <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="search.page"
                :page-sizes="[5,10,15,20]"
                :page-size="totalPage"
                layout="total,sizes, prev, pager, next, jumper"
                :total="total">
        </el-pagination>
    </el-card>

        <exam-page @closeTestDrawer="closeTestDrawer" :finish-time="finishWorkTime" :test-info="examPageInfo" :show-test-drawer="showExamPage"></exam-page>
        <exam-preview @closeTestDrawer="closePreviewDrawer" :test-info="examPreviewPageInfo" :show-test-drawer="showPreviewPage"></exam-preview>
    </div>
</template>

<script>
    import {deleteSubscribe,queryAllSubscribeExamInfo} from "network/exam/subscribeExamHttp";
    import {queryAllSubjects} from "network/subjects/subjectHttp";
    import utils from "utils/utils";
    import ExamPage from "./ExamPage";
    import {updateBeginWorkTimeById} from "network/exam/ExamAnswerHttp";
    import ExamPreview from "./ExamPreview";

    export default {
        name: "ExamSubscribe",
        data(){
            return {
                search: {
                    key: '',    //关键字
                    page: 1,    //页数
                    row: 5,      //数据行数
                    status: null,       //考试的状态 0:未考试,1:正在考试,2:已考试
                    subject: null,    //试题的学科类型
                    orderField: '',   //排序的字段
                    order: 0,          //排序0:升序，1：降序
                    userId: this.$store.state.user.id    //用户的id
                },
                subscribeInfo: [],
                total: 0,
                totalPage: 0,
                subjects: [],           //学科信息
                hotSujects: [],   //热门学科
                testInfo: {},
                publicTests: [],    //需要展示信息
                showExamPage: false,
                examPageInfo: null,  //考试的信息
                finishWorkTime: null,  //考试结束时间
                showPreviewPage: false,
                examPreviewPageInfo: null
            }
        },
        methods: {
            //分页的页面行数大小改变
            handleSizeChange(newSize){
                this.search.row=newSize
            },
            //分页的页面位置改变
            handleCurrentChange(newPage){
                this.search.page=newPage
            },
            //查询已发布试卷
            queryPublicTests(){
                queryAllSubscribeExamInfo(this.search).then((res)=>{
                    if(res.result_code===251){
                        this.publicTests=res.exams.items
                        this.totalPage = res.exams.totalPage
                        this.total = res.exams.total
                        this.$message.success("信息查询成功");
                    }else{
                        this.$message.warning("你还不是管理员，查询失败");
                    }
                })
            },
            //日期的转换
            dateFormat(row, column, cellValue, index){
                return utils.formatDate(row.created)
            },
            //日期的转换
            timeFormat(row,column,cellValue,index){
                return row.astrict+"分钟"
            },
            //次数的转化
            frequenceFormat(row,column,cellValue,index){
                return row.frequency+"次"
            },
            //根据学科id映射成名称
            subjectMapping(row,column,cellValue,index){
                return  this.subjects.find((subject)=>subject.id===row.subject)?.name
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
            handlePublishCommand(command){
                switch (command) {
                    case '-1': this.search.status=null;break;
                    case  '0': this.search.status=0;break;
                    case  '1': this.search.status=1;break;
                    case  '2': this.search.status=2;break;
                    case  '3': this.search.status=3;break;
                    default: break;
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
            //删除订阅信息
            deleteSubscribeInfo(publicTestId){
                deleteSubscribe(this.$store.state.user.id,publicTestId).then(res=>{
                    if(res.result_code===251){
                        this.$notify({title: '成功', message: '考试订阅取消成功！', type: 'success', offset: 100, duration: 2000})
                        //删除信息
                        this.publicTests.splice(this.publicTests.findIndex(tests=>tests.publicTestId===publicTestId),1)
                    }else{
                        this.$notify({title: '失败', message: '考试订阅取消失败！请仔细检查考试是否已经开始或者结束！', type: 'error', offset: 100, duration: 2000})
                    }
                })
            },
            //关闭预览
            closeTestDrawer(){
                this.showExamPage=false
                this.examPreviewPageInfo=null
            },
            //开始考试
            startExam(row){

                if(row.status===1){
                    this.$notify({title: '提示', message: '请您继续答题！', type: 'warning', offset: 100, duration: 2000})
                    this.finishWorkTime=new Date(row.finishWorkTime).getTime()
                    this.examPageInfo=row
                    this.showExamPage=true
                    return
                }

                //判断有没有答过题
                if(row.status===2){
                    this.$notify({title: '提示', message: '您已经答过题了！不可重复答题', type: 'warning', offset: 100, duration: 2000})
                    return
                }


                //开始时间
                let startDate=new Date(row.startTime)
                //当前时间
                let now=new Date()
                console.log("开始时间"+startDate.getTime());
                console.log("当前时间"+now.getTime());

                //判断是否能够开始考试
                if(now.getTime()<startDate.getTime()){
                    this.$notify({title: '提示', message: '考试尚未考试！请继续等待！', type: 'warning', offset: 100, duration: 2000})
                    return
                }

                //结束时间
                let endDate=new Date(row.endTime)
                let initDate=new Date("2020-01-01T00:00:00")
                let finishWorkTime=new Date(row.finishWorkTime)

                console.log("情况"+finishWorkTime+"  "+initDate+"  "+(finishWorkTime !== initDate))

                //判断是否能够开始考试
                if(now.getTime()>=endDate.getTime()||(finishWorkTime.getTime()!==initDate.getTime()&&now.getTime()>=finishWorkTime&&row.status!==3)){
                    this.$notify({title: '提示', message: '考试已经结束！', type: 'warning', offset: 100, duration: 2000})
                    return
                }
                this.startExamAnswer(row)
            },
            //开始答题
            startExamAnswer(row){
                this.$confirm('&emsp;&emsp;<span style="color: red">您确定开始考试了吗？考试过程中不能停止！</span>', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    dangerouslyUseHTMLString: true,

                }).then(() => {
                    updateBeginWorkTimeById(row.id).then(res=>{
                        if(res.result_code===252){
                            row.beginWorkTime=res.beginWorkTime
                            row.finishWorkTime=res.finishWorkTime
                            row.status=1

                            this.examPageInfo=row
                            this.showExamPage=true
                            this.finishWorkTime=new Date(row.finishWorkTime).getTime()
                            this.$notify({title: '开始答题', message: '考试已开始，请您尽快答题！', type: 'success', offset: 100, duration: 2000})
                        }else{
                            this.$notify({title: '提示', message: '请稍后再试', type: 'warning', offset: 100, duration: 2000})
                        }
                    })
                }).catch(()=>{

                })
            },
            //预览试卷
            previewTest(row){
                if(row.status!==2){
                    this.$notify({title: '提示', message: '请答题后再预览 ！', type: 'warning', offset: 100, duration: 2000})
                    return
                }
                this.showPreviewPage=true
                this.examPreviewPageInfo=row
            },
            closePreviewDrawer(){
                this.showPreviewPage=false
            },
            //双击复制
            celldblclick (row, column, cell, event) {
                let _this = this
                this.$copyText(row[column.property]).then(e=> {
                    _this.onCopy()
                }, function (e) {
                    _this.onError()
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
            //计算题目数量
            totalNum() {
                return function(topic){
                    return topic.length
                }
            },
            //计算试卷总分
            totalPoint(){
                return function(row){
                    let selectScore=this.totalNum(row.select)*row.selectScore
                    let judgeScore=this.totalNum(row.judge)*row.judgeScore
                    return (selectScore+judgeScore).toFixed(1)
                }
            },
            testStatus(){
                return function (status) {
                    if(status!==undefined){
                        switch (status) {
                            case -1: return '初始化';
                            case 0: return '未开始';
                            case 1: return '进行中';
                            case 2: return '已结束';
                            default: return '未知';
                        }
                    }else {
                        return '未知';
                    }
                }
            },
            examStatus(){
                return function(status){
                    if(status!=undefined){
                        switch (status) {
                            case -1: return '全部';
                            case 0: return '未答题';
                            case 1: return '答题中';
                            case 2: return '已答题'
                        }
                    }
                }
            },

        },
        watch: {
            'search': {
                deep: true,
                immediate: true,
                handler(val,val2){
                    this.queryPublicTests()
                }
            }
        },
        filters: {
            filterSelect(value){
                return String.fromCharCode(parseInt(value)+65)
            },
            filterJudge(value){
                return value==='0'?"对":"错"
            }
        },
        created() {
            this.querySubjects()
        },
        components: {
            ExamPage,
            ExamPreview
        }
    }
</script>

<style lang="less">
    .exam-subscribe {
        position: relative;
        z-index: 1;
        margin-top: 50px;
        .el-card {
            border-radius: 20px;
            background-color: transparent;
        }
        .operateButton{
            display: flex !important;
            line-height: 90px !important;
            .item{
                margin-left: 5px !important;
                margin-top: 10px !important;
            }
        }
        .testCell{
            height: 106px !important;
        }

        .test-header{
            height: 60px;
        }
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

        .el-table__fixed {
            height: 100% !important; //设置高优先，以覆盖内联样式
        }
        .el-table__fixed-right{
            height: 100% !important;
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
            margin-top: 20px;
        }
        .el-tag{
            font-size: 17px !important;
            width: 90px !important;
            height: 35px !important;
            line-height: 40px;
            margin-top: 6px;
        }
    }



</style>

<style scoped>



    .el-row{
        transform: translateY(10px);
    }




    /*li{*/
    /*    display: inline-block;*/
    /*}*/

</style>