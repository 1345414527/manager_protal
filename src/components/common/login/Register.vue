<template>
    <div class="register">
        <!--注册表单区-->
        <el-form :model="userInfo" :rules="rules" status-icon ref="RegisterFormRef" label-width="0" class="registerForm" size="medium ">
            <el-form-item  prop="username">
                <el-input prefix-icon="el-icon-s-custom" v-model="userInfo.username" placeholder="请输入用户名"
                          autofocus @keydown.enter.native="register"></el-input>
            </el-form-item>
            <el-form-item  prop="password" class="inputpass">
                <el-input type='password' prefix-icon="el-icon-lock" v-model="userInfo.password" placeholder="请输入密码" @keydown.enter.native="register"></el-input>
            </el-form-item>
            <el-form-item  prop="confirmPassword" class="confirmPassword">
                <el-input type='password' prefix-icon="el-icon-lock" v-model="userInfo.confirmPassword" placeholder="请确认密码" @keydown.enter.native="register"></el-input>
            </el-form-item>
            <el-form-item  class="btns">
                <el-button type="primary" @click="register" >注册</el-button>
                <el-button  type="primary" @click="resetRegisterForm">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import * as loginHttp from 'network/login/loginHttp';

    export default {
        name: "Register",
        data(){


            //校验两次密码是否一致
            let validatePass=(rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.userInfo.password) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            }

            return {
                userInfo: {
                    username: '',
                    password: '',
                    confirmPassword: ''
                },
                status: 0,  //是否成功注册0:没有,1:祖册成功
                rules: {
                    //用户名是否合法
                    username: [
                        { required: true, message: '请输入用户名', trigger: 'blur' },
                        { min: 5, max: 15, message: '长度在 5 到 15 个字符', trigger: 'blur' },
                        { pattern: /^(\w{5,15})$/ ,message: '不能含有汉字和特殊符号' ,trigger: 'blur'}
                    ],
                    //密码是否合法
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' },
                        { min: 5, max: 15, message: '长度在 5 到 15 个字符', trigger: 'blur' },
                        { pattern: /^(\w{5,15})$/ ,message: '不能含有汉字和特殊符号' ,trigger: 'blur'}
                    ],
                    confirmPassword: [
                        { validator: validatePass ,trigger: 'blur'}
                    ]
                },

            }
        },
        methods: {
            resetRegisterForm(){
                this.$refs.RegisterFormRef.resetFields()
            },

            //进行注册
            register(){
                this.$refs.RegisterFormRef.validate(valid=>{
                    this.result=0;
                    if(!valid){
                        return;
                    }
                    loginHttp.register({'username': this.userInfo.username,'password': this.userInfo.password}).then((res)=>{
                        console.log(res);
                        if(res.result_code==200){
                            this.status=1;
                            this.$router.replace('/home')
                        }else if (res.result_code===400){
                            this.$message.error('该用户名已经存在')
                        }else{

                        }
                    }).catch((err)=>{
                        this.result=-1;
                    })
                })
            }
        },

        //注册之后跳转之前获取token
        beforeRouteLeave (to, from, next) {
            if(this.status==1) {
                let loginInfo = this.userInfo;
                this.$delete(loginInfo, 'confirmPassword')
                Object.assign(loginInfo, {type: 0})
                loginHttp.login(loginInfo).then((res) => {
                    console.log(res);
                    this.$store.commit("setUserInfo",res.user)
                    if (res.result_code === 200) {
                        this.$message({
                            showClose: true,
                            message: "注册并登陆成功",
                            type: 'success'
                        })
                        next()
                    } else {
                        this.$message({
                            showClose: true,
                            message: "请稍候再试",
                            type: 'warning'
                        })
                        next(false)
                    }
                })
            }else{
                next();
            }
        }
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
    .register{
        position: absolute;
        z-index: 1;
        width: 100%;
        bottom: 15%;
    }

    .registerForm{
        width: 100%;
        padding: 5px 50px;
    }


    .el-icon-s-custom,.el-icon-lock{
        font-size: 10px !important;
    }

    .btns{
        display: flex;
        justify-content: space-between;
        margin-top: 50px;
    }

    .el-button{
        border-radius: 20px;
        background-color: transparent;
        margin-bottom: 20px;
    }

    .inputpass{
        transform: translateY(10px);
    }

    .confirmPassword{
        transform: translateY(20px);
    }



</style>