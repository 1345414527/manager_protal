import axios from 'axios'

export function http(config) {
    //创建实例
    const instance=axios.create({
        baseURL: 'http://api.codekiller.top/api',
        timeout: 5000,
        withCredentials: true  //允许跨域携带cookie
    })


    //axios的拦截器
    instance.interceptors.request.use(config=>{
        //进度条
        return config
    },err=>{
        // console.log(err);
    })

    instance.interceptors.response.use(res=>{
        return res.data;
    },err=>{
        console.log(err);
    })

    return instance(config)
}
