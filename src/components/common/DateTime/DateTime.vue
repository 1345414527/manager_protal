<template>
    <div class="dateTime">
        <el-dialog
                :visible.sync="showDateTimeDialog"
                width="30%"
                show-close
                close-on-press-escape
                @close="closeDialog"
                :modal-append-to-body='false'
                :modal="false"
                custom-class="dateTimeDialog" >

            <el-row>
                <div class="block">
                    <span class="demonstration" >试卷开启时间</span>
                    <el-date-picker
                            v-model="rangeTime"
                            type="datetimerange"
                            :picker-options="pickerOptions"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            align="right">
                    </el-date-picker>
                </div>
            </el-row>
            <el-row  type="flex" justify="center"  style="margin-top: 60px">
                <el-col :offset="7">  <el-button type="primary" plain @click="closeDialog">取消</el-button></el-col>
                <el-col >  <el-button type="primary" plain @click="closeDialogByArgs">确认</el-button></el-col>
            </el-row>

        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "DateTime",
        props: {
            showDateTimeDialog: {
                type: Boolean,
                default: false,
            }
        },
        data(){
            return {
                rangeTime: null,
                pickerOptions: {
                    shortcuts: [{
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                },

            }
        },
        methods: {
            closeDialog(){
                this.$emit("closeTimeDialog",'0','0');
                if(this.rangeTime!=null) {
                    this.rangeTime.splice(0, 2)
                }
            },
            closeDialogByArgs(){
                this.$emit("closeTimeDialog",this.rangeTime[0],this.rangeTime[1])
                if(this.rangeTime!=null) {
                    this.rangeTime.splice(0, 2)
                }
            }
        }

    }
</script>

<style  lang="less">

    .dateTime{
        .dateTimeDialog {
            margin-top: 15% !important;
            transform: translateZ(100px);
            border-radius: 20px !important;
            border: 2px solid white;
            background-image: url("~assets/img/userinfo.jpg") !important;
            box-shadow: 2px 2px 1000px !important;
            cursor: pointer;
        }
        .block{
            margin-top: 20px;
        }
        .demonstration{
            margin-right: 20px;
            color:white;
            font-size: 17px;
        }


    }



</style>