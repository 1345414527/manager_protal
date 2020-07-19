<template>
    <div class="topic">
        <!--修改邮箱-->
        <!--<el-scrollbar style="height:500px">-->
        <el-dialog
                :visible="isShow"
                :width="widthD"
                show-close
                @close="closeDialog"
                :modal-append-to-body='false'
                class="pub_dialog">

            <el-alert
                    title="类型,学科,描述，答案是必填项,选择题必须写选项"
                    type="warning" center
                    >
            </el-alert>
            <el-form :model="topicInfo" :rules="rules" status-icon ref="updateTopicFormRef" label-width="0" class="editEmailForm" size="medium ">

                <!--类型选择-->
                <el-row >
                    <el-col :xs="2" :sm="2" :md="2" :lg="2" :xl="2"><span ></span></el-col>
                    <el-col :xs="9" :sm="9" :md="9" :lg="9" :xl="9"  >
                        <el-form-item prop="type">
                                <el-select v-if="isEdit" v-model="topics.typeNum" clearable placeholder="请选择类型" @change="output">
                                    <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                </el-select>
                                <el-select v-else v-model="topicInfo.type" clearable placeholder="请选择类型" @change="output">
                                    <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="2" :sm="2" :md="2" :lg="2" :xl="2"><span ></span></el-col>
                    <el-col :xs="9" :sm="9" :md="9" :lg="9" :xl="9"  >
                        <el-form-item prop="subject">
                            <el-select v-if="isEdit" v-model="topics.subjectNum" clearable placeholder="请选择学科" @change="output">
                                <el-option v-for="item in subjects" :key="item.id" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                            <el-select v-else v-model="topicInfo.subject" clearable placeholder="请选择学科" @change="output">
                                <el-option v-for="item in subjects" :key="item.id" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="2" :sm="2" :md="2" :lg="2" :xl="2"></el-col>
                </el-row>

                <!--题目-->

                <el-form-item  prop="name" >
                    <el-row >
                        <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4"  ><p class="colLabel">*题目</p></el-col>
                        <el-col :xs="18" :sm="18" :md="18" :lg="18" :xl="18"  >
                            <el-input type="textarea" v-if="!isEdit" prefix-icon="iconfont icon-xuexiao_kemu" v-model="topicInfo.name" placeholder="请输入题目信息"
                                      autofocus :rows="3"></el-input>
                            <el-input v-else type="textarea" prefix-icon="iconfont icon-xuexiao_kemu" v-model="topics.name" placeholder="请输入题目信息"
                                      autofocus :rows="5"></el-input>
                        </el-col>
                        <el-col :xs="2" :sm="2" :md="2" :lg="2" :xl="2"  ><span></span></el-col>
                    </el-row>
                </el-form-item>


                <!--选项-->
                <el-form-item  prop="select" v-if="topics.typeNum===0||topicInfo.type===0">
                    <el-row >
                        <!--A，B选项-->
                        <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4"  ><p class="colLabel">*选项</p></el-col>
                        <el-col :xs="1" :sm="1" :md="1" :lg="1" :xl="1"  ><p >A</p></el-col>
                        <el-col :xs="7" :sm="7" :md="7" :lg="7" :xl="7"  >
                            <el-input v-if="isEdit" type="textarea"   prefix-icon="el-icon-key" v-model.trim="topics.select[0]" placeholder="请输入A选项信息"
                                      autofocus :rows="2">
                            </el-input>
                            <el-input v-else  type="textarea" prefix-icon="el-icon-key" v-model.trim="topicInfo.select[0]" placeholder="请输入A选项信息"
                                      autofocus :rows="2">
                            </el-input>
                        </el-col>
                        <el-col :xs="2" :sm="2" :md="2" :lg="2" :xl="2"  ><span></span></el-col>
                        <el-col :xs="1" :sm="1" :md="1" :lg="1" :xl="1"  ><p>B</p></el-col>

                        <el-col :xs="7" :sm="7" :md="7" :lg="7" :xl="7"  >
                            <el-input v-if="isEdit" type="textarea"   prefix-icon="el-icon-key" v-model.trim="topics.select[1]"placeholder="请输入B选项信息"
                                      autofocus :rows="2">
                            </el-input>
                            <el-input v-else type="textarea"    prefix-icon="el-icon-key" v-model.trim="topicInfo.select[1]" placeholder="请输入B选项信息"
                                      autofocus :rows="2">
                            </el-input>
                        </el-col>
                        <el-col :xs="2" :sm="2" :md="2" :lg="2" :xl="2"  ><span></span></el-col>
                    </el-row>

                    <el-row >
                        <!--C，D选项-->
                        <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4"  ><span></span></el-col>
                        <el-col :xs="1" :sm="1" :md="1" :lg="1" :xl="1"  ><p >C</p></el-col>
                        <el-col :xs="7" :sm="7" :md="7" :lg="7" :xl="7"  >
                            <el-input v-if="isEdit" type="textarea"   prefix-icon="el-icon-key" v-model.trim="topics.select[2]"placeholder="请输入C选项信息"
                                      autofocus :rows="2">
                            </el-input>
                            <el-input v-else type="textarea"   prefix-icon="el-icon-key" v-model.trim="topicInfo.select[2]" placeholder="请输入C选项信息"
                                      autofocus :rows="2" >
                            </el-input>
                        </el-col>
                        <el-col :xs="2" :sm="2" :md="2" :lg="2" :xl="2"  ><span></span></el-col>
                        <el-col :xs="1" :sm="1" :md="1" :lg="1" :xl="1"  ><p>D</p></el-col>

                        <el-col :xs="7" :sm="7" :md="7" :lg="7" :xl="7"  >
                            <el-input v-if="isEdit" type="textarea"   prefix-icon="el-icon-key" v-model.trim="topics.select[3]" placeholder="请输入D选项信息"
                                      autofocus :rows="2">
                            </el-input>
                            <el-input v-else type="textarea"   prefix-icon="el-icon-key" v-model.trim="topicInfo.select[3]" placeholder="请输入D选项信息"
                                      autofocus :rows="2">
                            </el-input>
                        </el-col>
                        <el-col :xs="2" :sm="2" :md="2" :lg="2" :xl="2"  ><span></span></el-col>
                    </el-row>
                </el-form-item>

                <!--答案-->
                <el-form-item  prop="answer">
                    <!--选择题-->
                    <el-row v-if="topics.typeNum===0||topicInfo.type===0">
                        <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4"  ><p class="colLabel">*答案</p></el-col>
                        <el-col :xs="18" :sm="18" :md="18" :lg="18" :xl="18" v-if="isEdit" >
                            <el-radio v-model="topics.answer" label="0" border>A</el-radio>
                            <el-radio v-model="topics.answer" label="1" border>B</el-radio>
                            <el-radio v-model="topics.answer" label="2" border>C</el-radio>
                            <el-radio v-model="topics.answer" label="3" border>D</el-radio>
                        </el-col>
                        <el-col :xs="18" :sm="18" :md="18" :lg="18" :xl="18" v-else >
                            <el-radio v-model="topicInfo.answer" label="0" border>A</el-radio>
                            <el-radio v-model="topicInfo.answer" label="1" border>B</el-radio>
                            <el-radio v-model="topicInfo.answer" label="2" border>C</el-radio>
                            <el-radio v-model="topicInfo.answer" label="3" border>D</el-radio>
                        </el-col>
                        <el-col :xs="2" :sm="2" :md="2" :lg="2" :xl="2"  ><span></span></el-col>
                    </el-row>
                    <!--判断题-->
                    <el-row v-if="topics.typeNum===1||topicInfo.type===1">
                        <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4"  ><p class="colLabel">*答案</p></el-col>
                        <el-col :xs="18" :sm="18" :md="18" :lg="18" :xl="18" v-if="isEdit">
                            <el-radio v-model="topics.answer" label="0" border size="medium" ><i class="el-icon-check"></i></el-radio>
                            <el-radio v-model="topics.answer" label="1" border size="medium"><i class="el-icon-close"></i></el-radio>
                        </el-col>
                        <el-col :xs="18" :sm="18" :md="18" :lg="18" :xl="18" v-else>
                            <el-radio v-model="topicInfo.answer" label="0" border size="medium" fill="red"><i class="el-icon-check"></i></el-radio>
                            <el-radio v-model="topicInfo.answer" label="1" border size="medium"><i class="el-icon-close"></i></el-radio>
                        </el-col>
                        <el-col :xs="2" :sm="2" :md="2" :lg="2" :xl="2"  ><span></span></el-col>
                    </el-row>
                </el-form-item>


                <!--备注-->
                <el-row>
                    <el-form-item  prop="note">
                        <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4"  ><p class="colLabel">备注</p></el-col>
                        <el-col :xs="18" :sm="18" :md="18" :lg="18" :xl="18"  >
                            <el-input v-if="isEdit" type="textarea"   prefix-icon="el-icon-key" v-model="topics.note"
                                      autofocus :row="4">
                            </el-input>
                            <el-input v-else type="textarea"   prefix-icon="el-icon-key" v-model="topicInfo.note" placeholder="请输入备注信息"
                                      autofocus  :row="4">
                            </el-input>
                        </el-col>
                        <el-col :xs="2" :sm="2" :md="2" :lg="2" :xl="2"  ><span></span></el-col>
                    </el-form-item>
                </el-row>

                <!--图片-->
                <el-row class="upload">
                    <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4"  ><p class="colLabel">图片</p></el-col>
                    <el-col :xs="20" :sm="20" :md="20" :lg="20" :xl="20">
                        <el-upload
                                class="image-uploader"
                                :action="uploadUrl"
                                :show-file-list="false"
                                :on-success="handleImageSuccess"
                                :before-upload="beforeImageUpload"
                                :with-credentials="true"
                                :drag="true">
                            <img v-if="topics.image&&isEdit" :src="topics.image" class="avatar" >
                            <img v-if="topicInfo.image&&!isEdit" :src="topicInfo.image" class="avatar" >
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                    </el-col>
                </el-row>
            </el-form>
            <el-row type="flex" justify="center" class="footer">
                <el-button @click="closeDialog" round style="margin-right: 35px">取 消</el-button>
                <el-button type="primary" @click="commit" round>确 定</el-button>
            </el-row>

        </el-dialog>
        <!--</el-scrollbar>-->
    </div>
