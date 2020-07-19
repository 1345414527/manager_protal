<template>
    <div class="subject">
        <!--修改邮箱-->
        <el-dialog
                :visible.sync="isShow"
                width="20%"
                show-close
                @close="closeDialog"
                :modal-append-to-body='false'>
            <el-form :model="subjectInfo" :rules="rules" status-icon ref="updateEmailFormRef" label-width="0" class="editEmailForm" size="medium ">

                <el-row >
                    <el-form-item  prop="name">
                        <el-col>
                            <el-input v-if="!isEdit" prefix-icon="iconfont icon-xuexiao_kemu" v-model="subjectInfo.name" placeholder="请输入学科名字"
                                      autofocus ></el-input>
                            <el-input v-else prefix-icon="iconfont icon-xuexiao_kemu" v-model="subjects.name"
                                      autofocus ></el-input>
                        </el-col>
                    </el-form-item>
                </el-row>

                <el-row>
                    <el-form-item  prop="note">
                        <el-input v-if="isEdit" type="textarea" autosize  prefix-icon="el-icon-key" v-model="subjects.note"
                                  autofocus  >
                        </el-input>
                        <el-input v-else type="textarea" autosize  prefix-icon="el-icon-key" v-model="subjectInfo.note" placeholder="请输入备注信息"
                                  autofocus  >
                        </el-input>
                    </el-form-item>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="closeDialog" round>取 消</el-button>
                <el-button type="primary" @click="commit" round>确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import {insertSubject,updateSubject} from "network/subjects/subjectHttp";

    export default {
        name: "Subject",
        props: {
            isEdit: {
                type: Boolean,
                require: true,
            },
            subjects: {
                type: Object,
                default(){
                    return {
                        id:   null,
                        name: '名称',
                        note: '备注'
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
                subjectInfo:{
                    name: '',    //名臣
                    note: ''   //备注
                },
                rules: {
                    name: [
                        {min: 2, max: 20, message: '长度要小于 20 个字符,并且不少于2个字符', trigger: 'blur'}
                    ],
                    note: [
                        {min: 0, max: 100, message: '长度要小于 100 个字符', trigger: 'blur'}
                    ],
                },
            }
        },
        methods: {
            commit(){
                this.$refs.updateEmailFormRef.validate((valid)=> {
                    if (valid) {
                        this.$confirm('确认提交吗？').then(()=> {
                            if (this.isEdit) {
                                //修改信息
                                updateSubject(this.subjects).then((res)=>{
                                    if(res.result_code===202){
                                        this.$message.success("修改学科成功")
                                        this.closeDialog()
                                    }else{
                                        this.$message.error("修改学科失败，请稍后再试")
                                    }
                                }).catch((err)=>{
                                    this.$message.error("修改学科失败，请稍后再试")
                                })
                            }else{
                                //新增信息
                                insertSubject(this.subjectInfo).then((res)=>{
                                    if(res.result_code===201){
                                        this.$message.success("新增学科成功")
                                        this.closeDialog()
                                    }else{
                                        this.$message.error("新增学科失败，请稍后再试")
                                    }
                                }).catch((err)=>{
                                    this.$message.error("新增学科失败，请稍后再试")
                                })
                            }
                        }).catch(_ => {});
                    }else{
                        this.$message.error("请输入正确的信息")
                    }
                })
            },
            closeDialog(){
                this.isShow=false
                this.subjectInfo.name=''
                this.subjectInfo.note=''
                this.$emit("updateState")
            }
        },
        created(){
            console.log(this.isEdit);
        }
    }
</script>

<style lang="less">
    .el-dialog{
        border-radius: 30px !important;
        border: 2px solid white;
        background-image: url("~assets/img/userinfo.jpg") !important;
    }


    .dialog-footer {
        margin-bottom: 50px !important;
    }

    .el-row:first-of-type{
        margin-bottom: 20px;
    }


</style>

<style scoped lang="less">



</style>