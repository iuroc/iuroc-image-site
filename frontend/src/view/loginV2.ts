import van, { State } from 'vanjs-core'
import image0 from '../../img/4e4e70004a6b4db2a3f5d383149d934a_0.png'
import image1 from '../../img/4e4e70004a6b4db2a3f5d383149d934a_1.png'
import image2 from '../../img/4e4e70004a6b4db2a3f5d383149d934a_2.png'
import image3 from '../../img/4e4e70004a6b4db2a3f5d383149d934a_3.png'
import { Carousel } from 'bootstrap'
import { classWithHide } from '../util'

const { button, div, img } = van.tags

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

const writeText = (text: string, time: number = 100) => {
    let index = 0
    setInterval(() => {
        if (index == text.length) {
            element.innerHTML = ''
            index = 0
        } else van.add(element, text[index++])
    }, time)
    const element = div()
    return element
}

const LoginPanel = () => {
    const errorMessage = van.state('1234')
    const hide = van.derive(() => errorMessage.val == '')
    return div(
        div({ class: 'fs-3 mb-3' }, '用户登录'),
        div({ class: 'mb-3 fw-light' },
            '登录后即刻畅享高清美景，轻松收藏心动之作，尽情发现独特美好，定格喜爱瞬间。'
        ),
        div({ ...classWithHide(hide, 'mb-3') }, errorMessage),
        writeText('登录后即刻畅享高清美景，轻松收藏心动之作，尽情发现独特美好，定格喜爱瞬间。', 200)
    )
}

const RegisterPanel = () => {
    return div()
}