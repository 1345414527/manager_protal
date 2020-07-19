<template>
    <div class="eye">
        <button class="btn el-icon-view" @click="showLogin">
<!--            <img src="~assets/svg/eye.svg"/>-->
        </button>
    </div>


</template>

<script>
    import utils from 'utils/utils'

    export default {
        name: "Eye",
        methods: {
            showLogin(){
                    let el=document.getElementById('loginpage');
                    utils.ScrollTop(el.offsetTop, 150);
                    this.$router.push('/login/password')
                }
         }
    }
</script>

<style scoped>

    .eye{
        text-align: center;
        line-height: 8px;
    }

    .btn {
        position: absolute;
        top: 50%;
        left: 50%;
        margin-left: -100px;
        height: 60px;
        width: 200px;
        background: none;
        border: 2px solid;
        border-bottom-width: 4px;
        border-radius: 200px;
        font: inherit;
        letter-spacing: inherit;
        padding: 1em 2em;
        text-transform: inherit;
        -webkit-transition: color 1s;
        transition: color 1s;
    }

    .btn {
        color: #f9879b;
    }




    .el-icon-view{
        font-size: 30px;
    }


    .btn img{
        position: absolute;
        z-index: 1;
        height: 30px;
        width: 50px;
    }

    .btn:hover {
        -webkit-animation: pulse 1s ease-in infinite;
        animation: pulse 1s ease-in infinite;
        background: -webkit-radial-gradient(circle, rgba(249, 135, 155, 0.25) 43%, rgba(0, 0, 0, 0) 50%) 0 0/1em 1em, -webkit-radial-gradient(circle, rgba(249, 135, 155, 0.25) 43%, rgba(0, 0, 0, 0) 50%) 0.5em 0.5em/2em 2em;
        background: radial-gradient(circle, rgba(249, 135, 155, 0.25) 43%, rgba(0, 0, 0, 0) 50%) 0 0/1em 1em, radial-gradient(circle, rgba(249, 135, 155, 0.25) 43%, rgba(0, 0, 0, 0) 50%) 0.5em 0.5em/2em 2em;
        color: #0bdcb7;
    }



    @-webkit-keyframes pulse {
        50% {
            background-position: 0.66em 0.66em, -0.33em -0.33em;

        }
        100% {
            background-size: 2em 2em, 1em 1em;
            background-position: -1.5em -1.5em, -1em -1em;
        }
    }

    @keyframes pulse {
        50% {
            background-position: 0.66em 0.66em, -0.33em -0.33em;
        }
        100% {
            background-size: 2em 2em, 1em 1em;
            background-position: -1.5em -1.5em, -1em -1em;
        }
    }




</style>