</template>

<script>
    import {queryAllSubjects} from "network/subjects/subjectHttp";
    import {insertTopic,updateTopic} from "network/topic/TopicHttp";

    export default {
        name: "Topic",
        props: {
            isEdit: {
                type: Boolean,
                require: true,
            },
            widthD: {
              type: String,
              default: '35%'
            },
            //传递过来的属性
            topics: {
                type: Object,
                default(){
                    return {
                        id:   null,
                        name: '名称',
                        note: '备注',
                        typeNum: null,
                        type: '',
                        subjectNum: null,
                        subject: '',
                        select: {},
                        answer: null,
                        image: '',
                        created: null,
                        deleted: null
                    }
                }
            },
            isShow: {
                type: Boolean,
                default: false
            }
        },
        data(){
            return {
                topicInfo:{
                    name: '',    //名臣
                    note: '',   //备注
                    type: null,
                    subject: null,
                    select: {0: '',1:'',2:'',3:''},
                    answer: null,
                    image: ''
                },
                typeOptions: [{value: 0,label: '选择题'},{value: 1,label:'判断题'}],  //试题类型选择0:选择器，1:判断题
                subjects: [],    //所有学科
                uploadUrl: 'http://api.codekiller.top/api/upload/image2', //图片上传地址
                rules: {
                    name: [
                        {min: 2, max: 100, message: '长度要小于 100 个字符,并且不少于2个字符', trigger: 'blur'}
                    ],
                    note: [
                        {min: 0, max: 100, message: '长度要小于 100 个字符', trigger: 'blur'}
                    ],
                },
            }
        },
        methods: {
            commit(){
                this.$refs.updateTopicFormRef.validate((valid)=> {
                    if (valid) {
                        this.$confirm('确认提交吗？').then(()=> {
                            if (this.isEdit) {
                                //修改信息
                                updateTopic({
                                    id: this.topics.id,name: this.topics.name,
                                    note: this.topics.note,type: this.topics.typeNum,
                                    subject: this.topics.subjectNum,select: this.topics.select,
                                    answer: this.topics.answer,image: this.topics.image,
                                    created: this.topics.created,deleted:this.topics.deleted
                                }).then((res)=>{
                                    if(res.result_code===250){
                                        this.$message.success("修改试题成功")
                                        this.closeDialog()
                                    }else{
                                        this.$message.error("修改试题失败，请检查信息是否正确")
                                    }
                                }).catch((err)=>{
                                    this.$message.error("修改试题失败，请检查信息是否正确")
                                })
                            }else{
                                //新增信息
                                insertTopic(this.topicInfo).then((res)=>{
                                    if(res.result_code===250){
                                        this.$message.success("新增试题成功")
                                        this.closeDialog()
                                    }else{
                                        this.$message.error("新增试题失败，请检查信息是否正确")
                                    }
                                }).catch((err)=>{
                                    this.$message.error("新增试题失败，请检查信息是否正确")
                                })
                            }
                        }).catch((err)=> {})
                    }else{
                        this.$message.error("请输入正确的信息")
                    }
                })
            },
            closeDialog(){
                this.topicInfo.name=''
                this.topicInfo.note=''
                this.topicInfo.type=null
                this.topicInfo.subject=null
                this.topicInfo.select={0: '',1:'',2:'',3:''}
                this.topicInfo.answer=null
                this.topicInfo.image=''
                this.$emit("updateState")
            },
            querySubjects(){
                queryAllSubjects().then((res)=>{
                    if(res.result_code===200){
                        this.subjects=res.subjects
                    }
                })
            },
            output(value){
                console.log("当前的值" + value);
                console.log(this.topics);
                console.log(this.topicInfo);
            },
            //在头像上传之前
            beforeImageUpload(file) {
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
            //头像上传成功
            handleImageSuccess(res, file) {
                console.log(res);
                if(this.isEdit) {
                    this.topics.image = res.image
                }else{
                    this.topicInfo.image=res.image
                }
                console.log("图片地址"+this.userInfo.image);
            },
        },
        created(){
            this.querySubjects()
            console.log(this.isEdit);
        },

    }
</script>

<style lang="less">
    .topic {
        .el-dialog {
            transform: translateY(-40px);
            border-radius: 30px !important;
            border: 2px solid white;
            background-image: url("~assets/img/topic.png") !important;
            background-repeat: no-repeat;
            background-size: 100% 100%;
        }
    }


    .dialog-footer {
        margin-bottom: 50px !important;
    }

    .el-row:first-of-type{
        margin-bottom: 20px;
    }

    .el-textarea .el-textarea__inner{ // 然后找到对应的类名，在这里将拉伸去掉即可
        resize: none;
    }

    .el-radio{
        color: white;
    }

    .pub_dialog {
        display: flex;
        justify-content: center;
        align-items: Center;
        overflow: hidden;
        .el-dialog {
            margin: 0 auto !important;
            height: 80%;
            overflow: hidden;
            .el-dialog__body {
                position: absolute;
                left: 0;
                top: 54px;
                bottom: 0;
                right: 0;
                padding: 0;
                z-index: 1;
                overflow: hidden;
                overflow-y: auto;
            }
        }
    }

    .el-alert{
        margin-bottom: 50px;
        position: sticky;
        top: -40px;
    }

    .pub_dialog .image-uploader  {
        border: 1px dashed #d9d9d9;
        cursor: pointer;
        position: relative;
        width: 360px !important;
        height: 170px !important;
        z-index: 1;
        margin-left: 5%;
        .avatar-uploader-icon {
            font-size: 28px;
            color: #8c939d;
            width: 360px !important;
            height: 200px !important;
            line-height: 170px !important;
            text-align: center;
        }
        .avatar {
            width: 360px !important;
            height: 200px !important;
            display: block;
        }
    }


</style>

<style scoped lang="less">

    .topic{
        position: relative;
        top: 30px;
    }

    .el-row{
        margin-top: 10px;
        font-size: 17px;
        font-family: "Comic Sans MS",serif;
        color: white;
        text-shadow: 1px 0 20px;
    }

    .el-col span:first-of-type{
        margin-left: 100px;
    }

    .colLabel{
        text-align: center;
        font-size: 18px;
    }

    .footer{
        margin-top: 50px;
        margin-bottom: 40px;
    }








</style>