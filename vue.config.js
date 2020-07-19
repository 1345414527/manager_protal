const path = require('path');//引入path模块
function resolve(dir){
    return path.join(__dirname,dir)//path.join(__dirname)设置绝对路径
}

module.exports={
    //不检查host，用于nginx反向代理
    devServer: {
        disableHostCheck: true,
    },
    chainWebpack:(config)=>{
        //别名
        config.resolve.alias
            .set('@',resolve('./src'))
            .set('components',resolve('./src/components'))
            .set('views',resolve('./src/views'))
            .set('assets',resolve('./src/assets'))
            // .set('common',resolve('./src/common'))
            .set('network',resolve('./src/network'))
            .set('utils',resolve('./src/utils'))
        //set第一个参数：设置的别名，第二个参数：设置的路径


        //设置webpack的打包入口
        //发布模式'
        // config.when(process.env.NODE_ENV==='production',config=>{
        //     config.entry('app').clear().add('./src/main-prod.js')
            // config.set('externals', {
            //     vue : 'Vue',
            //     vuex : 'Vuex',
            //     'vue-router' : 'VueRouter',
            //     echarts: 'echarts',
            //     nprogress: 'NProgress',
            //     lodash : '_',
            //     'vue-quill-editor': 'VueQuillEditor',
            //     axios : 'axios',
            // })
        // })

        //开发模式
    //     config.when(process.env.NODE_ENV==='development',config=>{
    //         config.entry('app').clear().add('./src/main-dev.js')
    //     })
    //
    //
    //
    },
}


