<template>
    <div class="subjectManager">

        <el-card class="box-card">
            <!--面包屑导航区-->
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item><a href="/home/subjectManage">学科管理</a></el-breadcrumb-item>
                <el-breadcrumb-item>学科管理</el-breadcrumb-item>
            </el-breadcrumb>
            <!--添加和检索行-->
            <el-row justify="space-between" type="flex" >
                <el-col :span="4">
                    <el-button type="primary" @click="addDialogClick" round>添加学科</el-button>
                </el-col>
                <el-col :span="5" >
                    <el-input  placeholder="请输入检索内容" v-model="search.key" class="input-with-select" clearable prefix-icon="iconfont icon-sousuo1">
                    </el-input>
                </el-col>
            </el-row>

            <!--表格-->
            <el-table :data="subjects" :stripe="true"  border max-height="450"  @cell-dblclick="celldblclick">
                <el-table-column type="index"></el-table-column>
                <el-table-column
                            prop="id"
                            label="id"
                            width="250"
                            sortable>
                    </el-table-column>
                    <el-table-column
                            prop="name"
                            label="名称"
                            :width="180">
                    </el-table-column>
                    <el-table-column
                            prop="note"
                            label="备注信息"
                            width="500">
                    </el-table-column>
                <el-table-column
                        prop="created"
                        :formatter="dateFormat"
                        label="创建时间"
                        sortable>
                </el-table-column>

                <el-table-column label="状态">
                    <template slot-scope="scope">
                        <el-tooltip class="item" effect="dark" :enterable="false" :content="!scope.row.deleted?'点击重启':'点击删除'" placement="top-start">
                          <el-switch v-model="scope.row.deleted" @change="userStateChanged(scope.row)" :width="60"> </el-switch>
                        </el-tooltip>
                    </template>
                </el-table-column>


                <el-table-column label="编辑">
                    <template slot-scope="scope">
                        <el-button  @click="editInfo(scope.row)" type="success" round>编辑</el-button>
                    </template>
                </el-table-column>

            </el-table>
'
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

        <!--增添对话框-->
        <subject :is-edit="false" :is-show="addDialogVisiable" @updateState="updateShow"/>
        <!--编辑对话框-->
        <subject :is-edit="true" :is-show="editDialogVisiable" :subjects="editRowInfo"  @updateState="updateShow"/>
    </div>
</template>

<script>

    import {querySubjects,deleteSubject,updateSubjectById} from "network/subjects/subjectHttp";
    import Subject from "./Subject";
    import utils from "utils/utils"

    export default {
        name: "SubjectManager",
        data(){
            return {
                addDialogVisiable: false,     //添加学科对话框
                editDialogVisiable: false,    //修改学科信息对话框
                search: {
                    key: '',    //关键字
                    page: 1,    //页数
                    row: 5      //数据行数
                },
                subjects: [
                    {
                        id: '',     //id
                        name: '',   //名称
                        note: '',   //备注信息
                        created: '',//创建时间
                        deleted: '' //是否删除
                    }
                ],
                total: 0,
                totalPage: 0,
                isEdit: false,        //判断是修改还是添加对话框
                editRowInfo: {}       //要修改的学科信息
            }
        },
        methods: {
            //查询所有学科信息
            querySubject(){
                querySubjects(this.search).then((res)=>{
                    if(res.result_code===200) {
                        this.subjects = res.subjects.items
                        this.totalPage = res.subjects.totalPage
                        this.total = res.subjects.total
                        this.subjects.forEach(subject=>subject.deleted=!subject.deleted)
                        console.log(res);
                    }else{
                        this.$message.warning("您不是管理员")
                    }
                })
            },
            //分页的页面行数大小改变
            handleSizeChange(newSize){
                this.search.row=newSize
                this.querySubject()
            },
            //分页的页面位置改变
            handleCurrentChange(newPage){
                this.search.page=newPage
                this.querySubject()
            },
            //删除和重新添加学科
            userStateChanged(row){
                if(row.deleted){
                    //重启学科
                    updateSubjectById(row.id).then((res)=>{
                        if (res.result_code === 200) {
                            this.$message.success("重启成功")
                            this.querySubject()
                        } else {
                            this.$message.error("重启失败")
                        }
                    })

                }else {
                    //删除学科
                    deleteSubject(row.id).then((res) => {
                        if (res.result_code === 200) {
                            this.$message.success("删除成功")
                            this.querySubject()
                        } else {
                            this.$message.error("删除失败")
                        }
                    })
                }
            },
            //点击增加学科按钮，打开对话框
            addDialogClick(){
                this.isEdit=false
                this.addDialogVisiable=true
            },
            //点击修改学科按钮，打开对话框
            editInfo(row){
                this.editDialogVisiable=true
                this.editRowInfo={id: row.id,name: row.name,note: row.note}
            },
            //修改之后，关闭对话框,并且重新获取数据展示
            updateShow(){
                this.addDialogVisiable=false
                this.editDialogVisiable=false
                this.querySubject()
            },
            //日期的转换
            dateFormat(row, column, cellValue, index){
                return utils.formatDate(row.created)
            },
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
            Subject,
        },
        computed: {
            deletedInfo(){
                return function(info){
                    return !info
                 }
            }
        },
        watch: {
            'search': {
                deep: true,
                immediate: true,
                handler(val,val2){
                    this.querySubject()
                }
            }
        }

    }
</script>
<style>

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
</style>

<style scoped>

    .subjectManager{
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



</style>