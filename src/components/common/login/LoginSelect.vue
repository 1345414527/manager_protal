<template>
    <div class="login-select">
        <el-tooltip content="密码登录" placement="top" effect="light" >
            <a  :class="['el-icon-unlock',{'click-style':$route.path==='/login/password'}]" @click="selectLogin(1)"></a>
        </el-tooltip>
        <el-tooltip content="手机登录" placement="top" effect="light">
             <a :class="['el-icon-chat-dot-square',{'click-style':$route.path==='/login/message'}]" @click="selectLogin(2)"></a>
        </el-tooltip>
        <el-tooltip content="邮箱登录" placement="top" effect="light">
             <a  :class="['el-icon-message',{'click-style':$route.path==='/login/email'}]" @click="selectLogin(3)"></a>
        </el-tooltip>
        <el-tooltip content="注册" placement="top" effect="light">
             <a  :class="['el-icon-user',{'click-style':$route.path==='/register'}]" @click="selectLogin(4)"> </a>
        </el-tooltip>
    </div>
</template>

<script>
    export default {
        name: "LoginSelect",
        methods: {
            selectLogin(num){
                if(num===1){
                    this.$router.push('/login/password')
                }else if(num===2){
                    this.$router.push('/login/message');
                }else if(num===3){
                    this.$router.push('/login/email')
                }else if(num===4){
                    this.$router.push('/register')
                }
            }
        }
    }
</script>

<style  lang="less">

    .login-select{
        display: flex;
        position: absolute;
        width: 100%;
        height: 20%;
        bottom: 0;
        /*left: 50%;*/
        text-align: center;
        align-items: center;
        .el-icon-unlock,.el-icon-chat-dot-square,.el-icon-message,.el-icon-user{
            font-size: 25px !important;
            color: #5c2223;
        }
        .el-icon-unlock:hover,.el-icon-chat-dot-square:hover,.el-icon-message:hover,.el-icon-user:hover{
            font-size: 35px !important;
            color: #f1c4cd!important;
            text-shadow: 1px 0 1px;
        }

        a{
            flex: 1;
        }

        .click-style{
            color: yellow;
            font-size: 35px!important;
        }



    }







</style>