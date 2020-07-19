<template>
    <div class="loginui">
        <login-select/>
        <router-view/>
    </div>
</template>

<script>
    import LoginSelect from "components/common/login/LoginSelect";

    export default {
        name: "Loginui",
        components: {
            LoginSelect
        }
    }
</script>

<style scoped>

    .loginui{
        position: absolute;
        width: 400px;
        height: 400px;
        bottom: -60%;
        left: 50%;
        margin-left: -200px;
        border: 1px solid #c04851;
        background-color: rgba(0,0,0,0.2);
        box-shadow: 1px 0 10px;
    }




</style>