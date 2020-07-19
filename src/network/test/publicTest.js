import {http} from '../http'


/**
 * 查询所有发布试卷的信息
 * @param search
 * @returns {AxiosPromise}
 */
export function queryAllPublicTests(search) {
    return http({
        method: 'get',
        url: '/examination/publicTests',
        params: search
    })
}

/**
 * 更新试卷的开始和结束时间
 * @param publicTest
 * @returns {*}
 */
export function updatePublicTestTime(publicTest){
    return http({
        method: 'put',
        url: '/examination/publicTests/time',
        data: publicTest
    })
}

