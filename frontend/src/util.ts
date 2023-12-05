import { State } from "vanjs-core"
import { apiConfig } from "./config"

export interface AjaxRes<Data = any> {
    code: 200 | 0,
    message: string,
    data: Data
}

/**
 * 包含自动控制显示隐藏的类列表
 * @param state 元素显示隐藏的状态
 * @param baseClass 元素初始类列表
 * @returns 包含自动控制显示隐藏的类列表
 */
export const classWithHide = (state: State<boolean>, baseClass: string = '') => {
    return {
        class: () => `${baseClass}${state.val ? ' d-none' : ''}`
    }
}

export const getNowRouteName = () => {
    return location.hash == '' ? 'home' : location.hash.split('/')[1]
}

