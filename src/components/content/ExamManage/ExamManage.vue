<template>
    <div class="examManage">
        <el-card class="box-card">
            <!--面包屑导航区-->
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item><a >考试管理</a></el-breadcrumb-item>
                <el-breadcrumb-item>考试管理</el-breadcrumb-item>
            </el-breadcrumb>
            <!--添加和检索行-->
            <el-row justify="space-between" type="flex" >
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
            <el-table :data="publicTests" :stripe="true"  border max-height="550"   style="width: 100%" @sort-change="sortChange" :sort-orders="['ascending', 'descending']"
                      cell-class-name="cell"   @cell-dblclick="celldblclick">
                <el-table-column width="60" type="index"></el-table-column>
                <el-table-column prop="id" label="id" width="280" sortable="custom"></el-table-column>
                <el-table-column prop="subject" label="学科" :width="150" :formatter="subjectMapping"></el-table-column>
                <el-table-column prop="name" label="名称" width="250" show-overflow-tooltip></el-table-column>
                <el-table-column prop="startTime" label="开始时间" :width="200"></el-table-column>
                <el-table-column prop="endTime" label="结束时间" :width="200"></el-table-column>
                <el-table-column  label="限时" prop="astrict" width="100" :formatter="timeFormat"></el-table-column>
                <el-table-column prop="status" label="状态" :width="150">
                    <template slot-scope="scope">
                        <el-tag type="danger" v-if="scope.row.status===-1" v-text="testStatus(scope.row.status)" ></el-tag>
                        <el-tag type="success" v-else-if="scope.row.status===0" v-text="testStatus(scope.row.status)" ></el-tag>
                        <el-tag v-else-if="scope.row.status===1" v-text="testStatus(scope.row.status)" ></el-tag>
                        <el-tag type="warning" v-else v-text="testStatus(scope.row.status)" ></el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="created"  label="创建时间" width="200" sortable="custom"></el-table-column>

                <el-table-column label="操作" min-width="200"  fixed="right" class-name="examManageOperate">
                    <template slot-scope="scope">
                        <el-tooltip class="item2" effect="dark" :enterable="false" content="预览试题" placement="top-start">
                            <el-button @click="previewTest(scope.row.id)" type="primary" icon="el-icon-check" circle></el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" :enterable="false" content="编辑考试时间" placement="top-start" >
                            <el-button @click="editTestDate(scope.$index)" type="success" icon="el-icon-edit" circle class="edit" ></el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" :enterable="false" content="删除考试" placement="top-start">
                            <el-button  @click="deleteTest(scope.row.testId)" type="danger" icon="el-icon-delete" circle class="edit"></el-button>
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
            <date-time :showDateTimeDialog="showDateTimeDialog" @closeTimeDialog="closeTimeDialog"></date-time>
        <preview-test @closeTestDrawer="closeTestDrawer" :test-info="testInfo" :show-test-drawer="showTestDrawer"></preview-test>
    </div>
</template>

