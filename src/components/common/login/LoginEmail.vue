<template>
    <div class="loginemail">
        <!--登录表单区-->
        <el-form :model="userInfo" :rules="rules" status-icon ref="loginFormRef" label-width="0" class="loginform" size="medium ">
            <el-form-item  prop="email">
                <el-input  prefix-icon="el-icon-message" v-model="userInfo.email" placeholder="请输入邮箱"
                           autofocus @keydown.enter.native="login"></el-input>
            </el-form-item>
            <el-form-item  prop="authcode" class="inputAuth">
                <el-input type="number" prefix-icon="el-icon-lock" v-model.number="userInfo.authcode" placeholder="验证码" @keydown.enter.native="login" class="cinCode"></el-input>
                <el-button  type="primary" @click="getAuthCode" >{{emailAuthCodeTime===120?'click':emailAuthCodeTime}}</el-button>
            </el-form-item>
            <el-form-item  class="btns">
                <el-button type="primary" @click="login" >登录</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import {sendEmailAuthCode} from "network/message/authCodeHttp";
    import  {login} from "network/login/loginHttp";
    import {queryUserInfoByEmail} from "network/userinfo/userInfoHttp";

    export default {
        name: "LoginEmail",
        data(){
            return {
                userInfo: {
                    email: '',
                    authcode: null,
                    type: 2           //邮箱登录标识符
                },
                emailAuthCodeTime: 120,    //设置获取邮箱验证码冷却时间
                rules: {
                    email: [
                        {required: true,message: '请输入邮箱',trigger: 'blur'},
                        {pattern: /^[a-z0-9]+(?:\.{0,1}[\w|-]+)*@[\w|-]+\.[a-z]{2,}(?:\.{0,1}[a-z]+)*$/,message: '请输入正确的邮箱',trigger: 'blur'}
                    ],
                    authcode: [
                        {required: true,message: '请输入验证码',trigger: 'blur'},
                        {pattern: /^([0-9]{6})$/,message: '输入的验证码有误',trigger: 'blur'}
                    ]
                }
            }
        },
        methods: {
            //获取邮箱验证码
            getAuthCode(){
                if(/^[a-z0-9]+(?:\.{0,1}[\w|-]+)*@[\w|-]+\.[a-z]{2,}(?:\.{0,1}[a-z]+)*$/.test(this.userInfo.email)) {
                    if (this.emailAuthCodeTime === 120) {
                        queryUserInfoByEmail(this.userInfo.email).then((res)=> {
                            //当前邮箱已经绑定
                            if(res.result_code===200) {
                                //使验证码获取时间递减
                                this.decEmailTime()
                                sendEmailAuthCode(this.userInfo.email).then((res) => {
                                    if (res.result_code === 202) {
                                        this.$message({showClose: true, message: '验证码发送成功', type: 'success'})
                                    } else {
                                        this.$message({showClose: true, message: '验证码发送失败', type: 'error'})
                                    }
                                })
                            }else{//当前邮箱没有绑定
                                this.$message({showClose: true,message: '该邮箱没有绑定',type: 'warning'})
                            }
                        })
                    } else {
                        this.$message({showClose: true, message: '请稍后再试，验证码已经发送', type: 'warning'})
                    }
                }
            },
            //登录
            login(){
                this.$refs.loginFormRef.validate(valid=>{
                    if(!valid){
                        return;
                    }
                    this.$refs.loginFormRef.validate(valid=>{
                        if(valid) {
                            login(this.userInfo).then((res) => {
                                if (res.result_code === 200) {
                                    this.$store.dispatch("setUserInfo",res.user)
                                    this.$message({showClose: true, message: '登录成功', type: 'success'})
                                    this.$router.replace('/home')
                                    this.emailAuthCodeTime = 120
                                } else {
                                    this.$message({showClose: true, message: '登录失败，验证码可能不对', type: 'error'})
                                }
                            })
                        }
                    })

                })
            },

            //减少验证码获取冷却时间
            decEmailTime(){
                this.emailAuthCodeTime=119;
                let dec=setInterval(()=>{
                    this.emailAuthCodeTime-=1;
                    console.log(this.emailAuthCodeTime)
                    //当到达指定时间又或者操作成功后重新指定为120，就暂停递减
                    if(this.emailAuthCodeTime===0||this.emailAuthCodeTime===119){
                        this.emailAuthCodeTime=120
                        clearInterval(dec)
                    }
                },1000)
            }
        }
    }
</script>

<style>

    .el-input__inner{
    border-radius: 40px ;
    height: 60px ;
    }
    .el-icon-message,.el-icon-lock{
    font-size: 20px ;
    }

</style>

<style scoped>

    .loginemail{
        position: absolute;
        z-index: 3;
        width: 100%;
        bottom: 30%;
    }

    .loginform{
        width: 100%;
        padding: 10px 50px;
    }

    .el-button{
        border-radius: 20px;
        background-color: transparent;
    }
    .cinCode{
        width: 50%;
        margin-right: 10%;
    }

    .btns{
        text-align: center;
        margin-top: 40px;
        transform: translateY(20px);
    }

    .inputAuth{
        transform: translateY(10px);
    }

</style>