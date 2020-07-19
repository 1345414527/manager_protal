import {http} from "../http";

import qs from 'qs'



/**
 * 查询所有试题
 * @param search
 * @returns {AxiosPromise}
 */
export function queryAllTopics(search){
    return http({
        method: 'get',
        url: '/examination/topics',
        params: search
    })
}

/**
 * 通过id集合获取试题信息
 * @param topics
 * @returns {AxiosPromise}
 */
export function queryTopicsById(topics){
    return http({
        method: 'post',
        url: '/examination/topic/ids',
        data: topics
    })
}

/**
 * 新镇试题信息
 * @param topic
 * @returns {AxiosPromise}
 */
export function insertTopic(topic){
    return http({
        method: 'post',
        url: '/examination/topic',
        data: topic
    })
}

/**
 * 修改试题信息
 * @param topic
 * @returns {AxiosPromise}
 */
export function updateTopic(topic){
    return http({
        method: 'put',
        url: '/examination/topic',
        data: topic
    })
}

/**
 * 删除(启用)试题
 * @param id
 * @returns {AxiosPromise}
 */
export function deleteTopic(id){
    return http({
        method: 'delete',
        url: `/examination/topic/${id}`
    })
}