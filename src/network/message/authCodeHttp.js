import {http} from "../http";


/**
 * 发送手机验证码
 * @param phone
 * @returns {AxiosPromise}
 */
export function sendPhoneAuthCode(phone){
    return http({
        method: 'get',
        url: `/user/authcode/phone/${phone}`
    })
}

/**
 * 发送邮箱验证码
 * @param email
 * @returns {AxiosPromise}
 */
export function sendEmailAuthCode(email){
    return http({
        method: 'get',
        url: `/user/authcode/email/${email}`
    })
}


