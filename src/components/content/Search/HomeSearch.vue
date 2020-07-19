<template>
    <div class="home-search">
        <img class="search-image" src="~assets/img/search.png"/>


        <el-row>
            <el-input  placeholder="请输入检索内容" v-model="search" class="input-with-select"
                       @keydown.enter.native="searchUser">
            </el-input>
        </el-row>


    </div>
</template>

<script>
    export default {
        name: "HomeSearch",
        data(){
            return {
                search: ''
            }
        },
        methods: {
            searchUser(){
               this.$router.push({
                   path: '/home/search/userInfo',
                   query: {
                       search: this.search
                   }

               })
            }
        }
    }
</script>

<style lang="less">


    .home-search {
        margin-top: 100px;
        .el-input__inner {
            border-radius: 100px !important;
            background-color: rgba(0,0,0,0.4);
            border-color: green ;
            color: white!important;
            text-align: center!important;
            height: 50px !important;
        }


        .input-with-select{
            position: absolute;
            z-index: 1;
            width: 550px;
            transform: translateX(420px);
            color: white!important;
            text-align: center;
        }

        .search-image {
            height: 300px;
            width: 400px;
            transform: translateX(500px);
        }

        .iconfont{
            color: #eea2a4;
            font-size: 25px!important;
        }

        input::-webkit-input-placeholder {
            color: white;
        }
        input::-moz-input-placeholder {
            color: white;
        }
        input::-ms-input-placeholder {
            color: white;
        }
        .el-input__inner:hover{
            animation: search_size_hover;
            animation-duration: 0.2s;
            animation-timing-function: linear;
            animation-fill-mode: forwards;
            height: 60px!important;
        }

        .input-with-select-blur{
            animation: search_size_blur;
            animation-duration: 0.3s;
            animation-timing-function: linear;
            animation-fill-mode: forwards;
        }

    }

    @keyframes  search_size_hover {
        0%{

        }

        100%{
            margin-left: -73px;
            width: 700px;
            margin-top: 10px;
            border: 1px solid blue;
        }
    }

    @keyframes  search_size_blur {
        0%{

        }

        100%{
            margin-left: 50px;
            width: 400px;
            margin-top: -10px;
            height: 70px!important;
        }
    }



</style>