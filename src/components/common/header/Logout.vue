<template>
    <div class="logout">
        <el-tooltip content="登出" placement="bottom">
            <el-switch
                    v-model="value"
                    active-color="#333533"
                    inactive-color="#ff4949"
                    @change="listenChange"
                    :width="60"
                    :height="60">
            </el-switch>
        </el-tooltip>
    </div>
</template>

<script>
    import {logout} from "network/login/loginHttp";

    export default {
        name: "Logout",
        data(){
            return {
                value: true
            }
        },
        methods: {
            listenChange(){
                if(!this.state){
                    this.$confirm('<i style="color: red;font-size: 20px">您确定要登出吗？</i>', '登出', {
                        distinguishCancelAndClose: true,
                        confirmButtonText: '退出',
                        cancelButtonText: '放弃',
                        type: 'warning',
                        roundButton: true,
                        dangerouslyUseHTMLString: true
                    }).then(()=>{
                        logout().then((res)=>{
                            console.log(res);
                            if(res.result_code===200){
                                this.$message({
                                    showClose: true,
                                    message: '登出成功',
                                    type: 'success'
                                })
                            }else{
                                this.$message({
                                    showClose: true,
                                    message: '登出失败',
                                    type: 'success'
                                })
                            }
                        })
                        this.$router.replace('/')

                    }).catch(()=>{
                        this.value=true
                    })
                }
            }
        }
    }
</script>





<style scoped>


    .el-switch{
        width: 60px;
        height: 60px;
        margin-left: 45%;

    }



</style>