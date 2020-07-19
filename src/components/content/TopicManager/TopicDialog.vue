<template>
    <div class="topicDialog">
        <el-dialog
                :visible="isTopicShow"
                width="70%"
                show-close
                @close="closeDialog"
                :modal-append-to-body='false'
                :modal="false"
                class="topic_dialog">
            <el-row justify="space-between" type="flex" >
                <el-col :span="5" :offset="1">
                    <el-button type="primary" @click="addDialogClick" round>添加试题</el-button>
                </el-col>
                <el-col :span="5" >
                    <el-tooltip class="item" effect="dark" :enterable="false" content="根据类型进行筛选试题" placement="top-start">
                        <el-dropdown @command="handleTypeCommand">
                            <el-button type="primary">
                                {{search.type==null?"类型":(search.type==='0'?"选择题":"判断题")}}<i class="el-icon-arrow-down el-icon--right"></i>
                            </el-button>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item command="-1" icon="el-icon-orange">全部</el-dropdown-item>
                                <el-dropdown-item command="0" icon="el-icon-watermelon">选择题</el-dropdown-item>
                                <el-dropdown-item command="1" icon="el-icon-apple">判断题</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </el-tooltip>
                </el-col>
                <el-col>
                    <el-tooltip class="item" effect="dark" :enterable="false" content="根据学科进行筛选试题" placement="top-start">
                        <el-select v-model="search.subject" filterable placeholder="请选择学科类型" clearable >
                            <el-option-group label="热门学科" :key="0">
                                <el-option
                                        v-for="item in hotSujects"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                </el-option>
                            </el-option-group>
                            <el-option-group label="学科" :key="1">
                                <el-option
                                        v-for="item in subjects"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                </el-option>
                            </el-option-group>
                        </el-select>
                    </el-tooltip>
                </el-col>
                <el-col :span="8" >
                    <el-input  placeholder="请输入检索内容" v-model="search.key" class="input-with-select" clearable prefix-icon="iconfont icon-sousuo1">
                    </el-input>
                </el-col>
            </el-row>

            <!--表格-->
            <el-table :data="topics" :stripe="true"  border max-height="550"   style="width: 100%" @sort-change="sortChange" :sort-orders="['ascending', 'descending']"
                      cell-class-name="cell" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="70"></el-table-column>
                <el-table-column width="100" type="index"></el-table-column>
                <el-table-column prop="id" label="id" width="280" sortable="custom"></el-table-column>

                <el-table-column prop="type" label="类型" width="100"></el-table-column>
                <el-table-column prop="subject" label="学科" :width="150"></el-table-column>
                <el-table-column  prop="name" label="题目" width="400" ></el-table-column>
                <el-table-column  label="选项" width="250" class="selectForm" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <li v-if="scope.row.typeNum===0" v-for="(value,key,index) in scope.row.select" :key="key">{{key|filterSelect}}:  {{value}}</li>
                    </template>
                </el-table-column>
                <el-table-column  label="答案" width="100" >
                    <template slot-scope="scope">
                        <span v-if="scope.row.type==='选择题'">{{scope.row.answer|filterSelect}}</span>
                        <span v-if="scope.row.type==='判断题'">{{scope.row.answer|filterJudge}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="note" label="备注" width="250" show-overflow-tooltip></el-table-column>
                <el-table-column label="图片" width="100" >
                    <template slot-scope="scope">
                        <div class="topicImage" :style="{backgroundImage: 'url('+scope.row.image+')'}"></div>
                    </template>
                </el-table-column>
                <el-table-column prop="created" :formatter="dateFormat" label="创建时间" width="250" sortable="custom"></el-table-column>


                <el-table-column label="编辑" min-width="90" fixed="right">
                    <template slot-scope="scope">
                        <el-tooltip class="item" effect="dark" :enterable="false" content="编辑试题信息" placement="top-start">
                            <el-button  @click="editInfo(scope.row)" type="success" icon="el-icon-edit" circle class="edit"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>

                <el-table-column label="状态"  fixed="right" min-width="110">
                    <template slot-scope="scope">
                        <el-tooltip class="item" effect="dark" :enterable="false" :content="scope.row.deleted?'点击删除':'点击复原'" placement="top-start">
                            <el-switch v-model="scope.row.deleted" @change="topicStateChanged(scope.row)" :width="60"> </el-switch>
                        </el-tooltip>
                    </template>
                </el-table-column>

            </el-table>

            <!--分页行-->
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="search.page"
                    :page-sizes="[5,10,15,20]"
                    :page-size="totalPage"
                    layout="total,sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>

            <el-row justify="end" type="flex" >
                <el-col :offset="20">
                    <el-button type="primary" @click="addTopic" >添加题目</el-button>
                </el-col>
            </el-row>

            <!--增添对话框-->
            <topic :is-edit="false" :is-show="addDialogVisiable" @updateState="updateShow" width-d="50%"/>
            <!--编辑对话框-->
            <topic :is-edit="true" :is-show="editDialogVisiable" :topics="editRowInfo"  @updateState="updateShow" width-d="50%"/>
        </el-dialog>

    </div>
</template>

<script>
    import Topic from "./Topic";
    import utils from "utils/utils";
    import {queryAllTopics,deleteTopic} from "network/topic/TopicHttp";
    import {queryAllSubjects} from "network/subjects/subjectHttp";

    export default {
        name: "TopicDialog",
        props: {
            isTopicShow: {
                type: Boolean,
                default: false
            }
        },
        data(){
            return {
                addDialogVisiable: false,     //添加试题对话框
                editDialogVisiable: false,    //修改试题信息对话框
                 search: {
                            key: '',    //关键字
                            page: 1,    //页数
                            row: 5,      //数据行数
                            type: null,       //试题类型
                            subject: null,    //试题的学科类型
                            orderField: '',   //排序的字段
                            order: 0          //排序0:升序，1：降序
                 },
                topics: [
                    {
                        id: '',     //id
                        typeNum: null, //试题类型标识0:选择题，1：判断题
                        type: '',   //试题类型
                        subjectNum: null, //学科类型id
                        subject: '', //学科类型
                        name: '',   //名称
                        select: {}, //选择题的选项
                        answer: '', //答案
                        note: '',   //备注信息
                        image: '',   //图片地址
                        created: '',//创建时间
                        deleted: true,//是否删除
                    }
                ],
                total: 0,
                totalPage: 0,
                isEdit: false,        //判断是修改还是添加对话框
                editRowInfo: {},       //要修改的试题信息
                subjects: [],
                hotSujects: [],   //热门学科
                selectTopic: []  //选择的试题
            }
        },
        methods: {
            //查询所有试题信息
            queryTopic(){
                queryAllTopics(this.search).then((res)=>{
                    if(res.result_code===250) {
                        this.topics = res.topics.items
                        this.totalPage = res.topics.totalPage
                        this.total = res.topics.total
                        for(let i=0;i<this.topics.length;i++) {
                            this.topics[i].deleted=!this.topics[i].deleted
                        }
                        console.log(res);
                    }else{
                        this.$message.warning("您不是管理员")
                    }
                })
            },
            //分页的页面行数大小改变
            handleSizeChange(newSize){
                this.search.row=newSize
                this.queryTopic()
            },
            //分页的页面位置改变
            handleCurrentChange(newPage){
                this.search.page=newPage
                this.queryTopic()
            },
            //删除和重新添加试题
            topicStateChanged(row){
                if(row.deleted){
                    //重启试题
                    deleteTopic(row.id).then((res)=>{
                        if (res.result_code === 250) {
                            this.$message.success("重启成功")
                            this.queryTopic()
                        } else {
                            this.$message.error("重启失败")
                        }
                    })

                }else {
                    //删除试题
                    deleteTopic(row.id).then((res) => {
                        if (res.result_code === 250) {
                            this.$message.success("删除成功")
                            this.queryTopic()
                        } else {
                            this.$message.error("删除失败")
                        }
                    })
                }
            },
            //点击增加试题按钮，打开对话框
            addDialogClick(){
                this.isEdit=false
                this.addDialogVisiable=true
            },
            //点击修改试题按钮，打开对话框
            editInfo(row){
                this.editDialogVisiable=true
                this.editRowInfo=row
            },
            //修改之后，关闭对话框,并且重新获取数据展示
            updateShow(){
                this.addDialogVisiable=false
                this.editDialogVisiable=false
                this.queryTopic()
            },
            //日期的转换
            dateFormat(row, column, cellValue, index){
                return utils.formatDate(row.created)
            },
            //排序发生改变
            sortChange( column, prop, order){
                this.$set(this.search,"orderField",column.prop)
                if(column.order==='ascending'){
                    this.search.order=0
                }else if(column.order==='descending'){
                    this.search.order=1
                }
                console.log("排序:"+column + '-' + column.prop + '-' + column.order+'-'+prop+'-'+order)
            },
            //按类型查询
            handleTypeCommand(command){
                if(command==='-1'){
                    this.search.type=null
                }else {
                    this.search.type = command
                }
            },
            //查询所有的学科信息
            querySubjects(){
                queryAllSubjects().then((res)=>{
                    if(res.result_code===200){
                        this.subjects=res.subjects
                        this.hotSujects=[this.subjects[0],this.subjects[2]]
                    }
                })
            },
            //按学科查询
            handleSubjectCommand(command){
                if(command==='-1'){
                    this.search.subject=null
                }else {
                    this.search.subject = command
                }
            },
            closeDialog(){
                this.$emit("updateState",'0')
            },
            handleSelectionChange(val){
                for(let i=0;i<val.length;i++){
                    if(!val[i].deleted){
                        this.$message.warning(val[i].id+"已经被删除，请重新选择或重启该题目");
                        val.splice(i,1)
                    }
                }
                this.selectTopic = val
                console.log(val);
            },
            addTopic(){
                this.$emit("updateState",this.selectTopic)
            }
        },
        computed: {

        },
        watch: {
            'search': {
                deep: true,
                immediate: true,
                handler(val,val2){
                    this.queryTopic()
                }
            }
        },
        filters: {
            filterSelect(value){
                return String.fromCharCode(parseInt(value)+65)
            },
            filterJudge(value){
                return value==='0'?"对":"错"
            }
        },
        created() {
            this.queryTopic()
            this.querySubjects()
        },
        components: {
            Topic
        },


    }
</script>
<style lang="less">
    .topicDialog {
        .el-dialog {
            transform: translateY(-40px);
            border-radius: 10px !important;
            border: 2px solid white;
            background-image: url("~assets/img/topicDialog.png") !important;
            background-repeat: no-repeat;
            background-size: 100% 100%;
            height: 800px !important;
        }
    }

    .el-input__inner{
        border-radius: 100px !important;
    }

    .input-with-select{
        height: 50px;
    }

    .el-table,.el-table-column{
        background-color: rgba(0,0,0,0.5) !important;
        margin-top: 20px;
    }

    .el-table,
    .el-table__expanded-cell {
        background-color: transparent !important;
        font-weight: bolder;
    }
    /*透明化行、单元格*/
    .el-table th,
    .el-table tr,
    .el-table td {
        background-color: rgba(0,0,0,0.3) !important;
        text-align: center!important;
        color: white !important;
        font-size: 16px !important;
    }

    .el-pagination{
        position: relative;
        text-align: center;
        margin-top: 10px;
    }

    .cell{
        max-height: 100px;
    }

    .el-dropdown {

    .el-dropdown-menu {
        height: 50px !important;
        overflow: hidden !important;
    }

    }

    .topic_dialog {
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

</style>

<style scoped>



    .el-row{
        transform: translateY(10px);
    }

    .topicImage{
        width: 100px !important;
        height: 100px !important;
        background-repeat: no-repeat;
        background-size: 100% 100%;
    }

</style>