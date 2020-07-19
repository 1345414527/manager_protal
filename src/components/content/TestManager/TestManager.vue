<template>
    <div class="testManager">
        <el-card class="box-card">
            <!--面包屑导航区-->
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item><a >试卷管理</a></el-breadcrumb-item>
                <el-breadcrumb-item>试题管理</el-breadcrumb-item>
            </el-breadcrumb>
            <!--添加和检索行-->
            <el-row justify="space-around" type="flex" >
                <el-col :span="5">
                    <el-button type="primary" @click="addTestClick" round>创建试卷</el-button>
                </el-col>
                <el-col :span="5">
                    <el-tooltip class="item" effect="dark" :enterable="false" content="根据类型进行筛选试题" placement="top-start">
                        <el-dropdown @command="handlePublishCommand">
                            <el-button type="primary">
                                {{search.publish==null?"活跃":(search.publish?"已发布":"未发布")}}<i class="el-icon-arrow-down el-icon--right"></i>
                            </el-button>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item command="-1" icon="el-icon-orange">全部</el-dropdown-item>
                                <el-dropdown-item command="0" icon="el-icon-watermelon">已发布</el-dropdown-item>
                                <el-dropdown-item command="1" icon="el-icon-apple">未发布</el-dropdown-item>
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
            <el-table :data="tests" :stripe="true"  border max-height="550"   style="width: 100%" @sort-change="sortChange" :sort-orders="['ascending', 'descending']"
                      cell-class-name="testCell"  @cell-dblclick="celldblclick">
                <el-table-column type="index"></el-table-column>
                <el-table-column prop="id" label="id" width="280" sortable="custom"></el-table-column>
                <el-table-column prop="subject" label="学科" :width="150" :formatter="subjectMapping"></el-table-column>
                <el-table-column  prop="name" label="标题" width="400" resizable></el-table-column>
                <el-table-column  label="出题学校" prop="school" width="250" show-overflow-tooltip></el-table-column>
                <el-table-column  label="出题人" prop="creator" width="200" ></el-table-column>
                <el-table-column  label="限时" prop="astrict" width="100" :formatter="timeFormat"></el-table-column>
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
                <el-table-column prop="note"   label="备注" width="250" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <p v-html="scope.row.note"></p>
                    </template>
                </el-table-column>

                <el-table-column prop="created" :formatter="dateFormat" label="创建时间" width="250" sortable="custom"></el-table-column>


                <el-table-column label="操作" min-width="120"  fixed="right" class-name="operateButton">
                    <template slot-scope="scope">
                        <el-tooltip class="item" effect="dark" :enterable="false" content="编辑试题信息" placement="top-start">
                            <el-button  @click="editInfo(scope.row.id)" type="success" icon="el-icon-edit" circle class="edit"></el-button>
                        </el-tooltip>
                        <el-tooltip class="item2" effect="dark" :enterable="false" content="预览试题" placement="top-start">
                            <el-button @click="previewTest(scope.row.id)" type="primary" icon="el-icon-check" circle></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>

                <el-table-column label="发布"  fixed="right" min-width="110">
                    <template slot-scope="scope">
                        <el-tooltip class="item" effect="dark" :enterable="false" :content="!scope.row.publish?'点击发布':'点击收回'" placement="top-start">
                                <el-switch v-model="scope.row.publish"  @change="testPublishChanged(scope.row)" :width="60" > </el-switch>
                        </el-tooltip>
                    </template>
                </el-table-column>

                <el-table-column label="状态"  fixed="right" min-width="110">
                    <template slot-scope="scope">
                        <el-tooltip class="item" effect="dark" :enterable="false" :content="scope.row.deleted?'点击删除':'点击复原'" placement="top-start">
                            <el-switch v-model="scope.row.deleted" @change="testStateChanged(scope.row)" :width="60"> </el-switch>
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

        <preview-test @closeTestDrawer="closeTestDrawer" :test-info="testInfo" :show-test-drawer="showTestDrawer"></preview-test>
    </div>
</template>

