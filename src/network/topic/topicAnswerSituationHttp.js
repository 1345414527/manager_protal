import {http} from '../http'


/**
 * 计算试题的答题情况
 * @param search
 * @returns {AxiosPromise}
 */
export function calculateTopicAnswerResult(search){
    return http({
        method: 'get',
        url: '/examination/topics/result',
        params: search
    })
}