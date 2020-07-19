import {http} from '../http'


/**
 * 插入用户订阅试卷记录
 * @param subscribeExam
 * @returns {AxiosPromise}
 */
export function insertSubscribeExamInfo(subscribeExam){
    return http({
        method: 'post',
        url: '/examination/subscribeExam',
        data: subscribeExam
    })
}


/**
 * 查询当前用户的订阅信息
 * @param userId
 * @returns {AxiosPromise}
 */
export function querySubscribeUserIdAndDeleted(userId){
    return http({
        method: 'get',
        url: `/examination/userSubscribeInfo/${userId}`
    })
}


/**
 * 根据条件查询订阅的试卷
 * @param search
 * @returns {AxiosPromise}
 */
export function queryAllSubscribeExamInfo(search){
    return http({
        method: 'get',
        url: '/examination/subscribeExams',
        params: search
    })
}

/**
 * 删除订阅信息(如果当前的考试正在进行或者已经结束了，则不能删除了)
 * @param userId
 * @param publicTestId
 * @returns {AxiosPromise}
 */
export function deleteSubscribe(userId,publicTestId){
    return http({
        method: 'delete',
        url: `/examination/deleteSubscribe/${userId}/${publicTestId}`
    })
}

/**
 * 管理员删除
 * 删除订阅信息(如果当前的考试正在进行或者已经结束了，也能删除)
 * @param publicTestId
 * @returns {AxiosPromise}
 */
export function deleteSubscribeByManager(publicTestId){
    return http({
        method: 'delete',
        url: `/examination/deleteSubscribe/${publicTestId}`
    })
}



