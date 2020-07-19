<template>
    <div class="search" >
            <el-input  placeholder="请输入检索内容" v-model="search" class="input-with-select"
                       @keydown.enter.native="searchUser" prefix-icon="iconfont icon-sousuo1"
                       v-if="display">
            </el-input>
    </div>
</template>

<script>
    import SearchMessage from "../message/SearchMessage";

    export default {
        name: "Search",
        data(){
            return {
                search: ''
            }
        },
        methods: {
            //检索用户
            searchUser(){
                this.$router.push({
                    path: '/home/search/userInfo',
                    query: {
                        search: this.search
                    }
                })
            }
        },
        computed: {
            display(){
                return this.$route.path!=='/home/user/search'
            }
        }
    }
</script>

<style lang="less">
    .search{
        margin-top: 10px;
        .el-input__inner{
            width: 90px;
            border-radius: 13em;
            transition: all 0.5s ease 0s;
        }


        .el-input__inner:hover{
            width: 500px;
            box-shadow: 0 0 5px rgba(109,207,246,.5);
        }





        .icon-sousuo1{
            font-size: 25px !important;
        }
    }

</style>