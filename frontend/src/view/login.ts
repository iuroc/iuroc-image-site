import van, { State } from 'vanjs-core'
import image0 from '../../img/4e4e70004a6b4db2a3f5d383149d934a_0.png'
import image1 from '../../img/4e4e70004a6b4db2a3f5d383149d934a_1.png'
import image2 from '../../img/4e4e70004a6b4db2a3f5d383149d934a_2.png'
import image3 from '../../img/4e4e70004a6b4db2a3f5d383149d934a_3.png'
import { apiConfig } from '../config'
import { AjaxRes } from '../util'

const { a, button, div, img, input } = van.tags


export const Login = () => {
    return div({ 'data-route': 'login' },
        div({
            class: 'row h-100 rounded-4 mx-auto overflow-hidden border border-3 mt-sm-5',
            style: 'max-width: 900px;'
        },
            div({ class: 'col-lg-6 d-lg-block d-none bg-light p-0' },
                img({ src: makeImageSrc(), class: 'w-100 h-100' })),
            div({ class: 'col-lg-6 p-4' },
                LoginPanel(), RegisterPanel()
            )
        ),
    )
}

/** 轮播图动态 src */
const makeImageSrc = () => {
    let index = 0
    const imageList = [image0, image1, image2, image3]
    const src = van.state(imageList[index])
    setInterval(() => src.val = imageList[(++index) % imageList.length], 3000)
    return src
}


/**
 * 处理输入框输入事件
 * @param value 输入框 State 值
 * @param invalid 表示输入框值是否非法的 State 值
 * @param event 输入事件对象
 */
const handleInput = (
    valueState: State<string>,
    invalidState: State<boolean>,
    event: Event,
    errorMessageState: State<string>
) => {
    const target = event.target as HTMLInputElement
    valueState.val = target.value
    invalidState.val = false
    errorMessageState.val = ''
}

const handleBlur = (
    valueState: State<string>,
    invalidState: State<boolean>,
    rule: RegExp | (() => boolean) = /^\s*$/
) => {
    if (typeof rule == 'function' && rule()) invalidState.val = true
    else if (typeof rule == 'object' && valueState.val.match(rule)) invalidState.val = true
}

const loginPanelInvalid = {
    username: van.state(false),
    password: van.state(false)
}
const registerPanelInvalid = {
    username: van.state(false),
    password: van.state(false),
    passwordRepeat: van.state(false),
}

const clearInvalid = (invalidDict: Record<string, State<boolean>>) => {
    for (let name in invalidDict)
        invalidDict[name].val = false
}
const showPanel = van.state('login')

const LoginPanel = () => {
    const username = van.state('')
    const password = van.state('')
    const invalid = loginPanelInvalid
    const errorMessage = van.state('')
    const clickLogin = () => {
        if (username.val.match((/^\s*$/))) invalid.username.val = true
        if (password.val.match((/^\s*$/))) return invalid.password.val = true
        const xhr = new XMLHttpRequest()
        xhr.open('POST', apiConfig.login)
        const params = new URLSearchParams()
        params.append('username', username.val)
        params.append('password', password.val)
        xhr.send(params)
        xhr.addEventListener('readystatechange', () => {
            if (xhr.readyState == xhr.DONE && xhr.status == 200) {
                const data = JSON.parse(xhr.responseText) as AjaxRes
                if (data.code == 200) return location.reload()
                errorMessage.val = data.message
            }
        })
    }


    return div({ class: () => `h-100 d-flex flex-column justify-content-center ${showPanel.val == 'login' ? '' : 'd-none'}` },
        div({ class: 'fs-3 mb-3' }, '用户登录'),
        div({ class: 'mb-3' },
            '在您登录成功后，探索高清美景的权限即刻启用，轻松收藏心仪之作。愿您尽情畅游，发现独特美好，定格喜爱瞬间。'
        ),
        div({ class: () => `mb-3 text-danger ${errorMessage.val == '' ? 'd-none' : ''}` }, errorMessage),
        div({ class: 'mb-3' },
            input({
                class: () => `form-control ${invalid.username.val ? 'is-invalid' : ''}`,
                placeholder: '请输入账号',
                value: username,
                oninput: event => handleInput(username, invalid.username, event, errorMessage),
                onblur: () => handleBlur(username, invalid.username)
            }),
        ),
        div({ class: 'mb-3' },
            input({
                class: () => `form-control ${invalid.password.val ? 'is-invalid' : ''}`,
                type: 'password',
                placeholder: '请输入密码',
                value: password,
                oninput: event => handleInput(password, invalid.password, event, errorMessage),
                onblur: () => handleBlur(password, invalid.password)
            }),
        ),
        div({ class: 'row mb-3' },
            div({ class: 'col' }, button({
                class: 'btn btn-light border w-100', onclick: () => {
                    username.val = ''
                    password.val = ''
                    errorMessage.val = ''
                    clearInvalid(invalid)
                }
            }, '清空')),
            div({ class: 'col' },
                button({ class: 'btn btn-success w-100', onclick: clickLogin }, '登录')
            ),
        ),
        div({ class: 'text-center' },
            a({
                role: 'button', class: 'link-primary', onclick() {
                    showPanel.val = 'register'
                    clearInvalid(invalid)
                }
            }, '没有账号？点击注册')
        )
    )
}

