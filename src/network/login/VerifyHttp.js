import {http} from "../http";


/**
 * 发送验证码(手机，邮箱)
 * @returns {AxiosPromise}
 */
export default function  verify() {
    return http({
        method: 'get',
        url: '/auth/verify'
    })
}