import van, { State } from 'vanjs-core'
import image0 from '../../img/4e4e70004a6b4db2a3f5d383149d934a_0.png'
import image1 from '../../img/4e4e70004a6b4db2a3f5d383149d934a_1.png'
import image2 from '../../img/4e4e70004a6b4db2a3f5d383149d934a_2.png'
import image3 from '../../img/4e4e70004a6b4db2a3f5d383149d934a_3.png'
import { Carousel } from 'bootstrap'
import { apiConfig } from '../config'
import { AjaxRes } from '../util'
import { handleHasLogin, handleNotLogin } from '../afterRouter'

const { a, button, div, img, input } = van.tags

/** 当前显示的面板 */
const activePanel: State<'login' | 'register'> = van.state('login')
/** 面板标题 */
const panelTitle = van.derive(() => activePanel.val == 'login' ? '用户登录' : '用户注册')
/** 面板欢迎语 */
const panelWelcome = van.derive(() => activePanel.val == 'login'
    ? '登录后即刻畅享高清美景，轻松收藏心动之作，尽情发现独特美好，定格喜爱瞬间。'
    : '')
/** 面板错误消息 */
const errorMessage = van.state('')

const loginPanelData = {
    username: van.state(''),
    password: van.state('')
}

export const Login = () => {


    return div({ 'data-route': 'login' },
        div({
            class: 'row h-100 rounded-4 mx-auto overflow-hidden border border-3 my-sm-5',
            style: 'max-width: 900px;'
        },
            div({ class: 'col-lg-6 d-lg-block d-none bg-light p-0' },
                () => {
                    const element = div({ class: "carousel slide", "data-bs-ride": "carousel" },
                        div({ class: "carousel-inner" },
                            [image0, image1, image2, image3].map((src, index) =>
                                div({ class: `carousel-item${index == 0 ? ' active' : ''}` },
                                    img({ src, class: "d-block w-100" }),
                                )
                            )
                        ),
                    )
                    new Carousel(element, { interval: 2000 })
                    return element
                }
            ),
            div({ class: 'col-lg-6 p-4 overflow-y-auto' },
                div({ class: 'h-100 d-flex flex-column justify-content-center' },
                    div({ class: 'fs-3 mb-3' }, panelTitle),
                    div({ class: () => `mb-3 fw-light ${dNone(panelWelcome)}` }, panelWelcome),
                    div({ class: () => `mb-3 text-danger ${errorMessage.val ? '' : 'd-none'}` }, errorMessage),
                    LoginPanel(), RegisterPanel()
                )
            )
        ),
    )
}

const dNone = (state: State<string | boolean>) => {
    return state.val ? '' : 'd-none'
}

const LoginPanel = () => {

    // 输入框值
    const username = loginPanelData.username
    const password = loginPanelData.password

    // 警告内容
    const usernameInvalid = van.state(false)
    const passwordInvalid = van.state(false)


    /** 点击清空按钮 */
    const clearForm = () => {
        username.val = ''
        password.val = ''
        usernameInvalid.val = false
        passwordInvalid.val = false
        errorMessage.val = ''
    }

    /** 点击登录按钮 */
    const clickLogin = () => {
        let checkGood = true
        let rule = /^\s*$/
        if (username.val.match(rule)) {
            usernameInvalid.val = true
            checkGood = false
        }
        if (password.val.match(rule)) {
            passwordInvalid.val = true
            checkGood = false
        }
        if (!checkGood) return
        const xhr = new XMLHttpRequest()
        xhr.open('POST', apiConfig.login)
        const params = new URLSearchParams()
        params.append('username', username.val)
        params.append('password', password.val)
        xhr.send(params)
        xhr.addEventListener('readystatechange', () => {
            if (xhr.readyState == xhr.DONE && xhr.status == 200) {
                const data = JSON.parse(xhr.responseText) as AjaxRes
                if (data.code == 200) {
                    handleHasLogin()
                    location.hash = ''
                    clearForm()
                    return
                }
                errorMessage.val = data.message
            }
        })
    }

    /** 切换到注册页面 */
    const toRegister = () => {
        activePanel.val = 'register'
        clearForm()
    }

    return div({ class: () => activePanel.val == 'login' ? '' : 'd-none' },
        MyInput({
            invalid: usernameInvalid,
            invalidMessage: '账号不能为空',
            type: 'text',
            value: username,
            placeholder: '请输入账号'
        }),
        MyInput({
            invalid: passwordInvalid,
            invalidMessage: '密码不能为空',
            type: 'password',
            value: password,
            placeholder: '请输入密码'
        }),
        div({ class: 'row mb-3' },
            div({ class: 'col' }, button({
                class: 'btn btn-light border w-100', onclick: clearForm
            }, '清空')),
            div({ class: 'col' },
                button({ class: 'btn btn-success w-100', onclick: clickLogin }, '登录')
            ),
        ),
        div({ class: 'text-center' },
            a({ role: 'button', class: 'link-primary', onclick: toRegister }, '没有账号？点击注册')
        )
    )
}

