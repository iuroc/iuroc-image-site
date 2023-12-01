import van, { PropValueOrDerived, Props, State, TagFunc } from 'vanjs-core'
import image0 from '../../img/4e4e70004a6b4db2a3f5d383149d934a_0.png'
import image1 from '../../img/4e4e70004a6b4db2a3f5d383149d934a_1.png'
import image2 from '../../img/4e4e70004a6b4db2a3f5d383149d934a_2.png'
import image3 from '../../img/4e4e70004a6b4db2a3f5d383149d934a_3.png'
import { Carousel } from 'bootstrap'
import { FormConfig, MyInput, myOnBlur, myOnInput } from './input'

const { button, div, img, input } = van.tags

export const Login = () => {
    return div({ 'data-route': 'login' },
        div({
            class: 'row h-100 rounded-4 mx-auto overflow-hidden border border-3 mt-sm-5',
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
            div({ class: 'col-lg-6 p-4' },
                div({ class: 'h-100 d-flex flex-column justify-content-center' },
                    LoginPanel(), RegisterPanel()
                )
            )
        ),
    )
}

const LoginPanel = () => {
    const errorMessage = van.state('')
    const formConfig: FormConfig = {
        username: {
            oninput(event) {
                myOnInput(event, formConfig.username)
            },
            onblur() {
                myOnBlur(formConfig.username)
            },
            value: van.state(''),
            invalid: van.state(false),
            invalidMessage: van.state('账号不能为空')
        },
        password: {
            oninput(event) {
                myOnInput(event, formConfig.password)
            },
            onblur() {
                myOnBlur(formConfig.password)
            },
            value: van.state(''),
            invalid: van.state(false),
            invalidMessage: van.state('密码不能为空'),
        }
    }

    const username = formConfig.username.value as State<string>
    const password = formConfig.password.value as State<string>

    const clearForm = () => {
        username.val = ''
        password.val = ''
    }

    const clickLogin = () => {
        if (username.val.match(/^\s*$/)) (formConfig.username.invalid as State<boolean>).val = true
        if (password.val.match(/^\s*$/)) (formConfig.password.invalid as State<boolean>).val = true
    }

    return div(
        div({ class: 'fs-3 mb-3' }, '用户登录'),
        div({ class: 'mb-3 fw-light' },
            '登录后即刻畅享高清美景，轻松收藏心动之作，尽情发现独特美好，定格喜爱瞬间。'
        ),
        div({ class: 'mb-3' }, errorMessage),
        MyInput(formConfig.username),
        MyInput(formConfig.password),
        div({ class: 'row mb-3' },
            div({ class: 'col' }, button({
                class: 'btn btn-light border w-100', onclick: clearForm
            }, '清空')),
            div({ class: 'col' },
                button({ class: 'btn btn-success w-100', onclick: clickLogin }, '登录')
            ),
        ),
    )
}

const RegisterPanel = () => {
    return div()
}
