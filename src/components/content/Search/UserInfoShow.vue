<template>
    <div class="user-info-show">
        <el-card class="box-card">
            <!--返回-->
            <el-page-header @back="goBack" content="用户信息"></el-page-header>
            <div class="agg-block">
                <el-row class="filter-info">
                    <el-col>
                        <el-tag :key="value.name" v-for="(value,index) in filter" closable :disable-transitions="false" @close="handleClose(value)">
                            {{value.value}}
                        </el-tag>
                    </el-col>
                </el-row>
                <!--聚合选项-->
                <div  v-if="searchResult.age.length>0" class="agg-param">
                    <div class="name"><el-tag type="success">年龄</el-tag></div>
                        <ul v-for="(value,index) in searchResult.age" :key="index+value">
                            <li><a @click="filterAge(value)">{{value}}</a></li>
                        </ul>
                </div>

                <div  v-if="searchResult.areaProvince.length>0" class="agg-param">
                    <div class="name"><el-tag type="success">地区</el-tag></div>
                    <ul v-for="(value,index) in searchResult.areaProvince" :key="index+value">
                        <li><a @click="filterArea(value)">{{value}}</a></li>
                    </ul>
                </div>

                <div  v-if="searchResult.status.length>0" class="agg-param">
                    <div class="name"><el-tag type="success">身份</el-tag></div>
                    <ul v-for="(value,index) in searchResult.status" :key="index+value">
                        <li><a @click="filterStatus(value)">{{value}}</a></li>
                    </ul>
                </div>

                <div  v-if="searchResult.level.length>0" class="agg-param">
                    <div class="name"><el-tag type="success">学级</el-tag></div>
                    <ul v-for="(value,index) in searchResult.level" :key="index+value">
                        <li><a @click="filterLevel(value)">{{value}}</a></li>
                    </ul>
                </div>

            </div>
             <!--用户数据-->
             <div class="user-block">
                <div class="block" v-for="item in searchResult.items" :key="item.id" @contextmenu.prevent="celldblclick(item.id)" @click="viewUserDetail(item.id)">
                    <ul class="demonstration user-id" >
                        <li>{{item.id}}</li>
                    </ul>
                    <el-image :src="item.image?item.image:defaultImage"></el-image>
                    <div class="demonstration">
                            <el-row type="flex" justify="start">
                                <el-col :push="4"><span>用户名</span></el-col>
                                <el-col >{{item.username}}</el-col>
                            </el-row>
                            <el-row type="flex" justify="start">
                                <el-col :push="4"><span>名字</span></el-col>
                                <el-col >{{item.name}}</el-col>
                            </el-row>
                            <el-row type="flex" justify="start">
                                <el-col :push="4"><span>年龄</span></el-col>
                                <el-col >{{item.age}}</el-col>
                            </el-row>
                            <el-row type="flex" justify="start">
                                <el-col :push="4"><span>学级</span></el-col>
                                <el-col >{{item.level}}</el-col>
                            </el-row>
                            <el-row type="flex" justify="start">
                                <el-col :push="4"><span>地区</span></el-col>
                                <el-col >{{item.areaProvince}}</el-col>
                            </el-row>
                            <el-row type="flex" justify="start">
                                <el-col :push="4"><span>学号</span></el-col>
                                <el-col >{{item.sno}}</el-col>
                            </el-row>
                            <el-row type="flex" justify="start">
                                <el-col :push="4"><span>身份</span></el-col>
                                <el-col >{{item.status}}</el-col>
                            </el-row>
                            <el-row type="flex" justify="start">
                                <el-col :push="4"><span>创建时间</span></el-col>
                                <el-col >{{item.created}}</el-col>
                            </el-row>
                    </div>
                </div>
            </div>
                <el-pagination
                        @size-change="handleSizeChange"
                      @current-change="handleCurrentChange"
                        :current-page.sync="searchRequest.page"
                       :page-size="searchResult.totalPage"
                      layout="total,prev, pager, next, jumper"
                       :total="searchResult.total">
                </el-pagination>
        </el-card>

        <user-detail-info :user-id="userId" :show-test-drawer="showTestDrawer" @closeDrawer="closeDrawer"></user-detail-info>
    </div>
</template>

