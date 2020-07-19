<template>
    <div class="user-detail-info">
        <el-drawer
                title="用户信息"
                close-on-press-escape
                :visible="showTestDrawer"
                :modal="false" :modal-append-to-body="false"
                show-close
                closeDrawer
                :before-close="closeDrawer"
                direction="ttb"
                size="90%" custom-class="testDrawer">
            <el-row type="flex" justify="first">
                <el-col  :offset="2">
                    <img :src="userInfo.image?userInfo.image:defaultImage" class="avatar"/>
                </el-col>
                <el-col :pull="1">
                    <dl class="user-info" v-if="userInfo.id" @dblclick="celldblclick(userInfo.id)">
                        <dt class="param-name" >id</dt>
                        <dd><el-tag>{{userInfo.id}}</el-tag></dd>
                    </dl>
                    <dl class="user-info" v-if="userInfo.username" @dblclick="celldblclick(userInfo.username)">
                        <dt class="param-name">用户名</dt>
                        <dd ><el-tag>{{userInfo.username}}</el-tag></dd>
                    </dl>
                    <dl class="user-info" v-if="userInfo.name" @dblclick="celldblclick(userInfo.name)">
                        <dt class="param-name">名字</dt>
                        <dd><el-tag>{{userInfo.name}}</el-tag></dd>
                    </dl>
                    <dl class="user-info" v-if="userInfo.sno" @dblclick="celldblclick(userInfo.sno)">
                        <dt class="param-name">学号</dt>
                        <dd><el-tag>{{userInfo.sno}}</el-tag></dd>
                    </dl>
                    <dl class="user-info" v-if="userInfo.age" @dblclick="celldblclick(userInfo.age)">
                        <dt class="param-name">年龄</dt>
                        <dd><el-tag>{{userInfo.age}}</el-tag></dd>
                    </dl>
                    <dl class="user-info area-info" v-if="userInfo.areaProvince">
                        <dt class="param-name">地区</dt>
                        <dd>
                            <el-tag> {{userInfo.areaProvince}}</el-tag>
                            <el-tag type="success"> {{userInfo.areaCity}} </el-tag>
                            <el-tag type="info"> {{userInfo.areaCounty}}</el-tag>
                        </dd>
                    </dl>
                    <dl class="user-info" v-if="userInfo.status" >
                        <dt class="param-name">身份</dt>
                        <dd>
                            <el-tag  v-if="userInfo.status">管理大大</el-tag>
                            <el-tag v-else type="success">普通用户</el-tag>
                        </dd>
                    </dl>
                    <dl class="user-info" v-if="userInfo.email" @dblclick="celldblclick(userInfo.email)">
                        <dt class="param-name">邮箱</dt>
                        <dd><el-tag type="success"> {{userInfo.email}}</el-tag></dd>
                    </dl>
                    <dl class="user-info" v-if="userInfo.phone" @dblclick="celldblclick(userInfo.phone)">
                        <dt class="param-name">手机号</dt>
                        <dd><el-tag type="success">{{userInfo.phone}}</el-tag></dd>
                    </dl>
                    <dl class="user-info" v-if="userInfo.created" >
                        <dt class="param-name">创建时间</dt>
                        <dd><el-tag type="success">{{createdDate}}</el-tag></dd>
                    </dl>
                </el-col>
            </el-row>

            <el-row>
                <UserScoreStatistic :user-id="userId" class="user-score-statistic"></UserScoreStatistic>
            </el-row>
        </el-drawer>
    </div>
</template>

<script>
    import {queryUserByid} from "../../../network/userinfo/userInfoHttp";
    import utils from "../../../utils/utils";
    import UserScoreStatistic from "../Statistics/UserScoreStatistic";

    export default {
        name: "UserDetailInfo",
        data(){
          return{
                userInfo: {},
                defaultImage: require('assets/img/head.jpg'), //默认头像
            }
        },
        props: {
            userId: {
                type: String,
                required: true
            },
            showTestDrawer: {
                type: Boolean,
                default: false
            },

        },
        methods: {
            //查询用户信息
            queryUserInfo(){
                queryUserByid(this.userId).then(res=>{
                    if(res.result_code===261){
                        this.userInfo=res.user
                        console.log("用户信息",this.userInfo);
                        this.$notify({title: '成功', message: '查询成功！'+data, type: 'success', offset: 50, duration: 2000})
                    }else{
                        this.$notify({title: '失败', message: '查询失败！'+data, type: 'success', offset: 50, duration: 2000})
                    }

                })
            },
            //关闭弹框
            closeDrawer(){
                this.userId=''
                this.$emit("closeDrawer")
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
        },
        computed: {
            createdDate(){
                return utils.formatDate(this.userInfo.created)
            },

        },
        created() {
            // this.queryUserInfo()
        },
        watch: {
            'userId': {
                deep: true,
                immediate: true,
                handler(newV,oldV){
                    // console.log("信息是",this.userId);
                    // alert("dsa")
                    // this.queryUserInfo()
                    if(newV!==oldV){
                        this.queryUserInfo()
                    }
                }
            }
        },
        components: {
            UserScoreStatistic
        },


    }
</script>

<style lang="less">
    .user-detail-info{


        .testDrawer{
            width: 90%;
            margin: auto;
            overflow-y: auto;
        }

        .el-drawer__header{
            font-size: 30px;
            color: black;
            text-align: center;
        }
        .el-drawer__body{
            overflow-y: auto;
        }



        .avatar{
            height: 450px;
            width: 400px;
            border: 1px solid green;
            background-repeat: no-repeat;
        }
        dl{
            clear:left;

        }
        dt,dd{
            float:left;
            margin-bottom: 20px;
        }

        .dd{
            transform: translateX(50px)!important;
        }


        .user-info{
            text-align: left;
        }


        .param-name{
            /*background-color: rgba(0,0,0,0.1);*/
            width: 100px;
            font-family: "Microsoft YaHei";
            font-weight: bolder;
            font-size: 20px;
            text-shadow: 2px 3px rgba(0,0,0,0.5);
            margin-right: 80px
        }

        .user-score-statistic{
            margin-top: 250px;
            background-image: url("~assets/img/星空.jpg");
            background-repeat: no-repeat;
            background-size: 100% 100%;
            padding-bottom: 150px;
            padding-top: 100px;
            width: 100%;

        }

        .el-tag{
            font-size: 16px;
        }

        .area-info{
            .el-tag{
                margin-right: 10px;
            }
        }
    }

</style>