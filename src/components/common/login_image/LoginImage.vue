<template>
    <div class="loginImage">
        <div>

        </div>
        <div id="loginpage">
<!--            <img src="~assets/img/35.jpg"/>-->
            <div class="walk"></div>
        </div>
    </div>
</template>

<script>

    export default {
        name: "LoginImage"
    }
</script>

<style scoped lang="less">

    .loginImage{
        background-color: red ;
        height: 100%;
        width: 100%;
    }



    .loginImage div:first-of-type{
        height: 100%;
        background-image: url("~assets/img/32.jpg");
        background-repeat: no-repeat;
        background-size: 100% 100%;
    }

    .loginImage div:last-of-type{
        height: 100%;
        background-image: url("~assets/img/35.jpg");
        background-repeat: no-repeat;
        background-size: 200% 100%;
        animation: imageAnimation 100s linear infinite;
    }



    #loginpage {
        position: relative;
        .walk {
            position: absolute;
            height: 263px;
            width: 120px;
            background-image: url("~assets/img/walk.png");
            background-repeat: no-repeat;
            background-size: 1583px 263px;
            bottom: 4%;
            margin-left: -115px;
            animation: walk 1s steps(12) infinite,move 40s linear forwards;

        }
    }
    
    @keyframes  imageAnimation{
        0%{
            background-position: left;
        }

        100%{
            background-position: right;
        }
    }

    @keyframes walk {
        0%{
            background-position: 0 0;
        }

        100%{
            background-position: -1555px 0;
        }

    }

    @keyframes move {
        0%{
            left: -1%;
        }

        100%{
            left: 52%;
        }
    }


</style>