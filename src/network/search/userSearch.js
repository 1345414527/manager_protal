import {http} from '../http'

/**
 * 检索
 * @param searchRequest
 * @returns {AxiosPromise}
 */
export function search(searchRequest) {
    return http({
        method: 'post',
        url: '/search/search/userInfo',
        data: searchRequest
    })
}