<template>
    <div class="header">
        <el-row >
            <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8" ><head-info @changeInfo="changeInfo"/></el-col>
            <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8" :push="2"><search/></el-col>
            <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8"><logout/></el-col>
        </el-row>



        <HeaderDialog :showDialog="showDialog" @closeDialog="closeDialog"/>
    </div>
</template>

<script>
    import HeadInfo from 'components/common/header/HeadInfo'
    import Logout from "components/common/header/Logout";
    import HeaderDialog from "components/content/header/HeaderDialog";
    import Search from "components/common/header/Search";

    export default {
        name: "Header",
        data(){
            return {
              showDialog: false
            }
        },
        components: {
            HeaderDialog,
            HeadInfo,
            Logout,
            Search
        },
        methods: {
            changeInfo(){
                this.showDialog=true
            },
            closeDialog(){
                this.showDialog=false
            },
        }
    }
</script>

<style lang="less">






</style>