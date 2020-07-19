import {http} from '../http'

/**
 * 重置考生的试卷(考生的分数和每个试题的分数不会改变，再一次做的时候是覆盖分数)
 * @param id
 * @returns {AxiosPromise}
 */
export function again(id){
    return http({
        url: `/examination/examinee/ExamAgain/${id}`,
        method: 'post'
    })
}

/**
 * 重置考生的试卷(考生的分数和每个试题的分数不会改变，再一次做的时候是覆盖分数)
 * @param id
 * @returns {AxiosPromise}
 */
export function reset(id){
    return http({
        url: `/examination/examinee/resetExam/${id}`,
        method: 'post'
    })
}