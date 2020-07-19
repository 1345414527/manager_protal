<template>
    <div class="headerDialog">
        <el-dialog
            :visible.sync="showDialog"
            width="30%"
            :before-close="closeDialog" custom-class="bigDialog">
            <div slot="title" class="title">
                <span>用户信息</span>
            </div>
                <el-form :model="userInfo" :rules="rules" ref="userInfoRef" label-width="100px" class="userForm" >
                    <el-row class="upload" >
                        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12"  ><span>头像</span></el-col>
                        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                            <el-upload
                                    class="avatar-uploader"
                                    :action="uploadUrl"
                                    :show-file-list="false"
                                    :on-success="handleAvatarSuccess"
                                    :before-upload="beforeAvatarUpload"
                                    :with-credentials="true"
                                    :drag="true">
                                <img v-if="userInfo.image" :src="userInfo.image" class="avatar">
                                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            </el-upload>
                        </el-col>
                    </el-row>
                    <el-row   >
                        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" ><span>id</span></el-col>
                        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" ><i @dblclick="celldblclick(userInfo.id)">{{userInfo.id}}</i></el-col>
                    </el-row>
                    <el-row >
                        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" ><span>用户名</span></el-col>
                        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">{{userInfo.username}}</el-col>
                    </el-row>
                    <el-row >
                        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12"  ><span>名称</span></el-col>
                        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" style="cursor: pointer" ><i @click="editNameDialog=true">{{userInfo.name||'点击添加或编辑'}}</i></el-col>
                    </el-row>
                    <el-row >
                        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" ><span>年龄</span></el-col>
                        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" style="cursor: pointer" ><i @click="editAgeDialog=true">{{userInfo.age>=0?userInfo.age:'点击绑定或编辑'}} 岁</i></el-col>
                    </el-row>
                    <el-row >
                        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" ><span>地区</span></el-col>
                        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                        <el-cascader
                                size="large" :options="options" filterable  placeholder="请选择区域"
                                v-model="editInfo.areaSelect" clearable
                                @change="editArea" class="edit-hometown">
                        </el-cascader></el-col>
                    </el-row>
                    <el-row >
                        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" ><span>身份</span></el-col>
                        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">{{userInfo.status?'管理大大':'学生'}}</el-col>
                    </el-row>


                    <el-row >
                        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12"  ><span>学号</span></el-col>
                        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="7" style="cursor: pointer"><i @click="editSnoDialog=true">{{userInfo.sno||'点击绑定或编辑'}}</i></el-col>
                    </el-row>
                    <el-row >
                        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" ><span>入门时间</span></el-col>
                        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">{{createdDate}}</el-col>
                    </el-row>
                    <el-row >
                        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12"  ><span>电话</span></el-col>
                        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" style="cursor: pointer"><i @click="editPhoneDialog=true">{{userInfo.phone||'点击绑定或编辑'}}</i></el-col>
                    </el-row>
                    <el-row >
                        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12"  ><span>邮箱</span></el-col>
                        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" style="cursor: pointer"><i @click="editEmailDialog=true">{{userInfo.email||'点击绑定或编辑'}}</i></el-col>
                    </el-row>
                 </el-form>
            <span slot="footer" class="dialog-footer">
                <el-row>
                   <el-button  @click="confirmChange" >确 定</el-button>
                </el-row>
            </span>
        </el-dialog>

        <!--修改名称-->
        <el-dialog
                :visible.sync="editNameDialog"
                width="20%"
                show-close
                close-on-press-escape
                :before-close="editName" custom-class="nameDialog"  >
            <el-form :model="editInfo" :rules="rules" status-icon ref="RegisterFormRef" label-width="0" class="editNameForm" size="medium ">
                <el-form-item  prop="name">
                    <el-input prefix-icon="el-icon-s-custom" v-model="editInfo.name" :placeholder="userInfo.name||'请输入名称'"
                              autofocus @keydown.enter.native="editName"></el-input>
                </el-form-item>
            </el-form>
        </el-dialog>

        <!--修改年龄-->
        <el-dialog
                :visible.sync="editAgeDialog"
                width="20%"
                show-close
                close-on-press-escape
                :before-close="editAge" custom-class="nameDialog">
            <el-form :model="editInfo" :rules="rules" status-icon ref="RegisterFormRef" label-width="0" class="editNameForm" size="medium ">
                <el-form-item  prop="age">
                    <el-input prefix-icon="el-icon-s-custom" v-model="editInfo.age" :placeholder="userInfo.age"
                              autofocus @keydown.enter.native="editAge"></el-input>
                </el-form-item>
            </el-form>
        </el-dialog>

        <!--修改学号-->
        <el-dialog
                :visible.sync="editSnoDialog"
                width="20%"
                show-close
                close-on-press-escape
                :before-close="editSno" custom-class="snoDialog" >
            <el-form :model="editInfo" :rules="rules" status-icon ref="updateSnoFormRef" label-width="0" class="editSnoForm" size="medium ">
                <el-form-item  prop="name">
                    <el-input prefix-icon="el-icon-sunny" v-model="editInfo.sno" :placeholder="userInfo.sno||'请输入学号'"
                              autofocus @keydown.enter.native="editName"></el-input>
                </el-form-item>
            </el-form>
        </el-dialog>

        <!--修改电话号码-->
        <el-dialog
                :visible.sync="editPhoneDialog"
                width="20%"
                show-close
                close-on-press-escape
                 custom-class="phoneDialog" >
            <el-form :model="editInfo" :rules="rules" status-icon ref="updatePhoneFormRef" label-width="0" class="editPhoneForm" size="medium ">

                    <el-row >
                        <el-form-item  prop="phone">
                            <el-col>
                                <el-input prefix-icon="el-icon-phone" v-model="editInfo.phone" :placeholder="userInfo.phone||'请输入电话号码'"
                                          autofocus :readonly="phoneExist===1"></el-input>
                            </el-col>
                        </el-form-item>
                    </el-row>
                    <el-row type="flex" justify="space-around" >
                        <el-col :span="20">
                            <el-form-item  prop="authCode">
                                <el-input prefix-icon="el-icon-key" v-model="editInfo.authCode" placeholder="请输入验证码"
                                         autofocus  >
                                </el-input>
                            </el-form-item>
                        </el-col>
                     <el-col class="authCodeButton" :offset="1">
                         <el-button @click="getPhoneAuthCode">{{phoneAuthCodeTime===120?'验证码':phoneAuthCodeTime}}</el-button>
                         <el-button @click="updatePhoneNum">{{phoneExist===1?'解绑':'绑定'}}</el-button></el-col>
                    </el-row>
            </el-form>
        </el-dialog>

        <!--修改邮箱-->
        <el-dialog
                :visible.sync="editEmailDialog"
                width="20%"
                show-close
                close-on-press-escape
                custom-class="emailDialog" >
            <el-form :model="editInfo" :rules="rules" status-icon ref="updateEmailFormRef" label-width="0" class="editEmailForm" size="medium ">

                <el-row >
                    <el-form-item  prop="email">
                        <el-col>
                            <el-input prefix-icon="el-icon-message" v-model="editInfo.email" :placeholder="userInfo.email||'请输入邮箱'"
                                      autofocus :readonly="emailExist===1"></el-input>
                        </el-col>
                    </el-form-item>
                </el-row>
                <el-row type="flex" justify="space-around" >
                    <el-col :span="20">
                        <el-form-item  prop="emailAuthCode">
                            <el-input prefix-icon="el-icon-key" v-model="editInfo.emailAuthCode" placeholder="请输入验证码"
                                      autofocus  >
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col class="authCodeButton" :offset="1">
                        <el-button @click="getEmailAuthCode">{{emailAuthCodeTime===120?'验证码':emailAuthCodeTime}}</el-button>
                        <el-button @click="updateEmailNum">{{emailExist===1?'解绑':'绑定'}}</el-button></el-col>
                </el-row>
            </el-form>
        </el-dialog>


    </div>
