import {http} from "../http";

/**
 * 注册
 * @param userInfo
 * @returns {AxiosPromise}
 */
export function register(userInfo){
    return http({
        method: 'post',
        url: '/user/register',
        data: userInfo
    })
}

/**
 * 用户登录
 * @param userInfo
 * @returns {AxiosPromise}
 */
export function login(userInfo){
    return http({
        method: 'post',
        url: '/auth/accredit',
        params: userInfo
    })
}

/**
 * 登出
 * @returns {AxiosPromise}
 */
export  function logout() {
    return http({
        method: 'delete',
        url: '/auth/logout'
    })
}