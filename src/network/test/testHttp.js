import {http} from "../http";


/**
 * 条件查询所有的试卷
 * @param search
 * @returns {AxiosPromise}
 */
export function queryAllTest(search){
    return http({
        method: 'get',
        url: '/examination/tests',
        params: search
    })
}


/**
 * 通过id查询试卷信息
 * @param id
 * @returns {AxiosPromise}
 */
export function queryTestById(id){
    return http({
        method: 'get',
        url: `/examination/test/${id}`
    })
}

/**
 * 删除(重启)指定的试卷
 * @param id
 * @returns {AxiosPromise}
 */
export function deleteTest(id){
    return http({
        method: 'delete',
        url: `/examination/test/${id}`
    })
}

/**
 * 更新试卷的发布状态
 * @param id
 * @returns {AxiosPromise}
 */
export function updatePublish(id){
    return http({
        method: 'put',
        url: `/examination/test/${id}`
    })
}


/**
 * 新增试卷
 * @param test
 * @returns {AxiosPromise}
 */
export function insertTest(test) {
    return http({
        method: 'post',
        url: '/examination/test',
        data: test
    })
}

/**
 * 修改试卷信息
 * @param test
 * @returns {AxiosPromise}
 */
export function updateTest(test){
    return http({
        method: 'put',
        url: '/examination/test',
        data: test
    })
}

