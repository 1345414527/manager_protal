<template>
    <div class="log-info">
        <el-card class="box-card">
            <!--面包屑导航区-->
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item><a href="/home/logManage">日志管理</a></el-breadcrumb-item>
                <el-breadcrumb-item>日志管理</el-breadcrumb-item>
            </el-breadcrumb>
            <!--添加和检索行-->
            <el-row justify="end" type="flex" >
                <el-col :span="5">
                    <el-input  placeholder="请输入检索内容" v-model="search.key" class="input-with-select" clearable prefix-icon="iconfont icon-sousuo1"></el-input>
                </el-col>
            </el-row>

            <!--表格-->
            <el-table :data="logInfo" :stripe="true"  border max-height="600"  @cell-dblclick="celldblclick"
                      @sort-change="sortChange" :sort-orders="['ascending', 'descending']">
                <el-table-column type="index"></el-table-column>
                <el-table-column prop="id"  label="id" width="250" sortable></el-table-column>
                <el-table-column prop="userId" label="用户id" :width="250" sortable></el-table-column>
                <el-table-column prop="userName" label="用户名称" width="180"></el-table-column>
                <el-table-column prop="info" label="信息" width="700"></el-table-column>
                <el-table-column prop="create" label="创建时间" width="200px" sortable></el-table-column>

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
    import {queryAllLogs} from "network/log/logHttp";

    export default {
        name: "LogInfo",
        data(){
            return {
                search: {
                    key: '',    //关键字
                    page: 1,    //页数
                    row: 10 ,     //数据行数
                    orderField: '',   //排序的字段
                    order: 0          //排序0:升序，1：降序
                },
                logInfo: [{
                    id: '',
                    userId: '',
                    userName: '',
                    info: '',
                    create: null
                }],
                total: 0,
                totalPage: 0,
            }
        },
        methods: {
            //查询数据
            queryLogs(){
                queryAllLogs(this.search).then(res=>{
                    if(res.result_code===262){
                        this.$message.success("信息查询成功")
                        this.logInfo=res.log.items
                        this.totalPage = res.log.totalPage
                        this.total = res.log.total
                    }else{
                        this.$message.error("信息查询失败")
                    }
                })
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
            //分页的页面行数大小改变
            handleSizeChange(newSize){
                this.search.row=newSize
                this.queryLogs()
            },
            //分页的页面位置改变
            handleCurrentChange(newPage){
                this.search.page=newPage
                this.queryLogs()
            },
            //双击复制
            celldblclick(row, column, cell, event) {
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
        watch: {
            'search': {
                deep: true,
                immediate: true,
                handler(newV,oldV){
                    this.queryLogs()
                }
            }
        }
    }
</script>

<style  lang="less">
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

    .log-info{
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