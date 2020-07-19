<template>
    <div class="userManager">
        <el-card class="box-card">
            <!--面包屑导航区-->
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item><a href="/home/userManage">用户管理</a></el-breadcrumb-item>
                <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            </el-breadcrumb>
            <!--添加和检索行-->
            <el-row justify="end" type="flex" >
                <el-col :span="5" >
                    <el-input  placeholder="请输入检索内容" v-model="search.key" class="input-with-select" clearable prefix-icon="iconfont icon-sousuo1">
                    </el-input>
                </el-col>
            </el-row>

            <!--表格-->
            <el-table :data="users" :stripe="true"  border max-height="550"  style="width: 100%" @sort-change="sortChange"
                      :sort-orders="['ascending', 'descending']"  @cell-dblclick="celldblclick">
                <el-table-column type="index"></el-table-column>
                <el-table-column prop="id" label="id" width="200" sortable="custom" :sort-orders="['ascending', 'descending']" ></el-table-column>
                <el-table-column label="头像" width="80" >
                    <template slot-scope="scope">
                       <div class="userImage" :style="{backgroundImage: (scope.row.image?'url('+scope.row.image+')':'url('+defaultImage+')')}"></div>
                    </template>
                </el-table-column>
                <el-table-column prop="username" label="用户名" width="250"></el-table-column>
                <el-table-column prop="name" label="名称" :width="180"></el-table-column>
                <el-table-column prop="sno" label="学号" width="220" sortable="custom"></el-table-column>
                <el-table-column prop="phone" label="电话号码" width="250"></el-table-column>
                <el-table-column prop="email" label="邮箱地址" width="250"></el-table-column>
                <el-table-column prop="created" :formatter="dateFormat" label="创建时间" width="250" sortable="custom"></el-table-column>

                <el-table-column label="状态"  fixed="right">
                    <template slot-scope="scope">
                        <el-tooltip class="item" effect="dark" :enterable="false" :content="scope.row.status?'点击取消管理员授权':'点击授权管理员'" placement="top-start">
                            <el-switch v-model="scope.row.status" @change="userStateChanged(scope.row)" :width="60"> </el-switch>
                        </el-tooltip>
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
    </div>
</template>

<script>
    import {queryAllUsers,updateStatus} from "network/userinfo/userInfoHttp";
    import utils from "utils/utils";

    export default {
        name: "UserManager",
        data(){
            return {
                search: {
                    key: '',    //关键字
                    page: 1,    //页数
                    row: 5,      //数据行数
                    orderField: 'id',  //排序的字段
                    order: 0     //0：升序，1：降序
                },
                defaultImage: require('assets/img/head.jpg'),
                users: [
                    {
                        id: '',       //id
                        name: '',     //名称
                        status: null, //用户的状态  false: 用户 true: 管理员
                        username: '', //用户名
                        sno: '',      //学号,
                        phone: '',    //电话号码
                        email: '',    //邮箱
                        image: '',    //头像地址
                        created: ''   //创建时间
                    }
                ],
                total: 0,
                totalPage: 0,
            }
        },
        methods: {
            queryUsers(){
                //查询所有用户
                if(this.$store.state.user.status) {
                    queryAllUsers(this.search).then((res) => {
                        if (res.result_code === 200) {
                            this.users = res.users.items
                            this.totalPage = res.users.totalPage
                            this.total = res.users.total
                            console.log(res);
                        } else {
                            this.$message.warning("您不是管理员")
                        }
                    })
                }else{
                    this.$message.warning("您不是管理员")
                }
            },
            //分页的页面行数大小改变
            handleSizeChange(newSize){
                this.search.row=newSize
                this.queryUsers()
            },
            //分页的页面位置改变
            handleCurrentChange(newPage){
                this.search.page=newPage
                this.queryUsers()
            },
            //改变用户的状态
            userStateChanged(row){
                updateStatus(row.id).then((res)=>{
                    if(res.result_code===200){
                        if(!row.status) {
                            this.$message.success("收权成功")
                        }else{
                            this.$message.success("授权成功")
                        }
                        this.queryUsers()
                    }else{
                        this.$message.error("请求错误，请稍后再试，如果您不是管理员，那就溜了吧")
                        this.queryUsers()
                    }
                }).catch((err)=>{
                    this.$message.error("请求错误，请稍后再试")
                })

            },
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
            },
        },
        computed: {
        },
        watch: {
            'search': {
                deep: true,
                immediate: true,
                handler(val,val2){
                    this.queryUsers()
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

    .userManager{
        position: relative;
        z-index: 1;
        margin-top: 40px;
    }

    .el-card{
        border-radius: 20px;
        background-color: transparent;
    }



    .el-row{
        transform: translateY(10px);
    }

    .userImage{
        width: 65px !important;
        height: 65px !important;
        border-radius: 65px;
        background-repeat: no-repeat;
        background-size: 100% 100%;
    }

</style>