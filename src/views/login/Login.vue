<template>
    <div class="login">
        <login-image/>
        <Eye/>
        <Loginui/>

    </div>
</template>

<script>
    import LoginImage from "components/common/login_image/LoginImage";
    import Eye from "components/common/login_image/Eye";
    import Loginui from "./Loginui";

    export default {
        name: "Login",
        components: {
            LoginImage,
            Eye,
            Loginui
        }
    }
</script>

<style scoped lang="less">
    .login{
        height: 100%;
    }

</style>