const RegisterPanel = () => {
    const username = van.state('')
    const password = van.state('')
    const passwordRepeat = van.state('')
    const invalid = registerPanelInvalid
    const errorMessage = van.state('')
    const repeatMessage = van.state('')
    const clickRegister = () => {
        if (username.val.match((/^\s*$/))) invalid.username.val = true
        if (password.val.match((/^\s*$/))) invalid.password.val = true
        if (passwordRepeat.val.match((/^\s*$/)) || passwordRepeat.val != password.val) {
            invalid.passwordRepeat.val = true
            if (password.val == '') repeatMessage.val = ''
            else repeatMessage.val = '两次输入的密码不一致'
            return
        }
    }
    return div({ class: () => `h-100 d-flex flex-column justify-content-center ${showPanel.val == 'login' ? 'd-none' : ''}` },
        div({ class: 'fs-3 mb-3' }, '用户注册'),
        div({ class: 'mb-3' }, '探索美的新纪元，注册即刻开启您的独特图像之旅。轻松浏览、畅快收藏，成为我们精彩图片社区的一部分！'),
        div({ class: 'mb-3' },
            input({
                class: () => `form-control ${invalid.username.val ? 'is-invalid' : ''}`,
                placeholder: '请输入账号',
                value: username,
                oninput: event => handleInput(username, invalid.username, event, errorMessage),
                onblur: () => handleBlur(username, invalid.username)
            }),
        ),
        div({ class: 'mb-3' },
            input({
                class: () => `form-control ${invalid.password.val ? 'is-invalid' : ''}`,
                type: 'password',
                placeholder: '请输入密码',
                value: password,
                oninput: event => handleInput(password, invalid.password, event, errorMessage),
                onblur: () => handleBlur(password, invalid.password)
            }),
        ),
        div({ class: 'mb-3' },
            input({
                class: () => `form-control ${invalid.passwordRepeat.val ? 'is-invalid' : ''}`,
                type: 'password',
                placeholder: '请重复输入密码',
                value: passwordRepeat,
                oninput: event => handleInput(passwordRepeat, invalid.passwordRepeat, event, errorMessage),
                onblur: () => {
                    if (passwordRepeat.val != password.val) {
                        invalid.passwordRepeat.val = true
                        repeatMessage.val = password.val == '' ? '' : '两次输入的密码不一致'
                    } else if (passwordRepeat.val.match((/^\s*$/))) {
                        invalid.passwordRepeat.val = true
                        repeatMessage.val = ''
                    }
                }
            }),
            div({ class: () => `invalid-feedback ${repeatMessage.val == '' ? 'd-none' : ''}` }, repeatMessage)
        ),
        div({ class: 'row mb-3' },
            div({ class: 'col' }, button({
                class: 'btn btn-light border w-100', onclick() {
                    username.val = ''
                    password.val = ''
                    passwordRepeat.val = ''
                    errorMessage.val = ''
                    clearInvalid(invalid)
                }
            }, '清空')),
            div({ class: 'col' }, button({ class: 'btn btn-info w-100', onclick: clickRegister }, '注册')),
        ),
        div({ class: 'text-center' },
            a({
                role: 'button', class: 'link-primary', onclick() {
                    clearInvalid(invalid)
                    showPanel.val = 'login'

                }
            }, '已有账号？前往登录')
        )
    )
}