<script>
    import {queryAllSubjects} from "network/subjects/subjectHttp";
    import DateTime from "components/common/DateTime/DateTime";
    import {queryAllPublicTests,updatePublicTestTime} from "network/test/publicTest";
    import TestManager from "../TestManager/TestManager";
    import PreviewTest from "../TestManager/PreviewTest";
    import {updatePublish} from "network/test/testHttp";

    export default {
        name: "ExamManage",
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
                subjects: [],     //全部学科
                total: 0,
                totalPage: 0,
                hotSujects: [],   //热门学科
                showDateTimeDialog: false,
                publicTests: [],
                editIndex: 0,    //修改信息的试卷索引记录
                showTestDrawer: false,
                testInfo: null
            }
        },
        computed: {
            testStatus(){
                return function (status) {
                    if(status!==undefined){
                        switch (status) {
                            case -1: return '初始化';
                            case 0: return '未开始';
                            case 1: return '正在进行';
                            case 2: return '已结束';
                            default: return '未知';
                        }
                    }else {
                        return '未知';
                    }
                }
            }
        },
        methods: {
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
            //分页的页面行数大小改变
            handleSizeChange(newSize){
                this.search.row=newSize
            },
            //分页的页面位置改变
            handleCurrentChange(newPage){
                this.search.page=newPage
            },
            //排序发生改变
            sortChange( column, prop, order){
                this.$set(this.search,"orderField",column.prop)
                if(column.order==='ascending'){
                    this.search.order=0
                }else if(column.order==='descending'){
                    this.search.order=1
                }
            },
            //日期的转换
            timeFormat(row,column,cellValue,index){
                return row.astrict+"分钟"
            },
            closeTimeDialog(startTime,endTime){
                if(startTime==='0'&&endTime==='0'){
                    this.showDateTimeDialog=false
                }else{
                    console.log("开始时间  ",startTime)
                    console.log("结束时间  ",endTime)
                    let startDate=new Date(startTime)
                    let endDate=new Date(endTime)

                    console.log("开始时间2  ",startDate)
                    console.log("结束时间2  ",endDate)

                    //判断用户选择的开始时间和结束时间是否超过了试卷的限制时间
                    let interval=endDate-startDate
                    if(interval<this.publicTests[this.editIndex].astrict*60*1000){
                        this.$notify({
                            title: '警告',
                            message: '开始时间和结束时间间隔小于考试时间'+this.publicTests[this.editIndex].astrict+"分钟",
                            type: 'warning',
                            offset: 100,
                        });
                    }else{
                        //修改数据
                        this.publicTests[this.editIndex].startTime=startTime
                        this.publicTests[this.editIndex].endTime=endTime
                        //更新数据
                        this.updateTime()
                    }
                    this.editIndex=0
                    this.showDateTimeDialog=false
                }
            },
            queryPublicTests(){
                queryAllPublicTests(this.search).then((res)=>{
                    if(res.result_code===251){
                        this.publicTests=res.tests.items
                        this.totalPage = res.tests.totalPage
                        this.total = res.tests.total
                        this.$message.success("信息查询成功");
                    }else{
                        this.$message.warning("你还不是管理员，查询失败");
                    }
                })
            },
            //更新试卷的时间
            updateTime(){
              updatePublicTestTime(this.publicTests[this.editIndex]).then(res=>{
                  if(res.result_code===251){
                      this.queryPublicTests()
                      this.$notify({title: '成功', message: '更新试卷时间成功,状态更新稍后显示', type: 'success', offset: 100, duration: 2000})
                  }else{
                      this.$notify({title: '失败', message: '更新试卷时间失败', type: 'error', offset: 100, duration: 2000})
                  }
              })
            },
            //根据学科id映射成名称
            subjectMapping(row,column,cellValue,index){
                return  this.subjects.find((subject)=>subject.id===row.subject)?.name
            },
            //记录要修改的试卷索引
            editTestDate(index){
                this.showDateTimeDialog=true
                this.editIndex=index
            },
            //关闭预览
            closeTestDrawer(){
                this.showTestDrawer=false
            },
            //点击预览试卷按钮，查看试卷信息
            previewTest(id){
                this.testInfo=this.publicTests.find((test)=>test.id===id)
                this.showTestDrawer=true
            },
            //删除信息
            deleteTest(id){
                updatePublish(id).then((res)=>{
                    if (res.result_code === 251) {
                        this.$notify({
                            title: '成功',
                            message: '删除成功',
                            type: 'success',
                            offset: 100,
                            duration: 2000
                        });
                        this.queryPublicTests()
                    } else {
                        this.$notify({
                            title: '失败',
                            message: '删除失败',
                            type: 'error',
                            offset: 100,
                            duration: 2000
                        });
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
        created() {

        },
        components: {
            TestManager,
            DateTime,
            PreviewTest
        },
        watch: {
            'search': {
                deep: true,
                immediate: true,
                handler(){
                    if(this.$store.state.user.status) {
                        this.querySubjects()
                        this.queryPublicTests()
                    }else{
                        this.$message.warning("您不是管理员")
                    }
                }
            }
        }
    }
</script>

<style lang="less">

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
    }

    .el-dropdown{
        .el-dropdown-menu{
            height: 50px !important;
            overflow: hidden !important;
        }
    }

    .examManage{
        .el-tag{
            font-size: 17px !important;
            width: 100px !important;
            height: 40px !important;
            line-height: 40px;
        }
    }


</style>

<style scoped lang="less">
    .examManage{
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