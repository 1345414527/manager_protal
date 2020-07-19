import {http} from '../http'

/**
 * 根据用户的订阅id设置开始考试的时间
 * @param id
 * @returns {AxiosPromise}
 */
export  function updateBeginWorkTimeById(id){
    return http({
        method: 'put',
        url: `/examination/examAnswer/${id}`
    })
}

/**
 * 试题提交
 * @param tests
 * @returns {AxiosPromise}
 */
export function commitTest(tests) {
    return http({
        method: 'post',
        url: '/examination/examAnswer/commit',
        data: tests
    })
}

