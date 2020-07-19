import {http} from "../http"


/**
 * 查询所有用户分数统计相关信息
 * @param subjectId
 * @param userId
 * @param dataNum
 * @returns {AxiosPromise}
 */
export function userExamScore(subjectId,userId,dataNum){
    return http({
        method: 'get',
        url: `/examination/examData/${subjectId}/${userId}/${dataNum}`
    })
}


/**
 * 查询所有用户分数统计相关信息
 * @param subjectId
 * @param dataNum
 * @returns {AxiosPromise}
 */
export function allUserExamScore(subjectId,dataNum){
    return http({
        method: 'get',
        url: `/examination/allExamData/${subjectId}/${dataNum}`
    })
}