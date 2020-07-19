import {http} from '../http'


/**
 * 根据用户id查询用户信息
 * @param id
 * @returns {AxiosPromise}
 */
export function queryUserByid(id){
    return http({
        method: 'get',
        url: `/user//user/${id}`
    })
}

/**
 * 修改用户名称
 * @param name
 * @returns {AxiosPromise}
 */
export function updateName(name){
    return http(({
        method: 'put',
        url: `/user/updateName/${name}`
    }))
}

/**
 * 修改用户的年龄
 * @param name
 * @returns {AxiosPromise}
 */
export function updateAge(age){
    return http(({
        method: 'put',
        url: `/user/updateAge/${age}`
    }))
}

/**
 * 修改用户的地区
 * @param areaProvince
 * @param areaCity
 * @param areaCounty
 * @returns {AxiosPromise}
 */
export function updateArea(areaProvince,areaCity,areaCounty){
    return http(({
        method: 'put',
        url: `/user/updateArea/${areaProvince}/${areaCity}/${areaCounty}`
    }))
}

/**
 * 修改用户学号
 * @param sno
 * @returns {AxiosPromise}
 */
export function updateSno(sno){
    return http(({
        method: 'put',
        url: `/user/updateSno/${sno}`
    }))
}

/**
 * 添加用户手机号码
 * @param phone
 * @param authcode
 * @returns {AxiosPromise}
 */
export function addPhone(phone,authcode){
    return http({
        method: 'put',
        url: `/user/updatePhone/${phone}/${authcode}`
    })
}

/**
 * 移除用户手机号
 * @param phone
 * @param authcode
 * @returns {AxiosPromise}
 */
export function removePhone(phone,authcode){
    return http({
        method: 'put',
        url: `/user/removePhone/${phone}/${authcode}`
    })
}

/**
 * 添加用户邮箱
 * @param email
 * @param authcode
 * @returns {AxiosPromise}
 */
export function addEmail(email,authcode){
    return http({
        method: 'put',
        url: `/user/updateEmail/${email}/${authcode}`
    })
}

/**
 * 移除用户邮箱
 * @param email
 * @param authcode
 * @returns {AxiosPromise}
 */
export function removeEmail(email,authcode){
    return http({
        method: 'put',
        url: `/user/removeEmail/${email}/${authcode}`
    })
}


/**
 * 通过电话号码查询用户
 * @param phone
 * @returns {AxiosPromise}
 */
export function queryUserInfoByPhone(phone) {
    return http({
        method: 'post',
        url: '/user/login/phone',
        params: {
            phone: phone
        }
    })
}


/**
 * 通过邮箱查询用户
 * @param email
 * @returns {AxiosPromise}
 */
export function queryUserInfoByEmail(email) {
    return http({
        method: 'post',
        url: '/user/login/email',
        params: {
            email: email
        }
    })
}

/**
 * 根据条件查询所有用户
 * @param search
 * @returns {AxiosPromise}
 */
export function queryAllUsers(search){
    return http({
        method: 'get',
        url: '/user/users',
        params: search
    })
}

/**
 * 更新状态
 * @param id
 * @returns {AxiosPromise}
 */
export function updateStatus(id){
    return http({
        method: 'put',
        url: `/user/updateStatus/${id}`
    })
}

/**
 * 查询统计数据(一天更新一次)
 * @returns {AxiosPromise}
 */
export function calculateAllUserData(){
    return http({
        method: 'get',
        url: '/user/userData/calculate/all'
    })
}