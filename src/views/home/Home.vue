<template>
    <div class="home">




        <el-container>
            <!--头部区域-->
            <el-header>
                <Header/>
            </el-header>
            <!--主区域-->
            <el-container>
                <!--特效区域-->
                <vue-particles
                        color="#fff" :particleOpacity="0.7" :particlesNumber="60" shapeType="circle" :particleSize="4" linesColor="#fff" :linesWidth="1" :lineLinked="true"
                        :lineOpacity="0.4" :linesDistance="150" :moveSpeed="2" :hoverEffect="true" hoverMode="grab" :clickEffect="true" clickMode="push" class="atom">
                </vue-particles>
                <!--侧边栏-->
                <el-aside width="200px">
                    <aside-menu/>
                </el-aside>
                <!--主区域-->
                <el-container>
                    <el-main>
                        <router-view/>
                    </el-main>
                </el-container>
            </el-container>
        </el-container>
    </div>
</template>

<script>
    import Header from "./Header";
    import AsideMenu from "./AsideMenu";

    export default {
        name: "Home",
        components: {
            AsideMenu,
            Header
        }
    }
</script>

<style scoped lang="less">
    .home,.el-container{
        height: 100%;
        width: 100%;
    }

    .home{
        background-image: url("~assets/img/34.png");
        background-size: 100% 100%;
        background-repeat: no-repeat;
        overflow-y: auto;
    }

    .atom{
        position: absolute;
        height: 93%;
        width: 100%;
        z-index: 1;
    }


    .el-header{
        background-color: rgba(0,0,0,0.05);
        width: 100%;
        margin: auto;
    }

    .el-aside{
        .asidemenu{
            margin-top: 100px;
        }

    }



    .el-container{

    }







</style>