const RegisterPanel = () => {

    const username = van.state('')
    const password = van.state('')
    const passwordRepeat = van.state('')

    const usernameInvalid = van.state(false)
    const passwordInvalid = van.state(false)
    const passwordRepeatInvalid = van.state(false)
    const passwordRepeatInvalidMessage = van.state('')

    const usernameSuccessCheck = /^\w{4,16}$/
    const passwordSuccessCheck = /^[\x00-\x7F]{6,20}$/

    const clearForm = () => {
        username.val = ''
        password.val = ''
        passwordRepeat.val = ''
        usernameInvalid.val = false
        passwordInvalid.val = false
        passwordRepeatInvalid.val = false
    }
    const toLogin = () => {
        activePanel.val = 'login'
        clearForm()
    }

    const clickRegister = () => {
        let check = true
        if (!username.val.match(usernameSuccessCheck)) {
            usernameInvalid.val = true
            check = false
        }
        if (!password.val.match(passwordSuccessCheck)) {
            passwordInvalid.val = true
            check = false
        }
        if (password.val != passwordRepeat.val || passwordRepeat.val == '') {
            passwordRepeatInvalid.val = true
            if (passwordRepeat.val == '')
                passwordRepeatInvalidMessage.val = '请重复输入密码'
            else
                passwordRepeatInvalidMessage.val = '两次输入的密码不一致'
            check = false
        }
        if (!check) return
        const xhr = new XMLHttpRequest()
        xhr.open('POST', apiConfig.register)
        xhr.send((() => {
            const params = new URLSearchParams()
            params.append('username', username.val)
            params.append('password', password.val)
            return params
        })())
        xhr.addEventListener('readystatechange', () => {
            if (xhr.readyState == xhr.DONE && xhr.status == 200) {
                const data = JSON.parse(xhr.responseText) as AjaxRes
                if (data.code == 200) {
                    alert('注册成功，请前往登录')
                    loginPanelData.username.val = username.val
                    loginPanelData.password.val = password.val
                    return toLogin()
                }
                errorMessage.val = data.message
            }
        })
    }

    return div({ class: () => activePanel.val == 'register' ? '' : 'd-none' },
        MyInput({
            invalid: usernameInvalid,
            invalidMessage: '请输入 4-16 位数字、字母和下划线组合',
            type: 'text',
            value: username,
            placeholder: '请输入账号',
            success: usernameSuccessCheck
        }),
        MyInput({
            invalid: passwordInvalid,
            invalidMessage: '请输入 6-20 位数字、字母和特殊字符',
            type: 'password',
            value: password,
            placeholder: '请输入密码',
            success: passwordSuccessCheck
        }),
        MyInput({
            invalid: passwordRepeatInvalid,
            invalidMessage: passwordRepeatInvalidMessage,
            type: 'password',
            value: passwordRepeat,
            placeholder: '请重复输入密码',
            onblur() {
                if (password.val == '') return false
                else if (passwordRepeat.val == '') {
                    passwordRepeatInvalid.val = true
                    passwordRepeatInvalidMessage.val = '请重复输入密码'
                }
                else if (password.val != passwordRepeat.val) {
                    passwordRepeatInvalid.val = true
                    passwordRepeatInvalidMessage.val = '两次输入的密码不一致'
                }
                return false
            },
        }),
        div({ class: 'row mb-3' },
            div({ class: 'col' }, button({
                class: 'btn btn-light border w-100', onclick: clearForm
            }, '清空')),
            div({ class: 'col' },
                button({ class: 'btn btn-primary w-100', onclick: clickRegister }, '注册')
            ),
        ),
        div({ class: 'text-center' },
            a({ role: 'button', class: 'link-primary', onclick: toLogin }, '已有账号？前往登录')
        )
    )
}

/**
 * 通用输入事件
 * @param value 输入框内容
 * @param invalid 警告内容
 * @param event 事件对象
 */
const myOnInput = (value: State<string>, invalid: State<boolean>, event: { target: HTMLInputElement }) => {
    value.val = event.target.value
    invalid.val = false
}

/**
 * 通用失去焦点事件
 * @param value 输入框内容
 * @param invalid 警告内容，为空时解除警告状态
 * @param invalidMessage 更新后的警告内容
 * @param check 触发警告的规则
 */
const myOnBlur = (
    value: State<string>,
    invalid: State<boolean>,
    check: RegExp = /^\s*$/,
    success?: RegExp
) => {
    if (success && value.val.match(success))
        invalid.val = false
    else if (success || value.val.match(check)) invalid.val = true
    else invalid.val = false
}
const MyInput = (config: {
    value: State<string>
    invalid: State<boolean>
    invalidMessage: State<string> | string
    type: 'text' | 'password' | 'email'
    placeholder?: State<string> | string
    oninput?: (event: { target: HTMLInputElement }) => boolean | void
    onblur?: () => boolean | void
    check?: RegExp
    success?: RegExp
}) => {
    const invalidClass = van.derive(() => config.invalid.val ? ' is-invalid' : '')
    return div({ class: 'mb-3' },
        input({
            class: () => `form-control${invalidClass.val}`,
            type: config.type,
            placeholder: config.placeholder ?? '',
            value: config.value,
            oninput(event) {
                if (config.oninput && config.oninput(event) === false) return
                myOnInput(config.value, config.invalid, event)
            },
            onblur() {
                if (config.onblur && config.onblur() === false) return
                myOnBlur(config.value, config.invalid, config.check, config.success)
            }
        }),
        div({ class: 'invalid-feedback' }, config.invalidMessage)
    )
}