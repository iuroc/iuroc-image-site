import van from 'vanjs-core'
import image0 from '../../img/4e4e70004a6b4db2a3f5d383149d934a_0.png'
import image1 from '../../img/4e4e70004a6b4db2a3f5d383149d934a_1.png'
import image2 from '../../img/4e4e70004a6b4db2a3f5d383149d934a_2.png'
import image3 from '../../img/4e4e70004a6b4db2a3f5d383149d934a_3.png'

const { a, button, div, img, input } = van.tags


export const Login = () => {
    console.log('Login 载入')

    return div({ 'data-route': 'login' },
        div({
            class: 'row h-100 rounded-4 mx-auto overflow-hidden border border-3 mt-sm-5',
            style: 'max-width: 900px;'
        },
            div({ class: 'col-lg-6 d-lg-block d-none bg-light p-0' },
                img({ src: makeImageSrc(), class: 'w-100 h-100' })),
            div({ class: 'col-lg-6 p-4' },
                loginPanel, registerPanel
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
export const LoginPanel = () => {
    const username = van.state('')
    const password = van.state('')
    return div({ class: 'h-100 d-flex flex-column justify-content-center' },
        div({ class: 'fs-3 mb-3' }, '用户登录'),
        div({ class: 'mb-3' },
            '在您登录成功后，探索高清美景的权限即刻启用，轻松收藏心仪之作。愿您尽情畅游，发现独特美好，定格喜爱瞬间。'
        ),
        div({ class: 'input-group mb-3' },
            input({
                class: 'form-control',
                placeholder: '请输入账号',
                value: username,
                oninput: event => username.val = event.target.value
            })
        ),
        div({ class: 'input-group mb-3' },
            input({
                class: 'form-control',
                type: 'password',
                placeholder: '请输入密码',
                value: password,
                oninput: event => password.val = event.target.value
            })
        ),
        div({ class: 'row mb-3' },
            div({ class: 'col' }, button({
                class: 'btn btn-light border w-100', onclick: () => {
                    username.val = ''
                    password.val = ''
                }
            }, '清空')),
            div({ class: 'col' }, button({ class: 'btn btn-success w-100' }, '登录')),
        ),
        div({ class: 'text-center' },
            a({
                href: '#/login', onclick() {
                    loginPanel.classList.add('d-none')
                    registerPanel.classList.remove('d-none')
                }
            }, '没有账号？点击注册')
        )
    )
}

export const RegisterPanel = () => {
    const username = van.state('')
    const password = van.state('')
    const passwordRepeat = van.state('')
    return div({ class: 'h-100 d-flex flex-column justify-content-center d-none' },
        div({ class: 'fs-3 mb-3' }, '用户注册'),
        div({ class: 'mb-3' }, '探索美的新纪元，注册即刻开启您的独特图像之旅。轻松浏览、畅快收藏，成为我们精彩图片社区的一部分！'),
        div({ class: 'input-group mb-3' },
            input({
                class: 'form-control',
                placeholder: '请输入账号',
                value: username,
                oninput: event => username.val = event.target.value
            })
        ),
        div({ class: 'input-group mb-3' },
            input({
                class: 'form-control',
                type: 'password',
                placeholder: '请输入密码',
                value: password,
                oninput: event => password.val = event.target.value
            })
        ),
        div({ class: 'input-group mb-3' },
            input({
                class: 'form-control',
                type: 'password',
                placeholder: '请重复输入密码',
                value: passwordRepeat,
                oninput: event => passwordRepeat.val = event.target.value
            })
        ),
        div({ class: 'row mb-3' },
            div({ class: 'col' }, button({
                class: 'btn btn-light border w-100', onclick() {
                    username.val = ''
                    password.val = ''
                    passwordRepeat.val = ''
                }
            }, '清空')),
            div({ class: 'col' }, button({ class: 'btn btn-info w-100' }, '注册')),
        ),
        div({ class: 'text-center' },
            a({
                href: '#/login', onclick() {
                    loginPanel.classList.remove('d-none')
                    registerPanel.classList.add('d-none')
                }
            }, '已有账号？前往登录')
        )
    )
}

const loginPanel = LoginPanel()
const registerPanel = RegisterPanel()