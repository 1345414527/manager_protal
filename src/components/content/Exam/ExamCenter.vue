<template>
    <div class="examCenter">
        <el-card class="box-card">
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
                                {{search.subscribe==null?"预约":(search.subscribe?"已预约":"未预约")}}<i class="el-icon-arrow-down el-icon--right"></i>
                            </el-button>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item command="-1" icon="el-icon-orange">全部</el-dropdown-item>
                                <el-dropdown-item command="0" icon="el-icon-watermelon">已预约</el-dropdown-item>
                                <el-dropdown-item command="1" icon="el-icon-apple">未预约</el-dropdown-item>
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
            <el-table :data="publicTestsAndSubscribe" :stripe="true"  border max-height="550"   style="width: 100%" @sort-change="sortChange" :sort-orders="['ascending', 'descending']"
                      cell-class-name="testCell"       @cell-dblclick="celldblclick">
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
                <el-table-column prop="status" label="状态" :width="150"  fixed="right">
                    <template slot-scope="scope">
                        <el-tag type="danger" v-if="scope.row.status===-1" v-text="testStatus(scope.row.status)" ></el-tag>
                        <el-tag type="success" v-else-if="scope.row.status===0" v-text="testStatus(scope.row.status)" ></el-tag>
                        <el-tag v-else-if="scope.row.status===1" v-text="testStatus(scope.row.status)" ></el-tag>
                        <el-tag type="warning" v-else v-text="testStatus(scope.row.status)" ></el-tag>
                    </template>
                </el-table-column>

                <el-table-column prop="created" :formatter="dateFormat" label="创建时间" width="250" sortable="custom"></el-table-column>


                <el-table-column label="预约"  fixed="right" min-width="110">
                    <template slot-scope="scope">
                        <el-tooltip class="item" effect="dark" :enterable="false" :content="!scope.row.subscribe?'点击预约':'取消预约'" placement="top-start">
                            <el-switch v-model="scope.row.subscribe"  @change="examSubscribeChanged(scope.row)" :width="60" > </el-switch>
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
    </div>
</template>

<script>
    import {insertSubscribeExamInfo,querySubscribeUserIdAndDeleted,deleteSubscribe} from "network/exam/subscribeExamHttp";
    import {queryAllSubjects} from "network/subjects/subjectHttp";
    import utils from "utils/utils";
    import {queryAllPublicTests} from "network/test/publicTest";

    export default {
        name: "ExamCenter",
        data(){
            return {
                search: {
                    key: '',    //关键字
                    page: 1,    //页数
                    row: 5,      //数据行数
                    status: null,       //试题状态
                    subject: null,    //试题的学科类型
                    orderField: '',   //排序的字段
                    order: 0          //排序0:升序，1：降序
                },
                subscribeInfo: [],
                total: 0,
                totalPage: 0,
                subjects: [],           //学科信息
                hotSujects: [],   //热门学科
                testInfo: {},
                publicTests: [],    //需要展示试卷
                publicTestsAndSubscribe: []
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
                querySubscribeUserIdAndDeleted(this.$store.state.user.id).then(res=>{
                    if(res.result_code===251) {
                        this.subscribeInfo=res.item
                    }
                });
                queryAllPublicTests(this.search).then((res)=>{
                    if(res.result_code===251){
                        this.publicTests=res.tests.items
                        this.totalPage = res.tests.totalPage
                        this.total = res.tests.total
                        this.$message.success("信息查询成功");

                        //添加用户的订阅信息
                        for(let i=0;i<this.publicTests.length;++i) {
                            let info=this.subscribeInfo.find(info => info.testId === this.publicTests[i].testId)
                            this.$set(this.publicTests[i], "subscribe", !(info === undefined || info.deleted === true))
                        }

                        this.handlePublishCommand('-1')
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
                    case '-1': this.publicTestsAndSubscribe=this.publicTests;break;
                    case  '0': this.publicTestsAndSubscribe=this.publicTests.filter(test=>test.subscribe);break;
                    case  '1': this.publicTestsAndSubscribe=this.publicTests.filter(test=>!test.subscribe);break;
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
            //订阅考试
            examSubscribeChanged(rowInfo){
                //如果尚未初始化，则不能订阅
                if(rowInfo.status===-1){
                    this.$notify({title: '警告', message: '考试时间尚未进行设置，请稍后再试！', type: 'warning', offset: 100, duration: 2000})
                    rowInfo.subscribe=!rowInfo.subscribe
                    return
                }

                //如果已经订阅了，点击后就是取消订阅
                if(!rowInfo.subscribe){
                    this.deleteSubscribeInfo(this.$store.state.user.id,rowInfo)
                    return
                }

                //生成传送数据对象
                let subscribeExam={
                    userId: this.$store.state.user.id,
                    testId: rowInfo.testId,
                }
                insertSubscribeExamInfo(subscribeExam).then((res)=>{
                    if(res.result_code===251){
                        this.$notify({title: '成功', message: '考试订阅成功，请记得及时完成试卷！', type: 'success', offset: 100, duration: 2000})
                        this.queryPublicTests()
                    }else{
                        this.$notify({title: '失败', message: '考试订阅失败，请查看信息是否正确，并且同一场考试不能订阅两次！', type: 'error', offset: 100, duration: 2000})
                        rowInfo.subscribe=!rowInfo.subscribe
                    }
                })
            },
            //删除订阅信息
            deleteSubscribeInfo(userId,rowInfo){
                deleteSubscribe(userId,rowInfo.id).then(res=>{
                    if(res.result_code===251){
                        this.$notify({title: '成功', message: '考试订阅取消成功！', type: 'success', offset: 100, duration: 2000})
                    }else{
                        this.$notify({title: '失败', message: '考试订阅取消失败！请仔细检查考试是否已经开始或者结束！', type: 'error', offset: 100, duration: 2000})
                        rowInfo.subscribe=!rowInfo.subscribe
                    }
                })
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
            }
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
        }
    }
</script>

<style lang="less">
    .examCenter {
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
                margin-top: 10px !important;
            }
        }
        .testCell{
            max-height: 100px !important;
            height: 90px !important;
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
            width: 100px !important;
            height: 40px !important;
            line-height: 40px;
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