<script>
    import Topic from "../TopicManager/Topic";
   import {queryAllTest,deleteTest,updatePublish} from "network/test/testHttp";
   import {queryAllSubjects} from "network/subjects/subjectHttp";
   import utils from "utils/utils";
    import PreviewTest from "./PreviewTest";

    export default {
        name: "TestManager",
        data(){
            return {
                search: {
                    key: '',    //关键字
                    page: 1,    //页数
                    row: 5,      //数据行数
                    publish: null,    //试卷发布情况
                    subject: null,    //试卷的学科类型
                    orderField: '',   //排序的字段
                    order: 0          //排序0:升序，1：降序
                },
                tests: [
                    {
                        id: '',     //id
                        subject: '', //学科类型
                        name: '',   //名称
                        school: '', //出题学校
                        creator: '', //出题人
                        astrict: '', //考试时间
                        select: [] , //选择题id集合
                        judge: [] ,  //判断题id集合
                        selectScore: 0, //选择题分数
                        judgeScore: 0,  //判断题分数
                        note: '',   //备注信息
                        created: '',//创建时间
                        publish: '',//是否发布
                        deleted: '',//是否删除
                    }
                ],
                total: 0,
                totalPage: 0,
                subjects: [],           //学科信息
                hotSujects: [],   //热门学科
                testInfo: {},      //需要展示试卷
                showTestDrawer: false
            }
        },
        methods: {
            //查询所有学科信息
            queryTest(){
                queryAllTest(this.search).then((res)=>{
                    if(res.result_code===251) {
                        this.tests = res.tests.items
                        this.totalPage = res.tests.totalPage
                        this.total = res.tests.total
                        for(let i=0;i<this.tests.length;i++) {
                            this.tests[i].deleted=!this.tests[i].deleted
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
                this.queryTest()
            },
            //分页的页面位置改变
            handleCurrentChange(newPage){
                this.search.page=newPage
                this.queryTest()
            },
            //删除和重新添加试卷
            testStateChanged(row){
                if(row.deleted){
                    //重启试卷
                    deleteTest(row.id).then((res)=>{
                        if (res.result_code === 251) {
                            this.$message.success("重启成功")
                            this.queryTest()
                        } else {
                            this.$message.error("重启失败")
                        }
                    })

                }else {
                    //删除试卷
                    deleteTest(row.id).then((res) => {
                        if (res.result_code === 251) {
                            this.$message.success("删除成功")
                            this.queryTest()
                        } else {
                            this.$message.error("删除失败")
                        }
                    })
                }
            },
            //试卷的发布(收回)
            testPublishChanged(row){
                if(row.publish){
                    //发布试卷
                    updatePublish(row.id).then((res)=>{
                        if (res.result_code === 251) {
                            this.$message.success("发布成功")
                            this.queryTest()
                        } else {
                            this.$message.error("发布失败")
                        }
                    })

                }else {
                    //收回试卷
                    updatePublish(row.id).then((res) => {
                        if (res.result_code === 251) {
                            this.$message.success("收回成功")
                            this.queryTest()
                        } else {
                            this.$message.error("收回失败")
                        }
                    })
                }
            },
            //点击增加试卷按钮，打开对话框
            addTestClick(){
                this.$router.push('/home/testManager/create')
            },
            //点击修改试卷按钮，打开对话框
            editInfo(id){
                this.$router.push("/home/testManage/edit/"+id);
            },
            //点击预览试卷按钮，查看试卷信息
            previewTest(id){
                this.testInfo=this.tests.find((test)=>test.id===id)
                this.showTestDrawer=true
            },
            //关闭预览
            closeTestDrawer(){
                this.showTestDrawer=false
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
                    case '-1': this.search.publish=null;break;
                    case  '0': this.search.publish=true;break;
                    case  '1': this.search.publish=false;break;
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
        components: {
            Topic,
            PreviewTest
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
            }

        },
        watch: {
            'search': {
                deep: true,
                immediate: true,
                handler(val,val2){
                    this.queryTest()
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
            this.queryTest()
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
        margin-top: 20px;
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
        max-height: 100px;
        min-height: 90px !important;
    }

</style>

<style scoped>

    .testManager{
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




    /*li{*/
    /*    display: inline-block;*/
    /*}*/

</style>