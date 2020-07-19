import {http} from '../http'


/**
 * 查询所有学科信息
 * @returns {AxiosPromise}
 */
export function queryAllSubjects(){
    return http({
        method: 'get',
        url: '/examination/allSubjects'
    })
}

/**
 * 通过条件查询学科信息(key,page,row)
 * @param search
 * @returns {AxiosPromise}
 */
export function querySubjects(search){
    return http({
        method: 'get',
        url: '/examination/subjects',
        params: search
    })
}


/**
 * 新增学科信息
 * @param subjectInfo
 * @returns {AxiosPromise}
 */
export function insertSubject(subjectInfo){
    return http({
        method: 'post',
        url: '/examination/subjects',
        data: subjectInfo
    })
}


/**
 * 根据id删除学科
 * @param id
 * @returns {AxiosPromise}
 */
export function deleteSubject(id){
    return http({
        method: 'delete',
        url: `/examination/subjects/${id}`
    })
}

/**
 * 重启删除的学科
 * @param id
 * @returns {AxiosPromise}
 */
export function updateSubjectById(id){
    return http({
        method: 'put',
        url: `/examination/subjects/${id}`
    })
}


/**
 * 修改学科信息
 * @param subjectInfo
 * @returns {AxiosPromise}
 */
export function updateSubject(subjectInfo){
    return http({
        method: 'put',
        url: '/examination/subjects',
        data: subjectInfo
    })
}