</template>

<script>
    import utils from "utils/utils";
    import {updateName,updateSno,addPhone,removePhone,addEmail,removeEmail,queryUserInfoByPhone,queryUserInfoByEmail,updateAge,updateArea} from "network/userinfo/userInfoHttp";
    import {sendPhoneAuthCode,sendEmailAuthCode} from "network/message/authCodeHttp";
    import {CodeToText,regionData,TextToCode  } from 'element-china-area-data'


    export default {
        name: "HeaderDialog",
        props: {
            showDialog: {
                type: Boolean,
                default: false
            }
        },
        data(){
            return {
                userInfo: {},        //userInfo是公共数据

                editInfo: {          //暂时存放修改的信息
                    name: '',           //名称
                    age: null,          //年龄
                    sno: '',            //学号
                    phone: null,        //电话号码
                    authCode: null,     //手机验证码
                    email: '',              //邮箱
                    emailAuthCode: null, //邮箱验证码
                    image: '',
                    areaSelect: ['','','']
                },
                options: regionData,

                phoneAuthCodeTime: 120, //手机验证码获取冷却时间
                emailAuthCodeTime: 120, //邮箱验证码获取冷却时间

                editAgeDialog: false,    //控制修改年龄对话框的弹出
                editNameDialog: false,   //控制修改名称对话框的弹出
                editSnoDialog: false,    //控制修改学号对话框的弹出
                editPhoneDialog: false,  //控制修改电话号码对话框的弹出
                editEmailDialog: false,   //控制修改邮箱对话框的弹出

                uploadUrl: 'http://api.codekiller.top/api/upload/image', //图片上传地址
                //信息修改的表单校验
                rules: {
                    name: [
                        { min: 0, max: 10, message: '长度要小于 10 个字符', trigger: 'blur' },
                        { pattern: /^[\u4E00-\u9FA5A-Za-z]+$/  ,message: '只能包含汉字和英文' ,trigger: 'blur'}
                    ],
                    sno: [
                        {min: 0,max: 30,message: '长度要小于30个字符',trigger: 'blur'},
                        {pattern: /^[A-Za-z1-9]$/,message: '只能包含数字和英文',trigger: 'blur'}
                    ],
                    age: [
                        { pattern: /^[0-9]{1,3}$/, message: '年龄要小于1000', trigger: 'blur' },
                    ],
                    phone: [
                        {required: true,message: '请输入手机号',trigger: 'blur'},
                        {pattern: /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/,message: '请输入正确的手机号',trigger: 'blur'}
                    ],
                    authCode: [
                        {required: true,message: '请输入验证码',trigger: 'blur'},
                        {pattern: /^([0-9]{6})$/,message: '输入的验证码有误',trigger: 'blur'}
                    ],
                    email: [
                        {required: true,message: '请输入邮箱',trigger: 'blur'},
                        {pattern: /^[a-z0-9]+(?:\.{0,1}[\w|-]+)*@[\w|-]+\.[a-z]{2,}(?:\.{0,1}[a-z]+)*$/,message: '请输入正确的邮箱',trigger: 'blur'}
                    ],
                    emailAuthCode: [
                        {required: true,message: '请输入验证码',trigger: 'blur'},
                        {pattern: /^([0-9]{6})$/,message: '输入的验证码有误',trigger: 'blur'}
                    ],
                }
            }
        },
        computed: {
           createdDate(){
               return utils.formatDate(this.userInfo.created)
           },
           //判断是够绑定了手机号，1：绑定，0,没有绑定
           phoneExist(){
               return (this.$store.state.user.phone==null||this.$store.state.user.phone=='')?0:1
           },

            //判断是够绑定了邮箱号，1：绑定，0,没有绑定
            emailExist(){
                return (this.$store.state.user.email==null||this.$store.state.user.email=='')?0:1
            }

        },
        methods: {
            //关闭大对话框
            closeDialog(){
                this.$emit("closeDialog");
            },
            //确认是否关闭对话框
            confirmChange(){
                this.$confirm('确定退出吗', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$emit("closeDialog");
                })
            },
            //头像上传成功
            handleAvatarSuccess(res, file) {
                this.userInfo.image = res.image
                this.editInfo.image = res.image
                this.$store.commit("updateImage",res.image)
                console.log("图片地址"+this.userInfo.image);
            },
            //在头像上传之前
            beforeAvatarUpload(file) {
                const isJPG = file.type === 'image/jpeg';
                const isPng=file.type==='image/png';
                const isLt2M = file.size / 1024 / 1024 < 2;

                if (!isJPG&&!isPng) {
                    this.$message.error('上传头像图片只能是 JPG或者PNG 格式!');
                }
                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 2MB!');
                }
                return (isJPG && isLt2M) ||(isPng && isLt2M);
            },
            celldblclick (data) {
                this.$copyText(data).then(e=> {
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
            //编辑名称
            editName(){
                this.$refs.RegisterFormRef.validate(valid=>{
                    if(!valid){
                        //修改失败
                        this.$message({showClose: true,message: '编辑错误',type: 'error'})
                    }else{
                        updateName(this.editInfo.name).then((res)=>{
                            //修改成功
                            if(res.result_code===201){
                                this.$store.commit('updateName',this.editInfo.name)
                                this.$message({showClose: true,message: '编辑成功',type: 'success'})
                            }else{
                                this.$message({showClose: true,message: '编辑错误',type: 'error'})
                            }
                        })

                    }
                    this.editNameDialog=false
                })
            },
            //编辑年龄
            editAge(){

                this.$refs.RegisterFormRef.validate(valid=>{
                    if(!valid){
                        //修改失败
                        this.$message({showClose: true,message: '编辑错误',type: 'error'})
                    }else{
                        if(this.editInfo.age===null){
                            this.editAgeDialog=false
                            return
                        }
                        updateAge(this.editInfo.age).then((res)=>{
                            //修改成功
                            if(res.result_code===201){
                                this.$store.commit('updateAge',this.editInfo.age)
                                this.$message({showClose: true,message: '编辑成功',type: 'success'})
                            }else{
                                this.$message({showClose: true,message: '编辑错误',type: 'error'})
                            }
                        })

                    }
                    this.editAgeDialog=false
                })
            },

            //编辑地区
            editArea(){
                updateArea(CodeToText[this.editInfo.areaSelect[0]],CodeToText[this.editInfo.areaSelect[1]],
                          CodeToText[this.editInfo.areaSelect[2]]).then((res)=>{
                    //修改成功
                    if(res.result_code===200){
                        this.$store.commit({
                            type: 'updateArea',
                            areaProvince: CodeToText[this.editInfo.areaSelect[0]],
                            areaCity: CodeToText[this.editInfo.areaSelect[1]],
                            areaCounty: CodeToText[this.editInfo.areaSelect[2]]
                        })
                        this.$message({showClose: true,message: '编辑成功',type: 'success'})
                    }else{
                        this.$message({showClose: true,message: '编辑错误',type: 'error'})
                    }
                })

                this.editAgeDialog=false

            },

            //编辑学号
            editSno(){
                this.$refs.updateSnoFormRef.validate(valid=>{
                    if(!valid){
                        //修改失败
                        this.$message({showClose: true,message: '编辑错误',type: 'error'})
                    }else{
                        updateSno(this.editInfo.sno).then((res)=>{
                            //修改成功
                            if(res.result_code===201){
                                this.$store.commit('updateSno',this.editInfo.sno)
                                this.$message({showClose: true,message: '编辑成功',type: 'success'})
                            }else{
                                this.$message({showClose: true,message: '编辑错误',type: 'error'})
                            }
                        })

                    }
                    this.editSnoDialog=false
                })
            },

            //获取电话的验证码
            getPhoneAuthCode(){
                if(/^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/.test(this.editInfo.phone)) {
                    if (this.phoneAuthCodeTime === 120) {
                      queryUserInfoByPhone(this.editInfo.phone).then((res)=> {
                          //该手机号没有绑定或者解绑
                          if (res.result_code != 200||this.phoneExist===1) {
                              //使验证码获取时间递减
                              this.decPhoneTime()
                              sendPhoneAuthCode(this.editInfo.phone).then((res) => {
                                  if (res.result_code === 202) {
                                      this.$message({showClose: true, message: '验证码发送成功', type: 'success'})
                                  } else {
                                      this.$message({showClose: true, message: '验证码发送失败', type: 'error'})
                                  }
                              })

                          }else{  //该手机号已经绑定
                              this.$message({showClose: true,message: '该手机号已经绑定',type: 'warning'})
                          }
                      })
                    } else {
                        this.$message({showClose: true, message: '请稍后再试，验证码已经发送', type: 'warning'})
                    }
                }
            },

            //改变电话号码,绑定和解绑
            updatePhoneNum(){
                this.$refs.updatePhoneFormRef.validate((valid)=>{
                        if(valid){
                            //移除手机号
                            if(this.phoneExist===1){
                                removePhone(this.userInfo.phone,this.editInfo.authCode).then((res)=>{
                                    if(res.result_code===201){
                                        this.$message({showClose: true,message: '解绑成功',type: 'success'})
                                        this.$store.commit("updatePhone",'')
                                        this.userInfo.phone=''
                                        this.editInfo.phone=''
                                        this.editInfo.authCode=''  //验证码赋空
                                        this.phoneExist=0;         //不存在手机号了
                                        this.editPhoneDialog=false  //关闭弹框
                                        this.phoneAuthCodeTime=120  //重新设置验证码获取时间
                                    }else{
                                        this.$message({showClose: true,message: '解绑失败',type: 'error'})
                                    }
                                })
                            }else{
                                addPhone(this.editInfo.phone,this.editInfo.authCode).then((res)=>{
                                    if(res.result_code===201){
                                        this.$message({showClose: true,message: '绑定成功',type: 'success'})
                                        this.$store.commit("updatePhone",this.editInfo.phone)
                                        this.editInfo.authCode=''  //验证码赋空
                                        this.phoneExist=1;
                                        this.editPhoneDialog=false  //关闭弹框
                                        this.phoneAuthCodeTime=120
                                    }else{
                                        this.$message({showClose: true,message: '绑定失败,该号码可能已经绑定',type: 'error'})
                                    }
                                })
                            }
                        }
                })
            },



            //获取邮箱验证码
            getEmailAuthCode(){
                if(/^[a-z0-9]+(?:\.{0,1}[\w|-]+)*@[\w|-]+\.[a-z]{2,}(?:\.{0,1}[a-z]+)*$/.test(this.editInfo.email)) {
                    if (this.emailAuthCodeTime === 120) {
                       queryUserInfoByEmail(this.editInfo.email).then((res)=> {
                           //当前邮箱没有绑定或者解绑
                           if (res.result_code != 200||this.emailExist===1) {
                               //使验证码获取时间递减
                               this.decEmailTime()
                               sendEmailAuthCode(this.editInfo.email).then((res) => {
                                   if (res.result_code === 202) {
                                       this.$message({showClose: true, message: '验证码发送成功', type: 'success'})
                                   } else {
                                       this.$message({showClose: true, message: '验证码发送失败', type: 'error'})
                                   }
                               })
                           } else {//当前邮箱已经绑定
                               this.$message({showClose: true, message: '该邮箱已经绑定', type: 'warning'})
                           }
                       })} else {
                                this.$message({showClose: true, message: '请稍后再试，验证码已经发送', type: 'warning'})
                            }
                    }
            },

            //修改邮箱，绑定和解绑
            updateEmailNum(){
                this.$refs.updateEmailFormRef.validate((valid)=>{
                    if(valid){
                        //移除手机号
                        if(this.emailExist===1){
                            removeEmail(this.editInfo.email,this.editInfo.emailAuthCode).then((res)=>{
                                if(res.result_code===201){
                                    this.$message({showClose: true,message: '解绑成功',type: 'success'})
                                    this.$store.commit("updateEmail",'')
                                    this.userInfo.email=''
                                    this.editInfo.email=''
                                    this.editInfo.emailAuthCode=''  //验证码赋空
                                    this.emailExist=0;          //不存在邮箱了
                                    this.editEmailDialog=false  //关闭弹框
                                    this.emailAuthCodeTime=120  //重新设置验证码获取时间
                                }else{
                                    this.$message({showClose: true,message: '解绑失败',type: 'error'})
                                }
                            })
                        }else{
                            addEmail(this.editInfo.email,this.editInfo.emailAuthCode).then((res)=>{
                                if(res.result_code===201){
                                    this.$message({showClose: true,message: '绑定成功',type: 'success'})
                                    this.$store.commit("updateEmail",this.editInfo.email)
                                    this.editInfo.emailAuthCode=''  //验证码赋空
                                    this.emailExist=1;
                                    this.editEmailDialog=false  //关闭弹框
                                    this.emailAuthCodeTime=120  //重新设置验证码获取时间
                                }else{
                                    this.$message({showClose: true,message: '绑定失败,该邮箱可能已经绑定',type: 'error'})
                                }
                            })
                        }
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
            },


        },
        created() {
            this.userInfo=this.$store.getters.getUserInfo
            this.editInfo.phone=this.userInfo.phone
            this.editInfo.email=this.userInfo.email
            if(this.userInfo.areaProvince!==''&&this.userInfo.areaProvince!==null) {
                this.editInfo.areaSelect=[]
                this.editInfo.areaSelect.push(TextToCode[this.userInfo.areaProvince].code)
                console.log(this.editInfo.areaSelect);
                this.editInfo.areaSelect.push(TextToCode[this.userInfo.areaProvince][this.userInfo.areaCity].code)
                this.editInfo.areaSelect.push(TextToCode[this.userInfo.areaProvince][this.userInfo.areaCity][this.userInfo.areaCounty].code)
                console.log(this.editInfo.areaSelect);

            }
            console.log(this.editInfo.areaSelect);
            console.log("获取"+this.$store.getters.getUserInfo);
            console.log("用户信息"+this.userInfo);
        }
    }
</script>
<style lang="less">
    .headerDialog .el-dialog{
        border-radius: 30px !important;
        border: 2px solid white;
        background-image: url("~assets/img/userinfo.jpg") !important;
    }

    .headerDialog .bigDialog{
        background-size: 100% 100% !important;
        background-repeat: no-repeat !important;
        box-shadow: 2px 2px 1000px !important;
        margin-top: 80px!important;
    }

    .headerDialog {
        .snoDialog,.nameDialog,.phoneDialog,.emailDialog{
            margin-top: 15% !important;
            transform: translateZ(100px);
        }
        .edit-hometown{
            .el-input__inner {
                border: 1px solid white !important;
                border-radius: 30px;
                background-color: transparent !important;
                color: white;
                text-shadow: 1px 0 20px;
            }
        }
    }



    .editNameForm,.editSnoForm,.editPhoneForm,.editEmailForm{
        .el-input__inner {
            border: 1px solid white;
            border-radius: 40px;
        }
    }

    .authCodeButton{
        .el-button {
            border: 1px solid white !important;
            background-color: transparent;
            border-radius: 20px !important;
        }
    }



    .userForm .avatar-uploader  {
        border: 1px dashed #d9d9d9;
        border-radius: 65px;
        cursor: pointer;
        position: relative;

        overflow: hidden;
        width: 65px !important;
        height: 65px !important;
        z-index: 1;
        .avatar-uploader-icon {
            font-size: 28px;
            color: #8c939d;
            width: 65px !important;
            height: 65px !important;
            line-height: 60px !important;
            text-align: center;
        }
        .avatar {
            width: 65px !important;
            height: 65px !important;
            display: block;
        }

    }


    .userForm .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }








</style>


<style scoped lang="less">





    .title{
        text-align: center;
        font-size: 25px;
        font-family: "Comic Sans MS",serif;
        color: white;
        font-weight: bolder;
        text-shadow: 2px 1px 20px;
    }


    .el-row{
        margin-top: 20px;
        font-size: 17px;
        font-family: "Comic Sans MS",serif;
        color: white;
        text-shadow: 1px 0 20px;
    }

    .el-col span:first-of-type{
        margin-left: 100px;
    }

    .dialog-footer .el-button{
        background-color: transparent;
        border-radius: 20px;
        color: white;
    }

    .upload{
        line-height: 65px;
    }








</style>