<template>
    <div class="asidemenu" @mouseover="isCollapse=false" @mouseleave="isCollapse=true">
        <el-menu
                text-color="#e2e1e4"
                background-color="transparent"
                active-text-color="#f07c82"
                unique-opened
                :collapse="isCollapse"
                :collapse-transition="false"
                router>
            <el-submenu :index="submenu.id+''" v-for="submenu in submenus" :key="submenu.id" style="background-color: transparent">
                <template slot="title">
                    <i :class="submenu.icon"></i>
                    <span>{{submenu.name}}</span>
                </template>
                <el-menu-item :index="item.index+''" v-for="item in submenu.children" :key="item.id">
                    <template slot="title">
                        <!--  图标-->
                        <i :class="item.icon"></i>
                        <!-- 文本-->
                        <span>{{item.name}}</span>
                    </template>
                </el-menu-item>
            </el-submenu>
        </el-menu>
    </div>
</template>

<script>
    import {queryAllSubjects} from "network/subjects/subjectHttp";


    export default {
        name: "AsideMenu",
        data(){
            return {
                isCollapse: true,
                submenus:[
                    {id: 1,icon: 'iconfont icon-icon_xinyong_xianxing_jijin-',name: '试卷选择',children: [
                        //示例信息，会被查询到的信息替代
                        {id: 1,icon: 'iconfont el-icon-files',name: '考试中心',index: '/home/exam/examCenter'},
                        {id: 2,icon: 'iconfont el-icon-collection-tag',name: '我的考试',index: '/home/exam/examSubscribe'},
                    ],},
                    {id: 2,icon: 'iconfont icon-chengji-',name: '成绩查询',children: [{id: 222,icon: 'iconfont icon-chengji- ',name: '成绩查询',index: '/home/grade'}]},
                    {id: 3,icon: 'iconfont icon-yonghu',name: '用户管理',children: [{id: 333,icon: 'iconfont icon-yonghu',name: '用户管理',index: '/home/userManage'}]},
                    {id: 4,icon: 'iconfont icon-kaoshengguanli',name: '考生管理',children: [{id: 444,icon: 'iconfont icon-kaoshengguanli',name: '考生管理',index: '/home/examineeManage'}]},
                    {id: 5,icon: 'iconfont icon-kemuguanli-',name: '学科管理',children: [{id: 555,icon: 'iconfont icon-kemuguanli-',name: '学科管理',index: '/home/subjectManage'}]},
                    {id: 6,icon: 'iconfont icon-shijuan',name: '试卷管理',children: [
                        {id: 666,icon: 'iconfont icon-plus-itembank',name: '试题管理',index: '/home/topicManage'},
                        {id: 667,icon: 'iconfont icon-shijuanguanli',name: '试卷管理',index: '/home/testManage'},
                        {id: 668,icon: 'iconfont icon-kaoshiguanli-',name: '考试管理',index: '/home/examManage'},
                        {id: 670,icon: 'iconfont icon-datijilu',name: '答题管理',index: '/home/answerManage'},
                    ]},
                    {id: 7,icon: 'iconfont icon-chengjitongji',name: '信息统计',children: [
                        {id: 888,icon: 'iconfont el-icon-pie-chart',name: '考试统计',index: '/home/statistics/score/one'},
                        {id: 999,icon: 'iconfont el-icon-s-custom',name: '用户统计',index: '/home/statistics/user'},
                        {id: 777,icon: 'iconfont icon-chengjitongji',name: '信息统计',index: '/home/infoStatistics/score/more'},]
                    },
                    {id: 8,icon: 'iconfont icon-rizhi',name: '日志管理',children: [{id: 888,icon: 'iconfont icon-rizhi',name: '日志管理',index: '/home/logManage'}]},
                    {id: 9,icon: 'iconfont icon-xitong',name: '系统设置',children: [{id: 999,icon: 'iconfont icon-xitong',name: '系统设置',index: '/home/systemSetting'}]},


                ]
            }
        },
        created() {
        },
    }
</script>
<style lang="less">
    .asidemenu{
        position: relative;
    }
    .el-menu{
        position: relative;
        z-index: 2;
        border-right: 0!important;
        background-color: transparent !important;
        max-height: 700px !important;
        >.el-submenu{
            background-color: transparent !important;
        }
    }
</style>

<style scoped>

    .iconfont{
        margin-right: 40px;
    }

</style>