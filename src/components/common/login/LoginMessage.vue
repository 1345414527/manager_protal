<template>
    <div class="loginmessage">
        <!--登录表单区-->
        <el-form :model="userInfo" :rules="rules" status-icon ref="loginFormRef" label-width="0" class="loginform" size="medium ">
            <el-form-item  prop="phone">
                <el-input  prefix-icon="el-icon-chat-dot-square" v-model.trim="userInfo.phone" placeholder="请输入手机号"
                          autofocus @keydown.enter.native="login"></el-input>
            </el-form-item>
            <el-form-item  prop="authcode" class="inputAuth">
                <el-input  prefix-icon="el-icon-lock" v-model.trim="userInfo.authcode" placeholder="验证码" @keydown.enter.native="login" class="cinCode"></el-input>
                <el-button  type="primary" @click="getAuthCode" >{{phoneAuthCodeTime===120?'click':phoneAuthCodeTime}}</el-button>
            </el-form-item>
            <el-form-item  class="btns">
                <el-button type="primary" @click="login" >登录</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import {sendPhoneAuthCode} from "network/message/authCodeHttp";
    import  {login} from "network/login/loginHttp";
    import {queryUserInfoByPhone} from "network/userinfo/userInfoHttp";


    export default {
        name: "LoginMessage",
        data(){
            return {
                userInfo: {
                    phone: '',
                    authcode: '',
                    type: 1             //电话号码登录标识符
                },
                phoneAuthCodeTime: 120,  //手机验证码获取冷却时间
                rules: {
                    phone: [
                        {required: true,message: '请输入手机号',trigger: 'blur'},
                       {pattern: /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/,message: '请输入正确的手机号',trigger: 'blur'}
                    ],
                    authcode: [
                        {required: true,message: '请输入验证码',trigger: 'blur'},
                        {pattern: /^([0-9]{6})$/,message: '输入的验证码有误',trigger: 'blur'}
                    ]
                }
            }
        },
        methods: {
            //获取电话的验证码
            getAuthCode(){
                if(/^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/.test(this.userInfo.phone)) {
                    if (this.phoneAuthCodeTime === 120) {
                        queryUserInfoByPhone(this.userInfo.phone).then((res)=>{
                            //该手机号已经绑定
                            if(res.result_code===200){
                                //使验证码获取时间递减
                                this.decPhoneTime()
                                sendPhoneAuthCode(this.userInfo.phone).then((res) => {
                                    if (res.result_code === 202) {
                                        this.$message({showClose: true, message: '验证码发送成功', type: 'success'})
                                    } else {
                                        this.$message({showClose: true, message: '验证码发送失败', type: 'error'})
                                    }
                                })
                            }else{  //该手机号没有绑定
                                this.$message({showClose: true,message: '该手机号没有绑定',type: 'warning'})
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
                    if(valid) {
                        login(this.userInfo).then((res) => {
                            if (res.result_code === 200) {
                                this.$store.dispatch("setUserInfo",res.user)
                                this.$message({showClose: true, message: '登录成功', type: 'success'})
                                this.$router.replace('/home')
                                this.phoneAuthCodeTime = 120
                            } else {
                                this.$message({showClose: true, message: '登录失败，验证码可能不对', type: 'error'})
                            }
                        })
                    }
                })
            },

            //减少验证码获取冷却时间
            decPhoneTime(){
                this.phoneAuthCodeTime=119;
                let dec=setInterval(()=>{
                    this.phoneAuthCodeTime-=1;
                    console.log(this.phoneAuthCodeTime)
                    //当到达指定时间又或者操作成功后重新指定为120，就暂停递减
                    if(this.phoneAuthCodeTime===0||this.phoneAuthCodeTime===119){
                        this.phoneAuthCodeTime=120
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
    .el-icon-chat-dot-square,.el-icon-lock{
        font-size: 20px ;
    }

</style>

<style scoped>

    .loginmessage{
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