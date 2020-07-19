import {http} from '../http'

/**
 * 根据用户订阅试卷的id查询试卷的结果
 * @param id
 * @returns {AxiosPromise}
 */
export function  queryAllExamResult(id) {
    return http({
        method: 'get',
        url: `/examination/examResult/result/${id}`
    })
}