<script>
    import {search} from "../../../network/search/userSearch";
    import UserDetailInfo from "./UserDetailInfo";

    export default {
        name: "UserInfoShow",
        data(){
            return {
                searchRequest: {
                    key: '',
                    page: null,
                    filter: {}  //status,level,age,areaProvince
                },
                searchResult: {
                    status: [],
                    level: [],
                    age: [],
                    areaProvince: [],
                    items: [{}],
                    total: 1,
                    totalPage: 1
                },
                defaultImage: require('assets/img/head.jpg'), //默认头像
                filter: [{name:'提示',value:'条件信息'}],
                userId: '',
                showTestDrawer: false
            }
        },
        methods: {
            goBack(){
                this.$router.push("/home/user/search")
            },
            //查询用户信息
            queryUserInfo(){
                if(this.searchRequest.key===null){
                    return
                }
                search(this.searchRequest).then(res=>{
                    if(res.result_code===263){
                        console.log(res);
                        this.searchResult=res.searchResult
                        this.$notify({title: '成功', message: '信息检索成功！', type: 'success', offset: 100, duration: 2000})
                    }else{
                        this.$notify({title: '失败', message: '信息检索失败，请稍后再试！', type: 'error', offset: 100, duration: 2000})
                    }
                })
            },
            //处理关闭
            handleClose(value){
                if(value.name==='提示'&&value.value==='条件信息'){
                    this.$notify({title: '警告', message: '该条过滤不能删除！', type: 'warning', offset: 100, duration: 2000})
                    return
                }
                this.filter.splice(this.filter.findIndex(param=>param.name===value.name&&param.value===value.value),1)
                this.$delete(this.searchRequest.filter,value.name)
            },
            //过滤年龄
            filterAge(value){
                this.filter.push({name:'age',value:value})
                this.$set( this.searchRequest.filter,'age',value)
            },
            //过滤地区
            filterArea(value){
                this.filter.push({name:'areaProvince',value:value})
                this.$set( this.searchRequest.filter,'areaProvince',value)
            },
            //过滤身份
            filterStatus(value){
                this.filter.push({name:'status',value:value})
                this.$set( this.searchRequest.filter,'status',value)
            },
            //过滤学级
            filterLevel(value){
                this.filter.push({name:'level',value:value})
                this.$set( this.searchRequest.filter,'level',value)
            },

            //分页的页面行数大小改变
            handleSizeChange(newSize){
                this.search.row=newSize
            },

            //分页的页面位置改变
            handleCurrentChange(newPage){
                this.searchRequest.page=newPage
            },

            //双击复制
            celldblclick (data) {
                this.$copyText(data).then(e=> {
                    this.onCopy(data)
                }, function (e) {
                    this.onError()
                })
            },
            onCopy(data) {
                this.$notify({title: '成功', message: '复制成功！'+data, type: 'success', offset: 50, duration: 2000})
            },
            onError() {
                this.$notify({title: '失败', message: '复制失败！', type: 'error', offset: 50, duration: 2000})
            },
            //查看用户的具体信息
            viewUserDetail(id){
                if(!this.$store.state.user.status){
                    this.$notify({title: '警告', message: '您还不是管理员，不能查看！', type: 'error', offset: 50, duration: 2000})
                    return
                }
                this.userId=id
                this.showTestDrawer=true
            },
            //关闭弹框
            closeDrawer(){
                this.showTestDrawer=false
            }
        },
        created() {
            this.searchRequest.key=this.$route.query.search
        },
        beforeRouteUpdate (to, from, next) {
            next()
            this.searchRequest.key=this.$route.query.search
        },
        watch: {
            'searchRequest': {
                deep: true,
                // immediate: true,
                handler(newV,oldV){
                    this.queryUserInfo()
                }
            }
        },
        components: {
            UserDetailInfo
        }
    }
</script>

<style lang="less">


    .user-info-show{
        position: absolute;
        z-index: 1;

        .box-card{
            height: 800px;
            width: 1600px;
            overflow-y: auto;
            background-color: rgba(255,255,255,0.1)!important;
        }
        .el-page-header{
            color: white;
        }

        .el-page-header__content{
            color: white;
        }

        .agg-block{
            /*height: 100px;*/
            color: white;
        }
        .agg-param {
            border-bottom: 1px solid rgba(255,255,255,0.5);
            border-top: 1px solid rgba(255,255,255,0.5);
            width: 1600px;
            ul {
                transform: translateX(30px);
                margin-top: 20px;
                margin-bottom: 15px;
                padding-left: 20px;
                padding-bottom: 7px;
                display: inline-block;
                margin-left: 30px;
            }

            .el-tag{
                position: absolute;
                width: 70px!important;
                text-align: center;
                font-size: 17px;
                transform: translateY(10px);
            }


            li {
                width: 100px;
                display: inline-block !important;
                margin-left: 20px;
                cursor: pointer;
                 color: white;
                a {
                    color: orange;
                }
                a:visited,a:link,a:active {
                    color: yellow!important;
                }
            }
        }

        .filter-info{
            margin-top: 20px;
            margin-bottom: 20px;
            .el-tag{
                margin-left: 10px;
                height: 40px;
                text-align: center;
                line-height: 40px;
                font-size: 15px;
            }
        }





        .user-block{
            display: flex;
            flex-wrap: wrap;
            align-content: flex-start;
            margin-top: 40px;
            perspective: 500px;
            margin-bottom: 60px;
        }

        .block{
            flex: 0 0 19.2%;
            margin-left: 10px;
            margin-top: 10px;
            height: 400px;
            width: 200px;
            background-color: rgba(255,255,255,0.1);
            display: inline-block;
            text-align: center;
            border: 1px solid green;
            transform-style: preserve-3d;
            transition: all 0.4s;
        }

        .el-image{
            width: 150px;
            border-radius: 150px;
            height: 150px;
        }

        .demonstration{
            text-align: left;
            color: white;
        }

        .el-pagination{
            position: relative;
            text-align: center;
            margin-top: 20px;
            color: black;
            margin-bottom: 100px;
        }

        .el-pagination__total,.el-pagination__jump{
            color: white!important;
        }

        .user-id{
            text-align: center;
            margin-top: 10px;
            color: red;
        }

        .block:hover{
            transform: translate3d(0,-20px,20px) ;
            border: 1px solid #f5f6fa;
        }

        .light{

        }

    }




</style>