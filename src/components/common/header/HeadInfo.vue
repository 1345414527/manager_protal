<template>
    <div class="head">
        <a @click="changeInfo" ><div :class="['icon']" :style="{backgroundImage: ($store.state.user.image?'url('+$store.state.user.image+')':'url('+defaultImage+')')}"></div></a>
        <span class="name">{{''||$store.state.user.name}}</span>
    </div>
</template>

<script>
    export default {
        name: "headInfo",
        data(){
            return {
                defaultImage: require('assets/img/head.jpg')
            }
        },
        computed: {
        },
        methods: {
            //修改信息点击事件
            changeInfo(){
                this.$emit("changeInfo")
            }
        }
    }
</script>

<style scoped>

    .head{
        text-align: center;
        line-height: 65px;
    }

    .icon{
        float: left;
        height: 65px;
        width: 65px;
        border-radius: 65px;
        background-color: #c81623;
        margin-left: 45%;
        vertical-align: bottom;
        background-repeat: no-repeat;
        background-size: 65px 65px;
        cursor: pointer;
    }

    .name{
        float: left;
        font-size: 20px;
        font-family:  "Comic Sans MS",serif ;
        margin-left: 10px;
        color:#ea517f;
        font-weight:bold;
        text-shadow:0 -3px 2px #ff3,
        1px -5px 3px #fd3,
        -1px -6px 5px #f80,
        1px -9px 9px #f20;
        font-style: italic;
    }

</style>