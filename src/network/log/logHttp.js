import {http} from '../http'


/**
 * 查询所有日志相关数据
 * @param search
 * @returns {AxiosPromise}
 */
export function queryAllLogs(search){
    return http({
        method: 'get',
        url: '/examination/log/exam/info',
        params: search
    })
}