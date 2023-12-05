import van, { State } from 'vanjs-core'
import { apiConfig } from '../config'
import { AjaxRes } from '../util'

const { button, div, img } = van.tags

const bigImageSrc = van.state('')
const smallImageSrcList = [] as State<string>[]
for (let i = 0; i < 6; i++)
    smallImageSrcList.push(van.state(''))

export const Home = () => {
    bigImageSrc.val = 'image/1.jpg'
    loadImageList()
    loadOneWord()
    return div({ 'data-route': 'home' },
        div({ class: 'row position-relative' },
            div({ class: 'col-lg-8 mb-4 mb-lg-0' }, ImageBox(bigImageSrc)),
            div({ class: 'col-lg-4' }, RightPanel()),
        )
    )
}

const RightPanel = () => {
    const SmallImage = (src: State<string>) => div({ class: 'mb-3 col-6 col-sm-4 col-lg-6' },
        img({
            class: 'w-100 rounded-3', role: 'button', src, onclick() {
                bigImageSrc.val = src.val
            }
        })
    )

    return div(
        div({ class: 'row mb-4' },
            div({ class: 'col col-md-6' },
                button({
                    class: 'btn btn-success w-100', onclick() {
                        loadImageList()
                        loadOneWord()
                    }
                }, '再来一组')
            ),
            div({ class: 'col col-md-6' },
                button({ class: 'btn btn-outline-danger w-100' }, '收藏图片'),
            ),
        ),
        div({ class: 'row' },
            smallImageSrcList.map(src => SmallImage(src))
        ),
        div({ class: 'text-muted' }, oneWord)
    )
}

const ImageBox = (src: State<string>) => {
    return img({
        class: 'w-100 rounded-4', src
    })
}

const UserPanel = () => {
    return div({ class: 'card card-body' },
        div({ class: 'py-5 d-flex flex-column align-items-center' },
            img({
                class: 'rounded-circle object-fit-cover mb-4',
                src: 'image/1.jpg',
                style: 'width: 100px; height: 100px;'
            }),
            div(
                button({ class: 'btn btn-outline-primary me-3' }, '我的收藏'),
                button({ class: 'btn btn-outline-info' }, '退出登录')
            ),
        )
    )
}

const xhrForImageList = new XMLHttpRequest()
const loadImageList = () => {
    const xhr = xhrForImageList
    xhr.abort()
    xhr.open('GET', apiConfig.randomImage)
    xhr.send()
    xhr.addEventListener('readystatechange', () => {
        if (xhr.readyState == xhr.DONE && xhr.status == 200) {
            const data = JSON.parse(xhr.responseText) as AjaxRes<{ main: string, list: string[] }>
            bigImageSrc.val = data.data.main
            smallImageSrcList.forEach((src, index) => {
                src.val = data.data.list[index]
            })
        }
    })
}
const xhrForOneWord = new XMLHttpRequest()
const oneWord = van.state('')
const loadOneWord = () => {
    const xhr = xhrForOneWord
    xhr.abort()
    xhr.open('GET', 'https://v1.hitokoto.cn/?c=k&encode=text')
    xhr.send()
    xhr.addEventListener('readystatechange', () => {
        if (xhr.readyState == xhr.DONE && xhr.status == 200) {
            oneWord.val = xhr.responseText
        }
    })
}