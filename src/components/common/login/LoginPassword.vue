<template>
    <div class="loginpassword">
        <!--登录表单区-->
        <el-form :model="userInfo" :rules="rules" status-icon ref="loginFormRef" label-width="0" class="loginform" size="medium ">
            <el-form-item  prop="username">
                <el-input prefix-icon="el-icon-s-custom" v-model="userInfo.username" placeholder="请输入用户名"
                           autofocus @keydown.enter.native="login"></el-input>
            </el-form-item>
            <el-form-item  prop="password" class="inputpass">
                <el-input type='password' prefix-icon="el-icon-lock" v-model="userInfo.password" placeholder="请输入密码" @keydown.enter.native="login"></el-input>
            </el-form-item>
            <el-form-item  class="btns">
                <el-button type="primary" @click="login" >登录</el-button>
                <el-button  type="primary" @click="resetLoginForm">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import {login} from "network/login/loginHttp";

    export default {
        name: "LoginPassword",
        data(){
            return {
                userInfo: {
                    username: '',
                    password: '',
                    type: 0
                },
                rules: {
                    //用户名是否合法
                    username: [
                        { required: true, message: '请输入用户名', trigger: 'blur' },
                        { min: 5, max: 15, message: '长度在 5 到 15 个字符', trigger: 'blur' },
                        { pattern: /^(\w{5,15})$/ ,message: '不能含有汉字' ,trigger: 'blur'}
                    ],
                    //密码是否合法
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' },
                        { min: 5, max: 15, message: '长度在 5 到 15 个字符', trigger: 'blur' },
                        { pattern: /^(\w{5,15})$/ ,message: '不能含有汉字' ,trigger: 'blur'}
                    ]
                }
            }
        },
        methods: {
            resetLoginForm(){
                this.$refs.loginFormRef.resetFields()
            },
            login(){
                this.$refs.loginFormRef.validate(valid=>{
                        if(!valid){
                            return;
                        }
                         login(this.userInfo).then((res)=>{
                            console.log(res);
                            if(res.result_code===200){
                                this.$store.dispatch("setUserInfo",res.user)
                                this.$message({
                                    showClose:true,
                                    message: "登陆成功",
                                    type: 'success'
                                })

                                this.$router.replace('/home')

                            }else {
                                this.$message({
                                    showClose: true,
                                    message: "您输入的用户名或密码不正确",
                                    type: 'error'
                                })
                            }
                        })
                })
            }
        },

    }
</script>
<style>
    .el-input__inner{
        border-radius: 40px ;
        height: 60px ;
    }
    .el-icon-s-custom,.el-icon-lock{
        font-size: 20px ;
    }
</style>

<style scoped lang="less">
    .loginpassword{
        position: absolute;
        z-index: 1;
        width: 100%;
        bottom: 20%;
    }

    .loginform{
        width: 100%;
        padding: 10px 50px;
    }


    .el-icon-s-custom,.el-icon-lock{
        font-size: 10px !important;
    }

    .btns{
        display: flex;
        justify-content: space-between;
        margin-top: 60px;
    }

    .el-button{
        border-radius: 20px;
        background-color: transparent;
        margin-bottom: 20px;
    }

    .inputpass{
        transform: translateY(10px);
    }



</style>